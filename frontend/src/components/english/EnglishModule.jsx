import React, { useState, useRef, useEffect } from 'react';

const EnglishModule = ({ onExit }) => {
  const [curriculumData, setCurriculumData] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(() => {
    return parseInt(sessionStorage.getItem('speaking_grade') || '2', 10);
  });
  const [selectedMode, setSelectedMode] = useState('practice');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // Load speaking curriculum pool
  useEffect(() => {
    fetch('/speaking_curriculum_pool.json')
      .then(res => res.json())
      .then(data => setCurriculumData(data))
      .catch(err => console.error("Failed to load speaking curriculum:", err));
  }, []);

  // Save selected grade
  useEffect(() => {
    sessionStorage.setItem('speaking_grade', String(selectedGrade));
  }, [selectedGrade]);

  // Filter items based on grade and category
  const filteredItems = (curriculumData?.items || []).filter(item => {
    const matchGrade = item.grade === selectedGrade;
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchGrade && matchCat;
  });

  const currentItem = filteredItems[currentItemIndex] || filteredItems[0];
  const targetText = currentItem ? currentItem.prompt : "";

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await Promise.race([
            audioContext.decodeAudioData(arrayBuffer),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
          ]);

          const numOfChan = audioBuffer.numberOfChannels;
          const length = audioBuffer.length * numOfChan * 2 + 44;
          const buffer = new ArrayBuffer(length);
          const view = new DataView(buffer);
          const channels = [];
          let pos = 0;

          const setUint32 = (d) => { view.setUint32(pos, d, true); pos += 4; };
          const setUint16 = (d) => { view.setUint16(pos, d, true); pos += 2; };
          const writeStr = (s) => { for (let i = 0; i < s.length; i++) view.setUint8(pos++, s.charCodeAt(i)); };

          writeStr('RIFF'); setUint32(length - 8); writeStr('WAVE'); writeStr('fmt ');
          setUint32(16); setUint16(1); setUint16(numOfChan);
          setUint32(audioBuffer.sampleRate);
          setUint32(audioBuffer.sampleRate * 2 * numOfChan);
          setUint16(numOfChan * 2); setUint16(16);
          writeStr('data'); setUint32(length - pos - 4);

          for (let i = 0; i < audioBuffer.numberOfChannels; i++) channels.push(audioBuffer.getChannelData(i));
          for (let i = 0; i < audioBuffer.length; i++) {
            for (let c = 0; c < numOfChan; c++) {
              let sample = Math.max(-1, Math.min(1, channels[c][i]));
              sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
              view.setInt16(pos, sample, true); pos += 2;
            }
          }

          const wavBlob = new Blob([buffer], { type: 'audio/wav' });
          setAudioUrl(URL.createObjectURL(wavBlob));
          const reader = new FileReader();
          reader.readAsDataURL(wavBlob);
          reader.onloadend = () => analyzeSpeech(reader.result.split(',')[1]);
        } catch (e) {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => analyzeSpeech(reader.result.split(',')[1]);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setFeedback(null);
      setAudioUrl(null);
    } catch (err) {
      alert("Please allow Microphone permissions to record your voice!");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const analyzeSpeech = async (base64Audio) => {
    setIsAnalyzing(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60s for AI inference

    try {
      const response = await fetch('http://localhost:5000/api/english/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: "student_primary_01",
          audioBase64: base64Audio,
          targetText,
          videoFramesBase64: []
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Speaking analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
    setFeedback(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => analyzeSpeech(reader.result.split(',')[1]);
  };

  const handleNextItem = () => {
    setCurrentItemIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    setFeedback(null);
    setAudioUrl(null);
  };

  const handlePrevItem = () => {
    setCurrentItemIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    setFeedback(null);
    setAudioUrl(null);
  };

  const scoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const scoreBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 w-full text-slate-800">

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          &larr; Dashboard
        </button>

        {/* Grade Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
          {[2, 3, 4].map(g => (
            <button
              key={g}
              onClick={() => { setSelectedGrade(g); setCurrentItemIndex(0); setFeedback(null); }}
              className={`px-5 py-1.5 rounded-xl font-black text-sm transition-all ${
                selectedGrade === g ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grade {g}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
          {[['practice','🟢','Practice'], ['progress','🟡','Check'], ['assessment','🔴','Exam']].map(([val, icon, label]) => (
            <button
              key={val}
              onClick={() => setSelectedMode(val)}
              className={`px-2.5 py-1 rounded-lg transition-all ${selectedMode === val ? 'bg-slate-100 font-black text-slate-900' : 'text-slate-400'}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        <button
          onClick={() => { setSelectedCategory('all'); setCurrentItemIndex(0); setFeedback(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all ${
            selectedCategory === 'all' ? 'bg-slate-800 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🌟 All ({filteredItems.length})
        </button>
        {(curriculumData?.categories || []).map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setCurrentItemIndex(0); setFeedback(null); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id ? 'bg-green-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">

        {/* Task Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-black text-xs uppercase tracking-wider">
              {currentItem?.category?.replace(/_/g, ' ')}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {currentItem?.topic}
            </span>
          </div>
          <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {currentItemIndex + 1} / {filteredItems.length}
          </span>
        </div>

        {/* Target Speech Card */}
        <div className="p-8 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/50 flex flex-col justify-center items-center text-center mb-8 min-h-[200px]">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-3">Speak Clearly:</span>

          {currentItem?.image_emoji && (
            <div className="text-4xl mb-3 tracking-widest">{currentItem.image_emoji}</div>
          )}

          <h3 className="text-4xl sm:text-6xl font-black text-slate-800 tracking-wide mb-4">
            "{currentItem?.display_text || targetText}"
          </h3>

          {currentItem?.phonetic_target && (
            <div className="px-3 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 font-mono shadow-sm mb-3">
              Target: {currentItem.phonetic_target}
            </div>
          )}

          {currentItem?.hint && (
            <p className="text-xs font-semibold text-slate-500 max-w-sm leading-relaxed">
              💡 {currentItem.hint}
            </p>
          )}
        </div>

        {/* Record Controls */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
          <button
            onClick={() => isRecording ? stopRecording() : startRecording()}
            disabled={isAnalyzing}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-4xl shadow-xl transition-all transform hover:scale-105 active:scale-95 font-bold ${
              isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' :
              isAnalyzing ? 'bg-amber-400 text-white cursor-wait' :
              'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <div>{isRecording ? '⏹️' : isAnalyzing ? '⏳' : '🎙️'}</div>
            <span className="text-xs font-black uppercase mt-1 tracking-wide">
              {isRecording ? 'Stop' : isAnalyzing ? 'Wait...' : 'Speak'}
            </span>
          </button>

          <div className="flex flex-col items-center gap-2">
            <span className="text-slate-300 font-bold text-xs">OR</span>
            <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isAnalyzing || isRecording}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-xl shadow-sm text-xs transition-all flex items-center gap-1.5"
            >
              📂 Upload Audio File
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <button onClick={handlePrevItem} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-all">
              ‹
            </button>
            <button onClick={handleNextItem} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-all">
              ›
            </button>
          </div>
        </div>

        {/* 5-Dimensional AI Scorecard */}
        {feedback && feedback.overall_score === 0 ? (
          <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-6 sm:p-8 rounded-3xl animate-fade-in text-center">
            <div className="text-4xl mb-2">🔇</div>
            <h4 className="text-xl font-black text-amber-900 mb-1">No Speech Detected</h4>
            <p className="text-amber-800 font-semibold text-sm max-w-md mx-auto mb-4">
              {feedback.feedback?.learner_message || "We couldn't hear your voice clearly. Please press Speak and say the target word clearly into your microphone!"}
            </p>
            {audioUrl && (
              <div className="max-w-md mx-auto mb-4 bg-white p-3 rounded-2xl border border-amber-200">
                <span className="block text-center text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
                  Recorded Audio
                </span>
                <audio controls src={audioUrl} className="w-full h-8 outline-none"></audio>
              </div>
            )}
            <button
              onClick={() => { setFeedback(null); setAudioUrl(null); }}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow transition-all"
            >
              🔄 Try Again
            </button>
          </div>
        ) : feedback && (
          <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl animate-fade-in">

            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Multi-Stage Assessment</span>
                <h4 className="text-xl font-black text-slate-900 mt-0.5">AI Speaking Report</h4>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Overall Score</div>
                <div className={`text-4xl font-black ${scoreColor(feedback.overall_score)}`}>
                  {feedback.overall_score}
                  <span className="text-lg font-bold text-slate-400">/100</span>
                </div>
              </div>
            </div>

            {/* Audio Replay */}
            {audioUrl && (
              <div className="mb-5 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200">
                <span className="block text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Your Recording
                </span>
                <audio controls src={audioUrl} className="w-full h-9 outline-none"></audio>
              </div>
            )}

            {/* 5 Score Bars */}
            <div className="space-y-3 mb-6">
              {[
                ['Pronunciation', 'pronunciation', '🔤'],
                ['Fluency', 'fluency', '⏱️'],
                ['Prosody', 'prosody', '🎵'],
                ['Completeness', 'completeness', '✅'],
                ['Intelligibility', 'intelligibility', '💡'],
              ].map(([label, key, icon]) => {
                const val = feedback.diagnostics?.[key] || 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <span>{icon}</span>{label}
                      </span>
                      <span className={`text-sm font-black ${scoreColor(val)}`}>{val}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(val)}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fluency Metrics Grid */}
            {feedback.fluency_metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  ['Speech Rate', feedback.fluency_metrics.speech_rate_wpm + ' WPM', '⏱️'],
                  ['Long Pauses (>0.5s)', feedback.fluency_metrics.long_pauses_500ms, '⏸️'],
                  ['Intonation', feedback.fluency_metrics.intonation_slope, '📈'],
                  ['Monotone', feedback.fluency_metrics.is_monotone ? 'Yes' : 'No', '🔔'],
                ].map(([label, val, icon]) => (
                  <div key={label} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-0.5">{icon} {label}</div>
                    <div className="text-sm font-black text-slate-800">{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* MTI Pattern Alert */}
            {feedback.l1_contrast_flag && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl mb-5 shadow-sm">
                <div className="font-black text-amber-800 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  ⚠️ Sri Lankan MTI Pattern Detected
                </div>
                <div className="text-amber-900 font-bold text-sm">{feedback.l1_contrast_flag}</div>
                {feedback.mti_patterns?.[0]?.evidence && (
                  <div className="mt-1.5 text-xs text-amber-700 font-medium">
                    Expected: <strong>{feedback.mti_patterns[0].evidence.expected}</strong>
                    {' → '}
                    Heard: <strong>{feedback.mti_patterns[0].evidence.heard}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Pedagogical Feedback */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm mb-5">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tutor Feedback</div>
              <p className="text-slate-800 font-semibold text-sm sm:text-base leading-relaxed">
                {feedback.feedback?.learner_message || "Assessment complete."}
              </p>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNextItem}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-2"
              >
                Next Exercise &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishModule;
