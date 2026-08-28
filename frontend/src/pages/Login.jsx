import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, GraduationCap, ShieldAlert } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentName');
    localStorage.removeItem('role');
    localStorage.removeItem('masteryLevels');
  }, []);
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot-password'
  
  // Inputs
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('Pre School');
  
  // Forgot Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (mode === 'forgot-password') {
      if (newPassword !== confirmNewPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, role, newPassword })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to reset password');
        }

        setSuccessMessage(data.message || 'Password reset successful!');
        setMode('login');
        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } catch (err) {
        setError(err.message);
      }
      return;
    }

    const endpoint = mode === 'register' ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
    const body = mode === 'register' 
      ? { name, password, grade, role } 
      : { name, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (mode === 'register') {
        setSuccessMessage('Registration successful! Please login with your credentials.');
        setMode('login');
        setPassword('');
        return;
      }

      // Save token and info
      localStorage.setItem('token', data.token);
      localStorage.setItem('studentName', data.name);
      localStorage.setItem('role', data.role || role);
      if (data.userId || data.studentId) {
        localStorage.setItem('studentId', data.userId || data.studentId);
      }
      if (data.grade) {
        localStorage.setItem('studentGrade', data.grade);
      }
      
      if (data.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        if (data.masteryLevels) {
          localStorage.setItem('masteryLevels', JSON.stringify(data.masteryLevels));
        } else {
          localStorage.setItem('masteryLevels', JSON.stringify({
            math: 0.5, english: 0.5, sinhala: 0.5, motorSkills: 0.5
          }));
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setMode('login');
    setError('');
    setSuccessMessage('');
    setName('');
    setPassword('');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans"
      style={{
        backgroundImage: "url('/images/login_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-5xl w-full bg-[#E5F2C7]/95 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-[#C1DF7C]/80 backdrop-blur-sm min-h-[600px]">
        
        {/* Left Side: Classroom or Playground Image */}
        <div className="flex-1 relative min-h-[350px] md:min-h-full overflow-hidden">
          <img 
            src={mode === 'register' ? '/images/playground.png' : '/images/classroom.jpg'} 
            alt="Kids playing and learning" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Tint overlay matching the kids app theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A6B1A]/85 via-[#4A6B1A]/30 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-3xl font-black text-white drop-shadow-md font-sinhala">LearnAI ගවේෂකයෝ!</h3>
            <p className="text-white font-bold text-sm mt-1 drop-shadow-md max-w-sm">
              Play, Learn and Grow with Interactive Modules tailored for you.
            </p>
          </div>
        </div>

        {/* Right Side: Signin/Signup Form Panel */}
        <div className="flex-grow flex-1 p-8 md:p-12 flex flex-col justify-center bg-[#F3F9E7]">
          
          {/* Role Portal Tabs */}
          <div className="flex bg-[#E0EDB8] p-1.5 rounded-2xl mb-8 max-w-sm mx-auto w-full border border-[#C1DF7C]">
            <button
              onClick={() => handleRoleChange('student')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                role === 'student'
                  ? 'bg-[#FF8138] text-white shadow-md'
                  : 'text-[#4A6B1A] hover:bg-[#D4E7A2]/50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Student Portal
            </button>
            <button
              onClick={() => handleRoleChange('teacher')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                role === 'teacher'
                  ? 'bg-[#4A6B1A] text-white shadow-md'
                  : 'text-[#4A6B1A] hover:bg-[#D4E7A2]/50'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Teacher Portal
            </button>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#442312] tracking-tight">
              {mode === 'forgot-password' ? 'Reset Password' : mode === 'register' ? 'Create Account!' : 'Welcome Explorer!'}
            </h2>
            <p className="text-[#65554D] text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              {mode === 'forgot-password' 
                ? 'Enter your name and role to reset your account password.' 
                : mode === 'register' 
                  ? 'Sign up now to begin your exciting learning journey.' 
                  : 'Log in now to continue your exciting journey and unlock new adventures!'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2 max-w-md mx-auto w-full animate-bounce">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs text-center font-bold max-w-md mx-auto w-full">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5 max-w-md mx-auto w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#442312] mb-1.5 uppercase tracking-wider">
                {role === 'teacher' ? 'Teacher Username / Name' : 'First Name / Nickname'}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3.5 bg-white border border-[#D5E6AF] rounded-2xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#FF8138]/50 focus:border-[#FF8138] transition-all text-sm shadow-sm"
                placeholder={role === 'teacher' ? 'Input Username' : 'Enter your name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Student Grade Level (Registration only) */}
            {mode === 'register' && role === 'student' && (
              <div>
                <label className="block text-xs font-bold text-[#442312] mb-1.5 uppercase tracking-wider">
                  Grade Level
                </label>
                <select
                  className="w-full px-4 py-3.5 bg-white border border-[#D5E6AF] rounded-2xl text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#FF8138]/50 focus:border-[#FF8138] transition-all text-sm shadow-sm appearance-none"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="Pre School">Pre School</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                </select>
              </div>
            )}

            {/* Password input */}
            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-xs font-bold text-[#442312] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[#D5E6AF] rounded-2xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#FF8138]/50 focus:border-[#FF8138] transition-all text-sm shadow-sm pr-12"
                    placeholder="Input your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot password specific inputs */}
            {mode === 'forgot-password' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#442312] mb-1.5 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[#D5E6AF] rounded-2xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#FF8138]/50 focus:border-[#FF8138] transition-all text-sm shadow-sm"
                    placeholder="Input new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#442312] mb-1.5 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-[#D5E6AF] rounded-2xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#FF8138]/50 focus:border-[#FF8138] transition-all text-sm shadow-sm"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Forgot password link */}
            {mode === 'login' && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => { setMode('forgot-password'); setError(''); }}
                  className="text-xs font-bold text-[#FF8138] hover:text-[#e06b25] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-4 px-6 text-white font-bold rounded-2xl text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg ${
                  role === 'teacher'
                    ? 'bg-[#4A6B1A] hover:bg-[#3d5915]'
                    : 'bg-[#FF8138] hover:bg-[#e06b25]'
                }`}
              >
                {mode === 'forgot-password' ? 'Reset Password' : mode === 'register' ? 'Create Account' : 'Access Dashboard'}
              </button>
            </div>
          </form>

          {/* Bottom toggle between Login / Register */}
          <div className="mt-8 text-center space-y-4">
            {mode !== 'login' ? (
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="text-xs font-bold text-[#4A6B1A] hover:underline"
              >
                Already have an account? <span className="font-extrabold text-[#FF8138]">Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className="text-xs font-bold text-[#4A6B1A] hover:underline"
              >
                Need an account? <span className="font-extrabold text-[#FF8138]">Register here</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
