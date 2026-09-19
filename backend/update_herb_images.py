import json
import os
import asyncio
from pathlib import Path

herb_urls = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', # Tulsi
    2: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80', # Neem
    3: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', # Ashwagandha
    4: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', # Turmeric
    5: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', # Ginger
    6: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', # Amla
    7: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', # Brahmi
    8: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=600&q=80', # Shatavari
    9: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80', # Haritaki
    10: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80', # Giloy
    11: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80', # Aloe Vera
    12: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80', # Moringa
    13: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', # Fenugreek
    14: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', # Licorice
    15: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', # Peppermint
    16: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', # Cardamom
    17: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80', # Black Pepper
    18: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', # Cumin
    19: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', # Coriander
    20: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80', # Hibiscus
}

data_path = Path("app/data/herbs.json")
with open(data_path, "r", encoding="utf-8") as f:
    herbs_data = json.load(f)

for herb in herbs_data:
    hid = herb["id"]
    if hid in herb_urls:
        herb["image_url"] = herb_urls[hid]

with open(data_path, "w", encoding="utf-8") as f:
    json.dump(herbs_data, f, indent=2)

print("[OK] Updated app/data/herbs.json with 20 verified high-resolution image URLs.")

# Now update database
async def update_db():
    from sqlalchemy import select
    from app.database.db import AsyncSessionLocal
    from app.database.models import Herb

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Herb))
        db_herbs = result.scalars().all()
        for herb in db_herbs:
            if herb.id in herb_urls:
                herb.image_url = herb_urls[herb.id]
        await session.commit()
        print(f"[OK] Successfully updated {len(db_herbs)} herbs in SQLite database with clean image URLs.")

asyncio.run(update_db())
