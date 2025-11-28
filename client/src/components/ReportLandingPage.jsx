import React from 'react';
import { ArrowLeft, Search, History, ShieldCheck, Building2, FileCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useParallaxEffect from '../hooks/useParallaxEffect';

const ReportLandingPage = ({
  error,
  inputtedId,
  setInputtedId,
  handleKeyDown,
  handleFetchReport,
  recentSearches,
  clearRecentHistory,
  setCurrentReportId
}) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { mousePos, xOffset, yOffset } = useParallaxEffect(25, true); // Active for landing page

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* --- DYNAMIC BACKGROUND & CURSOR EFFECTS --- */}
      
      {/* 1. The Spotlight Effect (Follows Cursor) */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      ></div>

      {/* 2. Parallax Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        
        {/* Blob 1 (Blue) - Moves Opposite to Mouse */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[100px] animate-float"
          style={{ transform: `translate(${xOffset * -1}px, ${yOffset * -1}px)` }} // Parallax Math
        ></div>
        
        {/* Blob 2 (Indigo) - Moves With Mouse (Depth) */}
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/40 blur-[100px] animate-float-delayed"
          style={{ transform: `translate(${xOffset * 0.5}px, ${yOffset * 0.5}px)` }} 
        ></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full relative z-10">
        
        {/* LEFT COLUMN: Informational Content */}
        <div className="space-y-10 order-2 lg:order-1">
          
          {/* Brand / Intro */}
          <div 
            style={{ transform: `translate(${xOffset * 0.2}px, ${yOffset * 0.2}px)` }} // Subtle text parallax
            className="transition-transform duration-75 ease-out"
          >
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-md border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-sm font-medium text-blue-800">Est. 2005 &bull; Excellence in Healthcare</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 drop-shadow-sm">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Digitally Secured.
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
              Welcome to the <span className="font-semibold text-slate-800">Healthy Smiles</span> patient portal. 
              Access your comprehensive medical history, upcoming appointments, and treatment plans with enterprise-grade security.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Feature 1 */}
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-5 rounded-2xl shadow-sm hover:bg-white/60 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3 shadow-inner">
                <Building2 size={20} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Modern Facility</h3>
              <p className="text-sm text-slate-500">Equipped with state-of-the-art technology for patient comfort.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-5 rounded-2xl shadow-sm hover:bg-white/60 transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                <FileCheck size={20} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Live Reports</h3>
              <p className="text-sm text-slate-500">Dynamically updated medical records available 24/7.</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 text-slate-500 text-sm font-medium">
             <div className="flex items-center group cursor-help">
               <CheckCircle2 size={16} className="text-green-500 mr-2 group-hover:scale-110 transition-transform" /> HIPAA Compliant
             </div>
             <div className="flex items-center group cursor-help">
               <CheckCircle2 size={16} className="text-green-500 mr-2 group-hover:scale-110 transition-transform" /> Instant Access
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Card */}
        <div className="w-full max-w-sm mx-auto lg:ml-auto order-1 lg:order-2 perspective-1000">
          <div 
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-white/50 overflow-hidden relative transition-transform duration-100 ease-out"
            // Optional: Slight 3D tilt based on mouse position
            style={{ 
              transform: `rotateY(${xOffset * 0.05}deg) rotateX(${yOffset * -0.05}deg)` 
            }} 
          >
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Shine effect passing through */}
              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine"></div>

              <div className="relative z-10">
                <div className="mx-auto bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner mb-4 ring-4 ring-white/10">
                  <ShieldCheck className="text-white drop-shadow-md" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Secure Login</h2>
                <p className="text-blue-100 text-sm mt-1 font-light">Enter your details to view records</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-6">
              
               {/* Error Message */}
               {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start animate-shake shadow-sm">
                  <div className="flex-1 text-sm">
                    <p className="font-bold">Access Failed</p>
                    <p>{error.message === "Failed to fetch" ? "Server unavailable." : "Report ID not found."}</p>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Patient Report ID</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:bg-white"
                      placeholder="e.g. RPT-88234"
                      value={inputtedId}
                      onChange={(e) => setInputtedId(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  onClick={handleFetchReport}
                  disabled={!inputtedId.trim()}
                  className={`w-full py-3 px-4 rounded-xl text-white font-bold text-base shadow-lg shadow-blue-500/20 flex justify-center items-center transition-all transform active:scale-[0.98] relative overflow-hidden
                    ${inputtedId.trim() 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 hover:shadow-blue-600/40 hover:-translate-y-0.5' 
                      : 'bg-slate-300 cursor-not-allowed'}`}
                >
                  <span className="relative z-10 flex items-center text-sm">Access Medical Records <ChevronRight size={20} className="ml-2" /></span>
                </button>
              </div>
              {/* Return to Homepage Button */}
              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <button 
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center group"
                >
                  <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" /> Return to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportLandingPage;
