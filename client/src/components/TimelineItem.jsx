import React from "react";

const TimelineItem = ({ date, title, doctor, status }) => {
  let statusStyles = "";
  let dotColor = "bg-gray-300 border-gray-200";
  let cardBorder = "border-l-4 border-gray-200"; // Added for visual accent on card

  if (status === "upcoming") {
    statusStyles = "text-blue-700 bg-blue-50 border-blue-200 shadow-sm";
    dotColor = "bg-blue-600 ring-4 ring-blue-100";
    cardBorder = "border-l-4 border-blue-500";
  } else if (status === "cancelled") {
    statusStyles =
      "text-red-600 bg-red-50 border-red-100 line-through decoration-red-400 opacity-80";
    dotColor = "bg-red-500 ring-4 ring-red-50";
    cardBorder = "border-l-4 border-red-400";
  } else if (status === "completed") {
    statusStyles = "text-emerald-700 bg-emerald-50 border-emerald-200";
    dotColor = "bg-emerald-500 ring-4 ring-emerald-100";
    cardBorder = "border-l-4 border-emerald-500";
  }

  return (
    // Outer container with padding for the timeline line space
    <div className="relative pl-8 sm:pl-10 py-2 group">
      {/* Timeline Dot */}
      <div
        className={`absolute left-0 sm:left-1 top-6 w-4 h-4 rounded-full border-2 border-white ${dotColor} z-10 transition-transform duration-300 group-hover:scale-110 shadow-sm`}
      ></div>

      {/* Content Card */}
      <div
        className={`bg-white rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 border border-gray-100 ${cardBorder}`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                {date}
              </span>
            </div>

            <h4
              className={`text-base sm:text-lg font-bold text-gray-900 leading-tight truncate ${
                status === "cancelled" ? "text-gray-400 line-through" : ""
              }`}
            >
              {title}
            </h4>

            <div className="flex items-center gap-1.5 mt-1.5">
              {/* Doctor Icon SVG (Inline for zero dependencies) */}
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-sm text-gray-500 font-medium truncate">
                {doctor}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-1 sm:mt-0 self-start shrink-0">
            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${statusStyles}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
