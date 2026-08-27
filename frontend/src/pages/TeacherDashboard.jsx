import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'teacher') {
      navigate('/login');
      return;
    }

    const name = localStorage.getItem('studentName') || 'Teacher';
    setTeacherName(name);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex-grow bg-slate-50 w-full py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div>
              <h1 className="text-3xl font-black text-indigo-600 mb-1">Teacher Administration Portal</h1>
              <p className="text-slate-500 text-sm">Welcome back, {teacherName}!</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm font-bold text-red-600 hover:text-white hover:bg-red-500 bg-red-50 border border-red-200 px-5 py-2.5 rounded-2xl transition-all shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-5xl">
            🏫
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Teacher Dashboard Workspace</h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            This space is reserved for analytical progress reports, learning configuration engines, student response sheets, and activity customisation controls.
          </p>
          <div className="inline-block px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-2xl text-sm border border-indigo-100">
            ⚙️ Modules & reports configuration coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
