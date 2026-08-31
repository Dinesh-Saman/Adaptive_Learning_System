import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles, Headphones, RotateCcw } from 'lucide-react';
import { STORIES } from '../../data/creative/stories';
import { getItem } from '../../utils/storage';
import { recordStudentTestMarks, recordStudentQuestionAttempts } from '../../data/studentAnalyticsData';


const StoryDrawingModule = ({ onExit }) => {
    const [activeStory, setActiveStory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setEvaluationResult(null); // Reset on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items || [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          processFile(blob);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const audioRef = useRef(null);
  const isCancelledRef = useRef(false);
  const [playbackState, setPlaybackState] = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(null);
  
  // Tracking playback position for Resume functionality
  const queueRef = useRef([]);
  const secIdxRef = useRef(0);
  const sentIdxRef = useRef(0);
  const isSingleModeRef = useRef(false);

  const stopStory = () => {
    isCancelledRef.current = true;
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch (e) {}
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlaybackState('idle');
    setActiveParagraphIndex(null);
    secIdxRef.current = 0;
    sentIdxRef.current = 0;
    isSingleModeRef.current = false;
  };

  const pauseStory = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setPlaybackState('paused');
  };

  const resumeStory = () => {
    if (playbackState === 'paused' && audioRef.current && audioRef.current.src) {
      audioRef.current.play().then(() => {
        setPlaybackState('playing');
      }).catch(() => {
        playFromCurrentIndex();
      });
    } else {
      playFromCurrentIndex();
    }
  };

  const playFromCurrentIndex = () => {
    if (!activeStory) return;
    isCancelledRef.current = false;
    setPlaybackState('playing');

    const sections = queueRef.current.length > 0 ? queueRef.current : [
      { text: activeStory.title, paragraphIdx: -1 },
      ...activeStory.paragraphs.map((p, idx) => ({ text: p, paragraphIdx: idx })),
      { text: `කතාවේ ආදර්ශය. ${activeStory.moral}`, paragraphIdx: 999 }
    ];
    queueRef.current = sections;

    const playSection = (secIdx, startSentIdx = 0) => {
      if (isCancelledRef.current || secIdx >= sections.length) {
        stopStory();
        return;
      }

      secIdxRef.current = secIdx;
      const item = sections[secIdx];
      setActiveParagraphIndex(item.paragraphIdx);

      const rawSentences = item.text
        .split(/(?<=[.!?\n])\s+/)
        .map(s => s.trim())
        .filter(Boolean);
      const sentences = rawSentences.length > 0 ? rawSentences : [item.text];

      const playSentence = (sIdx) => {
        if (isCancelledRef.current) return;
        if (sIdx >= sentences.length) {
          if (isSingleModeRef.current) {
            stopStory();
          } else {
            playSection(secIdx + 1, 0);
          }
          return;
        }

        sentIdxRef.current = sIdx;
        const sentenceText = sentences[sIdx];
        const encoded = encodeURIComponent(sentenceText);
        const backendUrl = `http://localhost:5000/api/tts/sinhala?text=${encoded}`;
        const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=si&client=tw-ob&q=${encoded}`;

        const nextSent = () => {
          if (!isCancelledRef.current) {
            playSentence(sIdx + 1);
          }
        };

        const audio = new Audio();
        audioRef.current = audio;

        audio.onended = nextSent;
        audio.onerror = () => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(sentenceText);
            utterance.lang = 'si-LK';
            utterance.rate = 0.85;
            utterance.pitch = 1.25;
            utterance.onend = nextSent;
            utterance.onerror = nextSent;
            window.speechSynthesis.speak(utterance);
          } else {
            nextSent();
          }
        };

        audio.src = backendUrl;
        audio.play().catch(() => {
          audio.src = googleUrl;
          audio.play().catch(() => {
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(sentenceText);
              utterance.lang = 'si-LK';
              utterance.rate = 0.85;
              utterance.pitch = 1.25;
              utterance.onend = nextSent;
              utterance.onerror = nextSent;
              window.speechSynthesis.speak(utterance);
            } else {
              nextSent();
            }
          });
        });
      };

      playSentence(startSentIdx);
    };

    playSection(secIdxRef.current, sentIdxRef.current);
  };

  const startFullStory = () => {
    stopStory();
    if (!activeStory) return;
    queueRef.current = [
      { text: activeStory.title, paragraphIdx: -1 },
      ...activeStory.paragraphs.map((p, idx) => ({ text: p, paragraphIdx: idx })),
      { text: `කතාවේ ආදර්ශය. ${activeStory.moral}`, paragraphIdx: 999 }
    ];
    secIdxRef.current = 0;
    sentIdxRef.current = 0;
    isSingleModeRef.current = false;
    playFromCurrentIndex();
  };

  const playSingleParagraph = (pIdx, pText) => {
    // If already playing this paragraph, toggle pause/resume
    if (activeParagraphIndex === pIdx && playbackState === 'playing') {
      pauseStory();
      return;
    }
    if (activeParagraphIndex === pIdx && playbackState === 'paused') {
      resumeStory();
      return;
    }

    stopStory();
    queueRef.current = [{ text: pText, paragraphIdx: pIdx }];
    secIdxRef.current = 0;
    sentIdxRef.current = 0;
    isSingleModeRef.current = true;
    playFromCurrentIndex();
  };

  // Stop speaking when story changes or component unmounts
  useEffect(() => {
    return () => {
      stopStory();
    };
  }, [activeStory]);

  const handleEvaluate = async () => {
    if (!selectedImage) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const token = localStorage.getItem('token');
      const expectedElements = activeStory.expectedElements;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch('http://localhost:5000/api/creative/story-evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: getItem('studentId') || getItem('studentName') || "student",
          imageBase64: selectedImage,
          expectedElements: expectedElements
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setEvaluationResult(data);

        const drawingScore = data.score !== undefined ? data.score : 85;
        const currentStudentId = getItem('studentId') || 'std_001';
        const currentStudentName = getItem('studentName') || 'Hasara';

        try {
          const studentKey = (currentStudentName || 'hasara').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
          const storyId = activeStory?.id || 'story_task';
          const existing = JSON.parse(localStorage.getItem(`storydrawing_scores_${studentKey}`) || '{}');
          if (!existing[storyId]) {
            existing[storyId] = {
              storyId,
              title: activeStory?.title || activeStory?.englishTitle,
              score: drawingScore,
              grade: 'Grade 1',
              timestamp: new Date().toISOString()
            };
            localStorage.setItem(`storydrawing_scores_${studentKey}`, JSON.stringify(existing));
            if (studentKey === 'hasara' || studentKey === 'std_001') {
              localStorage.setItem('storydrawing_scores', JSON.stringify(existing));
            }
          }
        } catch (e) {}

        const p3Marks = Math.round((drawingScore / 100) * 30);
        recordStudentTestMarks({
          studentId: currentStudentId,
          name: currentStudentName,
          subject: 'preschool',
          categoryCode: 'P3',
          marks: p3Marks,
          maxMarks: 30
        });

        recordStudentQuestionAttempts({
          studentId: currentStudentId,
          module: 'preschool',
          grade: 'Grade 1',
          paperNumber: 1,
          attempts: [
            {
              questionId: `Story Drawing • ${activeStory?.title || 'Story Task'}`,
              domain: 'P3',
              category: 'P3',
              difficulty: 'Grade 1',
              isCorrect: drawingScore >= 50,
              score: drawingScore,
              timestamp: new Date().toISOString()
            }
          ]
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        setEvaluationResult({
          feedback_sinhala: errData.feedback_sinhala || "ඇගයීම සම්පූර්ණ කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.",
          feedback_english: errData.feedback_english || "Could not complete evaluation. Please try again."
        });
      }
    } catch (error) {
      console.error("Error evaluating drawing:", error);
      setEvaluationResult({
        feedback_sinhala: "සම්බන්ධතාවයේ දෝෂයක් හෝ ප්‍රමාදයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.",
        feedback_english: "Connection error or request timed out. Please try again."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleBack = () => {
    if (activeStory) {
      setActiveStory(null);
      setSelectedImage(null);
      setEvaluationResult(null);
    } else {
      onExit();
    }
  };

  return (
    <div className="flex-grow bg-slate-50 w-full min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <button 
            onClick={handleBack}
            className="text-sm font-bold text-orange-700 hover:text-white hover:bg-orange-600 bg-orange-50 border border-orange-200 px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 shadow-sm font-sinhala"
          >
            <span>⬅</span> ආපසු (Back)
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-800 mb-1 font-sinhala">කතන්දර චිත්‍ර (Story Drawing)</h1>
            <p className="text-slate-500 font-medium text-sm font-sinhala">කතාව කියවා ඔබ සිතින් මවාගන්නා දේ අඳින්න! (Read the story and draw what you imagine!)</p>
          </div>
          <div className="w-24"></div>
        </header>

        {/* If no story is selected, show the story list (4 per row, total 2 rows) */}
          {!activeStory ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STORIES.map(story => (
                <div 
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:border-orange-300 hover:shadow-xl cursor-pointer transition-all transform hover:-translate-y-1.5 flex flex-col items-center text-center group"
                >
                  {story.image ? (
                    <div className="w-full h-64 sm:h-72 mb-4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm flex items-center justify-center">
                      <img 
                        src={story.image} 
                        alt={story.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 sm:h-72 mb-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-100 flex items-center justify-center text-5xl shadow-inner">
                      {story.emoji}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-slate-800 font-sinhala mb-1 leading-snug">{story.title}</h3>
                  <p className="text-slate-500 font-medium text-xs">{story.englishTitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: The Story */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    {activeStory.image ? (
                      <img 
                        src={activeStory.image} 
                        alt={activeStory.title} 
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm" 
                      />
                    ) : (
                      <span className="text-3xl">{activeStory.emoji}</span>
                    )}
                    <h2 className="text-2xl font-bold text-slate-800 font-sinhala">{activeStory.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {playbackState === 'idle' && (
                      <button 
                        onClick={startFullStory}
                        className="text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl transition-all font-sinhala cursor-pointer shadow-sm active:scale-95 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-200 shadow-md"
                        title="මුළු කතාවටම සවන් දෙන්න"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>කතාව කියවන්න</span>
                      </button>
                    )}

                    {playbackState === 'playing' && (
                      <>
                        <button 
                          onClick={pauseStory}
                          className="text-sm font-bold px-3 py-2 rounded-xl transition-all font-sinhala cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200 shadow-md"
                          title="ශ්‍රවණය විරාම ගන්වන්න (Pause)"
                        >
                          <Pause className="w-4 h-4" />
                          <span>විරාමය</span>
                        </button>
                        <button 
                          onClick={stopStory}
                          className="text-sm font-bold px-3 py-2 rounded-xl transition-all font-sinhala cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 shadow-md"
                          title="ශ්‍රවණය නවත්වන්න (Stop)"
                        >
                          <Square className="w-4 h-4" />
                          <span>නවත්වන්න</span>
                        </button>
                      </>
                    )}

                    {playbackState === 'paused' && (
                      <>
                        <button 
                          onClick={resumeStory}
                          className="text-sm font-bold px-3.5 py-2 rounded-xl transition-all font-sinhala cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200 shadow-md animate-pulse"
                          title="කතාව නැවත දිගටම කියවන්න (Resume / Continue)"
                        >
                          <Play className="w-4 h-4" />
                          <span>දිගටම අසන්න</span>
                        </button>
                        <button 
                          onClick={stopStory}
                          className="text-sm font-bold px-3 py-2 rounded-xl transition-all font-sinhala cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700"
                          title="ශ්‍රවණය නවත්වන්න (Stop)"
                        >
                          <Square className="w-4 h-4" />
                          <span>නවත්වන්න</span>
                        </button>
                      </>
                    )}

                    <button 
                      onClick={() => { 
                        stopStory();
                        setActiveStory(null); 
                        setSelectedImage(null); 
                        setEvaluationResult(null); 
                      }}
                      className="text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 sm:px-4 py-2 rounded-xl transition-all font-sinhala cursor-pointer shadow-sm active:scale-95"
                    >
                      කතාව වෙනස් කරන්න
                    </button>
                  </div>
                </div>
                
                <div className="prose text-slate-700 font-sinhala leading-relaxed flex-grow overflow-y-auto pr-2 max-h-[50vh] custom-scrollbar space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      <Headphones className="w-3.5 h-3.5 text-amber-600" />
                      <span>ඕනෑම ඡේදයක් මත ක්ලික් කර එයට පමණක් සවන් දෙන්න:</span>
                    </span>
                    {playbackState === 'playing' && (
                      <span className="text-[11px] text-amber-700 animate-pulse font-black flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block"></span>
                        හඬ වාදනය වේ...
                      </span>
                    )}
                  </div>

                  {activeStory.paragraphs.map((p, idx) => {
                    const isThisActive = activeParagraphIndex === idx;
                    const isThisPlaying = isThisActive && playbackState === 'playing';
                    const isThisPaused = isThisActive && playbackState === 'paused';

                    return (
                      <div 
                        key={idx} 
                        onClick={() => playSingleParagraph(idx, p)}
                        className={`group relative text-[1.08rem] p-3 rounded-2xl transition-all duration-300 cursor-pointer border ${
                          isThisPlaying
                            ? 'bg-amber-50 text-amber-950 font-bold border-amber-400 shadow-md ring-2 ring-amber-300/60' 
                            : isThisPaused
                            ? 'bg-amber-50/70 text-amber-900 border-amber-300/80 border-dashed'
                            : 'bg-white hover:bg-orange-50/60 border-slate-100 hover:border-orange-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="flex-grow select-text leading-relaxed">{p}</p>
                          <div className="shrink-0 pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playSingleParagraph(idx, p);
                              }}
                              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                                isThisPlaying 
                                  ? 'bg-amber-500 text-white shadow-sm animate-pulse' 
                                  : isThisPaused
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 group-hover:bg-orange-200 text-slate-500 group-hover:text-orange-800'
                              }`}
                              title={isThisPlaying ? "විරාමය" : "මෙම ඡේදයට සවන් දෙන්න"}
                            >
                              {isThisPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : isThisPaused ? (
                                <Play className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Moral Section (Also Click-to-Listen) */}
                  <div 
                    onClick={() => playSingleParagraph(999, `කතාවේ ආදර්ශය. ${activeStory.moral}`)}
                    className={`mt-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      activeParagraphIndex === 999 && playbackState === 'playing'
                        ? 'bg-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300/70'
                        : activeParagraphIndex === 999 && playbackState === 'paused'
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-orange-50 hover:bg-orange-100/70 border-orange-100 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-orange-800 flex items-center gap-1.5">
                        <span>ආදර්ශය:</span>
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSingleParagraph(999, `කතාවේ ආදර්ශය. ${activeStory.moral}`);
                        }}
                        className="p-1.5 rounded-xl bg-orange-200 hover:bg-orange-300 text-orange-900 transition-all cursor-pointer"
                        title="ආදර්ශයට සවන් දෙන්න"
                      >
                        {activeParagraphIndex === 999 && playbackState === 'playing' ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-orange-700 font-medium italic text-[1.05rem]">
                      {activeStory.moral}
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">ඔබේ කාර්යය:</h3>
              <p className="text-blue-700 text-sm">
                කතාව කියවා ඔබ සිතින් මවාගන්නා දේ චිත්‍රයට නඟන්න! ඉන්පසු එහි ඡායාරූපයක් ගෙන මෙහි උඩුගත කරන්න.
              </p>
            </div>
          </div>

          {/* Right Column: Upload and Evaluate */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <span className="text-3xl">🎨</span>
              <h2 className="text-2xl font-bold text-slate-800 font-sinhala">ඔබේ චිත්‍රය (Your Drawing)</h2>
            </div>

            <div className="flex-grow flex flex-col justify-center">
              {!selectedImage ? (
                <div 
                  className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isDragging ? 'border-orange-500 bg-orange-100' : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  onClick={() => fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <span className="text-6xl mb-4 block animate-bounce-slow">📸</span>
                  <p className="text-slate-700 font-bold mb-2">Click, Paste, or Drag your drawing here</p>
                  <p className="text-slate-500 text-sm">Supports JPG and PNG</p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center min-h-[300px]">
                  <img src={selectedImage} alt="Student Drawing" className="max-h-[400px] object-contain" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 p-2 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </div>

            {selectedImage && (
              <div className="mt-6">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-md transition-all ${
                    isEvaluating ? 'bg-slate-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isEvaluating ? 'පරීක්ෂා කරමින් පවතී...' : 'ඇගයීම ආරම්භ කරන්න (Evaluate)'}
                </button>
              </div>
            )}

            {evaluationResult && (
              <div className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">AI Feedback</h3>
                </div>
                
                <p className="text-slate-700 font-sinhala text-lg">
                  {evaluationResult.feedback_sinhala}
                </p>
              </div>
            )}

          </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default StoryDrawingModule;
