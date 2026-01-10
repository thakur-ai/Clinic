import React from "react";
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useParallaxEffect from "../hooks/useParallaxEffect";

const ReportLandingPage = ({
  error,
  inputtedId,
  setInputtedId,
  handleKeyDown,
  handleFetchReport,
  recentSearches = [], // Default to empty array if undefined
  clearRecentHistory,
  setCurrentReportId,
}) => {
  const navigate = useNavigate();
  // Parallax effect logic maintained
  const { mousePos, xOffset, yOffset } = useParallaxEffect(25, true);

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Mouse Spotlight (Desktop) */}
        <div
          className="hidden lg:block absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.1), transparent 80%)`,
          }}
        />

        {/* Animated Blobs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[100px] animate-pulse"
          style={{
            transform: `translate(${xOffset * -0.3}px, ${yOffset * -0.3}px)`,
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-[80px]"
          style={{
            transform: `translate(${xOffset * 0.2}px, ${yOffset * 0.2}px)`,
          }}
        />

        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="w-full max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* LEFT COLUMN: Brand & Info */}
        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          {/* Header Group */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-blue-800 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Secure Patient Portal
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Your Health Records, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Instantly Available.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to <strong>Healthy Smiles</strong>. Access your medical
              history, lab reports, and prescriptions securely with your unique
              Patient ID.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">24/7 Access</h3>
                <p className="text-xs text-slate-500">View records anytime</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <FileCheck size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Live Updates</h3>
                <p className="text-xs text-slate-500">Real-time lab results</p>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              <CheckCircle2 size={14} className="text-emerald-500" /> HIPAA
              Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              <ShieldCheck size={14} className="text-blue-500" /> End-to-End
              Encrypted
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Card */}
        <div className="order-1 lg:order-2 w-full max-w-md mx-auto perspective-1000">
          <div
            className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative transform transition-transform duration-100 ease-out"
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
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner ring-4 ring-white/10 mb-4">
                  <ShieldCheck className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Record Lookup</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Enter your ID to retrieve documents
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Error State */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="text-red-500 shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-800">
                      Access Denied
                    </h4>
                    <p className="text-xs text-red-600 mt-0.5">
                      {error.message === "Failed to fetch"
                        ? "Server unreachable."
                        : "Invalid Report ID."}
                    </p>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Report ID
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search
                        className="text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={20}
                      />
                    </div>
                    <input
                      type="text"
                      value={inputtedId}
                      onChange={(e) => setInputtedId(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. RPT-88234"
                      className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-lg font-medium tracking-wide"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  onClick={handleFetchReport}
                  disabled={!inputtedId.trim()}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-[0.98] ${
                    inputtedId.trim()
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  <span>Access Records</span>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Recent Searches (Added UI for the prop) */}
              {recentSearches && recentSearches.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Recent Lookups
                    </span>
                    {clearRecentHistory && (
                      <button
                        onClick={clearRecentHistory}
                        className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        Clear <X size={10} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((id, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputtedId(id);
                          // Optional: Auto trigger fetch logic if desired, or just populate
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-xs font-medium border border-slate-200 hover:border-blue-200 transition-colors"
                      >
                        <Clock size={12} /> {id}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 inline-flex items-center gap-2 group transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
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
