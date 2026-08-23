import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BrainCircuit className="h-8 w-8 text-indigo-400" />
              <span className="font-bold text-2xl text-white tracking-tight">LearnAI</span>
            </Link>
            <p className="text-slate-400 max-w-sm">
              An AI-powered adaptive learning and cognitive development platform designed specifically for early-grade children in Sri Lanka.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors">Adaptive Mathematics</Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors">English Speech & Pronunciation</Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors">Sinhala Handwriting</Link></li>
              <li><Link to="/services" className="hover:text-indigo-400 transition-colors">Motor Skills Guidance</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About the Research</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Student Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} LearnAI Research Project. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Built with <Heart className="h-4 w-4 text-red-500" /> for early childhood education
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
