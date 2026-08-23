import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="w-full bg-slate-50 py-16 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600">
            Interested in our research? Want to collaborate or test the platform? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Contact Info */}
          <div className="bg-indigo-600 text-white p-10 lg:p-12">
            <h3 className="text-2xl font-bold mb-8">Get in Touch</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-indigo-300 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Our Location</h4>
                  <p className="text-indigo-100">SLIIT Campus<br />New Kandy Road<br />Malabe, Sri Lanka</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-indigo-300 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-indigo-100">research@learnai.sliit.lk</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-indigo-300 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-indigo-100">+94 11 234 5678</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <p className="text-indigo-200 text-sm">
                * Our research team is available during standard university hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-2 p-10 lg:p-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <select 
                  id="subject" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
                >
                  <option>Research Inquiry</option>
                  <option>School Partnership</option>
                  <option>General Question</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md w-full md:w-auto"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
