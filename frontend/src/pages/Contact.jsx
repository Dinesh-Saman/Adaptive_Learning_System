import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  User, 
  MessageSquare, 
  HelpCircle, 
  Building2, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Research Collaboration',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const subjects = [
    { value: 'Research Collaboration', label: '🔬 Research Collaboration & Inquiries' },
    { value: 'School Partnership', label: '🏫 School & Primary Education Partnership' },
    { value: 'Teacher Feedback', label: '👩‍🏫 Teacher Testing & Feedback' },
    { value: 'Platform Support', label: '⚙️ Technical Support & General Questions' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Please provide your message';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'Research Collaboration',
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* ── Full Width & Exact Screen Height Hero Banner Section ── */}
      <section className="relative w-full h-[calc(100dvh-5rem)] overflow-hidden bg-slate-950 select-none">
        
        {/* Background Image */}
        <img 
          src="/images/hero_classroom.jpg" 
          alt="නැණ පියස — Contact & Research Collaboration Hub" 
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
                <span>CONNECT WITH OUR TEAM • අප හා සම්බන්ධ වන්න</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-3 tracking-tight">
                Let’s Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-200">Adaptive Education!</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-slate-100 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed mb-6">
                Interested in our research, school pilot testing, or partnering with our early childhood educational AI lab? We would love to collaborate with you.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contact-form"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 hover:from-amber-300 hover:to-orange-500 text-slate-950 font-black text-sm shadow-2xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border border-amber-300/40"
                >
                  <span>Send Us a Message</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="mailto:research@learnai.sliit.lk"
                  className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-teal-300" />
                  <span>research@learnai.sliit.lk</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Main Contact Container ── */}
      <section id="contact-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-6 relative z-20">
        
        {/* Contact Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          
          {/* ── Left Information Column ── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            
            {/* Background geometric accents */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10">
              
              {/* Badge & Title */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-4 border border-white/20">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Research Headquarters</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight">
                Get in Touch
              </h2>
              <h3 className="text-indigo-200 font-sinhala text-sm sm:text-base font-bold mb-8">
                නැණ පියස පර්යේෂණ කණ්ඩායම අමතන්න
              </h3>

              {/* Info Cards */}
              <div className="space-y-4">
                
                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <MapPin className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-0.5">Location</h4>
                    <p className="text-sm font-semibold text-white leading-snug">
                      SLIIT Campus, New Kandy Road,<br />Malabe, Sri Lanka
                    </p>
                  </div>
                </div>

                {/* Email */}
                <a 
                  href="mailto:research@learnai.sliit.lk" 
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Mail className="w-5 h-5 text-teal-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-0.5">Email Address</h4>
                    <p className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
                      research@learnai.sliit.lk
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a 
                  href="tel:+94112345678" 
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Phone className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-0.5">Telephone</h4>
                    <p className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
                      +94 11 234 5678
                    </p>
                  </div>
                </a>

                {/* Hours */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Clock className="w-5 h-5 text-pink-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-0.5">Operating Hours</h4>
                    <p className="text-sm font-semibold text-white leading-snug">
                      Monday – Friday: 8:30 AM – 5:00 PM<br />
                      <span className="text-xs text-indigo-200 font-normal">(Sri Lanka Standard Time / UTC+5:30)</span>
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom University Accreditation */}
            <div className="mt-8 pt-6 border-t border-white/15 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/15 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                </div>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                  Faculty of Computing • Sri Lanka Institute of Information Technology (SLIIT)
                </p>
              </div>
            </div>

          </div>

          {/* ── Right Form Column ── */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
            
            {isSubmitted ? (
              /* Success Confirmation Card */
              <div className="py-12 px-6 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-base text-emerald-600 font-sinhala font-bold mb-4">
                  ඔබගේ පණිවිඩය සාර්ථකව අප වෙත ලැබිණි!
                </p>
                <p className="text-slate-600 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                  Thank you for reaching out to the LearnAI research team. We have received your inquiry and our coordinators will respond within 1–2 business days.
                </p>
                
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              /* Interactive Contact Form */
              <div>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-sm text-slate-600">
                    Fill out the form below and our specialized research team will get back to you promptly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input 
                          type="text" 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                            errors.firstName 
                              ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200' 
                              : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600'
                          }`}
                          placeholder="e.g. Dilshan"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-xs text-rose-500 font-semibold mt-1.5">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input 
                          type="text" 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                            errors.lastName 
                              ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200' 
                              : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600'
                          }`}
                          placeholder="e.g. Perera"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-xs text-rose-500 font-semibold mt-1.5">{errors.lastName}</p>
                      )}
                    </div>

                  </div>

                  {/* Contact Methods: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input 
                          type="email" 
                          id="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                            errors.email 
                              ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200' 
                              : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600'
                          }`}
                          placeholder="dilshan@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-rose-500 font-semibold mt-1.5">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone (Optional) */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Phone Number <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Inquiry Category / Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Inquiry Topic / Subject
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <select 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600 text-sm font-medium text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                      >
                        {subjects.map((sub) => (
                          <option key={sub.value} value={sub.value}>
                            {sub.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Area */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-xs text-slate-400 font-medium">
                        {formData.message.length} characters
                      </span>
                    </div>
                    <div className="relative">
                      <textarea 
                        id="message" 
                        name="message"
                        rows="4" 
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full p-4 rounded-xl border text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-none ${
                          errors.message 
                            ? 'border-rose-400 bg-rose-50/50 focus:ring-2 focus:ring-rose-200' 
                            : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600'
                        }`}
                        placeholder="Tell us how we can assist you, your school, or your research initiative..."
                      ></textarea>
                    </div>
                    {errors.message && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>

        </div>

        {/* ── FAQ & Collaboration Section ── */}
        <div className="mt-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Frequently Asked Collaboration Questions
            </h3>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Common questions from primary school administrators, educators, and AI researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold text-lg">
                🏫
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">
                Can our primary school test the system?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes! We actively pilot test our multimodal math, speech, and handwriting modules with schools in Sri Lanka. Contact us with your grade levels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold text-lg">
                📊
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">
                How can teachers access analytics?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Teachers receive dedicated dashboard accounts to monitor cohort mastery, individual learner trajectories, and automated remedial recommendations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-bold text-lg">
                🔬
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">
                Is the research open for academic paper citation?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes, our research datasets and published methodologies in multimodal learning analytics and speech processing can be referenced for academic work.
              </p>
            </div>

          </div>
        </div>

      </section>

    </div>
  );
};

export default Contact;
