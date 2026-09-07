import os

from model_loader import predict_image

image_path = os.getenv("TEST_IMAGE_PATH")

if not image_path:
    raise SystemExit("Set TEST_IMAGE_PATH to an image file before running this test.")

result = predict_image(image_path)

print(result)
