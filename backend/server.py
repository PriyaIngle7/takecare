import torch
import os

# Change this between "save" and "load"
MODE = "save"  # Use "load" to restore files

# Define paths
directory = "my_model_directory"  # Directory containing model files
pth_file = "model.pth"  # Output .pth file
restore_directory = "restored_model"  # Where to restore files when loading

if MODE == "save":
    # Collect all files in the directory
    model_files = {}
    for file in os.listdir(directory):
        file_path = os.path.join(directory, file)
        with open(file_path, "rb") as f:
            model_files[file] = f.read()
    
    # Save everything into a .pth file
    torch.save(model_files, pth_file)
    print(f"Saved {len(model_files)} files into {pth_file}")

elif MODE == "load":
    # Load the .pth file
    model_files = torch.load(pth_file)

    # Restore files to a directory
    os.makedirs(restore_directory, exist_ok=True)

    for filename, data in model_files.items():
        with open(os.path.join(restore_directory, filename), "wb") as f:
            f.write(data)

    print(f"Restored {len(model_files)} files to {restore_directory}")
