import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Users, 
  Calculator, 
  Gamepad2, 
  Award, 
  TrendingUp, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Palette,
  Mic,
  Pencil
} from 'lucide-react';
import { getItem } from '../utils/storage';

const heroSlides = [
  {
    image: '/images/about_hero.jpg',
    badge: 'ADAPTIVE LEARNING SYSTEM',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />,
    titlePrefix: 'Empowering Primary Education ',
    titleHighlight: 'in Sri Lanka!',
    subtitle: 'Discover our child-centered adaptive learning approach and dedicated platform committed to nurturing young learners with joy and confidence!',
    position: 'object-[75%_30%]',
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-300/30'
  },
  {
    image: '/images/hero_math.jpg',
    badge: 'FUN MATH LEARNING ZONE',
    icon: <Calculator className="w-3.5 h-3.5 text-amber-300 animate-pulse" />,
    titlePrefix: 'Where Math is a ',
    titleHighlight: 'Fun Adventure!',
    subtitle: 'Interactive magnetic equations, abacus practice, and step-by-step problem-solving for primary students!',
    position: 'object-[center_45%]',
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-300/30'
  },
  {
    image: '/images/hero_creative.png',
    badge: 'CREATIVE ARTS & DRAWING ZONE',
    icon: <Palette className="w-3.5 h-3.5 text-pink-300 animate-pulse" />,
    titlePrefix: 'Inspiring Young ',
    titleHighlight: 'Creative Minds!',
    subtitle: 'Fun coloring, line tracing, and paper crafts to build fine motor skills and unleash imagination!',
    position: 'object-[center_30%]',
    badgeBg: 'bg-pink-500/20 text-pink-200 border-pink-300/30'
  },
  {
    image: '/images/hero_writing.png',
    badge: 'LETTER WRITING & TRACING ZONE',
    icon: <Pencil className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />,
    titlePrefix: 'Learn & Practice ',
    titleHighlight: 'Letter Writing!',
    subtitle: 'Fun chalk writing, alphabet tracing, and number puzzles to build strong skills with joy!',
    position: 'object-[center_30%]',
    badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-300/30'
  },
  {
    image: '/images/hero_speech.jpg',
    badge: 'ENGLISH SPEECH & FLUENCY ZONE',
    icon: <Mic className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />,
    titlePrefix: 'Speak with ',
    titleHighlight: 'Confidence!',
    subtitle: 'Fun speech games, friendly conversations, and exciting pronunciation activities with best friends!',
    position: 'object-[center_25%]',
    badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-300/30'
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    const token = getItem('token');
    const role = getItem('role');
    setIsLoggedIn(Boolean(token));
    setUserRole(role || 'student');
  }, []);

  const getLink = (targetIfLoggedIn) => {
    if (!isLoggedIn) return '/login';
    if (userRole === 'teacher') return '/teacher/dashboard';
    return targetIfLoggedIn || '/dashboard';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <div className="w-full">
      {/* Full Width & Exact Screen Height Hero Slideshow Section */}
      <section className="relative w-full h-[calc(100dvh-5rem)] overflow-hidden bg-slate-950 select-none">
        
        {/* Background Images with Crisp 1:1 Quality and Cross-Fade Transition */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.badge} 
              className={`w-full h-full object-cover ${slide.position} transform-none`}
              loading="eager"
            />
          </div>
        ))}
        
        {/* Left-Hand Side & Bottom-Focused Black Overlay (Keeps Right Side 100% Bright) */}
        {/* Left-hand gradient shield for text */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-3/5 lg:w-1/2 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10 pointer-events-none"></div>
        {/* Bottom subtle gradient for button & grade access bar legibility */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-48 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none"></div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-2xl cursor-pointer pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/25 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-2xl cursor-pointer pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" />
        </button>

        {/* Content Container Aligned to Bottom of the Screen */}
        <div className="absolute inset-0 flex flex-col justify-end z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-3 md:pb-5 pointer-events-auto">
            
            {/* Main Information & Action Bar with Smooth Text Transition */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              
              {/* Left Text & Badge */}
              <div className="text-white drop-shadow-2xl max-w-3xl transition-all duration-500">
                <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3 border shadow-lg ${activeSlide.badgeBg}`}>
                  {activeSlide.icon}
                  <span>{activeSlide.badge}</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-3 tracking-tight">
                  <span className="block">{activeSlide.titlePrefix.trim()}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] block">
                    {activeSlide.titleHighlight}
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-slate-100 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed min-h-[56px] sm:min-h-[auto]">
                  {activeSlide.subtitle}
                </p>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                <Link
                  to={getLink('/dashboard')}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base shadow-2xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border border-amber-300/40"
                >
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-4 rounded-2xl bg-white/90 hover:bg-white text-slate-900 font-bold text-sm sm:text-base backdrop-blur-md shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-white/80"
                >
                  Explore Activities
                </Link>
              </div>

            </div>

            {/* Quick-Jump Grade Access & Slide Dots Bar (Moved Lower) */}
            <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/90">
              
              {/* Grade buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 font-bold mr-2 text-white/90">
                  <Calculator className="w-4 h-4 text-amber-300" />
                  <span>Choose Your Grade Level:</span>
                </div>
                <Link
                  to={getLink('/dashboard?hub=preschool')}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-500/80 hover:bg-pink-500 text-white font-bold backdrop-blur-sm transition-all border border-pink-300/40 shadow-sm"
                >
                  🎨 Pre-School & Grade 1 ➔
                </Link>
                <Link
                  to={getLink('/module/sinhala/grade2')}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500/80 hover:bg-teal-500 text-white font-bold backdrop-blur-sm transition-all border border-teal-300/40 shadow-sm"
                >
                  🌱 Grade 2 (2 ශ්‍රේණිය) ➔
                </Link>
                <Link
                  to={getLink('/module/sinhala/grade3')}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/80 hover:bg-purple-500 text-white font-bold backdrop-blur-sm transition-all border border-purple-300/40 shadow-sm"
                >
                  🎯 Grade 3 (3 ශ්‍රේණිය) ➔
                </Link>
                <Link
                  to={getLink('/module/sinhala/grade4')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-500/80 hover:bg-blue-500 text-white font-bold backdrop-blur-sm transition-all border border-blue-300/40 shadow-sm"
                >
                  ⭐ Grade 4 (4 ශ්‍රේණිය) ➔
                </Link>
              </div>

              {/* Slideshow Pagination Indicator Dots */}
              <div className="flex items-center gap-2">
                {heroSlides.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => setCurrentSlide(dotIndex)}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIndex === currentSlide 
                        ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50' 
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4 Primary Pillars Feature Cards Section directly below Hero */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Title & Badge */}
          <div className="text-center max-w-5xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-black text-xs uppercase tracking-wider mb-3 border border-amber-200/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Key Pillars of Nana Piyasa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight whitespace-normal md:whitespace-nowrap">
              Why Children & Parents Love Learning With Us
            </h2>
            <p className="text-slate-600 font-medium text-base sm:text-lg max-w-3xl mx-auto">
              Explore our core learning pillars designed to make primary education interactive, encouraging, and effective.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Fun Friends */}
            <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner border border-blue-100">
                👦
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Fun Friends</h3>
              <p className="text-xs font-bold text-blue-600 font-sinhala mb-2">සහයෝගී ඉගෙනුම් පරිසරය</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Engaging animated characters and supportive feedback that make learning arithmetic joyful.
              </p>
            </div>

            {/* 2. Step-by-Step Learning */}
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-emerald-100">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Step-by-Step Learning</h3>
              <p className="text-xs font-bold text-emerald-600 font-sinhala mb-2">පියවරෙන් පියවර අභ්‍යාස</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adaptive difficulty scaling across 20+ curriculum-aligned domains tailored to child cognitive pace.
              </p>
            </div>

            {/* 3. Cool Games */}
            <div className="bg-white p-6 rounded-3xl border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-purple-100">
                <Gamepad2 className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Cool Games</h3>
              <p className="text-xs font-bold text-purple-600 font-sinhala mb-2">ක්‍රීඩා සහ ප්‍රශ්නාවලී</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Interactive puzzles, visual abacus drills, and game-like math challenges that stimulate curiosity.
              </p>
            </div>

            {/* 4. Super Achievements */}
            <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-amber-100">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Super Achievements</h3>
              <p className="text-xs font-bold text-amber-600 font-sinhala mb-2">විශිෂ්ට ජයග්‍රහණ සහ ඇගයීම</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Skill badges, mastery trajectory analytics, and celebration milestones for every completed stage.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Interactive Learning Zones Showcase */}
      <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* ZONE 1: Math Zone */}
          <div>
            <div className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 font-black text-xs uppercase tracking-wider mb-3">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Mathematics & Numbers</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 font-sinhala leading-tight">
                  ගණිතය ඉගෙනුම් කලාපය — Math Zone
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-sinhala leading-relaxed mb-6">
                  2, 3 සහ 4 ශ්‍රේණි සඳහා විනෝදජනක ගණිත ඉගෙනුම් වැඩසටහන (Fun Math Learning Program for Grades 2, 3, & 4)
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to={getLink('/dashboard?hub=math')}
                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Explore Math Zone</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden shadow-xl border-3 border-blue-100 bg-white p-2">
                  <img 
                    src="/images/math_zone_banner.jpg" 
                    alt="ගණිතය ඉගෙනුම් කලාපය (Math Zone)" 
                    className="w-full h-auto max-h-[320px] rounded-2xl object-cover hover:scale-101 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                    Grades 2, 3 & 4 Adaptive Hubs
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-2 font-sinhala">
                    ගණිතය ශ්‍රේණි කාණ්ඩ වෙත පිවිසෙන්න
                  </h3>
                  <p className="text-indigo-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Explore personalized mathematics modules designed specifically for Sri Lankan primary school syllabi.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start lg:justify-end">
                  <Link to={getLink('/module/math/grade2')} className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>2 ශ්‍රේණිය (Grade 2)</span> ➔
                  </Link>
                  <Link to={getLink('/module/math/grade3')} className="px-5 py-3 rounded-xl bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>3 ශ්‍රේණිය (Grade 3)</span> ➔
                  </Link>
                  <Link to={getLink('/module/math/grade4')} className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>4 ශ්‍රේණිය (Grade 4)</span> ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>


          {/* ZONE 2: Creative Arts Zone (Image Left, Text Right) */}
          <div>
            <div className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image on Left */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="rounded-3xl overflow-hidden shadow-xl border-3 border-pink-100 bg-white p-2">
                  <img 
                    src="/images/hero_creative.png" 
                    alt="නිර්මාණාත්මක කලා කලාපය (Creative Arts Zone)" 
                    className="w-full h-auto max-h-[320px] rounded-2xl object-cover hover:scale-101 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Text on Right */}
              <div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-pink-700 font-black text-xs uppercase tracking-wider mb-3">
                  <Palette className="w-3.5 h-3.5 text-pink-600" />
                  <span>Creative Arts & Fine Motor</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 font-sinhala leading-tight">
                  නිර්මාණාත්මක කලා කලාපය — Creative Arts Zone
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-sinhala leading-relaxed mb-6">
                  පෙර පාසල් සහ ප්‍රාථමික ශ්‍රේණි සඳහා රූප ඇඳීම, පාට කිරීම සහ රේඛා රටා (Digital Coloring, Line Tracing & Crafts)
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to={getLink('/dashboard?hub=preschool')}
                    className="px-6 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Explore Creative Arts</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-purple-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                    Pre-School & Primary Arts Hubs
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-2 font-sinhala">
                    නිර්මාණාත්මක කලා කාණ්ඩ වෙත පිවිසෙන්න
                  </h3>
                  <p className="text-pink-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Fun coloring, line tracing, and paper craft activities designed to build fine motor skills and unleash imagination.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start lg:justify-end">
                  <Link to={getLink('/module/motor')} className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>රේඛා රටා (Line Tracing)</span> ➔
                  </Link>
                  <Link to={getLink('/module/coloring')} className="px-5 py-3 rounded-xl bg-rose-400 hover:bg-rose-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>පාට කිරීම (Coloring)</span> ➔
                  </Link>
                  <Link to={getLink('/module/papercraft')} className="px-5 py-3 rounded-xl bg-purple-400 hover:bg-purple-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>කලා නිර්මාණ (Crafts)</span> ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>


          {/* ZONE 3: Letter Writing Zone (Text Left, Image Right) */}
          <div>
            <div className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-black text-xs uppercase tracking-wider mb-3">
                  <Pencil className="w-3.5 h-3.5 text-amber-600" />
                  <span>Handwriting & Letter Tracing</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 font-sinhala leading-tight">
                  අකුරු ලිවීමේ කලාපය — Letter Writing Zone
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-sinhala leading-relaxed mb-6">
                  අකුරු සහ ඉලක්කම් නිවැරදිව ලිවීමට සහ පුහුණුවීමට (Alphabet Tracing & Chalk Writing Exercises)
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to={getLink('/dashboard?hub=sinhala')}
                    className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Explore Letter Writing</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden shadow-xl border-3 border-amber-100 bg-white p-2">
                  <img 
                    src="/images/hero_writing.png" 
                    alt="අකුරු ලිවීමේ කලාපය (Letter Writing Zone)" 
                    className="w-full h-auto max-h-[320px] rounded-2xl object-cover hover:scale-101 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-blue-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                    Handwriting & Tracing Hubs
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-2 font-sinhala">
                    අකුරු ලිවීමේ කාණ්ඩ වෙත පිවිසෙන්න
                  </h3>
                  <p className="text-cyan-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Practice Sinhala and English letters with interactive chalk writing and step-by-step tracing guidance.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start lg:justify-end">
                  <Link to={getLink('/module/motor')} className="px-5 py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>පෙර පාසල් & 1 ශ්‍රේණිය</span> ➔
                  </Link>
                  <Link to={getLink('/module/sinhala')} className="px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>ප්‍රාථමික අකුරු ලිවීම</span> ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>


          {/* ZONE 4: English Speech Zone (Image Left, Text Right) */}
          <div>
            <div className="mb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image on Left */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="rounded-3xl overflow-hidden shadow-xl border-3 border-emerald-100 bg-white p-2">
                  <img 
                    src="/images/hero_speech.jpg" 
                    alt="ඉංග්‍රීසි කතා කිරීමේ කලාපය (English Speech Zone)" 
                    className="w-full h-auto max-h-[320px] rounded-2xl object-cover hover:scale-101 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Text on Right */}
              <div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider mb-3">
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  <span>English Speech & Pronunciation</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 font-sinhala leading-tight">
                  ඉංග්‍රීසි කතා කිරීමේ කලාපය — English Speech Zone
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-sinhala leading-relaxed mb-6">
                  විනෝදජනක ඉංග්‍රීසි වචන උච්චාරණය සහ කතා කිරීමේ පුහුණුව (Interactive Pronunciation & Speaking Activities)
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to={getLink('/module/english')}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Explore Speech Zone</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                    Speech & Fluency Hubs
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-2 font-sinhala">
                    ඉංග්‍රීසි කතා කිරීමේ කාණ්ඩ වෙත පිවිසෙන්න
                  </h3>
                  <p className="text-emerald-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Interactive speech games, song pronunciation, and daily speaking challenges with instant feedback.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start lg:justify-end">
                  <Link to={getLink('/module/english')} className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>වචන උච්චාරණය (Pronunciation)</span> ➔
                  </Link>
                  <Link to={getLink('/module/english')} className="px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm shadow-md flex items-center gap-1.5">
                    <span>කතා කිරීමේ ක්‍රීඩා (Speech Games)</span> ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <ShieldCheck className="w-96 h-96 text-indigo-800 opacity-50" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-8 md:mb-0 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to try the platform?</h2>
            <p className="text-indigo-200 text-lg">
              Access the Learner Dashboard to test out the simulated AI modules and experience the adaptive engines firsthand.
            </p>
          </div>
          <div>
            <Link 
              to={getLink('/dashboard')}
              className="inline-block px-8 py-4 rounded-xl bg-white text-indigo-900 font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
