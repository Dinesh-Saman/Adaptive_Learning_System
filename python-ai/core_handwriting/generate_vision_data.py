import os
import numpy as np

def generate_vision_dataset(num_samples=4000, output_dir="dataset"):
    """
    Generates synthetic 28x28 grayscale image arrays for Sinhala Handwriting classification.
    Classes:
      0: Excellent (Perfectly formed letters)
      1: Good (Minor proportional errors)
      2: Poor (Illegible or heavily distorted)
    """
    os.makedirs(output_dir, exist_ok=True)
    print(f"Generating {num_samples} synthetic 28x28 images...")
    
    # Format: (num_samples, channels, height, width) -> (4000, 1, 28, 28)
    images = []
    labels = []
    
    for _ in range(num_samples):
        label = np.random.randint(0, 3)
        
        # Base canvas (mostly white background, normalized 0 to 1)
        # Note: In MNIST format, background is usually 0 and ink is 1. We will use that.
        img = np.random.uniform(low=0.0, high=0.2, size=(1, 28, 28))
        
        if label == 0:
            # Excellent: strong, clear, continuous strokes in the center
            img[0, 10:18, 10:18] += 0.8
        elif label == 1:
            # Good: decent strokes but slightly off-center or thinner
            img[0, 12:22, 5:15] += 0.6
        else:
            # Poor: scattered noise, no clear stroke pattern
            noise = np.random.uniform(low=0.0, high=0.9, size=(1, 28, 28))
            img = img + noise
            
        # Clip to ensure valid pixel bounds 0.0 - 1.0
        img = np.clip(img, 0.0, 1.0)
        
        images.append(img)
        labels.append(label)
        
    np.save(os.path.join(output_dir, "vision_images.npy"), np.array(images, dtype=np.float32))
    np.save(os.path.join(output_dir, "vision_labels.npy"), np.array(labels, dtype=np.int64))
    
    print(f"Dataset generated at {output_dir}/vision_images.npy")

if __name__ == "__main__":
    generate_vision_dataset()
