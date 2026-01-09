import React from "react";
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useParallaxEffect from "../hooks/useParallaxEffect";

const ReportLandingPage = ({
  error,
  inputtedId,
  setInputtedId,
  handleKeyDown,
  handleFetchReport,
  recentSearches,
  clearRecentHistory,
  setCurrentReportId,
}) => {
  const navigate = useNavigate();
  // Active parallax, but we'll tame it on mobile via CSS/Inline logic
  const { mousePos, xOffset, yOffset } = useParallaxEffect(25, true);

  // Helper to determine if we should apply heavy 3D effects (Desktop only ideally, but we keep it subtle)
  // We utilize standard Tailwind breakpoints for layout changes.

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* --- DYNAMIC BACKGROUND & CURSOR EFFECTS --- */}

      {/* 1. The Spotlight Effect (Hidden on mobile/touch to save battery) */}
      <div
        className="hidden lg:block pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
        }}
      ></div>

      {/* 2. Parallax Blobs (Softer on mobile) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

        {/* Blob 1 (Blue) */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[70%] lg:w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[80px] lg:blur-[100px] animate-float"
          style={{
            transform: `translate(${xOffset * -0.5}px, ${yOffset * -0.5}px)`,
          }} // Reduced movement
        ></div>

        {/* Blob 2 (Indigo) */}
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[70%] lg:w-[50%] h-[50%] rounded-full bg-indigo-200/40 blur-[80px] lg:blur-[100px] animate-float-delayed"
          style={{
            transform: `translate(${xOffset * 0.2}px, ${yOffset * 0.2}px)`,
          }}
        ></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      {/* Changed grid order logic: Text first on Mobile, Left on Desktop. Card second on Mobile, Right on Desktop */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center w-full relative z-10 py-6 lg:py-0">
        {/* LEFT COLUMN: Informational Content */}
        {/* Added text-center for mobile, text-left for desktop */}
        <div className="space-y-8 lg:space-y-10 flex flex-col items-center lg:items-start text-center lg:text-left order-1">
          {/* Brand / Intro */}
          <div
            // Only apply parallax translation on larger screens to prevent jitter on mobile scroll
            style={{
              transform:
                window.innerWidth > 1024
                  ? `translate(${xOffset * 0.2}px, ${yOffset * 0.2}px)`
                  : "none",
            }}
            className="transition-transform duration-75 ease-out"
          >
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium text-blue-800">
                Est. 2005 &bull; Excellence in Healthcare
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 drop-shadow-sm">
              Your Health, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Digitally Secured.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Welcome to the{" "}
              <span className="font-semibold text-slate-800">
                Healthy Smiles
              </span>{" "}
              patient portal. Access your comprehensive medical history ,
              appointments, and reports with enterprise-grade security.
            </p>
          </div>

          {/* Feature Grid - Stack on mobile, side-by-side on larger */}
          <div className="grid gap-4 sm:gap-6 w-full max-w-md sm:grid-cols-2">
            {/* Feature 1 */}
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-3 shadow-inner">
                  <Building2 size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">
                  Modern Facility
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  State-of-the-art tech for patient comfort.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                  <FileCheck size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Live Reports</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Updated medical records available 24/7.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-6 text-slate-500 text-xs sm:text-sm font-medium">
            <div className="flex items-center bg-white/30 px-3 py-1 rounded-full border border-white/40">
              <CheckCircle2 size={14} className="text-green-500 mr-2" /> HIPAA
              Compliant
            </div>
            <div className="flex items-center bg-white/30 px-3 py-1 rounded-full border border-white/40">
              <CheckCircle2 size={14} className="text-green-500 mr-2" /> Instant
              Access
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Card */}
        {/* On mobile: Order 2 (Below text). On Desktop: Order 2 (Right side) */}
        <div className="w-full max-w-sm mx-auto lg:ml-auto order-2 perspective-1000 mt-4 lg:mt-0">
          <div
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(8,_112,_184,_0.1)] border border-white/60 overflow-hidden relative transition-transform duration-100 ease-out"
            // Apply 3D tilt ONLY on desktop (lg) to avoid mobile scrolling issues
            style={{
              transform:
                window.innerWidth > 1024
                  ? `rotateY(${xOffset * 0.05}deg) rotateX(${
                      yOffset * -0.05
                    }deg)`
                  : "none",
            }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

              {/* Shine effect */}
              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine"></div>

              <div className="relative z-10">
                <div className="mx-auto bg-white/20 backdrop-blur-md w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-inner mb-4 ring-4 ring-white/10">
                  <ShieldCheck
                    className="text-white drop-shadow-md"
                    size={28}
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Secure Login
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm mt-1 font-light">
                  Enter details to view records
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 sm:p-6 lg:p-8">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded mb-6 flex items-start animate-shake shadow-sm">
                  <div className="flex-1 text-xs sm:text-sm">
                    <p className="font-bold">Access Failed</p>
                    <p>
                      {error.message === "Failed to fetch"
                        ? "Server unavailable."
                        : "Report ID not found."}
                    </p>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Patient Report ID
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search
                        className="text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        size={20}
                      />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:bg-white text-base"
                      placeholder="e.g. RPT-88234"
                      value={inputtedId}
                      onChange={(e) => setInputtedId(e.target.value)}
                      onKeyDown={handleKeyDown}
                      // Autofocus can sometimes be annoying on mobile (opens keyboard immediately), kept it but good to know
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  onClick={handleFetchReport}
                  disabled={!inputtedId.trim()}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-base shadow-lg shadow-blue-500/20 flex justify-center items-center transition-all transform active:scale-[0.98] relative overflow-hidden
                    ${
                      inputtedId.trim()
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
                >
                  <span className="relative z-10 flex items-center text-sm sm:text-base">
                    Access Records <ChevronRight size={20} className="ml-2" />
                  </span>
                </button>
              </div>

              {/* Return to Homepage Button */}
              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center group py-2"
                >
                  <ArrowLeft
                    size={16}
                    className="mr-1.5 group-hover:-translate-x-1 transition-transform"
                  />{" "}
                  Return to Homepage
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
