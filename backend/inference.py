import sys
import cv2
import torch
import numpy as np
from ultralytics import YOLO

# Check if the image path is provided
if len(sys.argv) < 2:
    print("Error: No image path provided. Usage: python inference.py <image_path>")
    sys.exit(1)

# Load the trained YOLO model
MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

# Get the image path from Node.js or CLI
image_path = sys.argv[1]

try:
    # Load image
    image = cv2.imread(image_path)
    if image is None:
        print("Error: Unable to load image. Check the file path.")
        sys.exit(1)

    # Perform inference
    results = model.predict(image)

    # Extract detected objects
    extracted_text = []
    for r in results:
        for box in r.boxes:
            extracted_text.append(r.names[int(box.cls)])  # Extract class name

    print(",".join(extracted_text) if extracted_text else "No text detected")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)