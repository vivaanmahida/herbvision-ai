"""POST /api/feedback — User feedback on herb predictions."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_db
from app.database.models import Feedback

router = APIRouter()


class FeedbackRequest(BaseModel):
    predicted_herb: str
    confidence: float
    is_correct: bool
    suggested_herb: str | None = None
    image_path: str | None = None


@router.post("/feedback")
async def submit_feedback(body: FeedbackRequest, db: AsyncSession = Depends(get_db)):
    if not body.predicted_herb:
        raise HTTPException(status_code=400, detail="predicted_herb is required.")

    feedback = Feedback(
        predicted_herb=body.predicted_herb.strip(),
        confidence=body.confidence,
        is_correct=1 if body.is_correct else 0,
        suggested_herb=body.suggested_herb.strip() if body.suggested_herb else None,
        image_path=body.image_path,
    )
    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)

    return {
        "success": True,
        "message": "Thank you for your feedback! It helps improve HerbVision AI.",
        "feedback_id": feedback.id,
    }
