"""
RAG Knowledge Base: Loads herb data and builds ChromaDB vector store.
"""
import json
import os
from pathlib import Path

_herbs_data = None


def load_herbs_json() -> list[dict]:
    global _herbs_data
    if _herbs_data is not None:
        return _herbs_data
    data_path = Path(__file__).parent.parent / "data" / "herbs.json"
    with open(data_path, "r", encoding="utf-8") as f:
        _herbs_data = json.load(f)
    return _herbs_data


def build_herb_documents() -> list[dict]:
    """Convert herb records into text chunks for embedding."""
    herbs = load_herbs_json()
    documents = []
    for herb in herbs:
        # Main description chunk
        doc_text = f"""Herb: {herb['name']} ({herb.get('scientific_name', '')})
Sanskrit: {herb.get('sanskrit_name', '')} | Hindi: {herb.get('hindi_name', '')} | Gujarati: {herb.get('gujarati_name', '')}
Family: {herb.get('botanical_family', '')}
Description: {herb.get('description', '')}
Traditional Ayurvedic Uses: {', '.join(herb.get('traditional_uses', []))}
Plant Parts Used: {', '.join(herb.get('plant_parts_used', []))}
Habitat: {herb.get('habitat', '')}
Safety Notes: {herb.get('safety_notes', '')}
Tags: {', '.join(herb.get('tags', []))}"""

        dosha = herb.get('dosha', {})
        doc_text += f"""
Dosha Information:
  Balances: {', '.join(dosha.get('balances', []))}
  May Aggravate: {', '.join(dosha.get('may_aggravate', []))}
  Rasa (Taste): {dosha.get('rasa', '')}
  Virya (Potency): {dosha.get('virya', '')}
  Vipaka (Post-digestive): {dosha.get('vipaka', '')}"""

        cultivation = herb.get('cultivation', {})
        doc_text += f"""
Cultivation:
  Climate: {cultivation.get('climate', '')}
  Soil: {cultivation.get('soil', '')}
  Watering: {cultivation.get('watering', '')}
  Sunlight: {cultivation.get('sunlight', '')}
  Propagation: {cultivation.get('propagation', '')}
  Harvesting: {cultivation.get('harvesting', '')}"""

        documents.append({
            "id": f"herb_{herb['id']}",
            "text": doc_text,
            "metadata": {
                "herb_id": herb["id"],
                "herb_name": herb["name"],
                "scientific_name": herb.get("scientific_name", ""),
            }
        })
    return documents
