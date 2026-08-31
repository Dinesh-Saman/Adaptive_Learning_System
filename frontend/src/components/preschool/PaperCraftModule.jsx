import React, { useState, useRef } from 'react';
import { getItem } from '../../utils/storage';

const CRAFTS = [
  {
    id: 'boat',
    title: 'Paper Boat',
    icon: '🚢',
    color: 'blue',
    steps: [
      'Fold the paper in half horizontally',
      'Fold in half again, then unfold to get a centre crease',
      'Fold both top corners down to the centre',
      'Fold the bottom strip up on both sides',
      'Open the hat shape and press flat into a square',
      'Fold the two bottom corners up to the top point',
      'Pull apart gently to reveal the boat!',
    ],
    referenceEmoji: '🚢'
  },
  {
    id: 'airplane',
    title: 'Paper Airplane',
    icon: '✈️',
    color: 'sky',
    steps: [
      'Fold the paper in half lengthwise',
      'Fold the top two corners down to the centre crease',
      'Fold the new top edges down to the centre again',
      'Fold the plane in half along the original crease',
      'Fold down one wing so it aligns with the bottom',
      'Flip and fold the other wing to match',
      'Open the wings flat — ready to fly!',
    ],
    referenceEmoji: '✈️'
  },
  {
    id: 'crown',
    title: 'Paper Crown',
    icon: '👑',
    color: 'yellow',
    steps: [
      'Take a long strip of paper',
      'Fold the strip in half lengthwise',
      'Make diagonal folds to create triangular points',
      'Fold each triangular point upward to form peaks',
      'Curl the strip into a circle',
      'Tape or glue the ends together to finish!',
    ],
    referenceEmoji: '👑'
  },
  {
    id: 'windmill',
    title: 'Paper Windmill',
    icon: '🌀',
    color: 'green',
    steps: [
      'Start with a square piece of paper',
      'Fold diagonally both ways and unfold (X crease)',
      'Cut from each corner toward the centre (stop 2cm away)',
      'Bend every other corner point toward the centre',
      'Secure all four bent points at the centre with a pin',
      'Attach to a straw or stick so it can spin freely!',
    ],
    referenceEmoji: '🌀'
  }
];

const COLOR_THEMES = {
  blue:   { border: 'border-blue-400',   bg: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-200',   badge: 'bg-blue-100 text-blue-700' },
  sky:    { border: 'border-sky-400',    bg: 'bg-sky-50',    text: 'text-sky-600',    ring: 'ring-sky-200',    badge: 'bg-sky-100 text-sky-700' },
  yellow: { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-600', ring: 'ring-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  green:  { border: 'border-green-400',  bg: 'bg-green-50',  text: 'text-green-600',  ring: 'ring-green-200',  badge: 'bg-green-100 text-green-700' },
};

const STATUS_CONFIG = {
  correct:  { icon: '✅', label: 'Correct',  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  partial:  { icon: '⚠️', label: 'Partial',  color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  skipped:  { icon: '❌', label: 'Skipped',  color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200' },
};

// ── Extract evenly-spaced frames from a video using canvas ──
function extractFrames(videoFile, numFrames = 6) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(videoFile);
    video.src = url;

    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      const frames = [];
      let captured = 0;

      const captureAt = (time) =>
        new Promise((res) => {
          video.currentTime = time;
          video.addEventListener('seeked', function onSeeked() {
            video.removeEventListener('seeked', onSeeked);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(canvas.toDataURL('image/jpeg', 0.7));
            captured++;
            res();
          }, { once: true });
        });

      const times = Array.from({ length: numFrames }, (_, i) =>
        (duration / (numFrames + 1)) * (i + 1)
      );

      (async () => {
        for (const t of times) await captureAt(t);
        URL.revokeObjectURL(url);
        resolve(frames);
      })().catch(reject);
    });

    video.addEventListener('error', reject);
  });
}

export default function PaperCraftModule({ onExit }) {
  const [stage, setStage] = useState('selection');        // selection | upload | analyzing | result
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleSelectCraft = (craft) => {
    setSelectedCraft(craft);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setResult(null);
    setError(null);
    setStage('upload');
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!videoFile || !selectedCraft) return;
    setAnalyzing(true);
    setError(null);
    setStage('analyzing');

    try {
      setAnalysisProgress('🎬 Extracting key moments from your video...');
      const frames = await extractFrames(videoFile, 6);

      setAnalysisProgress('🤖 AI is evaluating your paper craft...');
      const response = await fetch('http://localhost:5000/api/papercraft/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          craftId: selectedCraft.id,
          frames,
          studentId: getItem('studentId') || getItem('studentName') || 'student'
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data);
      setStage('result');
    } catch (err) {
      setError(err.message);
      setStage('upload');
    } finally {
      setAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const theme = selectedCraft ? COLOR_THEMES[selectedCraft.color] : {};
  const scoreColor = (s) => s >= 80 ? 'text-green-500' : s >= 60 ? 'text-yellow-500' : 'text-red-500';

  // ── SELECTION ──
  if (stage === 'selection') return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in-up">
      <h2
        onClick={onExit}
        className="text-4xl font-bold text-teal-600 mb-2 cursor-pointer hover:opacity-80 transition-opacity inline-block"
      >
        📹 Paper Craft AI
      </h2>
      <p className="text-slate-600 mb-10 text-lg">Make a paper craft, record a video, and let AI evaluate your work!</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {CRAFTS.map(craft => {
          const t = COLOR_THEMES[craft.color];
          return (
            <button
              key={craft.id}
              onClick={() => handleSelectCraft(craft)}
              className={`cursor-pointer bg-white pt-8 pb-6 px-4 rounded-3xl shadow-sm border-4 border-slate-100 hover:${t.border} hover:shadow-xl transition-all transform hover:-translate-y-2 group flex flex-col items-center gap-3`}
            >
              <span className="text-6xl group-hover:scale-110 transition-transform">{craft.icon}</span>
              <span className={`text-xl font-bold text-slate-800 group-hover:${t.text} transition-colors`}>{craft.title}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${t.badge}`}>{craft.steps.length} steps</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── ANALYZING ──
  if (stage === 'analyzing') return (
    <div className="max-w-lg mx-auto p-12 flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-fade-in-up">
      <div className="text-8xl animate-bounce">{selectedCraft.icon}</div>
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-700 mb-2">{analysisProgress}</p>
        <p className="text-slate-400 text-sm">This usually takes 5–15 seconds…</p>
      </div>
      <div className="w-64 h-3 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full animate-pulse w-full"></div>
      </div>
    </div>
  );

  // ── RESULT ──
  if (stage === 'result' && result) {
    const correct = result.stepResults?.filter(s => s.status === 'correct').length || 0;
    const total = result.stepResults?.length || 0;
    return (
      <div className="max-w-4xl mx-auto p-6 animate-fade-in-up">
        <div className="bg-white rounded-[3rem] shadow-xl border-t-8 border-teal-400 p-8 flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                {selectedCraft.icon} {result.craftName} Results
              </h2>
              {result.isMock && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold mt-1 inline-block">
                  ⚠️ Mock result — Add Gemini API key for real AI analysis
                </span>
              )}
            </div>
            <div className="text-center bg-teal-50 border-2 border-teal-200 rounded-3xl px-8 py-4">
              <div className="text-xs text-teal-500 font-bold uppercase tracking-widest mb-1">Overall Score</div>
              <div className={`text-5xl font-black ${scoreColor(result.overallScore)}`}>
                {result.overallScore}
                <span className="text-2xl text-slate-400"> / 100</span>
              </div>
            </div>
          </div>

          {/* Final output badge */}
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 ${result.finalOutputCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <span className="text-3xl">{result.finalOutputCorrect ? '🎉' : '😕'}</span>
            <div>
              <p className={`font-bold text-lg ${result.finalOutputCorrect ? 'text-green-700' : 'text-red-600'}`}>
                {result.finalOutputCorrect ? 'Final output looks correct!' : 'Final output needs more work'}
              </p>
              <p className="text-slate-500 text-sm">{result.feedback}</p>
            </div>
          </div>

          {/* Step-by-step checklist */}
          <div>
            <h3 className="font-bold text-slate-700 text-lg mb-4">
              Step-by-Step Evaluation — {correct}/{total} steps correct
            </h3>
            <div className="flex flex-col gap-3">
              {(result.stepResults || []).map((step) => {
                const cfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.partial;
                return (
                  <div key={step.step} className={`flex items-start gap-4 p-4 rounded-2xl border-2 ${cfg.bg} ${cfg.border}`}>
                    <span className="text-2xl mt-0.5">{cfg.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">Step {step.step}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white border ${cfg.color} border-current`}>{cfg.label}</span>
                      </div>
                      <p className="font-semibold text-slate-700 text-sm">{step.description}</p>
                      {step.note && <p className={`text-xs mt-1 ${cfg.color}`}>{step.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => { setVideoFile(null); setVideoPreviewUrl(null); setResult(null); setStage('upload'); }}
              className="flex-1 px-6 py-3 rounded-2xl font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => { setSelectedCraft(null); setResult(null); setStage('selection'); }}
              className="flex-1 px-6 py-3 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors"
            >
              🎨 New Craft
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── UPLOAD ──
  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setStage('selection')} className="text-slate-500 font-bold hover:text-slate-800 px-4 py-2 rounded-xl bg-white border shadow-sm">
          &larr; Change Craft
        </button>
        <h2 className={`text-3xl font-bold ${theme.text} flex items-center gap-3`}>
          {selectedCraft.icon} {selectedCraft.title}
        </h2>
        <div className="w-32 hidden md:block"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Left: Steps Guide */}
        <div className="bg-white rounded-3xl shadow-md border-2 border-slate-100 p-6">
          <h3 className="font-bold text-slate-700 text-lg mb-4">📋 Steps to Follow</h3>
          <ol className="flex flex-col gap-3">
            {selectedCraft.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-full text-sm font-black flex items-center justify-center flex-shrink-0 ${theme.bg} ${theme.text}`}>
                  {i + 1}
                </span>
                <span className="text-slate-600 text-sm leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right: Upload */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-3xl shadow-md border-2 border-slate-100 p-6 flex flex-col gap-4">
            <h3 className="font-bold text-slate-700 text-lg">📹 Upload Your Video</h3>
            <p className="text-slate-500 text-sm">Record yourself making the {selectedCraft.title}, then upload the video here. Keep it under 90 seconds for best results.</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-full py-10 rounded-2xl border-4 border-dashed transition-all flex flex-col items-center gap-3 cursor-pointer
                ${videoFile
                  ? `${theme.border} ${theme.bg}`
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
            >
              <span className="text-5xl">{videoFile ? '✅' : '📁'}</span>
              <span className="font-bold text-slate-600">
                {videoFile ? videoFile.name : 'Click to upload video'}
              </span>
              <span className="text-xs text-slate-400">.mp4 · .mov · .webm — max 100MB</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
            />
          </div>

          {videoPreviewUrl && (
            <div className="bg-white rounded-3xl shadow-md border-2 border-slate-100 p-4">
              <h3 className="font-bold text-slate-600 text-sm mb-3 uppercase tracking-widest">Preview</h3>
              <video
                src={videoPreviewUrl}
                controls
                className="w-full rounded-2xl max-h-48 object-contain bg-black"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm font-medium">
              ❌ {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!videoFile || analyzing}
            className="w-full py-5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-xl rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            ✨ Analyze with AI
          </button>
        </div>
      </div>
    </div>
  );
}
