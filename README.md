# 🌿 HerbVision AI

> AI-powered Ayurvedic medicinal herb identification and knowledge assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![CLIP](https://img.shields.io/badge/Model-CLIP--ViT--B32-orange)](https://huggingface.co/openai/clip-vit-base-patch32)
[![ChromaDB](https://img.shields.io/badge/RAG-ChromaDB-purple)](https://www.trychroma.com)

---

## 📋 Overview

HerbVision AI identifies Ayurvedic medicinal herbs from uploaded images using:
- **CLIP zero-shot classification** (openai/clip-vit-base-patch32 via HuggingFace)
- **Grad-CAM heatmap** visualization (explainable AI)
- **RAG chatbot** powered by ChromaDB + Gemini 1.5 Flash
- **Voice search** using Web Speech API
- Knowledge base of **20 Ayurvedic herbs** with comprehensive data

> ⚠️ **For educational purposes only.** Not medical advice.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### 1. Clone & Setup

```bash
git clone <repo-url>
cd herbvision-ai
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> **Note:** First startup downloads the CLIP model (~600MB) and sentence-transformer model. This may take a few minutes.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done if you ran npm install)
npm install

# Configure environment (optional)
echo "VITE_API_URL=" > .env.local

# Start dev server
npm run dev
```

Open http://localhost:5173

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for RAG chatbot |
| `DATABASE_URL` | No | SQLite path (default: `sqlite+aiosqlite:///./herbvision.db`) |
| `CHROMA_PERSIST_DIR` | No | ChromaDB storage dir (default: `./chroma_db`) |
| `MODEL_CACHE_DIR` | No | HuggingFace model cache (default: `./model_cache`) |
| `CORS_ORIGINS` | No | Allowed origins (default: `http://localhost:5173`) |

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (leave empty to use Vite proxy) |

---

## 🏗️ Architecture

```
herbvision-ai/
├── frontend/          # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/   # UI components
│       └── pages/        # Route pages
└── backend/           # FastAPI + Python
    └── app/
        ├── routes/    # API endpoints
        ├── models/    # CLIP classifier + Grad-CAM
        ├── rag/       # ChromaDB + Gemini RAG
        ├── database/  # SQLAlchemy + SQLite
        └── data/      # Herb knowledge base JSON
```

## 🌿 Herb Knowledge Base

20 Ayurvedic herbs included:
Tulsi, Neem, Ashwagandha, Turmeric, Ginger, Amla, Brahmi, Shatavari, Haritaki, Giloy, Aloe Vera, Moringa, Fenugreek, Licorice, Peppermint, Cardamom, Black Pepper, Cumin, Coriander, Hibiscus

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict` | POST | Upload image → herb prediction + Grad-CAM |
| `/api/herb/{id}` | GET | Get herb information by ID |
| `/api/herbs` | GET | List all herbs |
| `/api/chat` | POST | RAG chatbot query |
| `/api/feedback` | POST | Submit prediction feedback |
| `/health` | GET | Health check |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS 3 |
| Animations | Framer Motion |
| Backend | FastAPI + Uvicorn |
| ML Classifier | CLIP (openai/clip-vit-base-patch32) |
| Explainability | OpenCV Grad-CAM simulation |
| RAG | ChromaDB + sentence-transformers |
| LLM | Google Gemini 1.5 Flash |
| Database | SQLite / SQLAlchemy (PostgreSQL-ready) |
| Voice | Web Speech API |

---

## 🔒 Security Notes

- File type + size validation on all uploads
- Rate limiting (20 req/min predict, 30 req/min chat)
- Input sanitization on all endpoints
- API keys via environment variables only
- No personal data stored

---

*HerbVision AI is for educational purposes only. Always consult a qualified Ayurvedic practitioner.*
