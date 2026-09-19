import json
import os
from pathlib import Path
from sqlalchemy import select
from app.database.db import AsyncSessionLocal
from app.database.models import Herb


async def seed_herbs():
    """Seed the database with herb data from herbs.json if not already seeded."""
    data_path = Path(__file__).parent.parent / "data" / "herbs.json"
    if not data_path.exists():
        print("herbs.json not found, skipping seed.")
        return

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Herb).limit(1))
        existing = result.scalars().first()
        if existing:
            print(f"Database already seeded with herbs.")
            return

        with open(data_path, "r", encoding="utf-8") as f:
            herbs_data = json.load(f)

        for herb_data in herbs_data:
            herb = Herb(
                id=herb_data["id"],
                name=herb_data["name"],
                common_name=herb_data.get("common_name"),
                scientific_name=herb_data.get("scientific_name"),
                sanskrit_name=herb_data.get("sanskrit_name"),
                hindi_name=herb_data.get("hindi_name"),
                gujarati_name=herb_data.get("gujarati_name"),
                botanical_family=herb_data.get("botanical_family"),
                description=herb_data.get("description"),
                traditional_uses=herb_data.get("traditional_uses", []),
                plant_parts_used=herb_data.get("plant_parts_used", []),
                dosha=herb_data.get("dosha", {}),
                cultivation=herb_data.get("cultivation", {}),
                habitat=herb_data.get("habitat"),
                safety_notes=herb_data.get("safety_notes"),
                tags=herb_data.get("tags", []),
                image_url=herb_data.get("image_url"),
            )
            session.add(herb)

        await session.commit()
        print(f"Seeded {len(herbs_data)} herbs into the database.")
