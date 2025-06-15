import cv2
from ultralytics import YOLO

MODEL_PATH = "best.pt"
model = YOLO(MODEL_PATH)

def run_model(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            return "Error: Unable to load image."

        results = model.predict(image)

        extracted_text = []
        for r in results:
            for box in r.boxes:
                class_id = int(box.cls)
                class_name = r.names[class_id]
                extracted_text.append(class_name)

        return ",".join(extracted_text) if extracted_text else "No text detected"
    except Exception as e:
        return f"Error: {e}"


# ✅ Prevent auto-run when imported into Flask
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Error: No image path provided. Usage: python inference.py <image_path>")
        sys.exit(1)

    print(run_model(sys.argv[1]))
