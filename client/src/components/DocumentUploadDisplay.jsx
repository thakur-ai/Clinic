import React, { useState } from 'react';
import { UploadCloud, FileText, XCircle, Download } from 'lucide-react';

const DocumentUploadDisplay = ({ appointmentId, initialDocuments = [], isAdmin, onDocumentUploadSuccess }) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null);
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      alert('Please select a document to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/appointments/${appointmentId}/upload-document`, {
        method: 'PATCH',
        headers: {
          ...(localStorage.getItem('adminToken') && { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` })
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data.appointment.documents); // Assuming backend returns updated documents array
      setSelectedFile(null); // Clear the selected file input
      onDocumentUploadSuccess && onDocumentUploadSuccess(); // Callback to refresh parent data
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const serverBaseUrl = `${process.env.REACT_APP_API_BASE_URL}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center space-x-2 mb-5 border-b border-gray-100 pb-3">
        <FileText className="text-emerald-600" size={20} />
        <h2 className="text-lg font-bold text-gray-800">Uploaded Documents</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-5">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <a 
              key={index} 
              href={`${serverBaseUrl}${doc.path}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg active:bg-gray-100 hover:bg-white hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="flex-shrink-0 p-2 rounded bg-white text-gray-500 border border-gray-100 group-hover:text-blue-600 shadow-sm">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-blue-700">{doc.name}</p>
                  <p className="text-xs text-gray-400">{(doc.type || 'Document')} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <Download size={16} className="text-gray-300 flex-shrink-0 group-hover:text-blue-500" />
            </a>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic col-span-full">No documents uploaded yet.</p>
        )}
      </div>

      {isAdmin && (
        <div className="border-t border-gray-100 pt-5 mt-5">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Upload New Document</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="file"
              id="documentUpload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="documentUpload"
              className="flex-1 cursor-pointer bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              <UploadCloud size={16} className="mr-2" /> {selectedFile ? selectedFile.name : 'Select Document'}
            </label>
            {selectedFile && (
              <button
                onClick={uploadDocument}
                className="flex-1 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </button>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <XCircle size={16} className="mr-1" /> Error: {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadDisplay;
