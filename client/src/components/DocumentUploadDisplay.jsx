import React, { useState } from 'react';
import { UploadCloud, FileText, XCircle, Download, FilePlus, CheckCircle2 } from 'lucide-react';

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
      setDocuments(data.appointment.documents); 
      setSelectedFile(null); 
      onDocumentUploadSuccess && onDocumentUploadSuccess(); 
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const serverBaseUrl = `${process.env.REACT_APP_API_BASE_URL}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
           <FileText size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Uploaded Documents</h2>
      </div>

      <div className="p-6">
        
        {/* Document List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <a 
                key={index} 
                href={`${serverBaseUrl}${doc.path}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100/50 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-emerald-700 transition-colors">
                        {doc.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                        {(doc.type || 'PDF')} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Unknown Date'}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                    <Download size={16} />
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-slate-300">
                  <FileText size={24} />
               </div>
               <p className="text-sm font-medium text-slate-500">No documents uploaded yet.</p>
            </div>
          )}
        </div>

        {/* Upload Section (Admin Only) */}
        {isAdmin && (
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Upload New File</h3>
            
            <div className="flex flex-col gap-3">
              <input
                type="file"
                id="documentUpload"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Custom File Select Button */}
                <label
                    htmlFor="documentUpload"
                    className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all duration-200 text-sm font-semibold
                    ${selectedFile 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-emerald-600'
                    }`}
                >
                    {selectedFile ? (
                        <>
                           <CheckCircle2 size={18} />
                           <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                        </>
                    ) : (
                        <>
                           <FilePlus size={18} />
                           <span>Choose File</span>
                        </>
                    )}
                </label>

                {/* Upload Action Button */}
                {selectedFile && (
                    <button
                        onClick={uploadDocument}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-md shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <UploadCloud size={18} />
                                <span>Upload Now</span>
                            </>
                        )}
                    </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2 text-red-600 text-xs animate-in slide-in-from-top-1">
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadDisplay;