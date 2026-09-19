"""
Dataset Generator: Takes 20 authentic botanical herb images from frontend/public/images/herbs/
and applies realistic computer vision data augmentations (rotations, color jitter, crops, flips, scaling)
to produce a 1,000-image real training dataset in ./dataset/ with numbered class folders (01_Tulsi ... 20_Hibiscus).
"""
import os
import time
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps
import numpy as np

HERB_MAPPING = {
    1: "01_Tulsi",
    2: "02_Neem",
    3: "03_Ashwagandha",
    4: "04_Turmeric",
    5: "05_Ginger",
    6: "06_Amla",
    7: "07_Brahmi",
    8: "08_Shatavari",
    9: "09_Haritaki",
    10: "10_Giloy",
    11: "11_Aloe Vera",
    12: "12_Moringa",
    13: "13_Fenugreek",
    14: "14_Licorice",
    15: "15_Peppermint",
    16: "16_Cardamom",
    17: "17_Black Pepper",
    18: "18_Cumin",
    19: "19_Coriander",
    20: "20_Hibiscus",
}

def generate_augmented_dataset(source_dir="../frontend/public/images/herbs", target_dir="./dataset", num_augmented_per_class=50):
    source_path = Path(source_dir)
    target_path = Path(target_dir)
    os.makedirs(target_path, exist_ok=True)

    print("============================================================")
    print("[INFO] Generating 1,000 Numbered Training Images (01_Tulsi - 20_Hibiscus)...")
    print("============================================================")

    total_images = 0
    for herb_id, folder_name in HERB_MAPPING.items():
        img_file = source_path / f"{herb_id}.jpg"
        if not img_file.exists():
            print(f"[WARN] Image file {img_file} missing!")
            continue

        herb_class_dir = target_path / folder_name
        os.makedirs(herb_class_dir, exist_ok=True)

        orig_img = Image.open(img_file).convert("RGB")
        orig_img.resize((512, 512)).save(herb_class_dir / "sample_0.jpg")
        total_images += 1

        np.random.seed(herb_id * 42)
        for i in range(1, num_augmented_per_class):
            img = orig_img.copy()

            w, h = img.size
            crop_scale = np.random.uniform(0.75, 1.0)
            cw, ch = int(w * crop_scale), int(h * crop_scale)
            left = np.random.randint(0, max(1, w - cw))
            top = np.random.randint(0, max(1, h - ch))
            img = img.crop((left, top, left + cw, top + ch))

            if np.random.rand() > 0.5:
                img = ImageOps.mirror(img)
            if np.random.rand() > 0.5:
                img = ImageOps.flip(img)

            angle = np.random.uniform(-30, 30)
            img = img.rotate(angle, expand=False)

            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(np.random.uniform(0.8, 1.2))

            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(np.random.uniform(0.8, 1.25))

            enhancer = ImageEnhance.Color(img)
            img = enhancer.enhance(np.random.uniform(0.85, 1.25))

            img = img.resize((256, 256), Image.Resampling.LANCZOS)
            img.save(herb_class_dir / f"sample_{i}.jpg")
            total_images += 1

        print(f"[OK] {folder_name}: Created {num_augmented_per_class} training images.")

    print("============================================================")
    print(f"[OK] Successfully generated {total_images} training images across {len(HERB_MAPPING)} classes!")
    print("============================================================")

if __name__ == "__main__":
    generate_augmented_dataset()
