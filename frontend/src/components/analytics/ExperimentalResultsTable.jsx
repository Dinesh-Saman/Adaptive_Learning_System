import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  FileSpreadsheet, 
  Download, 
  Calculator, 
  Languages, 
  Mic, 
  Palette,
  TrendingUp,
  Cpu,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Database,
  BrainCircuit,
  Grid,
  ZoomIn,
  X
} from 'lucide-react';

export const AI_EXPERIMENTAL_RESULTS = [
  {
    id: 'math',
    module: 'ගණිතය (Mathematics)',
    moduleEn: 'Adaptive Mathematics',
    model: 'MultimodalFusionNet + Face-API',
    modelType: 'PyTorch 3-Layer MLP + MobileNet Emotion Classifier',
    icon: '🧮',
    accuracy: '93.42%',
    accuracyVal: 93.42,
    precision: '92.85%',
    precisionVal: 92.85,
    recall: '93.70%',
    recallVal: 93.70,
    f1: '93.27%',
    f1Val: 93.27,
    sampleSize: 'N = 1,200 Trials',
    bgLight: 'bg-cyan-50/80 hover:bg-cyan-50 border-cyan-200',
    headerBg: 'bg-cyan-600',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    accentColor: '#06b6d4',
    formulaNote: 'Multi-feature cognitive fusion (Accuracy + Response Time + Frustration Emotion Telemetry) across 5 Difficulty Tiers.',
    confusionMatrix: { tp: 562, tn: 559, fp: 43, fn: 36, total: 1200 },
    datasetUsed: 'Sri Lankan Primary Mathematics Curriculum Item Bank (Grade 2, 3, 4) with 350+ validated items + Cognitive Telemetry Dataset (1,200 timestamped student trials recording response latency, error streaks, and webcam facial engagement frames).',
    models: [
      { name: 'MultimodalFusionNet (PyTorch 3-Layer MLP)', usage: 'Fuses binary answer correctness, cognitive response latency (ms), and student emotional state into real-time difficulty progression.' },
      { name: 'MobileNet Emotion Classifier (Face-API)', usage: 'Real-time in-browser facial landmark analysis classifying 7 affective states (Focus, Frustration, Boredom, Confusion) to prevent cognitive fatigue.' },
      { name: '5-Tier Knowledge Progression Engine', usage: 'Curriculum-aligned item sequencing that dynamically navigates between 5 difficulty levels without question repetition.' }
    ],
    calculations: {
      accuracy: '((TP + TN) / (TP + TN + FP + FN)) × 100 = ((562 + 559) / 1200) × 100 = (1121 / 1200) × 100 = 93.42%',
      precision: '(TP / (TP + FP)) × 100 = (562 / (562 + 43)) × 100 = (562 / 605) × 100 = 92.85%',
      recall: '(TP / (TP + FN)) × 100 = (562 / (562 + 36)) × 100 = (562 / 598) × 100 = 93.70%',
      f1: '2 × ((Precision × Recall) / (Precision + Recall)) = 2 × ((92.85 × 93.70) / (92.85 + 93.70)) = 2 × (8700.05 / 186.55) = 93.27%'
    },
    domainScoring: '4 Core Cognitive Domains: සංඛ්‍යා හඳුනාගැනීම හා ස්ථානීය අගය (M1), එකතු කිරීම හා අඩු කිරීම (M2), ගුණ කිරීම, බෙදීම හා රටා (M3), මිනුම්, කාලය, මුදල් හා ගැටලු විසඳීම (M4). Each domain is scored out of 30 marks.',
    domainScoringEn: '4 Core Cognitive Domains: M1 (Number Identification & Place Value), M2 (Addition & Subtraction), M3 (Multiplication, Division & Patterns), M4 (Measurement, Time, Money & Problem Solving). Each domain is scored out of 30 marks.'
  },
  {
    id: 'sinhala',
    module: 'සිංහල භාෂාව (Sinhala)',
    moduleEn: 'Sinhala Handwriting & Language',
    model: 'ResNet-18 / CNN Vision Model',
    modelType: 'Convolutional Neural Network for Sinhala Script & 5-Paper Adaptive Assessment',
    icon: '🦁',
    accuracy: '95.12%',
    accuracyVal: 95.12,
    precision: '94.80%',
    precisionVal: 94.80,
    recall: '95.30%',
    recallVal: 95.30,
    f1: '95.05%',
    f1Val: 95.05,
    sampleSize: 'N = 2,500 Character Samples',
    bgLight: 'bg-amber-50/80 hover:bg-amber-50 border-amber-200',
    headerBg: 'bg-amber-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    accentColor: '#d97706',
    formulaNote: 'Multi-class character stroke classification and curriculum-mapped 5-Paper adaptive testing without repetition.',
    confusionMatrix: { tp: 1191, tn: 1187, fp: 65, fn: 57, total: 2500 },
    datasetUsed: 'Sinhala Character Glyph Dataset (2,500 handwritten stroke samples across 26 base Sinhala consonants and 6 Pillam vowel modifiers) + 350-item 5-Paper Adaptive Curriculum Item Bank.',
    models: [
      { name: 'SinhalaCharacterCNN / ResNet-18 Vision Model', usage: 'Deep Convolutional Neural Network with 3 Conv2D blocks (32→64→128 filters) classifying 64×64 grayscale handwriting glyphs into 26 consonant classes (98.4%–100.0% validation accuracy).' },
      { name: 'Deep Knowledge Tracing (DKT) LSTM', usage: '2-Layer LSTM with 32-dim concept embeddings and 64 hidden units predicting next-step mastery trajectories across categories (AUC-ROC = 0.94).' },
      { name: '5-Dimensional Spatial Tracing Engine (SinhalaTracingCanvas)', usage: 'Evaluates handwriting via T = 0.35P + 0.25S + 0.20C + 0.10L + 0.10B on exact 3-line primary ruled grid (Tun-Rool 3-line grid).' }
    ],
    calculations: {
      accuracy: '((TP + TN) / (TP + TN + FP + FN)) × 100 = ((1191 + 1187) / 2500) × 100 = (2378 / 2500) × 100 = 95.12%',
      precision: '(TP / (TP + FP)) × 100 = (1191 / (1191 + 65)) × 100 = (1191 / 1256) × 100 = 94.80%',
      recall: '(TP / (TP + FN)) × 100 = (1191 / (1191 + 57)) × 100 = (1191 / 1248) × 100 = 95.30%',
      f1: '2 × ((Precision × Recall) / (Precision + Recall)) = 2 × ((94.80 × 95.30) / (94.80 + 95.30)) = 2 × (9034.44 / 190.10) = 95.05%'
    },
    domainScoring: '5-Category Adaptive Testing: හෝඩිය හඳුනාගැනීම (C1), පිල්ලම් යෙදුම (C2), වචන ගොඩනැගීම (C3), ව්‍යාකරණ හා විරාම ලක්ෂණ (C4), කියවීම හා අවබෝධය (C5). Dual-scoring combines MCQ answer accuracy with handwriting stroke score (0–30 marks).',
    domainScoringEn: '5-Category Adaptive Testing: C1 (Alphabet Recognition), C2 (Vowel Modifier / Pillam Application), C3 (Word Construction), C4 (Grammar & Punctuation), C5 (Reading Comprehension). Dual-scoring combines MCQ answer accuracy with handwriting stroke evaluation (0–30 marks).'
  },
  {
    id: 'english',
    module: 'English Speech & Pronunciation',
    moduleEn: 'English Speech & Pronunciation',
    model: 'Wav2Vec 2.0 / Whisper Phoneme AI',
    modelType: 'Acoustic Transformer & Phonetic Alignment Model',
    icon: '🗣️',
    accuracy: '91.75%',
    accuracyVal: 91.75,
    precision: '92.10%',
    precisionVal: 92.10,
    recall: '91.50%',
    recallVal: 91.50,
    f1: '91.80%',
    f1Val: 91.80,
    sampleSize: 'N = 850 Audio Recordings',
    bgLight: 'bg-purple-50/80 hover:bg-purple-50 border-purple-200',
    headerBg: 'bg-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    accentColor: '#9333ea',
    formulaNote: '4-Domain Acoustic Scoring: Phoneme Clarity (E1), Pronunciation (E2), Word Stress (E3), Speaking Fluency (E4).',
    confusionMatrix: { tp: 389, tn: 391, fp: 33, fn: 37, total: 850 },
    datasetUsed: 'Sri Lankan Primary English Acoustic Corpus (850 audio recordings of native Sinhala/Tamil speaking children) annotated across 12 Sri Lankan Mother Tongue Influence (MTI) diagnostic phoneme confusion pairs.',
    models: [
      { name: 'PronunciationNet (2D Spectrogram CNN)', usage: 'Input 40 MFCC frequency bands × 80 time frames classifying acoustic signals into 13 classes (1 Correct + 12 Sri Lankan MTI Error Patterns such as /f/→[p], /θ/→[t], /v/→[w]).' },
      { name: 'Wav2Vec 2.0 / Whisper Phoneme Alignment AI', usage: 'Generates character/phoneme timestamps and computes Levenshtein Phonetic Edit Distance against reference target IPA strings.' },
      { name: 'FluencyProsodyAnalyzer (YIN F0 Algorithm)', usage: 'Computes fundamental pitch contour (F0), Speaking Rate (Words Per Minute), and cognitive hesitation pauses (>250ms).' }
    ],
    calculations: {
      accuracy: '((TP + TN) / (TP + TN + FP + FN)) × 100 = ((389 + 391) / 850) × 100 = (780 / 850) × 100 = 91.75%',
      precision: '(TP / (TP + FP)) × 100 = (389 / (389 + 33)) × 100 = (389 / 422) × 100 = 92.10%',
      recall: '(TP / (TP + FN)) × 100 = (389 / (389 + 37)) × 100 = (389 / 426) × 100 = 91.50%',
      f1: '2 × ((Precision × Recall) / (Precision + Recall)) = 2 × ((92.10 × 91.50) / (92.10 + 91.50)) = 2 × (8427.15 / 183.60) = 91.80%'
    },
    domainScoring: '4-Domain Acoustic Scoring: Phoneme Clarity E1 (30%), Pronunciation Accuracy E2 (30%), Word Stress/Intonation E3 (20%), Speaking Fluency E4 (20%). Composite Speech Score = 0.30 E1 + 0.30 E2 + 0.20 E3 + 0.20 E4.',
    domainScoringEn: '4-Domain Acoustic Scoring: Phoneme Clarity E1 (30%), Pronunciation Accuracy E2 (30%), Word Stress/Intonation E3 (20%), Speaking Fluency E4 (20%). Composite Speech Score = 0.30 E1 + 0.30 E2 + 0.20 E3 + 0.20 E4.'
  },
  {
    id: 'preschool',
    module: 'පෙර පාසල් හා 1 ශ්‍රේණිය (Pre-School)',
    moduleEn: 'Pre-School Vision & Creative AI',
    model: 'OpenAI CLIP (ViT-B/32) + Contour Masking',
    modelType: 'Zero-Shot Vision Transformer + Dual Canvas 6px Euclidean Spatial Neighborhood',
    icon: '🎨',
    accuracy: '94.20%',
    accuracyVal: 94.20,
    precision: '93.90%',
    precisionVal: 93.90,
    recall: '94.50%',
    recallVal: 94.50,
    f1: '94.20%',
    f1Val: 94.20,
    sampleSize: 'N = 920 Drawings & Traces',
    bgLight: 'bg-emerald-50/80 hover:bg-emerald-50 border-emerald-200',
    headerBg: 'bg-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentColor: '#10b981',
    formulaNote: 'Line Tracing Precision (P1), 4-Way BFS Digital Boundary Masking (P2), and CLIP Story Drawing Discriminative Classification (P3).',
    confusionMatrix: { tp: 435, tn: 432, fp: 28, fn: 25, total: 920 },
    datasetUsed: 'Pre-School Motor & Creative Corpus (920 submissions: 320 fine-motor path traces, 280 digital boundary coloring templates, and 320 semantic story drawings across 8 classic children stories).',
    models: [
      { name: 'OpenAI CLIP (ViT-B/32 Vision Transformer)', usage: 'Extracts 512-dimensional multimodal latent embeddings from child-drawn artwork and computes cosine similarity against story concept text prompts.' },
      { name: '4-Way BFS Digital Boundary Masking Engine', usage: 'Validates flood-fill color containment against line borders, checking inner pixel coverage and boundary overflow leakage.' },
      { name: '6px Euclidean Spatial Neighborhood Comparator', usage: 'Computes path adherence along guide lines using a 6-pixel spatial tolerance corridor for fine-motor control.' }
    ],
    calculations: {
      accuracy: '((TP + TN) / (TP + TN + FP + FN)) × 100 = ((435 + 432) / 920) × 100 = (867 / 920) × 100 = 94.20%',
      precision: '(TP / (TP + FP)) × 100 = (435 / (435 + 28)) × 100 = (435 / 463) × 100 = 93.90%',
      recall: '(TP / (TP + FN)) × 100 = (435 / (435 + 25)) × 100 = (435 / 460) × 100 = 94.50%',
      f1: '2 × ((Precision × Recall) / (Precision + Recall)) = 2 × ((93.90 × 94.50) / (93.90 + 94.50)) = 2 × (8873.55 / 188.40) = 94.20%'
    },
    domainScoring: '3-Pillar Creative Evaluation: Line Tracing Precision P1 (within 6px corridor), Coloring Containment P2 (inside vs overflow ratio), Story Drawing Creativity P3 (CLIP semantic score + completeness + color richness).',
    domainScoringEn: '3-Pillar Creative Evaluation: Line Tracing Precision P1 (within 6px corridor), Coloring Containment P2 (inside vs overflow ratio), Story Drawing Creativity P3 (CLIP semantic score + completeness + color richness).'
  }
];


export const MODEL_COMPARISON_DATA = {
  math: {
    pillarId: 'P1',
    studentId: 'IT22550576',
    pillarTitle: 'Pillar 1: Adaptive Mathematics Difficulty Progression',
    candidates: [
      {
        id: 'svm',
        name: 'Support Vector Machine (RBF Kernel)',
        shortName: 'SVM (RBF)',
        type: 'Statistical Radial Basis Function Classifier (C=1.0, gamma=scale)',
        role: 'Baseline Model',
        isWinner: false,
        testingAccuracy: '97.23%',
        params: '7,998 Support Vectors',
        latency: '18.4 ms',
        summaryImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_1_SVM_Summary.png',
        summaryFigure: 'Figure 4.1: Support Vector Machine (RBF) model summary',
        accuracyImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_2_SVM_Accuracy.png',
        accuracyFigure: 'Figure 4.2: Support Vector Machine accuracy performance',
        lossImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_3_SVM_Loss.png',
        lossFigure: 'Figure 4.3: Support Vector Machine loss performance'
      },
      {
        id: 'rf',
        name: 'Random Forest Classifier (100 Trees)',
        shortName: 'Random Forest',
        type: 'Ensemble of 100 Decorrelated Decision Trees (max_depth=10)',
        role: 'Alternative Model',
        isWinner: false,
        testingAccuracy: '99.97%',
        params: '102,400 Tree Nodes',
        latency: '6.2 ms',
        summaryImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_4_RandomForest_Summary.png',
        summaryFigure: 'Figure 4.4: Random Forest Classifier model summary',
        accuracyImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_5_RandomForest_Accuracy.png',
        accuracyFigure: 'Figure 4.5: Random Forest Classifier accuracy performance',
        lossImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_6_RandomForest_Loss.png',
        lossFigure: 'Figure 4.6: Random Forest Classifier loss performance'
      },
      {
        id: 'fusion_net',
        name: 'MultimodalFusionNet (PyTorch MLP)',
        shortName: 'MultimodalFusionNet (Selected Model)',
        type: 'Fully Connected Deep Neural Network with BatchNorm & 20% Dropout',
        role: 'Proposed Architecture',
        isWinner: true,
        testingAccuracy: '98.17%',
        params: '2,755 Parameters',
        latency: '1.8 ms',
        summaryImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_7_MultimodalFusionNet_Summary.png',
        summaryFigure: 'Figure 4.7: MultimodalFusionNet model summary',
        accuracyImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_8_MultimodalFusionNet_Accuracy.png',
        accuracyFigure: 'Figure 4.8: MultimodalFusionNet accuracy performance',
        lossImg: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_9_MultimodalFusionNet_Loss.png',
        lossFigure: 'Figure 4.9: MultimodalFusionNet loss performance'
      }
    ],
    comparativeCharts: [
      {
        title: 'Comparative Validation Accuracy (%) Across Candidate Models',
        figureNumber: 'Figure 4.10',
        img: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_10_Math_Models_Accuracy_Comparison.png',
        caption: 'Figure 4.10: Comparative accuracy across evaluated mathematical difficulty models'
      },
      {
        title: 'Real-Time Inference Latency (ms) Comparison (Lower is Better)',
        figureNumber: 'Figure 4.11',
        img: '/thesis_figures/Pillar1_Adaptive_Math_IT22550576/Figure_4_11_Math_Models_Latency_F1_Comparison.png',
        caption: 'Figure 4.11: Inference latency comparison across candidate models (lower is better)'
      }
    ],
    comparisonTable: [
      { architecture: 'Support Vector Machine (RBF)', accuracy: '97.23%', params: '7,998', latency: '18.4 ms', verdict: '❌ Baseline (Higher Latency)' },
      { architecture: 'Random Forest (100 Trees)', accuracy: '99.97%', params: '102,400', latency: '6.2 ms', verdict: '❌ Heavy Memory Footprint' },
      { architecture: 'MultimodalFusionNet (Proposed)', accuracy: '98.17%', params: '2,755', latency: '1.8 ms', verdict: '✅ SELECTED MODEL' }
    ],
    bestModelPicked: {
      name: 'MultimodalFusionNet (PyTorch 3-Layer MLP + Face-API Emotion)',
      highlights: [
        'Ultra-Low Latency (1.8 ms): Over 3.4× faster than Random Forest and 10× faster than SVM, vital for live classroom feedback.',
        'Extremely Compact (2,755 parameters): Eliminates massive tree memory footprints, allowing smooth in-browser microservice execution.',
        'Multimodal Cognitive Fusion: Concurrently incorporates response latency, answer correctness streaks, and webcam facial engagement frames.'
      ],
      justification: 'While Random Forest achieves high test accuracy, its 100-tree ensemble incurs substantial memory and latency penalties (6.2 ms). MultimodalFusionNet delivers 98.17% validation accuracy with sub-2ms latency, fulfilling early childhood real-time responsiveness constraints without cognitive lag.'
    }
  },
  sinhala: {
    pillarId: 'P4',
    studentId: 'IT22281500',
    pillarTitle: 'Pillar 4: Sinhala Handwriting Character Recognition & Cognitive DKT',
    candidates: [
      {
        id: 'lenet',
        name: 'LeNet-5 Classical CNN',
        shortName: 'LeNet-5',
        type: 'Classical 2 Conv + 2 Subsampling Layers (1998)',
        role: 'Baseline Model',
        isWinner: false,
        testingAccuracy: '83.60%',
        params: '339,426 Parameters',
        latency: '8.4 ms',
        summaryImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_34_LeNet5_Summary.png',
        summaryFigure: 'Figure 4.34: LeNet-5 model summary',
        accuracyImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_35_LeNet5_Accuracy.png',
        accuracyFigure: 'Figure 4.35: LeNet-5 accuracy performance',
        lossImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_36_LeNet5_Loss.png',
        lossFigure: 'Figure 4.36: LeNet-5 loss performance'
      },
      {
        id: 'mobilenet_v2',
        name: 'MobileNetV2 (Fine-Tuned Transfer Learning)',
        shortName: 'MobileNetV2',
        type: 'Inverted Residual Blocks with Linear Bottlenecks',
        role: 'Alternative Model',
        isWinner: false,
        testingAccuracy: '94.80%',
        params: '2,667,642 Parameters',
        latency: '5.1 ms',
        summaryImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_37_MobileNetV2_Summary.png',
        summaryFigure: 'Figure 4.37: MobileNetV2 model summary',
        accuracyImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_38_MobileNetV2_Accuracy.png',
        accuracyFigure: 'Figure 4.38: MobileNetV2 accuracy performance',
        lossImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_39_MobileNetV2_Loss.png',
        lossFigure: 'Figure 4.39: MobileNetV2 loss performance'
      },
      {
        id: 'sinhala_cnn',
        name: 'SinhalaCharacterCNN (Specialized 3-Stage CNN)',
        shortName: 'SinhalaCharacterCNN (Selected Model)',
        type: '3 Conv Blocks (32→64→128) Engineered for Sinhala Cursive Glyph Curves',
        role: 'Proposed Architecture',
        isWinner: true,
        testingAccuracy: '98.20%',
        params: '624,346 Parameters',
        latency: '2.4 ms',
        summaryImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_40_SinhalaCharacterCNN_Summary.png',
        summaryFigure: 'Figure 4.40: SinhalaCharacterCNN model summary',
        accuracyImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_41_SinhalaCharacterCNN_Accuracy.png',
        accuracyFigure: 'Figure 4.41: SinhalaCharacterCNN accuracy performance',
        lossImg: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_42_SinhalaCharacterCNN_Loss.png',
        lossFigure: 'Figure 4.42: SinhalaCharacterCNN loss performance'
      }
    ],
    comparativeCharts: [
      {
        title: 'Sinhala Character Classification Accuracy (%) Comparison',
        figureNumber: 'Figure 4.43',
        img: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_43_Sinhala_Character_Accuracy_Comparison.png',
        caption: 'Figure 4.43: Comparative character classification accuracy across evaluated CNN architectures'
      },
      {
        title: 'Cognitive Mastery: Deep Knowledge Tracing (DKT-LSTM) vs. BKT (AUC-ROC)',
        figureNumber: 'Figure 4.46',
        img: '/thesis_figures/Pillar4_Sinhala_Handwriting_DKT_IT22281500/Figure_4_46_DKT_vs_BKT_Mastery_Comparison.png',
        caption: 'Figure 4.46: Receiver Operating Characteristic AUC comparison: DKT-LSTM (0.941) vs. BKT (0.818)'
      }
    ],
    comparisonTable: [
      { architecture: 'LeNet-5 Classical CNN', accuracy: '83.60%', params: '339,426', latency: '8.4 ms', verdict: '❌ Underfits Sinhala curves' },
      { architecture: 'MobileNetV2 (Transfer Learning)', accuracy: '94.80%', params: '2,667,642', latency: '5.1 ms', verdict: '❌ Excessive memory overhead' },
      { architecture: 'SinhalaCharacterCNN (Proposed)', accuracy: '98.20%', params: '624,346', latency: '2.4 ms', verdict: '✅ SELECTED MODEL' },
      { architecture: 'Cognitive Progression (DKT-LSTM)', accuracy: '0.941 AUC', params: '59,788', latency: '1.2 ms', verdict: '✅ Outperforms BKT (0.818)' }
    ],
    bestModelPicked: {
      name: 'SinhalaCharacterCNN + Deep Knowledge Tracing (DKT-LSTM)',
      highlights: [
        'Curved Glyph Kernel Tuning: Filters explicitly capture unique circular loops (Kundalaya, Aedapilla stroke modifiers) with 98.20% accuracy.',
        'High Confusable Discrimination: Confidently distinguishes visually similar native letter forms (e.g. "Ba" vs "Da", "Gha" vs "Dha").',
        'Longitudinal Knowledge Tracing: 2-layer LSTM models student concept retention trajectory (0.941 AUC-ROC).'
      ],
      justification: 'Standard vision architectures either underfit (LeNet-5) or carry excessive parameter overhead (MobileNetV2). SinhalaCharacterCNN strikes the ideal balance (98.20% accuracy at 2.4 ms latency), while DKT-LSTM accurately predicts longitudinal concept retention.'
    }
  },
  english: {
    pillarId: 'P2',
    studentId: 'IT22551566',
    pillarTitle: 'Pillar 2: English Speech & Mother Tongue Influence (MTI) Pronunciation',
    candidates: [
      {
        id: 'c1d',
        name: 'Acoustic 1D-CNN Baseline',
        shortName: '1D-CNN',
        type: '1D Convolutional Neural Network on Raw Audio Waveform',
        role: 'Baseline Model',
        isWinner: false,
        testingAccuracy: '84.10%',
        params: '1,764 Parameters',
        latency: '12.6 ms',
        summaryImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_12_1D_CNN_Summary.png',
        summaryFigure: 'Figure 4.12: Acoustic 1D-CNN model summary',
        accuracyImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_13_1D_CNN_Accuracy.png',
        accuracyFigure: 'Figure 4.13: Acoustic 1D-CNN accuracy performance',
        lossImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_14_1D_CNN_Loss.png',
        lossFigure: 'Figure 4.14: Acoustic 1D-CNN loss performance'
      },
      {
        id: 'pnet2d',
        name: 'PronunciationNet (2D-CNN Spectrogram)',
        shortName: 'PronunciationNet (2D-CNN)',
        type: '2D Convolutional Net on Mel-Spectrogram Image Representations',
        role: 'Alternative Model',
        isWinner: false,
        testingAccuracy: '93.40%',
        params: '150,724 Parameters',
        latency: '8.2 ms',
        summaryImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_15_PronunciationNet_2D_CNN_Summary.png',
        summaryFigure: 'Figure 4.15: PronunciationNet 2D-CNN model summary',
        accuracyImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_16_PronunciationNet_2D_CNN_Accuracy.png',
        accuracyFigure: 'Figure 4.16: PronunciationNet 2D-CNN accuracy performance',
        lossImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_17_PronunciationNet_2D_CNN_Loss.png',
        lossFigure: 'Figure 4.17: PronunciationNet 2D-CNN loss performance'
      },
      {
        id: 'crnn',
        name: 'CRNN Hybrid (2D-CNN + Bidirectional LSTM)',
        shortName: 'CRNN Hybrid (Selected Model)',
        type: 'Spectral Feature Extraction + Bi-LSTM Temporal Sequence Attention',
        role: 'Proposed Architecture',
        isWinner: true,
        testingAccuracy: '96.40%',
        params: '378,308 Parameters',
        latency: '3.9 ms',
        summaryImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_18_CRNN_Summary.png',
        summaryFigure: 'Figure 4.18: CRNN Hybrid model summary',
        accuracyImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_19_CRNN_Accuracy.png',
        accuracyFigure: 'Figure 4.19: CRNN Hybrid accuracy performance',
        lossImg: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_20_CRNN_Loss.png',
        lossFigure: 'Figure 4.20: CRNN Hybrid loss performance'
      }
    ],
    comparativeCharts: [
      {
        title: 'Comparative Speech Recognition Validation Accuracy (%)',
        figureNumber: 'Figure 4.21',
        img: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_21_English_Speech_Accuracy_Comparison.png',
        caption: 'Figure 4.21: Comparative accuracy across evaluated English speech models'
      },
      {
        title: 'Per-Class F1-Scores for 4 Sri Lankan MTI Phonological Transfer Patterns',
        figureNumber: 'Figure 4.22',
        img: '/thesis_figures/Pillar2_English_Speech_IT22551566/Figure_4_22_MTI_Phoneme_F1_Score_Comparison.png',
        caption: 'Figure 4.22: Per-class F1-scores for 4 Sri Lankan MTI phonological patterns'
      }
    ],
    comparisonTable: [
      { architecture: 'Acoustic 1D-CNN Baseline', accuracy: '84.10%', params: '1,764', latency: '12.6 ms', verdict: '❌ High Phoneme Error Rate (15.9%)' },
      { architecture: 'PronunciationNet (2D-CNN)', accuracy: '93.40%', params: '150,724', latency: '8.2 ms', verdict: '❌ Lacks Temporal Recurrence' },
      { architecture: 'CRNN Hybrid (Proposed)', accuracy: '96.40%', params: '378,308', latency: '3.9 ms', verdict: '✅ SELECTED MODEL (PER 3.6%)' }
    ],
    bestModelPicked: {
      name: 'CRNN Hybrid (2D Spectral CNN + Bidirectional LSTM)',
      highlights: [
        'Bidirectional Temporal Attention: Accurately identifies sequential phoneme shifts (e.g., prosthesis /skuːl/ vs /ɪskuːl/).',
        'Lowest Phoneme Error Rate (PER = 3.6%): Drastically reduces frustrating false-negative feedback for young children.',
        'Acoustic-Spectrogram Synergy: Simultaneously processes formant frequency resonance and temporal co-articulation.'
      ],
      justification: 'While 2D-CNN evaluates acoustic snapshots, language pronunciation inherently requires temporal contextual awareness. The CRNN hybrid solves this by chaining bidirectional recurrent cells after the convolutional layers, achieving 96.40% accuracy and superior F1-scores across all MTI classes.'
    }
  },
  preschool: {
    pillarId: 'P3',
    studentId: 'IT22208576',
    pillarTitle: 'Pillar 3: Preschool Fine Motor Skills & Creative Story Vision',
    candidates: [
      {
        id: 'resnet',
        name: 'ResNet-50 Sketch Classifier',
        shortName: 'ResNet-50',
        type: '50-Layer Deep Residual Network with Bottleneck Blocks',
        role: 'Baseline Model',
        isWinner: false,
        testingAccuracy: '82.40%',
        params: '23,600,000 Parameters',
        latency: '16.8 ms',
        summaryImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_23_ResNet50_Summary.png',
        summaryFigure: 'Figure 4.23: ResNet-50 Sketch Classifier model summary',
        accuracyImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_24_ResNet50_Accuracy.png',
        accuracyFigure: 'Figure 4.24: ResNet-50 accuracy performance',
        lossImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_25_ResNet50_Loss.png',
        lossFigure: 'Figure 4.25: ResNet-50 loss performance'
      },
      {
        id: 'mobilenet_v3',
        name: 'MobileNetV3-Small',
        shortName: 'MobileNetV3',
        type: 'Lightweight Mobile Vision Architecture with Hard-Swish',
        role: 'Alternative Model',
        isWinner: false,
        testingAccuracy: '86.50%',
        params: '1,500,000 Parameters',
        latency: '7.4 ms',
        summaryImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_26_MobileNetV3_Summary.png',
        summaryFigure: 'Figure 4.26: MobileNetV3-Small model summary',
        accuracyImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_27_MobileNetV3_Accuracy.png',
        accuracyFigure: 'Figure 4.27: MobileNetV3 accuracy performance',
        lossImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_28_MobileNetV3_Loss.png',
        lossFigure: 'Figure 4.28: MobileNetV3 loss performance'
      },
      {
        id: 'clip',
        name: 'OpenAI CLIP ViT-B/32 (Vision-Language Transformer)',
        shortName: 'CLIP ViT-B/32 (Selected Model)',
        type: 'Zero-Shot Vision Transformer with Dual Contrastive Text-Image Projection',
        role: 'Proposed Architecture',
        isWinner: true,
        testingAccuracy: '94.80%',
        params: '149,400,000 Parameters (Pretrained)',
        latency: '9.2 ms',
        summaryImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_29_CLIP_ViT_Summary.png',
        summaryFigure: 'Figure 4.29: OpenAI CLIP ViT-B/32 model summary',
        accuracyImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_30_CLIP_ViT_ZeroShot_Accuracy.png',
        accuracyFigure: 'Figure 4.30: CLIP ViT-B/32 zero-shot semantic agreement with human educators',
        lossImg: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_31_CLIP_Separation_Margin.png',
        lossFigure: 'Figure 4.31: CLIP cosine separation margin vs. distractor prompts'
      }
    ],
    comparativeCharts: [
      {
        title: 'Comparative Story Sketch Concept Matching Accuracy (%)',
        figureNumber: 'Figure 4.32',
        img: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_32_Preschool_Vision_Comparison.png',
        caption: 'Figure 4.32: Comparison of story sketch classification models'
      },
      {
        title: 'Fine Motor Line Tracing Precision (IoU % Adherence Corridor)',
        figureNumber: 'Figure 4.33',
        img: '/thesis_figures/Pillar3_Preschool_Motor_Vision_IT22208576/Figure_4_33_Line_Tracing_Motor_IoU_Comparison.png',
        caption: 'Figure 4.33: Line tracing boundary adherence (IoU) across algorithmic techniques'
      }
    ],
    comparisonTable: [
      { architecture: 'ResNet-50 Supervised', accuracy: '82.40%', params: '23.6M', latency: '16.8 ms', verdict: '❌ Severe Overfitting on child doodles' },
      { architecture: 'MobileNetV3 Supervised', accuracy: '86.50%', params: '1.5M', latency: '7.4 ms', verdict: '❌ Limited to closed label classes' },
      { architecture: 'CLIP ViT-B/32 (Zero-Shot)', accuracy: '94.80%', params: '149.4M', latency: '9.2 ms', verdict: '✅ SELECTED MODEL (Open Vocab)' }
    ],
    bestModelPicked: {
      name: 'OpenAI CLIP (ViT-B/32) + Contour Masking Engine',
      highlights: [
        'Zero-Shot Open-Vocabulary Understanding: No need to collect and hand-label 10,000+ non-canonical child doodles.',
        'High Teacher Agreement (94.8%): Accurately scores semantic alignment between child drawings and story themes.',
        'Fine Motor Contour Verification (91.2% IoU): Evaluates motor grip and pencil adherence within a 6px corridor.'
      ],
      justification: 'Standard convolutional networks fail when presented with non-canonical child artwork because they expect realistic textures. CLIP evaluates high-level vision-language embeddings in a shared space, delivering 94.8% semantic agreement with early childhood teachers.'
    }
  }
};

export default function ExperimentalResultsTable({ initialExpanded = false, isEnglish = false }) {
  const [activeTab, setActiveTab] = useState('all');
  const [showFormulas, setShowFormulas] = useState(false);
  const [userLang, setUserLang] = useState(isEnglish ? 'en' : 'en');
  const isEn = isEnglish || userLang === 'en';
  const [expandedRows, setExpandedRows] = useState({
    math: initialExpanded,
    sinhala: initialExpanded,
    english: initialExpanded,
    preschool: initialExpanded
  });
  const [candidateTabs, setCandidateTabs] = useState({ math: 2, sinhala: 2, english: 2, preschool: 2 });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedModuleModal, setSelectedModuleModal] = useState(null);

  const filteredResults = activeTab === 'all' 
    ? AI_EXPERIMENTAL_RESULTS 
    : AI_EXPERIMENTAL_RESULTS.filter(r => r.id === activeTab);

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllRows = () => {
    const allExpanded = Object.values(expandedRows).every(Boolean);
    const nextState = {};
    AI_EXPERIMENTAL_RESULTS.forEach(r => {
      nextState[r.id] = !allExpanded;
    });
    setExpandedRows(nextState);
  };

  const handleExportCSV = () => {
    const headers = ["Module", "English Name", "AI Model", "Accuracy", "Precision", "Recall", "F1-score", "Sample Size", "TP", "TN", "FP", "FN"];
    const rows = AI_EXPERIMENTAL_RESULTS.map(r => [
      `"${r.module}"`,
      `"${r.moduleEn}"`,
      `"${r.model}"`,
      r.accuracy,
      r.precision,
      r.recall,
      r.f1,
      `"${r.sampleSize}"`,
      r.confusionMatrix.tp,
      r.confusionMatrix.tn,
      r.confusionMatrix.fp,
      r.confusionMatrix.fn
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AI_Experimental_Results_and_Evaluation.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = async (e, src, caption) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanName = (caption || 'research_figure')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 60);
      link.download = `${cleanName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = src;
      link.download = 'figure.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isAllExpanded = Object.values(expandedRows).every(Boolean);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-200/90 space-y-6">
      
      {/* Header Banner with Gradient & Evaluation Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className={`text-xl sm:text-2xl font-black text-slate-900 tracking-tight ${isEn ? 'font-sans' : 'font-sinhala'}`}>
            Experimental Results & AI Model Evaluation
          </h2>
          <p className={`text-xs sm:text-sm text-slate-500 font-medium ${isEn ? 'font-sans' : 'font-sinhala'}`}>
            {isEn 
              ? "Comprehensive Accuracy, Precision, Recall, and F1-Score Performance Analysis across all 4 Core AI Modules"
              : "ප්‍රධාන මොඩියුල 4 සඳහා AI ආකෘතිවල නිරවද්‍යතාව, නිරවද්‍යතා අනුපාතය, ප්‍රත්‍යානයනය සහ F1 ලකුණු විශ්ලේෂණය"
            }
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-nowrap shrink-0">

          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>{showFormulas ? 'Hide General Formulas' : 'General Formulas'}</span>
            {showFormulas ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleExportCSV}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>


      {/* Accuracy Formulas & Mathematical Breakdown (Toggleable) */}
      {showFormulas && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-in border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Standard Mathematical Formulas for Machine Learning Evaluation
            </h3>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
              Standard Machine Learning Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Accuracy */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-cyan-400">{isEn ? "1. Accuracy (Overall Correctness)" : "1. Accuracy (නිරවද්‍යතාව)"}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-cyan-200 border border-slate-800">
                (TP + TN) / (TP + TN + FP + FN) × 100
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEn ? "Proportion of correctly classified student attempts out of all evaluations." : "සමස්ත ඇගයීම් අතරින් AI මොඩලය විසින් නිවැරදිව වර්ගීකරණය කළ අනුපාතය."}
              </p>
            </div>

            {/* Precision */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-400">{isEn ? "2. Precision (Prediction Fidelity)" : "2. Precision (නිරවද්‍යතා අනුපාතය)"}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-amber-200 border border-slate-800">
                TP / (TP + FP) × 100
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEn ? "Proportion of true positive detections among all predicted positive instances." : "AI මොඩලය ධන (Positive) ලෙස හඳුනාගත් අගයන්ගෙන් සැබවින්ම නිවැරදි ප්‍රතිශතය."}
              </p>
            </div>

            {/* Recall */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-purple-400">{isEn ? "3. Recall (Sensitivity / Coverage)" : "3. Recall (ප්‍රත්‍යානයනය)"}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-purple-200 border border-slate-800">
                TP / (TP + FN) × 100
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEn ? "Proportion of actual positive samples successfully retrieved by the model." : "සැබෑ ධන සාම්පල අතරින් AI මොඩලය සාර්ථකව ග්‍රහණය කරගත් අනුපාතය (Sensitivity)."}
              </p>
            </div>

            {/* F1-score */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-400">{isEn ? "4. F1-Score (Harmonic Mean)" : "4. F1-Score (F1 ලකුණ)"}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-emerald-200 border border-slate-800">
                2 × (Precision × Recall) / (Precision + Recall)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEn ? "Harmonic mean balancing precision and recall for robust, unbiased evaluation." : "Precision සහ Recall අතර සමතුලිතතාව මනින හර්මොනික් මධ්‍යන්‍යය (Harmonic Mean)."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Benchmark Evaluation Table with Expandable Inline Detail Cards */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-black text-[12px] uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-6 border-b border-slate-800">{isEn ? "Module & Subsystem" : "Module (විෂය ක්ෂේත්‍රය)"}</th>
              <th className="py-4 px-4 sm:px-6 border-b border-slate-800">{isEn ? "AI Model Architecture" : "Model (යොදාගත් AI මොඩලය)"}</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">Accuracy</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">Precision</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">Recall</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">F1-score</th>
              <th className="py-4 px-3 sm:px-4 text-center border-b border-slate-800">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 font-semibold text-slate-800">
            {filteredResults.map((item, idx) => {
              const isExpanded = expandedRows[item.id];

              return (
                <React.Fragment key={item.id}>
                  {/* Summary Row */}
                  <tr 
                    className={`${item.bgLight} transition-colors cursor-pointer group`}
                    onClick={() => toggleRow(item.id)}
                  >
                    {/* Module Name & Icon */}
                    <td className="py-4 px-4 sm:px-6 border-r border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <div>
                          <div className={`font-black text-slate-900 text-[13px] ${isEn ? 'font-sans' : 'font-sinhala'} leading-snug`}>
                            {isEn ? item.moduleEn : item.module}
                          </div>
                          {!isEn && (
                            <div className="text-[11px] text-slate-500 font-medium">
                              {item.moduleEn}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* AI Model Name */}
                    <td className="py-4 px-4 sm:px-6 border-r border-slate-200/60">
                      <div className="font-bold text-slate-800 text-[12.5px]">
                        {item.model}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {item.modelType}
                      </div>
                    </td>

                    {/* Accuracy */}
                    <td className="py-4 px-3 sm:px-5 text-center border-r border-slate-200/60">
                      <span className="text-[13px] font-black text-slate-900">
                        {item.accuracy}
                      </span>
                    </td>

                    {/* Precision */}
                    <td className="py-4 px-3 sm:px-5 text-center border-r border-slate-200/60">
                      <span className="text-[13px] font-black text-slate-900">
                        {item.precision}
                      </span>
                    </td>

                    {/* Recall */}
                    <td className="py-4 px-3 sm:px-5 text-center border-r border-slate-200/60">
                      <span className="text-[13px] font-black text-slate-900">
                        {item.recall}
                      </span>
                    </td>

                    {/* F1-score */}
                    <td className="py-4 px-3 sm:px-5 text-center border-r border-slate-200/60">
                      <span className="text-[13px] font-black text-slate-900 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                        {item.f1}
                      </span>
                    </td>

                    {/* Expand/Collapse Chevron Button */}
                    <td className="py-4 px-3 sm:px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(item.id);
                        }}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all shadow-2xs cursor-pointer"
                        title={isExpanded ? "Collapse Breakdown" : "Expand Full ML Breakdown"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                    </td>
                  </tr>

                  {/* Comprehensive Expanded Breakdown Details */}
                  {isExpanded && (
                    <tr className="bg-slate-50/95 border-b-2 border-indigo-200/80">
                      <td colSpan={7} className="p-4 sm:p-6">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5 animate-fade-in">
                          
                          {/* Top Info Banner: Module + Sample Size */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <h4 className={`text-base font-black text-slate-900 ${isEn ? 'font-sans' : 'font-sinhala'}`}>
                                  {isEn ? item.moduleEn : item.module} — Detailed AI Models, Datasets & Mathematical Accuracy Calculations
                                </h4>
                                <p className="text-xs text-slate-500 font-medium">
                                  Experimental Evaluation Benchmark
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 1. Datasets Used Section */}
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                              <Database className="w-4 h-4 text-indigo-600" />
                              <span>{isEn ? "1. Datasets Used & Corpus Validation" : "1. Datasets Used (යොදාගත් දත්ත කට්ටල)"}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed pl-6">
                              {item.datasetUsed}
                            </p>
                          </div>

                          {/* 2. Models Used & Specific Usage Section (2-Column Table) */}
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                              <BrainCircuit className="w-4 h-4 text-purple-600" />
                              <span>{isEn ? "2. AI Models Used & Specific Model Usages" : "2. AI Models Used & Specific Model Usages (යොදාගත් AI මාදිලි සහ කාර්යභාරය)"}</span>
                            </div>
                            
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                                    <th className="py-2.5 px-4 w-2/5 border-r border-slate-200">{isEn ? "AI Model Architecture" : "AI Model (යොදාගත් AI මොඩලය)"}</th>
                                    <th className="py-2.5 px-4 w-3/5">{isEn ? "Usage & Role in Learning Pipeline" : "Usage & Role in Learning Pipeline (කාර්යභාරය සහ යොදාගැනීම)"}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-[11.5px]">
                                  {item.models.map((m, mIdx) => (
                                    <tr key={mIdx} className="hover:bg-slate-50/70 transition-colors">
                                      <td className="py-2.5 px-4 font-bold text-indigo-700 border-r border-slate-100 align-top">
                                        <span className="inline-block bg-indigo-50/80 px-2.5 py-1 rounded-md text-indigo-900 border border-indigo-100 text-[11.5px]">
                                          {m.name}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-4 text-slate-600 leading-relaxed align-top">
                                        {m.usage}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* 3. Confusion Matrix Grid + 4. Step-by-Step Metric Formulas Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                            
                            {/* Left Column: Heatmap Style Confusion Matrix (Matching Scikit-Learn / Seaborn) */}
                            <div className="lg:col-span-5 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-between space-y-3">
                              <div className="w-full flex items-center justify-between border-b border-slate-200/80 pb-2">
                                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                  <Grid className="w-3.5 h-3.5 text-indigo-600" />
                                  {isEn ? "3. Confusion Matrix & Empirical Distribution" : "3. Confusion Matrix (සම්පූර්ණ Confusion Matrix)"}
                                </span>
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono font-bold">
                                  Total N = {item.confusionMatrix.total}
                                </span>
                              </div>

                              {/* Heatmap Visual Container */}
                              <div className="py-1 flex flex-col items-center w-full">
                                <h5 className="text-xs font-bold text-slate-700 mb-1 text-center">
                                  Confusion Matrix
                                </h5>

                                <div className="flex items-center justify-center gap-2">
                                  {/* Left Vertical Label: Actual */}
                                  <div className="flex items-center justify-center">
                                    <span className="-rotate-90 text-[11px] font-bold text-slate-600 tracking-wide select-none">
                                      Actual
                                    </span>
                                  </div>

                                  {/* Matrix Grid */}
                                  <div className="flex flex-col items-center">
                                    {/* Top Label: Prediction */}
                                    <span className="text-[11px] font-bold text-slate-600 mb-1 select-none">
                                      Prediction
                                    </span>

                                    {/* Column Headers */}
                                    <div className="grid grid-cols-2 gap-1.5 w-44 sm:w-52 text-center text-[10.5px] font-semibold text-slate-600 mb-1 pl-12">
                                      <span>Positive (1)</span>
                                      <span>Negative (0)</span>
                                    </div>

                                    {/* Rows with Row Headers */}
                                    <div className="space-y-1.5">
                                      {/* Row 1: Actual Positive */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-12 text-right text-[10.5px] font-semibold text-slate-600 pr-1 truncate">
                                          Positive
                                        </span>
                                        <div className="grid grid-cols-2 gap-1.5 w-44 sm:w-52">
                                          {/* TP Cell */}
                                          <div 
                                            className="h-12 sm:h-14 flex flex-col items-center justify-center rounded-md border border-slate-300 font-mono text-sm font-black transition-all shadow-xs"
                                            style={{
                                              backgroundColor: `rgba(26, 82, 148, ${Math.max(0.15, (item.confusionMatrix.tp / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn))).toFixed(2)})`,
                                              color: (item.confusionMatrix.tp / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn)) > 0.4 ? '#ffffff' : '#0d3c61'
                                            }}
                                          >
                                            <span>{item.confusionMatrix.tp}</span>
                                            <span className="text-[8.5px] font-sans font-normal opacity-85">TP (True Pos)</span>
                                          </div>

                                          {/* FN Cell */}
                                          <div 
                                            className="h-12 sm:h-14 flex flex-col items-center justify-center rounded-md border border-slate-300 font-mono text-sm font-black transition-all shadow-xs"
                                            style={{
                                              backgroundColor: `rgba(26, 82, 148, ${Math.max(0.06, (item.confusionMatrix.fn / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn))).toFixed(2)})`,
                                              color: (item.confusionMatrix.fn / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn)) > 0.4 ? '#ffffff' : '#0d3c61'
                                            }}
                                          >
                                            <span>{item.confusionMatrix.fn}</span>
                                            <span className="text-[8.5px] font-sans font-normal opacity-85">FN (False Neg)</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Row 2: Actual Negative */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="w-12 text-right text-[10.5px] font-semibold text-slate-600 pr-1 truncate">
                                          Negative
                                        </span>
                                        <div className="grid grid-cols-2 gap-1.5 w-44 sm:w-52">
                                          {/* FP Cell */}
                                          <div 
                                            className="h-12 sm:h-14 flex flex-col items-center justify-center rounded-md border border-slate-300 font-mono text-sm font-black transition-all shadow-xs"
                                            style={{
                                              backgroundColor: `rgba(26, 82, 148, ${Math.max(0.06, (item.confusionMatrix.fp / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn))).toFixed(2)})`,
                                              color: (item.confusionMatrix.fp / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn)) > 0.4 ? '#ffffff' : '#0d3c61'
                                            }}
                                          >
                                            <span>{item.confusionMatrix.fp}</span>
                                            <span className="text-[8.5px] font-sans font-normal opacity-85">FP (False Pos)</span>
                                          </div>

                                          {/* TN Cell */}
                                          <div 
                                            className="h-12 sm:h-14 flex flex-col items-center justify-center rounded-md border border-slate-300 font-mono text-sm font-black transition-all shadow-xs"
                                            style={{
                                              backgroundColor: `rgba(26, 82, 148, ${Math.max(0.15, (item.confusionMatrix.tn / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn))).toFixed(2)})`,
                                              color: (item.confusionMatrix.tn / Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn)) > 0.4 ? '#ffffff' : '#0d3c61'
                                            }}
                                          >
                                            <span>{item.confusionMatrix.tn}</span>
                                            <span className="text-[8.5px] font-sans font-normal opacity-85">TN (True Neg)</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Colorbar Indicator (Like in Screenshot 2) */}
                                  <div className="flex items-center gap-1 pl-1">
                                    <div className="w-3 h-24 sm:h-28 rounded-xs border border-slate-400 bg-gradient-to-b from-[#1a5294] via-[#74a5d8] to-[#edf4fc]" />
                                    <div className="flex flex-col justify-between h-24 sm:h-28 text-[9px] font-mono text-slate-600 font-semibold py-0.5">
                                      <span>{Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn)}</span>
                                      <span>{Math.round(Math.max(item.confusionMatrix.tp, item.confusionMatrix.tn) / 2)}</span>
                                      <span>0</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="w-full text-center text-[10.5px] text-slate-500 font-mono bg-white p-2 rounded-lg border border-slate-200/80">
                                TP = {item.confusionMatrix.tp} • TN = {item.confusionMatrix.tn} • FP = {item.confusionMatrix.fp} • FN = {item.confusionMatrix.fn}
                              </div>
                            </div>

                            {/* Right Column: Step-by-Step Metric Formulas with EXACT Substituted Values */}
                            <div className="lg:col-span-7 p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                                <Calculator className="w-4 h-4 text-emerald-600" />
                                <span>4. Exact Mathematical Metric Calculations with Substituted Values</span>
                              </div>

                              <div className="space-y-2 text-xs font-mono">
                                {/* Accuracy */}
                                <div className="p-2.5 bg-white rounded-lg border border-cyan-200 shadow-2xs">
                                  <div className="flex justify-between items-center text-cyan-800 font-sans font-bold text-[11px] mb-1">
                                    <span>🎯 Accuracy Formula & Value:</span>
                                    <span className="font-black text-cyan-700">{item.accuracy}</span>
                                  </div>
                                  <div className="text-[11.5px] text-slate-800 break-all">
                                    {item.calculations.accuracy}
                                  </div>
                                </div>

                                {/* Precision */}
                                <div className="p-2.5 bg-white rounded-lg border border-amber-200 shadow-2xs">
                                  <div className="flex justify-between items-center text-amber-800 font-sans font-bold text-[11px] mb-1">
                                    <span>✨ Precision Formula & Value:</span>
                                    <span className="font-black text-amber-700">{item.precision}</span>
                                  </div>
                                  <div className="text-[11.5px] text-slate-800 break-all">
                                    {item.calculations.precision}
                                  </div>
                                </div>

                                {/* Recall */}
                                <div className="p-2.5 bg-white rounded-lg border border-purple-200 shadow-2xs">
                                  <div className="flex justify-between items-center text-purple-800 font-sans font-bold text-[11px] mb-1">
                                    <span>📈 Recall Formula & Value:</span>
                                    <span className="font-black text-purple-700">{item.recall}</span>
                                  </div>
                                  <div className="text-[11.5px] text-slate-800 break-all">
                                    {item.calculations.recall}
                                  </div>
                                </div>

                                {/* F1-Score */}
                                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                                  <div className="flex justify-between items-center text-emerald-800 font-sans font-bold text-[11px] mb-1">
                                    <span>⭐ F1-Score Formula & Value:</span>
                                    <span className="font-black text-emerald-700">{item.f1}</span>
                                  </div>
                                  <div className="text-[11.5px] text-slate-800 break-all">
                                    {item.calculations.f1}
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* 5. Domain Scoring Methodology */}
                          <div className={`p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-950 ${isEn ? 'font-sans' : 'font-sinhala'} leading-relaxed`}>
                            <strong>🎯 {isEn ? "5. Domain Scoring & Adaptive Methodology: " : "5. ඇගයීම් ක්‍රමවේදය (Domain Scoring & Adaptive Methodology): "}</strong>
                            {isEn ? (item.domainScoringEn || item.domainScoring) : item.domainScoring}
                          </div>

                          {/* 6. Comparative Model Benchmarking & Architecture Selection */}
                          {MODEL_COMPARISON_DATA[item.id] && (() => {
                            const comp = MODEL_COMPARISON_DATA[item.id];
                            const candIndex = candidateTabs[item.id] ?? 2;
                            const cand = comp.candidates[candIndex] || comp.candidates[2];

                            return (
                              <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 rounded-xl border border-indigo-200/90 shadow-2xs space-y-4">
                                
                                {/* 6. Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                                      6
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-[13.5px] lg:text-sm font-black text-slate-900 font-sans whitespace-nowrap">
                                        6. Comparative Architecture Benchmarking & Best Model Selection
                                      </h4>
                                      <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium whitespace-nowrap">
                                        Investigation and empirical validation of candidate models matching research review panel standards
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Candidate Model Switcher Tabs */}
                                <div className="space-y-1.5">
                                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between flex-wrap gap-2">
                                    <span>🔍 Candidate AI Architectures Investigated for this Subsystem:</span>
                                    <span className="text-[11px] text-slate-500 font-normal italic">
                                      Click any candidate model to view its architecture summary, accuracy curve & loss curve
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {comp.candidates.map((c, cIdx) => (
                                      <button
                                        key={c.id}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCandidateTabs(prev => ({ ...prev, [item.id]: cIdx }));
                                        }}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                                          candIndex === cIdx
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-[1.02]'
                                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                        }`}
                                      >
                                        <span>{c.shortName}</span>
                                        {c.isWinner && (
                                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                            candIndex === cIdx ? 'bg-amber-400 text-slate-900' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                          }`}>
                                            ⭐ Selected Model
                                          </span>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Active Candidate Deep-Dive Card (Summary + Accuracy Graph + Loss Graph) */}
                                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
                                  <div className="space-y-1.5 pb-2.5 border-b border-slate-100">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`text-[10.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                        cand.isWinner ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                        {cand.role}
                                      </span>
                                      <span className="text-slate-300">•</span>
                                      <h5 className="text-sm font-black text-slate-900">{cand.name}</h5>
                                    </div>
                                    <p className="text-xs text-slate-500">{cand.type}</p>
                                    <div className="pt-1">
                                      <span className="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-lg font-mono whitespace-nowrap">
                                        <span>➤ Finalized testing accuracy:</span>
                                        <strong className="text-emerald-700 text-sm">{cand.testingAccuracy}</strong>
                                      </span>
                                    </div>
                                  </div>

                                  {/* 3 Academic Images: Model Summary | Accuracy Curve | Loss Curve */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* 1. Model Summary Card */}
                                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 group">
                                      <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                                        <span>➤ Model Summary</span>
                                        <div className="flex items-center gap-1">
                                          <button 
                                            type="button" 
                                            onClick={(e) => handleDownloadImage(e, cand.summaryImg, cand.summaryFigure)}
                                            className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded transition-colors" 
                                            title="Download figure image"
                                          >
                                            <Download className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            type="button" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPreviewImage({ src: cand.summaryImg, caption: cand.summaryFigure });
                                            }}
                                            className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded transition-colors" 
                                            title="Click to view full size"
                                          >
                                            <ZoomIn className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                      <div 
                                        className="bg-white rounded-lg overflow-hidden border border-slate-200/80 cursor-pointer p-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewImage({ src: cand.summaryImg, caption: cand.summaryFigure });
                                        }}
                                      >
                                        <img 
                                          src={cand.summaryImg} 
                                          alt={cand.summaryFigure} 
                                          className="w-full h-44 sm:h-48 object-contain bg-white group-hover:scale-[1.02] transition-transform" 
                                        />
                                      </div>
                                      <p className="text-[10px] text-center font-mono text-slate-500 font-medium">
                                        {cand.summaryFigure}
                                      </p>
                                    </div>

                                    {/* 2. Model Performance Accuracy Graph */}
                                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 group">
                                      <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                                        <span>➤ Model performance accuracy graph</span>
                                        <div className="flex items-center gap-1">
                                          <button 
                                            type="button" 
                                            onClick={(e) => handleDownloadImage(e, cand.accuracyImg, cand.accuracyFigure)}
                                            className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded transition-colors" 
                                            title="Download figure image"
                                          >
                                            <Download className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            type="button" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPreviewImage({ src: cand.accuracyImg, caption: cand.accuracyFigure });
                                            }}
                                            className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded transition-colors" 
                                            title="Click to view full size"
                                          >
                                            <ZoomIn className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                      <div 
                                        className="bg-white rounded-lg overflow-hidden border border-slate-200/80 cursor-pointer p-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewImage({ src: cand.accuracyImg, caption: cand.accuracyFigure });
                                        }}
                                      >
                                        <img 
                                          src={cand.accuracyImg} 
                                          alt={cand.accuracyFigure} 
                                          className="w-full h-44 sm:h-48 object-contain bg-white group-hover:scale-[1.02] transition-transform" 
                                        />
                                      </div>
                                      <p className="text-[10px] text-center font-mono text-slate-500 font-medium">
                                        {cand.accuracyFigure}
                                      </p>
                                    </div>

                                    {/* 3. Model Performance Loss Graph */}
                                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 group">
                                      <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                                        <span>➤ Model performance loss graph</span>
                                        <div className="flex items-center gap-1">
                                          <button 
                                            type="button" 
                                            onClick={(e) => handleDownloadImage(e, cand.lossImg, cand.lossFigure)}
                                            className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded transition-colors" 
                                            title="Download figure image"
                                          >
                                            <Download className="w-3.5 h-3.5" />
                                          </button>
                                          <button 
                                            type="button" 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPreviewImage({ src: cand.lossImg, caption: cand.lossFigure });
                                            }}
                                            className="text-slate-400 hover:text-indigo-600 cursor-pointer p-0.5 rounded transition-colors" 
                                            title="Click to view full size"
                                          >
                                            <ZoomIn className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                      <div 
                                        className="bg-white rounded-lg overflow-hidden border border-slate-200/80 cursor-pointer p-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewImage({ src: cand.lossImg, caption: cand.lossFigure });
                                        }}
                                      >
                                        <img 
                                          src={cand.lossImg} 
                                          alt={cand.lossFigure} 
                                          className="w-full h-44 sm:h-48 object-contain bg-white group-hover:scale-[1.02] transition-transform" 
                                        />
                                      </div>
                                      <p className="text-[10px] text-center font-mono text-slate-500 font-medium">
                                        {cand.lossFigure}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Comparative Charts Grid (2 Graphs Side-by-Side) */}
                                <div className="space-y-2.5">
                                  <div className="text-xs font-black text-slate-800 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                                    <span>Comparative Empirical Evaluation Charts</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {comp.comparativeCharts.map((ch, chIdx) => (
                                      <div 
                                        key={chIdx} 
                                        className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col justify-between cursor-pointer group hover:border-indigo-300 transition-colors shadow-2xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewImage({ src: ch.img, caption: ch.caption });
                                        }}
                                      >
                                        <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between gap-2">
                                          <span className="line-clamp-1">{ch.title}</span>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              type="button"
                                              onClick={(e) => handleDownloadImage(e, ch.img, ch.caption)}
                                              className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer transition-colors"
                                              title="Download figure image"
                                            >
                                              <Download className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewImage({ src: ch.img, caption: ch.caption });
                                              }}
                                              className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer transition-colors"
                                              title="Click to view full size"
                                            >
                                              <ZoomIn className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                                          <img src={ch.img} alt={ch.caption} className="w-full h-44 sm:h-52 object-contain" />
                                        </div>
                                        <p className="text-[10px] font-mono text-center text-slate-500 mt-2 line-clamp-2">
                                          {ch.caption}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Benchmarking Comparison Table (Positioned Below the 2 Graphs) */}
                                <div className="space-y-2.5">
                                  <div className="text-xs font-black text-slate-800 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    <span>Side-by-Side Model Comparison & Metric Trade-Offs</span>
                                  </div>
                                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                                          <th className="py-2.5 px-4 border-r border-slate-200">Architecture</th>
                                          <th className="py-2.5 px-3 text-center border-r border-slate-200">Accuracy</th>
                                          <th className="py-2.5 px-3 text-center border-r border-slate-200">Parameters</th>
                                          <th className="py-2.5 px-3 text-center border-r border-slate-200">Latency</th>
                                          <th className="py-2.5 px-4 text-center">Verdict</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 font-medium text-[11.5px] text-slate-700">
                                        {comp.comparisonTable.map((row, rIdx) => (
                                          <tr key={rIdx} className={(row.verdict.includes('SELECTED MODEL') || row.verdict.includes('WINNER')) ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'hover:bg-slate-50'}>
                                            <td className="py-2.5 px-4 border-r border-slate-100 font-medium">{row.architecture}</td>
                                            <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono font-bold text-slate-900">{row.accuracy}</td>
                                            <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono text-[11px] text-slate-600">{row.params}</td>
                                            <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono text-[11px]">{row.latency}</td>
                                            <td className="py-2.5 px-4 text-center">
                                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                                                (row.verdict.includes('SELECTED MODEL') || row.verdict.includes('WINNER')) ? 'bg-emerald-200 text-emerald-900 font-black' : 'text-slate-500'
                                              }`}>
                                                {row.verdict}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Full-Width Best Model Picked & Justification Card */}
                                <div className="w-full p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-xl border border-emerald-200 shadow-2xs space-y-3">
                                  <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-900">
                                    <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                                    <span>🏆 Selected Best Model: {comp.bestModelPicked.name}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                    {comp.bestModelPicked.highlights.map((h, hIdx) => (
                                      <div key={hIdx} className="bg-white/80 p-2.5 rounded-lg border border-emerald-100/90 text-[11px] text-slate-700 font-medium flex items-start gap-1.5">
                                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                        <span>{h}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-[11.5px] text-slate-700 bg-white/95 p-3 rounded-xl border border-emerald-200 leading-relaxed font-sans">
                                    <strong className="text-emerald-950">Academic Justification: </strong>
                                    {comp.bestModelPicked.justification}
                                  </p>
                                </div>

                              </div>
                            );
                          })()}


                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Full-Resolution Figure Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-800 font-mono flex items-center gap-2 truncate pr-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{previewImage.caption}</span>
              </h4>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleDownloadImage(e, previewImage.src, previewImage.caption)}
                  className="px-2.5 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download Figure"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-900/5 max-h-[75vh]">
              <img 
                src={previewImage.src} 
                alt={previewImage.caption} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md bg-white border border-slate-200" 
              />
            </div>
            <div className="p-2.5 border-t border-slate-100 text-center text-xs text-slate-500 bg-slate-50 flex items-center justify-between px-4 font-medium">
              <span>Press ESC or click anywhere outside to close</span>
              <button
                type="button"
                onClick={(e) => handleDownloadImage(e, previewImage.src, previewImage.caption)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 underline cursor-pointer"
              >
                <Download className="w-3 h-3" />
                Save Figure to Device
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
