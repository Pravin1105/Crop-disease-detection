import os
from pathlib import Path

import torch
import timm

from PIL import Image
from torchvision import transforms

from class_names import CLASS_NAMES


DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "mps"
    if torch.backends.mps.is_available()
    else "cpu"
)

IMG_SIZE = 224
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
configured_model_path = Path(os.getenv("MODEL_PATH", "best_convnextv2.pth"))
MODEL_PATH = configured_model_path if configured_model_path.is_absolute() else (
    PROJECT_ROOT / configured_model_path
)

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")


transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])


model = timm.create_model(
    "convnextv2_tiny.fcmae_ft_in1k",
    pretrained=False,
    num_classes=29
)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )
)

model.to(DEVICE)
model.eval()

@torch.no_grad()
def predict_image(image_path):

    image = Image.open(image_path).convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0).to(DEVICE)

    outputs = model(image)

    probabilities = torch.softmax(outputs, dim=1)

    top_prob, top_class = torch.topk(probabilities, k=3)

    predictions = []

    for prob, cls in zip(top_prob[0], top_class[0]):
        predictions.append({
            "class": CLASS_NAMES[cls.item()],
            "confidence": float(prob.item() * 100)
        })

    return predictions
