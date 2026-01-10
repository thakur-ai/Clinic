import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FileText, LayoutDashboard, Search, ShieldCheck 
} from 'lucide-react'; 
import ReappointmentModal from './components/ReappointmentModal';
import ImageUploadDisplay from '../components/ImageUploadDisplay'; 
import DocumentUploadDisplay from '../components/DocumentUploadDisplay'; 
import ReportHeader from '../components/ReportHeader';
import PatientProfileCard from '../components/PatientProfileCard';
import MedicalHistorySection from '../components/MedicalHistorySection';
import AppointmentTimelineSection from '../components/AppointmentTimelineSection';

const AdminReportPage = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [isAdmin] = useState(true); 

  const [beforeTreatmentImage, setBeforeTreatmentImage] = useState(null);
  const [afterTreatmentImage, setAfterTreatmentImage] = useState(null);
  const [documents, setDocuments] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : '',
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); 
    navigate('/admin/login'); 
  };

  const [inputtedId, setInputtedId] = useState('');
  const [currentReportId, setCurrentReportId] = useState(reportId || null); 

  const [appointmentsData, setAppointmentsData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReappointmentModalOpen, setIsReappointmentModalOpen] = useState(false);

  const primaryAppointment = appointmentsData.length > 0 ? appointmentsData[0] : null;

  const [isEditingPatientDetails, setIsEditingPatientDetails] = useState(false);
  const [editablePatientName, setEditablePatientName] = useState('');
  const [editablePatientEmail, setEditablePatientEmail] = useState('');
  const [editablePatientPhone, setEditablePatientPhone] = useState('');
  const [editableDate, setEditableDate] = useState('');
  const [editableService, setEditableService] = useState(''); 
  const [editableDoctor, setEditableDoctor] = useState(''); 
  const [editableStatus, setEditableStatus] = useState('');

  const [isEditingMedicalHistory, setIsEditingMedicalHistory] = useState(false);
  const [editableDentalProblems, setEditableDentalProblems] = useState([]);
  const [editableTreatments, setEditableTreatments] = useState([]);
  const [editableMedications, setEditableMedications] = useState('');

  // --- Logic Handlers (Unchanged) ---
  const handleEditPatientDetails = () => {
    if (primaryAppointment) { 
      setEditablePatientName(primaryAppointment.patientName || '');
      setEditablePatientEmail(primaryAppointment.patientEmail || '');
      setEditablePatientPhone(primaryAppointment.patientPhone || '');
      setEditableDate(primaryAppointment.date ? new Date(primaryAppointment.date).toISOString().split('T')[0] : '');
      setEditableService(primaryAppointment.service?.name || ''); 
      setEditableDoctor(primaryAppointment.doctor?.name || ''); 
      setEditableStatus(primaryAppointment.status || '');
    }
    setIsEditingPatientDetails(true);
  };

  const handleCancelEditPatientDetails = () => {
    setIsEditingPatientDetails(false);
    if (primaryAppointment) { 
      setEditablePatientName(primaryAppointment.patientName || '');
      setEditablePatientEmail(primaryAppointment.patientEmail || '');
      setEditablePatientPhone(primaryAppointment.patientPhone || '');
      setEditableDate(primaryAppointment.date ? new Date(primaryAppointment.date).toISOString().split('T')[0] : '');
      setEditableService(primaryAppointment.service?.name || '');
      setEditableDoctor(primaryAppointment.doctor?.name || '');
      setEditableStatus(primaryAppointment.status || '');
    }
  };

  const handleSavePatientDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!primaryAppointment) throw new Error('No primary appointment to update.');

      const response = await fetch(`${API_BASE_URL}/admin/appointments/${primaryAppointment.appointmentId}`, { 
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patientName: editablePatientName,
          patientEmail: editablePatientEmail,
          patientPhone: editablePatientPhone,
          date: editableDate,
          service: editableService, 
          doctor: editableDoctor,   
          status: editableStatus === 'confirmed' ? 'Approved' : editableStatus.charAt(0).toUpperCase() + editableStatus.slice(1),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchAppointmentData(); 
      setIsEditingPatientDetails(false); 
    } catch (err) {
      console.error('Error saving patient details:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedicalHistory = () => {
    if (primaryAppointment && primaryAppointment.medicalHistory) {
      setEditableDentalProblems(primaryAppointment.medicalHistory.dentalProblems || []);
      setEditableTreatments(primaryAppointment.medicalHistory.treatments || []);
      setEditableMedications(primaryAppointment.medicalHistory.medications || '');
    }
    setIsEditingMedicalHistory(true);
  };

  const handleCancelEditMedicalHistory = () => {
    setIsEditingMedicalHistory(false);
    if (primaryAppointment && primaryAppointment.medicalHistory) {
      setEditableDentalProblems(primaryAppointment.medicalHistory.dentalProblems || []);
      setEditableTreatments(primaryAppointment.medicalHistory.treatments || []);
      setEditableMedications(primaryAppointment.medicalHistory.medications || '');
    }
  };

  const handleSaveMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!primaryAppointment) throw new Error('No primary appointment to update medical history.');

      const response = await fetch(`${API_BASE_URL}/admin/appointments/${primaryAppointment.appointmentId}/medical-history`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          medicalHistory: {
            dentalProblems: editableDentalProblems,
            treatments: editableTreatments,
            medications: editableMedications,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchAppointmentData();
      setIsEditingMedicalHistory(false);
    } catch (err) {
      console.error('Error saving medical history:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (!primaryAppointment) throw new Error('No primary appointment to delete.');

      const response = await fetch(`${API_BASE_URL}/admin/appointments/${primaryAppointment.appointmentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate('/admin/dashboard'); 
    } catch (err) {
      console.error('Error deleting report:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportId && reportId !== currentReportId) {
      setCurrentReportId(reportId);
      setInputtedId(reportId);
    }
  }, [reportId, currentReportId]);

  const fetchAppointmentData = async () => { 
    if (!currentReportId) {
      setAppointmentsData([]); 
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let response;
      let data;

      response = await fetch(`${API_BASE_URL}/admin/appointments/${currentReportId}`, {
        headers: getAuthHeaders(),
      });

        if (response.ok) {
          data = await response.json();
          const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime(); 
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); 
          });
          setAppointmentsData(sortedData);
          setBeforeTreatmentImage(sortedData[0]?.beforeTreatmentImage || null);
          setAfterTreatmentImage(sortedData[0]?.afterTreatmentImage || null);
          setDocuments(sortedData[0]?.documents || []); 
        } else if (response.status === 404) {
          console.log(`Appointments with UUID ${currentReportId} not found, attempting to fetch by MongoDB _id.`);
          response = await fetch(`${API_BASE_URL}/admin/appointments/mongo-id/${currentReportId}`, {
            headers: getAuthHeaders(),
          });

          if (response.ok) {
            data = await response.json();
            const sortedData = [data].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateB.getTime() !== dateA.getTime()) {
                    return dateB.getTime() - dateA.getTime();
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setAppointmentsData(sortedData);
            setBeforeTreatmentImage(sortedData[0]?.beforeTreatmentImage || null);
            setAfterTreatmentImage(sortedData[0]?.afterTreatmentImage || null);
            setDocuments(sortedData[0]?.documents || []); 
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (err) {
      console.error('Error in fetchAppointmentData:', err);
      setError(err);
      setAppointmentsData([]); 
      setDocuments([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAppointmentData();
  }, [currentReportId]);

  const handleFetchReport = () => {
    setCurrentReportId(inputtedId);
    navigate(`/admin/reports/${inputtedId}`);
  };

  // --- Rendering UI ---

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center animate-pulse">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-lg">
             <LayoutDashboard size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-700">Loading Records...</h2>
          <p className="text-slate-500 text-sm mt-1">Please wait while we fetch the patient data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
             <ShieldCheck size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Report</h1>
          <p className="text-gray-500 mb-6 bg-red-50 p-3 rounded-lg text-sm border border-red-100 font-mono">
            {error.message}
          </p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => setError(null)} 
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={fetchAppointmentData} 
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md shadow-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- State: No Report Selected (Landing View) ---
  if (!currentReportId || !primaryAppointment) { 
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
         </div>

         <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-white overflow-hidden relative z-10 transform transition-all hover:scale-[1.01]">
            
            {/* Card Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-8 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                    <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-inner ring-1 ring-white/30">
                        <LayoutDashboard size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Admin Portal</h2>
                    <p className="text-indigo-100 text-sm mt-1">Search and manage patient records</p>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                        Report ID
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                            placeholder="e.g. UUID or Mongo ID"
                            value={inputtedId}
                            onChange={(e) => setInputtedId(e.target.value)}
                        />
                    </div>
                    {currentReportId && !primaryAppointment && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Report not found. Please verify the ID.
                        </p>
                    )}
                </div>

                <button
                    onClick={handleFetchReport}
                    disabled={!inputtedId}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                        inputtedId 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                >
                    <FileText size={20} />
                    <span>Retrieve Records</span>
                </button>
                
                <div className="mt-6 text-center">
                    <button onClick={handleLogout} className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors">
                        Sign Out
                    </button>
                </div>
            </div>
         </div>
      </div>
    );
  }
  
  // --- Main Report View ---
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30">
        <ReportHeader 
            reportId={primaryAppointment?.appointmentId} 
            patientName={primaryAppointment?.patientName}
            handleLogout={handleLogout}
            showActions={true} 
            onDeleteReport={handleDeleteReport}
            onRebookAppointment={() => setIsReappointmentModalOpen(true)}
            primaryAppointment={primaryAppointment} // Added prop to support new Header design
            isAdmin={isAdmin} // Added prop
            navigate={navigate} // Added prop
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Patient Info & History */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <PatientProfileCard
              primaryAppointment={primaryAppointment}
              isEditingPatientDetails={isEditingPatientDetails}
              editablePatientName={editablePatientName}
              setEditablePatientName={setEditablePatientName}
              editablePatientEmail={editablePatientEmail}
              setEditablePatientEmail={setEditablePatientEmail}
              editablePatientPhone={editablePatientPhone}
              setEditablePatientPhone={setEditablePatientPhone}
              editableDate={editableDate}
              setEditableDate={setEditableDate}
              editableService={editableService}
              setEditableService={setEditableService}
              editableDoctor={editableDoctor}
              setEditableDoctor={setEditableDoctor}
              editableStatus={editableStatus}
              setEditableStatus={setEditableStatus}
              handleEditPatientDetails={handleEditPatientDetails}
              handleSavePatientDetails={handleSavePatientDetails}
              handleCancelEditPatientDetails={handleCancelEditPatientDetails}
            />

            <MedicalHistorySection
              primaryAppointment={primaryAppointment}
              isAdmin={isAdmin}
              isEditingMedicalHistory={isEditingMedicalHistory}
              editableDentalProblems={editableDentalProblems}
              setEditableDentalProblems={setEditableDentalProblems}
              editableTreatments={editableTreatments}
              setEditableTreatments={setEditableTreatments}
              editableMedications={editableMedications}
              setEditableMedications={setEditableMedications}
              handleEditMedicalHistory={handleEditMedicalHistory}
              handleSaveMedicalHistory={handleSaveMedicalHistory}
              handleCancelEditMedicalHistory={handleCancelEditMedicalHistory}
            />
          </div>

          {/* Right Column: Timeline & Media */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <AppointmentTimelineSection 
                appointmentsData={appointmentsData}
                // Pass handlers if you have them, otherwise just display
                handleRescheduleClick={(app) => console.log('Reschedule', app)}
                handleRebookClick={(app) => {
                    setIsReappointmentModalOpen(true);
                    // You might want to set specific patient data here if rebooking a specific historical slot
                }} 
            />

            <div className="grid grid-cols-1 gap-8">
                <DocumentUploadDisplay
                    appointmentId={primaryAppointment?._id}
                    initialDocuments={documents}
                    isAdmin={isAdmin}
                    onDocumentUploadSuccess={fetchAppointmentData}
                />

                <ImageUploadDisplay
                    appointmentId={primaryAppointment?._id} 
                    initialBeforeImage={beforeTreatmentImage}
                    initialAfterImage={afterTreatmentImage}
                    isAdmin={isAdmin}
                    onImageUploadSuccess={fetchAppointmentData}
                />
            </div>
          </div>
        </div>
      </div>

      {primaryAppointment && ( 
          <ReappointmentModal
              isOpen={isReappointmentModalOpen}
              onClose={() => setIsReappointmentModalOpen(false)}
              patientData={primaryAppointment} 
              onAppointmentBooked={(newAppointment) => {
                  console.log('New appointment booked:', newAppointment);
                  setIsReappointmentModalOpen(false);
                  fetchAppointmentData(); 
              }}
          />
      )}
    </div>
  );
};

export default AdminReportPage;