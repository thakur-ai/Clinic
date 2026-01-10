import React from "react";

function AppointmentNotesModal({
  showNotesModal,
  currentAppointmentForNotes,
  appointmentNotes,
  setAppointmentNotes,
  handleSaveNotes,
  setShowNotesModal,
}) {
  if (!showNotesModal || !currentAppointmentForNotes) return null;

  // Use a fallback/shortened ID for the title (Logic unchanged)
  const appointmentIdDisplay = currentAppointmentForNotes._id
    ? currentAppointmentForNotes._id.substring(0, 8) + "..."
    : "N/A";

  return (
    // Backdrop: Added blur effect and darker overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setShowNotesModal(false)}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-title"
        style={{ maxHeight: "90vh" }}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Decorative Icon */}
            <div className="bg-indigo-50 p-2.5 rounded-full text-indigo-600">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2
                id="notes-title"
                className="text-lg font-bold text-gray-900 leading-tight"
              >
                Doctor Notes
              </h2>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  ID:
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 font-mono">
                  {appointmentIdDisplay}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNotesModal(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition duration-150 focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
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

        {/* Modal Body: Textarea */}
        <div className="p-6 flex-1 overflow-y-auto">
          <label
            htmlFor="appointmentNotes"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Observation & Diagnosis
          </label>
          <div className="relative">
            <textarea
              id="appointmentNotes"
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
              rows="8"
              className="block w-full rounded-xl border-gray-200 bg-slate-50 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-sm sm:text-base leading-relaxed resize-none shadow-inner"
              placeholder="Type your notes, clinical observations, or follow-up instructions here..."
            ></textarea>
            {/* Visual corner accent for textarea */}
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            These notes will be saved to the patient's appointment record.
          </p>
        </div>

        {/* Action Buttons: Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowNotesModal(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-white hover:shadow-sm transition duration-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveNotes}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2"
          >
            <span>Save Record</span>
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
      </div>
    </div>
  );
}

export default AppointmentNotesModal;
