from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/infer', methods=['POST'])
def infer():
    data = request.get_json()

    image_path = data.get('imagePath')
    ocr_text = data.get('ocrText')

    if not image_path:
        return jsonify({'error': 'No image path provided'}), 400

    try:
        # Run the model inference
        result = subprocess.check_output(['python', 'inference.py', image_path])
        model_output = result.decode('utf-8').strip()

        return jsonify({
            'ocrText': ocr_text,
            'modelOutput': model_output
        })

    except subprocess.CalledProcessError as e:
        print('Error running inference:', e)
        return jsonify({'error': 'Failed to run inference'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
