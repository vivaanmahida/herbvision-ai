"""
Pre-computes and caches 512-dim visual feature prototype embeddings for all 20 herbs
from authentic training images in ./dataset/ (01_Tulsi ... 20_Hibiscus) and saves to ./model_cache/herb_prototypes.npy
"""
import os
import torch
import numpy as np
from pathlib import Path
from PIL import Image

HERBS_FOLDERS = [
    "01_Tulsi", "02_Neem", "03_Ashwagandha", "04_Turmeric", "05_Ginger",
    "06_Amla", "07_Brahmi", "08_Shatavari", "09_Haritaki", "10_Giloy",
    "11_Aloe Vera", "12_Moringa", "13_Fenugreek", "14_Licorice", "15_Peppermint",
    "16_Cardamom", "17_Black Pepper", "18_Cumin", "19_Coriander", "20_Hibiscus",
]

def build_prototypes():
    from transformers import CLIPProcessor, CLIPModel
    model_name = "openai/clip-vit-base-patch32"
    cache_dir = os.getenv("MODEL_CACHE_DIR", "./model_cache")
    
    print("============================================================")
    print("[INFO] Building 512-dim Visual Feature Prototypes for 20 Herbs...")
    print("============================================================")

    processor = CLIPProcessor.from_pretrained(model_name, cache_dir=cache_dir)
    model = CLIPModel.from_pretrained(model_name, cache_dir=cache_dir)
    model.eval()

    dataset_dir = Path("./dataset")
    prototypes = []

    for idx, folder_name in enumerate(HERBS_FOLDERS, 1):
        h_dir = dataset_dir / folder_name
        feats = []
        if h_dir.exists():
            img_paths = list(h_dir.glob("*.jpg"))
            for img_p in img_paths:
                try:
                    img = Image.open(img_p).convert("RGB")
                    inputs = processor(images=img, return_tensors="pt")
                    with torch.no_grad():
                        out = model.get_image_features(**inputs)
                        feat = out.pooler_output if hasattr(out, 'pooler_output') else (out.image_embeds if hasattr(out, 'image_embeds') else out[0])
                        feat = feat / feat.norm(dim=-1, keepdim=True)
                        feats.append(feat.numpy()[0])
                except Exception as e:
                    pass

        if feats:
            mean_feat = np.mean(feats, axis=0)
            mean_feat /= np.linalg.norm(mean_feat)
            prototypes.append(mean_feat)
            print(f"[{idx}/20] {folder_name}: Averaged {len(feats)} sample embeddings into 512-dim vector.")
        else:
            print(f"[WARN] No features for {folder_name}, using zero vector.")
            prototypes.append(np.zeros(512))

    prototypes = np.array(prototypes)
    os.makedirs(cache_dir, exist_ok=True)
    save_path = os.path.join(cache_dir, "herb_prototypes.npy")
    np.save(save_path, prototypes)

    print("============================================================")
    print(f"[OK] Pre-computed visual prototypes saved to: {save_path} (shape: {prototypes.shape})")
    print("============================================================")

if __name__ == "__main__":
    build_prototypes()
