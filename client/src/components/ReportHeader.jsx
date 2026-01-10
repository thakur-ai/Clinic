import React from "react";
import { ArrowLeft, ChevronRight, Download, LogOut } from "lucide-react";

const ReportHeader = ({
  primaryAppointment,
  isAdmin,
  navigate,
  handleLogout,
}) => {
  return (
    <div className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Mobile: Back Button */}
        <div className="flex items-center md:hidden mb-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
          >
            <ArrowLeft
              size={18}
              className="mr-1.5 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-semibold">Back</span>
          </button>
        </div>

        {/* Desktop: Breadcrumbs */}
        <div className="hidden md:flex items-center text-xs font-semibold text-slate-400 mb-3 tracking-wide uppercase">
          <span className="hover:text-slate-600 cursor-pointer transition-colors">
            Dashboard
          </span>
          <ChevronRight size={14} className="mx-2 text-slate-300" />
          <span className="hover:text-slate-600 cursor-pointer transition-colors">
            Patients
          </span>
          <ChevronRight size={14} className="mx-2 text-slate-300" />
          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 normal-case">
            Report #{primaryAppointment?.appointmentId}
          </span>
        </div>

        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Left: Title & Meta */}
          <div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex h-10 w-1 bg-indigo-600 rounded-full"></div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                Medical Report
              </h1>
            </div>

            <div className="flex items-center gap-2 mt-2 sm:pl-4 text-sm md:text-base text-slate-500">
              <span>Patient ID:</span>
              <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 select-all">
                {primaryAppointment?.appointmentId}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {isAdmin && (
              <button className="flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 active:scale-95">
                <Download size={18} className="mr-2" />
                Export PDF
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white border border-rose-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-rose-200 transition-all duration-200 active:scale-95"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
