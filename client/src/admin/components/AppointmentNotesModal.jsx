import React from 'react';

function AppointmentNotesModal({
  showNotesModal,
  currentAppointmentForNotes,
  appointmentNotes,
  setAppointmentNotes,
  handleSaveNotes,
  setShowNotesModal
}) {
  if (!showNotesModal || !currentAppointmentForNotes) return null;

  // Use a fallback/shortened ID for the title
  const appointmentIdDisplay = currentAppointmentForNotes._id 
    ? currentAppointmentForNotes._id.substring(0, 8) + '...' 
    : 'N/A';

  return (
    // Backdrop: Centered, darker opacity, uses p-4 for safe padding on mobile.
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-start sm:items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={() => setShowNotesModal(false)}
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-in-out border-t-8 border-indigo-600 my-10 sm:my-0"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-title"
        // Ensure scrollability if content is slightly longer
        style={{ maxHeight: '90vh' }}
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-5 border-gray-100">
          <h2 id="notes-title" className="text-xl sm:text-2xl font-bold text-gray-800">
            📝 Notes for Appt. ID: <span className="text-indigo-600 font-mono text-base">{appointmentIdDisplay}</span>
          </h2>
          <button
            type="button"
            onClick={() => setShowNotesModal(false)}
            className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1 ml-4 transition duration-150"
            aria-label="Close"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body: Textarea */}
        <div className="space-y-4">
          <label htmlFor="appointmentNotes" className="sr-only">Appointment Notes</label>
          <textarea
            id="appointmentNotes"
            value={appointmentNotes}
            onChange={(e) => setAppointmentNotes(e.target.value)}
            rows="7" // Increased rows for better mobile editing experience
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-inner p-4 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 text-base"
            placeholder="Add patient notes, diagnosis, or follow-up instructions here..."
          ></textarea>
        </div>

        {/* Action Buttons: Mobile responsive stacking */}
        <div className="flex flex-col-reverse sm:flex-row justify-end pt-5 gap-3 border-t mt-6 border-gray-100">
          
          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => setShowNotesModal(false)}
            // w-full on mobile, auto width on sm and up
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            Cancel
          </button>
          
          {/* Save Notes Button */}
          <button
            type="button"
            onClick={handleSaveNotes}
            className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition duration-150"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
//hgtfrdf
export default AppointmentNotesModal;
