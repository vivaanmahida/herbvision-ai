from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from app.database.db import Base


class Herb(Base):
    __tablename__ = "herbs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    common_name = Column(String(200))
    scientific_name = Column(String(200))
    sanskrit_name = Column(String(100))
    hindi_name = Column(String(100))
    gujarati_name = Column(String(100))
    botanical_family = Column(String(100))
    description = Column(Text)
    traditional_uses = Column(JSON)
    plant_parts_used = Column(JSON)
    dosha = Column(JSON)
    cultivation = Column(JSON)
    habitat = Column(Text)
    safety_notes = Column(Text)
    tags = Column(JSON)
    image_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String(500))
    predicted_herb = Column(String(100))
    confidence = Column(Float)
    is_correct = Column(Integer)  # 1 = correct, 0 = incorrect
    suggested_herb = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
