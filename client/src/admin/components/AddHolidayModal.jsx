import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddHolidayModal({
  showAddHolidayModal,
  doctorName,
  selectedHolidayDate,
  setSelectedHolidayDate,
  handleAddHoliday,
  setShowAddHolidayModal,
}) {
  if (!showAddHolidayModal) return null;

  // Function to reset and close the modal (Cleaner UX)
  const handleClose = () => {
    setShowAddHolidayModal(false);
    setSelectedHolidayDate(null);
  };

  return (
    // Backdrop: Added blur effect and darker overlay for better focus
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="holiday-title"
      >
        {/* Decorative Top Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>

        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* Feature Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 text-violet-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2
                  id="holiday-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Mark Holiday
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  Dr. {doctorName}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-4 space-y-6">
          <div>
            <label
              htmlFor="holidayDate"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Date
            </label>

            <div className="relative group">
              {/* Absolute Icon for Input */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors"
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

              {/* Styled DatePicker */}
              <div className="custom-datepicker-wrapper">
                <DatePicker
                  selected={selectedHolidayDate}
                  onChange={(date) => setSelectedHolidayDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all duration-200 cursor-pointer font-medium"
                  placeholderText="Choose a date..."
                  required
                  popperPlacement="bottom-start"
                />
              </div>
            </div>

            {/* Helper Text */}
            <div className="mt-3 flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <svg
                className="w-4 h-4 text-blue-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-blue-700 leading-relaxed">
                Appointments cannot be booked on this date. Existing
                appointments may need rescheduling.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-8 py-5 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-white hover:shadow-sm hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAddHoliday}
            disabled={!selectedHolidayDate}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedHolidayDate
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg transform hover:-translate-y-0.5"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Holiday
          </button>
        </div>
      </div>

      {/* Small style override to ensure the datepicker input spans full width properly within the flex container */}
      <style>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default AddHolidayModal;
