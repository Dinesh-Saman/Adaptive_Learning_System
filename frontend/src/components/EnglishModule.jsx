import React, { useState, useRef, useEffect } from 'react';

const EnglishModule = ({ onExit }) => {
  const [papers, setPapers] = useState([]);

  // Restore selectedPaper and questionIndex from sessionStorage on page refresh
  const [selectedPaper, setSelectedPaper] = useState(() => {
    try {
      const saved = sessionStorage.getItem('english_selectedPaper');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    try {
      return parseInt(sessionStorage.getItem('english_questionIndex') || '0', 10);
    } catch { return 0; }
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const videoFramesRef = useRef([]);
  const streamRef = useRef(null);

  // Persist selectedPaper to sessionStorage whenever it changes
  useEffect(() => {
    if (selectedPaper) {
      sessionStorage.setItem('english_selectedPaper', JSON.stringify(selectedPaper));
    } else {
      sessionStorage.removeItem('english_selectedPaper');
    }
  }, [selectedPaper]);

  // Persist currentQuestionIndex to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('english_questionIndex', String(currentQuestionIndex));
  }, [currentQuestionIndex]);

  useEffect(() => {
    fetch('/assessment_materials.json')
      .then(res => res.json())
      .then(data => setPapers(data.papers || []))
      .catch(err => console.error("Failed to load papers:", err));
      
    // Cleanup video tracks when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
    };
  }, []);

  const targetText = selectedPaper ? selectedPaper.questions[currentQuestionIndex].word : "";

  // Start Camera preview automatically when question is active
  useEffect(() => {
    let activeStream = null;
    if (selectedPaper) {
      navigator.mediaDevices?.getUserMedia({ 
        video: { width: { ideal: 320 }, height: { ideal: 240 } }, 
        audio: false 
      })
      .then(st => {
        activeStream = st;
        streamRef.current = st;
        if (videoRef.current) {
          videoRef.current.srcObject = st;
          setCameraActive(true);
        }
      })
      .catch(err => {
        console.warn("Camera preview initialization:", err);
        setCameraActive(false);
      });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [selectedPaper, currentQuestionIndex]);

  const startRecording = async () => {
    try {
      // Capture both audio and video
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { width: { ideal: 320 }, height: { ideal: 240 } } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      videoFramesRef.current = [];

      // Sample 6-8 video keyframes during speech recording for lip analysis
      frameIntervalRef.current = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = 160;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 160, 120);
            const frameB64 = canvas.toDataURL('image/jpeg', 0.65).split(',')[1];
            if (videoFramesRef.current.length < 10) {
              videoFramesRef.current.push(frameB64);
            }
          }
        }
      }, 300); // every 300ms

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current);
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          // Transcode WebM to standard WAV using AudioContext
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          
          const audioBuffer = await Promise.race([
            audioContext.decodeAudioData(arrayBuffer),
            new Promise((_, reject) => setTimeout(() => reject(new Error("decodeAudioData timeout")), 3000))
          ]);
          
          const numOfChan = audioBuffer.numberOfChannels;
          const length = audioBuffer.length * numOfChan * 2 + 44;
          const buffer = new ArrayBuffer(length);
          const view = new DataView(buffer);
          const channels = [];
          let pos = 0;
          
          const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };
          const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
          const writeStr = (str) => { for (let i = 0; i < str.length; i++) view.setUint8(pos++, str.charCodeAt(i)); };
          
          writeStr('RIFF'); setUint32(length - 8); writeStr('WAVE'); writeStr('fmt ');
          setUint32(16); setUint16(1); setUint16(numOfChan);
          setUint32(audioBuffer.sampleRate);
          setUint32(audioBuffer.sampleRate * 2 * numOfChan);
          setUint16(numOfChan * 2); setUint16(16);
          writeStr('data'); setUint32(length - pos - 4);
          
          for (let i = 0; i < audioBuffer.numberOfChannels; i++) channels.push(audioBuffer.getChannelData(i));
          
          for (let currentOffset = 0; currentOffset < audioBuffer.length; currentOffset++) {
            for (let i = 0; i < numOfChan; i++) {
              let sample = Math.max(-1, Math.min(1, channels[i][currentOffset]));
              sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
              view.setInt16(pos, sample, true); pos += 2;
            }
          }
          
          const wavBlob = new Blob([buffer], { type: 'audio/wav' });
          setAudioUrl(URL.createObjectURL(wavBlob));
          const reader = new FileReader();
          reader.readAsDataURL(wavBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            analyzeSpeech(base64Audio, videoFramesRef.current);
          };
        } catch (e) {
          console.warn("WAV Transcoding fallback:", e);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => analyzeSpeech(reader.result.split(',')[1], videoFramesRef.current);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setFeedback(null);
      setAudioUrl(null);
    } catch (err) {
      console.error("Error accessing camera/microphone:", err);
      alert("Please allow Camera and Microphone permissions to test your pronunciation and lip movements!");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
    setIsRecording(false);
  };

  const analyzeSpeech = async (base64Audio, videoFrames = []) => {
    setIsAnalyzing(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch('http://localhost:5000/api/english/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId: "student_123", 
          audioBase64: base64Audio, 
          targetText,
          videoFramesBase64: videoFrames 
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      } else {
        console.error("API returned an error:", response.status);
        setFeedback({
          overall_score: 0,
          diagnostics: { intelligibility: 0, phoneme_control: 0, fluency: 0, prosody: 0 },
          feedback: { learner_message: "The server encountered an error. Please try again.", teacher_message: "API error" }
        });
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Network error:", err);
      setFeedback({
        overall_score: 0,
        diagnostics: { intelligibility: 0, phoneme_control: 0, fluency: 0, prosody: 0 },
        feedback: { learner_message: "Network error occurred. Please check your connection.", teacher_message: err.toString() }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileInputRef = useRef(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        await analyzeSpeech(reader.result.split(',')[1], []);
      };
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedPaper.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
      setAudioUrl(null);
    } else {
      sessionStorage.removeItem('english_selectedPaper');
      sessionStorage.removeItem('english_questionIndex');
      setSelectedPaper(null);
      setCurrentQuestionIndex(0);
      setFeedback(null);
      setAudioUrl(null);
    }
  };

  if (!selectedPaper) {
    return (
      <div className="max-w-5xl mx-auto p-6 w-full text-center">
         <button onClick={onExit} className="mb-8 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors float-left">&larr; Back to Dashboard</button>
         <div className="clear-both"></div>
         <h2 className="text-4xl font-extrabold mb-4 text-slate-800 tracking-tight">Audio-Visual English Pronunciation Assessment</h2>
         <p className="text-slate-500 mb-8 max-w-2xl mx-auto">Select a test paper to practice your pronunciation with real-time AI audio and camera lip movement tracking.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {papers.map((p, i) => (
             <div key={i} onClick={() => { setSelectedPaper(p); setCurrentQuestionIndex(0); setFeedback(null); }} 
                  className="p-6 bg-white shadow-sm rounded-xl cursor-pointer hover:shadow-md hover:border-green-400 border-2 border-transparent transition-all transform hover:-translate-y-1 text-left">
               <div className="text-3xl mb-3">📄</div>
               <h3 className="font-bold text-lg text-slate-800">{p.title}</h3>
               <p className="text-sm text-slate-500 font-medium">{p.questions.length} Questions</p>
               <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1">
                 <span>START ASSESSMENT</span>
                 <span>&rarr;</span>
               </p>
             </div>
           ))}
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 w-full text-center">
      <button onClick={() => setSelectedPaper(null)} className="mb-8 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium float-left">&larr; Papers List</button>
      <div className="clear-both"></div>

      <div className="bg-white rounded-2xl shadow-sm p-8 border-t-8 border-green-500 relative">
        <div className="absolute top-4 right-6 bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
          Question {currentQuestionIndex + 1} of {selectedPaper.questions.length}
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-green-600">{selectedPaper.title}</h2>
        <p className="text-slate-500 mb-6">Look into the camera and speak the word clearly.</p>

        {/* Word Display + Live Camera Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-center">
          {/* Target Word Card */}
          <div className="py-10 px-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col justify-center items-center h-64">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Speak This Word:</span>
            <h3 className="text-5xl font-black text-slate-800 tracking-wide">"{targetText}"</h3>
            <div className="mt-4 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
              Phoneme Target: {selectedPaper.questions[currentQuestionIndex].category_name}
            </div>
          </div>

          {/* Live Camera Feed Card */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-700 h-64 flex items-center justify-center shadow-inner">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform -scale-x-100" 
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Live Lip Alignment Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-24 h-14 border-2 border-dashed border-green-400 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-green-300 tracking-wider">👄 LIP AREA</span>
              </div>
              <span className="text-[10px] text-slate-300 mt-2 bg-black/60 px-2 py-0.5 rounded">Align mouth inside box</span>
            </div>

            {isRecording && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>REC + LIP TRACKING</span>
              </div>
            )}
          </div>
        </div>

        {/* Record Buttons */}
        <div className="mb-8 flex justify-center items-center gap-6">
          <button 
            onClick={() => isRecording ? stopRecording() : startRecording()}
            disabled={isAnalyzing}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-4xl shadow-lg transition-all ${
              isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 
              isAnalyzing ? 'bg-yellow-400 text-white cursor-wait' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <div>{isRecording ? '⏹️' : isAnalyzing ? '⏳' : '🎙️'}</div>
            <span className="text-xs font-bold uppercase mt-1 tracking-wider">
              {isRecording ? 'Stop' : isAnalyzing ? 'Analyzing' : 'Speak'}
            </span>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-slate-400 font-bold mb-2">OR</span>
            <input 
              type="file" 
              accept="audio/*" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isAnalyzing || isRecording}
              className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold rounded-xl shadow-sm transition-all"
            >
              📂 Upload Audio
            </button>
          </div>
        </div>

        {/* Multimodal AI Feedback Card */}
        {feedback && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-left max-w-2xl mx-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                <span>🤖</span> AI Audio-Visual Assessment
              </h4>
              <div className="text-right">
                <div className="text-xs text-green-600 font-bold uppercase tracking-wider">Overall Score</div>
                <div className={`text-3xl font-black ${feedback.overall_score >= 80 ? 'text-green-600' : feedback.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {feedback.overall_score}/100
                </div>
              </div>
            </div>

            {audioUrl && (
              <div className="mb-6 bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Listen to Your Recording</span>
                <audio controls src={audioUrl} className="w-full h-10 outline-none"></audio>
              </div>
            )}

            {/* Visual Lip & Acoustic Diagnostics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
               <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center">
                 <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Intelligibility</div>
                 <div className="text-lg font-bold text-slate-700">{feedback.diagnostics?.intelligibility || 0}/100</div>
               </div>
               <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center">
                 <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Phoneme Control</div>
                 <div className="text-lg font-bold text-slate-700">{feedback.diagnostics?.phoneme_control || 0}/100</div>
               </div>
               <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center col-span-2 sm:col-span-1">
                 <div className="text-[10px] text-green-600 uppercase font-bold tracking-wider mb-1">👄 Lip Shape Score</div>
                 <div className="text-lg font-bold text-green-700">{feedback.diagnostics?.visual_lip_score || 90}/100</div>
               </div>
            </div>

            {/* Visual Articulatory Gesture Diagnostics */}
            {feedback.visual_diagnostics && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-6">
                <h5 className="text-xs font-bold text-green-800 mb-3 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <span>📹</span> Camera Lip-Tracking Metrics
                </h5>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500">Bilabial Lip Closure:</span>
                    <span className="font-semibold text-slate-700">{feedback.visual_diagnostics.bilabial_closure}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500">Lip Rounding Shape:</span>
                    <span className="font-semibold text-slate-700">{feedback.visual_diagnostics.lip_rounding}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500">Mouth Motion:</span>
                    <span className={`font-semibold ${feedback.visual_diagnostics.mouth_motion_detected ? 'text-green-600' : 'text-amber-600'}`}>
                      {feedback.visual_diagnostics.mouth_motion_detected ? "Active Motion" : "Low Movement"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-500">Motion Magnitude:</span>
                    <span className="font-semibold text-slate-700">{feedback.visual_diagnostics.dynamic_motion_level || "Normal"}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Message */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tutor Feedback</div>
              <p className="text-slate-800 font-medium text-base leading-relaxed">
                {feedback.feedback?.learner_message || "Assessment complete."}
              </p>
              {feedback.l1_contrast_flag && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 font-semibold flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>Detected Accent Pattern: <strong>{feedback.l1_contrast_flag}</strong></span>
                </div>
              )}
            </div>

            <div className="text-right">
              <button 
                onClick={handleNext}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition-colors"
              >
                {currentQuestionIndex < selectedPaper.questions.length - 1 ? 'Next Question \u2192' : 'Finish Test \u2713'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishModule;
