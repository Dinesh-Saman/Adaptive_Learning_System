import React, { useState, useRef, useEffect } from 'react';

// --- CRAFT DATA (IN SINHALA) ---
const CRAFTS = [
  {
    id: 'boat',
    title: 'බෝට්ටුව (Boat)',
    icon: '⛵',
    steps: [
      { text: "සෘජුකෝණාස්‍ර කඩදාසියක් ගෙන එය හරස් අතට හරි මැදින් ඉහළට නමන්න.", instruction: "Fold the rectangular paper in half (bottom to top)." },
      { text: "එය නැවතත් හරි මැදින් නමා දිග හරින්න. (මැද රේඛාව ලකුණු කරගන්න)", instruction: "Fold in half again (right to left) and unfold to crease the center." },
      { text: "ඉහළ කොන් දෙක මැද රේඛාවට ගෙනැවිත් ත්‍රිකෝණාකාරව නමන්න.", instruction: "Fold the top two corners down to the center line." },
      { text: "යටින් ඉතිරි වී ඇති එක් තීරුවක් ඉහළට නමන්න.", instruction: "Fold one of the bottom rectangular strips up." },
      { text: "කඩදාසිය අනෙක් පැත්ත හරවා, ඉතිරි තීරුවද ඉහළට නමන්න.", instruction: "Flip the paper over and fold the other bottom strip up." },
      { text: "යටින් විවෘත කර, චතුරස්‍රයක් වන සේ පැතලි කරන්න.", instruction: "Open from the bottom and flatten into a diamond shape." },
      { text: "යට කොන ඉහළට නමන්න.", instruction: "Fold the bottom point up to the top." },
      { text: "අනෙක් පැත්ත හරවා, එම යට කොනද ඉහළට නමා ත්‍රිකෝණයක් සාදන්න.", instruction: "Flip over and fold the other bottom point up to make a triangle." },
      { text: "නැවතත් යටින් විවෘත කර, දෙපැත්තට අදින්න. බෝට්ටුව සූදානම්!", instruction: "Open from the bottom again and pull the sides apart. Boat is ready!" }
    ]
  },
  {
    id: 'cat',
    title: 'බළලා (Cat)',
    icon: '🐱',
    steps: [
      { text: "සමචතුරස්‍ර කඩදාසියක් ගෙන එය ත්‍රිකෝණයක් වන සේ හරස් අතට නමන්න.", instruction: "Fold a square paper diagonally into a triangle." },
      { text: "එම ත්‍රිකෝණය නැවතත් හරි මැදින් නමා දිග හැර ගන්න. (මැද රේඛාව ලකුණු කරගන්න)", instruction: "Fold it in half again and unfold to crease the center." },
      { text: "පහළ කොන් දෙක කන් හැඩයට ඉහළට නමන්න.", instruction: "Fold the two bottom corners up to make ears." },
      { text: "ඉහළ කොන මදක් පහළට නමන්න.", instruction: "Fold the top point slightly down." },
      { text: "කඩදාසිය අනිත් පැත්ත හරවා ඇස්, නාසය සහ උඩුරැවුල අඳින්න.", instruction: "Turn the paper over and draw eyes, nose, and whiskers." }
    ]
  },
  {
    id: 'butterfly',
    title: 'සමනලයා (Butterfly)',
    icon: '🦋',
    steps: [
      { text: "සමචතුරස්‍ර කඩදාසියක් ගෙන පැති හතරටම සහ හරස් අතට නමා දිග හරින්න.", instruction: "Fold a square paper in all directions and unfold (create a star crease)." },
      { text: "පැති දෙක මැදට තද කරමින් ත්‍රිකෝණයක් සාදා ගන්න.", instruction: "Push the sides in to collapse into a waterbomb base (triangle)." },
      { text: "ඉදිරිපස ඇති කොන් දෙක ඉහළට නමන්න.", instruction: "Fold the two front corners up to the top point." },
      { text: "පිටුපසට හරවා, යටින් ඇති කොන ඉහළට නමන්න (කොන මදක් පිටතට සිටින සේ).", instruction: "Flip over, fold the bottom point up so the tip sticks out slightly." },
      { text: "එම කුඩා කොන පහළට නමා තද කරන්න. දැන් හරි මැදින් නමා හැඩය ගන්න.", instruction: "Fold the small tip over to lock it, then fold the whole thing in half to shape the wings." }
    ]
  }
];

export default function OrigamiModule({ onExit }) {
  const [stage, setStage] = useState('selection'); // selection, camera-setup, folding, result
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [stepError, setStepError] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [cameraError, setCameraError] = useState('');
  const [paperRect, setPaperRect] = useState(null);
  const [paperCorners, setPaperCorners] = useState([]);
  const [aspectRatio, setAspectRatio] = useState(4/3);
  const [showDebug, setShowDebug] = useState(true);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const debugCanvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastProcessTime = useRef(0);
  const detectedCornersCountRef = useRef(0);

  // --- MATH & COMPUTER VISION HELPERS (Pure JS) ---
  const convexHull = (points) => {
    if (points.length < 3) return points;
    points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower = [];
    for (let p of points) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
      lower.push(p);
    }
    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
      const p = points[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
      upper.push(p);
    }
    upper.pop();
    lower.pop();
    return lower.concat(upper);
  };

  const pointLineDistance = (point, lineStart, lineEnd) => {
    const num = Math.abs((lineEnd.y - lineStart.y) * point.x - (lineEnd.x - lineStart.x) * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
    const den = Math.hypot(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);
    return den === 0 ? Math.hypot(point.x - lineStart.x, point.y - lineStart.y) : num / den;
  };

  const douglasPeucker = (points, epsilon) => {
    let dmax = 0;
    let index = 0;
    const end = points.length - 1;
    if (end < 1) return points;
    
    for (let i = 1; i < end; i++) {
      const d = pointLineDistance(points[i], points[0], points[end]);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }
    if (dmax > epsilon) {
      const rec1 = douglasPeucker(points.slice(0, index + 1), epsilon);
      const rec2 = douglasPeucker(points.slice(index), epsilon);
      return rec1.slice(0, -1).concat(rec2);
    } else {
      return [points[0], points[end]];
    }
  };

  // --- CAMERA MANAGEMENT ---
  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera if on mobile
      });
      streamRef.current = stream;
      setStage('folding');
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError('කැමරාව ආරම්භ කිරීමට නොහැකි විය. කරුණාකර අවසර ලබා දී ඇත්දැයි පරීක්ෂා කරන්න. (Camera access denied)');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Attach stream to video element when entering folding stage and start vision loop
  useEffect(() => {
    if (stage === 'folding' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      
      const processFrame = (time) => {
        if (!videoRef.current || !canvasRef.current) return;
        
        // Throttle to ~15fps (every 66ms)
        if (time - lastProcessTime.current < 66) {
          rafRef.current = requestAnimationFrame(processFrame);
          return;
        }
        lastProcessTime.current = time;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Ensure canvas dimensions match video
        if (video.videoWidth > 0 && canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        
        if (canvas.width === 0) {
           rafRef.current = requestAnimationFrame(processFrame);
           return;
        }

        // Draw video to canvas (flipped horizontally since video is mirrored)
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Get raw pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 1. Fast Histogram for Adaptive Thresholding
        const hist = new Array(256).fill(0);
        let totalSamples = 0;
        const step = 4;
        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4;
            const luma = Math.round(0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]);
            hist[luma]++;
            totalSamples++;
          }
        }
        
        // Find the 95th percentile brightness (represents the white paper, ignoring small glares)
        let countLuma = 0;
        let p95Luma = 255;
        for (let i = 255; i >= 0; i--) {
           countLuma += hist[i];
           if (countLuma > totalSamples * 0.05) {
              p95Luma = i;
              break;
           }
        }
        
        // The paper will be the brightest large object. Hands and face will be darker.
        const adaptiveThreshold = Math.max(60, p95Luma * 0.75); // Must be at least 60

        let boundaryPoints = [];
        let sumX = 0, sumY = 0, count = 0;
        
        // 2. Fast Edge Extraction using the Adaptive Threshold
        for (let y = 0; y < canvas.height; y += step) {
          let leftMost = null;
          let rightMost = null;
          
          for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i], g = data[i+1], b = data[i+2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Advanced White/Grey Detection (Strictly ignores hands and background)
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;
            
            // 1. luma > adaptiveThreshold: Only pick the brightest object (the paper)
            // 2. saturation < 0.25: Must be neutral color (white or grey in shadow). 
            if (luma > adaptiveThreshold && saturation < 0.25) {
              
              if (!leftMost) leftMost = {x, y};
              rightMost = {x, y};
              
              sumX += x;
              sumY += y;
              count++;
            }
          }
          if (leftMost) boundaryPoints.push(leftMost);
          if (rightMost && rightMost.x !== leftMost.x) boundaryPoints.push(rightMost);
        }

        // Must find enough white mass
        if (boundaryPoints.length > 20 && count > 400) {
          const cx = sumX / count;
          const cy = sumY / count;
          
          // 1. Calculate Convex Hull of boundary points
          const hull = convexHull(boundaryPoints);
          
          // 2. Simplify Hull into a Polygon using Douglas-Peucker
          // Epsilon is based on the approximate size of the paper to ignore fingers
          const hullPerimeter = hull.reduce((sum, pt, i) => {
             const next = hull[(i + 1) % hull.length];
             return sum + Math.hypot(pt.x - next.x, pt.y - next.y);
          }, 0);
          
          // Add first point to end for closed loop Douglas-Peucker
          hull.push(hull[0]);
          let simplifiedCorners = douglasPeucker(hull, hullPerimeter * 0.05);
          simplifiedCorners.pop(); // Remove duplicate last point
          
          // Merge extremely close final corners (just in case of noise)
          const merged = [];
          simplifiedCorners.forEach(c1 => {
             const isDup = merged.some(c2 => Math.hypot(c1.x - c2.x, c1.y - c2.y) < hullPerimeter * 0.1);
             if (!isDup) merged.push(c1);
          });
          
          detectedCornersCountRef.current = merged.length;
          
          // Calculate Bounding Box of the Polygon for the fold overlay container
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          merged.forEach(pt => {
             if (pt.x < minX) minX = pt.x;
             if (pt.y < minY) minY = pt.y;
             if (pt.x > maxX) maxX = pt.x;
             if (pt.y > maxY) maxY = pt.y;
          });
          
          // Estimate angle based on longest edge
          let bestAngle = 0;
          let maxEdgeLen = 0;
          for(let i=0; i<merged.length; i++) {
             const p1 = merged[i];
             const p2 = merged[(i+1)%merged.length];
             const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
             if (len > maxEdgeLen) {
                maxEdgeLen = len;
                bestAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
             }
          }

          const targetRect = {
            x: (minX / canvas.width) * 100,
            y: (minY / canvas.height) * 100,
            w: ((maxX - minX) / canvas.width) * 100,
            h: ((maxY - minY) / canvas.height) * 100,
            angle: bestAngle * (180 / Math.PI)
          };

          setPaperRect(prev => {
            if (!prev) return targetRect;
            const smooth = 0.3; 
            let newAngle = prev.angle + (targetRect.angle - prev.angle) * smooth;
            if (Math.abs(targetRect.angle - prev.angle) > 45) newAngle = targetRect.angle;
            
            return {
              x: prev.x + (targetRect.x - prev.x) * smooth,
              y: prev.y + (targetRect.y - prev.y) * smooth,
              w: prev.w + (targetRect.w - prev.w) * smooth,
              h: prev.h + (targetRect.h - prev.h) * smooth,
              angle: newAngle
            };
          });
          
          setPaperCorners(merged.map(pt => ({
             x: (pt.x / canvas.width) * 100,
             y: (pt.y / canvas.height) * 100
          })));
          
          // Debug View
          if (debugCanvasRef.current && showDebug) {
             const dCtx = debugCanvasRef.current.getContext('2d');
             dCtx.clearRect(0, 0, debugCanvasRef.current.width, debugCanvasRef.current.height);
             
             // Draw Hull (blue)
             dCtx.strokeStyle = 'blue';
             dCtx.beginPath();
             hull.forEach((pt, i) => {
                const dx = (pt.x / canvas.width) * 320;
                const dy = (pt.y / canvas.height) * 240;
                if (i === 0) dCtx.moveTo(dx, dy);
                else dCtx.lineTo(dx, dy);
             });
             dCtx.stroke();
             
             // Draw Simplified Polygon (green)
             dCtx.strokeStyle = '#00ff00';
             dCtx.lineWidth = 2;
             dCtx.beginPath();
             merged.forEach((pt, i) => {
                const dx = (pt.x / canvas.width) * 320;
                const dy = (pt.y / canvas.height) * 240;
                if (i === 0) dCtx.moveTo(dx, dy);
                else dCtx.lineTo(dx, dy);
             });
             dCtx.closePath();
             dCtx.stroke();
          }
          
        } else {
          setPaperRect(null);
          setPaperCorners([]);
          detectedCornersCountRef.current = 0;
          if (debugCanvasRef.current && showDebug) {
             debugCanvasRef.current.getContext('2d').clearRect(0, 0, 320, 240);
          }
        }

        rafRef.current = requestAnimationFrame(processFrame);
      };

      rafRef.current = requestAnimationFrame(processFrame);
    }
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);


  // --- FLOW HANDLERS ---
  const handleSelectCraft = (craft) => {
    setSelectedCraft(craft);
    setCurrentStep(0);
    setFailCount(0);
    setStepError('');
    setStage('camera-setup');
  };

  const handleCheckStep = () => {
    setIsAiChecking(true);
    setStepError('');
    // Mock AI vision processing delay
    setTimeout(() => {
      setIsAiChecking(false);
      
      // Pure JS Corner Counting Verification
      const corners = detectedCornersCountRef.current;
      
      let expectedTriangle = false; 
      
      const cid = selectedCraft.id;
      if (cid === 'boat') {
         // Step 5 (index 4): Folded hat -> Triangle
         // Step 7 (index 6): Folded bottom up -> Triangle
         // Step 8 (index 7): Folded other bottom up -> Triangle
         if (currentStep === 4 || currentStep === 6 || currentStep === 7) {
            expectedTriangle = true; 
         }
      }
      
      const isTriangle = corners <= 3;

      if (corners === 0) {
         setStepError(`කඩදාසිය හඳුනා ගැනීමට නොහැකි විය. (Cannot detect paper).`);
         return;
      } else if (isTriangle !== expectedTriangle) { 
         setStepError(`හැඩය නිවැරදි නැත. (${expectedTriangle ? 'ත්‍රිකෝණයක් (Triangle)' : 'චතුරස්‍රයක් (Rectangle/Diamond)'} බලාපොරොත්තු වේ). නැවත පරීක්ෂා කර බලන්න.`);
         return;
      }
      
      setFailCount(0);

      if (currentStep < selectedCraft.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setStage('result');
        stopCamera();
      }
    }, 2500);
  };

  const resetModule = () => {
    stopCamera();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPaperRect(null);
    setSelectedCraft(null);
    setCurrentStep(0);
    setStage('selection');
  };

  const renderStepOverlay = () => {
    if (!selectedCraft) return null;
    const cid = selectedCraft.id;
    const step = currentStep;

    // Helper components
    const HLine = ({ top }) => <div className="absolute left-0 w-full border-t-4 border-dashed border-green-400 shadow-sm" style={{ top }} />;
    const VLine = ({ left }) => <div className="absolute top-0 h-full border-l-4 border-dashed border-green-400 shadow-sm" style={{ left }} />;
    const ArrowDown = ({ top, left }) => <div className="absolute text-green-400 text-4xl animate-bounce" style={{ top, left, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>↓</div>;
    const ArrowUp = ({ top, left }) => <div className="absolute text-green-400 text-4xl animate-bounce" style={{ top, left, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>↑</div>;
    
    if (cid === 'boat') {
      if (step === 0) return <><HLine top="50%" /><ArrowUp top="65%" left="45%" /></>;
      if (step === 1) return <><VLine left="50%" /><div className="absolute text-green-400 text-5xl animate-bounce" style={{ top: '40%', left: '55%' }}>⬅️</div></>;
      if (step === 2) return (
        <>
          <div className="absolute top-0 left-[50%] w-[50%] border-b-4 border-dashed border-green-400 transform origin-bottom-left -rotate-45" />
          <div className="absolute top-0 right-[50%] w-[50%] border-b-4 border-dashed border-green-400 transform origin-bottom-right rotate-45" />
          <div className="absolute text-green-400 text-5xl animate-bounce" style={{ top: '20%', left: '20%' }}>↘️</div>
          <div className="absolute text-green-400 text-5xl animate-bounce" style={{ top: '20%', left: '70%' }}>↙️</div>
        </>
      );
      if (step === 3) return <><HLine top="85%" /><ArrowUp top="85%" left="45%" /></>;
      if (step === 4) return (
        <>
          <div className="absolute inset-x-0 top-[10%] text-center text-green-400 text-2xl font-bold bg-black/50 p-2 rounded-xl backdrop-blur-sm">🔄 අනිත් පැත්ත හරවන්න (Flip over)</div>
          <HLine top="85%" /><ArrowUp top="85%" left="45%" />
        </>
      );
      if (step === 5) return <><div className="absolute inset-x-0 top-1/2 text-center text-green-400 text-4xl bg-black/50 p-4 rounded-xl backdrop-blur-sm">↔️ විවෘත කරන්න (Open)</div></>;
      if (step === 6) return <><HLine top="50%" /><ArrowUp top="60%" left="45%" /></>;
      if (step === 7) return (
        <>
          <div className="absolute inset-x-0 top-[10%] text-center text-green-400 text-2xl font-bold bg-black/50 p-2 rounded-xl backdrop-blur-sm">🔄 අනිත් පැත්ත හරවන්න (Flip over)</div>
          <HLine top="50%" /><ArrowUp top="60%" left="45%" />
        </>
      );
      if (step === 8) return <><div className="absolute inset-x-0 top-1/2 text-center text-green-400 text-4xl font-bold bg-black/50 p-4 rounded-xl backdrop-blur-sm">⬅️ අදින්න ➡️ (Pull sides)</div></>;
    }

    if (cid === 'cat') {
      if (step === 0) return (
        <>
          <div className="absolute w-[141%] border-t-4 border-dashed border-green-400 top-0 left-0 origin-top-left rotate-45" />
          <ArrowDown top="25%" left="65%" />
        </>
      );
      if (step === 1) return <><VLine left="50%" /><div className="absolute top-1/2 left-1/4 text-green-400 text-4xl animate-bounce" style={{ transform: 'rotate(-90deg)' }}>↓</div></>;
      if (step === 2) return (
        <>
          <div className="absolute bottom-0 left-1/4 w-1/2 border-t-4 border-dashed border-green-400" />
          <ArrowUp top="60%" left="20%" />
          <ArrowUp top="60%" left="70%" />
        </>
      );
      if (step === 3) return <><HLine top="15%" /><ArrowDown top="0%" left="45%" /></>;
      if (step === 4) return <><div className="absolute inset-0 flex items-center justify-center text-green-400 text-5xl opacity-80">🐱</div></>;
    }

    if (cid === 'butterfly') {
      if (step === 0) return <><HLine top="50%" /><VLine left="50%" /><div className="absolute w-[141%] border-t-4 border-dashed border-green-400 top-0 left-0 origin-top-left rotate-45" /><div className="absolute w-[141%] border-t-4 border-dashed border-green-400 top-0 right-0 origin-top-right -rotate-45" /></>;
      if (step === 1) return <div className="absolute inset-x-0 top-1/2 text-center text-green-400 text-3xl font-bold">➡️ තද කරන්න ⬅️</div>;
      if (step === 2) return <><HLine top="70%" /><ArrowUp top="70%" left="25%" /><ArrowUp top="70%" left="65%" /></>;
      if (step === 3) return <><HLine top="80%" /><ArrowUp top="80%" left="45%" /></>;
      if (step === 4) return <><VLine left="50%" /><div className="absolute top-1/2 left-[45%] text-green-400 text-4xl">⬅️</div></>;
    }
    
    return null;
  };

  // --- RENDER HELPERS ---
  const renderSelection = () => {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-fade-in-up text-center">
      <h2 className="text-3xl font-bold text-indigo-700 mb-2">කඩදාසි නිර්මාණ (Paper Crafts)</h2>
      <p className="text-slate-600 mb-8">AI තාක්ෂණය සමඟින් කඩදාසි වලින් ලස්සන දේවල් හදමු!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CRAFTS.map(craft => (
          <button 
            key={craft.id}
            onClick={() => handleSelectCraft(craft)}
            className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-indigo-400 hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="text-6xl mb-4">{craft.icon}</div>
            <h3 className="text-xl font-bold text-slate-800">{craft.title}</h3>
          </button>
        ))}
      </div>
    </div>
    );
  };

  const renderCameraSetup = () => (
    <div className="max-w-2xl mx-auto p-6 text-center animate-fade-in-up">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="text-6xl mb-4">{selectedCraft.icon}</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{selectedCraft.title} සෑදීමට සූදානම් ද?</h2>
        <p className="text-slate-600 mb-8">
          ඔබේ කඩදාසිය ගෙන මේසය මත තබන්න. AI හට ඔබව දැකීමට කැමරාව ක්‍රියාත්මක කරන්න.
          <br/><span className="text-sm">(Get a piece of paper ready and turn on your camera.)</span>
        </p>

        {cameraError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {cameraError}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setStage('selection')}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            පසුපසට (Back)
          </button>
          <button 
            onClick={startCamera}
            className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            📷 කැමරාව ක්‍රියාත්මක කරන්න
          </button>
        </div>
      </div>
    </div>
  );

  const renderFolding = () => (
    <div className="max-w-5xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
      
      {/* Left Column: Instructions */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            {selectedCraft.icon} {selectedCraft.title}
          </h2>
          <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm">
            පියවර (Step) {currentStep + 1} / {selectedCraft.steps.length}
          </span>
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl mb-8">
            <p className="text-2xl text-slate-800 font-medium leading-relaxed mb-4 font-sinhala">
              {selectedCraft.steps[currentStep].text}
            </p>
            <p className="text-sm text-slate-500 italic">
              {selectedCraft.steps[currentStep].instruction}
            </p>
          </div>
        </div>

        {stepError && (
          <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl mb-4 border border-red-200 animate-fade-in-up">
            ❌ {stepError}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button
            onClick={handleCheckStep}
            disabled={isAiChecking}
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all ${
              isAiChecking 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {isAiChecking ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI පරීක්ෂා කරමින් පවතී... (AI is checking...)
              </span>
            ) : (
              currentStep === selectedCraft.steps.length - 1 
                ? '✨ අවසන් ප්‍රතිඵලය පරීක්ෂා කරන්න' 
                : '✅ පියවර හරිදැයි බලන්න (Check Step)'
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Camera View */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-inner h-full min-h-[400px]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform scale-x-[-1]" 
        />
        
        {/* Overlay guides */}
        <div className="absolute inset-0 pointer-events-none">
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Dynamic SVG Paper Structure that folds exactly as the paper does */}
          {paperCorners.length > 0 && (
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-20 pointer-events-none overflow-visible">
              <polygon 
                points={paperCorners.map(c => `${c.x},${c.y}`).join(' ')}
                fill="rgba(255,255,255,0.15)"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="0.5"
                strokeDasharray="1 1"
                className="transition-all duration-75"
              />
            </svg>
          )}

          {paperRect ? (
            <div 
              className="absolute transition-all duration-75 z-30"
              style={{
                left: `${paperRect.x}%`,
                top: `${paperRect.y}%`,
                width: `${paperRect.w}%`,
                height: `${paperRect.h}%`,
                transform: `rotate(${paperRect.angle}deg)`,
                transformOrigin: 'center center'
              }}
            >
              {/* Real-time Fold Guide Overlays */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {renderStepOverlay()}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <span className="bg-black/50 text-white px-6 py-3 text-lg rounded-full backdrop-blur-sm shadow-md animate-pulse font-bold">
                කඩදාසිය සොයමින් පවතී... (Looking for paper...)
              </span>
            </div>
          )}

          {/* Real-time Corner Rendering */}
          {paperCorners.map((corner, idx) => (
             <div 
               key={idx}
               className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.8)] z-40 transition-all duration-100 ease-out"
               style={{ 
                  left: `${corner.x}%`, 
                  top: `${corner.y}%`,
                  transform: 'translate(-50%, -50%)'
               }}
             />
          ))}



          {/* Debug View */}
          {showDebug && (
            <div className="absolute bottom-4 right-4 bg-black/80 p-2 rounded-xl shadow-lg border border-slate-700 pointer-events-none z-50">
              <p className="text-xs text-white mb-1 font-bold">Debug: Pure JS Hull</p>
              <canvas ref={debugCanvasRef} width="320" height="240" className="w-32 h-24 bg-black rounded" />
              <p className="text-xs text-green-400 mt-1 font-mono">Corners: {detectedCornersCountRef.current}</p>
            </div>
          )}
        </div>

        {isAiChecking && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm transition-all">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🤖</div>
              <p className="text-white font-bold text-xl mb-2">AI බලමින් සිටී...</p>
              <div className="w-48 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-blue-500 rounded-full animate-[scan_2s_ease-in-out_infinite]" style={{
                  transformOrigin: 'left',
                  animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="max-w-2xl mx-auto p-6 text-center animate-fade-in-up">
      <div className="bg-white p-10 rounded-3xl shadow-lg border-t-8 border-green-500">
        <div className="text-8xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-green-600 mb-4">ඉතා විශිෂ්ටයි! (Excellent!)</h2>
        <p className="text-xl text-slate-700 mb-8">
          ඔබ ඉතා ලස්සන <span className="font-bold text-indigo-600">{selectedCraft.title}</span> නිර්මාණය කර ඇත! AI මඟින් එය 100% ක් නිවැරදි බව තහවුරු කර ඇත.
        </p>
        
        <div className="bg-green-50 rounded-2xl p-6 mb-8 inline-block">
          <div className="flex gap-4 justify-center text-4xl">
            <span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <p className="text-green-800 font-bold mt-3">Accuracy: 98%</p>
        </div>

        <div>
          <button 
            onClick={resetModule}
            className="px-8 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
          >
            තවත් නිර්මාණයක් කරමු (Try another craft)
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 w-full pt-4 pb-12 font-sinhala">
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button 
          onClick={onExit}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg font-bold text-sm shadow-sm border border-slate-200 transition-colors"
        >
          &larr; ආපසු (Back to Dashboard)
        </button>
      </div>

      {stage === 'selection' && renderSelection()}
      {stage === 'camera-setup' && renderCameraSetup()}
      {stage === 'folding' && renderFolding()}
      {stage === 'result' && renderResult()}

    </div>
  );
}
