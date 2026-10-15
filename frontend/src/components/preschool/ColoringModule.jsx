import React, { useState, useRef, useEffect } from 'react';
import { recordStudentTestMarks, recordStudentQuestionAttempts } from '../../data/studentAnalyticsData';
import { getItem } from '../../utils/storage';

const CRAFTS = [
  // ── COLOR BY NUMBER (අංක අනුව වර්ණ ගැන්වීම) ──
  {
    id: 'cbn_bee',
    title: 'මීමැස්සා සහ මල (Bee & Flower)',
    icon: '🐝',
    category: 'color_by_number',
    isSplit: false,
    imageSrc: '/assets/color_bee.jpg',
    referenceSrc: '/assets/color_bee_colored.png',
    previewSrc: '/assets/color_bee_colored.png',
    colorKey: [
      { number: 1, name: 'කහ (Yellow)', hex: '#facc15' },
      { number: 2, name: 'දුඹුරු (Brown)', hex: '#a16207' },
      { number: 3, name: 'ලා නිල් (Light Blue)', hex: '#38bdf8' },
      { number: 4, name: 'කොළ (Green)', hex: '#22c55e' },
      { number: 5, name: 'රෝස (Pink)', hex: '#f472b6' }
    ]
  },
  {
    id: 'cbn_lion',
    title: 'සිංහයා සහ ගස (Lion & Tree)',
    icon: '🦁',
    category: 'color_by_number',
    isSplit: false,
    imageSrc: '/assets/color_lion.jpg',
    referenceSrc: '/assets/color_lion_colored.png',
    previewSrc: '/assets/color_lion_colored.png',
    colorKey: [
      { number: 1, name: 'කහ (Yellow)', hex: '#facc15' },
      { number: 2, name: 'තැඹිලි (Orange)', hex: '#f97316' },
      { number: 3, name: 'දුඹුරු (Brown)', hex: '#a16207' },
      { number: 4, name: 'කොළ (Green)', hex: '#22c55e' },
      { number: 5, name: 'නිල් (Blue)', hex: '#3b82f6' }
    ]
  },
  {
    id: 'cbn_car',
    title: 'මෝටර් රථය (Car)',
    icon: '🚗',
    category: 'color_by_number',
    isSplit: false,
    imageSrc: '/assets/color_car.jpg',
    referenceSrc: '/assets/color_car_colored.png',
    previewSrc: '/assets/color_car_colored.png',
    colorKey: [
      { number: 1, name: 'රතු (Red)', hex: '#ef4444' },
      { number: 2, name: 'ලා නිල් (Light Blue)', hex: '#38bdf8' },
      { number: 3, name: 'කහ (Yellow)', hex: '#facc15' },
      { number: 4, name: 'ලා අළු (Light Gray)', hex: '#9ca3af' },
      { number: 5, name: 'තද අළු (Dark Gray)', hex: '#4b5563' }
    ]
  },
  {
    id: 'cbn_tree',
    title: 'ගස (Tree)',
    icon: '🌳',
    category: 'color_by_number',
    isSplit: false,
    imageSrc: '/assets/color_tree.jpg',
    referenceSrc: '/assets/color_tree_colored.png',
    previewSrc: '/assets/color_tree_colored.png',
    colorKey: [
      { number: 1, name: 'කොළ (Green)', hex: '#22c55e' },
      { number: 2, name: 'කහ (Yellow)', hex: '#facc15' },
      { number: 3, name: 'තැඹිලි (Orange)', hex: '#f97316' },
      { number: 4, name: 'දුඹුරු (Brown)', hex: '#a16207' }
    ]
  },

  // ── FRUITS (පළතුරු) ──
  {
    id: 'strawberry',
    title: 'ස්ට්‍රෝබෙරි (Strawberry)',
    icon: '🍓',
    category: 'fruits',
    isSplit: true,
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
    category: 'fruits',
    isSplit: true,
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
    category: 'fruits',
    isSplit: true,
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
    category: 'fruits',
    isSplit: true,
    imageSrc: '/assets/mango.png',
    labels: [
      { text: 'කහ (Yellow)', color: '#facc15', x: '55%', y: '60%' },
      { text: 'කොළ (Green)', color: '#22c55e', x: '35%', y: '25%' },
      { text: 'දුඹුරු (Brown)', color: '#a16207', x: '45%', y: '15%' }
    ]
  },
  {
    id: 'pepper',
    title: 'බෙල් පෙපර් (Bell Pepper)',
    icon: '🫑',
    category: 'fruits',
    isSplit: true,
    imageSrc: '/assets/pepper.png',
    labels: [
      { text: 'රතු (Red)', color: '#ef4444', x: '50%', y: '60%' },
      { text: 'කොළ (Green)', color: '#22c55e', x: '50%', y: '20%' }
    ]
  }
];

const PALETTE = [
  { hex: '#ef4444', name: 'රතු (Red)' },
  { hex: '#f97316', name: 'තැඹිලි (Orange)' },
  { hex: '#facc15', name: 'කහ (Yellow)' },
  { hex: '#22c55e', name: 'කොළ (Green)' },
  { hex: '#38bdf8', name: 'ලා නිල් (Light Blue)' },
  { hex: '#3b82f6', name: 'නිල් (Blue)' },
  { hex: '#a855f7', name: 'දම් (Purple)' },
  { hex: '#f472b6', name: 'රෝස (Pink)' },
  { hex: '#a16207', name: 'දුඹුරු (Brown)' },
  { hex: '#9ca3af', name: 'ලා අළු (Light Gray)' },
  { hex: '#4b5563', name: 'තද අළු (Dark Gray)' },
  { hex: '#000000', name: 'කළු (Black)' },
];

const BRUSH_SIZES = [
  { size: 10, label: 'සිහින්', name: 'Fine / Small (සිහින්)', iconSize: 8 },
  { size: 20, label: 'සාමාන්‍ය', name: 'Medium (සාමාන්‍ය)', iconSize: 14 },
  { size: 35, label: 'මහත', name: 'Thick / Large (මහත)', iconSize: 22 },
  { size: 50, label: 'ඉතා මහත', name: 'Jumbo (විශාල)', iconSize: 30 }
];

export default function ColoringModule({ onExit }) {
  const [stage, setStage] = useState('selection');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'color_by_number', 'fruits'
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [activeColor, setActiveColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(20);
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
    const fullCraft = CRAFTS.find(c => c.id === craft.id) || craft;
    setSelectedCraft(fullCraft);
    if (fullCraft.colorKey && fullCraft.colorKey.length > 0) {
      const firstHex = fullCraft.colorKey[0].hex.toLowerCase();
      const matched = PALETTE.find(p => p.hex.toLowerCase() === firstHex) || { hex: fullCraft.colorKey[0].hex, name: fullCraft.colorKey[0].name };
      setActiveColor(matched);
      setIsEraser(false);
    } else {
      setActiveColor(PALETTE[0]);
      setIsEraser(false);
    }
    setStats({ coverage: 0, boundary: 0, colorMatch: 0 });
    setImageLoaded(false);
    setHistory([]);
    setHistoryStep(-1);
    setStage('coloring');
  };

  useEffect(() => {
    if (stage === 'coloring' && selectedCraft) {
      const currentCraft = CRAFTS.find(c => c.id === selectedCraft.id) || selectedCraft;
      const refSrc = currentCraft.referenceSrc;
      
      let isCancelled = false;
      const imgObj = new Image();
      const refImgObj = refSrc ? new Image() : null;
      let imgLoaded = false;
      let refLoaded = !refSrc;

      const onBothLoaded = () => {
        if (isCancelled) return;
        if (imgLoaded && refLoaded) {
          setupCanvas(imgObj, refImgObj);
          setImageLoaded(true);
        }
      };

      imgObj.onload = () => {
        imgLoaded = true;
        onBothLoaded();
      };
      imgObj.onerror = () => {
        console.warn("Could not load image:", currentCraft.imageSrc);
        imgLoaded = true;
        onBothLoaded();
      };
      imgObj.src = currentCraft.imageSrc;

      if (refImgObj) {
        refImgObj.onload = () => {
          refLoaded = true;
          onBothLoaded();
        };
        refImgObj.onerror = (err) => {
          console.warn("Could not load reference image:", refSrc, err);
          refLoaded = true;
          onBothLoaded();
        };
        refImgObj.src = refSrc;
      }

      return () => {
        isCancelled = true;
      };
    }
  }, [stage, selectedCraft?.id]);

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

  const setupCanvas = (img, refImg = null) => {
    const isSplit = selectedCraft?.isSplit !== false;
    const margin = isSplit ? 5 : 0; // Margin to hide outer dividing borders on split fruit images
    const halfWidth = Math.floor(img.width / 2);
    const targetWidth = isSplit ? halfWidth - (margin * 2) : img.width;
    const targetHeight = isSplit ? img.height - (margin * 2) : img.height;
    
    const refCvs = document.createElement('canvas');
    refCvs.width = targetWidth;
    refCvs.height = targetHeight;
    const refCtx = refCvs.getContext('2d');
    if (refImg) {
      refCtx.drawImage(refImg, 0, 0, targetWidth, targetHeight);
    } else if (isSplit) {
      refCtx.drawImage(img, halfWidth + margin, margin, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    } else {
      refCtx.drawImage(img, 0, 0, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    }
    setRefImageSrc(refCvs.toDataURL());
    refDataRef.current = refCtx.getImageData(0, 0, targetWidth, targetHeight); 

    const canvas = canvasRef.current;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? Math.round(brushSize * 1.5) : brushSize; 
    ctx.strokeStyle = activeColor.hex;
    ctxRef.current = ctx;

    // Save initial blank history
    setHistory([ctx.getImageData(0, 0, targetWidth, targetHeight)]);
    setHistoryStep(0);

    const maskCvs = document.createElement('canvas');
    maskCvs.width = targetWidth;
    maskCvs.height = targetHeight;
    const maskCtx = maskCvs.getContext('2d');
    if (isSplit) {
      maskCtx.drawImage(img, margin, margin, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    } else {
      maskCtx.drawImage(img, 0, 0, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    }
    
    const outlineCvs = document.createElement('canvas');
    outlineCvs.width = targetWidth;
    outlineCvs.height = targetHeight;
    const outlineCtx = outlineCvs.getContext('2d');
    if (isSplit) {
      outlineCtx.drawImage(img, margin, margin, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    } else {
      outlineCtx.drawImage(img, 0, 0, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    }
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
    
    const stack = [
      [0, 0],
      [targetWidth - 1, 0],
      [0, targetHeight - 1],
      [targetWidth - 1, targetHeight - 1]
    ];
    visited[0] = 1; 
    visited[targetWidth - 1] = 1;
    visited[(targetHeight - 1) * targetWidth] = 1;
    visited[targetWidth * targetHeight - 1] = 1;
    
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

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = isEraser ? Math.round(brushSize * 1.5) : brushSize;
    }
  }, [brushSize, isEraser]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = activeColor.hex;
      ctxRef.current.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
      ctxRef.current.lineWidth = isEraser ? Math.round(brushSize * 1.5) : brushSize;
      
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
          
          const refR = refData[i];
          const refG = refData[i+1];
          const refB = refData[i+2];
          
          // Check if ref pixel is an evaluable color target (not white background and not dark outline)
          const isRefWhite = refR > 240 && refG > 240 && refB > 240;
          const isRefOutline = refR < 50 && refG < 50 && refB < 50;
          const isRefColored = !isRefWhite && !isRefOutline;
          
          if (isRefColored) {
            colorEvaluablePixels++;
            
            // 1. Identify user's chosen palette color
            let userColorIdx = 0, userMinDist = Infinity;
            for (let pIdx = 0; pIdx < PALETTE_RGB.length; pIdx++) {
              const p = PALETTE_RGB[pIdx];
              const ud = (r - p.r)**2 + (g - p.g)**2 + (b - p.b)**2;
              if (ud < userMinDist) { userMinDist = ud; userColorIdx = pIdx; }
            }
            
            // 2. Identify target reference palette color (excluding black/white)
            let refColorIdx = 0, refMinDist = Infinity;
            for (let pIdx = 0; pIdx < PALETTE_RGB.length; pIdx++) {
              const p = PALETTE_RGB[pIdx];
              if (PALETTE[pIdx].hex === '#000000' || PALETTE[pIdx].hex === '#ffffff') continue;
              
              const rd = (refR - p.r)**2 + (refG - p.g)**2 + (refB - p.b)**2;
              if (rd < refMinDist) { refMinDist = rd; refColorIdx = pIdx; }
            }
            
            // Strict color accuracy: the color chosen must match the target reference color exactly
            if (userColorIdx === refColorIdx) {
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
    const rawColorPercent = colorEvaluablePixels > 0 ? (colorCorrect / colorEvaluablePixels) * 100 : 0;
    const colorPercent = rawColorPercent < 2 ? 0 : Math.round(rawColorPercent);
    
    const overallColoring = Math.round((boundaryPercent * 0.40) + (colorPercent * 0.40) + (coveragePercent * 0.20));

    setStats({
      coverage: Math.min(100, coveragePercent),
      boundary: Math.min(100, boundaryPercent),
      colorMatch: Math.min(100, colorPercent),
      overall: Math.min(100, overallColoring)
    });

    // Save to student profile & dashboard analytics
    const currentStudentId = getItem('studentId') || 'std_001';
    const currentStudentName = getItem('studentName') || 'Hasara';

    try {
      const studentKey = (currentStudentName || 'hasara').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
      const craftId = selectedCraft?.id || 'coloring_task';
      const existing = JSON.parse(localStorage.getItem(`coloring_scores_${studentKey}`) || '{}');
      if (!existing[craftId]) {
        existing[craftId] = {
          craftId,
          title: selectedCraft?.title || 'Digital Coloring',
          coverage: coveragePercent,
          boundary: boundaryPercent,
          colorMatch: colorPercent,
          overall: overallColoring,
          grade: 'Pre-School',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(`coloring_scores_${studentKey}`, JSON.stringify(existing));
        if (studentKey === 'hasara' || studentKey === 'std_001') {
          localStorage.setItem('coloring_scores', JSON.stringify(existing));
        }
      }
    } catch (e) {}

    const p2Marks = Math.round((overallColoring / 100) * 30);
    recordStudentTestMarks({
      studentId: currentStudentId,
      name: currentStudentName,
      subject: 'preschool',
      categoryCode: 'P2',
      marks: p2Marks,
      maxMarks: 30
    });

    recordStudentQuestionAttempts({
      studentId: currentStudentId,
      module: 'preschool',
      grade: 'Pre-School',
      paperNumber: 1,
      attempts: [
        {
          questionId: `Digital Coloring • ${selectedCraft?.title || 'Coloring Activity'}`,
          domain: 'P2',
          category: 'P2',
          difficulty: 'Pre-School',
          isCorrect: overallColoring >= 50,
          score: overallColoring,
          boundary: boundaryPercent,
          coverage: coveragePercent,
          timestamp: new Date().toISOString()
        }
      ]
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

  const renderSelection = () => {
    const displayedCrafts = activeCategory === 'all' 
      ? CRAFTS 
      : CRAFTS.filter(c => c.category === activeCategory);

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
          <h2 onClick={onExit} className="text-4xl font-bold text-pink-600 mb-2 font-sinhala cursor-pointer hover:opacity-80 transition-opacity inline-block">
            ඩිජිටල් වර්ණ ගැන්වීම (Digital Coloring)
          </h2>
          <p className="text-slate-600 mb-6 text-lg">AI boundary detection helps improve fine motor skills!</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-pink-600 text-white shadow-pink-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🎨 සියල්ල (All Activities)
          </button>
          <button
            onClick={() => setActiveCategory('color_by_number')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
              activeCategory === 'color_by_number'
                ? 'bg-pink-600 text-white shadow-pink-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>🔢</span> අංක අනුව වර්ණ (Color by Number)
          </button>
          <button
            onClick={() => setActiveCategory('fruits')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
              activeCategory === 'fruits'
                ? 'bg-pink-600 text-white shadow-pink-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>🍎</span> පළතුරු (Fruits)
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {displayedCrafts.map(craft => (
            <button 
              key={craft.id} 
              onClick={() => handleSelectCraft(craft)} 
              className="cursor-pointer bg-white px-5 pt-5 pb-8 rounded-[2rem] shadow-sm border-4 border-slate-100 hover:border-pink-400 hover:shadow-xl transition-all transform hover:-translate-y-2 group flex flex-col items-center h-full relative"
            >
              {craft.category === 'color_by_number' && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs z-10">
                  🔢 Color by Number
                </span>
              )}
              <div className="w-full aspect-[4/5] mb-4 overflow-hidden rounded-2xl relative group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center p-2">
                <img 
                  src={craft.previewSrc || craft.referenceSrc || craft.imageSrc} 
                  alt={craft.title} 
                  className={`w-full h-full ${craft.isSplit === false ? 'object-contain object-center' : 'object-cover object-right'}`} 
                />
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-sinhala whitespace-pre-line leading-snug">
                {craft.icon} {craft.title.replace(' (', '\n(')}
              </h3>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderColoring = () => (
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
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-pink-600 inline-flex items-center justify-center gap-2 font-sinhala whitespace-nowrap leading-normal">
              <span>{selectedCraft.icon}</span>
              <span>{selectedCraft.title} වර්ණ ගන්වන්න</span>
            </h2>
          </div>

          {/* Change Activity Button on Right */}
          <div className="flex items-center shrink-0 order-3 sm:order-3">
            <button 
              onClick={() => setStage('selection')} 
              className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl font-bold text-xs sm:text-sm shadow-xs border border-pink-200 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              title="වෙනත් ක්‍රියාකාරකමක් තෝරන්න (Change Activity)"
            >
              <span>🎨</span>
              <span>වෙනස් කරන්න (Change)</span>
            </button>
          </div>
        </div>

      {!imageLoaded && <div className="p-12 text-slate-500 font-bold animate-pulse text-center">Loading Reference Image...</div>}

      <div className={`flex flex-col lg:flex-row gap-6 xl:gap-8 items-center lg:items-start justify-center w-full ${!imageLoaded ? 'hidden' : ''}`}>
         
         {/* LEFT TOOLBAR */}
         <div className="flex flex-row lg:flex-col gap-2.5 items-center justify-center bg-slate-50/90 p-2.5 rounded-2xl shadow-xs border border-slate-200/90 w-full lg:w-auto shrink-0">
           <button onClick={undo} disabled={historyStep <= 0} className="w-12 h-12 lg:w-13 lg:h-13 rounded-xl bg-white border border-slate-200 shadow-xs disabled:opacity-40 text-xl hover:bg-slate-100 transition-all flex items-center justify-center cursor-pointer active:scale-95" title="Undo (ආපසු හරවන්න)">↩️</button>
           <button onClick={redo} disabled={historyStep >= history.length - 1} className="w-12 h-12 lg:w-13 lg:h-13 rounded-xl bg-white border border-slate-200 shadow-xs disabled:opacity-40 text-xl hover:bg-slate-100 transition-all flex items-center justify-center cursor-pointer active:scale-95" title="Redo (නැවත කරන්න)">↪️</button>
           
           <div className="w-px h-8 lg:w-8 lg:h-px bg-slate-300 mx-1 lg:my-1"></div>

           <button onClick={() => setIsEraser(false)} className={`w-12 h-12 lg:w-13 lg:h-13 rounded-xl border shadow-xs text-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${!isEraser ? 'ring-3 ring-pink-400 bg-pink-100 border-pink-300 font-bold scale-105' : 'bg-white border-slate-200 hover:bg-slate-100'}`} title={`Paintbrush - පින්සල (${brushSize}px)`}>🖌️</button>
           <button onClick={() => setIsEraser(true)} className={`w-12 h-12 lg:w-13 lg:h-13 rounded-xl border shadow-xs text-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${isEraser ? 'ring-3 ring-pink-400 bg-pink-100 border-pink-300 font-bold scale-105' : 'bg-white border-slate-200 hover:bg-slate-100'}`} title={`Eraser - මකනය (${Math.round(brushSize * 1.5)}px)`}>🧽</button>
           <button onClick={resetCanvas} className="w-12 h-12 lg:w-13 lg:h-13 rounded-xl bg-rose-50 text-rose-500 border border-rose-200 shadow-xs text-xl hover:bg-rose-100 transition-all flex items-center justify-center cursor-pointer active:scale-95" title="Clear (මකන්න)">🧹</button>
         </div>

         {/* Drawing Canvas Area */}
         <div className="flex flex-col items-center w-full flex-1 min-w-0 max-w-[560px] xl:max-w-[590px]">
           {/* Brush Size Controls */}
           <div className="w-full mb-3 bg-slate-50/90 px-4 py-2 rounded-2xl shadow-xs border border-slate-200/90 flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
             <div className="flex items-center gap-2">
               <span className="text-xs sm:text-sm font-bold text-slate-700 font-sinhala flex items-center gap-1.5">
                 <span>✏️</span> ප්‍රමාණය:
               </span>
               {/* Live Brush Size & Color Indicator Circle */}
               <div 
                 className="rounded-full shadow-inner border border-slate-300 shrink-0 transition-all flex items-center justify-center bg-white"
                 style={{
                   width: '28px',
                   height: '28px'
                 }}
                 title={`දැනට පින්සල් ප්‍රමාණය: ${brushSize}px`}
               >
                 <span 
                   className="rounded-full transition-all"
                   style={{
                     width: `${Math.min(22, Math.max(5, brushSize * 0.42))}px`,
                     height: `${Math.min(22, Math.max(5, brushSize * 0.42))}px`,
                     backgroundColor: isEraser ? '#f472b6' : activeColor.hex
                   }}
                 />
               </div>
               <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                 {brushSize}px
               </span>
             </div>

             {/* Quick Size Preset Buttons */}
             <div className="flex items-center gap-1.5">
               {BRUSH_SIZES.map(preset => (
                 <button
                   key={preset.size}
                   type="button"
                   onClick={() => setBrushSize(preset.size)}
                   className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                     brushSize === preset.size
                       ? 'bg-pink-600 text-white shadow-xs ring-2 ring-pink-300 scale-105'
                       : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                   }`}
                   title={`${preset.name} (${preset.size}px)`}
                 >
                   <span
                     className="rounded-full bg-current transition-all"
                     style={{ width: `${preset.iconSize * 0.85}px`, height: `${preset.iconSize * 0.85}px` }}
                   />
                 </button>
               ))}
             </div>

             {/* Smooth Slider */}
             <div className="hidden sm:flex items-center gap-2">
               <input
                 type="range"
                 min="6"
                 max="60"
                 value={brushSize}
                 onChange={(e) => setBrushSize(Number(e.target.value))}
                 className="w-20 accent-pink-600 cursor-pointer"
                 title={`ප්‍රමාණය වෙනස් කරන්න: ${brushSize}px`}
               />
             </div>
           </div>

           <div 
             className={`relative bg-white rounded-3xl shadow-lg border-4 border-slate-200 overflow-hidden w-full ${selectedCraft?.isSplit === false ? 'aspect-[3/4] max-h-[540px]' : 'aspect-square'} mb-3`} 
             style={{ touchAction: 'none' }}
           >
             {imageLoaded && <img src={outlineCanvasRef.current?.toDataURL()} className="absolute inset-0 w-full h-full object-contain opacity-50 pointer-events-none" />}
             <canvas
               ref={canvasRef}
               className="w-full h-full object-contain relative z-10 mix-blend-multiply"
               style={{
                 cursor: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                   isEraser 
                     ? '<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><text x="0" y="24" font-size="24">🧽</text></svg>'
                     : `<svg width="${Math.min(48, Math.max(20, brushSize + 4))}" height="${Math.min(48, Math.max(20, brushSize + 4))}" xmlns="http://www.w3.org/2000/svg"><circle cx="${Math.round(Math.min(48, Math.max(20, brushSize + 4)) / 2)}" cy="${Math.round(Math.min(48, Math.max(20, brushSize + 4)) / 2)}" r="${Math.min(22, Math.max(4, Math.round(brushSize / 2)))}" fill="${activeColor.hex}" stroke="white" stroke-width="2"/></svg>`
                 )}") ${isEraser ? '12 12' : `${Math.round(Math.min(48, Math.max(20, brushSize + 4)) / 2)} ${Math.round(Math.min(48, Math.max(20, brushSize + 4)) / 2)}`}, crosshair`
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
           <div className="bg-slate-50/90 p-3 rounded-2xl shadow-xs border border-slate-200/90 flex flex-wrap justify-center gap-2.5 w-full">
             {PALETTE.map(color => (
               <div key={color.hex} className="group relative">
                 <button
                   onClick={() => { setActiveColor(color); setIsEraser(false); }}
                   style={{ backgroundColor: color.hex }}
                   className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-inner transform transition-transform cursor-pointer ${(!isEraser && activeColor.hex === color.hex) ? 'scale-125 ring-3 ring-pink-400 z-10' : 'hover:scale-110'} border-2 border-white`}
                 />
                 {/* Hover Tooltip */}
                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sinhala shadow-lg z-30">
                   {color.name}
                   <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Reference & Actions Area */}
         <div className="flex flex-col items-center gap-3 w-full lg:w-[320px] xl:w-[350px] shrink-0">
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 shadow-xs w-full flex flex-col items-center gap-2.5">
              <h3 className="font-bold text-slate-600 uppercase tracking-wider text-xs">Reference (මඟපෙන්වීම)</h3>
              <div className={`w-full ${selectedCraft?.isSplit === false ? 'aspect-[3/4] max-h-[280px]' : 'aspect-square'} bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden p-2 flex items-center justify-center`}>
                <img src={refImageSrc} alt="Reference" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Interactive Color Key for Color by Number activities */}
            {selectedCraft?.colorKey && (
              <div className="w-full bg-slate-50/90 p-3 rounded-2xl border border-slate-200/90 shadow-xs">
                <h4 className="text-xs font-bold text-slate-600 uppercase mb-2 text-center">🔢 අංක සහ වර්ණ (Color Key)</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedCraft.colorKey.map(k => (
                    <button
                      key={k.number}
                      type="button"
                      onClick={() => {
                        const matched = PALETTE.find(p => p.hex.toLowerCase() === k.hex.toLowerCase());
                        if (matched) { setActiveColor(matched); setIsEraser(false); }
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white hover:bg-pink-50 border border-slate-200 transition-all text-left group cursor-pointer shadow-2xs"
                      title={`${k.number}: ${k.name} තෝරන්න`}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] text-white shadow-2xs shrink-0" style={{ backgroundColor: k.hex }}>
                        {k.number}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 font-sinhala group-hover:text-pink-600 transition-colors truncate">
                        {k.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 text-blue-800 px-4 py-2.5 rounded-xl font-medium border border-blue-200/80 shadow-2xs w-full text-center font-sinhala text-xs">
              {selectedCraft?.colorKey 
                ? 'අංක අනුව නිවැරදි වර්ණ තෝරා කළු රේඛාවෙන් පිටතට නොයා වර්ණ ගන්වන්න!' 
                : 'නිවැරදි වර්ණ තෝරාගෙන කළු රේඛාවෙන් පිටතට නොයා වර්ණ ගන්වන්න!'}
            </div>

            <button onClick={calculateAccuracy} className="w-full px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-base sm:text-lg font-sinhala cursor-pointer">
              ✨ නිවැරදි දැයි බලමු (Check)
            </button>

            {/* Physical Paper Mode */}
            <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/90 shadow-xs w-full flex items-center gap-3">
               <div className="bg-white p-1.5 rounded-xl border border-slate-200 shrink-0" title="Scan to open image on mobile">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + selectedCraft?.imageSrc)}`} alt="QR" className="w-14 h-14 rounded-lg mix-blend-multiply" />
               </div>
               <div className="flex-1 flex flex-col gap-1.5">
                  <button onClick={() => window.open(selectedCraft.imageSrc, '_blank')} className="w-full px-3 py-1.5 bg-slate-800 text-white font-bold rounded-xl shadow-xs text-xs hover:bg-slate-900 transition-colors cursor-pointer">
                    🖨️ Print Paper
                  </button>
                  <label className="w-full px-3 py-1.5 bg-pink-100 text-pink-700 font-bold rounded-xl shadow-xs text-xs hover:bg-pink-200 transition-colors cursor-pointer text-center">
                    📸 Upload Drawing
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhysical} />
                  </label>
               </div>
            </div>
         </div>
      </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up mt-6">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-pink-500 relative overflow-hidden flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {showConfetti && <div className="absolute inset-0 text-6xl flex items-center justify-center animate-ping pointer-events-none z-0">🎉</div>}

        {/* 1. Reference Image */}
        <div className="flex-1 w-full max-w-sm relative z-10 flex flex-col items-center">
          <h3 className="text-xl font-bold text-green-600 mb-4 font-sinhala">නිවැරදි පින්තූරය (Correct Image)</h3>
          <div className={`relative bg-white rounded-3xl shadow-md border-2 border-green-200 overflow-hidden w-full ${selectedCraft?.isSplit === false ? 'aspect-[3/4] max-h-[360px]' : 'aspect-square'} pointer-events-none p-2 flex items-center justify-center`}>
             <img src={refImageSrc} className="w-full h-full object-contain" />
             
             {/* Color Labels Overlay */}
             {selectedCraft?.labels?.map((label, idx) => (
                <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-3 py-1 rounded-xl text-xs font-bold shadow-sm border border-slate-200 z-30" style={{ left: label.x, top: label.y, color: label.color }}>
                   {label.text}
                </div>
             ))}
          </div>

          {/* Color Key Badges for Color by Number */}
          {selectedCraft?.colorKey && (
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {selectedCraft.colorKey.map(k => (
                <span key={k.number} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: k.hex }}>{k.number}</span>
                  <span>{k.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. User Work (with Magenta for mistakes) */}
        <div className="flex-1 w-full max-w-sm relative z-10 flex flex-col items-center">
          <h3 className="text-xl font-bold text-slate-700 mb-4 font-sinhala">ඔබේ වර්ණ ගැන්වීම (Your Work)</h3>
          <div className={`relative bg-white rounded-3xl shadow-md border-2 border-slate-200 overflow-hidden w-full ${selectedCraft?.isSplit === false ? 'aspect-[3/4] max-h-[360px]' : 'aspect-square'}`} style={{ pointerEvents: 'none' }}>
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

             <div className="bg-pink-50 p-5 rounded-3xl border-2 border-pink-200 flex flex-col items-center justify-center mt-1 shadow-xs">
                <span className="font-bold text-pink-800 text-sm mb-1 font-sinhala">සමස්ත ලකුණු (Overall Score)</span>
                <div className="text-4xl font-black text-pink-600 drop-shadow-sm">{stats.overall} <span className="text-2xl text-pink-400">/ 100 ({stats.overall}%)</span></div>
             </div>
          </div>

          <div className="flex flex-col gap-2.5 mt-3 w-full">
             <button 
               onClick={() => { 
                 resetCanvas(); 
                 const fullCraft = CRAFTS.find(c => c.id === selectedCraft?.id) || selectedCraft;
                 setSelectedCraft(fullCraft);
                 if (fullCraft?.colorKey && fullCraft.colorKey.length > 0) {
                   const firstHex = fullCraft.colorKey[0].hex.toLowerCase();
                   const matched = PALETTE.find(p => p.hex.toLowerCase() === firstHex) || { hex: fullCraft.colorKey[0].hex, name: fullCraft.colorKey[0].name };
                   setActiveColor(matched);
                   setIsEraser(false);
                 }
                 setStage('coloring'); 
               }} 
               className="w-full py-3.5 px-6 rounded-2xl font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors shadow-xs border border-pink-200 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base font-sinhala"
             >
               <span>🔄</span>
               <span>නැවත උත්සාහ කරන්න (Retry)</span>
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
      {stage === 'coloring' && renderColoring()}
      {stage === 'result' && renderResult()}
    </div>
  );
}
