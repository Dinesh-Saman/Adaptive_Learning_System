import React, { useState, useRef, useEffect } from 'react';
import { getItem } from '../../utils/storage';

// All Sinhala alphabetical letters
const SINHALA_VOWELS = ['අ','ආ','ඇ','ඈ','ඉ','ඊ','උ','ඌ','ඍ','එ','ඒ','ඓ','ඔ','ඕ','ඖ'];
const SINHALA_CONSONANTS = ['ක','ඛ','ග','ඝ','ඞ','ච','ඡ','ජ','ඣ','ඤ','ට','ඨ','ඩ','ඪ','ණ','ත','ථ','ද','ධ','න','ප','ඵ','බ','භ','ම','ය','ර','ල','ව','ශ','ෂ','ස','හ','ළ','ෆ'];

// Crayon / pastel colors for drawing
const CRAYON_COLORS = [
  { name: 'Black',      color: '#1a1a1a' },
  { name: 'Navy',       color: '#1e3a8a' },
  { name: 'Blue',       color: '#2563eb' },
  { name: 'Green',      color: '#16a34a' },
  { name: 'Red',        color: '#dc2626' },
  { name: 'Orange',     color: '#ea580c' },
  { name: 'Purple',     color: '#7c3aed' },
  { name: 'Brown',      color: '#92400e' },
  { name: 'Pink',       color: '#db2777' },
  { name: 'Teal',       color: '#0d9488' },
];

// Board background colors
const BOARD_COLORS = [
  { name: 'Whiteboard', bg: '#ffffff', label: '⬜ White' },
  { name: 'Blackboard', bg: '#1a2e1a', label: '🟩 Green Board' },
  { name: 'Slate',      bg: '#1e293b', label: '⬛ Slate' },
  { name: 'Cream',      bg: '#fef9c3', label: '🟨 Cream' },
  { name: 'Sky',        bg: '#e0f2fe', label: '🟦 Sky Blue' },
];

const SinhalaModule = ({ onExit }) => {
  const [predictions, setPredictions] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [targetLetter, setTargetLetter] = useState('ක');
  const [activeTab, setActiveTab] = useState('vowels'); // 'vowels' | 'consonants'
  const [strokeColor, setStrokeColor] = useState('#1a1a1a');
  const [boardBg, setBoardBg] = useState('#ffffff');
  const canvasRef = useRef(null);
  const refCanvasRef = useRef(null); // Hidden canvas for browser-rendered reference letter

  // Initialize / reset drawing canvas when board color changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7;
    ctx.strokeStyle = strokeColor;
  }, [boardBg]);

  // Render the target letter on the HIDDEN reference canvas whenever it changes
  // This uses the browser's native text engine which correctly supports Sinhala
  useEffect(() => {
    const canvas = refCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Render letter in black using system Sinhala font
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 70px "Iskoola Pota", "Noto Sans Sinhala", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(targetLetter, canvas.width / 2, canvas.height / 2 + 4);
  }, [targetLetter]);

  // Update stroke color live without clearing canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
  }, [strokeColor]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return { 
        x: (e.touches[0].clientX - rect.left) * scaleX, 
        y: (e.touches[0].clientY - rect.top) * scaleY 
      };
    }
    return { 
      x: (e.clientX - rect.left) * scaleX, 
      y: (e.clientY - rect.top) * scaleY 
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 7;
    ctx.strokeStyle = strokeColor;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    e?.preventDefault();
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPredictions(null);
  };

  const handleSelectLetter = (letter) => {
    setTargetLetter(letter);
    setPredictions(null);
    // Clear canvas on new letter selection
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = boardBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    const refCanvas = refCanvasRef.current;
    const imageBase64 = canvas.toDataURL('image/png').split(',')[1];
    // Capture the browser-rendered reference letter (correctly shaped Sinhala)
    const referenceBase64 = refCanvas ? refCanvas.toDataURL('image/png').split(',')[1] : '';
    const studentId = getItem('studentId') || getItem('studentName') || 'unknown';

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/handwriting/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          image_base64: imageBase64,
          target_letter: targetLetter,
          reference_base64: referenceBase64
        })
      });
      const data = await res.json();
      setPredictions(data);
    } catch (err) {
      console.error(err);
      alert('Error connecting to AI backend');
    }
    setIsLoading(false);
  };

  const boardIsLight = boardBg === '#ffffff' || boardBg === '#fef9c3' || boardBg === '#e0f2fe';
  const canvasTextColor = boardIsLight ? '#94a3b8' : '#475569';

  return (
    <div className="max-w-5xl mx-auto p-4 w-full">
      {/* Header */}
      <button onClick={onExit} className="mb-6 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors">
        &larr; Back to Dashboard
      </button>

      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-6 shadow-xl border-4 border-yellow-300 mb-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl md:text-5xl animate-bounce">✨🤖</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-purple-950 text-xs font-black px-3 py-0.5 rounded-full uppercase">
                New Research Engine
              </span>
              <span className="bg-emerald-400 text-emerald-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Personalized & Adaptive
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black mt-1">
              Personalized & Adaptive Sinhala Writing System
            </h3>
            <p className="text-xs text-purple-100 font-medium">
              Grade 2–5 අනුවර්තනීය ඉගෙනුම් මාවත සහ දෝෂ හඳුනාගැනීමේ පද්ධතිය
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => window.location.href = '/module/sinhala/ai-research-panel'}
            className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-2xl shadow-lg border border-emerald-300 cursor-pointer transition-all flex items-center gap-1.5"
            title="Panel Defense: PyTorch Models & DKT Engine"
          >
            <span>🔬</span>
            <span>AI Model Evaluation</span>
          </button>
          <button
            onClick={() => window.location.href = '/module/sinhala/adaptive-writing'}
            className="flex-1 md:flex-none px-5 py-3 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-slate-900 font-extrabold text-xs rounded-2xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>🎮 ආරම්භ කරන්න</span>
            <span>➔</span>
          </button>
          <button
            onClick={() => window.location.href = '/module/sinhala/teacher-dashboard'}
            className="px-3.5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl border border-white/40 cursor-pointer transition-all flex items-center gap-1.5"
            title="Teacher / Researcher Analytics"
          >
            <span>📊</span>
            <span>ගුරු පුවරුව</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-t-8 border-orange-500 p-6">
        <h2 className="text-3xl font-bold mb-1 text-orange-600 text-center">Sinhala Writing</h2>
        <p className="text-slate-500 text-center mb-6">Handwritten Character Recognition powered by Tesseract OCR</p>

        {/* ── Letter Selector ── */}
        <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select a Letter to Practice</p>
          
          {/* Tab switcher */}
          <div className="flex gap-2 mb-3">
            <button onClick={() => setActiveTab('vowels')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'vowels' ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:border-orange-400'}`}>
              Vowels (ස්වරය)
            </button>
            <button onClick={() => setActiveTab('consonants')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'consonants' ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:border-orange-400'}`}>
              Consonants (ව්‍යංජනය)
            </button>
          </div>

          {/* Letter Grid */}
          <div className="flex flex-wrap gap-2">
            {(activeTab === 'vowels' ? SINHALA_VOWELS : SINHALA_CONSONANTS).map((letter) => (
              <button
                key={letter}
                onClick={() => handleSelectLetter(letter)}
                className={`w-10 h-10 rounded-lg text-xl font-bold transition-all border-2 ${
                  targetLetter === letter
                    ? 'bg-orange-500 text-white border-orange-600 scale-110 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left: Drawing Area ── */}
          <div className="flex flex-col gap-3">
            {/* Target letter display */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                Write: <span className="text-orange-600 text-2xl ml-1">{targetLetter}</span>
              </p>
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200" style={{ backgroundColor: boardBg }}>
              <canvas
                ref={canvasRef}
                width={400}
                height={280}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="touch-none w-full h-full block"
                style={{ backgroundColor: boardBg }}
              />
              {/* Ghost letter guide in corner */}
              <div className="absolute top-2 right-3 text-6xl opacity-10 select-none pointer-events-none font-bold"
                style={{ color: boardIsLight ? '#000' : '#fff' }}>
                {targetLetter}
              </div>
            </div>

            {/* Crayon Colors */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">🖍 Crayon Color</p>
              <div className="flex flex-wrap gap-2">
                {CRAYON_COLORS.map((c) => (
                  <button
                    key={c.color}
                    title={c.name}
                    onClick={() => setStrokeColor(c.color)}
                    className={`w-8 h-8 rounded-full border-4 transition-all ${strokeColor === c.color ? 'border-orange-400 scale-125 shadow-md' : 'border-white hover:scale-110'}`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>

            {/* Board Colors */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">🎨 Board Color</p>
              <div className="flex flex-wrap gap-2">
                {BOARD_COLORS.map((b) => (
                  <button
                    key={b.bg}
                    title={b.name}
                    onClick={() => setBoardBg(b.bg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${boardBg === b.bg ? 'border-orange-400 scale-105 shadow-sm' : 'border-slate-200 hover:border-orange-300'}`}
                    style={{ backgroundColor: b.bg, color: b.bg === '#1a2e1a' || b.bg === '#1e293b' ? '#fff' : '#334155' }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={handleClear}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                🗑 Clear
              </button>
              <button onClick={handleSubmit} disabled={isLoading}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-md">
                {isLoading ? '⏳ Checking...' : '🧠 Submit to AI'}
              </button>
            </div>
          </div>

          {/* ── Right: AI Results ── */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              🧠 Tesseract AI Evaluation
            </h3>

            {predictions ? (
              <div className="space-y-3 flex-1">
                {/* Quality Badge */}
                <div className={`rounded-xl p-4 text-center border-2 ${
                  predictions.quality === 'Excellent' ? 'bg-green-50 border-green-300' :
                  predictions.quality === 'Good' ? 'bg-blue-50 border-blue-300' :
                  'bg-red-50 border-red-300'}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Quality</p>
                  <p className={`text-3xl font-black ${
                    predictions.quality === 'Excellent' ? 'text-green-600' :
                    predictions.quality === 'Good' ? 'text-blue-600' : 'text-red-600'}`}>
                    {predictions.quality === 'Excellent' ? '⭐ Excellent' :
                     predictions.quality === 'Good' ? '👍 Good' : '💪 Keep Trying'}
                  </p>
                </div>

                {/* Score */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                  <p className="text-xs text-slate-400 mb-1">Shape Match Score</p>
                  <p className="text-4xl font-black text-slate-800">{predictions.accuracy_score}<span className="text-xl text-slate-400">%</span></p>
                  <div className="mt-2 bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-orange-400 transition-all duration-700"
                      style={{ width: `${predictions.accuracy_score}%` }} />
                  </div>
                </div>

                {/* Target Reference */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-400 mb-2 text-center">Target Letter</p>
                  <div className="text-center text-6xl font-bold text-orange-500">{targetLetter}</div>
                </div>

                {/* Feedback */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <p className="text-xs text-slate-500 mb-1">AI Feedback:</p>
                  <p className="text-sm font-medium text-slate-700">"{predictions.feedback}"</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 min-h-[250px]">
                <div className="text-5xl mb-3">{targetLetter}</div>
                <p className="font-medium">Draw <strong>{targetLetter}</strong> on the board</p>
                <p className="text-sm mt-1">then click Submit to AI</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas — browser renders the target Sinhala letter here correctly */}
      <canvas
        ref={refCanvasRef}
        width={128}
        height={128}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default SinhalaModule;
