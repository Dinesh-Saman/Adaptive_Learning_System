import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('Grade 3');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
    const body = isRegistering ? { name, password, grade } : { name, password };

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

      // Save token and student data
      localStorage.setItem('token', data.token);
      localStorage.setItem('studentName', data.name);
      if (data.masteryLevels) {
        localStorage.setItem('masteryLevels', JSON.stringify(data.masteryLevels));
      } else {
         // Default if newly registered
         localStorage.setItem('masteryLevels', JSON.stringify({
            math: 0.5, english: 0.5, sinhala: 0.5, motorSkills: 0.5
         }));
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BrainCircuit className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            {isRegistering ? 'Create Account' : 'Student Login'}
          </h2>
          <p className="mt-2 text-indigo-200">
            {isRegistering ? 'Begin your adaptive learning journey.' : 'Welcome back to your personalized learning journey.'}
          </p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Student Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {isRegistering && (
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-2">
                  Grade Level
                </label>
                <select
                  id="grade"
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-300 bg-white text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md hover:shadow-lg"
              >
                {isRegistering ? 'Register' : 'Access Dashboard'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isRegistering ? 'Already have an account? Login here' : 'Need an account? Register here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
