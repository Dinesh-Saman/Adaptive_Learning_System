import React from 'react';
import { BookOpen, Target, Users } from 'lucide-react';

const About = () => {
  const researchers = [
    {
      name: "Onel",
      role: "Mathematics & Multimodal AI",
      description: "Developing a system that predicts personalized mathematical difficulty by combining mathematical performance, response time, interaction behavior, and facial/visual features.",
      color: "bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      name: "Suvinya",
      role: "English Pronunciation AI",
      description: "Creating an AI-based speech model to detect English pronunciation errors specifically tailored for Sinhala-speaking primary school children.",
      color: "bg-green-100",
      textColor: "text-green-700"
    },
    {
      name: "Vishmi",
      role: "Sinhala Handwriting AI",
      description: "Building a deep learning model to recognize handwritten Sinhala characters and recommend personalized practice activities based on learning weaknesses.",
      color: "bg-orange-100",
      textColor: "text-orange-700"
    },
    {
      name: "Sanduni",
      role: "Motor Skills Computer Vision",
      description: "Using computer vision to identify and evaluate hand movements performed by early childhood students during guided learning activities.",
      color: "bg-purple-100",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="w-full bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mission Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">About the Research</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            We are a group of four researchers building an <strong className="text-indigo-600">AI-Powered Adaptive Learning and Cognitive Development Platform</strong> for Grades 2–4. Our common goal is to prove that difficulty should not be fixed, but rather dynamically personalized to the individual learner.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">The Problem</h3>
            <p className="text-slate-600 leading-relaxed">
              Traditional learning platforms increase difficulty based solely on correct answers. However, a child might answer correctly but feel immensely frustrated, or answer incorrectly while remaining highly engaged. Standard systems fail to capture these cognitive states.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Solution</h3>
            <p className="text-slate-600 leading-relaxed">
              We capture multiple modalities: speech, handwriting, camera-based behavioral indicators, and digital interaction. By feeding this into specialized AI models, we can estimate true "Personalized Difficulty" and adjust the curriculum accordingly.
            </p>
          </div>
        </div>

        {/* The Team */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-10">
            <Users className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-900">The Research Team</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchers.map((researcher) => (
              <div key={researcher.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 ${researcher.color} ${researcher.textColor}`}>
                  {researcher.name[0]}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{researcher.name}</h3>
                <p className={`text-sm font-semibold mb-4 ${researcher.textColor}`}>{researcher.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">
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
