import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Mic, 
  Edit3, 
  Palette, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Brain, 
  Eye, 
  TrendingUp, 
  Compass, 
  Award,
  Layers,
  Activity,
  BookOpen
} from 'lucide-react';
import { getItem } from '../utils/storage';

const Services = () => {
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

  const services = [
    {
      id: 'math',
      title: 'Multimodal Adaptive Mathematics',
      sinhalaTitle: 'බහු-ආකෘතික අනුවර්තී ගණිතය (Math Zone)',
      researcher: 'Onel',
      icon: <Calculator className="w-6 h-6" />,
      color: 'blue',
      image: '/images/hero_math.jpg',
      alt: 'Multimodal Adaptive Mathematics & Interactive Problem Solving',
      grades: '2, 3, 4 ශ්‍රේණි (Grades 2, 3, & 4)',
      badge: 'Cognitive & Emotion AI',
      description: 'Our flagship mathematics module goes beyond simply marking answers correct or wrong. It uses real-time computer vision to observe facial expressions and frustration indicators, measures response time, and dynamically scales difficulty across 20+ syllabus-aligned skill competencies.',
      features: [
        'Real-time facial expression and frustration tracking via TinyFaceDetector',
        'MultimodalFusionNet neural network for dynamic difficulty scaling',
        'Longitudinal 5-paper adaptive generator with zero question repetition',
        'Structured misconception diagnostics and step-by-step remediation'
      ],
      actionUrl: getLink('/dashboard?hub=math'),
      accentGradient: 'from-blue-600 to-indigo-600',
      lightBg: 'bg-blue-50/80 text-blue-800 border-blue-200'
    },
    {
      id: 'english',
      title: 'English Speech & Pronunciation AI',
      sinhalaTitle: 'ඉංග්‍රීසි කථන හා උච්චාරණ පුහුණුව (English Speech Zone)',
      researcher: 'Suvinya',
      icon: <Mic className="w-6 h-6" />,
      color: 'green',
      image: '/images/hero_speech.jpg',
      alt: 'English Speech Recognition and Pronunciation Assessment',
      grades: 'ප්‍රාථමික ශ්‍රේණි (Primary Grades 2 - 4)',
      badge: 'Speech & Articulatory Vision AI',
      description: 'A 6-dimensional acoustic and articulatory speech intelligence engine built specifically to detect 12 common Sri Lankan Mother Tongue Influence (MTI) pronunciation deviations, providing instant bilingual pedagogical guidance.',
      features: [
        '12 Sri Lankan Mother Tongue Influence (MTI) pattern detectors',
        'Visual lip kinematics analyzing bilabial closure & lip rounding',
        'Acoustic fluency, pitch contour (F0), and speech rate (WPM) analytics',
        'Needleman-Wunsch DP phoneme-level error alignment and feedback'
      ],
      actionUrl: getLink('/module/english'),
      accentGradient: 'from-emerald-600 to-teal-600',
      lightBg: 'bg-emerald-50/80 text-emerald-800 border-emerald-200'
    },
    {
      id: 'sinhala',
      title: 'Sinhala Handwriting & Language Systems',
      sinhalaTitle: 'සිංහල අත්අකුරු හා අනුවර්තී පද්ධති (Sinhala Language Hub)',
      researcher: 'Vishmi',
      icon: <Edit3 className="w-6 h-6" />,
      color: 'orange',
      image: '/images/hero_writing.png',
      alt: 'Sinhala Handwriting Recognition and Tracing Systems',
      grades: '2, 3, 4 ශ්‍රේණි (Grades 2, 3, & 4)',
      badge: 'CNN & Deep Knowledge Tracing',
      description: 'An interactive multi-tier canvas combining deep Convolutional Neural Networks and Bidirectional Chamfer Distance transforms to evaluate handwritten Sinhala letters and Pillam, paired with Deep Knowledge Tracing (DKT) for curriculum mastery modeling.',
      features: [
        'Custom 3-Block 2D CNN classifying 28 Sinhala alphabet graphemes',
        'Bidirectional Chamfer Distance scoring against browser OpenType glyphs',
        '5-Category weighted tracing scoring engine (Path, Shape, Completeness)',
        'Deep Knowledge Tracing (DKT) LSTM predicting latent cognitive mastery'
      ],
      actionUrl: getLink('/dashboard?hub=sinhala'),
      accentGradient: 'from-amber-600 to-orange-600',
      lightBg: 'bg-amber-50/80 text-amber-800 border-amber-200'
    },
    {
      id: 'motor',
      title: 'Fine Motor Skills, Creative Arts & Crafts',
      sinhalaTitle: 'මෝටර් කුසලතා සහ නිර්මාණශීලී කලා (Creative Arts Zone)',
      researcher: 'Sanduni',
      icon: <Palette className="w-6 h-6" />,
      color: 'purple',
      image: '/images/hero_creative.png',
      alt: 'Fine Motor Skills, Coloring, Origami, and Paper Craft AI Guidance',
      grades: 'පෙර පාසල් & 1 ශ්‍රේණිය (Pre-School & Grade 1)',
      badge: 'Multimodal Vision & Gemini 2.5',
      description: 'Designed specifically for early childhood learners, this suite includes strict pixel-tolerance line tracing, intelligent digital coloring with boundary leakage detection, real-time video origami tracking, and Gemini 2.5 video craft verification.',
      features: [
        'Pixel-level tolerance tracing for fruit, animal, and pattern worksheets',
        'Smart coloring evaluation with flood-fill masks and forgiving color grading',
        'Computer vision origami folding tracker using Convex Hull & polygon simplification',
        'CLIP Vision Transformer for zero-shot story drawing comprehension'
      ],
      actionUrl: getLink('/dashboard?hub=preschool'),
      accentGradient: 'from-purple-600 to-pink-600',
      lightBg: 'bg-purple-50/80 text-purple-800 border-purple-200'
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* ── Full Width & Exact Screen Height Hero Banner Section ── */}
      <section className="relative w-full h-[calc(100dvh-5rem)] overflow-hidden bg-slate-950 select-none">
        
        {/* Background Image */}
        <img 
          src="/images/classroom.jpg" 
          alt="නැණ පියස — AI Learning Services & Research Engines" 
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
          loading="eager"
        />

        {/* Left-Hand Side & Bottom Gradient Overlay for High Contrast */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-3/5 lg:w-1/2 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent z-10 pointer-events-none"></div>

        {/* Hero Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end z-20">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
            <div className="max-w-3xl text-white">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-300/30 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>AI LEARNING MODULES • නැණ පියස ඉගෙනුම් සේවා</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-3 tracking-tight">
                Four Specialized <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-200">AI Learning Engines!</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-slate-100 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed mb-6">
                Explore the research-backed artificial intelligence engines powering our platform. Each module is tailored to key developmental milestones in Sri Lankan primary education.
              </p>

              {/* Action Buttons & Quick Module Links */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#services-showcase"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-slate-950 font-black text-sm shadow-2xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border border-amber-300/40"
                >
                  <span>Explore All Modules</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <div className="hidden sm:flex items-center gap-2">
                  {services.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all"
                    >
                      {s.title.split(' ')[0]}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Services Showcase Container ── */}
      <section id="services-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-6">
        <div className="space-y-24">
          {services.map((service, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div 
                id={service.id}
                key={service.id} 
                className="scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* ── Visual Showcase Card with Relevant Image ── */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border-2 border-slate-200/70 bg-slate-950">
                      
                      {/* Actual High-Resolution Image */}
                      <img 
                        src={service.image} 
                        alt={service.alt} 
                        className="w-full h-[280px] sm:h-[340px] md:h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-md text-xs font-bold border border-white/20 shadow-md">
                          <span className="p-1 rounded-full bg-white/20">{service.icon}</span>
                          <span>{service.badge}</span>
                        </span>

                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md">
                          {service.grades.split('(')[0]}
                        </span>
                      </div>

                      {/* Bottom Image Gradient Caption */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-4 sm:p-6 z-10">
                        <p className="text-white font-bold text-base sm:text-lg font-sinhala">
                          {service.sinhalaTitle}
                        </p>
                        <p className="text-xs text-slate-300 font-medium">
                          Interactive Adaptive Learning Hub
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* ── Content & Features Section ── */}
                  <div className="w-full lg:w-1/2 flex flex-col">
                    
                    {/* Researcher & Category Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        👨‍🔬 Research by <span className="text-indigo-600 font-black">{service.researcher}</span>
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${service.lightBg}`}>
                        {service.grades}
                      </span>
                    </div>

                    {/* Main English Title */}
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 leading-tight">
                      {service.title}
                    </h2>

                    {/* Sinhala Sub-heading */}
                    <h3 className="text-base sm:text-lg font-bold text-indigo-600 font-sinhala mb-4">
                      {service.sinhalaTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-slate-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Feature Bullets */}
                    <div className="mb-8">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                        Key AI Capabilities & Architecture:
                      </h4>
                      <ul className="space-y-2.5">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
                      <Link 
                        to={service.actionUrl}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${service.accentGradient} text-white font-bold text-sm shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all`}
                      >
                        <span>Try Interactive Demo</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link 
                        to="/about"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <span>Learn About Methodology</span>
                        <span>→</span>
                      </Link>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom Call to Action (CTA) ── */}
        <div className="mt-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-sm mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ready to experience the platform?</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">
                Empower Your Child's Learning with Real-Time AI Adaptation
              </h2>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
                Log in to access all 4 specialized learning hubs, view real-time mastery analytics, and track longitudinal progress.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to={getLink('/dashboard')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/contact"
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-sm border border-white/20 transition-all"
              >
                <span>Contact Research Team</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default Services;
