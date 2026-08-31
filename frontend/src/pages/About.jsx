import React from 'react';
import { BookOpen, Target, Users, Sparkles, Heart, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const researchers = [
    {
      name: "Onel",
      role: "Mathematics & Interactive AI",
      description: "Developing personalized mathematical learning pathways that adapt difficulty based on child performance, response time, and interaction pace.",
      image: "/images/hero_math.jpg",
      color: "bg-blue-100",
      textColor: "text-blue-700",
      border: "border-blue-200"
    },
    {
      name: "Suvinya",
      role: "English Pronunciation & Fluency",
      description: "Creating an engaging speech model to guide English pronunciation and speaking confidence tailored for primary school children.",
      image: "/images/hero_speech.jpg",
      color: "bg-emerald-100",
      textColor: "text-emerald-700",
      border: "border-emerald-200"
    },
    {
      name: "Vishmi",
      role: "Handwriting & Letter Tracing",
      description: "Building deep learning guidance for letter tracing and handwriting activities to support fine motor development and literacy.",
      image: "/images/hero_writing.png",
      color: "bg-amber-100",
      textColor: "text-amber-700",
      border: "border-amber-200"
    },
    {
      name: "Sanduni",
      role: "Motor Skills & Activity Vision",
      description: "Evaluating early childhood motor activities and hand movements to encourage joyful, guided learning experiences.",
      image: "/images/hero_creative.png",
      color: "bg-purple-100",
      textColor: "text-purple-700",
      border: "border-purple-200"
    }
  ];

  return (
    <div className="w-full bg-slate-50">
      
      {/* Full Width & Exact Screen Height Hero Banner Section */}
      <section className="relative w-full h-[calc(100dvh-5rem)] overflow-hidden bg-slate-950 select-none">
        
        {/* Background Image */}
        <img 
          src="/images/about_hero.jpg" 
          alt="නැණ පියස — Sri Lankan Primary Classroom & Adaptive Education" 
          className="absolute inset-0 w-full h-full object-cover object-[75%_30%]"
          loading="eager"
        />

        {/* Left-Hand Side & Bottom Gradient Overlay for Contrast */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-3/5 lg:w-1/2 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10 pointer-events-none"></div>

        {/* Hero Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end z-20">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
            <div className="max-w-3xl text-white">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-300/30 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>ADAPTIVE LEARNING</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-3 tracking-tight">
                Empowering Primary Education <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-200">in Sri Lanka!</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-slate-100 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed mb-6">
                Discover our mission, child-centered adaptive learning approach, and dedicated team committed to nurturing young learners with joy and confidence.
              </p>

              {/* Action Button */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-slate-950 font-black text-sm shadow-2xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border border-amber-300/40"
                >
                  <span>Explore Learning Modules</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Mission Statement */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-indigo-600" />
            <span>Our Core Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Personalized Learning Tailored to Every Child
          </h2>
          <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
            We are building an <strong className="text-indigo-600 font-bold">Adaptive Primary Learning Platform</strong> for Sri Lankan students. Our goal is to ensure that difficulty is never rigid, but dynamically tailored to meet every child's natural pace and learning style.
          </p>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 border border-rose-100 shadow-inner">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">The Challenge in Primary Education</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Traditional learning platforms often adjust difficulty based solely on correct answers. However, a child might answer correctly but feel stressed, or answer incorrectly while remaining deeply curious. Fixed platforms fail to respond to these individual learning needs.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 shadow-inner">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Our Adaptive Solution</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Nana Piyasa supports multiple interactive domains: mathematics, speech fluency, letter tracing, and fine motor skills. By offering tailored feedback, we empower students to build foundational skills with confidence and joy.
            </p>
          </div>
        </div>

        {/* The Research & Development Team */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">The Core Development Team</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Research & Module Pillars</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchers.map((researcher, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-3xl p-5 shadow-sm border ${researcher.border} hover:shadow-xl transition-all flex flex-col h-full transform hover:-translate-y-1 overflow-hidden group`}
              >
                {/* Relevant Image Preview above Title */}
                <div className="w-full h-40 mb-4 rounded-2xl overflow-hidden border border-slate-100 relative shadow-inner bg-slate-100">
                  <img 
                    src={researcher.image} 
                    alt={researcher.role} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-2.5 left-2.5 px-3 py-1 rounded-xl text-xs font-black backdrop-blur-md ${researcher.color} ${researcher.textColor} shadow-md`}>
                    0{index + 1}
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug">{researcher.role}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-grow">
                  {researcher.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default About;
