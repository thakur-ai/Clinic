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
    // Backdrop: Modern blur effect with dark overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setShowServiceForm(false)}
    >
      
      {/* Modal Container */}
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ maxHeight: '90vh' }}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             {/* Icon Container */}
             <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </div>
             <div>
                <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  {currentService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage your service offerings</p>
             </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowServiceForm(false)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none"
            aria-label="Close form"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="service-form" onSubmit={handleServiceSubmit} className="space-y-6">
            
            {/* Service Name */}
            <FormGroup label="Service Name" htmlFor="serviceName" required>
              <input
                type="text"
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                placeholder="e.g. Full Body Checkup"
                required
              />
            </FormGroup>

            {/* Price Fields - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormGroup label="Base Price (₹)" htmlFor="serviceBasePrice" required>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                    type="number"
                    id="serviceBasePrice"
                    value={serviceBasePrice}
                    onChange={(e) => setServiceBasePrice(e.target.value)}
                    className="block w-full pl-7 pr-3 py-3 rounded-xl border-gray-200 bg-gray-50 text-sm text-gray-900 font-medium focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    min="0"
                    placeholder="0"
                    required
                    />
                </div>
              </FormGroup>
              
              <FormGroup label="Min Price" htmlFor="serviceMinPrice">
                <input
                  type="number"
                  id="serviceMinPrice"
                  value={serviceMinPrice}
                  onChange={(e) => setServiceMinPrice(e.target.value)}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  min="0"
                  placeholder="Optional"
                />
              </FormGroup>

              <FormGroup label="Max Price" htmlFor="serviceMaxPrice">
                <input
                  type="number"
                  id="serviceMaxPrice"
                  value={serviceMaxPrice}
                  onChange={(e) => setServiceMaxPrice(e.target.value)}
                  className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
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
                rows="4"
                className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"
                placeholder="Briefly describe the details and benefits of this service..."
              ></textarea>
            </FormGroup>

          </form>
        </div>

        {/* Footer / Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowServiceForm(false)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-white hover:shadow-sm transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="service-form" // Link to form ID
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2"
          >
            {currentService ? 'Save Changes' : 'Create Service'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

// Helper component
const FormGroup = ({ label, htmlFor, required, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

export default ServiceFormModal;