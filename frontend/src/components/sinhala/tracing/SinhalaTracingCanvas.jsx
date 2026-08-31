import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, Sparkles, AlertCircle, Pencil, Info, Award, Edit3, Eraser, CheckCircle2, Lock, MousePointerClick } from 'lucide-react';

/**
 * SinhalaTracingCanvas Component
 * Exact 3-Line Primary Ruled Writing Guide (තුන් රූල්):
 * 
 * Rules & Workflow:
 * 1. Prerequisite Selection: The child MUST select an answer option above first before writing is unlocked.
 * 2. Before Confirm: Student can freely write, erase, or clear as many times as needed.
 * 3. After Confirm: Submission is permanently LOCKED and evaluated. No further editing allowed.
 */

export const TRACING_PASS_THRESHOLD = 85;
export const MIN_COMPONENT_THRESHOLD = 70;

export default function SinhalaTracingCanvas({
  targetText = 'ක',
  targetCharacter = 'ක',
  targetPillama = '',
  tracingType = 'letter',
  guideText = '',
  onTraceComplete,
  initialScore = 0,
  isReadOnly = false,
  isOptionSelected = true,
  passThreshold = TRACING_PASS_THRESHOLD
}) {
  const canvasRef = useRef(null);
  const guideCanvasRef = useRef(null);
  
  // Tool Mode: 'pen' | 'eraser'
  const [toolMode, setToolMode] = useState('pen');
  
  // Confirmation state (permanently locked once confirmed)
  const [isConfirmed, setIsConfirmed] = useState(initialScore > 0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [currentStrokeId, setCurrentStrokeId] = useState(1);
  const [showMetrics, setShowMetrics] = useState(false);

  // Final Evaluation State
  const [evaluation, setEvaluation] = useState({
    overall_score: initialScore,
    passed: initialScore >= passThreshold,
    hasDrawn: initialScore > 0,
    isWholeWordAttempted: initialScore > 0,
    path_adherence: 0,
    shape_similarity: 0,
    completeness: 0,
    line_alignment: 0,
    boundary_accuracy: 0,
    weak_component: null,
    components: []
  });

  const displayText = guideText || targetText || targetCharacter || 'ක';
  const isInputLocked = isReadOnly || isConfirmed || !isOptionSelected;

  // Helper to split Sinhala grapheme clusters correctly (e.g. 'ම' = 1, 'කා' = 1, 'මි' = 1, 'ගු' = 1, 'කෙ' = 1)
  const getSinhalaGraphemes = (str) => {
    if (!str) return [];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter('si', { granularity: 'grapheme' }).segment(str), s => s.segment);
    }
    return str.match(/[\u0D80-\u0DFF][\u0DCA-\u0DDF]*/g) || str.split('');
  };

  // ── Render 3 Ruled Lines and Dashed Hollow Sinhala Tracing Glyph ──
  const drawGuide = useCallback(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Determine font size based on Sinhala grapheme cluster length
    const graphemes = getSinhalaGraphemes(displayText);
    const isSingleGrapheme = graphemes.length <= 1;
    const fontSize = isSingleGrapheme 
      ? Math.round(height * 0.58) 
      : (graphemes.length <= 2 ? Math.round(height * 0.48) : Math.round(height * 0.38));

    ctx.font = `600 ${fontSize}px "Noto Sans Sinhala", "Iskoola Pota", "Nirmala UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const centerX = width / 2;

    // 2. Extract Base Consonant (strip all vowel modifiers and virama)
    const baseChar = displayText.replace(/[\u0DCA-\u0DDF]/g, '').charAt(0) || 'ක';

    // Place baseline at 76% of canvas height so ascenders and descenders fit perfectly
    const yBase = Math.round(height * 0.76);

    // Measure height of base consonant body
    const refMetrics = ctx.measureText(baseChar);
    const consonantAscent = refMetrics.actualBoundingBoxAscent || Math.round(fontSize * 0.56);

    // 3 Primary Ruled Lines Calculation (තුන් රූල් - Exact 3-Line Ruled Standard)
    const lineSpacing = Math.round(consonantAscent * 0.5);
    const yBaseline = yBase;                             // Line 3: Baseline
    const yMidline = Math.round(yBase - lineSpacing);    // Line 2: Lower Midline
    const yTopline = Math.round(yBase - lineSpacing * 2);// Line 1: Upper Headline

    // 3. Draw 3 Horizontal Primary Ruled Lines (තුන් රූල්)
    // Top Guide Line (Sky Blue)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, yTopline);
    ctx.lineTo(width, yTopline);
    ctx.stroke();

    // Mid Guide Line (Sky Blue)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, yMidline);
    ctx.lineTo(width, yMidline);
    ctx.stroke();

    // Bottom Baseline (Deep Solid Blue)
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, yBaseline);
    ctx.lineTo(width, yBaseline);
    ctx.stroke();

    // 4. Render Letter Glyph with Translucent Fill + Crisp Dashed Hollow Outline (Consistent Format)
    ctx.fillStyle = 'rgba(238, 242, 255, 0.85)';
    ctx.fillText(displayText, centerX, yBase);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([6, 5]);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeText(displayText, centerX, yBase);
    ctx.setLineDash([]);
  }, [displayText]);

  useEffect(() => {
    drawGuide();
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        drawGuide();
      });
    }
    const timer = setTimeout(() => {
      drawGuide();
    }, 100);
    return () => clearTimeout(timer);
  }, [drawGuide]);

  // Reset internal state whenever target text or initialScore resets
  useEffect(() => {
    setIsConfirmed(initialScore > 0);
    if (!initialScore) {
      setStrokes([]);
      setCurrentStroke([]);
      setEvaluation({
        overall_score: 0,
        passed: false,
        hasDrawn: false,
        isWholeWordAttempted: false,
        path_adherence: 0,
        shape_similarity: 0,
        completeness: 0,
        line_alignment: 0,
        boundary_accuracy: 0,
        weak_component: null,
        components: []
      });
    }
  }, [initialScore, displayText]);

  // ── Redraw Student Freehand Strokes ──
  const redrawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#2563EB'; // Rich Royal Blue Ink
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const allStrokes = [...strokes, ...(currentStroke.length > 0 ? [currentStroke] : [])];

    allStrokes.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  }, [strokes, currentStroke]);

  useEffect(() => {
    redrawStrokes();
  }, [redrawStrokes]);

  // ── Pointer Coordinates ──
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, t: Date.now() };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      t: Date.now(),
      stroke_id: currentStrokeId
    };
  };

  // ── Eraser Point Action ──
  const eraseNearPoint = (point) => {
    const eraserRadius = 16;
    setStrokes(prevStrokes => {
      const updated = [];
      prevStrokes.forEach(stroke => {
        let currentSubStroke = [];
        stroke.forEach(pt => {
          const dist = Math.hypot(pt.x - point.x, pt.y - point.y);
          if (dist > eraserRadius) {
            currentSubStroke.push(pt);
          } else {
            if (currentSubStroke.length > 1) {
              updated.push(currentSubStroke);
            }
            currentSubStroke = [];
          }
        });
        if (currentSubStroke.length > 1) {
          updated.push(currentSubStroke);
        }
      });
      return updated;
    });
  };

  const handlePointerDown = (e) => {
    if (isInputLocked) return;
    e.preventDefault();
    setIsDrawing(true);
    const point = getCoordinates(e);

    if (toolMode === 'eraser') {
      eraseNearPoint(point);
    } else {
      setCurrentStroke([point]);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || isInputLocked) return;
    e.preventDefault();
    const point = getCoordinates(e);

    if (toolMode === 'eraser') {
      eraseNearPoint(point);
    } else {
      setCurrentStroke(prev => [...prev, point]);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDrawing || isInputLocked) return;
    e.preventDefault();
    setIsDrawing(false);

    if (toolMode === 'pen') {
      if (currentStroke.length > 1) {
        setStrokes(prev => [...prev, currentStroke]);
        setCurrentStroke([]);
        setCurrentStrokeId(prev => prev + 1);
      } else {
        setCurrentStroke([]);
      }
    }
  };

  // ── Multi-Criteria Tracing Evaluation ──
  const calculateEvaluation = () => {
    const canvas = canvasRef.current;
    const guideCanvas = guideCanvasRef.current;
    if (!canvas || !guideCanvas) return null;

    const width = canvas.width;
    const height = canvas.height;

    const userCtx = canvas.getContext('2d');
    const guideCtx = guideCanvas.getContext('2d');

    const userData = userCtx.getImageData(0, 0, width, height).data;
    const guideData = guideCtx.getImageData(0, 0, width, height).data;

    let guidePixelCount = 0;
    let userPixelCount = 0;
    let intersectionCount = 0;
    let outsidePenaltyCount = 0;

    let minX = width, maxX = 0;
    let minY = height, maxY = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4 + 3;
        if (guideData[idx] > 20) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const numChars = Math.max(1, displayText.length);
    const charWidth = (maxX - minX) / numChars;
    const segmentUserCounts = new Array(numChars).fill(0);
    const segmentGuideCounts = new Array(numChars).fill(0);

    let topViolation = 0;
    let bottomViolation = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4 + 3;
        const hasUser = userData[idx] > 35;
        const hasGuide = guideData[idx] > 20;

        if (hasGuide) {
          guidePixelCount++;
          if (numChars > 1 && x >= minX && x <= maxX) {
            const segIdx = Math.min(numChars - 1, Math.floor((x - minX) / charWidth));
            segmentGuideCounts[segIdx]++;
          }
        }

        if (hasUser) {
          userPixelCount++;
          if (y < minY - 5) topViolation++;
          if (y > maxY + 6) bottomViolation++;

          if (numChars > 1 && x >= minX && x <= maxX) {
            const segIdx = Math.min(numChars - 1, Math.floor((x - minX) / charWidth));
            segmentUserCounts[segIdx]++;
          }
        }

        if (hasUser && hasGuide) {
          intersectionCount++;
        } else if (hasUser && !hasGuide) {
          outsidePenaltyCount++;
        }
      }
    }

    if (userPixelCount === 0 || guidePixelCount === 0) {
      return {
        overall_score: 0,
        passed: false,
        hasDrawn: false,
        isWholeWordAttempted: false,
        path_adherence: 0,
        shape_similarity: 0,
        completeness: 0,
        line_alignment: 0,
        boundary_accuracy: 0,
        weak_component: 'ලිවීමක් සිදුකර නොමැත (No writing detected)',
        components: []
      };
    }

    let allCharsAttempted = true;
    if (numChars > 1) {
      for (let i = 0; i < numChars; i++) {
        const expectedSegmentPixels = Math.max(18, segmentGuideCounts[i] * 0.18);
        if (segmentUserCounts[i] < expectedSegmentPixels) {
          allCharsAttempted = false;
          break;
        }
      }
    }

    // 1. Path Adherence (P)
    const divergenceRatio = userPixelCount > 0 ? outsidePenaltyCount / userPixelCount : 1.0;
    const P = Math.min(100.0, Math.max(0.0, (1.0 - divergenceRatio * 0.80) * 100.0));

    // 2. Shape Similarity (S)
    const rawCoverage = guidePixelCount > 0 ? intersectionCount / guidePixelCount : 0.0;
    const densityRatio = guidePixelCount > 0 ? Math.min(userPixelCount / (guidePixelCount * 1.3), 1.0) : 0.0;
    const S = Math.min(100.0, Math.max(0.0, (rawCoverage * 1.7 * 0.6 + densityRatio * 0.4) * 100.0));

    // 3. Completeness (C)
    const targetCoveragePct = Math.min(100.0, (intersectionCount / (guidePixelCount * 0.48)) * 100.0);
    const C = targetCoveragePct;

    // 4. Writing-Line Alignment (L)
    const totalLineViolation = topViolation + bottomViolation;
    const linePenaltyRatio = userPixelCount > 0 ? totalLineViolation / userPixelCount : 0.0;
    const L = Math.min(100.0, Math.max(0.0, (1.0 - linePenaltyRatio * 1.5) * 100.0));

    // 5. Boundary / Position Accuracy (B)
    const B = Math.min(100.0, Math.max(0.0, (P * 0.5 + S * 0.5)));

    // Weighted Composite Score: T = 0.35P + 0.25S + 0.20C + 0.10L + 0.10B
    const T = Number((0.35 * P + 0.25 * S + 0.20 * C + 0.10 * L + 0.10 * B).toFixed(1));

    const weakestComponentPass = C >= MIN_COMPONENT_THRESHOLD && allCharsAttempted;
    const isPassed = (T >= passThreshold) && weakestComponentPass;

    let weakComp = null;
    if (!isPassed) {
      if (!allCharsAttempted) weakComp = 'සම්පූර්ණ වචනය ලියා නොමැත (Incomplete word)';
      else if (!weakestComponentPass) weakComp = 'අසම්පූර්ණයි (Completeness < 70%)';
      else if (P < 85) weakComp = 'ඉරෙන් පිටත යාම (Path deviation)';
      else if (L < 80) weakComp = 'රූල් මගහැරීම (Line alignment)';
      else weakComp = 'හැඩය (Shape similarity)';
    }

    return {
      overall_score: T,
      passed: isPassed,
      hasDrawn: true,
      isWholeWordAttempted: allCharsAttempted,
      path_adherence: Math.round(P),
      shape_similarity: Math.round(S),
      completeness: Math.round(C),
      line_alignment: Math.round(L),
      boundary_accuracy: Math.round(B),
      weak_component: weakComp,
      components: [
        { text: displayText, completeness: Math.round(C), passed: weakestComponentPass }
      ],
      strokes: strokes
    };
  };

  // ── Handle Confirm Button Click (Final & Locked) ──
  const handleConfirm = () => {
    if (!isOptionSelected) return;
    const evalResult = calculateEvaluation();
    if (!evalResult) return;

    setEvaluation(evalResult);
    setIsConfirmed(true);

    if (onTraceComplete) {
      onTraceComplete({
        score: evalResult.overall_score / 100.0,
        percentage: evalResult.overall_score,
        isPassed: evalResult.passed,
        ...evalResult
      });
    }
  };

  // ── Handle Clear All (Allowed before confirm only) ──
  const handleClear = () => {
    if (isInputLocked) return;
    setStrokes([]);
    setCurrentStroke([]);
    setCurrentStrokeId(1);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    const resetEval = {
      overall_score: 0,
      passed: false,
      hasDrawn: false,
      isWholeWordAttempted: false,
      path_adherence: 0,
      shape_similarity: 0,
      completeness: 0,
      line_alignment: 0,
      boundary_accuracy: 0,
      weak_component: null,
      components: []
    };
    setEvaluation(resetEval);
    if (onTraceComplete) {
      onTraceComplete({
        score: 0,
        percentage: 0,
        isPassed: false,
        ...resetEval
      });
    }
  };

  const hasStrokes = strokes.length > 0 || currentStroke.length > 0;

  return (
    <div className="bg-slate-50/70 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-indigo-100 flex flex-col items-center w-full max-w-[440px] mx-auto shadow-xs">
      {/* Header: Title, Target & Live/Final Status */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-xl">
            <Pencil className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-800 whitespace-nowrap">
              තුන් රූල් අකුර ලියන්න
            </h4>
            <p className="text-[11px] text-slate-500">
              ඉලක්කය: <span className="font-black text-indigo-700 text-sm">“{displayText}”</span>
            </p>
          </div>
        </div>

        {/* Right Status Badge: Evaluated after confirm */}
        {isConfirmed ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowMetrics(prev => !prev)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 bg-indigo-50 px-2 py-0.5 rounded-lg cursor-pointer"
            >
              <Info className="w-3 h-3" />
              විස්තර
            </button>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-2xs ${
              evaluation.passed
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {evaluation.passed ? <Check className="w-3.5 h-3.5 text-green-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
              {evaluation.overall_score}% ({evaluation.passed ? 'සමත්' : 'අසමත්'})
            </span>
          </div>
        ) : !isOptionSelected ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            පිළිතුර තෝරන්න
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
            ලියන්න...
          </span>
        )}
      </div>

      {/* 4-Line Ruled Canvas Container (හතර රූල්) */}
      <div className={`relative w-full h-[170px] bg-white rounded-2xl border-2 overflow-hidden shadow-inner touch-none ${
        isConfirmed 
          ? 'border-indigo-300 bg-slate-50/50 cursor-not-allowed' 
          : !isOptionSelected 
          ? 'border-amber-300 bg-slate-100/70 cursor-not-allowed' 
          : 'border-slate-300 cursor-crosshair'
      }`}>
        {/* Background 4-Line Ruled Guide Canvas */}
        <canvas
          ref={guideCanvasRef}
          width={420}
          height={170}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Foreground Student Freehand Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={420}
          height={170}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className={`absolute inset-0 w-full h-full ${!isOptionSelected ? 'pointer-events-none' : ''}`}
        />

        {/* Lock Overlay when Confirmed */}
        {isConfirmed && (
          <div className="absolute top-2 right-2 bg-indigo-900/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-xs pointer-events-none shadow-xs">
            <Lock className="w-3 h-3 text-amber-300" />
            ස්ථිරයි
          </div>
        )}
      </div>

      {/* Detailed Diagnostics Panel (when confirmed & requested) */}
      {showMetrics && isConfirmed && (
        <div className="w-full mt-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1 animate-fade-in shadow-2xs">
          <div className="flex justify-between font-bold text-slate-700">
            <span>• Path Adherence (35%):</span>
            <span className="font-mono text-indigo-700">{evaluation.path_adherence}%</span>
          </div>
          <div className="flex justify-between font-bold text-slate-700">
            <span>• Shape Similarity (25%):</span>
            <span className="font-mono text-indigo-700">{evaluation.shape_similarity}%</span>
          </div>
          <div className="flex justify-between font-bold text-slate-700">
            <span>• Completeness (20%):</span>
            <span className="font-mono text-indigo-700">{evaluation.completeness}%</span>
          </div>
          {evaluation.weak_component && (
            <div className="text-[11px] text-amber-700 font-black pt-1 border-t border-slate-200">
              ⚠️ දුර්වලතාව: {evaluation.weak_component}
            </div>
          )}
        </div>
      )}

      {/* Score Progress Bar (Only after confirmation) */}
      {isConfirmed && (
        <div className="w-full mt-2">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-slate-600">Tracing Accuracy (T):</span>
            <span className={evaluation.passed ? 'text-green-600 font-black' : 'text-rose-600 font-black'}>
              {evaluation.overall_score}% ({evaluation.passed ? 'සමත් (≥85%) ⭐' : 'අසමත් (<85%) ⚠️'})
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                evaluation.passed ? 'bg-green-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, evaluation.overall_score)}%` }}
            />
          </div>
        </div>
      )}

      {/* Toolbar & Actions Bar */}
      <div className="w-full mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2">
        {/* Drawing Tools (Pen / Eraser / Clear) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isInputLocked}
            onClick={() => setToolMode('pen')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              toolMode === 'pen' && !isInputLocked
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            පෑන
          </button>

          <button
            type="button"
            disabled={isInputLocked}
            onClick={() => setToolMode('eraser')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              toolMode === 'eraser' && !isInputLocked
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            මකනය
          </button>

          <button
            type="button"
            disabled={isInputLocked}
            onClick={handleClear}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer"
            title="මුල සිට මකන්න (Clear All)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Confirmation State Controls */}
        <div>
          {!isConfirmed ? (
            <button
              type="button"
              disabled={!hasStrokes || !isOptionSelected}
              onClick={handleConfirm}
              className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-black text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              ස්ථිර කරන්න
            </button>
          ) : (
            <div className="px-3 py-1 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>ස්ථිරයි</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
