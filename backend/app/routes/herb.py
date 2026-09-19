"""GET /api/herb/{id} and /api/herbs — Herb information endpoints."""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.db import get_db
from app.database.models import Herb

router = APIRouter()


@router.get("/herbs")
async def list_herbs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Herb).order_by(Herb.id))
    herbs = result.scalars().all()
    return [_herb_to_dict(h) for h in herbs]


@router.get("/herb/{herb_id}")
async def get_herb(herb_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Herb).where(Herb.id == herb_id))
    herb = result.scalars().first()
    if not herb:
        raise HTTPException(status_code=404, detail=f"Herb with id {herb_id} not found.")
    return _herb_to_dict(herb)


@router.get("/herb/name/{herb_name}")
async def get_herb_by_name(herb_name: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Herb).where(Herb.name.ilike(f"%{herb_name}%"))
    )
    herb = result.scalars().first()
    if not herb:
        raise HTTPException(status_code=404, detail=f"Herb '{herb_name}' not found.")
    return _herb_to_dict(herb)


def _herb_to_dict(herb: Herb) -> dict:
    return {
        "id": herb.id,
        "name": herb.name,
        "common_name": herb.common_name,
        "scientific_name": herb.scientific_name,
        "sanskrit_name": herb.sanskrit_name,
        "hindi_name": herb.hindi_name,
        "gujarati_name": herb.gujarati_name,
        "botanical_family": herb.botanical_family,
        "description": herb.description,
        "traditional_uses": herb.traditional_uses or [],
        "plant_parts_used": herb.plant_parts_used or [],
        "dosha": herb.dosha or {},
        "cultivation": herb.cultivation or {},
        "habitat": herb.habitat,
        "safety_notes": herb.safety_notes,
        "tags": herb.tags or [],
        "image_url": herb.image_url,
    }
