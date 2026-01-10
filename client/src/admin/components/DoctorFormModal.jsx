import React, { useCallback } from "react";

function DoctorFormModal({
  showDoctorForm,
  currentDoctor,
  doctorFormData,
  setDoctorFormData,
  handleDoctorSubmit,
  setShowDoctorForm,
}) {
  // Function to update form data
  const handleChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      setDoctorFormData((prevData) =>
        Object.assign({}, prevData, { [id]: value })
      );
    },
    [setDoctorFormData]
  );

  if (!showDoctorForm) return null;

  const title = currentDoctor ? "Edit Doctor" : "Add New Doctor";
  const submitText = currentDoctor ? "Save Changes" : "Add Doctor";

  return (
    // Backdrop: Modern blur effect with slate overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setShowDoctorForm(false)}
    >
      {/* Modal Container */}
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-form-title"
        style={{ maxHeight: "90vh" }}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Decorative Icon */}
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shrink-0">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2
                id="doctor-form-title"
                className="text-xl font-bold text-gray-900 leading-tight"
              >
                {title}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage doctor profile details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDoctorForm(false)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none"
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

        {/* Modal Body: Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleDoctorSubmit} className="space-y-5">
            <InputField
              id="name"
              label="Full Name"
              value={doctorFormData.name}
              onChange={handleChange}
              icon={
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <InputField
              id="specialization"
              label="Specialization"
              value={doctorFormData.specialization}
              onChange={handleChange}
              icon={
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={doctorFormData.email}
                onChange={handleChange}
                icon={
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />

              <InputField
                id="phone"
                label="Phone Number"
                type="tel"
                value={doctorFormData.phone}
                onChange={handleChange}
                icon={
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.05 11.05 0 008.25-2.257l1.128-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                    />
                  </svg>
                }
              />
            </div>

            {/* Footer / Buttons */}
            <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowDoctorForm(false)}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-white hover:shadow-sm transition duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2"
              >
                {submitText}
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

// Helper for consistent input styling with Icon support
const InputField = ({
  id,
  label,
  type = "text",
  required = true,
  value,
  onChange,
  icon,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1"
    >
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-xl border-gray-200 bg-gray-50 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all outline-none ${
          icon ? "pl-10 pr-3" : "px-3"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
        required={required}
      />
    </div>
  </div>
);

export default DoctorFormModal;
