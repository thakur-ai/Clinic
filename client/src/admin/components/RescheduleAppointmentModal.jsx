import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function RescheduleAppointmentModal({
  showRescheduleModal,
  currentAppointmentForReschedule,
  newRescheduleDate,
  setNewRescheduleDate,
  newRescheduleTime,
  setNewRescheduleTime,
  handleReschedule,
  setShowRescheduleModal,
  doctorHolidays // Add doctorHolidays prop
}) {
  if (!showRescheduleModal || !currentAppointmentForReschedule) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full mx-4 sm:mx-0 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <style>{`
          .reschedule-datepicker {
            width: 100%;
            font-family: inherit;
            border: 1px solid #d1d5db; /* border-gray-300 */
            border-radius: 0.375rem; /* rounded-md */
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
            padding: 0.5rem; /* p-2 */
          }
          .react-datepicker {
            border: none;
            box-shadow: none;
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .react-datepicker__month-container {
              width: 100%;
              max-width: 300px; /* Adjust for smaller mobile modal */
          }
          .react-datepicker__header {
            background-color: white;
            border-bottom: 1px solid #f3f4f6;
            padding-top: 0.5rem; /* Smaller padding */
          }
          .react-datepicker__day-name, .react-datepicker__day {
            width: 2rem; /* Smaller day width */
            height: 2rem; /* Smaller day height */
            line-height: 2rem;
            margin: 0.1rem; /* Smaller margin */
            font-size: 0.8rem; /* Smaller font size */
          }
          @media (max-width: 500px) {
              .react-datepicker {
                  max-width: 250px; /* Even smaller overall width for the calendar */
                  padding: 0;
                  margin: 0 auto;
              }
              .react-datepicker__month-container {
                  max-width: 100%; 
              }
              .react-datepicker__day-name, .react-datepicker__day {
                  width: 1.5rem;
                  height: 1.5rem;
                  line-height: 1.5rem;
                  font-size: 0.65rem;
                  margin: 0.05rem;
              }
              .react-datepicker__header {
                  padding-top: 0.2rem;
              }
              .react-datepicker__navigation--previous,
              .react-datepicker__navigation--next {
                  top: 0.3rem;
                  padding: 0.1rem;
              }
          }
        `}</style>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Reschedule Appointment ID: {currentAppointmentForReschedule._id ? currentAppointmentForReschedule._id.substring(0, 8) + '...' : 'N/A'}</h2>
        <form onSubmit={handleReschedule} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="newRescheduleDate" className="block text-sm font-medium text-gray-700">New Date</label>
            <DatePicker
              selected={newRescheduleDate}
              onChange={(date) => setNewRescheduleDate(date)}
              dateFormat="PPP"
              className="reschedule-datepicker mt-1" /* Apply custom class here */
              placeholderText="Select new date"
              required
              excludeDates={doctorHolidays} // Exclude holidays
            />
          </div>
          <div>
            <label htmlFor="newRescheduleTime" className="block text-sm font-medium text-gray-700">New Time Slot</label>
            <input
              type="text"
              id="newRescheduleTime"
              value={newRescheduleTime}
              onChange={(e) => setNewRescheduleTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm sm:text-base"
              placeholder="e.g., 10:00 AM - 11:00 AM"
              required
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 space-x-0 sm:space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowRescheduleModal(false)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Reschedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RescheduleAppointmentModal;
