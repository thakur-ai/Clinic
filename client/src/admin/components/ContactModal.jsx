import React from 'react';

const ContactModal = ({ isOpen, onClose, message, title = "Message Received" }) => {
  if (!isOpen) return null;

  return (
    // Backdrop: Modern blur effect with slate overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Modal Card */}
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ maxHeight: '90vh' }}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             {/* Decorative Icon Container */}
             <div className="bg-blue-50 p-2 rounded-full text-blue-600 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
             </div>
             <h2 id="modal-title" className="text-lg font-bold text-gray-900 leading-tight">
               {title}
             </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
             <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
               {message || "No message content provided."}
             </p>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg shadow-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <span>Acknowledge</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ContactModal;