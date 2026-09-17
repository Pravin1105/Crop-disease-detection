import os
from pathlib import Path
import numpy as np
from PIL import Image

from class_names import CLASS_NAMES

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

onnx_path = PROJECT_ROOT / "best_convnextv2.onnx"
pth_path = PROJECT_ROOT / "best_convnextv2.pth"

# Use ONNXRuntime if onnx file exists, otherwise PyTorch fallback
USE_ONNX = onnx_path.exists()

if USE_ONNX:
    import onnxruntime as ort
    session = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
    print("[INFO] Using lightweight ONNXRuntime engine.")
else:
    import torch
    import timm
    from torchvision import transforms
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    model = timm.create_model("convnextv2_tiny.fcmae_ft_in1k", pretrained=False, num_classes=29)
    model.load_state_dict(torch.load(pth_path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    print("[INFO] Using PyTorch engine.")

def predict_image(image_path):
    if USE_ONNX:
        image = Image.open(image_path).convert("RGB").resize((224, 224))
        img_data = np.array(image).astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_data = (img_data - mean) / std
        img_data = np.transpose(img_data, (2, 0, 1))
        img_data = np.expand_dims(img_data, axis=0)
        
        outputs = session.run(None, {"input": img_data})[0]
        exp_scores = np.exp(outputs - np.max(outputs))
        probabilities = exp_scores / np.sum(exp_scores, axis=1, keepdims=True)
        top3_indices = np.argsort(probabilities[0])[-3:][::-1]
        
        predictions = []
        for idx in top3_indices:
            predictions.append({
                "class": CLASS_NAMES[idx],
                "confidence": float(probabilities[0][idx] * 100)
            })
        return predictions
    else:
        image = Image.open(image_path).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            top_prob, top_class = torch.topk(probabilities, k=3)
        predictions = []
        for prob, cls in zip(top_prob[0], top_class[0]):
            predictions.append({
                "class": CLASS_NAMES[cls.item()],
                "confidence": float(prob.item() * 100)
            })
        return predictions
