import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  Compass,
  ArrowRight,
  Database
} from 'lucide-react';
import StudentAnalyticsOverview from '../components/analytics/StudentAnalyticsOverview';
import { fetchStudentsAnalyticsFromApi } from '../data/studentAnalyticsData';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'teacher') {
      navigate('/login');
      return;
    }

    const name = localStorage.getItem('studentName') || 'Teacher';
    setTeacherName(name);

    fetchStudentsAnalyticsFromApi()
      .then(data => {
        if (data && Array.isArray(data)) {
          setStudents(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const classAverage = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.overallAverage || 0), 0) / students.length) 
    : 0;
  const totalExercisesClass = students.reduce((acc, s) => acc + (s.totalExercises || 0), 0);

  return (
    <div className="flex-grow bg-slate-50 w-full py-10 min-h-screen text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Teacher Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-md">
              🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Teacher & Parent Analytical Portal</h1>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-0.5 rounded-full flex items-center gap-1">
                  <Database className="w-3 h-3 text-indigo-600" /> MongoDB Synced
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">
                Logged in as <strong>{teacherName}</strong> • Class Monitoring & Multimodal Learning Diagnostics
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold text-red-600 hover:text-white hover:bg-red-500 bg-red-50 border border-red-200 px-5 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Class Overview Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
              👥
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Enrolled Students</p>
              <h3 className="text-2xl font-black text-slate-900">{students.length} Active</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              📈
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Class Mastery Avg</p>
              <h3 className="text-2xl font-black text-emerald-700">{classAverage}%</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
              ✅
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Total Completed Tests</p>
              <h3 className="text-2xl font-black text-purple-700">{totalExercisesClass}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
              🎯
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Primary Learning Pillars</p>
              <h3 className="text-2xl font-black text-amber-700">4 Active Hubs</h3>
            </div>
          </div>
        </div>

        {/* Student Analytical Workspace */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" /> ශිෂ්‍ය තනි පුද්ගල ප්‍රගති විශ්ලේෂණය (Real Student Diagnostics)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time performance records, radar balance, and category scores loaded directly from MongoDB.
              </p>
            </div>
          </div>

          {/* Render Full Student Analytics Overview in Teacher Mode */}
          <StudentAnalyticsOverview isTeacherView={true} />
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
