import React, { useState } from 'react';
import { UploadCloud, XCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';

const ImageUploadDisplay = ({ appointmentId, initialBeforeImage, initialAfterImage, isAdmin, onImageUploadSuccess }) => {
  const [beforeImage, setBeforeImage] = useState(initialBeforeImage);
  const [afterImage, setAfterImage] = useState(initialAfterImage);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [loadingBefore, setLoadingBefore] = useState(false);
  const [loadingAfter, setLoadingAfter] = useState(false);
  const [errorBefore, setErrorBefore] = useState(null);
  const [errorAfter, setErrorAfter] = useState(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'before') {
      setBeforeFile(file);
      setErrorBefore(null);
    } else {
      setAfterFile(file);
      setErrorAfter(null);
    }
  };

  const uploadImage = async (type) => {
    if ((type === 'before' && !beforeFile) || (type === 'after' && !afterFile)) {
      alert('Please select an image to upload.');
      return;
    }

    const setLoading = type === 'before' ? setLoadingBefore : setLoadingAfter;
    const setError = type === 'before' ? setErrorBefore : setErrorAfter;
    const fileToUpload = type === 'before' ? beforeFile : afterFile;
    const endpoint = type === 'before' ? `/api/admin/appointments/${appointmentId}/upload-before-image` : `/api/admin/appointments/${appointmentId}/upload-after-image`;
    const formDataKey = type === 'before' ? 'beforeTreatmentImage' : 'afterTreatmentImage';
    const setImage = type === 'before' ? setBeforeImage : setAfterImage;
    const setFile = type === 'before' ? setBeforeFile : setAfterFile;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append(formDataKey, fileToUpload);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
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
      if (type === 'before') {
        setImage(data.appointment.beforeTreatmentImage);
      } else {
        setImage(data.appointment.afterTreatmentImage);
      }
      setFile(null); 
      onImageUploadSuccess && onImageUploadSuccess(); 
    } catch (err) {
      console.error(`Error uploading ${type} image:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const serverBaseUrl = `${process.env.REACT_APP_API_BASE_URL}`; 

  // Helper component for the image card to avoid repetition in UI
  const ImageSection = ({ title, image, file, loading, error, type }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${type === 'before' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>

      <div className={`group relative w-full aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden transition-all duration-300 ${!image ? 'border-2 border-dashed border-slate-300 hover:border-purple-300' : 'border border-slate-200 shadow-sm'}`}>
        {image ? (
          <div className="relative w-full h-full">
            <img 
              src={`${serverBaseUrl}${image}`} 
              alt={title} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
            />
            {/* Overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
             <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                <ImageIcon size={24} className="text-slate-300" />
             </div>
             <span className="text-xs font-medium">No Image Uploaded</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mt-4 space-y-3">
          <input
            type="file"
            id={`${type}ImageUpload`}
            accept="image/*"
            onChange={(e) => handleFileChange(e, type)}
            className="hidden"
          />
          <label
            htmlFor={`${type}ImageUpload`}
            className={`w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 text-sm font-semibold
              ${file 
                ? 'bg-purple-50 border-purple-200 text-purple-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
          >
            {file ? (
              <span className="truncate max-w-[200px]">{file.name}</span>
            ) : (
              <>
                <UploadCloud size={16} />
                <span>Select Photo</span>
              </>
            )}
          </label>

          {file && (
            <button
              onClick={() => uploadImage(type)}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md shadow-purple-200 transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                 <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Uploading...
                 </span>
              ) : (
                 'Confirm Upload'
              )}
            </button>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2 text-red-600 text-xs animate-in slide-in-from-top-2">
              <XCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
           <UploadCloud size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Treatment Gallery</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          {/* Desktop Arrow Divider */}
          <div className="hidden md:flex absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-sm border border-slate-100 text-slate-300">
             <ArrowRight size={20} />
          </div>

          {/* Before Section */}
          <ImageSection 
             title="Before Treatment" 
             image={beforeImage} 
             file={beforeFile} 
             loading={loadingBefore} 
             error={errorBefore} 
             type="before" 
          />

          {/* After Section */}
          <ImageSection 
             title="After Treatment" 
             image={afterImage} 
             file={afterFile} 
             loading={loadingAfter} 
             error={errorAfter} 
             type="after" 
          />
          
        </div>
      </div>
    </div>
  );
};

export default ImageUploadDisplay;