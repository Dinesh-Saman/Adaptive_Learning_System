import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Info, 
  Grid, 
  Mail, 
  Menu, 
  X, 
  LogIn, 
  LogOut,
  LayoutDashboard,
  User,
  Sparkles
} from 'lucide-react';
import { getItem, clearSession } from '../../utils/storage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Services', path: '/services', icon: Grid },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;
  const token = getItem('token');
  const role = getItem('role');
  const studentName = getItem('studentName') || getItem('userName') || getItem('name') || (role === 'teacher' ? 'Teacher' : 'Student');
  const studentGrade = getItem('studentGrade');
  const studentMedium = getItem('studentMedium');

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const formatGradeLabel = (g, r) => {
    if (r === 'teacher') return 'Teacher';
    if (!g) return 'Student';
    const low = String(g).trim().toLowerCase();
    if (low.includes('pre')) return 'Pre-School';
    if (low.startsWith('grade')) return g.trim();
    return `Grade ${g.trim()}`;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="නැණ පියස (Nana Piyasa)" 
                  className="h-12 w-auto object-contain rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-300 border border-slate-100" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-slate-900 tracking-tight font-sinhala leading-tight group-hover:text-indigo-600 transition-colors">
                  නැණ පියස
                </span>
                <div className="inline-flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-indigo-700 font-black bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shadow-xs">
                    Nana Piyasa Learning
                  </span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 group ${
                    active 
                      ? 'bg-indigo-50/90 text-indigo-600 shadow-xs border border-indigo-100' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="pl-3 border-l border-slate-200">
              {token ? (
                <div className="flex items-center gap-2">
                  <Link 
                    to={role === 'teacher' ? '/teacher/dashboard' : '/dashboard'}
                    className="flex items-center gap-3 bg-white hover:bg-indigo-50/40 border border-slate-200/90 hover:border-indigo-300 pl-2.5 pr-4 py-1.5 rounded-2xl transition-all shadow-xs group cursor-pointer"
                    title="Open Dashboard"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                        {studentName}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2 py-0.5 rounded-full leading-none">
                          {formatGradeLabel(studentGrade, role)}
                        </span>
                        {studentMedium && (
                          <span className="text-[11px] font-medium text-slate-400">
                            • {studentMedium}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm px-6 py-2.5 rounded-2xl shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer border border-indigo-400/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 absolute w-full shadow-xl">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                    active ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-3 border-t border-slate-100 mt-2">
              {token ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-base flex items-center justify-center shadow-sm">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-black text-slate-800 text-base">
                        {studentName}
                      </span>
                      <span className="text-xs font-bold text-indigo-600">
                        {role === 'teacher' ? 'Teacher Portal' : (studentGrade ? `Grade ${studentGrade} Student` : 'Student')} {studentMedium ? `• ${studentMedium}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to={role === 'teacher' ? '/teacher/dashboard' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
