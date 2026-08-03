from PIL import Image, ImageStat
import numpy as np


def is_leaf_or_plant(image_path, green_ratio_threshold=0.05, edge_threshold=5.0):
    """
    Heuristic pre-classifier to check if the image likely contains a leaf or plant.

    Strategy:
    - Load the image and compute the fraction of pixels that are green (G channel noticeably higher than R and B).
    - Compute a simple edge-strength metric to ensure there's an object (not a flat background).

    Returns True if both checks pass, False otherwise.
    """

    try:
        img = Image.open(image_path).convert("RGB")
    except Exception:
        return False

    arr = np.array(img)

    # Small images may be noisy; resize to a reasonable size for analysis
    h, w = arr.shape[:2]
    if max(h, w) > 800:
        # downscale for speed
        new_w = 800
        new_h = int(h * (800.0 / w)) if w > h else int(w * (800.0 / h))
        img = img.resize((min(w, 800), min(h, 800)))
        arr = np.array(img)

    r = arr[:, :, 0].astype(np.float32)
    g = arr[:, :, 1].astype(np.float32)
    b = arr[:, :, 2].astype(np.float32)

    # Green pixel heuristic: green channel noticeably larger than red and blue
    green_mask = (g > r * 1.1) & (g > b * 1.1) & (g > 60)
    green_ratio = float(np.sum(green_mask)) / (arr.shape[0] * arr.shape[1])

    # Edge strength heuristic: use simple gradient magnitude on grayscale
    gray = (0.299 * r + 0.587 * g + 0.114 * b)
    gy, gx = np.gradient(gray)
    grad = np.sqrt(gx * gx + gy * gy)
    edge_strength = float(np.mean(grad))

    # If either green ratio or edge strength indicates a likely plant/leaf, accept
    if green_ratio >= green_ratio_threshold and edge_strength >= 1.0:
        return True

    # fallback: accept if green ratio is moderately high even if edges are weak
    if green_ratio >= (green_ratio_threshold * 0.7):
        return True

    return False
