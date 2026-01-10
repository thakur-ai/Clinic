import React from "react";
import { useNavigate } from "react-router-dom";

// --- Icons (kept exactly as provided) ---
const IconCalendar = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
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
);
const IconTime = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
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
);
const IconDoctor = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 11l9 3-9 3-9-3 9-3zm0 0V3m0 8v8m0-8h8m-8 0H4"
    />
  </svg>
);
const IconService = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);
const IconUser = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
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
);
const IconEmail = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
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
);
const IconPhone = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
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
);
const IconMoney = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0l-3 3m3-3l3 3m-4.5-9A1.5 1.5 0 0117 11.5v-1a1.5 1.5 0 01-1.5 1.5H12a1.5 1.5 0 01-1.5-1.5V10c0-.828.672-1.5 1.5-1.5h1.5A1.5 1.5 0 0115 10v1m-4.5-1.5a1.5 1.5 0 013 0M10 18H5a2 2 0 01-2-2v-3"
    />
  </svg>
);
const IconStatus = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.106a2.19 2.19 0 00-1.077-.75l-4.555-1.767A2.583 2.583 0 0012 2a2.583 2.583 0 00-2.31 1.377L5.459 5.144a2.19 2.19 0 00-1.077.75A2 2 0 003 7.854v8.292a2 2 0 00.382 1.056l4.555 1.767A2.583 2.583 0 0012 22a2.583 2.583 0 002.31-1.377l4.555-1.767a2.19 2.19 0 001.077-.75A2 2 0 0021 16.146V7.854a2 2 0 00-.382-1.056z"
    />
  </svg>
);
const IconNotes = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);
const IconWhatsApp = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C7.34 2 3.56 5.78 3.56 10.48c0 1.95.63 3.82 1.77 5.46L2 22l6.02-1.58c1.5-.89 3.23-1.37 5.02-1.37 4.71 0 8.49-3.78 8.49-8.49S16.75 2 12.04 2zm.01 1.67c3.89 0 7.05 3.16 7.05 7.05 0 3.89-3.16 7.05-7.05 7.05-1.77 0-3.46-.64-4.8-1.76l-.34-.2-3.56.93 1-3.47-.23-.35c-1.16-1.74-1.77-3.75-1.77-5.8 0-3.89 3.16-7.05 7.05-7.05zm-4.33 4.54c-.2.01-.49.03-.71.3-.2.25-.77.93-.77 2.25s.79 2.61.9 2.8.2.2.41.2c.21 0 .58-.08.79-.35s.71-.84.99-.95c.29-.12.59-.01.81.25s.98 1.18 1.18 1.48c.2.3.27.42.47.54.21.12.4.08.57-.02.2-.1.85-.35 1.61-1.32.77-.97 1.02-1.73 1.05-1.8.03-.07.2-.2.14-.3-.06-.1-.23-.37-.32-.56-.08-.2-.05-.16-.12-.3-.07-.12-.52-1.25-.72-1.71-.2-.46-.16-.39-.4-.39-.24 0-.52-.01-.79-.01-.27 0-.7.1-.96.35s-1 1-.96 1.07zm0 0z" />
  </svg>
);

function AppointmentDetailsModal({
  showDetailsModal,
  setShowDetailsModal,
  appointment,
}) {
  const navigate = useNavigate();
  if (!showDetailsModal || !appointment) return null;

  // New Helper: Info Card for cleaner layout
  const InfoCard = ({ icon: Icon, label, value, subValue, highlight }) => (
    <div
      className={`flex items-start p-3 rounded-lg ${
        highlight
          ? "bg-indigo-50 border border-indigo-100"
          : "bg-gray-50 border border-gray-100"
      }`}
    >
      <div
        className={`p-2 rounded-full mr-3 shrink-0 ${
          highlight
            ? "bg-indigo-100 text-indigo-600"
            : "bg-white text-gray-500 shadow-sm"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-sm sm:text-base font-bold text-gray-900 truncate block">
          {value}
        </span>
        {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
      </div>
    </div>
  );

  // Determine status badge styling
  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const statusClasses = getStatusClasses(appointment.status);

  return (
    // Backdrop with blur
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      {/* Modal Content */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* --- Header --- */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                Appointment Details
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${statusClasses}`}
              >
                {appointment.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              ID: {appointment.appointmentId || "N/A"}
            </p>
          </div>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
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

        {/* --- Scrollable Body --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Section 1: Grid Layout for Patient & Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <IconUser className="w-4 h-4 text-indigo-500" /> Patient Info
              </h4>
              <div className="space-y-3">
                <InfoCard
                  icon={IconUser}
                  label="Patient Name"
                  value={appointment.patientName || "N/A"}
                  highlight={true}
                />
                <InfoCard
                  icon={IconEmail}
                  label="Email Address"
                  value={appointment.patientEmail || "N/A"}
                />
                <InfoCard
                  icon={IconPhone}
                  label="Phone Number"
                  value={appointment.patientPhone || "N/A"}
                />
              </div>
            </div>

            {/* Medical Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <IconDoctor className="w-4 h-4 text-indigo-500" /> Medical
                Details
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard
                    icon={IconCalendar}
                    label="Date"
                    value={new Date(appointment.date).toLocaleDateString()}
                  />
                  <InfoCard
                    icon={IconTime}
                    label="Time"
                    value={appointment.timeSlot}
                  />
                </div>
                <InfoCard
                  icon={IconDoctor}
                  label="Doctor"
                  value={appointment.doctor?.name || "N/A"}
                  subValue={appointment.doctor?.specialization}
                />
                <InfoCard
                  icon={IconService}
                  label="Service"
                  value={
                    appointment.services && appointment.services.length > 0
                      ? appointment.services.map((s) => s.name).join(", ")
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financials & Notes */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IconMoney className="w-4 h-4 text-emerald-600" /> Payment & Notes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{appointment.totalAmount || "0"}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Method</span>
                <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded border border-gray-200 inline-block">
                  {appointment.paymentOption || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Status</span>
                <span
                  className={`text-sm font-bold ${
                    appointment.paymentStatus === "Paid"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {appointment.paymentStatus || "Pending"}
                </span>
              </div>
            </div>

            {/* Notes Area */}
            {appointment.notes && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex gap-3">
                  <IconNotes className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Doctor Notes
                    </span>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed italic">
                      "{appointment.notes}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer / Actions --- */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* WhatsApp Button */}
            {appointment.patientPhone && (
              <a
                href={`https://wa.me/${appointment.patientPhone}?text=Hello%20${
                  appointment.patientName
                },%20regarding%20your%20appointment%20on%20${new Date(
                  appointment.date
                ).toLocaleDateString()}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl shadow-sm hover:shadow-md transition-all font-semibold group"
              >
                <IconWhatsApp className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                WhatsApp
              </a>
            )}

            {/* View Report Button */}
            {appointment.appointmentId && (
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  navigate(`/admin/reports/${appointment.appointmentId}`);
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow-lg shadow-indigo-200 transition-all font-semibold"
              >
                View Report
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailsModal;
