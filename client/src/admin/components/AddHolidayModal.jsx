import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AddHolidayModal({
  showAddHolidayModal,
  doctorName,
  selectedHolidayDate,
  setSelectedHolidayDate,
  handleAddHoliday,
  setShowAddHolidayModal
}) {
  if (!showAddHolidayModal) return null;

  // Function to reset and close the modal (Cleaner UX)
  const handleClose = () => {
    setShowAddHolidayModal(false);
    setSelectedHolidayDate(null);
  };

  return (
    // Backdrop: Fixed position, full screen, semi-transparent background.
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleClose} // Close when clicking outside
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-in-out border-t-4 border-purple-600 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="holiday-title"
        style={{ maxHeight: '90vh' }}
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-5 border-gray-100">
          <h2 id="holiday-title" className="text-xl sm:text-2xl font-bold text-gray-800">
            Add Holiday for Dr. {doctorName} 🗓️
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-purple-600 focus:outline-none p-1 transition duration-150"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body: Date Picker */}
        <div className="space-y-6">
          <div>
            <label htmlFor="holidayDate" className="block text-base font-medium text-gray-700 mb-2">Select Date</label>
            
            {/* DatePicker Input Styling for consistency */}
            <div className="relative">
              <DatePicker
                selected={selectedHolidayDate}
                onChange={(date) => setSelectedHolidayDate(date)}
                dateFormat="PPP"
                // Custom Tailwind classes for a modern input look
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 transition"
                placeholderText="Click to select date"
                required
                popperPlacement="bottom-start" 
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">This date will be marked unavailable in the scheduling system.</p>
          </div>
          
          {/* Action Buttons: Mobile responsive stacking */}
          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
            
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleClose}
              // w-full on mobile, auto width on sm and up
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-100 transition duration-150"
            >
              Cancel
            </button>
            
            {/* Add Holiday Button: Disabled state handling for UX */}
            <button
              type="button"
              onClick={handleAddHoliday}
              disabled={!selectedHolidayDate} 
              className={`w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white transition duration-150 ${
                selectedHolidayDate 
                  ? 'bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Add Holiday
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}//dfdf

export default AddHolidayModal;
