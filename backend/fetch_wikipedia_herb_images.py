import json
import urllib.request
from pathlib import Path

# Scientific / Wikipedia page titles for exact botanical plant match
HERB_WIKI_PAGES = {
    1: "Ocimum_tenuiflorum",       # Tulsi
    2: "Azadirachta_indica",       # Neem
    3: "Withania_somnifera",       # Ashwagandha
    4: "Curcuma_longa",            # Turmeric
    5: "Ginger",                   # Ginger
    6: "Phyllanthus_emblica",      # Amla
    7: "Bacopa_monnieri",          # Brahmi
    8: "Asparagus_racemosus",      # Shatavari
    9: "Terminalia_chebula",       # Haritaki
    10: "Tinospora_cordifolia",    # Giloy
    11: "Aloe_vera",               # Aloe Vera
    12: "Moringa_oleifera",        # Moringa
    13: "Trigonella_foenum-graecum", # Fenugreek
    14: "Glycyrrhiza_glabra",      # Licorice
    15: "Peppermint",              # Peppermint
    16: "Cardamom",                # Cardamom
    17: "Black_pepper",            # Black Pepper
    18: "Cumin",                   # Cumin
    19: "Coriander",               # Coriander
    20: "Hibiscus_rosa-sinensis",   # Hibiscus
}

output_dir = Path("../frontend/public/images/herbs")
output_dir.mkdir(parents=True, exist_ok=True)

headers = {
    "User-Agent": "HerbVisionAI/1.0 (Educational Herb Identification App; contact@herbvision.ai)"
}

downloaded_urls = {}

for herb_id, wiki_title in HERB_WIKI_PAGES.items():
    api_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{wiki_title}"
    save_path = output_dir / f"{herb_id}.jpg"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            img_url = data.get("originalimage", {}).get("source") or data.get("thumbnail", {}).get("source")
            
            if img_url:
                img_req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(img_req, timeout=10) as img_resp, open(save_path, "wb") as f:
                    f.write(img_resp.read())
                print(f"[OK] Herb {herb_id} ({wiki_title}) downloaded -> {save_path.name}")
                downloaded_urls[herb_id] = f"/images/herbs/{herb_id}.jpg"
            else:
                print(f"[WARN] No image found for {wiki_title}")
    except Exception as e:
        print(f"[ERROR] Herb {herb_id} ({wiki_title}) failed: {e}")

print(f"\nSuccessfully downloaded {len(downloaded_urls)} authentic plant images!")

# Now update herbs.json and SQLite database to point to local authentic images /images/herbs/<id>.jpg
json_path = Path("app/data/herbs.json")
if json_path.exists():
    with open(json_path, "r", encoding="utf-8") as f:
        herbs_data = json.load(f)
    for herb in herbs_data:
        hid = herb["id"]
        if hid in downloaded_urls:
            herb["image_url"] = downloaded_urls[hid]
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(herbs_data, f, indent=2)
    print("[OK] Updated app/data/herbs.json to use local authentic image paths.")
