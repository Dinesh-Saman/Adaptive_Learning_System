import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const MathModule = ({ onExit }) => {
  const [sessionState, setSessionState] = useState('menu');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [finalReport, setFinalReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('mixed');
  const [difficultyAlert, setDifficultyAlert] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [activeTerm, setActiveTerm] = useState(1);
  
  const videoRef = useRef(null);
  
  // Telemetry state
  const startTimeRef = useRef(Date.now());
  const confusionScoresRef = useRef([]);
  const [currentEmotion, setCurrentEmotion] = useState('Neutral');

  const startExercise = async (exercise_id) => {
    setSelectedExercise(exercise_id);
    try {
      setSessionState('loading_models');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      
      setSessionState('requesting_camera');
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setSessionState('active');
      fetchNextQuestion({ session_reset: true, exercise_id });
    } catch (e) {
      console.error("Camera or Model Error:", e);
      setErrorMessage(e.message || String(e));
      setSessionState('error');
    }
  };

  useEffect(() => {
    return () => {
       if (videoRef.current && videoRef.current.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(t => t.stop());
       }
    };
  }, []);

  // Face Detection Loop
  useEffect(() => {
    let interval;
    let missingFrames = 0; // Track consecutive missing frames
    
    if (sessionState === 'active') {
      interval = setInterval(async () => {
        if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
          const detections = await faceapi.detectSingleFace(
            videoRef.current, 
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })
          ).withFaceExpressions();
          
          if (detections) {
            missingFrames = 0; // Reset on successful detection
            const exp = detections.expressions;
            
            // 1. Calculate overall frustration for backend telemetry (sum of negative emotions)
            const frustrationScore = (exp.angry || 0) + (exp.sad || 0) + (exp.fearful || 0) + (exp.disgusted || 0);
            confusionScoresRef.current.push(frustrationScore);
            
            // 2. Identify the dominant base emotion from face-api
            let dominantEmotion = Object.keys(exp).reduce((a, b) => exp[a] > exp[b] ? a : b);
            let maxValue = exp[dominantEmotion];
            
            // 3. Estimate complex expressions based on user requirements
            let emotionDisplay = 'Neutral 😐';
            
            if (exp.angry > 0.3 && exp.sad > 0.3) {
               emotionDisplay = 'Frustrated 😕';
            } else if (exp.angry > 0.3 && exp.surprised > 0.2) {
               emotionDisplay = 'Confused 🤔';
            } else if (exp.happy > 0.3 && exp.neutral > 0.4) {
               emotionDisplay = 'Engaged/Interested 😊';
            } else if (dominantEmotion === 'neutral' && maxValue > 0.9) {
               emotionDisplay = 'Drowsy 😴 / Neutral 😐';
            } else {
               switch(dominantEmotion) {
                  case 'happy': emotionDisplay = 'Happy 😀'; break;
                  case 'sad': emotionDisplay = 'Sad 😢'; break;
                  case 'angry': emotionDisplay = 'Angry 😠'; break;
                  case 'surprised': emotionDisplay = 'Surprised 😲'; break;
                  case 'fearful': emotionDisplay = 'Fearful 😨'; break;
                  case 'disgusted': emotionDisplay = 'Disgusted 🤢'; break;
                  case 'neutral': emotionDisplay = 'Neutral 😐'; break;
                  default: emotionDisplay = 'Neutral 😐';
               }
            }
            
            setCurrentEmotion(emotionDisplay);
          } else {
            missingFrames++;
            if (missingFrames >= 3) {
               setCurrentEmotion('Face not detected 😶');
            }
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const fetchNextQuestion = async (payload) => {
    if (payload.session_reset) {
       setQuestionHistory([]);
    }
    try {
      const response = await fetch('http://localhost:8000/api/ai/math/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: "student_123",
          ...payload
        })
      });
      const data = await response.json();
      
      if (data.session_complete) {
        setSessionState('complete');
        setFinalReport(data);
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = null;
        }
        return;
      }
      
      setCurrentQuestion(data.next_question);
      setQuestionsAsked(data.questions_asked);
      setDifficultyAlert(data.predicted_difficulty);
      setCurrentAnswer('');
      
      // Reset telemetry
      startTimeRef.current = Date.now();
      confusionScoresRef.current = [];
      
    } catch (err) {
      console.error(err);
      setErrorMessage("Backend Fetch Error: " + (err.message || String(err)));
      setSessionState('error');
    }
  };

  const checkAnswer = (user, correct) => {
    let u = user.toLowerCase().replace(/\s+/g, '');
    let c = correct.toLowerCase().replace(/\s+/g, '');
    if (u === c) return true;
    
    // Check if they only differ by english letters (e.g. units like kg, g, rs)
    let u_no_letters = u.replace(/[a-z]/g, '');
    let c_no_letters = c.replace(/[a-z]/g, '');
    if (u_no_letters !== '' && u_no_letters === c_no_letters) return true;
    
    return false;
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;
    
    const isCorrect = checkAnswer(currentAnswer, currentQuestion.answer);
    const t_main = Date.now() - startTimeRef.current;
    
    const scores = confusionScoresRef.current;
    const avgConfusion = scores.length > 0 
      ? scores.reduce((a,b) => a+b, 0) / scores.length 
      : 0.0;
      
    setQuestionHistory(prev => [...prev, {
      text: currentQuestion.text,
      userAnswer: currentAnswer.trim(),
      correctAnswer: currentQuestion.answer,
      isCorrect: isCorrect,
      timeMs: t_main,
      emotion: currentEmotion
    }]);

    const payload = {
      exercise_id: selectedExercise,
      last_type_id: currentQuestion.type_id,
      last_correct: isCorrect,
      t_main_ms: t_main,
      affect_confusion: Math.min(1.0, avgConfusion),
      accuracy: isCorrect ? 1.0 : 0.0
    };
    
    fetchNextQuestion(payload);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 w-full text-center min-h-[90vh]">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onExit}
          className="px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 rounded-2xl font-bold transition-all shadow-sm cursor-pointer"
        >
          &larr; Dashboard එකට
        </button>
        <div className={`flex items-center gap-4 bg-slate-100 p-2 rounded-xl ${sessionState === 'active' ? '' : 'hidden'}`}>
           <video 
             ref={videoRef} 
             autoPlay 
             muted 
             playsInline 
             className="w-24 h-24 object-cover rounded-lg border-2 border-slate-300 shadow-sm" 
           />
           <div className="text-left pr-4">
              <p className="text-xs font-bold text-slate-500 uppercase">Live Affect Tracking</p>
              <p className="text-lg font-bold text-blue-600">{currentEmotion}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 border-t-8 border-blue-500 relative">
        {sessionState === 'menu' && (
          <div className="py-8">
            <div className="inline-block bg-blue-100 text-blue-800 font-extrabold text-xs px-4 py-1 rounded-full mb-3 uppercase tracking-wider">
              Grade 4 • 4 ශ්‍රේණිය
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-800 font-sinhala">4 ශ්‍රේණිය — Choose your maths topic</h2>
            <p className="text-xl text-slate-500 mb-10">The AI will adapt to your face and speed while you play!</p>
            
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3].map(term => (
                <button
                  key={term}
                  onClick={() => setActiveTerm(term)}
                  className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${
                    activeTerm === term 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Term {term}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
              {[
                { id: 'chapter_1', title: '1. Numbers - 1', term: 1 },
                { id: 'chapter_2', title: '2. Addition - 1', term: 1 },
                { id: 'chapter_3', title: '3. Length - 1', term: 1 },
                { id: 'chapter_4', title: '4. Subtraction - 1', term: 1 },
                { id: 'chapter_5', title: '5. Patterns', term: 1 },
                { id: 'chapter_6', title: '6. Multiplication - 1', term: 1 },
                { id: 'chapter_7', title: '7. Fractions', term: 1 },
                { id: 'chapter_8', title: '8. Solids/Shapes', term: 1 },
                { id: 'chapter_9', title: '9. Numbers - 2', term: 1 },
                { id: 'chapter_10', title: '10. Graphs - 1', term: 1 },
                { id: 'chapter_11', title: '11. Division - 1', term: 1 },
                { id: 'chapter_12', title: '12. Revision', term: 1 },

                { id: 'chapter_13', title: '13. Volume - 1', term: 2 },
                { id: 'chapter_14', title: '14. Weight - 1', term: 2 },
                { id: 'chapter_15', title: '15. Directions', term: 2 },
                { id: 'chapter_16', title: '16. Addition - 2', term: 2 },
                { id: 'chapter_17', title: '17. Time - 1', term: 2 },
                { id: 'chapter_18', title: '18. Subtraction - 2', term: 2 },
                { id: 'chapter_19', title: '19. Money - 1', term: 2 },
                { id: 'chapter_20', title: '20. Multiplication - 2', term: 2 },
                { id: 'chapter_21', title: '21. Length - 2', term: 2 },
                { id: 'chapter_22', title: '22. Time - 2', term: 2 },
                { id: 'chapter_23', title: '23. Division - 2', term: 2 },
                { id: 'chapter_24', title: '24. Revision', term: 2 },

                { id: 'chapter_25', title: '25. Numbers - 3', term: 3 },
                { id: 'chapter_26', title: '26. Addition - 3', term: 3 },
                { id: 'chapter_27', title: '27. Weight - 2', term: 3 },
                { id: 'chapter_28', title: '28. Subtraction - 3', term: 3 },
                { id: 'chapter_29', title: '29. Volume - 2', term: 3 },
                { id: 'chapter_30', title: '30. Multiplication - 3', term: 3 },
                { id: 'chapter_31', title: '31. Division - 3', term: 3 },
                { id: 'chapter_32', title: '32. Roman Numerals', term: 3 },
                { id: 'chapter_33', title: '33. Graphs - 2', term: 3 },
                { id: 'chapter_34', title: '34. Money - 2', term: 3 },
                { id: 'chapter_35', title: '35. Shapes & Space', term: 3 },
                { id: 'chapter_36', title: '36. Revision', term: 3 }
              ].filter(ch => ch.term === activeTerm).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => startExercise(ch.id)}
                  className="bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 p-4 rounded-xl transition-all shadow-sm flex flex-col items-start hover:-translate-y-1 group"
                >
                  <h3 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-blue-700">{ch.title}</h3>
                  <div className="mt-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">20 Questions</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {sessionState !== 'menu' && sessionState !== 'complete' && (
           <>
            <h2 className="text-3xl font-bold mb-2 text-blue-600">Grade 4 Math Diagnostic Assessment</h2>
            <p className="text-slate-500 mb-8">4 ශ්‍රේණිය • Vision-Driven Telemetry Engine</p>
           </>
        )}

        {sessionState === 'loading_models' && (
          <div className="py-20 text-slate-500 font-medium">Downloading AI Models (Face API)...</div>
        )}
        
        {sessionState === 'requesting_camera' && (
          <div className="py-20 text-slate-500 font-medium">Please allow camera access to start the diagnostic session.</div>
        )}
        
        {sessionState === 'error' && (
          <div className="py-20 text-red-500 font-medium">
            <p className="text-xl font-bold mb-2">Error connecting to camera or backend.</p>
            <p className="text-sm bg-red-50 text-red-800 p-4 rounded-lg inline-block text-left break-all max-w-2xl mx-auto border border-red-200">
               {errorMessage || "Unknown error occurred."}
            </p>
            <p className="mt-6 text-sm text-slate-500">
               Check if the Python backend is running on port 8000.<br/>
               Ensure you granted Camera permissions.<br/>
               Check browser console for more details.
            </p>
          </div>
        )}

        {sessionState === 'complete' && finalReport?.analytical_summary && (
          <div className="py-8">
            <h3 className="text-4xl font-bold text-slate-800 mb-2">Analytical Summary 📊</h3>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">{finalReport.analytical_summary.text_summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
               <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌟</span>
                    <h4 className="font-bold text-green-800 text-xl">Top Strengths</h4>
                  </div>
                  <ul className="list-disc pl-5 text-green-700 font-medium">
                     {finalReport.analytical_summary.strongest_topics.length > 0 
                        ? finalReport.analytical_summary.strongest_topics.map(s => <li key={s}>{s.replace('G4_', '').replace('_', ' ')}</li>)
                        : <li>Keep practicing to build your strengths!</li>}
                  </ul>
               </div>
               
               <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎯</span>
                    <h4 className="font-bold text-red-800 text-xl">Focus Areas</h4>
                  </div>
                  <ul className="list-disc pl-5 text-red-700 font-medium">
                     {finalReport.analytical_summary.weakest_topics.length > 0 
                        ? finalReport.analytical_summary.weakest_topics.map(w => <li key={w}>{w.replace('G4_', '').replace('_', ' ')}</li>)
                        : <li>Great job, no major weaknesses!</li>}
                  </ul>
               </div>

               <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">⏱️</span>
                    <h4 className="font-bold text-blue-800 text-xl">Time Analysis</h4>
                  </div>
                  <p className="text-blue-700 font-medium">
                    {finalReport.analytical_summary.time_sink_topic 
                      ? `You spent the most time thinking about ${finalReport.analytical_summary.time_sink_topic.replace('G4_', '').replace('_', ' ')}.` 
                      : "You answered at a consistent pace."}
                  </p>
               </div>

               <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🧠</span>
                    <h4 className="font-bold text-purple-800 text-xl">Emotional Insight</h4>
                  </div>
                  <p className="text-purple-700 font-medium">
                    {finalReport.analytical_summary.frustrating_topic 
                      ? `Our camera noticed some frustration during ${finalReport.analytical_summary.frustrating_topic.replace('G4_', '').replace('_', ' ')}. Don't give up!` 
                      : "You stayed calm and engaged throughout the session!"}
                  </p>
               </div>
            </div>
            
            <div className="mt-10">
              <div className="inline-block p-6 bg-slate-800 rounded-3xl text-white shadow-lg">
                 <p className="text-sm uppercase tracking-widest text-slate-400 mb-1">Overall Accuracy</p>
                 <p className="text-5xl font-bold">{finalReport.analytical_summary.overall_accuracy}%</p>
              </div>
            </div>

            <h4 className="text-2xl font-bold text-slate-800 mt-12 mb-6 text-left max-w-4xl mx-auto">Detailed Question History</h4>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full text-left bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="p-4 border-b">#</th>
                    <th className="p-4 border-b">Question</th>
                    <th className="p-4 border-b">Your Answer</th>
                    <th className="p-4 border-b">Correct Answer</th>
                    <th className="p-4 border-b">Time Taken</th>
                    <th className="p-4 border-b">Emotion</th>
                  </tr>
                </thead>
                <tbody>
                  {questionHistory.map((q, idx) => (
                    <tr key={idx} className={`border-b ${q.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                      <td className="p-4 text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-4 font-medium text-slate-800">{q.text}</td>
                      <td className="p-4">
                        <span className="font-bold">{q.userAnswer}</span>
                        <span className="ml-2">{q.isCorrect ? '✅' : '❌'}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-600">{q.correctAnswer}</td>
                      <td className="p-4 text-slate-600 font-medium">{(q.timeMs / 1000).toFixed(1)}s</td>
                      <td className="p-4">{q.emotion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {sessionState === 'active' && currentQuestion && (
          <>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
               <div className="text-left">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Diagnostic Progress</p>
                  <p className="text-xl font-bold text-slate-800">Question {questionsAsked} of 10</p>
               </div>
               <div className="text-right">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Target Skill</p>
                  <p className="text-xl font-bold text-indigo-600">{currentQuestion.type_id}</p>
               </div>
            </div>

            {difficultyAlert && (
              <div className="mb-6 p-4 rounded-xl font-bold text-lg animate-pulse shadow-sm border-2 border-indigo-200 bg-indigo-50 text-indigo-800">
                {difficultyAlert}
              </div>
            )}

            <div className="py-12 px-6 border-2 border-dashed border-slate-300 rounded-xl mb-8 bg-slate-50">
              
              {currentQuestion.chart_data && currentQuestion.chart_data.type === 'bar' && (
                <div className="flex flex-col items-center mb-12 mt-4">
                  {currentQuestion.chart_data.title && (
                    <h4 className="text-2xl font-black text-slate-700 mb-6 uppercase tracking-wider">{currentQuestion.chart_data.title}</h4>
                  )}
                  <div className="relative flex items-end h-72 border-l-2 border-b-2 border-slate-800 px-8 gap-10 mt-2">
                    {/* Horizontal Grid Lines & Y-axis labels */}
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between z-0">
                      {[1, 0.8, 0.6, 0.4, 0.2, 0].map(multiplier => (
                        <div key={multiplier} className="flex items-center w-full relative h-0">
                           {/* Label */}
                           <span className="absolute -left-14 text-sm font-bold text-slate-600 w-10 text-right -mt-3">
                             {Math.round(currentQuestion.chart_data.y_max * multiplier)}
                           </span>
                           {/* Dotted Line */}
                           {multiplier !== 0 && (
                             <div className="w-full border-b-2 border-dotted border-slate-300"></div>
                           )}
                        </div>
                      ))}
                    </div>

                    {/* Bars */}
                    {currentQuestion.chart_data.values.map((val, idx) => {
                      const heightPct = (val / currentQuestion.chart_data.y_max) * 100;
                      let colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-400', 'bg-orange-500'];
                      
                      if (currentQuestion.chart_data.title === "Weekly Event Ticket Sales") {
                          colors = ['bg-indigo-600', 'bg-indigo-500', 'bg-indigo-400', 'bg-indigo-300', 'bg-indigo-700'];
                      } else if (currentQuestion.chart_data.title === "Monthly Magazine Printing Volumes") {
                          colors = ['bg-pink-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-rose-500'];
                      }
                      
                      return (
                        <div key={idx} className="flex flex-col justify-end items-center relative group h-full z-10">
                           {/* Hover tooltip for accessibility/learning */}
                           <div className="absolute -top-8 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             {val}
                           </div>
                           <div 
                             className={`w-16 ${colors[idx % colors.length]} rounded-t-sm shadow-sm`}
                             style={{ height: `${heightPct}%` }}
                           ></div>
                           <span className="absolute -bottom-8 text-sm font-bold text-slate-700">{currentQuestion.chart_data.labels[idx]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <h3 className="text-4xl font-bold text-slate-800 max-w-2xl mx-auto mb-8 whitespace-pre-wrap">
                {currentQuestion.text}
              </h3>
              
              <div className="max-w-md mx-auto relative">
                {(currentQuestion.q_format === 'mcq' || currentQuestion.q_format === 'boolean') ? (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {currentQuestion.options?.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setCurrentAnswer(opt)}
                        className={`p-4 rounded-xl border-2 font-bold text-xl transition-all ${
                          currentAnswer === opt 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-white border-slate-300 text-slate-700 hover:border-blue-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 text-center text-2xl font-bold rounded-xl border-2 border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 mb-6 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                )}
                
                <button 
                  onClick={handleSubmit}
                  disabled={!currentAnswer}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] text-lg"
                >
                  Submit Answer
                </button>
              </div>
            </div>
            
            {/* Sinhala Audio/Visual Scaffolding */}
            {currentQuestion.hint_sinhala && (
               <p className="text-slate-500 font-medium">💡 උපදෙස්: {currentQuestion.hint_sinhala}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MathModule;
