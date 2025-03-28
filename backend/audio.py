import torch
import sys
import numpy as np
import soundfile as sf
import torchaudio
from ftts_model import FastSpeech2, get_vocoder

# Ensure correct arguments
if len(sys.argv) != 3:
    print("Usage: python audio.py <input_audio_path> <text>")
    sys.exit(1)

input_audio_path = sys.argv[1]
text = sys.argv[2]

# Load FastSpeech2 and vocoder
device = "cuda" if torch.cuda.is_available() else "cpu"
model = FastSpeech2().to(device)
model.load_state_dict(torch.load("mel_spec_module_scripted.pt", map_location=device))
model.eval()

vocoder = get_vocoder()

# Extract speaker embedding (use torchaudio for better results)
def extract_speaker_embedding(audio_path):
    waveform, sample_rate = torchaudio.load(audio_path)
    mel_spectrogram = torchaudio.transforms.MelSpectrogram(
        sample_rate=sample_rate,
        n_fft=1024,
        win_length=1024,
        hop_length=256,
        n_mels=80
    )(waveform)
    return mel_spectrogram.mean(dim=2).to(device)

speaker_embedding = extract_speaker_embedding(input_audio_path)

# Generate speech from text
with torch.no_grad():
    output_mel = model.infer(text, speaker_embedding)

# Convert mel to waveform
waveform = vocoder.infer(output_mel)

# Save output
output_path = "output.wav"
sf.write(output_path, waveform.squeeze(0).cpu().numpy(), 22050)
print(f"✅ Generated speech saved to: {output_path}")
