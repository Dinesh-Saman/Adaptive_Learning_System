import React, { useState, useRef, useEffect } from 'react';

const TRACING_TASKS = [
  // ── FRUITS ──
  {
    id: 'mango',
    title: 'අඹ (Mango)',
    icon: '🥭',
    imageSrc: '/assets/tracing-mango.png',
    category: 'fruits'
  },
  {
    id: 'orange',
    title: 'දොඩම් (Orange)',
    icon: '🍊',
    imageSrc: '/assets/tracing-orange.png',
    category: 'fruits'
  },
  {
    id: 'apple',
    title: 'ඇපල් (Apple)',
    icon: '🍎',
    imageSrc: '/assets/tracing-apple.png',
    category: 'fruits'
  },
  {
    id: 'banana',
    title: 'කෙසෙල් (Banana)',
    icon: '🍌',
    imageSrc: '/assets/tracing-banana.png',
    category: 'fruits'
  },
  // ── PATTERNS & SHAPES ──
  {
    id: 'ws1',
    title: 'රටා පුහුණුව 1 (Patterns)',
    icon: '〰️',
    imageSrc: '/assets/worksheets/ws1.png',
    isSplit: false,
    category: 'patterns'
  },
  {
    id: 'ws2',
    title: 'රටා පුහුණුව 2 (Bugs)',
    icon: '🐞',
    imageSrc: '/assets/worksheets/ws2.png',
    isSplit: false,
    category: 'patterns'
  },
  {
    id: 'ws3',
    title: 'සමනල මාවත (Butterfly)',
    icon: '🦋',
    imageSrc: '/assets/worksheets/ws3.png',
    isSplit: false,
    category: 'patterns'
  },
  {
    id: 'ws4',
    title: 'හැඩතල (Shapes)',
    icon: '🔺',
    imageSrc: '/assets/worksheets/ws4.png',
    isSplit: false,
    category: 'patterns'
  },
  {
    id: 'ws5',
    title: 'සත්තු මාවත (Animals)',
    icon: '🐘',
    imageSrc: '/assets/worksheets/ws5.png',
    isSplit: false,
    category: 'patterns'
  },
  {
    id: 'ws6',
    title: 'රළ රටා (Wave Lines)',
    icon: '🌊',
    imageSrc: '/assets/worksheets/ws6.png',
    isSplit: false,
    category: 'patterns'
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
    
    // Extremely strict tolerance for high accuracy detection
    const tolerance = selectedTask.isSplit === false ? 3 : 2;
    const tolSq = tolerance * tolerance;
    
    const isTarget = new Uint8Array(w * h);
    const targetHit = new Uint8Array(w * h);
    
    for (let i = 0; i < w * h; i++) {
       const r = truthData[i*4];
       const g = truthData[i*4+1];
       const b = truthData[i*4+2];
       if (r < 150 && g < 150 && b < 150) { 
         isTarget[i] = 1;
         totalExpectedPixels++;
       }
    }
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const a = userData[i*4 + 3];
        if (a > 10) { 
           let matched = false;
           const minX = Math.max(0, x - tolerance);
           const maxX = Math.min(w - 1, x + tolerance);
           const minY = Math.max(0, y - tolerance);
           const maxY = Math.min(h - 1, y + tolerance);
           
           for(let ty = minY; ty <= maxY; ty++){
             for(let tx = minX; tx <= maxX; tx++){
               const distSq = (tx - x)*(tx - x) + (ty - y)*(ty - y);
               if(distSq <= tolSq && isTarget[ty * w + tx] === 1) {
                 targetHit[ty * w + tx] = 1;
                 matched = true;
               }
             }
           }
           
           if (matched) drawnOnTarget++;
           else drawnOffTarget++;
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
    
    let targetMultiplier = selectedTask.isSplit === false ? 0.30 : 0.90;
    let completion = (hitPixels / (totalExpectedPixels * targetMultiplier)) * 100;
    completion = Math.min(100, Math.round(completion));
    
    // Because tolerance is extremely strict (3px), tracing over the white gaps between dots 
    // will naturally produce some red pixels even on a perfect trace.
    // We boost the raw accuracy by 15% so a highly accurate trace still yields 100%.
    let rawAccuracy = (drawnOnTarget / (drawnOnTarget + drawnOffTarget)) * 100;
    let accuracy = Math.min(100, Math.round(rawAccuracy * 1.15));
    
    let overall = Math.round((accuracy * 0.4) + (completion * 0.6));
    
    // Visual feedback: color off-target pixels RED, on-target pixels GREEN
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const a = userData[i*4 + 3];
        if (a > 10) { 
           let matched = false;
           const minX = Math.max(0, x - tolerance);
           const maxX = Math.min(w - 1, x + tolerance);
           const minY = Math.max(0, y - tolerance);
           const maxY = Math.min(h - 1, y + tolerance);
           for(let ty = minY; ty <= maxY; ty++){
             for(let tx = minX; tx <= maxX; tx++){
               if(isTarget[ty * w + tx] === 1) { matched = true; break; }
             }
             if(matched) break;
           }
           
           if (!matched) {
             userData[i*4] = 255;   // R
             userData[i*4+1] = 0;   // G
             userData[i*4+2] = 0;   // B
           } else {
             userData[i*4] = 34;    // Green R (22c55e)
             userData[i*4+1] = 197; // Green G
             userData[i*4+2] = 94;  // Green B
           }
        }
      }
    }
    ctx.putImageData(userImgData, 0, 0);
    setResultImageSrc(canvas.toDataURL());
    
    // Restore composite operation
    ctx.globalCompositeOperation = oldComposite;
    
    setStats({ accuracy, completion, overall });
    
    if (accuracy > 85 && completion > 80) {
       setShowConfetti(true);
       setTimeout(() => setShowConfetti(false), 3000);
    }
    
    setStage('result');
  };

  const renderSelection = () => {
    const filteredTasks = activeCategory === 'all' 
      ? TRACING_TASKS 
      : TRACING_TASKS.filter(t => t.category === activeCategory);

    return (
      <div className="max-w-6xl mx-auto p-6 animate-fade-in-up text-center">
        <h2 onClick={onExit} className="text-3xl sm:text-4xl font-black text-purple-600 mb-2 font-sinhala cursor-pointer hover:opacity-80 transition-opacity inline-block">
          රේඛා මත ලියමු (Line Tracing)
        </h2>
        <p className="text-slate-600 mb-8 text-base sm:text-lg">
          තිත් රේඛා ඔස්සේ අඳිමින් අත් මෝටර් කුසලතා දියුණු කරගන්න! (Trace the dotted lines)
        </p>
        
        {/* Category Toggle Tabs */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-slate-200/80 backdrop-blur-sm rounded-3xl mb-10 shadow-inner">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
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
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
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
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'patterns'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>〰️</span>
            <span>රටා හා හැඩතල (Patterns)</span>
          </button>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1.5 ${
                  task.category === 'fruits' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {task.category === 'fruits' ? '🍎 Fruit' : '〰️ Pattern'}
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
    <div className="max-w-6xl mx-auto p-6 animate-fade-in-up flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
         <button onClick={() => setStage('selection')} className="text-slate-500 font-bold hover:text-slate-800 px-4 py-2 rounded-xl bg-white border shadow-sm">&larr; වෙනස් කරන්න (Change)</button>
         <h2 className="text-3xl font-bold text-purple-600 flex items-center gap-3 font-sinhala">{selectedTask.icon} {selectedTask.title} අඳින්න</h2>
         <div className="w-[150px] hidden md:block"></div>
      </div>

      {!imageLoaded && <div className="p-12 text-slate-500 font-bold animate-pulse">Loading Tracing Task...</div>}

      <div className={`flex flex-col md:flex-row gap-8 items-center md:items-start justify-center w-full ${!imageLoaded ? 'hidden' : ''}`}>
         
         <div className="flex flex-row md:flex-col gap-4 items-center justify-center bg-white p-4 rounded-3xl shadow-md border-2 border-slate-100 w-full md:w-auto flex-wrap">
           {/* Tools */}
           <div className="flex md:flex-col gap-2">
             <button onClick={undo} disabled={historyStep <= 0} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 border shadow-sm disabled:opacity-50 text-xl md:text-2xl hover:bg-slate-100 transition-colors" title="Undo (ආපසු)">↩️</button>
             <button onClick={redo} disabled={historyStep >= history.length - 1} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 border shadow-sm disabled:opacity-50 text-xl md:text-2xl hover:bg-slate-100 transition-colors" title="Redo (නැවත)">↪️</button>
             <button onClick={() => setIsEraser(false)} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border shadow-sm text-xl md:text-2xl hover:bg-slate-100 transition-colors ${!isEraser ? 'bg-blue-100 border-blue-400' : 'bg-slate-50'}`} title="Pencil (පැන්සල)">✏️</button>
             <button onClick={() => setIsEraser(true)} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border shadow-sm text-xl md:text-2xl hover:bg-slate-100 transition-colors ${isEraser ? 'bg-purple-100 border-purple-400' : 'bg-slate-50'}`} title="Eraser (මකනය)">🧽</button>
             <button onClick={resetCanvas} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-50 text-red-500 border border-red-100 shadow-sm text-xl md:text-2xl hover:bg-red-100 transition-colors" title="Clear (සියල්ල මකන්න)">🧹</button>
           </div>
           
           <div className="w-px h-10 md:w-10 md:h-px bg-slate-200 mx-1 md:my-1"></div>
           
           {/* Colors */}
           <div className="flex md:flex-col gap-2 flex-wrap justify-center">
             {colors.map(color => (
                <button 
                  key={color} 
                  onClick={() => { setCurrentColor(color); setIsEraser(false); }}
                  className={`w-12 h-12 rounded-full shadow-inner transform transition-all ${!isEraser && currentColor === color ? 'scale-125 ring-4 ring-purple-300 z-10' : 'hover:scale-110 border-2 border-white'}`}
                  style={{ backgroundColor: color }}
                />
             ))}
           </div>
         </div>

         <div className="flex flex-col items-center w-full max-w-lg">
           <div className="w-full flex justify-between items-center mb-2 px-2">
             <div className="flex items-center gap-2">
               <span className="text-sm font-bold text-slate-500">Selected Tool:</span>
               {isEraser ? (
                 <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">🧽 Eraser</span>
               ) : (
                 <span className="bg-white border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColor }}></span> Color
                 </span>
               )}
             </div>
           </div>
           
           <div className="relative bg-white rounded-3xl shadow-xl border-4 border-slate-200 overflow-hidden w-full aspect-[4/5] mb-6" style={{ touchAction: 'none' }}>
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

         <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <h3 className="font-bold text-slate-500 uppercase tracking-widest text-sm">Reference (මඟපෙන්වීම)</h3>
            <img src={truthCanvasRef.current?.toDataURL()} alt="Reference" className="w-full aspect-[4/5] object-contain rounded-3xl shadow-md border-2 border-slate-200 bg-white" />
            
            <div className="mt-4 bg-purple-50 text-purple-800 px-6 py-4 rounded-2xl font-medium border border-purple-200 shadow-inner w-full text-center font-sinhala text-sm">
              තිත් රේඛා මත නිවැරදිව අඳින්න! (Trace accurately on the dotted lines!)
            </div>

            <button onClick={evaluateTracing} className="mt-4 w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all text-xl font-sinhala">
              ✨ AI පරීක්ෂාව (Check)
            </button>
         </div>
      </div>
    </div>
    );
  };

  const renderResult = () => (
    <div className="max-w-6xl mx-auto p-6 text-center animate-fade-in-up mt-6">
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
                <span className={`text-2xl font-black ${stats.accuracy >= 85 ? 'text-green-500' : 'text-orange-500'}`}>{stats.accuracy}%</span>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-2xl border flex items-center justify-between">
                <span className="font-bold text-slate-600 text-sm">සම්පූර්ණ කිරීම (Completion):</span>
                <span className={`text-2xl font-black ${stats.completion >= 80 ? 'text-green-500' : 'text-orange-500'}`}>{stats.completion}%</span>
             </div>

             <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-200 flex flex-col items-center justify-center mt-2 shadow-sm">
                <span className="font-bold text-purple-800 text-lg mb-1 font-sinhala">සමස්ත ලකුණු (Overall Score)</span>
                <div className="text-5xl font-black text-purple-600 drop-shadow-sm">{stats.overall} <span className="text-3xl text-purple-400">/ 100</span></div>
             </div>
          </div>

          <div className="flex gap-2 mt-4 justify-center flex-wrap">
             <button onClick={() => { resetCanvas(); setStage('tracing'); }} className="px-6 py-3 rounded-2xl font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors shadow-sm border border-purple-200 flex-1">
               නැවත අඳින්න (Retry)
             </button>
             <button onClick={() => setStage('selection')} className="px-6 py-3 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-md flex-1">
               වෙනත් රූපයක් (New Image)
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 w-full pt-4 pb-12 font-sinhala">
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button onClick={onExit} className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg font-bold text-sm shadow-sm border border-slate-200 transition-colors">
          &larr; ආපසු (Back to Dashboard)
        </button>
      </div>
      {stage === 'selection' && renderSelection()}
      {stage === 'tracing' && renderTracing()}
      {stage === 'result' && renderResult()}
    </div>
  );
}
