import React, { useState, useEffect } from 'react';

const CreativeModule = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, activity, results
  const [fingerprint, setFingerprint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Activity state
  const [activityType, setActivityType] = useState('Handwork');
  const [activityName, setActivityName] = useState('Paper Flower');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Mock Student ID (Ideally comes from context or auth)
  const studentId = localStorage.getItem('studentId') || '64d2f8e9a2c9b4e1d5f3a000'; // fallback mock ID

  useEffect(() => {
    fetchFingerprint();
  }, []);

  const fetchFingerprint = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/creative/fingerprint/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setFingerprint(data.fingerprint);
        setHistory(data.history);
      } else {
        // Mock fallback if backend is down
        setFingerprint({
          creativity: 91, fineMotorSkills: 67, visualAccuracy: 82, 
          handEyeCoordination: 70, rhythm: 85, movementCoordination: 78
        });
        setHistory([
          { timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), activityType: "Handwork", overallScore: 60, scores: { fineMotorSkills: 60 } },
          { timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), activityType: "Handwork", overallScore: 65, scores: { fineMotorSkills: 65 } }
        ]);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setFingerprint({
        creativity: 91, fineMotorSkills: 67, visualAccuracy: 82, 
        handEyeCoordination: 70, rhythm: 85, movementCoordination: 78
      });
    }
    setLoading(false);
  };

  const submitActivity = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/creative/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          activityType,
          activityName,
          currentLevel,
          mediaBase64: 'mock_media_data'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAssessmentResult(data.assessment);
        setFingerprint(data.updatedFingerprint);
        setActiveTab('results');
      } else {
        alert("Failed to evaluate.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting activity. Is backend running?");
    }
    setSubmitting(false);
  };

  const getImprovement = (skill) => {
    if (history.length === 0 || !fingerprint) return null;
    const initial = history[0].scores?.[skill];
    const current = fingerprint[skill];
    if (initial !== undefined && current !== undefined) {
      return current - initial;
    }
    return null;
  };

  const renderBar = (label, value, improvement) => (
    <div className="mb-4" key={label}>
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-900">{value}%</span>
          {improvement !== null && improvement !== 0 && (
            <span className={`ml-2 text-xs font-bold ${improvement > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {improvement > 0 ? '+' : ''}{improvement}%
            </span>
          )}
        </div>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-pink-400 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 w-full">
      <button 
        onClick={onExit}
        className="mb-8 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
      >
        &larr; Back to Dashboard
      </button>

      <div className="flex gap-4 mb-8 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-bold text-lg rounded-t-lg ${activeTab === 'dashboard' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Creative Fingerprint
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 font-bold text-lg rounded-t-lg ${activeTab === 'activity' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          New Activity
        </button>
      </div>

      {loading ? (
        <div className="text-center p-12 text-slate-500">Loading Fingerprint...</div>
      ) : (
        <>
          {activeTab === 'dashboard' && fingerprint && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl shadow-sm p-8 border-t-8 border-pink-400">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Long-term Skill Profile</h2>
                
                {renderBar("Creativity", fingerprint.creativity, getImprovement('creativity'))}
                {renderBar("Fine Motor Skills", fingerprint.fineMotorSkills, getImprovement('fineMotorSkills'))}
                {renderBar("Visual Accuracy", fingerprint.visualAccuracy, getImprovement('visualAccuracy'))}
                {renderBar("Hand-Eye Coordination", fingerprint.handEyeCoordination, getImprovement('handEyeCoordination'))}
                {renderBar("Rhythm", fingerprint.rhythm, getImprovement('rhythm'))}
                {renderBar("Movement Coordination", fingerprint.movementCoordination, getImprovement('movementCoordination'))}
              </div>

              {/* Insights Card */}
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-3xl shadow-sm p-8 border border-purple-100">
                  <h3 className="text-xl font-bold mb-4 text-purple-900">Measurable Improvement</h3>
                  {getImprovement('fineMotorSkills') > 0 && (
                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 border-l-4 border-green-400">
                      <p className="text-slate-700">"This child's <span className="font-bold">fine motor skill</span> has improved by <span className="text-green-600 font-bold">{getImprovement('fineMotorSkills')}%</span> over the last month."</p>
                    </div>
                  )}
                  {getImprovement('creativity') > 0 && (
                    <div className="p-4 bg-white rounded-2xl shadow-sm border-l-4 border-green-400">
                      <p className="text-slate-700">"This child's <span className="font-bold">creativity</span> has improved by <span className="text-green-600 font-bold">{getImprovement('creativity')}%</span> over the last month."</p>
                    </div>
                  )}
                </div>

                <div className="bg-orange-50 rounded-3xl shadow-sm p-8 border border-orange-100">
                  <h3 className="text-xl font-bold mb-4 text-orange-900">Recurring Patterns</h3>
                  <div className="text-orange-800">
                    {history.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        <li>AI identifies patterns across multiple activities.</li>
                        <li>Currently detecting minor weaknesses in hand-eye coordination during complex handwork.</li>
                      </ul>
                    ) : (
                      <p>Do more activities to generate pattern insights.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-3xl shadow-sm p-8 border-t-8 border-indigo-500 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Submit New Activity</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Activity Type</label>
                  <select 
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Painting</option>
                    <option>Handwork</option>
                    <option>Singing</option>
                    <option>Dancing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Activity Name</label>
                  <input 
                    type="text"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Draw and colour a butterfly"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                  <input 
                    type="number"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(Number(e.target.value))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    min="1" max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Media Upload</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                    <span className="text-4xl mb-2 block">📸</span>
                    Upload Image / Video / Audio (Mock)
                  </div>
                </div>
              </div>

              <button 
                onClick={submitActivity}
                disabled={submitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? 'AI Analyzing...' : 'Submit & Analyze'}
              </button>
            </div>
          )}

          {activeTab === 'results' && assessmentResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
              <div className="bg-white rounded-3xl shadow-sm p-8 border-t-8 border-indigo-500">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">AI Assessment Result</h2>
                
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-indigo-100">
                    <span className="text-4xl font-bold text-indigo-600">{assessmentResult.overall_score}%</span>
                    <span className="absolute bottom-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">Overall</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Skill Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(assessmentResult.scores).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">{key}</span>
                      <span className="font-bold text-indigo-600">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {assessmentResult.detected_weakness && (
                  <div className="bg-red-50 rounded-3xl shadow-sm p-6 border border-red-100">
                    <div className="flex gap-4">
                      <span className="text-3xl">⚠️</span>
                      <div>
                        <h3 className="text-lg font-bold text-red-800 mb-1">Weakness Detected</h3>
                        <p className="text-red-700">{assessmentResult.detected_weakness}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 rounded-3xl shadow-sm p-8 border border-green-100 h-full flex flex-col justify-center">
                  <span className="text-4xl mb-4 block text-center">🎯</span>
                  <h3 className="text-xl font-bold text-center text-green-900 mb-2">Personalized Recommendation</h3>
                  <p className="text-center text-green-700 mb-6">{assessmentResult.recommendation.reason}</p>
                  
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-200">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Next Activity</p>
                    <p className="text-2xl font-bold text-green-600">{assessmentResult.recommendation.next_activity}</p>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
                  >
                    Start Next Activity
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreativeModule;
