import React from 'react';

function ServiceFormModal({
  showServiceForm,
  currentService,
  serviceName,
  setServiceName,
  serviceBasePrice,
  setServiceBasePrice,
  serviceMinPrice,
  setServiceMinPrice,
  serviceMaxPrice,
  setServiceMaxPrice,
  serviceDescription,
  setServiceDescription,
  handleServiceSubmit,
  setShowServiceForm
}) {
  if (!showServiceForm) return null;

  return (
    // Backdrop: Fixed position, full screen, semi-transparent background, takes up the whole screen
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={() => setShowServiceForm(false)} // Close when clicking outside the modal
    >
      
      {/* Modal Container: Adjusted for max width on mobile, better shadow/rounding */}
      <div 
        className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-in-out
                   // Mobile-specific layout: Take up more screen space on small devices
                   max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* Header with Close Button */}
        <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-100">
          <h2 id="modal-title" className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">
            {currentService ? 'Edit Service Details' : 'Add New Service'} 🛠️
          </h2>
          <button
            type="button"
            onClick={() => setShowServiceForm(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close form"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleServiceSubmit} className="space-y-5">
          {/* Service Name */}
          <FormGroup label="Service Name" htmlFor="serviceName" required>
            <input
              type="text"
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="form-input"
              placeholder="e.g., Deep Cleaning Package"
              required
            />
          </FormGroup>

          {/* Price Fields - Grid layout for better mobile space efficiency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormGroup label="Base Price (₹)" htmlFor="serviceBasePrice" required>
              <input
                type="number"
                id="serviceBasePrice"
                value={serviceBasePrice}
                onChange={(e) => setServiceBasePrice(e.target.value)}
                className="form-input"
                min="0"
                placeholder="0"
                required
              />
            </FormGroup>
            
            <FormGroup label="Min Price (₹)" htmlFor="serviceMinPrice">
              <input
                type="number"
                id="serviceMinPrice"
                value={serviceMinPrice}
                onChange={(e) => setServiceMinPrice(e.target.value)}
                className="form-input"
                min="0"
                placeholder="Optional"
              />
            </FormGroup>

            <FormGroup label="Max Price (₹)" htmlFor="serviceMaxPrice">
              <input
                type="number"
                id="serviceMaxPrice"
                value={serviceMaxPrice}
                onChange={(e) => setServiceMaxPrice(e.target.value)}
                className="form-input"
                min="0"
                placeholder="Optional"
              />
            </FormGroup>
          </div>

          {/* Description */}
          <FormGroup label="Description" htmlFor="serviceDescription">
            <textarea
              id="serviceDescription"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              rows="3"
              className="form-input resize-none"
              placeholder="Briefly describe what this service includes..."
            ></textarea>
          </FormGroup>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end pt-4 space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={() => setShowServiceForm(false)}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150"
            >
              {currentService ? 'Save Changes' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper component for cleaner form structure and styling
const FormGroup = ({ label, htmlFor, required, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);
//dfg
export default ServiceFormModal;
