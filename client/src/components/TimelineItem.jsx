import React from 'react';

const TimelineItem = ({ date, title, doctor, status }) => {
  let statusStyles = "";
  let dotColor = "bg-gray-300";
  if (status === 'upcoming') { statusStyles = "text-blue-700 bg-blue-50 border-blue-100"; dotColor = "bg-blue-500 ring-4 ring-blue-100"; }
  else if (status === 'cancelled') { statusStyles = "text-red-600 bg-red-50 border-red-100 decoration-red-400"; dotColor = "bg-red-400"; }
  else if (status === 'completed') { statusStyles = "text-emerald-700 bg-emerald-50 border-emerald-100"; dotColor = "bg-emerald-500"; }

  return (
    <div className="relative pl-6 md:pl-8">
      <div className={`absolute -left-[9px] top-1 w-[18px] h-[18px] rounded-full border-2 border-white ${dotColor} z-10`}></div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
        <div>
          <span className="text-xs font-mono text-gray-400 uppercase">{date}</span>
          <h4 className={`text-sm md:text-base font-bold mt-0.5 ${status === 'cancelled' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{title}</h4>
          <p className="text-xs md:text-sm text-gray-500">{doctor}</p>
        </div>
        <div className="mt-1 sm:mt-0 self-start">
          <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border ${statusStyles}`}>{status}</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
