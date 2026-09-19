"""
HerbVision AI — Model Training & Fine-Tuning Script
Fine-tunes a PyTorch ResNet18 classifier on 20 Ayurvedic herb classes.
Saves model weights to ./model_cache/herb_model_finetuned.pth
"""
import os
import sys
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import models, transforms
from PIL import Image
import numpy as np

# 20 Herb Classes
HERB_NAMES = [
    "Tulsi", "Neem", "Ashwagandha", "Turmeric", "Ginger",
    "Amla", "Brahmi", "Shatavari", "Haritaki", "Giloy",
    "Aloe Vera", "Moringa", "Fenugreek", "Licorice", "Peppermint",
    "Cardamom", "Black Pepper", "Cumin", "Coriander", "Hibiscus",
]

MODEL_CACHE_DIR = os.getenv("MODEL_CACHE_DIR", "./model_cache")
WEIGHTS_PATH = os.path.join(MODEL_CACHE_DIR, "herb_model_finetuned.pth")

class HerbResNetClassifier(nn.Module):
    """ResNet18 transfer-learning architecture for 20-class herb identification."""
    def __init__(self, num_classes=20):
        super(HerbResNetClassifier, self).__init__()
        self.backbone = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        num_ftrs = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_ftrs, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)


def get_data_transforms():
    """Heavy data augmentation pipeline for robust model training."""
    train_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.05),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return train_transform, val_transform


def create_synthetic_dataset_if_missing(dataset_dir="./dataset"):
    """
    Generate sample dataset folders for all 20 herbs if dataset directory is missing or empty.
    """
    if os.path.exists(dataset_dir) and len(os.listdir(dataset_dir)) >= 20:
        return

    os.makedirs(dataset_dir, exist_ok=True)
    for idx, herb in enumerate(HERB_NAMES, 1):
        folder_name = f"{idx:02d}_{herb}"
        herb_dir = os.path.join(dataset_dir, folder_name)
        if not os.path.exists(herb_dir) or len(os.listdir(herb_dir)) == 0:
            os.makedirs(herb_dir, exist_ok=True)
            print(f"Creating sample images for {folder_name}...")
            np.random.seed(hash(herb) % 2**32)
            base_color = np.random.randint(40, 220, size=(3,), dtype=np.uint8)
            for i in range(15):
                noise = np.random.randint(-30, 30, size=(224, 224, 3), dtype=np.int16)
                img_arr = np.clip(base_color + noise, 0, 255).astype(np.uint8)
                img = Image.fromarray(img_arr)
                img.save(os.path.join(herb_dir, f"sample_{i+1}.jpg"))


def train_model(dataset_dir="./dataset", epochs=5, lr=0.001, batch_size=8):
    """
    Train the ResNet18 herb classifier on the dataset.
    Saves the best model checkpoint to ./model_cache/herb_model_finetuned.pth
    """
    print("=" * 60)
    print("HerbVision AI - Fine-Tuning Herb Identification Model")
    print("=" * 60)

    create_synthetic_dataset_if_missing(dataset_dir)
    train_transform, val_transform = get_data_transforms()

    from torchvision.datasets import ImageFolder
    try:
        full_dataset = ImageFolder(root=dataset_dir, transform=train_transform)
    except Exception as e:
        print(f"Error loading dataset from {dataset_dir}: {e}")
        return False

    print(f"Total dataset size: {len(full_dataset)} images across {len(full_dataset.classes)} classes.")

    train_loader = DataLoader(full_dataset, batch_size=batch_size, shuffle=True, num_workers=0)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training device: {device}")

    model = HerbResNetClassifier(num_classes=len(HERB_NAMES)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)

    os.makedirs(MODEL_CACHE_DIR, exist_ok=True)
    best_acc = 0.0

    start_time = time.time()
    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct += torch.sum(preds == labels.data).item()
            total += labels.size(0)

        epoch_loss = running_loss / total
        epoch_acc = (correct / total) * 100.0

        print(f"Epoch [{epoch}/{epochs}] - Loss: {epoch_loss:.4f} | Accuracy: {epoch_acc:.2f}%")

        if epoch_acc >= best_acc:
            best_acc = epoch_acc
            torch.save({
                "model_state_dict": model.state_dict(),
                "classes": full_dataset.classes,
                "accuracy": best_acc,
                "epochs": epoch
            }, WEIGHTS_PATH)

    elapsed = time.time() - start_time
    print("=" * 60)
    print(f"[OK] Training Complete in {elapsed:.1f}s!")
    print(f"[BEST] Accuracy: {best_acc:.2f}%")
    print(f"[SAVED] Checkpoint saved to: {WEIGHTS_PATH}")
    print("=" * 60)
    return True


if __name__ == "__main__":
    epochs = 5
    if len(sys.argv) > 1:
        try:
            epochs = int(sys.argv[1])
        except ValueError:
            pass
    train_model(epochs=epochs)
