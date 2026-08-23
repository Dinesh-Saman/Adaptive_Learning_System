import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Mic, Edit3, HandMetal } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: 'math',
      title: 'Multimodal Adaptive Mathematics',
      researcher: 'Onel',
      icon: <Calculator className="w-8 h-8" />,
      color: 'blue',
      description: 'Our flagship module doesn\'t just mark answers correct or wrong. It uses computer vision to observe facial expressions and gaze, measures response time, and analyzes interaction patterns to deduce the true "Personalized Difficulty" of mathematical concepts.',
      features: ['Facial expression analysis', 'Response time weighting', 'Dynamic question generation']
    },
    {
      id: 'english',
      title: 'English Pronunciation AI',
      researcher: 'Suvinya',
      icon: <Mic className="w-8 h-8" />,
      color: 'green',
      description: 'A specialized speech-to-text and phoneme classification system built specifically to detect Sinhala-influenced pronunciation errors in early-grade children, providing targeted phonological practice.',
      features: ['Phoneme-level error detection', 'Targeted speech exercises', 'Whisper/HuBERT integration']
    },
    {
      id: 'sinhala',
      title: 'Sinhala Handwriting Recognition',
      researcher: 'Vishmi',
      icon: <Edit3 className="w-8 h-8" />,
      color: 'orange',
      description: 'An interactive canvas that uses Vision Transformers and CNNs to analyze handwritten Sinhala letters. It evaluates stroke accuracy and builds a profile of the student\'s weakest characters to recommend personalized tracing exercises.',
      features: ['Real-time character recognition', 'Weakness profiling', 'Personalized tracing recommendations']
    },
    {
      id: 'motor',
      title: 'Motor Skills & Hand Movement Guidance',
      researcher: 'Sanduni',
      icon: <HandMetal className="w-8 h-8" />,
      color: 'purple',
      description: 'Designed for Nursery and Grade 1 students, this module uses webcam-based hand landmark tracking to guide and evaluate fine motor skills through shape tracing and spatial sequence activities.',
      features: ['21-point hand landmark tracking', 'Movement smoothness evaluation', 'Reaction time measurement']
    }
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400',
      green: 'bg-green-50 text-green-600 border-green-200 hover:border-green-400',
      orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400'
    };
    return classes[color];
  };

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Our AI Modules</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Discover the four specialized AI engines that power the LearnAI platform. Each module is a dedicated research project focused on a specific area of early childhood development.
          </p>
        </div>

        <div className="space-y-12">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image/Visual Placeholder */}
              <div className="w-full md:w-1/2">
                <div className={`w-full aspect-video rounded-3xl flex flex-col items-center justify-center p-8 border-2 transition-colors ${getColorClasses(service.color).split(' ')[0]} ${getColorClasses(service.color).split(' ')[2]}`}>
                   <div className={`p-4 rounded-full bg-white shadow-sm mb-4 ${getColorClasses(service.color).split(' ')[1]}`}>
                     {service.icon}
                   </div>
                   <h3 className={`text-2xl font-bold text-center ${getColorClasses(service.color).split(' ')[1]}`}>{service.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 px-4 md:px-8">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-slate-100 text-slate-600">
                  Research by {service.researcher}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/login"
                  className="inline-flex items-center font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Try the Demo <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Services;
