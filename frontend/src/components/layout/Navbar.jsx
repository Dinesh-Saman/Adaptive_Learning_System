import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-100 rounded-xl group-hover:bg-indigo-600 transition-colors">
                <BrainCircuit className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <span className="font-bold text-2xl text-slate-800 tracking-tight">LearnAI</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium text-[15px] transition-colors hover:text-indigo-600 ${
                  isActive(link.path) ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/login"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Student Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium ${
                  isActive(link.path) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block mt-4 w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Student Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
