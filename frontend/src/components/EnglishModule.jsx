import React, { useState, useRef } from 'react';

// Helper to convert AudioBuffer to WAV format
const audioBufferToWav = (buffer) => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };
  const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
  const writeString = (s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(pos++, s.charCodeAt(i));
  };

  writeString('RIFF');
  setUint32(length - 8);
  writeString('WAVE');
  writeString('fmt ');
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  writeString('data');
  setUint32(length - pos - 4);

  for (i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }
  return new Blob([bufferArray], { type: 'audio/wav' });
};


const EnglishModule = ({ onExit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const targetText = "The quick brown fox jumps over the lazy dog"; // Changed from "This is a cat."

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          // Decode webm to AudioBuffer and convert to WAV Blob
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const wavBlob = audioBufferToWav(audioBuffer);

          const reader = new FileReader();
          reader.readAsDataURL(wavBlob);
          reader.onloadend = async () => {
            const base64AudioMessage = reader.result.split(',')[1];
            await analyzeSpeech(base64AudioMessage);
          };
        } catch (e) {
          console.error("Audio conversion failed", e);
          analyzeSpeech("dummy_base64_audio");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setFeedback(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // Fallback to mock behavior if mic fails (useful for local dev without https)
      setIsRecording(true);
      setFeedback(null);
      setTimeout(() => {
        stopRecording();
      }, 3000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    } else {
      // Fallback
      analyzeSpeech("dummy_base64_audio");
    }
    setIsRecording(false);
  };

  const analyzeSpeech = async (base64Audio) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/english/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: "student_123",
          audioBase64: base64Audio,
          targetText: targetText
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      } else {
        console.error("Failed to analyze speech");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
    setIsAnalyzing(false);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 w-full text-center">
      <button 
        onClick={onExit}
        className="mb-8 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors float-left"
      >
        &larr; Back to Dashboard
      </button>
      <div className="clear-both"></div>

      <div className="bg-white rounded-2xl shadow-sm p-8 border-t-8 border-green-500">
        <h2 className="text-3xl font-bold mb-2 text-green-600">English Speech</h2>
        <p className="text-slate-500 mb-6">Pronunciation & Fluency Assessment</p>

        <div className="py-12 px-6 border-2 border-dashed border-slate-300 rounded-xl mb-8 bg-slate-50">
          <p className="text-lg text-slate-500 uppercase font-semibold tracking-wider mb-4">Please Read Aloud:</p>
          <h3 className="text-4xl font-bold text-slate-800 tracking-wide">"{targetText}"</h3>
        </div>

        {/* Microphone Button */}
        <div className="mb-8 flex justify-center">
          <button 
            onClick={handleToggleRecord}
            disabled={isAnalyzing}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-red-200' 
                : isAnalyzing
                ? 'bg-yellow-400 text-white cursor-wait'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {isRecording ? '⏹️' : isAnalyzing ? '⏳' : '🎙️'}
          </button>
        </div>

        {/* AI Feedback Area */}
        {feedback && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-left max-w-2xl mx-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                <span>🤖</span> AI Assessment Result
              </h4>
              <div className="text-right">
                <div className="text-sm text-green-600 font-bold uppercase tracking-wider">Overall Score</div>
                <div className={`text-3xl font-black ${feedback.overall_score >= 80 ? 'text-green-600' : feedback.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {feedback.overall_score}/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
                 <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Intelligibility</div>
                 <div className="text-xl font-bold text-slate-700">{feedback.diagnostics.intelligibility}/100</div>
               </div>
               <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
                 <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Phoneme Control</div>
                 <div className="text-xl font-bold text-slate-700">{feedback.diagnostics.phoneme_control}/100</div>
               </div>
               <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
                 <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Fluency</div>
                 <div className="text-xl font-bold text-slate-700">{feedback.diagnostics.fluency}/100</div>
               </div>
               <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
                 <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Prosody</div>
                 <div className="text-xl font-bold text-slate-700">{feedback.diagnostics.prosody}/100</div>
               </div>
            </div>

            {feedback.l1_contrast_flag && (
              <div className="mb-6 p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                <div className="font-bold text-yellow-800 flex justify-between">
                    <span>⚠️ L1 Transfer Detected</span>
                    <span className="text-sm font-normal">Expected: <b>{feedback.expected_phoneme}</b> | Detected: <b>{feedback.detected_phoneme}</b></span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h5 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Tutor Feedback</h5>
                <p className="text-slate-800 font-medium text-lg">{feedback.feedback.learner_message}</p>
              </div>
              
              <div className="p-4 bg-slate-100 rounded-lg shadow-sm border border-slate-200">
                 <h5 className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Teacher Note</h5>
                 <p className="text-slate-600 font-mono text-sm">{feedback.feedback.teacher_message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishModule;
