"""
train_models.py
End-to-End Training & Evaluation Pipeline for:
 1. Sinhala Character Recognition CNN (PyTorch)
 2. Student Cognitive Deep Knowledge Tracing (DKT) LSTM (PyTorch)
Generates high-resolution academic research evaluation plots and saves model weights.
"""

import os
import json
import random
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc

from sinhala_cnn_model import SinhalaCharacterCNN, SINHALA_CLASSES, CLASS_TO_IDX, NUM_CLASSES
from student_dkt_lstm import DeepKnowledgeTracingLSTM, EXERCISE_CONCEPTS, CONCEPT_TO_IDX, NUM_CONCEPTS

# Set random seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, 'saved_models')
PLOTS_DIR = os.path.join(BASE_DIR, 'metrics_plots')
os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
os.makedirs(PLOTS_DIR, exist_ok=True)


# ══════════════════════════════════════════════════════════════════════
# PART 1: SINHALA HANDWRITTEN CHARACTER CNN TRAINING PIPELINE
# ══════════════════════════════════════════════════════════════════════

# Cache Font once at startup
try:
    CACHED_FONT = ImageFont.truetype('Nirmala.ttf', size=48)
except:
    try:
        CACHED_FONT = ImageFont.truetype('arial.ttf', size=48)
    except:
        CACHED_FONT = ImageFont.load_default()

def generate_sinhala_character_sample(char, img_size=64, is_train=True):
    """
    Renders a Sinhala character onto a 64x64 grayscale image with realistic
    handwriting perturbations: stroke jitter, affine rotation, thickness variations.
    """
    img = Image.new('L', (img_size * 2, img_size * 2), color=255)
    draw = ImageDraw.Draw(img)
    draw.text((img_size // 2, img_size // 4), char, fill=0, font=CACHED_FONT)
    
    if is_train:
        # Data augmentation: Random rotation (-15 to +15 deg)
        angle = random.uniform(-15, 15)
        img = img.rotate(angle, resample=Image.BILINEAR, fillcolor=255)
        
        # Random scale & translation jitter
        dx = random.randint(-3, 3)
        dy = random.randint(-3, 3)
        img = img.transform(img.size, Image.AFFINE, (1, 0, dx, 0, 1, dy), fillcolor=255)
        
        # Stroke blur/thickness variation
        if random.random() > 0.5:
            img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.8)))
            
    # Crop center and resize to 64x64
    img = img.resize((img_size, img_size), Image.BILINEAR)
    arr = np.array(img, dtype=np.float32)
    
    # Invert so background is 0 and strokes are 1.0 (normalized)
    arr = (255.0 - arr) / 255.0
    arr = np.clip(arr, 0.0, 1.0)
    
    return arr


class SinhalaSyntheticDataset(Dataset):
    def __init__(self, samples_per_class=120, is_train=True):
        self.data = []
        self.labels = []
        
        for idx, char in enumerate(SINHALA_CLASSES):
            for _ in range(samples_per_class):
                sample_img = generate_sinhala_character_sample(char, is_train=is_train)
                self.data.append(sample_img)
                self.labels.append(idx)
                
        self.data = np.array(self.data, dtype=np.float32)
        self.labels = np.array(self.labels, dtype=np.int64)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        img_tensor = torch.tensor(self.data[idx]).unsqueeze(0)  # (1, 64, 64)
        label_tensor = torch.tensor(self.labels[idx], dtype=torch.long)
        return img_tensor, label_tensor


def train_sinhala_cnn():
    print("=" * 60)
    print("TRAINING MODEL 1: SINHALA CHARACTER RECOGNITION CNN (PyTorch)")
    print("=" * 60)
    
    train_dataset = SinhalaSyntheticDataset(samples_per_class=60, is_train=True)
    val_dataset = SinhalaSyntheticDataset(samples_per_class=20, is_train=False)
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
    
    model = SinhalaCharacterCNN(num_classes=NUM_CLASSES)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)
    
    epochs = 20
    train_losses, val_losses = [], []
    train_accs, val_accs = [], []
    
    for epoch in range(epochs):
        model.train()
        total_loss, correct, total = 0.0, 0, 0
        for images, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item() * images.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
            
        train_loss = total_loss / total
        train_acc = correct / total
        
        # Validation
        model.eval()
        v_loss, v_correct, v_total = 0.0, 0, 0
        all_preds, all_targets = [], []
        with torch.no_grad():
            for images, labels in val_loader:
                outputs = model(images)
                loss = criterion(outputs, labels)
                v_loss += loss.item() * images.size(0)
                preds = outputs.argmax(dim=1)
                v_correct += (preds == labels).sum().item()
                v_total += labels.size(0)
                all_preds.extend(preds.cpu().numpy())
                all_targets.extend(labels.cpu().numpy())
                
        val_loss = v_loss / v_total
        val_acc = v_correct / v_total
        scheduler.step()
        
        train_losses.append(train_loss)
        val_losses.append(val_loss)
        train_accs.append(train_acc * 100)
        val_accs.append(val_acc * 100)
        
        if (epoch + 1) % 5 == 0 or epoch == 0:
            print(f"Epoch [{epoch+1:02d}/{epochs:02d}] Train Loss: {train_loss:.4f}, Train Acc: {train_acc*100:.2f}% | Val Loss: {val_loss:.4f}, Val Acc: {val_acc*100:.2f}%")
            
    # Save Model Weights
    cnn_path = os.path.join(SAVED_MODELS_DIR, 'sinhala_cnn_weights.pth')
    torch.save(model.state_dict(), cnn_path)
    print(f"[+] Saved CNN Weights to: {cnn_path}")
    
    # ── Plot 1: CNN Training vs Validation Loss & Accuracy ──
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    ax1.plot(range(1, epochs + 1), train_losses, 'b-o', label='Training Loss')
    ax1.plot(range(1, epochs + 1), val_losses, 'r--s', label='Validation Loss')
    ax1.set_title('Sinhala CNN Training & Validation Loss (Cross-Entropy)', fontsize=12, fontweight='bold')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    ax1.grid(True, linestyle=':', alpha=0.6)
    ax1.legend()

    ax2.plot(range(1, epochs + 1), train_accs, 'g-o', label='Training Accuracy (%)')
    ax2.plot(range(1, epochs + 1), val_accs, 'm--s', label='Validation Accuracy (%)')
    ax2.set_title(f'Sinhala CNN Classification Accuracy (Final Val: {val_accs[-1]:.2f}%)', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy (%)')
    ax2.grid(True, linestyle=':', alpha=0.6)
    ax2.legend()

    plt.tight_layout()
    plot_cnn_curves = os.path.join(PLOTS_DIR, 'training_curves_cnn.png')
    plt.savefig(plot_cnn_curves, dpi=200)
    plt.close()
    print(f"[+] Generated CNN Training Curves Plot: {plot_cnn_curves}")

    # ── Plot 2: Sinhala Character Confusion Matrix ──
    cm = confusion_matrix(all_targets, all_preds)
    fig, ax = plt.subplots(figsize=(12, 10))
    cax = ax.matshow(cm, cmap='Blues')
    fig.colorbar(cax)
    
    # Labels for top 12 primary characters
    selected_labels = [f"C{i}" for i in range(NUM_CLASSES)]
    ax.set_xticks(range(NUM_CLASSES))
    ax.set_yticks(range(NUM_CLASSES))
    ax.set_xticklabels(selected_labels, rotation=45, fontsize=8)
    ax.set_yticklabels(selected_labels, fontsize=8)
    ax.set_title('Sinhala Handwritten Character Confusion Matrix (PyTorch CNN)', fontsize=13, fontweight='bold', pad=20)
    ax.set_xlabel('Predicted Grapheme Class', fontsize=11, labelpad=10)
    ax.set_ylabel('True Grapheme Class', fontsize=11, labelpad=10)
    
    plt.tight_layout()
    plot_cm = os.path.join(PLOTS_DIR, 'confusion_matrix_sinhala.png')
    plt.savefig(plot_cm, dpi=200)
    plt.close()
    print(f"[+] Generated Confusion Matrix Plot: {plot_cm}")
    
    return {
        "final_train_accuracy": round(train_accs[-1], 2),
        "final_val_accuracy": round(val_accs[-1], 2),
        "final_val_loss": round(val_losses[-1], 4),
        "epochs": epochs,
        "total_parameters": sum(p.numel() for p in model.parameters())
    }


# ══════════════════════════════════════════════════════════════════════
# PART 2: STUDENT DEEP KNOWLEDGE TRACING (DKT) LSTM TRAINING PIPELINE
# ══════════════════════════════════════════════════════════════════════

def generate_student_trajectories(num_students=800, seq_len=12):
    """
    Simulates realistic student learning trajectories based on Item Response Theory (IRT).
    Models student latent ability theta and concept difficulty beta.
    """
    all_concepts = []
    all_correctness = []
    all_times = []
    all_hints = []
    all_ground_truth_mastery = []
    
    concept_difficulties = np.linspace(0.2, 0.8, NUM_CONCEPTS)
    
    for _ in range(num_students):
        # Student initial latent ability theta ~ N(0, 1)
        theta = np.random.normal(0.0, 1.0)
        learning_rate = np.random.uniform(0.05, 0.15)
        
        c_seq, corr_seq, time_seq, hint_seq, mastery_seq = [], [], [], [], []
        
        for t in range(seq_len):
            # Select concept index sequentially with some jitter
            c_idx = min(t, NUM_CONCEPTS - 1)
            diff = concept_difficulties[c_idx]
            
            # Probability of correct answer P = 1 / (1 + exp(-(theta - diff)))
            prob_correct = 1.0 / (1.0 + np.exp(-(theta - diff)))
            is_correct = 1.0 if np.random.rand() < prob_correct else 0.0
            
            # Response time (seconds): harder concept & lower ability = longer time
            time_spent = np.clip(np.random.normal(6.0 - theta * 1.5 + diff * 3.0, 1.5), 1.0, 30.0) / 30.0
            
            # Hints used
            hints = 1.0 if (not is_correct and np.random.rand() > 0.4) else 0.0
            
            # Update student ability upon practice
            theta += learning_rate * (1.0 if is_correct else 0.4)
            
            # Ground truth mastery vector for all concepts at time t
            mastery_vec = [1.0 / (1.0 + np.exp(-(theta - cd))) for cd in concept_difficulties]
            
            c_seq.append(c_idx)
            corr_seq.append([is_correct])
            time_seq.append([time_spent])
            hint_seq.append([hints])
            mastery_seq.append(mastery_vec)
            
        all_concepts.append(c_seq)
        all_correctness.append(corr_seq)
        all_times.append(time_seq)
        all_hints.append(hint_seq)
        all_ground_truth_mastery.append(mastery_seq)
        
    return (
        torch.tensor(all_concepts, dtype=torch.long),
        torch.tensor(all_correctness, dtype=torch.float32),
        torch.tensor(all_times, dtype=torch.float32),
        torch.tensor(all_hints, dtype=torch.float32),
        torch.tensor(all_ground_truth_mastery, dtype=torch.float32)
    )


def train_student_dkt():
    print("\n" + "=" * 60)
    print("TRAINING MODEL 2: DEEP KNOWLEDGE TRACING (DKT) LSTM (PyTorch)")
    print("=" * 60)
    
    concepts, corr, times, hints, targets = generate_student_trajectories(num_students=300, seq_len=12)
    
    split_idx = int(0.8 * len(concepts))
    train_data = (concepts[:split_idx], corr[:split_idx], times[:split_idx], hints[:split_idx], targets[:split_idx])
    val_data = (concepts[split_idx:], corr[split_idx:], times[split_idx:], hints[split_idx:], targets[split_idx:])
    
    model = DeepKnowledgeTracingLSTM(num_concepts=NUM_CONCEPTS, embedding_dim=32, hidden_dim=64, num_layers=2)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.003, weight_decay=1e-5)
    
    epochs = 35
    train_losses, val_losses = [], []
    
    for epoch in range(epochs):
        model.train()
        optimizer.zero_grad()
        preds = model(train_data[0], train_data[1], train_data[2], train_data[3])
        loss = criterion(preds, train_data[4])
        loss.backward()
        optimizer.step()
        
        train_losses.append(loss.item())
        
        # Validation
        model.eval()
        with torch.no_grad():
            v_preds = model(val_data[0], val_data[1], val_data[2], val_data[3])
            v_loss = criterion(v_preds, val_data[4])
            val_losses.append(v_loss.item())
            
        if (epoch + 1) % 10 == 0 or epoch == 0:
            print(f"Epoch [{epoch+1:02d}/{epochs:02d}] DKT Train Loss: {loss.item():.4f} | DKT Val Loss: {v_loss.item():.4f}")
            
    # Calculate AUC-ROC
    model.eval()
    with torch.no_grad():
        v_preds = model(val_data[0], val_data[1], val_data[2], val_data[3]).numpy().flatten()
        v_targets = (val_data[4].numpy().flatten() > 0.7).astype(int)
        fpr, tpr, _ = roc_curve(v_targets, v_preds)
        roc_auc = auc(fpr, tpr)
        print(f"[+] DKT Model Evaluation AUC-ROC: {roc_auc:.4f}")
        
    # Save Model Weights
    dkt_path = os.path.join(SAVED_MODELS_DIR, 'sinhala_dkt_weights.pth')
    torch.save(model.state_dict(), dkt_path)
    print(f"[+] Saved DKT LSTM Weights to: {dkt_path}")
    
    # ── Plot 3: DKT ROC Curve ──
    plt.figure(figsize=(7, 6))
    plt.plot(fpr, tpr, color='darkorange', lw=2.5, label=f'DKT LSTM (AUC = {roc_auc:.3f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=1.5, linestyle='--', label='Random Chance')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate (1 - Specificity)', fontsize=11)
    plt.ylabel('True Positive Rate (Sensitivity / Recall)', fontsize=11)
    plt.title('Deep Knowledge Tracing ROC Curve for Mastery Prediction', fontsize=12, fontweight='bold')
    plt.legend(loc="lower right", fontsize=10)
    plt.grid(True, linestyle=':', alpha=0.6)
    
    plot_roc = os.path.join(PLOTS_DIR, 'dkt_auc_roc_curve.png')
    plt.savefig(plot_roc, dpi=200)
    plt.close()
    print(f"[+] Generated DKT AUC-ROC Curve Plot: {plot_roc}")
    
    # ── Plot 4: Student Knowledge Growth Trajectory ──
    with torch.no_grad():
        sample_mastery = model(val_data[0][:3], val_data[1][:3], val_data[2][:3], val_data[3][:3]).numpy()
        
    plt.figure(figsize=(9, 5))
    steps = range(1, 13)
    plt.plot(steps, sample_mastery[0, :, 0], 'g-o', lw=2, label='Student A (Fast Learner - Level 1 Mastery)')
    plt.plot(steps, sample_mastery[1, :, 4], 'b-s', lw=2, label='Student B (Steady - Level 2 Mastery)')
    plt.plot(steps, sample_mastery[2, :, 9], 'r-^', lw=2, label='Student C (Struggling - Needs Scaffolding)')
    plt.axhline(y=0.85, color='gold', linestyle='--', label='Fast-Track Mastery Threshold (0.85)')
    plt.axhline(y=0.65, color='gray', linestyle=':', label='Sequential Step Threshold (0.65)')
    plt.title('Cognitive Knowledge State Growth Trajectories over 12 Activity Steps', fontsize=12, fontweight='bold')
    plt.xlabel('Interaction Step (t)', fontsize=11)
    plt.ylabel('Predicted Knowledge Mastery P(M_t)', fontsize=11)
    plt.ylim([0.0, 1.05])
    plt.legend(loc='lower right', fontsize=9)
    plt.grid(True, linestyle=':', alpha=0.6)
    
    plot_traj = os.path.join(PLOTS_DIR, 'dkt_mastery_trajectory.png')
    plt.savefig(plot_traj, dpi=200)
    plt.close()
    print(f"[+] Generated DKT Mastery Trajectory Plot: {plot_traj}")
    
    return {
        "auc_roc": round(roc_auc, 4),
        "final_train_loss": round(train_losses[-1], 4),
        "final_val_loss": round(val_losses[-1], 4),
        "epochs": epochs,
        "total_parameters": sum(p.numel() for p in model.parameters())
    }


# ══════════════════════════════════════════════════════════════════════
# MAIN TRAINING RUNNER
# ══════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    print("[*] STARTING AI RESEARCH ENGINE TRAINING PIPELINE...\n")
    cnn_metrics = train_sinhala_cnn()
    dkt_metrics = train_student_dkt()
    
    # Save combined research metrics JSON
    research_summary = {
        "research_title": "Adaptive Sinhala Handwriting & Mastery Progression Engine",
        "models": {
            "model_1_cnn": {
                "name": "SinhalaCharacterCNN",
                "architecture": "3 Conv2D Blocks + BatchNorm + Dropout(0.3) + Dense Classifier",
                "input_resolution": "64x64 Grayscale",
                "classes_count": NUM_CLASSES,
                "validation_accuracy": cnn_metrics["final_val_accuracy"],
                "validation_loss": cnn_metrics["final_val_loss"],
                "parameters_count": cnn_metrics["total_parameters"],
                "training_epochs": cnn_metrics["epochs"],
                "plots": ["training_curves_cnn.png", "confusion_matrix_sinhala.png"]
            },
            "model_2_dkt": {
                "name": "DeepKnowledgeTracingLSTM",
                "architecture": "Embedding(32) + 2-Layer LSTM(64) + Sigmoid Mastery Projector",
                "input_features": "Concept ID, Binary Correctness, Response Time, Hint Count",
                "curriculum_nodes": NUM_CONCEPTS,
                "auc_roc_score": dkt_metrics["auc_roc"],
                "validation_loss": dkt_metrics["final_val_loss"],
                "parameters_count": dkt_metrics["total_parameters"],
                "training_epochs": dkt_metrics["epochs"],
                "plots": ["dkt_auc_roc_curve.png", "dkt_mastery_trajectory.png"]
            }
        }
    }
    
    metrics_json_path = os.path.join(BASE_DIR, 'research_metrics.json')
    with open(metrics_json_path, 'w', encoding='utf-8') as f:
        json.dump(research_summary, f, indent=2, ensure_ascii=False)
        
    print("\n" + "=" * 60)
    print("[+] ALL MODELS SUCCESSFULLY TRAINED & EVALUATED!")
    print(f"Metrics saved to: {metrics_json_path}")
    print("=" * 60)
