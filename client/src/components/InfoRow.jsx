import React from 'react';

const InfoRow = ({ icon, label, value, truncate = false }) => (
  <div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300 group select-none sm:select-text">
    
    {/* Icon Wrapper */}
    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-300 shadow-sm">
      <div className="transform transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0 py-0.5">
      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p 
        className={`text-sm sm:text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight ${truncate ? 'truncate' : 'break-words'}`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default InfoRow;