import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, ArrowRight, ShieldCheck, Activity, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-16 md:pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Next-Generation Adaptive Learning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Unlocking Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Cognitive AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              A multimodal AI platform designed to personalize early-grade education through behavioral analysis, computer vision, and adaptive difficulty.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/services" 
                className="px-8 py-4 text-lg font-bold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Explore Modules <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 text-lg font-bold rounded-full bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                Learn About the Research
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why LearnAI is Different</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform doesn't just ask questions; it observes, understands, and adapts to how each child learns best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform hover:scale-110">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multimodal Fusion</h3>
              <p className="text-slate-600 leading-relaxed">
                Combining mathematical performance with computer vision and behavioral analysis to truly understand cognitive states.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform hover:scale-110">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Difficulty</h3>
              <p className="text-slate-600 leading-relaxed">
                Personalized difficulty scaling that prevents frustration by ensuring the challenge exactly matches the student's current ability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform hover:scale-110">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Holistic Curriculum</h3>
              <p className="text-slate-600 leading-relaxed">
                Covering foundational skills including Math, English Speech, Sinhala Writing, and Motor Skills all in one platform.
              </p>
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
              to="/login"
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
