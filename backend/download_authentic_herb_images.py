import os
import urllib.request
import json
from pathlib import Path

# Direct Wikipedia / Wikimedia original image URLs for exact botanical accuracy
ORIGINAL_HERB_IMAGES = {
    1: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Ocimum_tenuiflorum3.jpg/640px-Ocimum_tenuiflorum3.jpg", # Tulsi
    2: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0218.jpg/640px-Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0218.jpg", # Neem
    3: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Withania_somnifera1.jpg/640px-Withania_somnifera1.jpg", # Ashwagandha
    4: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Curcuma_longa_roots.jpg/640px-Curcuma_longa_roots.jpg", # Turmeric
    5: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Ginger_Root.jpg/640px-Ginger_Root.jpg", # Ginger
    6: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Phyllanthus_emblica_fruit.jpg/640px-Phyllanthus_emblica_fruit.jpg", # Amla
    7: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Bacopa_monnieri.jpg/640px-Bacopa_monnieri.jpg", # Brahmi
    8: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Asparagus_racemosus_plant.jpg/640px-Asparagus_racemosus_plant.jpg", # Shatavari
    9: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Terminalia_chebula_fruit.jpg/640px-Terminalia_chebula_fruit.jpg", # Haritaki
    10: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Tinospora_cordifolia_leaves.jpg/640px-Tinospora_cordifolia_leaves.jpg", # Giloy
    11: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aloe_vera_flower_inset.jpg/640px-Aloe_vera_flower_inset.jpg", # Aloe Vera
    12: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Moringa_oleifera_leaves.jpg/640px-Moringa_oleifera_leaves.jpg", # Moringa
    13: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Trigonella_foenum-graecum_plant.jpg/640px-Trigonella_foenum-graecum_plant.jpg", # Fenugreek
    14: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Glycyrrhiza_glabra_plant.jpg/640px-Glycyrrhiza_glabra_plant.jpg", # Licorice
    15: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Mentha_x_piperita_peppermint.jpg/640px-Mentha_x_piperita_peppermint.jpg", # Peppermint
    16: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Elettaria_cardamomum_pods.jpg/640px-Elettaria_cardamomum_pods.jpg", # Cardamom
    17: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Piper_nigrum_fruit.jpg/640px-Piper_nigrum_fruit.jpg", # Black Pepper
    18: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cuminum_cyminum_plant.jpg/640px-Cuminum_cyminum_plant.jpg", # Cumin
    19: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coriandrum_sativum_cilantro.jpg/640px-Coriandrum_sativum_cilantro.jpg", # Coriander
    20: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Hibiscus_rosa-sinensis_red_flower.jpg/640px-Hibiscus_rosa-sinensis_red_flower.jpg", # Hibiscus
}

# Fallback direct image URLs from Wikimedia / Commons API if thumb size fails
FALLBACK_HERB_IMAGES = {
    1: "https://upload.wikimedia.org/wikipedia/commons/8/88/Ocimum_tenuiflorum3.jpg",
    2: "https://upload.wikimedia.org/wikipedia/commons/6/65/Azadirachta_indica_%28Neem%29_in_Hyderabad%2C_AP_W_IMG_0218.jpg",
    3: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Withania_somnifera1.jpg",
    4: "https://upload.wikimedia.org/wikipedia/commons/5/52/Curcuma_longa_roots.jpg",
    5: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Ginger_Root.jpg",
    6: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Phyllanthus_emblica_fruit.jpg",
    7: "https://upload.wikimedia.org/wikipedia/commons/6/62/Bacopa_monnieri.jpg",
    8: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Asparagus_racemosus_plant.jpg",
    9: "https://upload.wikimedia.org/wikipedia/commons/5/54/Terminalia_chebula_fruit.jpg",
    10: "https://upload.wikimedia.org/wikipedia/commons/d/da/Tinospora_cordifolia_leaves.jpg",
    11: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Aloe_vera_flower_inset.jpg",
    12: "https://upload.wikimedia.org/wikipedia/commons/8/88/Moringa_oleifera_leaves.jpg",
    13: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Trigonella_foenum-graecum_plant.jpg",
    14: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Glycyrrhiza_glabra_plant.jpg",
    15: "https://upload.wikimedia.org/wikipedia/commons/5/55/Mentha_x_piperita_peppermint.jpg",
    16: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Elettaria_cardamomum_pods.jpg",
    17: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Piper_nigrum_fruit.jpg",
    18: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Cuminum_cyminum_plant.jpg",
    19: "https://upload.wikimedia.org/wikipedia/commons/0/05/Coriandrum_sativum_cilantro.jpg",
    20: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Hibiscus_rosa-sinensis_red_flower.jpg",
}

output_dir = Path("../frontend/public/images/herbs")
output_dir.mkdir(parents=True, exist_ok=True)

headers = {
    'User-Agent': 'HerbVisionAI/1.0 (Ayurvedic Herb Identification Educational App; contact@herbvision.ai)'
}

for herb_id in range(1, 21):
    save_path = output_dir / f"{herb_id}.jpg"
    url = ORIGINAL_HERB_IMAGES.get(herb_id)
    fallback_url = FALLBACK_HERB_IMAGES.get(herb_id)

    downloaded = False
    for try_url in [url, fallback_url]:
        if not try_url:
            continue
        try:
            req = urllib.request.Request(try_url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response, open(save_path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"[OK] Herb {herb_id} downloaded successfully ({save_path.name}).")
            downloaded = True
            break
        except Exception as e:
            print(f"[RETRY] Herb {herb_id} failed from {try_url[:60]}...: {e}")

    if not downloaded:
        print(f"[WARN] Herb {herb_id} could not be downloaded.")

print("\nFinished downloading authentic plant images for 20 herbs!")
