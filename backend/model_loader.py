import os
from pathlib import Path
import numpy as np
from PIL import Image

from class_names import CLASS_NAMES

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

onnx_path = PROJECT_ROOT / "best_convnextv2.onnx"
pth_path = PROJECT_ROOT / "best_convnextv2.pth"

_session = None
_pytorch_model = None
_pytorch_transform = None
_pytorch_device = None

def _is_valid_onnx_file(path: Path) -> bool:
    if not path.exists():
        return False
    # Git LFS pointer files are small text files (~130 bytes).
    # A genuine ONNX model file is >100MB.
    try:
        return path.stat().st_size > 100000
    except Exception:
        return False

def get_onnx_session():
    global _session
    if _session is not None:
        return _session

    if not _is_valid_onnx_file(onnx_path):
        return None

    try:
        import onnxruntime as ort
        _session = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
        print("[INFO] Successfully initialized ONNXRuntime engine.")
        return _session
    except Exception as e:
        print(f"[WARN] Failed to initialize ONNXRuntime session: {e}")
        return None

def get_pytorch_model():
    global _pytorch_model, _pytorch_transform, _pytorch_device
    if _pytorch_model is not None:
        return _pytorch_model, _pytorch_transform, _pytorch_device

    if not pth_path.exists() or pth_path.stat().st_size < 100000:
        return None, None, None

    try:
        import torch
        import timm
        from torchvision import transforms

        _pytorch_device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
        _pytorch_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        model = timm.create_model("convnextv2_tiny.fcmae_ft_in1k", pretrained=False, num_classes=29)
        model.load_state_dict(torch.load(pth_path, map_location=_pytorch_device))
        model.to(_pytorch_device)
        model.eval()
        _pytorch_model = model
        print("[INFO] Successfully initialized PyTorch engine.")
        return _pytorch_model, _pytorch_transform, _pytorch_device
    except Exception as e:
        print(f"[WARN] Failed to initialize PyTorch model: {e}")
        return None, None, None

def predict_image(image_path):
    session = get_onnx_session()
    if session is not None:
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

    model, transform, device = get_pytorch_model()
    if model is not None:
        import torch
        image = Image.open(image_path).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(device)
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

    raise RuntimeError(
        "No machine learning inference engine available. "
        "The model weights file is either a Git LFS pointer or missing from the deployment container."
    )
