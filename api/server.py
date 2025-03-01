import os
import requests
from flask import Flask, request, jsonify
from urllib.parse import quote
import time

app = Flask(__name__)

# OpenAlex API base URL
OPENALEX_API_BASE = "https://api.openalex.org/v1"

# Map of resource types
RESOURCE_TYPES = {"papers": "works", "articles": "works", "datasets": "works"}

# Cache for concept IDs to avoid repeated API calls
concept_cache = {}


def get_concept_id(field):
    """
    Get OpenAlex concept ID for a given field by searching the concepts endpoint
    """
    # Check cache first
    if field in concept_cache:
        return concept_cache[field]

    # Search for the concept using the OpenAlex API
    search_url = f"{OPENALEX_API_BASE}/concepts"
    params = {"search": field, "per_page": 1}  # We only need the top match

    # Add email for polite pool if configured
    if os.environ.get("OPENALEX_EMAIL"):
        params["email"] = os.environ.get("OPENALEX_EMAIL")

    try:
        response = requests.get(search_url, params=params)
        response.raise_for_status()

        data = response.json()

        if data["meta"]["count"] > 0:
            concept_id = data["results"][0]["id"]
            concept_name = data["results"][0]["display_name"]

            # Store in cache
            concept_cache[field] = {"id": concept_id, "name": concept_name}

            return {"id": concept_id, "name": concept_name}
        else:
            return None

    except requests.exceptions.RequestException:
        return None


@app.route("/api/<resource_type>", methods=["GET"])
def get_resources(resource_type):
    """
    Get resources (papers, articles, datasets) based on fields or search query

    Endpoints:
    - /api/papers?fields=math,physics,ai
    - /api/articles?fields=bio
    - /api/datasets?fields=ml,nlp,python,math,computer vision,physics
    - /api/papers?search=how to find the laplacian inverse
    """

    if resource_type not in RESOURCE_TYPES:
        return (
            jsonify(
                {
                    "error": f"Invalid resource type: {resource_type}. Use one of: papers, articles, datasets"
                }
            ),
            400,
        )

    openalex_resource = RESOURCE_TYPES[resource_type]

    # Build the OpenAlex API URL based on query parameters
    api_url = f"{OPENALEX_API_BASE}/{openalex_resource}"

    # Set up query parameters for OpenAlex API
    params = {"per_page": 25}

    # Add email for polite pool if configured
    if os.environ.get("OPENALEX_EMAIL"):
        params["email"] = os.environ.get("OPENALEX_EMAIL")

    # Handle fields parameter
    fields = request.args.get("fields")
    search_query = request.args.get("search")

    filter_parts = []

    # For datasets, add a type filter
    if resource_type == "datasets":
        filter_parts.append("type:dataset")

    # Process fields if provided
    missing_fields = []
    resolved_concepts = []

    if fields:
        field_list = [f.strip() for f in fields.split(",")]
        concept_ids = []

        for field in field_list:
            # Get concept ID for the field
            concept = get_concept_id(field)

            if concept:
                concept_ids.append(concept["id"])
                resolved_concepts.append(
                    {
                        "field": field,
                        "concept_name": concept["name"],
                        "concept_id": concept["id"],
                    }
                )
            else:
                missing_fields.append(field)

        if concept_ids:
            # Add concept.id filter for each field (using OR logic)
            concept_filter = " | ".join([f"concept.id:{cid}" for cid in concept_ids])
            filter_parts.append(f"({concept_filter})")

    # Combine all filters with AND logic
    if filter_parts:
        params["filter"] = ",".join(filter_parts)

    # Handle search parameter
    if search_query:
        params["search"] = search_query

    # If neither fields nor search are provided, return an error
    if not fields and not search_query:
        return (
            jsonify({"error": "Please provide either 'fields' or 'search' parameter"}),
            400,
        )

    # If all fields were invalid, return an error
    if fields and not resolved_concepts and not search_query:
        return (
            jsonify(
                {"error": f"Could not find any matching concepts for fields: {fields}"}
            ),
            400,
        )

    try:
        # Make request to OpenAlex API
        response = requests.get(api_url, params=params)
        response.raise_for_status()

        data = response.json()

        # Process the response to return a simplified version
        results = []
        for item in data.get("results", []):
            processed_item = {
                "id": item.get("id"),
                "title": item.get("title"),
                "type": item.get("type"),
                "publication_date": item.get("publication_date"),
                "open_access": item.get("open_access", {}).get("is_oa", False),
                "url": item.get("doi") if item.get("doi") else item.get("id"),
                "authors": [
                    author.get("author", {}).get("display_name")
                    for author in item.get("authorships", [])[:3]
                ],
                "concepts": [
                    {"name": concept.get("display_name"), "score": concept.get("score")}
                    for concept in item.get("concepts", [])[:5]
                ],
            }

            # Add abstract if available
            if item.get("abstract_inverted_index"):
                # Convert inverted index to text (simplified approach)
                abstract_words = []
                for word, positions in item.get("abstract_inverted_index", {}).items():
                    for pos in positions:
                        while len(abstract_words) <= pos:
                            abstract_words.append("")
                        abstract_words[pos] = word
                processed_item["abstract"] = " ".join(abstract_words)

            results.append(processed_item)

        return jsonify(
            {
                "results": results,
                "meta": {
                    "count": data.get("meta", {}).get("count", 0),
                    "page": data.get("meta", {}).get("page", 1),
                    "per_page": data.get("meta", {}).get("per_page", 25),
                    "total_pages": data.get("meta", {}).get("count", 0)
                    // data.get("meta", {}).get("per_page", 25)
                    + 1,
                },
                "query_info": {
                    "resolved_concepts": resolved_concepts,
                    "unmatched_fields": missing_fields,
                },
            }
        )

    except requests.exceptions.RequestException as e:
        return (
            jsonify({"error": f"Error fetching data from OpenAlex API: {str(e)}"}),
            500,
        )


@app.route("/api/fields/suggest", methods=["GET"])
def suggest_fields():
    """
    Suggest concepts/fields based on a query string

    Endpoint:
    - /api/fields/suggest?q=machine
    """
    query = request.args.get("q", "")

    if not query or len(query) < 2:
        return (
            jsonify(
                {
                    "error": "Please provide a query parameter 'q' with at least 2 characters"
                }
            ),
            400,
        )

    # Build the OpenAlex API URL for concepts
    api_url = f"{OPENALEX_API_BASE}/concepts"

    # Set up query parameters for OpenAlex API
    params = {"search": query, "per_page": 10}

    # Add email for polite pool if configured
    if os.environ.get("OPENALEX_EMAIL"):
        params["email"] = os.environ.get("OPENALEX_EMAIL")

    try:
        # Make request to OpenAlex API
        response = requests.get(api_url, params=params)
        response.raise_for_status()

        data = response.json()

        suggestions = []
        for concept in data.get("results", []):
            suggestions.append(
                {
                    "id": concept.get("id"),
                    "name": concept.get("display_name"),
                    "level": concept.get("level"),
                    "works_count": concept.get("works_count"),
                    "wikidata": concept.get("wikidata"),
                }
            )

            # Update our cache
            concept_cache[concept.get("display_name").lower()] = {
                "id": concept.get("id"),
                "name": concept.get("display_name"),
            }

        return jsonify(
            {"suggestions": suggestions, "query": query, "count": len(suggestions)}
        )

    except requests.exceptions.RequestException as e:
        return (
            jsonify({"error": f"Error fetching data from OpenAlex API: {str(e)}"}),
            500,
        )


@app.route("/", methods=["GET"])
def home():
    """API documentation endpoint"""
    docs = {
        "name": "OpenAlex Research API",
        "description": "API for searching research papers, articles, and datasets using OpenAlex",
        "endpoints": [
            {
                "path": "/api/papers",
                "method": "GET",
                "description": "Search for research papers",
                "parameters": [
                    {
                        "name": "fields",
                        "type": "string",
                        "description": "Comma-separated list of fields (e.g., math,physics,ai)",
                    },
                    {
                        "name": "search",
                        "type": "string",
                        "description": "Global search query",
                    },
                ],
                "example": "/api/papers?fields=math,physics",
            },
            {
                "path": "/api/articles",
                "method": "GET",
                "description": "Search for articles",
                "parameters": [
                    {
                        "name": "fields",
                        "type": "string",
                        "description": "Comma-separated list of fields (e.g., bio)",
                    },
                    {
                        "name": "search",
                        "type": "string",
                        "description": "Global search query",
                    },
                ],
                "example": "/api/articles?search=machine learning",
            },
            {
                "path": "/api/datasets",
                "method": "GET",
                "description": "Search for datasets",
                "parameters": [
                    {
                        "name": "fields",
                        "type": "string",
                        "description": "Comma-separated list of fields (e.g., ml,nlp)",
                    },
                    {
                        "name": "search",
                        "type": "string",
                        "description": "Global search query",
                    },
                ],
                "example": "/api/datasets?fields=ml,nlp",
            },
            {
                "path": "/api/fields/suggest",
                "method": "GET",
                "description": "Get field/concept suggestions based on a query",
                "parameters": [
                    {
                        "name": "q",
                        "type": "string",
                        "description": "Search query for field suggestions",
                    }
                ],
                "example": "/api/fields/suggest?q=machine",
            },
        ],
    }

    return jsonify(docs)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
