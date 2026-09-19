"""POST /api/chat — RAG chatbot endpoint powered by Gemini + ChromaDB."""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.rag.embedder import generate_answer

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


class ChatRequest(BaseModel):
    query: str
    herb_name: str | None = None
    herb_id: int | None = None


@router.post("/chat")
@limiter.limit("30/minute")
async def chat(request: Request, body: ChatRequest):
    if not body.query or not body.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    if len(body.query) > 500:
        raise HTTPException(status_code=400, detail="Query too long. Max 500 characters.")

    # Sanitize input
    query = body.query.strip()
    herb_name = body.herb_name.strip() if body.herb_name else None

    try:
        result = generate_answer(query=query, herb_name=herb_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat generation failed: {str(e)}")

    return {
        "answer": result["answer"],
        "sources": result["sources"],
        "herb_name": result["herb_name"],
        "disclaimer": "For educational purposes only. Not medical advice.",
    }
