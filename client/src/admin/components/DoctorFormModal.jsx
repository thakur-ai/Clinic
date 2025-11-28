import React, { useCallback } from 'react';

function DoctorFormModal({
  showDoctorForm,
  currentDoctor,
  doctorFormData,
  setDoctorFormData,
  handleDoctorSubmit,
  setShowDoctorForm
}) {
  // Function to update form data
  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setDoctorFormData(prevData => Object.assign({}, prevData, { [id]: value }));
  }, [setDoctorFormData]); // Removed doctorFormData from dependencies

  if (!showDoctorForm) return null;

  const title = currentDoctor ? 'Edit Doctor' : 'Add New Doctor';
  const submitText = currentDoctor ? 'Save Changes' : 'Add Doctor';

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full flex items-start sm:items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={() => setShowDoctorForm(false)}
    >
      {/* Backdrop: Centered, darker opacity, uses p-4 for safe padding on mobile */}
      <div 
        className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-in-out border-t-8 border-indigo-600 my-10 sm:my-0 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-form-title"
        style={{ maxHeight: '90vh' }}
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6 border-gray-100">
          <h2 id="doctor-form-title" className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {title} 👨‍⚕️
          </h2>
          <button
            type="button"
            onClick={() => setShowDoctorForm(false)}
            className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1 transition duration-150"
            aria-label="Close"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body: Form */}
        <form onSubmit={handleDoctorSubmit} className="space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          
          <InputField id="name" label="Full Name" value={doctorFormData.name} onChange={handleChange} />

          <InputField id="specialization" label="Specialization" value={doctorFormData.specialization} onChange={handleChange} />

          <InputField id="email" label="Email Address" type="email" value={doctorFormData.email} onChange={handleChange} />

          <InputField id="phone" label="Phone Number" type="tel" value={doctorFormData.phone} onChange={handleChange} />

          {/* Action Buttons: Mobile responsive stacking */}
          <div className="flex flex-col-reverse sm:flex-row justify-end pt-4 gap-3 border-t border-gray-100">
            
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setShowDoctorForm(false)}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-100 transition duration-150"
            >
              Cancel
            </button>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition duration-150"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper for consistent input styling
const InputField = ({ id, label, type = "text", required = true, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id} 
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 text-base sm:text-sm"
      required={required}
    />
  </div>
);
//op
export default DoctorFormModal;
