import sys
import os
from pathlib import Path

# Add the model directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import your model files
from cfm import YourModelClass
from utils import process_text
# Add other necessary imports

def generate_speech(text):
    # Initialize your model
    model = YourModelClass()
    
    # Generate speech
    audio_path = f"./tmp/speech_{hash(text)}.wav"
    model.generate(text, output_path=audio_path)
    
    # Print the path to be captured by Node.js
    print(os.path.abspath(audio_path))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tts_wrapper.py 'text to speak'")
        sys.exit(1)
    
    text = sys.argv[1]
    generate_speech(text)