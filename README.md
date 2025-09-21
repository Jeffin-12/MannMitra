<<<<<<< HEAD
# MannMitra
MannMitra is an AI-powered companion that gives young people in India a safe, private, and empathetic space to talk about their feelings. Built with Google Cloud’s Generative AI, it listens without judgment, offers gentle guidance, and provides practical tips for emotional well-being.
=======


### Local Run
This is a lightweight MVP demonstrating an AI-powered anonymous mental wellness companion.

## Prereqs
- Node.js 18+
- npm
- Google Cloud API key with Generative Language API enabled (PaLM). Set `GOOGLE_API_KEY` in backend `.env`.

## Setup Backend
1. cd backend
2. cp .env.example .env and fill GOOGLE_API_KEY, PA I model if needed
3. npm install
4. npm run dev  (or npm start)

Server runs at http://localhost:8080 by default.

## Setup Frontend
1. cd frontend
2. npm install
3. create .env or set REACT_APP_API_URL if backend is remote
4. npm start

Open http://localhost:3000

## Notes
- Conversations are anonymized and stored in backend/db.json (lowdb). For production use encrypted storage and secure key management.
- The PaLM API call format may change — adjust `backend/lib/palm.js` according to your Google Cloud docs.
- Replace the simplistic sentiment heuristic with a proper risk-detection ML model or managed service for real-world usage.
>>>>>>> b6687e18 (Initial commit of the Project)
