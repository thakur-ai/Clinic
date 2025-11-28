import React from 'react';
import { useNavigate } from 'react-router-dom';

// Centralized icon components (omitted for brevity, assume they are included)
const IconCalendar = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconTime = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconDoctor = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11l9 3-9 3-9-3 9-3zm0 0V3m0 8v8m0-8h8m-8 0H4" /></svg>;
const IconService = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const IconUser = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconEmail = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconPhone = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.05 11.05 0 008.25-2.257l1.128-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg>;
const IconMoney = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0l-3 3m3-3l3 3m-4.5-9A1.5 1.5 0 0117 11.5v-1a1.5 1.5 0 01-1.5 1.5H12a1.5 1.5 0 01-1.5-1.5V10c0-.828.672-1.5 1.5-1.5h1.5A1.5 1.5 0 0115 10v1m-4.5-1.5a1.5 1.5 0 013 0M10 18H5a2 2 0 01-2-2v-3" /></svg>;
const IconStatus = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.106a2.19 2.19 0 00-1.077-.75l-4.555-1.767A2.583 2.583 0 0012 2a2.583 2.583 0 00-2.31 1.377L5.459 5.144a2.19 2.19 0 00-1.077.75A2 2 0 003 7.854v8.292a2 2 0 00.382 1.056l4.555 1.767A2.583 2.583 0 0012 22a2.583 2.583 0 002.31-1.377l4.555-1.767a2.19 2.19 0 001.077-.75A2 2 0 0021 16.146V7.854a2 2 0 00-.382-1.056z" /></svg>;
const IconNotes = ({ className = "h-5 w-5" }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const IconWhatsApp = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C7.34 2 3.56 5.78 3.56 10.48c0 1.95.63 3.82 1.77 5.46L2 22l6.02-1.58c1.5-.89 3.23-1.37 5.02-1.37 4.71 0 8.49-3.78 8.49-8.49S16.75 2 12.04 2zm.01 1.67c3.89 0 7.05 3.16 7.05 7.05 0 3.89-3.16 7.05-7.05 7.05-1.77 0-3.46-.64-4.8-1.76l-.34-.2-3.56.93 1-3.47-.23-.35c-1.16-1.74-1.77-3.75-1.77-5.8 0-3.89 3.16-7.05 7.05-7.05zm-4.33 4.54c-.2.01-.49.03-.71.3-.2.25-.77.93-.77 2.25s.79 2.61.9 2.8.2.2.41.2c.21 0 .58-.08.79-.35s.71-.84.99-.95c.29-.12.59-.01.81.25s.98 1.18 1.18 1.48c.2.3.27.42.47.54.21.12.4.08.57-.02.2-.1.85-.35 1.61-1.32.77-.97 1.02-1.73 1.05-1.8.03-.07.2-.2.14-.3-.06-.1-.23-.37-.32-.56-.08-.2-.05-.16-.12-.3-.07-.12-.52-1.25-.72-1.71-.2-.46-.16-.39-.4-.39-.24 0-.52-.01-.79-.01-.27 0-.7.1-.96.35s-1 1-.96 1.07zm0 0z" />
  </svg>
);


function AppointmentDetailsModal({ showDetailsModal, setShowDetailsModal, appointment }) {
  const navigate = useNavigate();
  if (!showDetailsModal || !appointment) return null;

  // Helper function to render a detail row with a label and value
  const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start text-sm sm:text-base">
      <div className="text-indigo-500 mr-3 mt-0.5 flex-shrink-0"><Icon className="h-5 w-5" /></div>
      <p className="flex-grow min-w-0 break-words">
        <strong className="text-gray-600 mr-2">{label}:</strong>
        <span className="text-gray-800 font-medium">{value}</span>
      </p>
    </div>
  );

  // Determine status badge styling
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const statusClasses = getStatusClasses(appointment.status);

  return (
    // Backdrop
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10 sm:items-center p-4">
      
      {/* Modal Content */}
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-xl w-full transition-all duration-300 ease-in-out border-t-8 border-indigo-600 my-auto transform overflow-y-auto"
        // Ensure modal itself scrolls if content exceeds screen height, especially on mobile
        style={{ maxHeight: '90vh' }}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Appointment Details</h3>
                <p className="text-xs font-mono text-gray-500 mt-1">ID: {appointment.appointmentId || 'N/A'}</p>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-indigo-600 focus:outline-none transition duration-150 ease-in-out p-1 ml-4"
              aria-label="Close"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Content Area */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>

          {/* Appointment/Time Info */}
          <section className="space-y-4">
            <h4 className="text-lg font-semibold text-indigo-600 border-b pb-1">📅 Time & Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow 
                icon={IconCalendar} 
                label="Date" 
                value={new Date(appointment.date).toLocaleDateString()}
              />
              <DetailRow 
                icon={IconTime} 
                label="Time" 
                value={appointment.timeSlot}
              />
            </div>
            {/* Status is a key element, make it stand out */}
            <div className="pt-2 flex items-center justify-start">
                <strong className="text-gray-600 mr-4 text-base hidden sm:inline">Status:</strong>
                <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold tracking-wide shadow-sm border uppercase ${statusClasses}`}
                >
                    {appointment.status}
                </span>
            </div>
          </section>
          
          <hr className="border-gray-100" />
          
          {/* Doctor & Service Info */}
          <section className="space-y-4">
            <h4 className="text-lg font-semibold text-indigo-600 border-b pb-1">🩺 Service Details</h4>
            <DetailRow 
              icon={IconDoctor} 
              label="Doctor" 
              value={`${appointment.doctor?.name || 'N/A'} (${appointment.doctor?.specialization || 'N/A'})`}
            />
            {appointment.services && appointment.services.length > 0 ? (
              appointment.services.map((service, index) => (
                <DetailRow 
                  key={service._id || index}
                  icon={IconService} 
                  label={`Service ${appointment.services.length > 1 ? index + 1 : ''}`} 
                  value={service.name || 'N/A'}
                />
              ))
            ) : (
              <DetailRow 
                icon={IconService} 
                label="Service" 
                value="N/A"
              />
            )}
          </section>

          <hr className="border-gray-100" />

          {/* Patient Info */}
          <section className="space-y-4">
            <h4 className="text-lg font-semibold text-indigo-600 border-b pb-1">👤 Patient Information</h4>
            <DetailRow 
              icon={IconUser} 
              label="Name" 
              value={appointment.patientName || 'N/A'}
            />
            <DetailRow 
              icon={IconEmail} 
              label="Email" 
              value={appointment.patientEmail || 'N/A'}
            />
            <DetailRow 
              icon={IconPhone} 
              label="Phone" 
              value={appointment.patientPhone || 'N/A'}
            />
          </section>

          <hr className="border-gray-100" />

          {/* Payment Info */}
          <section className="space-y-4">
            <h4 className="text-lg font-semibold text-indigo-600 border-b pb-1">💵 Payment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow 
                icon={IconMoney} 
                label="Total Amount" 
                value={`₹${appointment.totalAmount || 'N/A'}`}
              />
              <DetailRow 
                icon={IconMoney} 
                label="Payment Option" 
                value={appointment.paymentOption || 'N/A'}
              />
            </div>
            <DetailRow 
              icon={IconStatus} 
              label="Payment Status" 
              value={appointment.paymentStatus || 'N/A'}
            />
          </section>
          
          {/* Notes Section (Optional) */}
          {appointment.notes && (
            <>
                <hr className="border-gray-100" />
                <section className="space-y-2">
                    <h4 className="text-lg font-semibold text-indigo-600 border-b pb-1">📝 Notes</h4>
                    <p className="flex items-start text-sm sm:text-base p-3 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner">
                        {appointment.notes}
                    </p>
                </section>
            </>
          )}

          {/* Actions - Integrated directly into main content */}
          <hr className="border-gray-100" /> {/* Add a separator */}
          <section className="space-y-4">
              <h4 className="text-lg font-semibold text-indigo-600 border-b pb-1">Actions</h4>
              <div className="flex flex-col gap-3">
                  {appointment.patientPhone && (
                  <a
                      href={`https://wa.me/${appointment.patientPhone}?text=Hello%20${appointment.patientName},%20regarding%20your%20appointment%20on%20${new Date(appointment.date).toLocaleDateString()}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-150 ease-in-out text-base font-medium"
                  >
                      <IconWhatsApp className="h-5 w-5 mr-2" />
                      Chat on WhatsApp
                  </a>
                  )}
                  {appointment.appointmentId && (
                  <button
                      onClick={() => {
                          setShowDetailsModal(false); 
                          navigate(`/admin/reports/${appointment.appointmentId}`);
                      }}
                      className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 ease-in-out text-base font-medium"
                  >
                      View Report
                  </button>
                  )}
                  <button
                      onClick={() => setShowDetailsModal(false)}
                      className="w-full px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-400 focus:outline-none transition duration-150 ease-in-out text-base font-medium"
                  >
                      Close
                  </button>
              </div>
          </section>

        </div>
      </div>
    </div>
  );
}
//dfcgh
export default AppointmentDetailsModal;
