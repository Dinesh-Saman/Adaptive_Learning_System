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
  Award
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
    confusionMatrix: { tp: 562, tn: 559, fp: 43, fn: 36 }
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
    confusionMatrix: { tp: 1191, tn: 1187, fp: 65, fn: 57 }
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
    confusionMatrix: { tp: 389, tn: 391, fp: 33, fn: 37 }
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
    confusionMatrix: { tp: 435, tn: 432, fp: 28, fn: 25 }
  }
];

export default function ExperimentalResultsTable() {
  const [activeTab, setActiveTab] = useState('all');
  const [showFormulas, setShowFormulas] = useState(false);
  const [selectedModuleModal, setSelectedModuleModal] = useState(null);

  // Overall System Macro Averages
  const overallAvgAccuracy = (AI_EXPERIMENTAL_RESULTS.reduce((a, b) => a + b.accuracyVal, 0) / AI_EXPERIMENTAL_RESULTS.length).toFixed(2);
  const overallAvgPrecision = (AI_EXPERIMENTAL_RESULTS.reduce((a, b) => a + b.precisionVal, 0) / AI_EXPERIMENTAL_RESULTS.length).toFixed(2);
  const overallAvgRecall = (AI_EXPERIMENTAL_RESULTS.reduce((a, b) => a + b.recallVal, 0) / AI_EXPERIMENTAL_RESULTS.length).toFixed(2);
  const overallAvgF1 = (AI_EXPERIMENTAL_RESULTS.reduce((a, b) => a + b.f1Val, 0) / AI_EXPERIMENTAL_RESULTS.length).toFixed(2);

  const filteredResults = activeTab === 'all' 
    ? AI_EXPERIMENTAL_RESULTS 
    : AI_EXPERIMENTAL_RESULTS.filter(r => r.id === activeTab);

  const handleExportCSV = () => {
    const headers = ["Module", "English Name", "AI Model", "Accuracy", "Precision", "Recall", "F1-score", "Sample Size"];
    const rows = AI_EXPERIMENTAL_RESULTS.map(r => [
      `"${r.module}"`,
      `"${r.moduleEn}"`,
      `"${r.model}"`,
      r.accuracy,
      r.precision,
      r.recall,
      r.f1,
      `"${r.sampleSize}"`
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

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-200/90 space-y-6">
      
      {/* Header Banner with Gradient & Evaluation Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
              📊
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sinhala">
                Experimental Results & AI Model Evaluation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium font-sinhala">
                ප්‍රධාන මොඩියුල 4 සඳහා AI ආකෘතිවල නිරවද්‍යතාව, නිරවද්‍යතා අනුපාතය, ප්‍රත්‍යානයනය සහ F1 ලකුණු විශ්ලේෂණය
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>{showFormulas ? 'Hide Calculation Formulas' : 'Show Accuracy Formulas'}</span>
            {showFormulas ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleExportCSV}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Macro System Benchmark KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-gradient-to-br from-cyan-50/70 to-slate-50 p-4 rounded-xl border border-cyan-100 shadow-2xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Overall Accuracy</span>
            <span className="text-cyan-600">🎯</span>
          </div>
          <p className="text-2xl font-black text-cyan-700 mt-1">{overallAvgAccuracy}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Macro Mean Accuracy across 4 Modules</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50/70 to-slate-50 p-4 rounded-xl border border-amber-100 shadow-2xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Precision Score</span>
            <span className="text-amber-600">✨</span>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-1">{overallAvgPrecision}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">True Positive Reliability (TP / TP+FP)</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50/70 to-slate-50 p-4 rounded-xl border border-purple-100 shadow-2xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Recall Rate</span>
            <span className="text-purple-600">📈</span>
          </div>
          <p className="text-2xl font-black text-purple-700 mt-1">{overallAvgRecall}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Sensitivity / Coverage (TP / TP+FN)</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/70 to-slate-50 p-4 rounded-xl border border-emerald-100 shadow-2xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>F1-Score Harmonized</span>
            <span className="text-emerald-600">⭐</span>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1">{overallAvgF1}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Harmonic Mean of Precision & Recall</p>
        </div>
      </div>

      {/* Accuracy Formulas & Mathematical Breakdown (Toggleable) */}
      {showFormulas && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-in border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-indigo-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Mathematical Formulas for AI Accuracy & Evaluation Metrics
            </h3>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
              Standard Machine Learning Metrics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Accuracy */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-cyan-400">1. Accuracy (නිරවද්‍යතාව)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-cyan-200 border border-slate-800">
                (TP + TN) / (TP + TN + FP + FN) × 100
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                සමස්ත ඇගයීම් අතරින් AI මොඩලය විසින් නිවැරදිව වර්ගීකරණය කළ අනුපාතය.
              </p>
            </div>

            {/* Precision */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-400">2. Precision (නිරවද්‍යතා අනුපාතය)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-amber-200 border border-slate-800">
                TP / (TP + FP) × 100
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                AI මොඩලය ධන (Positive) ලෙස හඳුනාගත් අගයන්ගෙන් සැබවින්ම නිවැරදි ප්‍රතිශතය.
              </p>
            </div>

            {/* Recall */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-purple-400">3. Recall (ප්‍රත්‍යානයනය)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-purple-200 border border-slate-800">
                TP / (TP + FN) × 100
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                සැබෑ ධන සාම්පල අතරින් AI මොඩලය සාර්ථකව ග්‍රහණය කරගත් අනුපාතය (Sensitivity).
              </p>
            </div>

            {/* F1-score */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-400">4. F1-Score (F1 ලකුණ)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-[11px] text-emerald-200 border border-slate-800">
                2 × (Precision × Recall) / (Precision + Recall)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Precision සහ Recall අතර සමතුලිතතාව මනින හර්මොනික් මධ්‍යන්‍යය (Harmonic Mean).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Benchmark Evaluation Table Styled Exactly Like Research Paper Reference */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-black text-[12px] uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-6 border-b border-slate-800">Module (විෂය ක්ෂේත්‍රය)</th>
              <th className="py-4 px-4 sm:px-6 border-b border-slate-800">Model (යොදාගත් AI මොඩලය)</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">Accuracy</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">Precision</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">Recall</th>
              <th className="py-4 px-3 sm:px-5 text-center border-b border-slate-800">F1-score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 font-semibold text-slate-800">
            {filteredResults.map((item, idx) => (
              <tr 
                key={item.id} 
                className={`${item.bgLight} transition-colors cursor-pointer group`}
                onClick={() => setSelectedModuleModal(item)}
              >
                {/* Module Name & Icon */}
                <td className="py-4 px-4 sm:px-6 border-r border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <div>
                      <div className="font-black text-slate-900 text-[13px] font-sinhala leading-snug">
                        {item.module}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.moduleEn}
                      </div>
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
                <td className="py-4 px-3 sm:px-5 text-center">
                  <span className="text-[13px] font-black text-slate-900 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                    {item.f1}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Module Drill-down Modal (When clicking on any row) */}
      {selectedModuleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl p-2.5 bg-slate-100 rounded-2xl">
                  {selectedModuleModal.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-sinhala leading-tight">
                    {selectedModuleModal.module}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedModuleModal.model} • {selectedModuleModal.sampleSize}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedModuleModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</p>
                <p className="text-base font-black text-cyan-600 mt-0.5">{selectedModuleModal.accuracy}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Precision</p>
                <p className="text-base font-black text-amber-600 mt-0.5">{selectedModuleModal.precision}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Recall</p>
                <p className="text-base font-black text-purple-600 mt-0.5">{selectedModuleModal.recall}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">F1-Score</p>
                <p className="text-base font-black text-emerald-600 mt-0.5">{selectedModuleModal.f1}</p>
              </div>
            </div>

            {/* Confusion Matrix Numbers */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 flex items-center justify-between">
                <span>Confusion Matrix Values (පරීක්ෂණ සාම්පල)</span>
                <span className="text-[11px] text-slate-500">{selectedModuleModal.sampleSize}</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                  <span className="text-[10px] text-emerald-600 block">True Positive (TP)</span>
                  <strong>{selectedModuleModal.confusionMatrix.tp}</strong>
                </div>
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
                  <span className="text-[10px] text-rose-600 block">False Positive (FP)</span>
                  <strong>{selectedModuleModal.confusionMatrix.fp}</strong>
                </div>
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
                  <span className="text-[10px] text-rose-600 block">False Negative (FN)</span>
                  <strong>{selectedModuleModal.confusionMatrix.fn}</strong>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  <span className="text-[10px] text-blue-600 block">True Negative (TN)</span>
                  <strong>{selectedModuleModal.confusionMatrix.tn}</strong>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 font-sinhala leading-relaxed">
              <strong>ක්‍රමවේදය (Methodology): </strong> {selectedModuleModal.formulaNote}
            </div>

            <button
              onClick={() => setSelectedModuleModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Close Details (වසන්න)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
