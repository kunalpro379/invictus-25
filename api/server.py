import os
import json
from typing import List, Dict
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Flask, Blueprint, request, jsonify, make_response
from groq import Groq
import fitz  # PyMuPDF for PDF handling
import nltk
from nltk.tokenize import sent_tokenize
import re
import requests  # Add this at the top with other imports
from flask_cors import CORS  # Add this import at the top

# Download NLTK data for sentence tokenization
nltk.download('punkt', quiet=True)

# Configure upload settings
UPLOAD_FOLDER = 'uploads/papers'
ALLOWED_EXTENSIONS = {'pdf'}
MAX_CONTENT_LENGTH = 32 * 1024 * 1024  # 32MB max file size

# Create upload folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Groq client
client = Groq(api_key="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")

CHATBOT_SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "You are ResearchBuddy, an AI expert in analyzing and discussing research papers. "
        "You provide detailed answers about the research papers that have been uploaded. "
        "Use only information from the papers to answer questions. If a question cannot be answered "
        "based on the provided papers, politely state that the information is not in the papers. "
        "Maintain the context of the previous conversation to provide more relevant and personalized responses."
    )
}

paper_chat_bp = Blueprint("paper_chat", __name__)

# Dictionary to store paper content by session ID
session_papers = {}
conversation_history = {}
MAX_HISTORY = 10

def extract_text_from_pdf(pdf_path):
    """Extract text content from a PDF file."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

def extract_text_from_url(url):
    """Extract text content from a PDF URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Create a temporary file-like object in memory
        pdf_stream = fitz.open(stream=response.content, filetype="pdf")
        text = ""
        for page in pdf_stream:
            text += page.get_text()
        pdf_stream.close()
        return text
    except Exception as e:
        raise Exception(f"Error processing PDF from URL: {str(e)}")

def chunk_paper(text, max_chunk_size=4000, overlap=200):
    """Split paper into manageable chunks with overlap for context preservation."""
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_chunk_size:
            current_chunk += sentence + " "
        else:
            chunks.append(current_chunk)
            # Keep some overlap for context
            overlap_text = " ".join(current_chunk.split()[-overlap:]) if overlap > 0 else ""
            current_chunk = overlap_text + sentence + " "
    
    if current_chunk:
        chunks.append(current_chunk)
    
    return chunks

def preprocess_paper(text):
    """Clean and normalize paper text."""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove page numbers (common in PDFs)
    text = re.sub(r'\s+\d+\s+', ' ', text)
    return text.strip()

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def trim_conversation_history(session_id):
    """Maintain conversation history within limits while preserving context."""
    global conversation_history
    if (session_id in conversation_history and 
        len(conversation_history[session_id]) > (MAX_HISTORY * 2 + 1)):  # +1 for system prompt
        conversation_history[session_id] = [conversation_history[session_id][0], 
                                            *conversation_history[session_id][-(MAX_HISTORY * 2):]]

def get_relevant_paper_content(query, paper_chunks, top_k=3):
    """Retrieve the most relevant chunks based on simple keyword matching."""
    # This is a simple approach - for production, consider using embeddings and semantic search
    query_terms = set(query.lower().split())
    chunk_scores = []
    
    for i, chunk in enumerate(paper_chunks):
        chunk_lower = chunk.lower()
        score = sum(1 for term in query_terms if term in chunk_lower)
        chunk_scores.append((i, score))
    
    # Sort by score in descending order and take top_k
    relevant_indices = [idx for idx, score in sorted(chunk_scores, key=lambda x: x[1], reverse=True)[:top_k]]
    return [paper_chunks[idx] for idx in relevant_indices]

def get_response(session_id, user_input):
    """Get AI response based on paper content and conversation history."""
    global conversation_history
    
    if session_id not in conversation_history:
        conversation_history[session_id] = [CHATBOT_SYSTEM_PROMPT]
    
    if session_id not in session_papers or not session_papers[session_id]:
        return "No research papers have been uploaded for this session. Please upload papers first."
    
    # Get relevant paper chunks for context
    relevant_chunks = []
    for paper_info in session_papers[session_id]:
        paper_chunks = get_relevant_paper_content(user_input, paper_info["chunks"])
        relevant_chunks.extend(paper_chunks)
    
    # Combine relevant chunks into context (with length limit)
    context = "\n\n".join(relevant_chunks)
    if len(context) > 16000:  # Limit context size
        context = context[:16000] + "..."
    
    # Add context to user message
    context_message = {
        "role": "system",
        "content": (
            "The following are excerpts from the uploaded research papers that may be relevant "
            f"to the user's question:\n\n{context}\n\n"
            "Use this information to answer the user's question. If the information is not in "
            "these excerpts, politely state that you cannot find this information in the papers."
        )
    }
    
    conversation_history[session_id].append(context_message)
    conversation_history[session_id].append({"role": "user", "content": user_input})
    trim_conversation_history(session_id)

    try:
        completion = client.chat.completions.create(
            model="deepseek-r1-chat",  # Using the Deepseek model via Groq
            messages=conversation_history[session_id],
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
        )

        response_text = completion.choices[0].message.content
        # Remove the context message for cleaner history
        conversation_history[session_id].remove(context_message)
        conversation_history[session_id].append({"role": "assistant", "content": response_text})
        return response_text
    
    except Exception as e:
        # Remove the context message in case of error
        conversation_history[session_id].remove(context_message)
        return f"Error getting response: {str(e)}"

@paper_chat_bp.route("/upload_paper", methods=["POST"])
def upload_paper():
    """Flask route to handle research paper uploads from URL."""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No JSON data received"}), 400
    
    pdf_url = data.get('url')
    if not pdf_url:
        return jsonify({"error": "No PDF URL provided"}), 400
    
    session_id = data.get('session_id')
    if not session_id:
        return jsonify({"error": "Session ID is required"}), 400
    
    try:
        # Extract filename from URL
        filename = pdf_url.split('/')[-1]
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Process the paper directly from URL
        paper_text = extract_text_from_url(pdf_url)
        processed_text = preprocess_paper(paper_text)
        paper_chunks = chunk_paper(processed_text)
        
        # Initialize session if needed
        if session_id not in session_papers:
            session_papers[session_id] = []
            conversation_history[session_id] = [CHATBOT_SYSTEM_PROMPT]
        
        # Store paper information
        paper_info = {
            "filename": filename,
            "upload_time": timestamp,
            "chunks": paper_chunks,
            "url": pdf_url
        }
        
        # Add paper to session
        session_papers[session_id].append(paper_info)
        
        print(f"Added paper to session {session_id}. Total papers: {len(session_papers[session_id])}")
        
        return jsonify({
            "success": True,
            "message": f"Paper '{filename}' processed successfully from URL",
            "paper_id": len(session_papers[session_id]) - 1,
            "session_papers_count": len(session_papers[session_id])
        })
        
    except Exception as e:
        print(f"Error processing paper: {str(e)}")
        return jsonify({"error": f"Error processing paper from URL: {str(e)}"}), 500

@paper_chat_bp.route("/chat", methods=["POST"])
def chat():
    """Flask route to handle chatbot conversation."""
    data = request.json
    user_input = data.get("message", "").strip()
    session_id = data.get("session_id")
    
    if not session_id:
        return jsonify({"error": "Session ID is required"}), 400
    
    if not user_input:
        return jsonify({"error": "Message cannot be empty"}), 400
    
    response_text = get_response(session_id, user_input)
    return jsonify({"response": response_text})

@paper_chat_bp.route("/list_papers", methods=["GET"])
def list_papers():
    """Flask route to list all papers uploaded in a session."""
    session_id = request.args.get('session_id')
    
    if not session_id:
        return jsonify({"error": "Session ID is required"}), 400
    
    if session_id not in session_papers:
        return jsonify({"papers": []})
    
    papers = [
        {
            "paper_id": i,
            "filename": paper_info["filename"],
            "upload_time": paper_info["upload_time"]
        }
        for i, paper_info in enumerate(session_papers[session_id])
    ]
    
    return jsonify({"papers": papers})

@paper_chat_bp.route("/clear_session", methods=["POST"])
def clear_session():
    """Flask route to clear all papers and conversation history for a session."""
    data = request.json
    session_id = data.get("session_id")
    
    if not session_id:
        return jsonify({"error": "Session ID is required"}), 400
    
    if session_id in session_papers:
        del session_papers[session_id]
    
    if session_id in conversation_history:
        del conversation_history[session_id]
    
    return jsonify({"success": True, "message": "Session cleared successfully"})

# Error handler for file too large
@paper_chat_bp.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File is too large'}), 413

# Create Flask application
def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
    app.register_blueprint(paper_chat_bp, url_prefix='/api')
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)