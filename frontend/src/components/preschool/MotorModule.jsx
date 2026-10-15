import React, { useState, useRef, useEffect } from 'react';
import { recordStudentTestMarks, recordStudentQuestionAttempts } from '../../data/studentAnalyticsData';
import { getItem } from '../../utils/storage';

const TRACING_TASKS = [
  // ── FRUITS ──
  {
    id: 'mango',
    title: 'අඹ (Mango)',
    icon: '🥭',
    imageSrc: '/assets/tracing-mango.png',
    category: 'fruits',
    tag: '🍎 පළතුරු',
    tagColor: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'orange',
    title: 'දොඩම් (Orange)',
    icon: '🍊',
    imageSrc: '/assets/tracing-orange.png',
    category: 'fruits',
    tag: '🍊 පළතුරු',
    tagColor: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'apple',
    title: 'ඇපල් (Apple)',
    icon: '🍎',
    imageSrc: '/assets/tracing-apple.png',
    category: 'fruits',
    tag: '🍎 පළතුරු',
    tagColor: 'bg-rose-100 text-rose-800'
  },
  {
    id: 'banana',
    title: 'කෙසෙල් (Banana)',
    icon: '🍌',
    imageSrc: '/assets/tracing-banana.png',
    category: 'fruits',
    tag: '🍌 පළතුරු',
    tagColor: 'bg-yellow-100 text-yellow-800'
  },
  // ── PATTERNS & SHAPES ──
  {
    id: 'ws1',
    title: 'රටා පුහුණුව 1 (Patterns)',
    icon: '〰️',
    imageSrc: '/assets/worksheets/ws1.png',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns'],
    tag: '〰️ රටා',
    tagColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'ws2',
    title: 'රටා පුහුණුව 2 (Bugs)',
    icon: '🐞',
    imageSrc: '/assets/worksheets/ws2.png',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'animals'],
    tag: '🐞 සතුන්',
    tagColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'ws3',
    title: 'සමනල මාවත (Butterfly)',
    icon: '🦋',
    imageSrc: '/assets/worksheets/ws3.png',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'animals'],
    tag: '🦋 සමනලයා',
    tagColor: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'ws4',
    title: 'හැඩතල (Shapes)',
    icon: '🔺',
    imageSrc: '/assets/worksheets/ws4.png',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'shapes'],
    tag: '🔺 හැඩතල',
    tagColor: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'ws5',
    title: 'සත්තු මාවත (Animals)',
    icon: '🐘',
    imageSrc: '/assets/worksheets/ws5.png',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'animals'],
    tag: '🐘 සතුන්',
    tagColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'ws6',
    title: 'රළ රටා (Wave Lines)',
    icon: '🌊',
    imageSrc: '/assets/worksheets/ws6.png',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'nature'],
    tag: '🌊 රළ රටා',
    tagColor: 'bg-cyan-100 text-cyan-800'
  },
  // ── NEW TRACING WORKSHEETS ──
  {
    id: 'ws7_shapes',
    title: 'හැඩතල රේඛා (Geometric Shapes)',
    icon: '⭐',
    imageSrc: '/assets/worksheets/ws7_shapes.jpg',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'shapes'],
    tag: '⭐ හැඩතල',
    tagColor: 'bg-purple-100 text-purple-800',
    topIgnoreRatio: 0.16
  },
  {
    id: 'ws8_tree',
    title: 'ගසේ කොළ (Tree Leaves)',
    icon: '🌳',
    imageSrc: '/assets/worksheets/ws8_tree.jpg',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'nature'],
    tag: '🌳 ගස් හා කොළ',
    tagColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'ws9_lion',
    title: 'සිංහ කෙසර (Lion\'s Mane)',
    icon: '🦁',
    imageSrc: '/assets/worksheets/ws9_lion.jpg',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'animals'],
    tag: '🦁 සිංහයා',
    tagColor: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'ws10_sheep',
    title: 'බැටළු ලොම් රටා (Sheep\'s Wool)',
    icon: '🐑',
    imageSrc: '/assets/worksheets/ws10_sheep.jpg',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'animals'],
    tag: '🐑 බැටළුවා',
    tagColor: 'bg-sky-100 text-sky-800'
  },
  {
    id: 'ws11_rain',
    title: 'වැහි වලාකුළු (Rain Clouds)',
    icon: '🌧️',
    imageSrc: '/assets/worksheets/ws11_rain.jpg',
    isSplit: false,
    category: 'patterns',
    categories: ['patterns', 'nature'],
    tag: '🌧️ වැහි රටා',
    tagColor: 'bg-blue-100 text-blue-800'
  }
];

export default function MotorModule({ onExit }) {
  const [stage, setStage] = useState('selection');
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'fruits', 'patterns'
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const canvasRef = useRef(null);
  const backgroundCanvasRef = useRef(null);
  const truthCanvasRef = useRef(null);
  const ctxRef = useRef(null);
  
  const [stats, setStats] = useState({ accuracy: 0, completion: 0, overall: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [resultImageSrc, setResultImageSrc] = useState(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setStats({ accuracy: 0, completion: 0, overall: 0 });
    setImageLoaded(false);
    setHistory([]);
    setHistoryStep(-1);
    setCurrentColor('#000000');
    setIsEraser(false);
    setStage('tracing');
  };

  useEffect(() => {
    if (stage === 'tracing' && selectedTask) {
      const img = new Image();
      img.src = selectedTask.imageSrc;
      img.onload = () => {
        setupCanvas(img);
        setImageLoaded(true);
      };
    }
  }, [stage, selectedTask]);
  
  useEffect(() => {
    if (ctxRef.current) {
        ctxRef.current.strokeStyle = isEraser ? '#ffffff' : currentColor;
        ctxRef.current.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
        ctxRef.current.lineWidth = isEraser ? 24 : 6;
    }
  }, [currentColor, isEraser]);

  const saveHistory = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(imageData);
      if (newHistory.length > 20) newHistory.shift();
      setHistoryStep(newHistory.length - 1);
      return newHistory;
    });
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const ctx = canvasRef.current.getContext('2d');
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      const ctx = canvasRef.current.getContext('2d');
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const resetCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveHistory(canvas);
    }
  };

  const setupCanvas = (img) => {
    let targetWidth, targetHeight, sourceXTruth, sourceXBg;
    
    if (selectedTask.isSplit !== false) {
      const halfWidth = Math.floor(img.width / 2);
      targetWidth = halfWidth;
      targetHeight = img.height;
      sourceXBg = 0;
      sourceXTruth = halfWidth;
    } else {
      targetWidth = img.width;
      targetHeight = img.height;
      sourceXBg = 0;
      sourceXTruth = 0;
    }
    
    const bgCvs = document.createElement('canvas');
    bgCvs.width = targetWidth;
    bgCvs.height = targetHeight;
    const bgCtx = bgCvs.getContext('2d');
    bgCtx.drawImage(img, sourceXBg, 0, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    backgroundCanvasRef.current = bgCvs;

    const truthCvs = document.createElement('canvas');
    truthCvs.width = targetWidth;
    truthCvs.height = targetHeight;
    const truthCtx = truthCvs.getContext('2d');
    truthCtx.drawImage(img, sourceXTruth, 0, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    truthCanvasRef.current = truthCvs;

    const canvas = canvasRef.current;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? 24 : 6; 
    ctx.strokeStyle = isEraser ? '#ffffff' : currentColor;
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctxRef.current = ctx;

    setHistory([ctx.getImageData(0, 0, targetWidth, targetHeight)]);
    setHistoryStep(0);
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    if (ctxRef.current) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      ctxRef.current.closePath();
      setIsDrawing(false);
      saveHistory(canvasRef.current);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const canvasAspect = canvas.width / canvas.height;
    const rectAspect = rect.width / rect.height;
    
    let renderWidth, renderHeight, letterboxX, letterboxY;
    if (canvasAspect > rectAspect) {
      renderWidth = rect.width;
      renderHeight = rect.width / canvasAspect;
      letterboxX = 0;
      letterboxY = (rect.height - renderHeight) / 2;
    } else {
      renderHeight = rect.height;
      renderWidth = rect.height * canvasAspect;
      letterboxX = (rect.width - renderWidth) / 2;
      letterboxY = 0;
    }

    const scaleX = canvas.width / renderWidth;
    const scaleY = canvas.height / renderHeight;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      offsetX: (clientX - rect.left - letterboxX) * scaleX,
      offsetY: (clientY - rect.top - letterboxY) * scaleY
    };
  };

  const evaluateTracing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundCanvasRef.current) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    const oldComposite = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'source-over';
    
    const userImgData = ctx.getImageData(0, 0, w, h);
    const userData = userImgData.data;
    
    const truthCtx = backgroundCanvasRef.current.getContext('2d');
    const truthData = truthCtx.getImageData(0, 0, w, h).data;
    
    let totalExpectedPixels = 0;
    let drawnOnTarget = 0;
    let drawnOffTarget = 0;
    
    // Calibrated tolerance matching brush width (6px) and dot spacing
    const tolerance = 8;
    const tolSq = tolerance * tolerance;
    
    const isTarget = new Uint8Array(w * h);
    const targetHit = new Uint8Array(w * h);
    
    const isFruit = selectedTask.category === 'fruits';
    // Ignore top text header: for fruits, the title word ends at y=108, so 0.22*h cleanly excludes title letters
    const topIgnoreHeight = isFruit 
      ? Math.floor(h * 0.22) 
      : (selectedTask.topIgnoreRatio ? Math.floor(h * selectedTask.topIgnoreRatio) : 0);

    // Margins: worksheets often have an outer border frame (e.g. ws1, ws4, ws2). Ignore outer 3.5% margin so page borders are not counted as tracing targets
    const marginX = isFruit ? Math.floor(w * 0.02) : Math.floor(w * 0.035);
    const marginY = isFruit ? Math.floor(h * 0.02) : Math.floor(h * 0.035);

    for (let y = 0; y < h; y++) {
      if (y < topIgnoreHeight || y < marginY || y >= h - marginY) continue;
      const rowOffset = y * w;
      for (let x = marginX; x < w - marginX; x++) {
        const i = rowOffset + x;
        const r = truthData[i * 4];
        const g = truthData[i * 4 + 1];
        const b = truthData[i * 4 + 2];
        if (r < 160 && g < 160 && b < 160) { 
          isTarget[i] = 1;
          totalExpectedPixels++;
        }
      }
    }
    
    // Unified single-pass evaluation:
    // Checks on-target vs off-target and applies visual feedback (green = on-target, red = off-target)
    for (let y = 0; y < h; y++) {
      const rowOffset = y * w;
      for (let x = 0; x < w; x++) {
        const i = rowOffset + x;
        const a = userData[i * 4 + 3];
        if (a > 10) { 
          let matched = false;
          const minX = Math.max(0, x - tolerance);
          const maxX = Math.min(w - 1, x + tolerance);
          const minY = Math.max(0, y - tolerance);
          const maxY = Math.min(h - 1, y + tolerance);
          
          for (let ty = minY; ty <= maxY; ty++) {
            const targetRow = ty * w;
            for (let tx = minX; tx <= maxX; tx++) {
              const distSq = (tx - x) * (tx - x) + (ty - y) * (ty - y);
              if (distSq <= tolSq && isTarget[targetRow + tx] === 1) {
                targetHit[targetRow + tx] = 1;
                matched = true;
              }
            }
          }
          
          if (matched) {
            drawnOnTarget++;
            userData[i * 4] = 34;      // Green R (22c55e)
            userData[i * 4 + 1] = 197; // Green G
            userData[i * 4 + 2] = 94;  // Green B
            userData[i * 4 + 3] = 255;
          } else {
            drawnOffTarget++;
            userData[i * 4] = 239;     // Red R (ef4444)
            userData[i * 4 + 1] = 68;  // Red G
            userData[i * 4 + 2] = 68;  // Red B
            userData[i * 4 + 3] = 255;
          }
        }
      }
    }
    
    if (drawnOnTarget + drawnOffTarget === 0) {
      alert("කරුණාකර රේඛා මත අඳින්න! (Please trace the lines first!)");
      ctx.globalCompositeOperation = oldComposite;
      return;
    }
    
    let hitPixels = 0;
    for (let i = 0; i < w * h; i++) {
      if (targetHit[i] === 1) hitPixels++;
    }
    
    // Completion: Percentage of expected target lines/dots that the student actually traced over.
    // Full coverage threshold: tracing 92% of the drawing lines awards 100% completion (forgiving minor corner gaps).
    // Leaving out major sections (stems, leaves, veins, or worksheet lines) directly lowers completion proportionally!
    const fullThreshold = 0.92;
    const rawCoverage = totalExpectedPixels > 0 ? (hitPixels / totalExpectedPixels) : 0;
    let completion = Math.round((rawCoverage / fullThreshold) * 100);
    completion = Math.max(0, Math.min(100, completion));
    
    // Accuracy: Percentage of drawn pixels that stayed cleanly within lines.
    // No artificial multiplier (* 1.15) so stray marks genuinely reflect in lower accuracy.
    const totalDrawn = drawnOnTarget + drawnOffTarget;
    let accuracy = totalDrawn > 0 ? Math.round((drawnOnTarget / totalDrawn) * 100) : 0;
    accuracy = Math.max(0, Math.min(100, accuracy));
    
    // Overall Score: 40% Accuracy, 60% Completion
    let overall = Math.round((accuracy * 0.4) + (completion * 0.6));
    if (completion < 15) {
      overall = Math.min(overall, completion);
    }
    
    ctx.putImageData(userImgData, 0, 0);
    setResultImageSrc(canvas.toDataURL());
    ctx.globalCompositeOperation = oldComposite;
    
    setStats({ accuracy, completion, overall });
    
    // Save to student profile & dashboard analytics
    const currentStudentId = getItem('studentId') || 'std_001';
    const currentStudentName = getItem('studentName') || 'Hasara';

    try {
      const studentKey = (currentStudentName || 'hasara').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const taskId = selectedTask?.id || 'tracing_task';
      const existing = JSON.parse(localStorage.getItem(`tracing_scores_${studentKey}`) || '{}');
      existing[taskId] = {
        taskId,
        title: selectedTask?.title || 'Line Tracing',
        accuracy,
        completion,
        overall,
        grade: 'Pre-School',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`tracing_scores_${studentKey}`, JSON.stringify(existing));
      if (studentKey === 'hasara' || studentKey === 'std_001') {
        localStorage.setItem('tracing_scores', JSON.stringify(existing));
      }
    } catch (e) {}

    const p1Marks = Math.round((overall / 100) * 30);
    recordStudentTestMarks({
      studentId: currentStudentId,
      name: currentStudentName,
      subject: 'preschool',
      categoryCode: 'P1',
      marks: p1Marks,
      maxMarks: 30
    });

    recordStudentQuestionAttempts({
      studentId: currentStudentId,
      module: 'preschool',
      grade: 'Pre-School',
      paperNumber: 1,
      attempts: [
        {
          questionId: `Line Tracing • ${selectedTask?.title || 'Fruit/Pattern'}`,
          domain: 'P1',
          category: 'P1',
          difficulty: 'Pre-School',
          isCorrect: overall >= 50,
          score: overall,
          accuracy,
          completion,
          timestamp: new Date().toISOString()
        }
      ]
    });

    if (accuracy > 85 && completion > 80) {
       setShowConfetti(true);
       setTimeout(() => setShowConfetti(false), 3000);
    }
    
    setStage('result');
  };

  const renderSelection = () => {
    const filteredTasks = activeCategory === 'all' 
      ? TRACING_TASKS 
      : TRACING_TASKS.filter(t => t.category === activeCategory || (t.categories && t.categories.includes(activeCategory)));

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        {/* Back Button aligned directly with the cards container below */}
        <div className="max-w-7xl mx-auto mb-2 flex justify-start">
          <button 
            onClick={onExit} 
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm shadow-xs border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Back to Pre-School & Grade 1"
          >
            &larr; Back
          </button>
        </div>

        <div className="text-center">
          <h2 onClick={onExit} className="text-3xl sm:text-4xl font-black text-purple-600 mb-2 font-sinhala cursor-pointer hover:opacity-80 transition-opacity inline-block">
            රේඛා මත ලියමු (Line Tracing)
          </h2>
          <p className="text-slate-600 mb-8 text-base sm:text-lg font-sinhala">
            තිත් රේඛා ඔස්සේ අඳිමින් අත් මෝටර් කුසලතා දියුණු කරගන්න! (Trace the dotted lines)
          </p>
        </div>
        
        {/* Category Toggle Tabs (Single Line - No Clipping) */}
        <div className="w-full flex justify-center mb-10 px-2 overflow-x-auto py-1 scrollbar-none">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-slate-200/80 backdrop-blur-sm rounded-3xl shadow-inner flex-nowrap font-sinhala shrink-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-2xl text-[10.5px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-white text-purple-700 shadow-md transform scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌟</span>
              <span>සියල්ල (All)</span>
            </button>
            <button
              onClick={() => setActiveCategory('fruits')}
              className={`px-3 py-1.5 rounded-2xl text-[10.5px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeCategory === 'fruits'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md transform scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🍎</span>
              <span>පළතුරු (Fruits)</span>
            </button>
            <button
              onClick={() => setActiveCategory('patterns')}
              className={`px-3 py-1.5 rounded-2xl text-[10.5px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeCategory === 'patterns'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>〰️</span>
              <span>රටා හා හැඩතල (Patterns & Shapes)</span>
            </button>
            <button
              onClick={() => setActiveCategory('animals')}
              className={`px-3 py-1.5 rounded-2xl text-[10.5px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeCategory === 'animals'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md transform scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🦁</span>
              <span>සතුන් (Animals)</span>
            </button>
            <button
              onClick={() => setActiveCategory('nature')}
              className={`px-3 py-1.5 rounded-2xl text-[10.5px] sm:text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeCategory === 'nature'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌳</span>
              <span>ස්වභාවධර්මය (Nature & Rain)</span>
            </button>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredTasks.map(task => (
            <button 
              key={task.id} 
              onClick={() => handleSelectTask(task)} 
              className="cursor-pointer bg-white px-5 pt-5 pb-7 rounded-[2rem] shadow-sm border-3 border-slate-100 hover:border-purple-400 hover:shadow-xl transition-all transform hover:-translate-y-2 group flex flex-col items-center justify-between h-full"
            >
              <div className="w-full aspect-[4/5] mb-4 overflow-hidden rounded-2xl relative group-hover:scale-105 transition-transform bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center p-2">
                <img src={task.imageSrc} alt={task.title} className="w-full h-full object-contain" />
              </div>
              <div className="w-full text-center">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1.5 font-sinhala ${
                  task.tagColor || (task.category === 'fruits' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800')
                }`}>
                  {task.tag || (task.category === 'fruits' ? '🍎 Fruit' : '〰️ Pattern')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 font-sinhala leading-snug">
                  {task.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTracing = () => {
    const colors = ['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
    
    const getCursor = () => {
      let svgStr;
      if (isEraser) {
        svgStr = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='#f1f5f9' stroke='#475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.5 20 11L11 20H20V20Z'/><path d='M17 14L7 4'/></svg>`;
      } else {
        svgStr = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${currentColor}' stroke='#1e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'/></svg>`;
      }
      return `url("data:image/svg+xml,${encodeURIComponent(svgStr)}") 3 20, crosshair`;
    };
    
    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-slate-200/80 p-5 sm:p-6 lg:p-7">
        {/* Top Header inside Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          {/* Back to Dashboard Button on Left */}
          <div className="flex items-center shrink-0 order-2 sm:order-1">
            <button 
              onClick={onExit} 
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs sm:text-sm shadow-xs border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              title="Back"
            >
              <span>&larr;</span>
              <span>Back</span>
            </button>
          </div>

          {/* Activity Title centered on ONE single line */}
          <div className="flex-1 text-center px-2 min-w-0 order-1 sm:order-2">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-purple-600 inline-flex items-center justify-center gap-2 font-sinhala whitespace-nowrap leading-normal">
              <span>{selectedTask.icon}</span>
              <span>{selectedTask.title} අඳින්න</span>
            </h2>
          </div>

          {/* Change Activity Button on Right */}
          <div className="flex items-center shrink-0 order-3 sm:order-3">
            <button 
              onClick={() => setStage('selection')} 
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold text-xs sm:text-sm shadow-xs border border-purple-200 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              title="වෙනත් ක්‍රියාකාරකමක් තෝරන්න (Change Activity)"
            >
              <span>〰️</span>
              <span>වෙනස් කරන්න (Change)</span>
            </button>
          </div>
        </div>

      {!imageLoaded && <div className="p-12 text-slate-500 font-bold animate-pulse text-center">Loading Tracing Task...</div>}

      <div className={`flex flex-col lg:flex-row gap-6 xl:gap-8 items-center lg:items-start justify-center w-full ${!imageLoaded ? 'hidden' : ''}`}>
         
         <div className="flex flex-row lg:flex-col gap-2.5 items-center justify-center bg-slate-50/90 p-2.5 rounded-2xl shadow-xs border border-slate-200/90 w-full lg:w-auto shrink-0 flex-wrap">
           {/* Tools */}
           <div className="flex lg:flex-col gap-2">
             <button onClick={undo} disabled={historyStep <= 0} className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white border border-slate-200 shadow-xs disabled:opacity-40 text-lg hover:bg-slate-100 transition-all flex items-center justify-center cursor-pointer active:scale-95" title="Undo (ආපසු)">↩️</button>
             <button onClick={redo} disabled={historyStep >= history.length - 1} className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white border border-slate-200 shadow-xs disabled:opacity-40 text-lg hover:bg-slate-100 transition-all flex items-center justify-center cursor-pointer active:scale-95" title="Redo (නැවත)">↪️</button>
             <button onClick={() => setIsEraser(false)} className={`w-11 h-11 lg:w-12 lg:h-12 rounded-xl border shadow-xs text-lg transition-all flex items-center justify-center cursor-pointer active:scale-95 ${!isEraser ? 'bg-blue-100 border-blue-400 font-bold scale-105 ring-2 ring-blue-300' : 'bg-white border-slate-200 hover:bg-slate-100'}`} title="Pencil (පැන්සල)">✏️</button>
             <button onClick={() => setIsEraser(true)} className={`w-11 h-11 lg:w-12 lg:h-12 rounded-xl border shadow-xs text-lg transition-all flex items-center justify-center cursor-pointer active:scale-95 ${isEraser ? 'bg-purple-100 border-purple-400 font-bold scale-105 ring-2 ring-purple-300' : 'bg-white border-slate-200 hover:bg-slate-100'}`} title="Eraser (මකනය)">🧽</button>
             <button onClick={resetCanvas} className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-rose-50 text-rose-500 border border-rose-200 shadow-xs text-lg hover:bg-rose-100 transition-all flex items-center justify-center cursor-pointer active:scale-95" title="Clear (සියල්ල මකන්න)">🧹</button>
           </div>
           
           <div className="w-px h-8 lg:w-8 lg:h-px bg-slate-300 mx-1 lg:my-1"></div>
           
           {/* Colors */}
           <div className="flex lg:flex-col gap-2 flex-wrap justify-center">
             {colors.map(color => (
                <button 
                  key={color} 
                  onClick={() => { setCurrentColor(color); setIsEraser(false); }}
                  className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full shadow-inner transform transition-all cursor-pointer ${!isEraser && currentColor === color ? 'scale-120 ring-3 ring-purple-400 z-10' : 'hover:scale-110 border-2 border-white'}`}
                  style={{ backgroundColor: color }}
                />
             ))}
           </div>
         </div>

         {/* Drawing Canvas Area */}
         <div className="flex flex-col items-center w-full flex-1 min-w-0 max-w-[560px] xl:max-w-[590px]">
           <div className="w-full mb-3 bg-slate-50/90 px-4 py-2 rounded-2xl shadow-xs border border-slate-200/90 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <span className="text-xs sm:text-sm font-bold text-slate-600 font-sinhala">තෝරාගත් මෙවලම:</span>
               {isEraser ? (
                 <span className="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">🧽 Eraser</span>
               ) : (
                 <span className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColor }}></span> Color
                 </span>
               )}
             </div>
             <span className="text-xs text-slate-500 font-sinhala font-medium">තිත් රේඛා මත අඳින්න</span>
           </div>
           
           <div className="relative bg-white rounded-3xl shadow-lg border-4 border-slate-200 overflow-hidden w-full aspect-[4/5] mb-3" style={{ touchAction: 'none' }}>
             {imageLoaded && <img src={backgroundCanvasRef.current?.toDataURL()} className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50" />}
             <canvas
               ref={canvasRef}
               className="w-full h-full object-contain relative z-10 mix-blend-multiply"
               style={{ cursor: getCursor() }}
               onMouseDown={startDrawing}
               onMouseMove={draw}
               onMouseUp={stopDrawing}
               onMouseLeave={stopDrawing}
               onTouchStart={startDrawing}
               onTouchMove={draw}
               onTouchEnd={stopDrawing}
             />
           </div>
         </div>

         {/* Reference & Actions Area */}
         <div className="flex flex-col items-center gap-3 w-full lg:w-[320px] xl:w-[350px] shrink-0">
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 shadow-xs w-full flex flex-col items-center gap-2.5">
              <h3 className="font-bold text-slate-600 uppercase tracking-wider text-xs">Reference (මඟපෙන්වීම)</h3>
              <div className="w-full aspect-[4/5] bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden p-2 flex items-center justify-center">
                <img src={truthCanvasRef.current?.toDataURL()} alt="Reference" className="w-full h-full object-contain" />
              </div>
            </div>
            
            <div className="bg-purple-50 text-purple-800 px-4 py-2.5 rounded-xl font-medium border border-purple-200/80 shadow-2xs w-full text-center font-sinhala text-xs sm:text-sm">
              තිත් රේඛා මත නිවැරදිව අඳින්න! (Trace accurately on the dotted lines!)
            </div>

            <button onClick={evaluateTracing} className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-black rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-base sm:text-lg font-sinhala cursor-pointer">
              ✨ නිවැරදි දැයි බලමු (Check)
            </button>
         </div>
      </div>
      </div>
    </div>
    );
  };

  const renderResult = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up mt-6">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-purple-500 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {showConfetti && <div className="absolute inset-0 text-6xl flex items-center justify-center animate-ping pointer-events-none z-0">🎉</div>}

        <div className="flex-1 w-full max-w-sm relative z-10 flex flex-col items-center">
          <h3 className="text-xl font-bold text-slate-700 mb-4 font-sinhala">ඔබේ ඇඳීම (Your Tracing)</h3>
          <div className="relative bg-white rounded-3xl shadow-md border-2 border-slate-200 overflow-hidden w-full aspect-[4/5]" style={{ pointerEvents: 'none' }}>
             <img src={backgroundCanvasRef.current?.toDataURL()} className="absolute inset-0 w-full h-full object-contain opacity-30" />
             <img src={resultImageSrc} className="absolute inset-0 w-full h-full object-contain relative z-10 mix-blend-multiply" />
          </div>
          <p className="mt-4 text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
             Red (රතු) = රේඛාවෙන් පිටතයි (Outside Lines)
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-4 w-full relative z-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 font-sinhala">ප්‍රතිඵල (Results)</h2>
          
          <div className="flex flex-col gap-3">
             <div className="bg-slate-50 p-4 rounded-2xl border flex items-center justify-between">
                <span className="font-bold text-slate-600 text-sm">නිරවද්‍යතාවය (Accuracy):</span>
                <span className={`text-2xl font-black ${stats.accuracy >= 85 ? 'text-emerald-600' : stats.accuracy >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>{stats.accuracy}%</span>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-2xl border flex items-center justify-between">
                <span className="font-bold text-slate-600 text-sm">සම්පූර්ණ කිරීම (Completion):</span>
                <span className={`text-2xl font-black ${stats.completion >= 85 ? 'text-emerald-600' : stats.completion >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>{stats.completion}%</span>
             </div>

             <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-200 flex flex-col items-center justify-center mt-2 shadow-sm">
                <span className="font-bold text-purple-800 text-lg mb-1 font-sinhala">සමස්ත ලකුණු (Overall Score)</span>
                <div className="text-5xl font-black text-purple-600 drop-shadow-sm">{stats.overall} <span className="text-3xl text-purple-400">/ 100</span></div>
             </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 w-full">
             <button 
               onClick={() => { resetCanvas(); setStage('tracing'); }} 
               className="w-full py-3.5 px-6 rounded-2xl font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors shadow-xs border border-purple-200 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base font-sinhala"
             >
               <span>🔄</span>
               <span>නැවත අඳින්න (Retry)</span>
             </button>
             <button 
               onClick={() => setStage('selection')} 
               className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base font-sinhala"
             >
               <span>🖼️</span>
               <span>වෙනත් රූපයක් (New Image)</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 w-full pt-4 pb-12 font-sinhala">
      {stage === 'selection' && renderSelection()}
      {stage === 'tracing' && renderTracing()}
      {stage === 'result' && renderResult()}
    </div>
  );
}
