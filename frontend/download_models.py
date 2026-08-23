import urllib.request
import os

repo_url = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/"
models_dir = os.path.join(os.path.dirname(__file__), 'public', 'models')

os.makedirs(models_dir, exist_ok=True)

files = [
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1"
]

for file in files:
    url = repo_url + file
    dest = os.path.join(models_dir, file)
    print(f"Downloading {file}...")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"Downloaded {file}")
    except Exception as e:
        print(f"Failed to download {file}: {e}")

print("Done downloading models.")
