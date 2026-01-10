import React from 'react';

const Badge = ({ text, color }) => {
  // Enhanced color mappings with deeper borders and subtle colored shadows
  const colors = {
    red: "bg-red-50 text-red-700 border-red-200 shadow-red-100",
    blue: "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100",
    gray: "bg-slate-100 text-slate-600 border-slate-200 shadow-slate-100",
  };

  const activeClasses = colors[color] || colors.gray;

  return (
    <span 
      className={`
        inline-flex items-center justify-center px-3 py-1 
        text-xs font-bold rounded-full border shadow-sm 
        transition-transform duration-200 hover:scale-105 select-none
        ${activeClasses}
      `}
    >
      {text}
    </span>
  );
};

export default Badge;