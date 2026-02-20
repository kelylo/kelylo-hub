// Configuration for KELYLO PWA

const CONFIG = {
  // ── Local Backend (server.py) ──────────────────────────────────────────────
  // Set USE_LOCAL_BACKEND to true when server.py is running locally.
  // The API key stays hidden on the server — never exposed to the browser.
  USE_LOCAL_BACKEND: false,  // set true only when server.py is running locally
  LOCAL_BACKEND_URL: 'http://localhost:5000/api/gemini',

  // ── Direct Gemini API ──────────────────────────────────────────────────────
  // Used as fallback when USE_LOCAL_BACKEND is false (e.g. deployed to Netlify).
  GEMINI_API_KEY: 'AIzaSyAYiwO3sYxB-96IDle6I7ap8QnYVHk_LOE',
  GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

  // ── AI Features ───────────────────────────────────────────────────────────
  AI_FEATURES: {
    CHAT_ENABLED: true,
    DOCUMENT_ANALYSIS_ENABLED: true,
    SMART_SUGGESTIONS_ENABLED: true,
    LOCAL_FALLBACK: true,
    MAX_TOKENS: 2048,
    TEMPERATURE: 0.7
  },

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 10,
    MAX_REQUESTS_PER_DAY: 200
  },

  // ── Cache ─────────────────────────────────────────────────────────────────
  CACHE_RESPONSES: true,
  CACHE_DURATION_HOURS: 24
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
