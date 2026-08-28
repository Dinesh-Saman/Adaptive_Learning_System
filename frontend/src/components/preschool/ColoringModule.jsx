import React, { useState, useRef, useEffect } from 'react';

const CRAFTS = [
  {
    id: 'strawberry',
    title: 'ස්ට්‍රෝබෙරි (Strawberry)',
    icon: '🍓',
    imageSrc: '/assets/strawberry.png',
    labels: [
      { text: 'රතු (Red)', color: '#ef4444', x: '50%', y: '60%' },
      { text: 'කොළ (Green)', color: '#22c55e', x: '50%', y: '15%' }
    ]
  },
  {
    id: 'apple',
    title: 'ඇපල් (Apple)',
    icon: '🍎',
    imageSrc: '/assets/apple.png',
    labels: [
      { text: 'රතු (Red)', color: '#ef4444', x: '50%', y: '65%' },
      { text: 'කොළ (Green)', color: '#22c55e', x: '70%', y: '15%' },
      { text: 'දුඹුරු (Brown)', color: '#a16207', x: '45%', y: '12%' }
    ]
  },
  {
    id: 'orange',
    title: 'දොඩම් (Orange)',
    icon: '🍊',
    imageSrc: '/assets/orange.png',
    labels: [
      { text: 'තැඹිලි (Orange)', color: '#f97316', x: '50%', y: '60%' },
      { text: 'කොළ (Green)', color: '#22c55e', x: '35%', y: '25%' },
      { text: 'දුඹුරු (Brown)', color: '#a16207', x: '60%', y: '15%' }
    ]
  },

  {
    id: 'mango',
    title: 'අඹ (Mango)',
    icon: '🥭',
    imageSrc: '/assets/mango.png',
    labels: [
      { text: 'කහ (Yellow)', color: '#eab308', x: '55%', y: '60%' },
      { text: 'කොළ (Green)', color: '#22c55e', x: '35%', y: '25%' },
      { text: 'දුඹුරු (Brown)', color: '#a16207', x: '45%', y: '15%' }
    ]
  },
  {
    id: 'pepper',
    title: 'බෙල් පෙපර් (Bell Pepper)',
    icon: '🫑',
    imageSrc: '/assets/pepper.png',
    labels: [
      { text: 'රතු (Red)', color: '#ef4444', x: '50%', y: '60%' },
      { text: 'කොළ (Green)', color: '#22c55e', x: '50%', y: '20%' }
    ]
  }
];

const PALETTE = [
  { hex: '#ef4444', name: 'රතු (Red)' },
  { hex: '#22c55e', name: 'කොළ (Green)' },
  { hex: '#eab308', name: 'කහ (Yellow)' },
  { hex: '#3b82f6', name: 'නිල් (Blue)' },
  { hex: '#f97316', name: 'තැඹිලි (Orange)' },
  { hex: '#a855f7', name: 'දම් (Purple)' },
  { hex: '#14b8a6', name: 'නිල්-කොළ (Teal)' },
  { hex: '#f43f5e', name: 'රෝස (Pink)' },
  { hex: '#a16207', name: 'දුඹුරු (Brown)' },
  { hex: '#000000', name: 'කළු (Black)' },
];

export default function ColoringModule({ onExit }) {
  const [stage, setStage] = useState('selection');
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [activeColor, setActiveColor] = useState(PALETTE[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  
  // Undo/Redo State
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  
  // Results
  const [stats, setStats] = useState({ coverage: 0, boundary: 0, colorMatch: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  
  const canvasRef = useRef(null);
  const outlineCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const refDataRef = useRef(null);
  const ctxRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [refImageSrc, setRefImageSrc] = useState(null);
  
  const handleSelectCraft = (craft) => {
    setSelectedCraft(craft);
    setStats({ coverage: 0, boundary: 0, colorMatch: 0 });
    setImageLoaded(false);
    setHistory([]);
    setHistoryStep(-1);
    setStage('coloring');
  };

  useEffect(() => {
    if (stage === 'coloring' && selectedCraft) {
      const img = new Image();
      img.src = selectedCraft.imageSrc;
      img.onload = () => {
        setupCanvas(img);
        setImageLoaded(true);
      };
    }
  }, [stage, selectedCraft]);

  const saveHistory = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(imageData);
      if (newHistory.length > 20) newHistory.shift(); // Max 20 steps
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

  const setupCanvas = (img) => {
    const margin = 5; // Remove 5px from all borders to hide outer and inner dividing lines without cropping the fruit
    const halfWidth = Math.floor(img.width / 2);
    const targetWidth = halfWidth - (margin * 2);
    const targetHeight = img.height - (margin * 2);
    
    const refCvs = document.createElement('canvas');
    refCvs.width = targetWidth;
    refCvs.height = targetHeight;
    const refCtx = refCvs.getContext('2d');
    refCtx.drawImage(img, halfWidth + margin, margin, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    setRefImageSrc(refCvs.toDataURL());
    refDataRef.current = refCtx.getImageData(0, 0, targetWidth, targetHeight); 

    const canvas = canvasRef.current;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 20; 
    ctx.strokeStyle = activeColor.hex;
    ctxRef.current = ctx;

    // Save initial blank history
    setHistory([ctx.getImageData(0, 0, targetWidth, targetHeight)]);
    setHistoryStep(0);

    const maskCvs = document.createElement('canvas');
    maskCvs.width = targetWidth;
    maskCvs.height = targetHeight;
    const maskCtx = maskCvs.getContext('2d');
    maskCtx.drawImage(img, margin, margin, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    
    const outlineCvs = document.createElement('canvas');
    outlineCvs.width = targetWidth;
    outlineCvs.height = targetHeight;
    const outlineCtx = outlineCvs.getContext('2d');
    outlineCtx.drawImage(img, margin, margin, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    outlineCanvasRef.current = outlineCvs;

    const imageData = maskCtx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imageData.data;
    const visited = new Uint8Array(targetWidth * targetHeight);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r < 150 && g < 150 && b < 150) {
        visited[i / 4] = 2; 
      }
    }
    
    const stack = [[0, 0]];
    visited[0] = 1; 
    
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < targetWidth && ny >= 0 && ny < targetHeight) {
          const idx = ny * targetWidth + nx;
          if (visited[idx] === 0) {
            visited[idx] = 1; 
            stack.push([nx, ny]);
          }
        }
      }
    }
    
    const newImageData = new ImageData(targetWidth, targetHeight);
    for (let i = 0; i < targetWidth * targetHeight; i++) {
       if (visited[i] === 0) { 
          newImageData.data[i*4] = 0;
          newImageData.data[i*4+1] = 0;
          newImageData.data[i*4+2] = 0;
          newImageData.data[i*4+3] = 255;
       } else {
          newImageData.data[i*4+3] = 0;
       }
    }
    maskCtx.putImageData(newImageData, 0, 0);
    maskCanvasRef.current = maskCvs;
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = activeColor.hex;
      ctxRef.current.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
      ctxRef.current.lineWidth = isEraser ? 30 : 20;
      
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
    
    // Begin a new path immediately so we don't redraw the entire massive stroke history on every mouse move
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
    
    // Calculate the actual rendered dimensions due to object-fit: contain
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

  const handleUploadPhysical = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
         const canvas = canvasRef.current;
         const ctx = canvas.getContext('2d');
         
         // Force paint mode in case Eraser was active, otherwise the image erases the canvas!
         ctx.globalCompositeOperation = 'source-over';
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         
         // Draw uploaded photo stretched to fit the canvas bounds
         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
         
         // Reset back to current tool state
         ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
         
         saveHistory(canvas);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    
    // Clear input so the exact same file can be uploaded again if needed
    e.target.value = null;
  };

  const [rawResultImageSrc, setRawResultImageSrc] = useState(null);
  const [resultImageSrc, setResultImageSrc] = useState(null);

  const calculateAccuracy = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 1. Save RAW drawing before we manipulate it
    setRawResultImageSrc(canvas.toDataURL());
    
    const mCtx = maskCanvasRef.current.getContext('2d');
    const outCtx = outlineCanvasRef.current.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    const coloredImgData = ctx.getImageData(0, 0, w, h);
    const coloredData = coloredImgData.data;
    const maskData = mCtx.getImageData(0, 0, w, h).data;
    const refData = refDataRef.current.data;
    const outlineData = outCtx.getImageData(0, 0, w, h).data;
    
    let totalMaskPixels = 0;
    let coloredInside = 0;
    let coloredOutside = 0;
    let colorCorrect = 0;
    let colorEvaluablePixels = 0;
    
    const PALETTE_RGB = PALETTE.map(p => ({
      r: parseInt(p.hex.substr(1, 2), 16),
      g: parseInt(p.hex.substr(3, 2), 16),
      b: parseInt(p.hex.substr(5, 2), 16)
    }));
    
    for (let i = 0; i < coloredData.length; i += 4) {
      const isMask = maskData[i + 3] > 10;
      
      const r = coloredData[i];
      const g = coloredData[i+1];
      const b = coloredData[i+2];
      const a = coloredData[i+3];
      
      // Treat white/light paper background and grayish shadows from photos as transparent
      const isPaper = r > 150 && g > 150 && b > 150;
      
      // Treat dark pixels as printed outlines (ignore them so photo misalignment doesn't ruin the score)
      const isOutline = r < 90 && g < 90 && b < 90;
      
      const isColored = a > 10 && !isPaper && !isOutline;
      
      if (isMask) totalMaskPixels++;
      
      if (isColored) {
        if (isMask) {
          coloredInside++;
          
          const refR = refData[i], refG = refData[i+1], refB = refData[i+2];
          const maxColor = Math.max(refR, refG, refB);
          const minColor = Math.min(refR, refG, refB);
          
          colorEvaluablePixels++; // Every colored inside pixel should be evaluated
          
          if (maxColor - minColor < 15 || minColor > 220 || maxColor < 60) {
             // It's a black shadow, white highlight, or pure grayscale part of the reference image.
             // Automatically grant this pixel as correct so we don't penalize coloring over highlights!
             colorCorrect++;
          } else {
             let userColorIdx = 0, userMinDist = Infinity;
             let refColorIdx = 0, refMaxCos = -Infinity;
             
             for (let pIdx = 0; pIdx < PALETTE_RGB.length; pIdx++) {
               const p = PALETTE_RGB[pIdx];
               
               // User color uses Euclidean distance because their palette color is flat
               const ud = (r - p.r)**2 + (g - p.g)**2 + (b - p.b)**2;
               if (ud < userMinDist) { userMinDist = ud; userColorIdx = pIdx; }
               
               // Reference color uses Cosine Similarity (angle) to perfectly ignore shadows/highlights!
               const dot = refR * p.r + refG * p.g + refB * p.b;
               const lenRef = Math.sqrt(refR*refR + refG*refG + refB*refB) || 1;
               const lenP = Math.sqrt(p.r*p.r + p.g*p.g + p.b*p.b) || 1;
               const cosSim = dot / (lenRef * lenP);
               
               if (cosSim > refMaxCos) { refMaxCos = cosSim; refColorIdx = pIdx; }
             }
             
             const pUser = PALETTE_RGB[userColorIdx];
             const pRef = PALETTE_RGB[refColorIdx];
             
             // Human-like forgiving color grading!
             const FORGIVING_MATCHES = {
               '#ef4444': ['#f43f5e', '#000000', '#ffffff'], // Red allows Pink
               '#22c55e': ['#000000', '#ffffff'],            // Green
               '#3b82f6': ['#000000', '#ffffff'],            // Blue
               '#eab308': ['#000000', '#ffffff'],            // Yellow
               '#f97316': ['#000000', '#ffffff'],            // Orange
               '#f43f5e': ['#ef4444', '#000000', '#ffffff'], // Pink allows Red
               '#a16207': ['#000000', '#ffffff'],            // Brown
               '#a855f7': ['#000000', '#ffffff'],            // Purple
               '#14b8a6': ['#000000', '#ffffff']             // Teal
             };
             
             const isForgiven = FORGIVING_MATCHES[PALETTE[userColorIdx].hex]?.includes(PALETTE[refColorIdx].hex) || 
                                FORGIVING_MATCHES[PALETTE[refColorIdx].hex]?.includes(PALETTE[userColorIdx].hex);
             
             if (userColorIdx === refColorIdx || isForgiven) {
               colorCorrect++;
             }
          }
          
          // KEEP the child's original color inside the lines! Do not overwrite it.
          // coloredData is left as-is for i, i+1, i+2
          coloredData[i+3] = 255;
          
        } else {
          // Check if this "out of bounds" pixel is actually just drawn perfectly ON TOP of a black line (or its gray anti-aliased edges)
          const outR = outlineData[i], outG = outlineData[i+1], outB = outlineData[i+2], outA = outlineData[i+3];
          const isOriginalLine = outA > 50 && outR < 180 && outG < 180 && outB < 180;
          
          if (isOriginalLine) {
             // Count as safely inside bounds (don't penalize for coloring on the line)
             coloredInside++;
          } else {
             coloredOutside++;
             coloredData[i] = 255; 
             coloredData[i+1] = 0;   
             coloredData[i+2] = 255; 
             coloredData[i+3] = 255; 
          }
        }
      }
    }
    
    if (coloredInside + coloredOutside === 0) {
       alert("කරුණාකර පළමුව වර්ණ ගන්වන්න! (Please color the picture first!)");
       return;
    }
    
    // 2. Put manipulated AI analysis back and save
    ctx.putImageData(coloredImgData, 0, 0);
    setResultImageSrc(canvas.toDataURL());
    
    const coveragePercent = Math.round((coloredInside / totalMaskPixels) * 100);
    const boundaryPercent = Math.round((coloredInside / (coloredInside + coloredOutside)) * 100);
    const colorPercent = colorEvaluablePixels > 0 ? Math.round((colorCorrect / colorEvaluablePixels) * 100) : 0;
    
    setStats({
      coverage: Math.min(100, coveragePercent),
      boundary: Math.min(100, boundaryPercent),
      colorMatch: Math.min(100, colorPercent)
    });
    
    if (boundaryPercent > 90 && coveragePercent > 80) {
       setShowConfetti(true);
       setTimeout(() => setShowConfetti(false), 3000);
    }
    
    setStage('result');
  };

  const resetCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveHistory(canvas);
    }
  };

  const renderSelection = () => (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in-up text-center">
      <h2 onClick={onExit} className="text-4xl font-bold text-pink-600 mb-2 font-sinhala cursor-pointer hover:opacity-80 transition-opacity inline-block">
        ඩිජිටල් වර්ණ ගැන්වීම (Digital Coloring)
      </h2>
      <p className="text-slate-600 mb-12 text-lg">AI boundary detection helps improve fine motor skills!</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {CRAFTS.map(craft => (
          <button key={craft.id} onClick={() => handleSelectCraft(craft)} className="cursor-pointer bg-white px-6 pt-6 pb-10 rounded-[2rem] shadow-sm border-4 border-slate-100 hover:border-pink-400 hover:shadow-xl transition-all transform hover:-translate-y-2 group flex flex-col items-center h-full">
            <div className="w-full aspect-[4/5] mb-6 overflow-hidden rounded-2xl relative group-hover:scale-105 transition-transform bg-slate-50">
              <img src={craft.imageSrc} alt={craft.title} className="w-full h-full object-cover object-right" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 font-sinhala whitespace-pre-line leading-relaxed">{craft.title.replace(' (', '\n(')}</h3>
          </button>
        ))}
      </div>
    </div>
  );

  const renderColoring = () => (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in-up flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
         <button onClick={() => setStage('selection')} className="text-slate-500 font-bold hover:text-slate-800 px-4 py-2 rounded-xl bg-white border shadow-sm">&larr; වෙනස් කරන්න (Change)</button>
         <h2 className="text-3xl font-bold text-pink-600 flex items-center gap-3 font-sinhala">{selectedCraft.icon} {selectedCraft.title} වර්ණ ගන්වන්න</h2>
         <div className="w-[150px] hidden md:block"></div> {/* Spacer for centering */}
      </div>

      {!imageLoaded && <div className="p-12 text-slate-500 font-bold animate-pulse">Loading Reference Image...</div>}

      <div className={`flex flex-col md:flex-row gap-8 items-center md:items-start justify-center w-full ${!imageLoaded ? 'hidden' : ''}`}>
         
         {/* LEFT TOOLBAR */}
         <div className="flex flex-row md:flex-col gap-4 items-center justify-center bg-white p-4 rounded-3xl shadow-md border-2 border-slate-100 w-full md:w-auto">
           <button onClick={undo} disabled={historyStep <= 0} className="w-14 h-14 rounded-2xl bg-slate-50 border shadow-sm disabled:opacity-50 text-2xl hover:bg-slate-100 transition-colors flex items-center justify-center" title="Undo (ආපසු හරවන්න)">↩️</button>
           <button onClick={redo} disabled={historyStep >= history.length - 1} className="w-14 h-14 rounded-2xl bg-slate-50 border shadow-sm disabled:opacity-50 text-2xl hover:bg-slate-100 transition-colors flex items-center justify-center" title="Redo (නැවත කරන්න)">↪️</button>
           
           <div className="w-px h-10 md:w-10 md:h-px bg-slate-200 mx-1 md:my-1"></div>

           <button onClick={() => setIsEraser(false)} className={`w-14 h-14 rounded-2xl border shadow-sm text-2xl transition-all flex items-center justify-center ${!isEraser ? 'ring-4 ring-blue-300 bg-blue-100' : 'bg-slate-50 hover:bg-slate-100'}`} title="Paintbrush (පින්සල)">🖌️</button>
           <button onClick={() => setIsEraser(true)} className={`w-14 h-14 rounded-2xl border shadow-sm text-2xl transition-all flex items-center justify-center ${isEraser ? 'ring-4 ring-pink-300 bg-pink-100' : 'bg-slate-50 hover:bg-slate-100'}`} title="Eraser (මකනය)">🧽</button>
           <button onClick={resetCanvas} className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 border border-red-100 shadow-sm text-2xl hover:bg-red-100 transition-colors flex items-center justify-center" title="Clear (මකන්න)">🧹</button>
         </div>

         {/* Drawing Canvas Area */}
         <div className="flex flex-col items-center w-full max-w-md">
           <div className="relative bg-white rounded-3xl shadow-xl border-4 border-slate-200 overflow-hidden w-full aspect-square mb-6" style={{ touchAction: 'none' }}>
             {imageLoaded && <img src={outlineCanvasRef.current?.toDataURL()} className="absolute inset-0 w-full h-full object-contain opacity-50 pointer-events-none" />}
             <canvas
               ref={canvasRef}
               className="w-full h-full object-contain relative z-10 mix-blend-multiply"
               style={{
                 cursor: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                   isEraser 
                     ? '<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><text x="0" y="24" font-size="24">🧽</text></svg>'
                     : `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="${activeColor.hex}" stroke="white" stroke-width="2"/></svg>`
                 )}") 12 12, crosshair`
               }}
               onMouseDown={startDrawing}
               onMouseMove={draw}
               onMouseUp={stopDrawing}
               onMouseLeave={stopDrawing}
               onTouchStart={startDrawing}
               onTouchMove={draw}
               onTouchEnd={stopDrawing}
             />
             {imageLoaded && <img src={outlineCanvasRef.current?.toDataURL()} className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 mix-blend-darken" />}
           </div>

           {/* Beautiful Color Palette */}
           <div className="bg-white p-4 rounded-3xl shadow-md border-2 border-slate-100 flex flex-wrap justify-center gap-3 w-full">
             {PALETTE.map(color => (
               <div key={color.hex} className="group relative">
                 <button
                   onClick={() => { setActiveColor(color); setIsEraser(false); }}
                   style={{ backgroundColor: color.hex }}
                   className={`w-12 h-12 rounded-full shadow-inner transform transition-transform ${(!isEraser && activeColor.hex === color.hex) ? 'scale-125 ring-4 ring-pink-300 z-10' : 'hover:scale-110'} border-2 border-white`}
                 />
                 {/* Hover Tooltip */}
                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sinhala shadow-lg">
                   {color.name}
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                 </div>
               </div>
             ))}
           </div>

           {/* Physical Paper Mode */}
           <div className="bg-white p-4 rounded-3xl shadow-md border-2 border-slate-100 w-full mt-4 flex items-center gap-4">
              <div className="bg-slate-50 p-2 rounded-2xl border" title="Scan to open image on mobile">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + selectedCraft?.imageSrc)}`} alt="QR" className="w-16 h-16 rounded-xl mix-blend-multiply" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                 <button onClick={() => window.open(selectedCraft.imageSrc, '_blank')} className="w-full px-4 py-2 bg-slate-800 text-white font-bold rounded-xl shadow-sm text-sm hover:bg-slate-900 transition-colors">
                   🖨️ Print Paper
                 </button>
                 <label className="w-full px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-xl shadow-sm text-sm hover:bg-pink-200 transition-colors cursor-pointer text-center">
                   📸 Upload Drawing
                   <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhysical} />
                 </label>
              </div>
           </div>
         </div>

         {/* Reference Area */}
         <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <h3 className="font-bold text-slate-500 uppercase tracking-widest text-sm">Reference (මඟපෙන්වීම)</h3>
            <img src={refImageSrc} alt="Reference" className="w-full aspect-square object-contain rounded-3xl shadow-md border-2 border-slate-200 bg-white" />
            
            <div className="mt-4 bg-blue-50 text-blue-800 px-6 py-4 rounded-2xl font-medium border border-blue-200 shadow-inner w-full text-center font-sinhala text-sm">
              නිවැරදි වර්ණ තෝරාගෙන කළු රේඛාවෙන් පිටතට නොයා වර්ණ ගන්වන්න!
            </div>

            <button onClick={calculateAccuracy} className="mt-4 w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg transform hover:-translate-y-1 transition-all text-xl font-sinhala">
              ✨ AI පරීක්ෂාව (Check)
            </button>
         </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-6xl mx-auto p-6 text-center animate-fade-in-up mt-6">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-pink-500 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {showConfetti && <div className="absolute inset-0 text-6xl flex items-center justify-center animate-ping pointer-events-none z-0">🎉</div>}

        {/* 1. Reference Image */}
        <div className="flex-1 w-full max-w-sm relative z-10 flex flex-col items-center">
          <h3 className="text-xl font-bold text-green-600 mb-4 font-sinhala">නිවැරදි පින්තූරය (Correct Image)</h3>
          <div className="relative bg-white rounded-3xl shadow-md border-2 border-green-200 overflow-hidden w-full aspect-square pointer-events-none">
             <img src={refImageSrc} className="absolute inset-0 w-full h-full object-contain" />
             
             {/* Color Labels Overlay */}
             {selectedCraft?.labels?.map((label, idx) => (
                <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-3 py-1 rounded-xl text-xs font-bold shadow-sm border border-slate-200 z-30" style={{ left: label.x, top: label.y, color: label.color }}>
                   {label.text}
                </div>
             ))}
          </div>
        </div>

        {/* 2. User Work (with Magenta for mistakes) */}
        <div className="flex-1 w-full max-w-sm relative z-10 flex flex-col items-center">
          <h3 className="text-xl font-bold text-slate-700 mb-4 font-sinhala">ඔබේ වර්ණ ගැන්වීම (Your Work)</h3>
          <div className="relative bg-white rounded-3xl shadow-md border-2 border-slate-200 overflow-hidden w-full aspect-square" style={{ pointerEvents: 'none' }}>
             <img src={outlineCanvasRef.current?.toDataURL()} className="absolute inset-0 w-full h-full object-contain opacity-50" />
             {resultImageSrc && <img src={resultImageSrc} className="absolute inset-0 w-full h-full object-contain relative z-10 mix-blend-multiply" />}
             <img src={outlineCanvasRef.current?.toDataURL()} className="absolute inset-0 w-full h-full object-contain z-20 mix-blend-darken" />
          </div>
          <p className="mt-4 text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-3 py-2 rounded-xl border border-fuchsia-100">
             Magenta (දම්) = රේඛාවෙන් පිටතයි (Outside Lines)
          </p>
        </div>

        {/* 3. Stats */}
        <div className="flex-1 flex flex-col gap-4 w-full relative z-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 font-sinhala">ප්‍රතිඵල (Results)</h2>
          
          <div className="flex flex-col gap-3">
             <div className="bg-slate-50 p-4 rounded-2xl border flex items-center justify-between">
                <span className="font-bold text-slate-600 text-sm">රේඛාවෙන් ඇතුළත (Boundary):</span>
                <span className={`text-2xl font-black ${stats.boundary >= 90 ? 'text-green-500' : 'text-orange-500'}`}>{stats.boundary}%</span>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-2xl border flex items-center justify-between">
                <span className="font-bold text-slate-600 text-sm">නිවැරදි වර්ණය (Colors):</span>
                <span className={`text-2xl font-black ${stats.colorMatch >= 80 ? 'text-green-500' : 'text-orange-500'}`}>{stats.colorMatch}%</span>
             </div>

             <div className="bg-slate-50 p-4 rounded-2xl border flex items-center justify-between">
                <span className="font-bold text-slate-600 text-sm">සම්පූර්ණ කිරීම (Coverage):</span>
                <span className={`text-2xl font-black ${stats.coverage >= 95 ? 'text-green-500' : 'text-orange-500'}`}>{stats.coverage}%</span>
             </div>
          </div>

          <div className="flex gap-2 mt-2 justify-center flex-wrap">
             <button onClick={() => { resetCanvas(); setStage('coloring'); }} className="px-6 py-3 rounded-2xl font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors shadow-sm border border-pink-200 flex-1">
               නැවත උත්සාහ කරන්න (Retry)
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
      {stage === 'coloring' && renderColoring()}
      {stage === 'result' && renderResult()}
    </div>
  );
}
