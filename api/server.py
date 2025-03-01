import os
from flask import Flask, request, jsonify
import requests
from urllib.parse import quote

app = Flask(__name__)

# API configuration
OPEN_ALEX_BASE_URL = "https://api.openalex.org"
CORE_API_BASE_URL = "https://api.core.ac.uk/v3"
CORE_API_KEY = "KwAZOaeTWLsY6z8NbhDvE17tSH3kJdBU"  # Using the provided key
EMAIL = os.environ.get("EMAIL", "user@example.com")  # For OpenAlex polite pool


# Helper function for OpenAlex API requests
def make_openAlex_request(endpoint, params=None):
    if params is None:
        params = {}

    params["mailto"] = EMAIL
    url = f"{OPEN_ALEX_BASE_URL}/{endpoint}"
    response = requests.get(url, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        return {
            "error": f"OpenAlex API request failed with status code {response.status_code}"
        }


# Helper function for CORE API requests
def make_core_request(endpoint, data=None):
    headers = {
        "Authorization": f"Bearer {CORE_API_KEY}",
        "Content-Type": "application/json",
    }

    url = f"{CORE_API_BASE_URL}/{endpoint}"

    try:
        response = requests.post(url, headers=headers, json=data)

        if response.status_code in [200, 201]:
            return response.json()
        else:
            # Log the error for debugging
            print(f"CORE API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return {
                "error": f"CORE API request failed with status code {response.status_code}",
                "details": response.text,
            }
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}


# Clean CORE works data
def clean_works_data(raw_data):
    cleaned_results = []

    for item in raw_data.get("results", []):
        authors = []
        for author in item.get("authors", []):
            authors.append({"name": author.get("name", "")})

        # Get DOI from identifiers if available
        doi = None
        if "identifiers" in item and "doi" in item["identifiers"]:
            doi = item["identifiers"]["doi"][0] if item["identifiers"]["doi"] else None

        cleaned_item = {
            "id": item.get("id", ""),
            "title": item.get("title", ""),
            "abstract": item.get("abstract", ""),
            "authors": authors,
            "publication_year": item.get("year"),
            "doi": doi,
            "download_url": item.get("downloadUrl"),
            "language": (
                item.get("language", {}).get("name")
                if isinstance(item.get("language"), dict)
                else item.get("language")
            ),
            "publisher": item.get("publisher", ""),
            "subjects": (
                [subject.get("name", "") for subject in item.get("subjects", [])]
                if isinstance(item.get("subjects"), list)
                else []
            ),
            "type": (
                item.get("documentType", {}).get("name", "Unknown")
                if isinstance(item.get("documentType"), dict)
                else item.get("documentType", "Unknown")
            ),
        }
        cleaned_results.append(cleaned_item)

    return {
        "results": cleaned_results,
        "total_count": raw_data.get("totalHits", 0),
        "page": raw_data.get("page", 1),
        "page_size": len(cleaned_results),
        "total_pages": (raw_data.get("totalHits", 0) + 24) // 25,  # Ceiling division
    }


# Clean CORE journals data
def clean_journals_data(raw_data):
    cleaned_results = []

    for item in raw_data.get("results", []):
        # Handle ISSN data safely
        issn_list = []
        if (
            "identifiers" in item
            and "issn" in item["identifiers"]
            and isinstance(item["identifiers"]["issn"], list)
        ):
            issn_list = item["identifiers"]["issn"]

        # Handle subjects safely
        subjects = []
        if "subjects" in item and isinstance(item["subjects"], list):
            subjects = [subject.get("name", "") for subject in item["subjects"]]

        cleaned_item = {
            "id": item.get("id", ""),
            "title": item.get("title", ""),
            "publisher": item.get("publisher", ""),
            "issn": issn_list,
            "subjects": subjects,
            "language": item.get("language", ""),
            "country": item.get("country", ""),
            "url": item.get("url", ""),
        }
        cleaned_results.append(cleaned_item)

    return {
        "results": cleaned_results,
        "total_count": raw_data.get("totalHits", 0),
        "page": raw_data.get("page", 1),
        "page_size": len(cleaned_results),
        "total_pages": (raw_data.get("totalHits", 0) + 24) // 25,  # Ceiling division
    }


# Clean OpenAlex datasets data
def clean_datasets_data(raw_data):
    cleaned_results = []

    for item in raw_data.get("results", []):
        authors = []
        for author in item.get("authorships", []):
            if "author" in author and "display_name" in author["author"]:
                authors.append(
                    {
                        "name": author["author"]["display_name"],
                        "id": author["author"].get("id"),
                    }
                )

        cleaned_item = {
            "id": item.get("id"),
            "title": item.get("title"),
            "abstract": item.get("abstract"),
            "authors": authors,
            "publication_date": item.get("publication_date"),
            "doi": item.get("doi"),
            "url": item.get("primary_location", {}).get("landing_page_url"),
            "concepts": [
                {"name": concept.get("display_name"), "score": concept.get("score")}
                for concept in item.get("concepts", [])[
                    :5
                ]  # Only include top 5 concepts
            ],
        }
        cleaned_results.append(cleaned_item)

    return {
        "results": cleaned_results,
        "total_count": raw_data.get("meta", {}).get("count", 0),
        "page": int(raw_data.get("meta", {}).get("page", 1)),
        "page_size": len(cleaned_results),
        "total_pages": (raw_data.get("meta", {}).get("count", 0) + 24)
        // 25,  # Ceiling division
    }


# Clean OpenAlex concepts data
def clean_concepts_data(raw_data):
    cleaned_results = []

    for item in raw_data.get("results", []):
        cleaned_item = {
            "id": item.get("id"),
            "display_name": item.get("display_name"),
            "level": item.get("level"),
            "wikidata_id": item.get("wikidata"),
        }
        cleaned_results.append(cleaned_item)

    return {"results": cleaned_results}


# Endpoint to get research papers (using CORE API)
@app.route("/api/papers", methods=["GET"])
def get_papers():
    page = int(request.args.get("page", "1"))
    per_page = 25
    search_query = request.args.get("search", "")

    # Using CORE search endpoint with correct structure
    data = {
        "query": search_query if search_query else "*",
        "page": page,
        "pageSize": per_page,
        "scrollId": None,  # Include this explicitly for the first request
    }

    # Add filters only if they're actually needed
    if search_query:
        data["searchType"] = "fulltext"

    result = make_core_request("search/works", data=data)

    # Check if there's an error and return information for debugging
    if "error" in result:
        return jsonify(result)

    # Clean and format the response
    return jsonify(clean_works_data(result))


# Endpoint to get articles (using CORE API for journals)
@app.route("/api/articles", methods=["GET"])
def get_articles():
    page = int(request.args.get("page", "1"))
    per_page = 25
    search_query = request.args.get("search", "")

    # Using CORE journals endpoint with correct structure
    data = {
        "query": search_query if search_query else "*",
        "page": page,
        "pageSize": per_page,
    }

    result = make_core_request("search/journals", data=data)

    # Check if there's an error and return information for debugging
    if "error" in result:
        return jsonify(result)

    # Clean and format the response
    return jsonify(clean_journals_data(result))


# Endpoint to get datasets (using OpenAlex API)
@app.route("/api/datasets", methods=["GET"])
def get_datasets():
    page = request.args.get("page", "1")
    per_page = 25
    search_query = request.args.get("search", "")

    params = {"page": page, "per-page": per_page, "filter": "type:dataset"}

    if search_query:
        params["search"] = search_query

    result = make_openAlex_request("works", params)

    # Clean and format the response
    if "error" not in result:
        return jsonify(clean_datasets_data(result))
    return jsonify(result)


# Endpoint to search concepts with autocomplete (using OpenAlex API)
@app.route("/api/concepts/autocomplete", methods=["GET"])
def autocomplete_concepts():
    query = request.args.get("query", "")

    if not query:
        return jsonify({"results": []})

    # URL encode the query
    encoded_query = quote(query)

    # Use the autocomplete endpoint for concepts
    params = {
        "q": encoded_query,
        "filter": "display_name.search:" + encoded_query,
        "per-page": 5,
    }

    result = make_openAlex_request("concepts", params)

    # Clean and format the response
    if "error" not in result:
        return jsonify(clean_concepts_data(result))
    return jsonify(result)


# Health check endpoint with added debug info
@app.route("/health", methods=["GET"])
def health_check():
    # Test CORE API
    core_status = "unknown"
    core_details = {}
    try:
        test_result = make_core_request(
            "search/works", data={"query": "*", "page": 1, "pageSize": 1}
        )
        if "error" in test_result:
            core_status = "error"
            core_details = test_result
        else:
            core_status = "online"
            core_details = {"totalHits": test_result.get("totalHits", 0)}
    except Exception as e:
        core_status = "error"
        core_details = {"exception": str(e)}

    # Test OpenAlex API
    openalex_status = "unknown"
    try:
        test_result = make_openAlex_request("works", params={"page": 1, "per-page": 1})
        if "error" in test_result:
            openalex_status = "error"
        else:
            openalex_status = "online"
    except Exception as e:
        openalex_status = "error"

    return jsonify(
        {
            "status": "healthy",
            "service": "Research API (CORE + OpenAlex)",
            "apis": {
                "core": core_status,
                "core_details": core_details,
                "openalex": openalex_status,
            },
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
