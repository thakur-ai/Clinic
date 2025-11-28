import React, { useState } from 'react';
import { UploadCloud, XCircle } from 'lucide-react';

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
          ...(localStorage.getItem('adminToken') && { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }) // Only add if token exists
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Update the displayed image URL with the new path from the backend
      if (type === 'before') {
        setImage(data.appointment.beforeTreatmentImage);
      } else {
        setImage(data.appointment.afterTreatmentImage);
      }
      setFile(null); // Clear the selected file input
      onImageUploadSuccess && onImageUploadSuccess(); // Callback to refresh parent data if needed
    } catch (err) {
      console.error(`Error uploading ${type} image:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const serverBaseUrl = `${process.env.REACT_APP_API_BASE_URL}`; // Define your backend server base URL

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center space-x-2 mb-5 border-b border-gray-100 pb-3">
        <UploadCloud className="text-purple-600" size={20} />
        <h2 className="text-lg font-bold text-gray-800">Before & After Images</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before Image Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-3">Before Treatment</h3>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
            {beforeImage ? (
              <img src={`${serverBaseUrl}${beforeImage}`} alt="Before Treatment" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400 text-sm">No Before Image</span>
            )}
          </div>
          {isAdmin && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                id="beforeImageUpload"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'before')}
                className="hidden"
              />
              <label
                htmlFor="beforeImageUpload"
                className="flex-1 cursor-pointer bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
              >
                <UploadCloud size={16} className="mr-2" /> Select Before Image
              </label>
              {beforeFile && (
                <button
                  onClick={() => uploadImage('before')}
                  className="flex-1 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  disabled={loadingBefore}
                >
                  {loadingBefore ? 'Uploading...' : 'Upload Before Image'}
                </button>
              )}
            </div>
          )}
          {errorBefore && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <XCircle size={16} className="mr-1" /> Error: {errorBefore}
            </p>
          )}
        </div>

        {/* After Image Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-3">After Treatment</h3>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
            {afterImage ? (
              <img src={`${serverBaseUrl}${afterImage}`} alt="After Treatment" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400 text-sm">No After Image</span>
            )}
          </div>
          {isAdmin && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                id="afterImageUpload"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'after')}
                className="hidden"
              />
              <label
                htmlFor="afterImageUpload"
                className="flex-1 cursor-pointer bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
              >
                <UploadCloud size={16} className="mr-2" /> Select After Image
              </label>
              {afterFile && (
                <button
                  onClick={() => uploadImage('after')}
                  className="flex-1 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  disabled={loadingAfter}
                >
                  {loadingAfter ? 'Uploading...' : 'Upload After Image'}
                </button>
              )}
            </div>
          )}
          {errorAfter && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <XCircle size={16} className="mr-1" /> Error: {errorAfter}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadDisplay;
