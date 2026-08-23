import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Web Audio Synthesizer ──
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    if (type === 'correct') {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {}
}

function speakSinhala(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'si-LK';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

// ── Ruled Lined Canvas Slate for Invitation Card Tracing ──
function InvitationTracingSlate({ textToTrace }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [textToTrace]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0284C7';
    isDrawingRef.current = true;
  };

  const handleMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleEnd = (e) => {
    e?.preventDefault();
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full mt-3 p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-sky-300">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
          <span>✍️</span>
          <span>ආරාධනා පත්‍රයේ තොරතුරු තිත් ඉරි මත ලියන්න (Trace card details):</span>
        </span>
        <button
          onClick={handleClear}
          className="text-xs text-rose-500 hover:text-rose-700 font-bold underline cursor-pointer"
        >
          මකන්න
        </button>
      </div>

      <div className="relative w-full h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-x-0 top-3 border-b border-sky-100 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-3 border-b border-sky-100 pointer-events-none"></div>

        <svg viewBox="0 0 540 50" className="w-full h-full pointer-events-none select-none">
          <text
            x="270"
            y="32"
            textAnchor="middle"
            fontSize="18"
            fontWeight="300"
            fontFamily="'Noto Sans Sinhala', 'Iskoola Pota', sans-serif"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.2"
            strokeDasharray="3, 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {textToTrace}
          </text>
        </svg>

        <canvas
          ref={canvasRef}
          width={540}
          height={50}
          className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
}

export default function SinhalaGrade3Level4Act4({ onExit }) {
  const navigate = useNavigate();

  // Slots to fill in Invitation Card
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [score, setScore] = useState(120);
  const [isCompleted, setIsCompleted] = useState(false);

  // Available options
  const EVENT_OPTIONS = ['උපන් දින සාදය', 'ත්‍යාග ප්‍රදානෝත්සවය', 'ක්‍රීඩා උළෙල'];
  const DATE_OPTIONS = ['ජූනි 24', 'මැයි 12', 'අගෝස්තු 15'];
  const TIME_OPTIONS = ['ප.ව. 4.00', 'පෙ.ව. 8.30', 'ප.ව. 1.00'];
  const VENUE_OPTIONS = ['මගේ නිවස', 'පාසල් ශාලාව', 'ක්‍රීඩාංගණය'];

  useEffect(() => {
    const timer = setTimeout(() => {
      speakSinhala('පහත තොරතුරු භාවිතා කර උපන් දින ආරාධනා පත්‍රය සම්පූර්ණ කරන්න.');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (category, value) => {
    playSound('click');
    speakSinhala(value);

    if (category === 'event') setSelectedEvent(value);
    if (category === 'date') setSelectedDate(value);
    if (category === 'time') setSelectedTime(value);
    if (category === 'venue') setSelectedVenue(value);

    // Check if all correct
    const isEvCorrect = (category === 'event' ? value : selectedEvent) === 'උපන් දින සාදය';
    const isDtCorrect = (category === 'date' ? value : selectedDate) === 'ජූනි 24';
    const isTmCorrect = (category === 'time' ? value : selectedTime) === 'ප.ව. 4.00';
    const isVnCorrect = (category === 'venue' ? value : selectedVenue) === 'මගේ නිවස';

    if (isEvCorrect && isDtCorrect && isTmCorrect && isVnCorrect) {
      playSound('correct');
      setIsCompleted(true);
      setScore((prev) => prev + 50);
      speakSinhala('විශිෂ්ටයි! ඔබ ආරාධනා පත්‍රය නිවැරදිව සම්පූර්ණ කළා!');
    }
  };

  const handleReset = () => {
    setSelectedEvent(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedVenue(null);
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-pink-50 to-emerald-100 font-sinhala select-none relative overflow-x-hidden flex flex-col justify-between pb-6">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onExit || (() => navigate('/dashboard'))}
              className="w-11 h-11 bg-purple-700 hover:bg-purple-800 text-white rounded-full flex items-center justify-center text-xl font-black shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="Dashboard"
            >
              🏠
            </button>
            <div className="bg-purple-900/90 text-white px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-md border-2 border-purple-400 flex items-center gap-1.5">
              <span>Level 4 · Activity 4</span>
              <span className="text-yellow-300">⭐</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white py-2 px-6 rounded-full shadow-lg border-2 border-yellow-300 text-center">
            <h1 className="text-sm md:text-base font-black tracking-wide text-yellow-200 drop-shadow">
              Activity 4: ආරාධනා පත්‍රයක් ලියමු
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/95 text-purple-900 px-4 py-2 rounded-2xl font-black text-sm md:text-base shadow-md border-2 border-purple-200 flex items-center gap-1.5">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span>{score}</span>
            </div>

            <button
              onClick={() => {
                playSound('click');
                speakSinhala('පහත තොරතුරු භාවිතා කර ආරාධනා පත්‍රය සම්පූර්ණ කරන්න.');
              }}
              className="w-11 h-11 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white cursor-pointer active:scale-95 transition-all"
              title="හඬ අසන්න"
            >
              🔊
            </button>
          </div>
        </div>

        {/* Sub-instruction banner */}
        <div className="max-w-3xl mx-auto w-full mt-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full py-2 px-6 shadow-md border-2 border-pink-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  speakSinhala('දී ඇති තොරතුරු තෝරා ආරාධනා පත්‍රය සම්පූර්ණ කරන්න.');
                }}
                className="w-8 h-8 bg-pink-600 hover:bg-pink-700 active:scale-90 text-white rounded-full flex items-center justify-center text-base shadow-sm cursor-pointer"
              >
                🔊
              </button>
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-800">
                💌 පහත <span className="text-pink-700 font-extrabold underline">තොරතුරු තෝරා</span> ආරාධනා පත්‍රය සම්පූර්ණ කරන්න.
              </p>
            </div>
            <div className="text-2xl pointer-events-none select-none">
              🎉
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="max-w-4xl mx-auto w-full px-4 my-3 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* Left Column: 4 Information Selector Panels */}
          <div className="md:col-span-5 flex flex-col gap-3">
            
            {/* Event Selector */}
            <div className="p-3 bg-white rounded-2xl border-2 border-pink-200 shadow-sm">
              <span className="text-xs font-black text-pink-700 uppercase flex items-center gap-1 mb-1.5">
                <span>🎉</span> <span>අවස්ථාව (Event):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_OPTIONS.map((ev) => (
                  <button
                    key={ev}
                    onClick={() => handleSelect('event', ev)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      selectedEvent === ev
                        ? ev === 'උපන් දින සාදය'
                          ? 'bg-pink-600 text-white ring-2 ring-pink-300'
                          : 'bg-rose-500 text-white'
                        : 'bg-pink-50 text-pink-900 hover:bg-pink-100'
                    }`}
                  >
                    {ev}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selector */}
            <div className="p-3 bg-white rounded-2xl border-2 border-sky-200 shadow-sm">
              <span className="text-xs font-black text-sky-700 uppercase flex items-center gap-1 mb-1.5">
                <span>📅</span> <span>දිනය (Date):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DATE_OPTIONS.map((dt) => (
                  <button
                    key={dt}
                    onClick={() => handleSelect('date', dt)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      selectedDate === dt
                        ? dt === 'ජූනි 24'
                          ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                          : 'bg-rose-500 text-white'
                        : 'bg-sky-50 text-sky-900 hover:bg-sky-100'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selector */}
            <div className="p-3 bg-white rounded-2xl border-2 border-purple-200 shadow-sm">
              <span className="text-xs font-black text-purple-700 uppercase flex items-center gap-1 mb-1.5">
                <span>🕓</span> <span>වේලාව (Time):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TIME_OPTIONS.map((tm) => (
                  <button
                    key={tm}
                    onClick={() => handleSelect('time', tm)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      selectedTime === tm
                        ? tm === 'ප.ව. 4.00'
                          ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                          : 'bg-rose-500 text-white'
                        : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                    }`}
                  >
                    {tm}
                  </button>
                ))}
              </div>
            </div>

            {/* Venue Selector */}
            <div className="p-3 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm">
              <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1 mb-1.5">
                <span>🏡</span> <span>ස්ථානය (Venue):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {VENUE_OPTIONS.map((vn) => (
                  <button
                    key={vn}
                    onClick={() => handleSelect('venue', vn)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      selectedVenue === vn
                        ? vn === 'මගේ නිවස'
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                          : 'bg-rose-500 text-white'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    {vn}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Invitation Card Preview & Writing Slate */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div className="bg-gradient-to-tr from-amber-50 via-rose-50 to-pink-50 rounded-[2.5rem] p-6 shadow-xl border-4 border-pink-300 relative overflow-hidden">
              
              <div className="text-center pb-3 border-b-2 border-dashed border-pink-200 mb-4">
                <span className="text-2xl drop-shadow">💌</span>
                <h2 className="text-xl sm:text-2xl font-black text-pink-950">ආරාධනා පත්‍රය</h2>
                <p className="text-xs font-bold text-pink-700">Invitation Card</p>
              </div>

              <div className="space-y-3 text-slate-800 text-sm sm:text-base font-bold">
                <p>ආදරණීය මිතුරිය,</p>
                
                <p className="leading-relaxed">
                  <span>මාගේ </span>
                  <span className={`inline-block min-w-[130px] text-center px-2.5 py-0.5 rounded-xl border-2 font-black mx-1 ${
                    selectedEvent === 'උපන් දින සාදය'
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : selectedEvent
                      ? 'bg-rose-400 text-white border-rose-500'
                      : 'bg-white border-pink-300 text-pink-400'
                  }`}>
                    {selectedEvent || '___________'}
                  </span>
                  <span>සඳහා ඔබට ආරාධනා කරමි.</span>
                </p>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-pink-200 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-black text-slate-700">📅 දිනය :</span>
                    <span className={`px-2.5 py-0.5 rounded-lg border font-black ${
                      selectedDate === 'ජූනි 24'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : selectedDate
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {selectedDate || '___________'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-20 font-black text-slate-700">🕓 වේලාව :</span>
                    <span className={`px-2.5 py-0.5 rounded-lg border font-black ${
                      selectedTime === 'ප.ව. 4.00'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : selectedTime
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {selectedTime || '___________'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-20 font-black text-slate-700">📍 ස්ථානය :</span>
                    <span className={`px-2.5 py-0.5 rounded-lg border font-black ${
                      selectedVenue === 'මගේ නිවස'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : selectedVenue
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {selectedVenue || '___________'}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-700">
                  ඔබගේ පැමිණීම බලාපොරොත්තු වෙමි.
                </p>
                <p className="text-right text-xs sm:text-sm font-black text-pink-900">
                  ස්තුතියි,
                </p>
              </div>

            </div>

            {/* Tracing slate when completed */}
            {isCompleted && (
              <div className="animate-fade-in">
                <InvitationTracingSlate textToTrace="උපන් දින සාදය - ජූනි 24 ප.ව. 4.00 මගේ නිවස" />
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <div className="max-w-4xl mx-auto w-full px-4 mt-2">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            className="py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <span>🏠</span>
            <span>මුල් පිටුව</span>
          </button>

          <button
            onClick={handleReset}
            className="py-2.5 px-5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-sm rounded-2xl shadow-md cursor-pointer"
          >
            🔄 නැවත සකසන්න
          </button>

          <button
            onClick={onExit || (() => navigate('/dashboard'))}
            disabled={!isCompleted}
            className={`py-2.5 px-6 font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-white flex items-center gap-2 transition-all ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-short'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>අවසන් කරන්න</span>
            <span>✓</span>
          </button>
        </div>
      </div>

    </div>
  );
}
