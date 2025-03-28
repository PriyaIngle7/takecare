import torch
from f5_tts.model.fastspeech2 import FastSpeech2

# Load the model
model = FastSpeech2()

# Load checkpoint (Adjust path to your trained model checkpoint)
checkpoint_path = "f5_tts/checkpoints/best_model.pt"
checkpoint = torch.load(checkpoint_path, map_location='cpu')
model.load_state_dict(checkpoint['model'])
model.eval()

# Save as .pt
torch.save(model, 'mel_spec_module_scripted.pt')
print("✅ Model saved as mel_spec_module_scripted.pt")

