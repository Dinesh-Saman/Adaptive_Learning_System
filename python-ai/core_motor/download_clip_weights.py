import os
import sys

save_dir = os.path.join(os.path.dirname(__file__), "weights")
os.makedirs(save_dir, exist_ok=True)

print(f"Downloading OpenAI CLIP ViT-B/32 model and processor to: {save_dir}")
try:
    from transformers import CLIPModel, CLIPProcessor
except ImportError:
    from transformers.models.clip import CLIPModel, CLIPProcessor

print("Fetching and saving CLIPProcessor (tokenizers and preprocessor)...")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
processor.save_pretrained(save_dir)
print("CLIPProcessor saved successfully!")

print("Fetching and saving CLIPModel weights (Vision Transformer + Text Transformer)...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
model.save_pretrained(save_dir)
print(f"CLIPModel weights saved successfully to {save_dir}!")

print("\nFiles in weights directory:")
for f in sorted(os.listdir(save_dir)):
    f_path = os.path.join(save_dir, f)
    size_mb = os.path.getsize(f_path) / (1024 * 1024)
    print(f"  - {f} ({size_mb:.2f} MB)")
