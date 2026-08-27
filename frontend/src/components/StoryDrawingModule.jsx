import React, { useState, useRef } from 'react';
import { STORIES } from '../data/stories';


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

  React.useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
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
          studentId: localStorage.getItem('studentName') || "student",
          imageBase64: selectedImage,
          expectedElements: expectedElements
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setEvaluationResult(data);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <button 
            onClick={handleBack}
            className="text-sm font-bold text-orange-700 hover:text-white hover:bg-orange-600 bg-orange-50 border border-orange-200 px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 shadow-sm"
          >
            <span>⬅</span> Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-800 mb-1 font-sinhala">කතන්දර චිත්‍ර (Story Drawing)</h1>
            <p className="text-slate-500 font-medium text-sm">Read the story and draw what you imagine!</p>
          </div>
          <div className="w-24"></div>
        </header>

        {/* If no story is selected, show the story list */}
          {!activeStory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {STORIES.map(story => (
                <div 
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-orange-300 hover:shadow-lg cursor-pointer transition-all transform hover:-translate-y-1 flex flex-col items-center text-center group"
                >
                  {story.image ? (
                    <div className="w-full h-52 mb-5 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm flex items-center justify-center">
                      <img 
                        src={story.image} 
                        alt={story.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-52 mb-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-100 flex items-center justify-center text-6xl shadow-inner">
                      {story.emoji}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-slate-800 font-sinhala mb-2">{story.title}</h3>
                  <p className="text-slate-500 font-medium">{story.englishTitle}</p>
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
                  <button 
                    onClick={() => { setActiveStory(null); setSelectedImage(null); setEvaluationResult(null); }}
                    className="text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-4 py-2 rounded-xl transition-all"
                  >
                    Change Story
                  </button>
                </div>
                
                <div className="prose text-slate-700 font-sinhala leading-relaxed flex-grow overflow-y-auto pr-2 max-h-[50vh] custom-scrollbar">
                  {activeStory.paragraphs.map((p, idx) => (
                    <p key={idx} className="mb-3 text-[1.1rem]">{p}</p>
                  ))}
                  
                  <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-orange-800 mb-1">ආදර්ශය:</h4>
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
                  {isEvaluating ? 'AI is looking at your drawing...' : 'ඇගයීම ආරම්භ කරන්න (Evaluate)'}
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
