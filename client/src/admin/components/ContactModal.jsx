import React from 'react';

const ContactModal = ({ isOpen, onClose, message, title = "Message Received" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 ease-in-out
                   max-w-sm md:max-w-md w-full my-8 border-t-4 border-blue-500 dark:border-blue-400 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ maxHeight: '90vh' }}
      >
        
        <div className="flex items-start justify-between border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-2xl font-extrabold text-gray-800 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="text-gray-700 dark:text-gray-300 overflow-y-auto max-h-80 mb-6">
          <p className="whitespace-pre-wrap leading-relaxed">
            {message || "No message content provided."}
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition duration-150 ease-in-out font-medium text-base"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
//esrdtfg
export default ContactModal;
