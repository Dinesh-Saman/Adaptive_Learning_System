import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Heart, 
  Sparkles, 
  GraduationCap, 
  Calculator, 
  Languages, 
  Mic, 
  Palette, 
  ShieldCheck, 
  BookOpen, 
  Mail, 
  ChevronRight 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80 mt-auto relative overflow-hidden">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none -mt-48"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none -mb-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1: Brand & Research Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <span className="font-black text-2xl text-white tracking-tight font-sinhala block group-hover:text-indigo-300 transition-colors">
                නැණ පියස
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-indigo-400 font-extrabold -mt-0.5">
                Nana Piyasa Learning System
              </span>
            </Link>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              An AI-powered multimodal adaptive learning and cognitive diagnostic platform designed specifically for early childhood and primary education in Sri Lanka.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-slate-900 text-indigo-300 border border-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                Adaptive AI ⭐
              </span>
              <span className="bg-slate-900 text-emerald-300 border border-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                Child Safe 🛡️
              </span>
            </div>
          </div>
          
          {/* Column 2: 4 Core Learning Functions */}
          <div className="space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Learning Hubs (කාණ්ඩ)
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <Calculator className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Adaptive Mathematics (ගණිතය)</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <Languages className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Sinhala 5-Paper System (සිංහල)</span>
                </Link>
              </li>
              <li>
                <Link to="/module/english" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <Mic className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>English Speech & Fluency AI</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <Palette className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Pre-School & Gr 1 Arts & Crafts</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Platform Portals */}
          <div className="space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Platform Portals
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/teacher/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <GraduationCap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>Teacher & Parent Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Student Learning Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <BrainCircuit className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>Research & Methodology</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Portal Authentication</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Research & Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              Academic Research
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Faculty of Computing & Technology research initiative investigating longitudinal cognitive enhancement for primary students.
            </p>
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400">Research Support & Feedback:</p>
              <Link to="/contact" className="text-xs font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Academic Team</span>
              </Link>
            </div>
          </div>

        </div>
        
        {/* Bottom Balanced Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} <strong>නැණ පියස (Nana Piyasa) Project</strong>. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-center sm:text-right">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for primary and early childhood education</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
