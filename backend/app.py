from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import pytesseract
from PIL import Image
from inferenceForApp import run_model

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/upload-image", methods=["POST"])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['image']
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        image = Image.open(file_path)
        ocr_text = pytesseract.image_to_string(image)

        model_output = run_model(file_path)

        return jsonify({
            "ocrText": ocr_text.strip(),
            "modelOutput": model_output.strip()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
