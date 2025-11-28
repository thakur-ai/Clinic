import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Star, Shield, Activity, 
  Phone, MapPin, Clock, CheckCircle2, 
  User, Heart, Sparkles, PlayCircle, Quote
} from 'lucide-react';
import { NavLink } from "react-router-dom";

// --- SCROLL REVEAL COMPONENT (Original, complex version) ---
const ScrollReveal = ({ children, delay = 0, width = "100%" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect the observer once the element is visible
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ width, transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      {children}
    </div>
  );
};

// NEW Simple ScrollReveal component (renamed to SimpleScrollReveal to avoid conflict)
const SimpleScrollReveal = ({ children, delay = 0, width = "100%" }) => (
  <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms`, width }}>
    {children}
  </div>
);

// NEW FeaturesBento component
const FeaturesBento = () => {
  return (
    <section className="py-12 md:py-24 relative z-10 bg-slate-50 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="mb-10 md:mb-16 md:text-center max-w-3xl mx-auto">
          <SimpleScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">
              Why Choose <span className="text-indigo-600">DentX</span>?
            </h2>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed">
              We don't just fix teeth; we engineer confidence using the world's most advanced dental technology and a patient-first approach.
            </p>
          </SimpleScrollReveal>
        </div>

        {/* BENTO GRID - Using 10 columns for precise 60/40 splits */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-5 md:gap-6 lg:gap-8 auto-rows-[minmax(300px,auto)]">
          
          {/* --- CARD 4: Anxiety-Free (Moved to Row 1 - 60% Width) --- */}
          <div className="md:col-span-6 h-full">
            <SimpleScrollReveal width="100%" delay={100} className="h-full">
              <div className="h-full group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-1">
                {/* Switch to Flex Row for wider card layout */}
                <div className="p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 h-full relative z-10">
                  
                  <div className="flex-1 order-2 md:order-1">
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 group-hover:animate-pulse">
                        <Heart size={24} className="md:w-7 md:h-7" />
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Anxiety-Free Sedation</h3>
                    <p className="text-slate-500 text-sm md:text-lg leading-relaxed">
                       Sleep through your appointment and wake up with a perfect smile. We offer nitrous oxide and IV sedation for nervous patients.
                    </p>
                  </div>

                  {/* Image on the right for 60% width card */}
                  <div className="w-full md:w-5/12 h-48 md:h-full order-1 md:order-2 rounded-2xl overflow-hidden relative shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700 ease-out" 
                      alt="Comfortable dental patient"
                    />
                  </div>

                </div>
              </div>
            </SimpleScrollReveal>
          </div>

          {/* --- CARD 1: Cosmetic Perfection (Moved to Row 1 - 40% Width) --- */}
          <div className="md:col-span-4 h-full">
            <SimpleScrollReveal width="100%" delay={200} className="h-full">
              <div className="h-full group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1">
                {/* Hover Background Blob */}
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150 group-hover:bg-indigo-100/50"></div>
                
                <div className="relative z-10 p-6 md:p-8 lg:p-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Sparkles size={24} className="md:w-7 md:h-7" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 md:mb-4 group-hover:text-indigo-600 transition-colors">Cosmetic Perfection</h3>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
                      Using 3D modeling and AI, we design your perfect smile before we even touch a tooth.
                    </p>
                    
                    {/* Link/Action Hint */}
                    <div className="flex items-center text-indigo-600 font-semibold opacity-100 md:opacity-0 md:-translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300 delay-75 text-sm md:text-base">
                      See the tech <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </SimpleScrollReveal>
          </div>

          {/* --- CARD 3: Lifetime Warranty (Moved to Row 2 - 40% Width) --- */}
          <div className="md:col-span-4 h-full">
            <SimpleScrollReveal width="100%" delay={300} className="h-full">
              <div className="h-full group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 p-6 md:p-8 lg:p-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform duration-300 delay-75">
                    <Shield size={24} className="md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 md:mb-3">Lifetime Warranty</h3>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                      We stand by our work. All implants and ceramic crowns come with an unconditional lifetime guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </SimpleScrollReveal>
          </div>

          {/* --- CARD 2: Same Day Implants (Moved to Row 2 - 60% Width) --- */}
          <div className="md:col-span-6 h-full">
            <SimpleScrollReveal width="100%" delay={400} className="h-full">
              <div className="h-full group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-indigo-900/50 transition-all duration-500 hover:-translate-y-1">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 bg-[length:200%_200%] animate-[gradient_6s_ease-in-out_infinite]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                
                <div className="relative z-10 p-6 md:p-8 lg:p-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Clock size={24} className="md:w-7 md:h-7" />
                  </div>
                  
                  <div className="max-w-xl">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">Same Day Implants</h3>
                    <p className="text-indigo-200/80 text-sm md:text-lg leading-relaxed">
                      Walk in with missing teeth, walk out with a complete smile in just one session. Our streamlined digital workflow makes it possible.
                    </p>
                  </div>
                </div>
              </div>
            </SimpleScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  // --- STATE & REFS ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const btnRef = useRef(null);

  // --- DETECT MOBILE & MOUSE TRACKING ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      // Only track mouse on desktop to save performance
      if (window.innerWidth >= 768) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setMousePos({ x, y, rawX: e.clientX, rawY: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // --- MAGNETIC BUTTON LOGIC (Desktop Only) ---
  const [btnStyle, setBtnStyle] = useState({});
  const handleBtnMove = (e) => {
    if (isMobile) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnStyle({ transform: `translate(${x * 0.2}px, ${y * 0.2}px)` });
  };
  const handleBtnLeave = () => setBtnStyle({ transform: `translate(0px, 0px)` });

  // --- PARALLAX VALUES ---
  const tiltX = isMobile ? 0 : mousePos.y * 8; 
  const tiltY = isMobile ? 0 : mousePos.x * -8; 

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white ">
      
      {/* --- GLOBAL STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px); /* Reduced blur for mobile performance */
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.05);
        }
        .glass-dark {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
        }
        .text-glow { text-shadow: 0 0 30px rgba(99, 102, 241, 0.3); }
        
        @keyframes blob-bounce {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob-bounce 10s infinite ease-in-out alternate; }
        .delay-2000 { animation-delay: 2s; }
        
        /* Mobile specific float animation since we don't use mouse parallax */
        @keyframes mobile-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-mobile-float { animation: mobile-float 4s ease-in-out infinite; }
      `}</style>

      {/* =========================================
          BACKGROUND LAYERS
         ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* 1. Geometric Grid */}
        <div className="absolute inset-0 grid-bg [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>

        {/* 2. Moving Color Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-200/30 rounded-full blur-[80px] md:blur-[120px] animate-blob mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-200/30 rounded-full blur-[80px] md:blur-[100px] animate-blob delay-2000 mix-blend-multiply"></div>

        {/* 3. Spotlight (Hidden on mobile) */}
        {!isMobile && (
          <div 
            className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 transition-transform duration-75 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
              left: -300, top: -300,
              transform: `translate(${mousePos.rawX}px, ${mousePos.rawY}px)`
            }}
          />
        )}
      </div>

      {/* =========================================
          HERO SECTION
         ========================================= */}
      <main className="relative z-10 pt-8 pb-8 md:pt-20 md:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50/50">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* --- TEXT CONTENT (Cols 7) --- */}
        <div className="lg:col-span-7 relative z-20 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 order-1">

          {/* Pill Badge */}
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm transition-transform hover:scale-105 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-500">
                Accepting New Patients
              </span>
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-slate-900 leading-[1.1] md:leading-[1] tracking-tight">
              Modern <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x">
                Dentistry.
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtext */}
          <ScrollReveal delay={200}>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-md md:max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
              Experience precision dental care in a calming environment. We combine art and science to perfect your smile.
            </p>
          </ScrollReveal>

          {/* Buttons */}
          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
              
              {/* Primary Button */}
              <div
                className="relative w-full sm:w-auto"
                onMouseMove={!isMobile ? handleBtnMove : undefined}
                onMouseLeave={!isMobile ? handleBtnLeave : undefined}
                ref={btnRef}
              >
                <NavLink
                  to="/appointment"
                  className="relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm md:text-base lg:text-lg shadow-xl shadow-indigo-500/20 transition-all duration-200 ease-out active:scale-95 overflow-hidden group flex items-center justify-center w-full sm:w-auto hover:shadow-2xl hover:shadow-indigo-500/40"
                  style={isMobile ? {} : btnStyle}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Schedule Visit <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-indigo-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                </NavLink>
              </div>

              {/* Secondary Button */}
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm md:text-base lg:text-lg hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-300 flex items-center justify-center gap-3 group transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 w-full sm:w-auto">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle size={16} fill="currentColor" />
                </div>
                See How It Works
              </button>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={400}>
            <div className="flex gap-8 pt-6 md:pt-8 border-t border-slate-200/60 w-full justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-black text-slate-900">15k+</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Smiles Fixed</p>
              </div>
              <div className="w-px h-10 md:h-12 bg-slate-200"></div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-black text-slate-900">100%</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Pain Free</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* --- 3D VISUAL (Cols 5) --- */}
        <div className="lg:col-span-5 relative h-[350px] sm:h-[450px] lg:h-[600px] flex items-center justify-center perspective-[1000px] order-2 mt-4 lg:mt-0">
          
          <ScrollReveal width="100%">
            {/* Main 3D Card */}
            <div
              className={`relative z-20 w-full h-[350px] sm:h-[450px] lg:h-[500px] bg-white rounded-[2rem] p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-transform duration-100 ease-out ${isMobile ? '' : ''}`}
              style={isMobile ? {} : { transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
            >
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-slate-100 group">
                <img
                  src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=2070&auto=format&fit=crop"
                  alt="Dentist"
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                {/* Card Content Overlay */}
                <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 text-white">
                  <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold uppercase text-[10px] tracking-widest">
                    <Activity size={12} /> Advanced Care
                  </div>
                  <p className="text-lg md:text-2xl font-bold leading-tight drop-shadow-md">
                    "The most comfortable dental experience ever."
                  </p>
                  <div className="flex items-center gap-2 mt-3 opacity:90">
                    <div className="flex text-yellow-400 gap-0.5">
                       {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <span className="text-[10px] font-medium border-l border-white/30 pl-2 ml-1">Verified Patient</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element: Success Rate */}
            {/* Logic: On mobile, absolute position is tighter to ensure it doesn't overflow screen width */}
            <div
              className={`absolute top-[5%] right-2 sm:-right-4 md:top-[10%] md:-right-[20px] z-30 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/50 ${isMobile ? 'animate-bounce-slow' : 'animate-blob'}`}
              style={isMobile ? { animationDelay: '0s' } : { transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Success Rate</p>
                  <p className="text-sm md:text-lg font-black text-slate-800 leading-none">99.9%</p>
                </div>
              </div>
            </div>

            {/* Floating Element: Patients Love Us */}
            <div
              className={`absolute bottom-[10%] left-2 sm:-left-4 md:bottom-[15%] md:-left-[30px] z-30 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl shadow-2xl shadow-indigo-500/20 border border-white/10 ${isMobile ? 'animate-bounce-slow' : 'animate-blob delay-2000'}`}
              style={isMobile ? { animationDelay: '2s' } : { transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-300">
                  <Heart size={16} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Patients</p>
                  <p className="text-sm md:text-lg font-black text-white leading-none">Love Us</p>
                </div>
              </div>
            </div>

          </ScrollReveal>
        </div>

      </div>
    </main>

      {/* =========================================
          BENTO GRID FEATURES
         ========================================= */}
      <FeaturesBento />

      <section className="py-12 md:py-24 relative z-10 bg-slate-900 text-white overflow-hidden">
      
      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Gradient Blob for mood */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER SECTION */}
        <ScrollReveal>
          {/* Changed mb-8 to mb-12 md:mb-16 for better spacing */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
              What Our Patients Say
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
              Hear from those who've experienced the DentX difference. Their smiles are our greatest reward.
            </p>
          </div>
        </ScrollReveal>

        {/* CARDS GRID */}
        {/* Added gap-6 md:gap-8 and max-w-md mx-auto md:max-w-none */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-md mx-auto md:max-w-none">
          
          {/* --- CARD 1 --- */}
          <ScrollReveal delay={100}>
            <div className="group relative h-full">
              {/* Glow Effect on Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-75 transition duration-500 blur-lg group-hover:blur-xl"></div>
              
              {/* Card Container: Changed p-8 to p-6 md:p-8 */}
              <div className="relative h-full bg-white rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transform transition-all duration-500 group-hover:-translate-y-2 border border-white/20 shadow-xl">
                
                {/* Image with Ring Animation */}
                <div className="relative mb-5 md:mb-6">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                    alt="Patient Sarah J." 
                    // Responsive Image sizing: w-16 h-16 mobile / w-20 h-20 desktop
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-slate-100 group-hover:ring-indigo-100 transition-all duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-full">
                    <Quote size={12} fill="currentColor" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="drop-shadow-sm" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-600 italic mb-6 flex-grow leading-relaxed text-sm md:text-base">
                  "Absolutely stellar service! My new smile has boosted my confidence beyond measure. I couldn't be happier."
                </p>

                {/* Author Info */}
                <div className="mt-auto">
                  <p className="font-bold text-slate-900 text-base md:text-lg group-hover:text-indigo-600 transition-colors">- Sarah J.</p>
                  <p className="text-sm text-slate-400 font-medium">New York, NY</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* --- CARD 2 --- */}
          <ScrollReveal delay={200}>
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-75 transition duration-500 blur-lg group-hover:blur-xl"></div>
              
              <div className="relative h-full bg-white rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transform transition-all duration-500 group-hover:-translate-y-2 border border-white/20 shadow-xl">
                
                <div className="relative mb-5 md:mb-6">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" 
                    alt="Patient Mark T." 
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-slate-100 group-hover:ring-indigo-100 transition-all duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-full">
                    <Quote size={12} fill="currentColor" />
                  </div>
                </div>

                <div className="flex gap-1 text-yellow-400 mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="drop-shadow-sm" />
                  ))}
                </div>

                <p className="text-slate-600 italic mb-6 flex-grow leading-relaxed text-sm md:text-base">
                  "Pain-free and professional. I used to dread the dentist, but DentX changed everything for me."
                </p>

                <div className="mt-auto">
                  <p className="font-bold text-slate-900 text-base md:text-lg group-hover:text-indigo-600 transition-colors">- Mark T.</p>
                  <p className="text-sm text-slate-400 font-medium">Los Angeles, CA</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* --- CARD 3 --- */}
          <ScrollReveal delay={300}>
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-75 transition duration-500 blur-lg group-hover:blur-xl"></div>
              
              <div className="relative h-full bg-white rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transform transition-all duration-500 group-hover:-translate-y-2 border border-white/20 shadow-xl">
                
                <div className="relative mb-5 md:mb-6">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                    alt="Patient Emily R." 
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-slate-100 group-hover:ring-indigo-100 transition-all duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-full">
                    <Quote size={12} fill="currentColor" />
                  </div>
                </div>

                <div className="flex gap-1 text-yellow-400 mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="drop-shadow-sm" />
                  ))}
                </div>

                <p className="text-slate-600 italic mb-6 flex-grow leading-relaxed text-sm md:text-base">
                  "The cosmetic work is flawless. It feels natural and looks incredible. Truly an artist at work."
                </p>

                <div className="mt-auto">
                  <p className="font-bold text-slate-900 text-base md:text-lg group-hover:text-indigo-600 transition-colors">- Emily R.</p>
                  <p className="text-sm text-slate-400 font-medium">Chicago, IL</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
      {/* Footer Spacer */}
      <div className="h-12 md:h-20"></div>
    </div>
  );
};
//op
export default HomePage;
