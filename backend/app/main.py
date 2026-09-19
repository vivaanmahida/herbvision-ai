import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.routes import predict, herb, chat, feedback
from app.database.db import init_db

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="HerbVision AI API",
    description="AI-powered Ayurvedic medicinal herb identification and knowledge assistant",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(herb.router, prefix="/api", tags=["Herb Info"])
app.include_router(chat.router, prefix="/api", tags=["RAG Chatbot"])
app.include_router(feedback.router, prefix="/api", tags=["Feedback"])


@app.on_event("startup")
async def startup():
    await init_db()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "HerbVision AI"}
