"""
KELYLO Local API Server
Proxies requests to the Gemini API so the API key stays server-side.

Usage:
  Windows:  venv\\Scripts\\python.exe server.py
  Mac/Linux: venv/bin/python server.py

Then open index.html in your browser (or use Live Server at http://localhost:5500).
The frontend will call http://localhost:5000/api/gemini instead of Gemini directly.
"""

import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = Flask(__name__)

# Allow requests from any local origin (Live Server, file://, etc.)
CORS(app, origins=[
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "null",           # file:// origin
])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


@app.route("/api/gemini", methods=["POST"])
def gemini_proxy():
    """
    Transparent proxy to Gemini API.
    Accepts the same request body the frontend would send to Gemini directly,
    but adds the API key on the server side.
    """
    if not GEMINI_API_KEY:
        return jsonify({"error": "GEMINI_API_KEY not set in .env"}), 500

    body = request.get_json(force=True)
    if not body:
        return jsonify({"error": "Empty request body"}), 400

    try:
        response = requests.post(
            GEMINI_ENDPOINT,
            params={"key": GEMINI_API_KEY},
            json=body,
            timeout=30,
        )
        return jsonify(response.json()), response.status_code

    except requests.exceptions.Timeout:
        return jsonify({"error": {"message": "Gemini API request timed out"}}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": {"message": str(e)}}), 502


@app.route("/api/health", methods=["GET"])
def health():
    """Quick health check — confirms the server is running."""
    return jsonify({
        "status": "ok",
        "api_key_set": bool(GEMINI_API_KEY),
        "model": "gemini-1.5-flash"
    })


if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    print(f"\n  KELYLO Local API Server")
    print(f"  Running at: http://localhost:{port}")
    print(f"  Health check: http://localhost:{port}/api/health")
    print(f"  API key loaded: {'YES' if GEMINI_API_KEY else 'NO — check your .env file'}")
    print(f"\n  Open your PWA at http://localhost:5500 (Live Server)")
    print(f"  or use: venv\\Scripts\\python.exe -m http.server 8080\n")

    app.run(host="0.0.0.0", port=port, debug=debug)
