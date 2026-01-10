import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function RescheduleAppointmentModal({
  showRescheduleModal,
  currentAppointmentForReschedule,
  newRescheduleDate,
  setNewRescheduleDate,
  newRescheduleTime,
  setNewRescheduleTime,
  handleReschedule,
  setShowRescheduleModal,
  doctorHolidays,
}) {
  if (!showRescheduleModal || !currentAppointmentForReschedule) return null;

  // Logic to display ID
  const appointmentIdDisplay = currentAppointmentForReschedule._id
    ? currentAppointmentForReschedule._id.substring(0, 8) + "..."
    : "N/A";

  return (
    // Backdrop: Modern blur effect with dark overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-opacity duration-300">
      {/* Modal Container */}
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        style={{ maxHeight: "90vh" }}
      >
        {/* Custom CSS for DatePicker to match the modern theme */}
        <style>{`
          .custom-datepicker-wrapper {
             width: 100%;
          }
          .custom-datepicker-wrapper .react-datepicker-wrapper {
             width: 100%;
          }
          .reschedule-datepicker-input {
             width: 100%;
             padding-left: 2.5rem; /* Space for icon */
             padding-right: 1rem;
             padding-top: 0.75rem;
             padding-bottom: 0.75rem;
             border-radius: 0.75rem;
             border: 1px solid #e2e8f0;
             background-color: #f8fafc;
             color: #0f172a;
             font-size: 0.875rem;
             transition: all 0.2s;
             outline: none;
          }
          .reschedule-datepicker-input:focus {
             background-color: #ffffff;
             border-color: #6366f1; /* Indigo-500 */
             box-shadow: 0 0 0 2px #c7d2fe; /* Indigo-200 */
          }
          
          /* Calendar Styles Override */
          .react-datepicker {
             font-family: inherit;
             border: 1px solid #e2e8f0;
             border-radius: 0.75rem;
             box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .react-datepicker__header {
             background-color: #f1f5f9;
             border-bottom: 1px solid #e2e8f0;
             border-top-left-radius: 0.75rem;
             border-top-right-radius: 0.75rem;
             padding-top: 0.75rem;
          }
          .react-datepicker__day--selected, 
          .react-datepicker__day--keyboard-selected {
             background-color: #4f46e5 !important; /* Indigo-600 */
             color: white !important;
             border-radius: 0.5rem;
          }
          .react-datepicker__day:hover {
             border-radius: 0.5rem;
             background-color: #e0e7ff;
          }
          .react-datepicker__current-month {
             font-weight: 700;
             color: #1e293b;
          }
          .react-datepicker__day-name {
             color: #64748b;
          }
        `}</style>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shrink-0">
              {/* Calendar Refresh Icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Reschedule
              </h2>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  ID:
                </span>
                <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-bold">
                  {appointmentIdDisplay}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRescheduleModal(false)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleReschedule} className="space-y-5">
            {/* Date Input */}
            <div>
              <label
                htmlFor="newRescheduleDate"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1"
              >
                New Date
              </label>
              <div className="relative custom-datepicker-wrapper">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <DatePicker
                  selected={newRescheduleDate}
                  onChange={(date) => setNewRescheduleDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="reschedule-datepicker-input"
                  placeholderText="Select new date"
                  required
                  excludeDates={doctorHolidays}
                  popperPlacement="bottom"
                />
              </div>
            </div>

            {/* Time Input */}
            <div>
              <label
                htmlFor="newRescheduleTime"
                className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1"
              >
                New Time Slot
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="newRescheduleTime"
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  placeholder="e.g. 10:00 AM - 11:00 AM"
                  required
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:shadow-sm transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2"
              >
                <span>Confirm Change</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RescheduleAppointmentModal;
