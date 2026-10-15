import React from 'react';

/**
 * MathQuestionVisual
 * Renders authentic, crisp pedagogical SVG diagrams for mathematics questions
 * across Grade 2, Grade 3, and Grade 4.
 *
 * Guarantees zero AI distortion, pixel-perfect textbook alignment,
 * full bilingual support (Sinhala & English), and responsive scaling.
 */
export default function MathQuestionVisual({ visual, isEnglish = false, compact = false, showCaption = false }) {
  if (!visual || !visual.type) return null;

  return (
    <div className={`my-2 inline-flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white/95 rounded-2xl border-2 border-slate-200/90 shadow-sm transition-all select-none max-w-full ${compact ? 'mx-0' : 'mx-auto'}`}>
      {/* Subtle Educational Badge (Does not leak shape name / answer) */}
      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
        <span>{isEnglish ? 'Textbook Diagram' : 'රූප සටහන'}</span>
        {(showCaption || visual.forceCaption) && (visual.caption || visual.captionEn) && (
          <span className="text-slate-600 font-bold ml-1">
            · {isEnglish && visual.captionEn ? visual.captionEn : (visual.caption || visual.captionEn)}
          </span>
        )}
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full flex items-center justify-center">
        {renderDiagram(visual, isEnglish, compact)}
      </div>

      {/* Optional Sub-label */}
      {(showCaption || visual.forceCaption) && visual.subLabel && (
        <span className="mt-1 text-xs font-black text-slate-600 tracking-wide text-center">
          {visual.subLabel}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DIAGRAM RENDERER ROUTER
// ─────────────────────────────────────────────────────────────
function renderDiagram(v, isEnglish, compact) {
  switch (v.type) {
    case 'matching_sets':
    case 'pairing_comparison':
      return renderMatchingSets(v, isEnglish, compact);
    case 'sorting_groups':
      return renderSortingGroups(v, isEnglish, compact);
    case 'clock':
      return renderClock(v);
    case 'fraction_circle':
      return renderFractionCircle(v);
    case 'fraction_bar':
      return renderFractionBar(v);
    case 'fraction_set':
    case 'counting_group':
      return renderCountingGroup(v);
    case 'shape_2d':
      return renderShape2D(v);
    case 'shape_3d':
      return renderShape3D(v);
    case 'place_value_abacus':
    case 'abacus':
      return renderAbacus(v);
    case 'place_value_blocks':
      return renderPlaceValueBlocks(v);
    case 'balance_scale':
      return renderBalanceScale(v);
    case 'measuring_beaker':
    case 'cylinder':
      return renderMeasuringBeaker(v);
    case 'ruler_measurement':
      return renderRuler(v);
    case 'angle':
      return renderAngle(v);
    case 'parallel':
    case 'parallel_lines':
      return renderParallelLines(v);
    case 'symmetry':
      return renderSymmetry(v);
    case 'bar_chart':
      return renderBarChart(v);
    case 'pictograph':
      return renderPictograph(v);
    case 'tally_marks':
      return renderTallyMarks(v);
    case 'money':
      return renderMoney(v);
    case 'pattern':
      return renderPattern(v, compact);
    case 'compass':
      return renderCompass(v);
    case 'roman_numerals':
      return renderRomanNumerals(v);
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. ANALOG CLOCK
// ─────────────────────────────────────────────────────────────
function renderClock({ hours = 12, minutes = 0, highlightAngle = false }) {
  const cx = 100;
  const cy = 100;
  const r = 85;

  // Angles in degrees (0 deg is 12 o'clock, clockwise)
  const minuteAngle = (minutes * 6) % 360;
  const hourAngle = ((hours % 12) * 30 + minutes * 0.5) % 360;

  const toRad = deg => ((deg - 90) * Math.PI) / 180;

  const minX = cx + 62 * Math.cos(toRad(minuteAngle));
  const minY = cy + 62 * Math.sin(toRad(minuteAngle));

  const hrX = cx + 45 * Math.cos(toRad(hourAngle));
  const hrY = cy + 45 * Math.sin(toRad(hourAngle));

  // Hour numerals (1..12)
  const numbers = [];
  for (let n = 1; n <= 12; n++) {
    const angle = n * 30;
    const nx = cx + 66 * Math.cos(toRad(angle));
    const ny = cy + 66 * Math.sin(toRad(angle)) + 4; // slight vertical centering
    numbers.push(
      <text
        key={n}
        x={nx}
        y={ny}
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fill="#334155"
        fontFamily="sans-serif"
      >
        {n}
      </text>
    );
  }

  // Minute tick marks
  const ticks = [];
  for (let t = 0; t < 60; t++) {
    const isHour = t % 5 === 0;
    const len = isHour ? 6 : 3;
    const a = t * 6;
    const x1 = cx + (r - 2) * Math.cos(toRad(a));
    const y1 = cy + (r - 2) * Math.sin(toRad(a));
    const x2 = cx + (r - 2 - len) * Math.cos(toRad(a));
    const y2 = cy + (r - 2 - len) * Math.sin(toRad(a));
    ticks.push(
      <line
        key={t}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isHour ? '#475569' : '#cbd5e1'}
        strokeWidth={isHour ? 2 : 1}
      />
    );
  }

  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-44 sm:h-44">
      <defs>
        <radialGradient id="clockFaceGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="90%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
      </defs>

      {/* Clock Outer Rim & Bezel */}
      <circle cx={cx} cy={cy} r={r + 6} fill="#0f172a" />
      <circle cx={cx} cy={cy} r={r + 3} fill="#0d9488" />
      <circle cx={cx} cy={cy} r={r} fill="url(#clockFaceGrad)" stroke="#cbd5e1" strokeWidth="2" />

      {/* Ticks & Numbers */}
      {ticks}
      {numbers}

      {/* Angle highlight arc between hands (for 90° right angle questions) */}
      {highlightAngle && (
        <path
          d={`M ${cx} ${cy - 20} A 20 20 0 0 1 ${cx + 20} ${cy}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />
      )}

      {/* Hour Hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hrX}
        y2={hrY}
        stroke="#1e293b"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Minute Hand */}
      <line
        x1={cx}
        y1={cy}
        x2={minX}
        y2={minY}
        stroke="#0d9488"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Center Pivot Dot */}
      <circle cx={cx} cy={cy} r="6" fill="#e11d48" />
      <circle cx={cx} cy={cy} r="2.5" fill="#ffffff" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. FRACTION CIRCLE (PIE)
// ─────────────────────────────────────────────────────────────
function renderFractionCircle({ total = 4, shaded = 3, label = '' }) {
  const cx = 100;
  const cy = 100;
  const r = 75;

  const toRad = deg => ((deg - 90) * Math.PI) / 180;
  const step = 360 / total;

  const slices = [];
  for (let i = 0; i < total; i++) {
    const startAngle = i * step;
    const endAngle = (i + 1) * step;

    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));

    const largeArc = step > 180 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const isShaded = i < shaded;
    slices.push(
      <path
        key={i}
        d={d}
        fill={isShaded ? '#38bdf8' : '#ffffff'}
        stroke="#0284c7"
        strokeWidth="2.5"
      />
    );
  }

  return (
    <svg viewBox="0 0 200 200" className="w-36 h-36 sm:w-40 sm:h-40">
      <circle cx={cx} cy={cy} r={r + 3} fill="#e0f2fe" />
      {slices}
      <circle cx={cx} cy={cy} r="4" fill="#0369a1" />
      {label && (
        <text x="100" y="195" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0369a1">
          {label}
        </text>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. FRACTION BAR
// ─────────────────────────────────────────────────────────────
function renderFractionBar({ total = 5, shaded = 3, label = '' }) {
  const width = 240;
  const height = 48;
  const cellWidth = width / total;

  return (
    <svg viewBox="0 0 260 90" className="w-56 h-20 sm:w-64 sm:h-24">
      <g transform="translate(10, 15)">
        {Array.from({ length: total }).map((_, i) => (
          <rect
            key={i}
            x={i * cellWidth}
            y={0}
            width={cellWidth}
            height={height}
            fill={i < shaded ? '#818cf8' : '#ffffff'}
            stroke="#4338ca"
            strokeWidth="2.5"
          />
        ))}
        {Array.from({ length: total }).map((_, i) => (
          <text
            key={`txt-${i}`}
            x={i * cellWidth + cellWidth / 2}
            y={height / 2 + 5}
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill={i < shaded ? '#ffffff' : '#6366f1'}
          >
            1/{total}
          </text>
        ))}
      </g>
      {label && (
        <text x="130" y="80" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3730a3">
          {label}
        </text>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. COUNTING GROUPS / FRACTION SETS (Apples, Balls, Stars)
// ─────────────────────────────────────────────────────────────
function renderCountingGroup({ total = 8, grouped = 4, itemType = 'apple', label = '' }) {
  const cols = Math.min(total, 6);
  const rows = Math.ceil(total / cols);

  const icons = {
    apple: '🍎',
    ball: '⚽',
    star: '⭐',
    circle: '🔵',
    car: '🚗'
  };
  const icon = icons[itemType] || '🍎';

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="flex flex-wrap gap-2.5 justify-center max-w-[240px]">
        {Array.from({ length: total }).map((_, idx) => {
          const isGrouped = idx < grouped;
          return (
            <div
              key={idx}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                isGrouped
                  ? 'bg-amber-100 border-2 border-amber-400 shadow-sm scale-105'
                  : 'bg-slate-100 border border-slate-300 opacity-60'
              }`}
            >
              <span>{icon}</span>
            </div>
          );
        })}
      </div>
      {label && (
        <span className="mt-2 text-xs font-black text-slate-700 bg-slate-100 px-3 py-0.5 rounded-full">
          {label}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. 2D SHAPES (Triangle, Square, Rectangle, Circle, etc.)
// ─────────────────────────────────────────────────────────────
function renderShape2D({ shape = 'triangle', label = '', sideLabel = '', lengthLabel = '', widthLabel = '', showVertices = true }) {
  switch (shape) {
    case 'triangle':
    case 'equilateral_triangle':
      return (
        <svg viewBox="0 0 200 160" className="w-40 h-32">
          {/* Equilateral Triangle */}
          <polygon
            points="100,20 25,140 175,140"
            fill="#fef3c7"
            stroke="#d97706"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {showVertices && (
            <>
              <circle cx="100" cy="20" r="4.5" fill="#b45309" />
              <circle cx="25" cy="140" r="4.5" fill="#b45309" />
              <circle cx="175" cy="140" r="4.5" fill="#b45309" />
            </>
          )}
          {sideLabel && (
            <text x="100" y="155" textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400e">
              {sideLabel}
            </text>
          )}
        </svg>
      );

    case 'right_triangle':
      return (
        <svg viewBox="0 0 200 160" className="w-40 h-32">
          <polygon
            points="40,25 40,135 160,135"
            fill="#dbeafe"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Right Angle Marker */}
          <rect x="40" y="115" width="20" height="20" fill="none" stroke="#dc2626" strokeWidth="2" />
        </svg>
      );

    case 'square':
      return (
        <svg viewBox="0 0 180 160" className="w-36 h-32">
          <rect
            x="30"
            y="20"
            width="120"
            height="120"
            rx="4"
            fill="#ccfbf1"
            stroke="#0d9488"
            strokeWidth="3.5"
          />
          {/* Hash marks on all 4 equal sides */}
          <line x1="87" y1="16" x2="93" y2="24" stroke="#0f766e" strokeWidth="2" />
          <line x1="87" y1="136" x2="93" y2="144" stroke="#0f766e" strokeWidth="2" />
          <line x1="26" y1="77" x2="34" y2="83" stroke="#0f766e" strokeWidth="2" />
          <line x1="146" y1="77" x2="154" y2="83" stroke="#0f766e" strokeWidth="2" />
          {sideLabel && (
            <text x="90" y="85" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f766e">
              {sideLabel}
            </text>
          )}
        </svg>
      );

    case 'rectangle':
      return (
        <svg viewBox="0 0 220 150" className="w-48 h-32">
          <rect
            x="20"
            y="30"
            width="180"
            height="90"
            rx="4"
            fill="#fae8ff"
            stroke="#a855f7"
            strokeWidth="3.5"
          />
          {/* Dimension labels */}
          {lengthLabel && (
            <text x="110" y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill="#7e22ce">
              {lengthLabel}
            </text>
          )}
          {widthLabel && (
            <text x="210" y="80" textAnchor="middle" fontSize="12" fontWeight="800" fill="#7e22ce">
              {widthLabel}
            </text>
          )}
        </svg>
      );

    case 'two_squares_joined':
      return (
        <svg viewBox="0 0 220 140" className="w-48 h-30">
          <rect x="30" y="30" width="80" height="80" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />
          <rect x="110" y="30" width="80" height="80" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />
          <line x1="110" y1="30" x2="110" y2="110" stroke="#c2410c" strokeWidth="2" strokeDasharray="4 3" />
          <text x="70" y="75" textAnchor="middle" fontSize="11" fontWeight="800" fill="#9a3412">Square 1</text>
          <text x="150" y="75" textAnchor="middle" fontSize="11" fontWeight="800" fill="#9a3412">Square 2</text>
        </svg>
      );

    case 'circle':
      return (
        <svg viewBox="0 0 160 160" className="w-32 h-32">
          <circle cx="80" cy="80" r="65" fill="#ecfdf5" stroke="#059669" strokeWidth="3.5" />
          <circle cx="80" cy="80" r="3.5" fill="#047857" />
          {sideLabel && (
            <text x="80" y="85" textAnchor="middle" fontSize="12" fontWeight="800" fill="#065f46">
              {sideLabel}
            </text>
          )}
        </svg>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 6. 3D SOLIDS (Cube, Cuboid, Cylinder, Cone, Sphere, Pyramid)
// ─────────────────────────────────────────────────────────────
function renderShape3D({ shape = 'cube', label = '' }) {
  switch (shape) {
    case 'cube':
      return (
        <svg viewBox="0 0 180 180" className="w-36 h-36">
          {/* Isometric Cube */}
          {/* Top Face */}
          <polygon points="90,25 150,55 90,85 30,55" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
          {/* Left Face */}
          <polygon points="30,55 90,85 90,155 30,125" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2.5" />
          {/* Right Face */}
          <polygon points="90,85 150,55 150,125 90,155" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
          {/* Vertices indicator dots */}
          <circle cx="90" cy="25" r="3" fill="#0369a1" />
          <circle cx="150" cy="55" r="3" fill="#0369a1" />
          <circle cx="30" cy="55" r="3" fill="#0369a1" />
          <circle cx="90" cy="85" r="3" fill="#0369a1" />
          <circle cx="90" cy="155" r="3" fill="#0369a1" />
        </svg>
      );

    case 'cuboid':
      return (
        <svg viewBox="0 0 200 160" className="w-44 h-32">
          {/* Top Face */}
          <polygon points="60,20 180,20 140,50 20,50" fill="#fde68a" stroke="#d97706" strokeWidth="2.5" />
          {/* Front Face */}
          <polygon points="20,50 140,50 140,130 20,130" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
          {/* Right Face */}
          <polygon points="140,50 180,20 180,100 140,130" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
        </svg>
      );

    case 'cylinder':
      return (
        <svg viewBox="0 0 160 180" className="w-32 h-36">
          {/* Body */}
          <path d="M 35 45 L 35 135 A 45 15 0 0 0 125 135 L 125 45 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2.5" />
          {/* Bottom Ellipse (dashed rear) */}
          <ellipse cx="80" cy="135" rx="45" ry="15" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 3" />
          {/* Top Ellipse (Flat Face 1) */}
          <ellipse cx="80" cy="45" rx="45" ry="15" fill="#86efac" stroke="#16a34a" strokeWidth="2.5" />
        </svg>
      );

    case 'cone':
      return (
        <svg viewBox="0 0 160 180" className="w-32 h-36">
          {/* Cone Body */}
          <path d="M 80 20 L 30 140 A 50 15 0 0 0 130 140 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
          {/* Base Ellipse */}
          <ellipse cx="80" cy="140" rx="50" ry="15" fill="#fdba74" stroke="#ea580c" strokeWidth="2.5" />
          {/* Apex Vertex */}
          <circle cx="80" cy="20" r="3.5" fill="#c2410c" />
        </svg>
      );

    case 'sphere':
      return (
        <svg viewBox="0 0 160 160" className="w-32 h-32">
          <defs>
            <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="60%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#831843" />
            </radialGradient>
          </defs>
          <circle cx="80" cy="80" r="60" fill="url(#sphereGrad)" />
          {/* Equator contour line */}
          <ellipse cx="80" cy="80" rx="60" ry="16" fill="none" stroke="#fbcfe8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
        </svg>
      );

    case 'square_pyramid':
      return (
        <svg viewBox="0 0 180 180" className="w-36 h-36">
          {/* Base back edge */}
          <line x1="20" y1="125" x2="80" y2="105" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="80" y1="105" x2="160" y2="115" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="80" y1="105" x2="90" y2="25" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          {/* Front faces */}
          <polygon points="90,25 20,125 100,150" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
          <polygon points="90,25 100,150 160,115" fill="#fdba74" stroke="#ea580c" strokeWidth="2.5" />
          <circle cx="90" cy="25" r="3.5" fill="#c2410c" />
        </svg>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 7. PLACE VALUE ABACUS (2, 3, or 4 spikes)
// ─────────────────────────────────────────────────────────────
function renderAbacus({ columns = [] }) {
  // columns: [{ label: 'Th', val: 4, color: '#3b82f6' }, { label: 'H', val: 5, color: '#10b981' }, ...]
  const colCount = columns.length || 3;
  const width = Math.max(180, colCount * 55 + 20);
  const height = 150;
  const baseY = 120;
  const rodTopY = 30;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-32 sm:h-36 max-w-full">
      {/* Wooden Base Frame */}
      <rect x="10" y={baseY} width={width - 20} height="20" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      <rect x="10" y="15" width={width - 20} height="8" rx="2" fill="#92400e" />

      {columns.map((col, idx) => {
        const x = 35 + idx * 55;
        const beadColor = col.color || ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'][idx % 4];

        return (
          <g key={idx}>
            {/* Metal Spikes / Rods */}
            <line x1={x} y1={rodTopY} x2={x} y2={baseY} stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />

            {/* Beads Stacked from bottom */}
            {Array.from({ length: Math.min(9, col.val || 0) }).map((_, bIdx) => {
              const beadY = baseY - 8 - bIdx * 9.5;
              return (
                <ellipse
                  key={bIdx}
                  cx={x}
                  cy={beadY}
                  rx="14"
                  ry="4.5"
                  fill={beadColor}
                  stroke="#1e293b"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Column Label (Th, H, T, O) */}
            <text x={x} y={baseY + 14} textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff">
              {col.label}
            </text>
            {/* Digit value underneath */}
            <text x={x} y={rodTopY - 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e293b">
              {col.val}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. PLACE VALUE BLOCKS (Bundles of 10 and Single Sticks)
// ─────────────────────────────────────────────────────────────
function renderPlaceValueBlocks({ tens = 2, ones = 5 }) {
  return (
    <div className="flex items-center gap-4 p-2 bg-amber-50/60 rounded-xl border border-amber-200">
      {/* Bundles of 10 */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase text-amber-800 mb-1">
          {tens} {tens === 1 ? 'Bundle (10)' : 'Bundles (10s)'}
        </span>
        <div className="flex gap-2">
          {Array.from({ length: tens }).map((_, idx) => (
            <div
              key={idx}
              className="w-5 h-16 bg-amber-300 border-2 border-amber-600 rounded-sm relative flex flex-col justify-between p-0.5 shadow-xs"
            >
              <div className="w-full h-1 bg-amber-700/60 rounded-full my-auto"></div>
              <div className="w-full h-1 bg-amber-700/60 rounded-full my-auto"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-12 w-px bg-amber-300"></div>

      {/* Single sticks (ones) */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase text-amber-800 mb-1">
          {ones} {ones === 1 ? 'Stick (1)' : 'Sticks (1s)'}
        </span>
        <div className="flex gap-1.5 flex-wrap max-w-[100px]">
          {Array.from({ length: ones }).map((_, idx) => (
            <div
              key={idx}
              className="w-1.5 h-14 bg-amber-400 border border-amber-700 rounded-full shadow-xs"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. BALANCE SCALE
// ─────────────────────────────────────────────────────────────
function renderBalanceScale({ left = { label: '1 kg' }, right = { label: '600 g' }, tilt = 'balanced' }) {
  // tilt: 'left' (left down), 'right' (right down), 'balanced' (level)
  let angle = 0;
  if (tilt === 'left') angle = -12;
  if (tilt === 'right') angle = 12;

  return (
    <svg viewBox="0 0 240 140" className="w-56 h-32 sm:w-60 sm:h-36">
      {/* Central Fulcrum / Stand */}
      <polygon points="120,50 105,125 135,125" fill="#475569" stroke="#1e293b" strokeWidth="2" />
      <rect x="90" y="125" width="60" height="10" rx="3" fill="#334155" />
      <circle cx="120" cy="50" r="5" fill="#f59e0b" stroke="#1e293b" strokeWidth="2" />

      {/* Rotating Beam */}
      <g transform={`rotate(${angle} 120 50)`}>
        <line x1="30" y1="50" x2="210" y2="50" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />

        {/* Left Pan Strings & Pan */}
        <line x1="45" y1="50" x2="30" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <line x1="45" y1="50" x2="60" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <ellipse cx="45" cy="90" rx="25" ry="6" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        {/* Left Object/Weight */}
        <rect x="33" y="68" width="24" height="20" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
        <text x="45" y="82" textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff">
          {left.label}
        </text>

        {/* Right Pan Strings & Pan */}
        <line x1="195" y1="50" x2="180" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <line x1="195" y1="50" x2="210" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <ellipse cx="195" cy="90" rx="25" ry="6" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        {/* Right Object/Weight */}
        <rect x="183" y="70" width="24" height="18" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
        <text x="195" y="83" textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff">
          {right.label}
        </text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. MEASURING BEAKER / CYLINDER
// ─────────────────────────────────────────────────────────────
function renderMeasuringBeaker({ capacity_ml = 1000, level_ml = 750 }) {
  const height = 140;
  const liquidHeight = (level_ml / capacity_ml) * 95;
  const liquidTopY = 120 - liquidHeight;

  return (
    <svg viewBox="0 0 160 160" className="w-36 h-36">
      {/* Glass Jar Outline */}
      <rect x="45" y="20" width="70" height="105" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
      {/* Pour Spout */}
      <polygon points="45,22 36,18 45,26" fill="#64748b" />

      {/* Blue Liquid Fill */}
      <rect
        x="47"
        y={liquidTopY}
        width="66"
        height={liquidHeight}
        fill="#38bdf8"
        opacity="0.8"
      />
      {/* Liquid Meniscus */}
      <ellipse cx="80" cy={liquidTopY} rx="33" ry="3" fill="#0284c7" opacity="0.6" />

      {/* Graduation Marks */}
      {[1, 0.75, 0.5, 0.25].map(fraction => {
        const y = 120 - fraction * 95;
        const markVal = Math.round(capacity_ml * fraction);
        return (
          <g key={fraction}>
            <line x1="45" y1={y} x2="60" y2={y} stroke="#334155" strokeWidth="2" />
            <text x="64" y={y + 3.5} fontSize="9" fontWeight="800" fill="#1e293b">
              {markVal} ml
            </text>
          </g>
        );
      })}

      {/* Current Level Pointer */}
      <polygon points="122,120 114,120 118,124" fill="#e11d48" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 11. RULER MEASUREMENT
// ─────────────────────────────────────────────────────────────
function renderRuler({ length_cm = 8, total_cm = 12, object = 'pencil' }) {
  const rulerWidth = 220;
  const pxPerCm = rulerWidth / total_cm;

  return (
    <svg viewBox="0 0 250 110" className="w-56 h-28 sm:w-64 sm:h-32">
      {/* Measured Item (e.g. Pencil) above ruler */}
      <g transform="translate(15, 20)">
        {/* Pencil body */}
        <polygon
          points={`0,12 ${length_cm * pxPerCm - 15},12 ${length_cm * pxPerCm},18 ${length_cm * pxPerCm - 15},24 0,24`}
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="1.5"
        />
        {/* Lead tip */}
        <polygon
          points={`${length_cm * pxPerCm - 6},16 ${length_cm * pxPerCm},18 ${length_cm * pxPerCm - 6},20`}
          fill="#1e293b"
        />
        {/* Eraser on back */}
        <rect x="-6" y="12" width="6" height="12" rx="1" fill="#f43f5e" />
        {/* Dotted guideline from pencil tip to ruler */}
        <line
          x1={length_cm * pxPerCm}
          y1="24"
          x2={length_cm * pxPerCm}
          y2="42"
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeDasharray="2 2"
        />
      </g>

      {/* Wooden / Plastic Ruler */}
      <rect x="15" y="45" width={rulerWidth} height="40" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />

      {/* Centimeter Tick Marks */}
      {Array.from({ length: total_cm + 1 }).map((_, cm) => {
        const x = 15 + cm * pxPerCm;
        return (
          <g key={cm}>
            <line x1={x} y1="45" x2={x} y2="58" stroke="#78350f" strokeWidth="1.8" />
            <text x={x} y="72" textAnchor="middle" fontSize="10" fontWeight="900" fill="#92400e">
              {cm}
            </text>
          </g>
        );
      })}
      <text x="220" y="80" textAnchor="end" fontSize="9" fontWeight="bold" fill="#b45309">
        cm
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 12. ANGLES (Right, Acute, Obtuse)
// ─────────────────────────────────────────────────────────────
function renderAngle({ angle_type = 'right', degrees = 90 }) {
  const originX = 50;
  const originY = 120;
  const rayLen = 95;

  const toRad = deg => (deg * Math.PI) / 180;

  // Horizontal baseline ray
  const x1 = originX + rayLen;
  const y1 = originY;

  // Angled ray
  const angleDeg = angle_type === 'right' ? 90 : angle_type === 'acute' ? 45 : 135;
  const x2 = originX + rayLen * Math.cos(toRad(180 - angleDeg));
  const y2 = originY - rayLen * Math.sin(toRad(180 - angleDeg));

  return (
    <svg viewBox="0 0 180 150" className="w-36 h-30 sm:w-40 sm:h-32">
      {/* Rays */}
      <line x1={originX} y1={originY} x2={x1} y2={y1} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
      <line x1={originX} y1={originY} x2={x2} y2={y2} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

      {/* Right angle square indicator OR curved arc */}
      {angle_type === 'right' ? (
        <rect
          x={originX}
          y={originY - 24}
          width="24"
          height="24"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
        />
      ) : (
        <path
          d={`M ${originX + 28} ${originY} A 28 28 0 0 0 ${originX + 28 * Math.cos(toRad(180 - angleDeg))} ${originY - 28 * Math.sin(toRad(180 - angleDeg))}`}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
        />
      )}

      {/* Degree Label */}
      <text
        x={originX + 42}
        y={originY - 32}
        fontSize="12"
        fontWeight="900"
        fill="#dc2626"
      >
        {angle_type === 'right' ? '90°' : angle_type === 'acute' ? '< 90°' : '> 90°'}
      </text>

      {/* Arrowheads */}
      <circle cx={x1} cy={y1} r="3" fill="#0f172a" />
      <circle cx={x2} cy={y2} r="3" fill="#0f172a" />
      <circle cx={originX} cy={originY} r="4" fill="#2563eb" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 13. PARALLEL & PERPENDICULAR LINES
// ─────────────────────────────────────────────────────────────
function renderParallelLines({ type = 'parallel' }) {
  if (type === 'perpendicular') {
    return (
      <svg viewBox="0 0 160 140" className="w-32 h-28">
        <line x1="20" y1="70" x2="140" y2="70" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="80" y1="15" x2="80" y2="125" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="80" y="46" width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2.5" />
      </svg>
    );
  }

  // Parallel lines
  return (
    <svg viewBox="0 0 180 110" className="w-40 h-24">
      {/* Line 1 */}
      <line x1="20" y1="35" x2="160" y2="35" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
      <polygon points="90,30 100,35 90,40" fill="#1d4ed8" />
      {/* Line 2 */}
      <line x1="20" y1="75" x2="160" y2="75" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
      <polygon points="90,70 100,75 90,80" fill="#1d4ed8" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 14. SYMMETRY
// ─────────────────────────────────────────────────────────────
function renderSymmetry({ shape = 'letter_A', axis = 'vertical' }) {
  if (shape === 'letter_A') {
    return (
      <svg viewBox="0 0 140 140" className="w-32 h-32">
        {/* Letter A */}
        <text x="70" y="105" textAnchor="middle" fontSize="90" fontWeight="900" fill="#0f172a" fontFamily="sans-serif">
          A
        </text>
        {/* Dashed vertical axis of symmetry */}
        <line x1="70" y1="15" x2="70" y2="125" stroke="#ef4444" strokeWidth="3" strokeDasharray="5 4" />
      </svg>
    );
  }

  // Rectangle with 2 symmetry lines
  return (
    <svg viewBox="0 0 180 130" className="w-40 h-28">
      <rect x="30" y="25" width="120" height="80" rx="2" fill="#eff6ff" stroke="#3b82f6" strokeWidth="3" />
      {/* Vertical symmetry axis */}
      <line x1="90" y1="10" x2="90" y2="120" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 3" />
      {/* Horizontal symmetry axis */}
      <line x1="15" y1="65" x2="165" y2="65" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 3" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 15. BAR CHART
// ─────────────────────────────────────────────────────────────
function renderBarChart({ title = '', bars = [], max = 20 }) {
  const chartHeight = 100;
  const colWidth = 36;
  const gap = 18;
  const startX = 40;

  return (
    <svg viewBox="0 0 240 150" className="w-56 h-36 sm:w-64 sm:h-40">
      {/* Y Axis & Horizontal gridlines */}
      <line x1={startX} y1="20" x2={startX} y2={chartHeight + 20} stroke="#475569" strokeWidth="2" />
      <line x1={startX} y1={chartHeight + 20} x2="225" y2={chartHeight + 20} stroke="#475569" strokeWidth="2" />

      {[1, 0.5, 0].map(m => {
        const y = 20 + (1 - m) * chartHeight;
        return (
          <g key={m}>
            <line x1={startX} y1={y} x2="225" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
            <text x={startX - 6} y={y + 4} textAnchor="end" fontSize="10" fontWeight="bold" fill="#64748b">
              {Math.round(max * m)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {bars.map((bar, idx) => {
        const x = startX + 15 + idx * (colWidth + gap);
        const barH = (bar.value / max) * chartHeight;
        const y = chartHeight + 20 - barH;
        const color = bar.color || ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'][idx % 4];

        return (
          <g key={idx}>
            <rect x={x} y={y} width={colWidth} height={barH} rx="2" fill={color} stroke="#1e293b" strokeWidth="1.2" />
            <text x={x + colWidth / 2} y={y - 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#0f172a">
              {bar.value}
            </text>
            <text x={x + colWidth / 2} y={chartHeight + 34} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 16. PICTOGRAPH
// ─────────────────────────────────────────────────────────────
function renderPictograph({ keyLabel = '⭐ = 2 children / සිසුන් 2ක්', rows = [] }) {
  return (
    <div className="flex flex-col items-center p-1.5 w-full max-w-[280px]">
      <div className="bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full text-xs font-black text-amber-900 mb-2">
        {keyLabel}
      </div>
      <div className="w-full space-y-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="w-20 truncate">{row.label}:</span>
            <div className="flex gap-1">
              {Array.from({ length: row.count }).map((_, sIdx) => (
                <span key={sIdx} className="text-base">{row.icon || '⭐'}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 17. TALLY MARKS
// ─────────────────────────────────────────────────────────────
function renderTallyMarks({ count = 13 }) {
  const groupsOf5 = Math.floor(count / 5);
  const remainder = count % 5;

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      {Array.from({ length: groupsOf5 }).map((_, idx) => (
        <svg key={idx} viewBox="0 0 50 60" className="w-10 h-12">
          {/* 4 Vertical Bars */}
          <line x1="8" y1="10" x2="8" y2="50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <line x1="18" y1="10" x2="18" y2="50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="10" x2="28" y2="50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="10" x2="38" y2="50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          {/* Diagonal 5th Slash */}
          <line x1="4" y1="46" x2="44" y2="14" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      ))}
      {remainder > 0 && (
        <svg viewBox={`0 0 ${remainder * 12 + 10} 60`} className="h-12">
          {Array.from({ length: remainder }).map((_, rIdx) => (
            <line
              key={rIdx}
              x1={8 + rIdx * 10}
              y1="10"
              x2={8 + rIdx * 10}
              y2="50"
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 18. MONEY (Sri Lankan Coins and Notes)
// ─────────────────────────────────────────────────────────────
function renderMoney({ items = [] }) {
  // items: [{ type: 'coin'|'note', value: 5, count: 2, label: 'Rs. 5' }]
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {Array.from({ length: item.count || 1 }).map((_, cIdx) => (
            item.type === 'coin' ? (
              <div
                key={cIdx}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-amber-600 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-md flex flex-col items-center justify-center text-slate-800 font-black"
              >
                <span className="text-[10px] leading-tight">Rs.</span>
                <span className="text-sm font-extrabold leading-tight">{item.value}</span>
              </div>
            ) : (
              <div
                key={cIdx}
                className="w-24 h-13 sm:w-28 sm:h-14 rounded-lg border-2 border-emerald-700 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md flex flex-col justify-between p-1.5 text-white font-black"
              >
                <div className="flex justify-between items-center text-[9px] opacity-90">
                  <span>CENTRAL BANK</span>
                  <span>Rs. {item.value}</span>
                </div>
                <div className="text-center text-sm font-extrabold tracking-wider">
                  Rs. {item.value}
                </div>
                <div className="text-[8px] text-right opacity-80">SRI LANKA</div>
              </div>
            )
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 19. PATTERNS
// ─────────────────────────────────────────────────────────────
function renderPattern({ items = ['🔴', '🟦', '🔴', '🟦', '🔴', '❓'] }, compact = false) {
  const itemSize = compact ? 'w-8 h-8 text-sm' : 'w-9 h-9 sm:w-10 sm:h-10 text-base sm:text-lg';
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl max-w-full">
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`${itemSize} rounded-lg sm:rounded-xl flex items-center justify-center font-black ${
            it === '❓' || it === '__'
              ? 'bg-amber-100 border-2 border-dashed border-amber-500 text-amber-700 animate-bounce'
              : 'bg-white border border-slate-300 shadow-xs text-slate-800'
          }`}
        >
          {it}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 20. COMPASS (North, East, South, West)
// ─────────────────────────────────────────────────────────────
function renderCompass({ highlight = 'North' }) {
  return (
    <svg viewBox="0 0 160 160" className="w-36 h-36">
      <circle cx="80" cy="80" r="70" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {/* 4 Cardinal Rays */}
      <polygon points="80,20 75,75 80,70 85,75" fill={highlight === 'North' ? '#ef4444' : '#475569'} />
      <polygon points="80,140 75,85 80,90 85,85" fill={highlight === 'South' ? '#ef4444' : '#94a3b8'} />
      <polygon points="140,80 85,75 90,80 85,85" fill={highlight === 'East' ? '#ef4444' : '#94a3b8'} />
      <polygon points="20,80 75,75 70,80 75,85" fill={highlight === 'West' ? '#ef4444' : '#94a3b8'} />
      <circle cx="80" cy="80" r="4" fill="#0f172a" />

      {/* Cardinal Labels */}
      <text x="80" y="16" textAnchor="middle" fontSize="12" fontWeight="900" fill="#ef4444">N (උ)</text>
      <text x="150" y="84" textAnchor="start" fontSize="11" fontWeight="800" fill="#475569">E (නැ)</text>
      <text x="80" y="156" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">S (ද)</text>
      <text x="10" y="84" textAnchor="end" fontSize="11" fontWeight="800" fill="#475569">W (බ)</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 21. ROMAN NUMERALS
// ─────────────────────────────────────────────────────────────
function renderRomanNumerals({ numeral = 'V', value = '5' }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-xs">
      <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-sm">
        {numeral}
      </div>
      <div className="text-left">
        <span className="text-xs font-bold text-indigo-700 uppercase block tracking-wider">Roman Numeral</span>
        <span className="text-base font-black text-slate-800">රෝම ඉලක්කම : {numeral}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 22. MATCHING SETS & 1-TO-1 CORRESPONDENCE (Flowers, Vases, etc.)
// ─────────────────────────────────────────────────────────────
function renderMatchingSets(v, isEnglish = false, compact = false) {
  const topCount = Math.max(0, parseInt(v.topCount, 10) || 0);
  const bottomCount = Math.max(0, parseInt(v.bottomCount, 10) || 0);
  const pairedCount = v.pairedCount !== undefined ? v.pairedCount : Math.min(topCount, bottomCount);
  const remainderCount = v.remainderCount !== undefined ? v.remainderCount : Math.abs(topCount - bottomCount);
  const topItem = v.topItem || 'flower';
  const bottomItem = v.bottomItem || 'vase';

  const topLabel = isEnglish ? (v.topLabelEn || `${topCount} Items`) : (v.topLabelSi || `${topCount}ක්`);
  const bottomLabel = isEnglish ? (v.bottomLabelEn || `${bottomCount} Items`) : (v.bottomLabelSi || `${bottomCount}ක්`);

  const remainderLabel = isEnglish
    ? (v.remainderLabelEn || `Remaining: ${remainderCount}`)
    : (v.remainderLabelSi || `ඉතිරි: ${remainderCount}ක්`);

  const topIsBigger = topCount >= bottomCount;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto py-1 px-1">
      {/* Top Legend / Labels Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-2 text-xs sm:text-sm font-black text-slate-700">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          <span>{topLabel}</span>
        </div>
        <span className="text-slate-400 font-black text-xs sm:text-sm">&</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          <span>{bottomLabel}</span>
        </div>
      </div>

      {/* Main Alignment & Matching Canvas */}
      <div className="flex flex-wrap items-stretch justify-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-b from-slate-50 to-teal-50/20 border-2 border-teal-200/80 rounded-2xl w-full">
        {/* SECTION 1: Matched Pairs */}
        {pairedCount > 0 && (
          <div className="flex flex-col items-center bg-white/90 border border-teal-300/80 rounded-xl p-2 sm:p-2.5 shadow-2xs">
            <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-teal-700 mb-1.5 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              <span>{isEnglish ? `Matched Pairs (${pairedCount})` : `එකට එක ගැළපීම (${pairedCount}ක්)`}</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full py-0.5">
              {Array.from({ length: pairedCount }).map((_, idx) => (
                <div
                  key={`pair-${idx}`}
                  className="flex flex-col items-center p-1 sm:p-1.5 bg-teal-50/40 border border-teal-200 rounded-xl transition-transform hover:scale-102"
                >
                  {/* Top Item */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-slate-400 mb-0.5">#{idx + 1}</span>
                    {renderItemSvg(topItem, { size: compact ? 34 : 40, color: v.topColor })}
                  </div>

                  {/* 1-to-1 Connector */}
                  <div className="flex flex-col items-center my-0.5 sm:my-1 text-teal-600">
                    <svg className="w-3.5 h-4 sm:h-5 text-teal-600" viewBox="0 0 16 24" fill="none">
                      <path
                        d="M 8 1 L 8 17 M 4 13 L 8 19 L 12 13"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeDasharray="2.5 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[8px] sm:text-[9px] font-black bg-teal-100 text-teal-800 px-1 rounded-sm border border-teal-300">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Bottom Item */}
                  <div className="flex flex-col items-center">
                    {renderItemSvg(bottomItem, { size: compact ? 34 : 40, color: v.bottomColor })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: Remainder / Unpaired Group (if any) */}
        {remainderCount > 0 && (
          <div className="flex flex-col items-center bg-amber-50/90 border-2 border-dashed border-amber-400 rounded-xl p-2 sm:p-2.5 shadow-2xs">
            <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{remainderLabel}</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full py-0.5">
              {Array.from({ length: remainderCount }).map((_, idx) => {
                const itemNum = pairedCount + idx + 1;
                return (
                  <div
                    key={`rem-${idx}`}
                    className="flex flex-col items-center p-1 sm:p-1.5 bg-white/90 border border-amber-300 rounded-xl shadow-2xs"
                  >
                    {topIsBigger ? (
                      <>
                        {/* Remaining Top Item */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-black text-amber-600 mb-0.5">#{itemNum}</span>
                          {renderItemSvg(topItem, { size: compact ? 34 : 40, color: v.topColor })}
                        </div>

                        {/* No Pair Indicator */}
                        <div className="flex flex-col items-center my-0.5 sm:my-1">
                          <span className="text-[8px] font-bold bg-rose-100 text-rose-700 px-1 rounded-sm border border-rose-300">
                            {isEnglish ? 'No pair' : 'යුගලක් නැත'}
                          </span>
                          <span className="text-xs font-black text-rose-500">✕</span>
                        </div>

                        {/* Empty Slot */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-dashed border-amber-300 bg-amber-100/40 flex items-center justify-center text-amber-400 font-black text-xs">
                          ?
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Empty Top Slot */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-dashed border-amber-300 bg-amber-100/40 flex items-center justify-center text-amber-400 font-black text-xs">
                          ?
                        </div>

                        {/* No Pair Indicator */}
                        <div className="flex flex-col items-center my-0.5 sm:my-1">
                          <span className="text-[8px] font-bold bg-rose-100 text-rose-700 px-1 rounded-sm border border-rose-300">
                            {isEnglish ? 'Empty' : 'හිස්'}
                          </span>
                          <span className="text-xs font-black text-rose-500">✕</span>
                        </div>

                        {/* Remaining Bottom Item */}
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-black text-amber-600 mb-0.5">#{itemNum}</span>
                          {renderItemSvg(bottomItem, { size: compact ? 34 : 40, color: v.bottomColor })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sub-explanation Footer Pill */}
      <div className="mt-2 text-center text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
        {remainderCount > 0
          ? (isEnglish
              ? `${Math.max(topCount, bottomCount)} - ${Math.min(topCount, bottomCount)} = ${remainderCount} remaining`
              : `${Math.max(topCount, bottomCount)} න් ${Math.min(topCount, bottomCount)} ක් ගැලපූ විට ඉතිරි වන්නේ ${remainderCount} කි.`)
          : (isEnglish
              ? `Both sets are equal (${topCount} = ${bottomCount})`
              : `දෙපසම ගණන සමාන වේ (${topCount} = ${bottomCount})`)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 23. SORTING GROUPS (Sorting flowers by color, etc.)
// ─────────────────────────────────────────────────────────────
function renderSortingGroups(v, isEnglish = false, compact = false) {
  const g1 = v.group1 || { item: 'flower', variant: 'red', count: 3, labelSi: 'රතු මල් (3)', labelEn: 'Red Flowers (3)' };
  const g2 = v.group2 || { item: 'flower', variant: 'yellow', count: 3, labelSi: 'කහ මල් (3)', labelEn: 'Yellow Flowers (3)' };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto py-1 px-1">
      <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
        {/* Group 1 */}
        <div className="flex-1 flex flex-col items-center p-2 sm:p-2.5 bg-rose-50/70 border-2 border-rose-200 rounded-2xl shadow-2xs">
          <span className="text-xs font-black text-rose-700 mb-1.5 text-center">
            {isEnglish ? g1.labelEn : g1.labelSi}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
            {Array.from({ length: g1.count || 3 }).map((_, i) => (
              <div key={`g1-${i}`} className="p-1 bg-white rounded-xl shadow-2xs border border-rose-100">
                {renderItemSvg(g1.item || 'flower', { size: compact ? 32 : 36, variant: g1.variant || 'red', color: g1.color })}
              </div>
            ))}
          </div>
        </div>

        {/* VS / Divider */}
        <div className="flex flex-col items-center justify-center">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] sm:text-xs font-black text-slate-500 shadow-2xs">
            {isEnglish ? 'AND' : 'සහ'}
          </span>
        </div>

        {/* Group 2 */}
        <div className="flex-1 flex flex-col items-center p-2 sm:p-2.5 bg-amber-50/70 border-2 border-amber-200 rounded-2xl shadow-2xs">
          <span className="text-xs font-black text-amber-800 mb-1.5 text-center">
            {isEnglish ? g2.labelEn : g2.labelSi}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
            {Array.from({ length: g2.count || 3 }).map((_, i) => (
              <div key={`g2-${i}`} className="p-1 bg-white rounded-xl shadow-2xs border border-amber-100">
                {renderItemSvg(g2.item || 'flower', { size: compact ? 32 : 36, variant: g2.variant || 'yellow', color: g2.color })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SVG OBJECT ILLUSTRATIONS FOR PRIMARY MATH (FLOWER, VASE, ETC.)
// ─────────────────────────────────────────────────────────────
function renderItemSvg(type, { color, size = 40, variant } = {}) {
  switch (type) {
    case 'flower': {
      const petalColor = color || (variant === 'yellow' ? '#facc15' : variant === 'red' ? '#ef4444' : '#ec4899');
      const centerColor = variant === 'yellow' ? '#ea580c' : '#f59e0b';
      return (
        <svg viewBox="0 0 54 62" width={size} height={size * 1.15} className="drop-shadow-xs transition-transform hover:scale-105">
          {/* Stem */}
          <path d="M 27 34 Q 28 47 27 58" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Leaves */}
          <path d="M 27 45 Q 38 42 39 37 Q 32 46 27 48" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
          <path d="M 27 49 Q 16 46 15 41 Q 22 49 27 52" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
          {/* Petals */}
          <circle cx="27" cy="14" r="8" fill={petalColor} opacity="0.95" />
          <circle cx="37" cy="22" r="8" fill={petalColor} opacity="0.95" />
          <circle cx="33" cy="33" r="8" fill={petalColor} opacity="0.95" />
          <circle cx="21" cy="33" r="8" fill={petalColor} opacity="0.95" />
          <circle cx="17" cy="22" r="8" fill={petalColor} opacity="0.95" />
          {/* Center Petal Body */}
          <circle cx="27" cy="24" r="9" fill={petalColor} />
          {/* Center Disk */}
          <circle cx="27" cy="24" r="6" fill={centerColor} stroke="#b45309" strokeWidth="1" />
          <circle cx="25" cy="22" r="1.5" fill="#fef08a" />
        </svg>
      );
    }
    case 'vase': {
      return (
        <svg viewBox="0 0 54 58" width={size} height={size * 1.07} className="drop-shadow-xs transition-transform hover:scale-105">
          <ellipse cx="27" cy="53" rx="13" ry="3.5" fill="#0369a1" />
          {/* Vase Body */}
          <path
            d="M 18 16 C 15 25, 9 37, 13 49 C 16 53, 38 53, 41 49 C 45 37, 39 25, 36 16 Z"
            fill="#0284c7"
            stroke="#0c4a6e"
            strokeWidth="1.8"
          />
          {/* Highlight Gradient simulation */}
          <path
            d="M 20 18 C 17 26, 12 37, 16 48 C 17 49, 23 50, 26 50 C 20 45, 17 33, 20 20 Z"
            fill="#38bdf8"
            opacity="0.6"
          />
          {/* Lip */}
          <ellipse cx="27" cy="15" rx="11" ry="3.5" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1.8" />
          <ellipse cx="27" cy="15" rx="7.5" ry="2" fill="#0369a1" />
          {/* Flower Motif */}
          <circle cx="27" cy="34" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
          <line x1="27" y1="31" x2="27" y2="37" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="24" y1="34" x2="30" y2="34" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    }
    case 'child': {
      return (
        <svg viewBox="0 0 54 58" width={size} height={size * 1.07} className="drop-shadow-xs transition-transform hover:scale-105">
          {/* Hair background */}
          <path d="M 16 23 C 14 9, 40 9, 38 23 C 42 16, 44 26, 39 28 C 39 12, 15 12, 15 28 Z" fill="#334155" />
          {/* Face */}
          <circle cx="27" cy="23" r="13" fill="#fed7aa" stroke="#f97316" strokeWidth="1.2" />
          {/* Bangs */}
          <path d="M 17 19 Q 24 23 27 19 Q 30 23 37 19" fill="#334155" />
          {/* Eyes */}
          <circle cx="22.5" cy="22" r="1.8" fill="#1e293b" />
          <circle cx="31.5" cy="22" r="1.8" fill="#1e293b" />
          {/* Smile */}
          <path d="M 22.5 28 Q 27 32 31.5 28" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Cheeks */}
          <circle cx="19" cy="25" r="2" fill="#fda4af" opacity="0.8" />
          <circle cx="35" cy="25" r="2" fill="#fda4af" opacity="0.8" />
          {/* Shirt */}
          <path d="M 16 36 C 16 36, 19 33, 27 33 C 35 33, 38 36, 38 36 L 42 52 C 42 54, 12 54, 12 52 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.2" />
          <polygon points="27,33 23,40 31,40" fill="#ffffff" />
        </svg>
      );
    }
    case 'hat': {
      return (
        <svg viewBox="0 0 54 54" width={size} height={size} className="drop-shadow-xs transition-transform hover:scale-105">
          {/* Brim */}
          <ellipse cx="27" cy="40" rx="21" ry="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1.6" />
          {/* Crown */}
          <path d="M 14 39 C 14 20, 40 20, 40 39 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.6" />
          {/* Ribbon */}
          <path d="M 14.5 36 C 19 33, 35 33, 39.5 36 L 39 40 C 35 37, 19 37, 15 40 Z" fill="#ef4444" />
          {/* Top Pom */}
          <circle cx="27" cy="20" r="4.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
        </svg>
      );
    }
    case 'pencil': {
      return (
        <svg viewBox="0 0 54 58" width={size} height={size * 1.07} className="drop-shadow-xs transition-transform hover:scale-105">
          <g transform="rotate(28 27 29)">
            <rect x="23" y="6" width="8" height="7" rx="2" fill="#fb7185" stroke="#e11d48" strokeWidth="1" />
            <rect x="23" y="13" width="8" height="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
            <rect x="23" y="17" width="8" height="24" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
            <line x1="26" y1="17" x2="26" y2="41" stroke="#f59e0b" strokeWidth="1" />
            <polygon points="23,41 31,41 27,49" fill="#fed7aa" stroke="#d97706" strokeWidth="0.8" />
            <polygon points="25.5,46 28.5,46 27,49" fill="#1e293b" />
          </g>
        </svg>
      );
    }
    case 'banana': {
      return (
        <svg viewBox="0 0 54 54" width={size} height={size} className="drop-shadow-xs transition-transform hover:scale-105">
          <path d="M 13 17 C 15 36, 32 44, 45 35 C 38 46, 17 40, 11 21 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.8" />
          <path d="M 12 19 C 17 34, 29 40, 42 34" stroke="#eab308" strokeWidth="1.4" fill="none" />
          <rect x="10" y="15" width="4.5" height="4.5" rx="1" fill="#65a30d" />
          <circle cx="44.5" cy="35" r="1.6" fill="#713f12" />
        </svg>
      );
    }
    case 'mango': {
      return (
        <svg viewBox="0 0 54 54" width={size} height={size} className="drop-shadow-xs transition-transform hover:scale-105">
          <path d="M 27 15 C 39 15, 45 28, 38 40 C 32 49, 19 46, 15 38 C 11 27, 17 15, 27 15 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.6" />
          <path d="M 25 17 C 20 25, 20 36, 24 42" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 27 15 Q 27 9 29 8" stroke="#713f12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 29 11 Q 37 9 39 13 Q 33 14 29 11" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
        </svg>
      );
    }
    case 'guava': {
      return (
        <svg viewBox="0 0 54 54" width={size} height={size} className="drop-shadow-xs transition-transform hover:scale-105">
          <circle cx="27" cy="30" r="16" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.6" />
          <ellipse cx="27" cy="30" rx="14" ry="15" fill="#a3e635" />
          <path d="M 19 22 C 16 27, 16 33, 19 38" stroke="#d9f99d" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M 27 14 Q 27 9 28 8" stroke="#713f12" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 28 10 Q 36 9 37 13 Q 31 14 28 10" fill="#15803d" />
        </svg>
      );
    }
    case 'apple': {
      return (
        <svg viewBox="0 0 54 54" width={size} height={size} className="drop-shadow-xs transition-transform hover:scale-105">
          <path d="M 27 18 C 22 14, 13 18, 13 28 C 13 39, 22 46, 27 46 C 32 46, 41 39, 41 28 C 41 18, 32 14, 27 18 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.6" />
          <path d="M 19 23 C 17 27, 17 33, 19 37" stroke="#fca5a5" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M 27 18 Q 27 11 29 10" stroke="#713f12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 29 13 Q 37 11 38 15 Q 33 16 29 13" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
        </svg>
      );
    }
    default:
      return <span className="text-2xl sm:text-3xl">🌸</span>;
  }
}



