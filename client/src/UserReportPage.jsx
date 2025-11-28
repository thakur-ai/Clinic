import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { 
  FileText, Repeat
} from 'lucide-react';
import ReappointmentModal from './admin/components/ReappointmentModal'; // Import ReappointmentModal
import RescheduleAppointmentModal from './admin/components/RescheduleAppointmentModal'; // Import RescheduleAppointmentModal
import ImageUploadDisplay from './components/ImageUploadDisplay'; // Import ImageUploadDisplay
import DocumentUploadDisplay from './components/DocumentUploadDisplay'; // Import DocumentUploadDisplay
import InfoRow from './components/InfoRow';
import Badge from './components/Badge';
import TimelineItem from './components/TimelineItem';
import useParallaxEffect from './hooks/useParallaxEffect';
import ReportLandingPage from './components/ReportLandingPage';
import ReportHeader from './components/ReportHeader';
import PatientProfileCard from './components/PatientProfileCard';
import MedicalHistorySection from './components/MedicalHistorySection';
import AppointmentTimelineSection from './components/AppointmentTimelineSection';

const UserReportPage = () => {
  const navigate = useNavigate();
  const { reportId } = useParams(); // Get reportId from URL parameters
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('userRole') === 'admin'); 

  // --- State Management ---
  const [beforeTreatmentImage, setBeforeTreatmentImage] = useState(null);
  const [afterTreatmentImage, setAfterTreatmentImage] = useState(null);
  const [documents, setDocuments] = useState([]);
  
  // Modals
  const [showReappointmentModal, setShowReappointmentModal] = useState(false);
  const [selectedAppointmentToRebook, setSelectedAppointmentToRebook] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentAppointmentForReschedule, setCurrentAppointmentForReschedule] = useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState(null);
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  // Data & Fetching
  const [inputtedId, setInputtedId] = useState('');
  const [currentReportId, setCurrentReportId] = useState(reportId || null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // History Features
  const [recentSearches, setRecentSearches] = useState([]);

  // Medical History Editing
  const [isEditingMedicalHistory, setIsEditingMedicalHistory] = useState(false);
  const [editableDentalProblems, setEditableDentalProblems] = useState([]);
  const [editableTreatments, setEditableTreatments] = useState([]);
  const [editableMedications, setEditableMedications] = useState('');

  const primaryAppointment = appointmentsData.length > 0 ? appointmentsData[0] : null;

  // Parallax/cursor effects
  const { mousePos, xOffset, yOffset } = useParallaxEffect(40, true); // Always active

  // --- Effects ---

  // 1. Role Check
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('userRole');
      setIsAdmin(updatedRole === 'admin');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 2. Load Recent Searches from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentReportSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // 3. Sync URL param to State
  useEffect(() => {
    if (reportId && reportId !== currentReportId) {
      setCurrentReportId(reportId);
      setInputtedId(reportId);
      addToRecentSearches(reportId); // Add to history when URL loads
    } else if (!reportId) {
      setCurrentReportId(null);
      setInputtedId('');
      setAppointmentsData([]);
    }
  }, [reportId, currentReportId, navigate]);

  // --- Helper Functions ---

  const addToRecentSearches = (id) => {
    if (!id) return;
    let history = JSON.parse(localStorage.getItem('recentReportSearches') || '[]');
    // Remove if exists (to move to top), limit to 3 items
    history = history.filter(item => item !== id);
    history.unshift(id);
    history = history.slice(0, 3);
    
    localStorage.setItem('recentReportSearches', JSON.stringify(history));
    setRecentSearches(history);
  };

  const clearRecentHistory = (e) => {
    e.stopPropagation();
    localStorage.removeItem('recentReportSearches');
    setRecentSearches([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // Main Fetch Logic
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

      // Attempt 1: UUID
      response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/${currentReportId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (response.ok) {
          data = await response.json();
          processData(data);
          return;
      } 
      
      // Attempt 2: Mongo ID (if 404)
      if (response.status === 404) {
          response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/mongo-id/${currentReportId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
          });

          if (response.ok) {
            data = await response.json();
            processData(data); // Wrap single object in array logic handled inside processData usually, but logic below handles single obj
            return;
          }
      }
      throw new Error(`Report not found (Status: ${response.status})`);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
      setAppointmentsData([]);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    // Normalize single object vs array
    const dataArray = Array.isArray(data) ? data : [data];
    
    const sortedData = dataArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateB.getTime() !== dateA.getTime()) return dateB.getTime() - dateA.getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setAppointmentsData(sortedData);
    setBeforeTreatmentImage(sortedData[0]?.beforeTreatmentImage || null);
    setAfterTreatmentImage(sortedData[0]?.afterTreatmentImage || null);
    setDocuments(sortedData[0]?.documents || []);
    
    // If successful, ensure it's in history
    addToRecentSearches(currentReportId);
  };

  // Trigger fetch when currentReportId changes
  useEffect(() => {
    fetchAppointmentData();
  }, [currentReportId]);

  const handleFetchReport = () => {
    if (inputtedId.trim()) {
      setCurrentReportId(inputtedId.trim());
      navigate(`/reports/${inputtedId.trim()}`); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleFetchReport();
    }
  };

  // --- Action Handlers (Edit, Reschedule, etc) ---
  // (Kept identical to your original code, collapsed for brevity in this snippet)
  const handleEditMedicalHistory = () => {
    if (primaryAppointment && primaryAppointment.medicalHistory) {
      setEditableDentalProblems(primaryAppointment.medicalHistory.dentalProblems || []);
      setEditableTreatments(primaryAppointment.medicalHistory.treatments || []);
      setEditableMedications(primaryAppointment.medicalHistory.medications || '');
    }
    setIsEditingMedicalHistory(true);
  };

  const handleCancelEditMedicalHistory = () => { setIsEditingMedicalHistory(false); };

  const handleSaveMedicalHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/${primaryAppointment.appointmentId}/medical-history`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          medicalHistory: {
            dentalProblems: editableDentalProblems,
            treatments: editableTreatments,
            medications: editableMedications,
          },
        }),
      });
      if (!response.ok) throw new Error('Failed to save');
      fetchAppointmentData();
      setIsEditingMedicalHistory(false);
    } catch (err) { setError(err); } finally { setLoading(false); }
  };

  const handleRebookClick = (appointment) => {
    setSelectedAppointmentToRebook(appointment);
    setShowReappointmentModal(true);
  };

  const handleRescheduleClick = (appointment) => {
    setCurrentAppointmentForReschedule(appointment);
    setNewRescheduleDate(appointment.date ? new Date(appointment.date) : null);
    setNewRescheduleTime(appointment.time || '');
    setShowRescheduleModal(true);
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/appointments/${currentAppointmentForReschedule.appointmentId}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          date: newRescheduleDate.toISOString(),
          time: newRescheduleTime,
        }),
      });
      if (!response.ok) throw new Error('Failed');
      fetchAppointmentData();
      setShowRescheduleModal(false);
    } catch (err) { setError(err); } finally { setLoading(false); }
  };

  const handleRebookSuccess = () => {
    setShowReappointmentModal(false);
    setSelectedAppointmentToRebook(null);
    fetchAppointmentData();
  };


  // ==================================================================================
  // RENDER: LOADING
  // ==================================================================================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg text-gray-600 font-medium">Retrieving records...</p>
      </div>
    );
  }

  // ==================================================================================
  // RENDER: LANDING / NO DATA STATE (With Parallax & Spotlight)
  // ==================================================================================
  
  if (error || !primaryAppointment) {
    return (
      <ReportLandingPage
        error={error}
        inputtedId={inputtedId}
        setInputtedId={setInputtedId}
        handleKeyDown={handleKeyDown}
        handleFetchReport={handleFetchReport}
        recentSearches={recentSearches}
        clearRecentHistory={clearRecentHistory}
        setCurrentReportId={setCurrentReportId}
      />
    );
  }

  // ==================================================================================
  // RENDER: MAIN REPORT CONTENT (NEW UI)
  // ==================================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white pb-10 font-sans text-gray-800 relative overflow-hidden selection:bg-blue-100">
      
      {/* --- 1. BACKGROUND EFFECTS LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        
        {/* Spotlight Gradient (Follows Mouse) */}
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.1), transparent 80%)`
          }}
        ></div>

        {/* Parallax Blob 1 (Blue) */}
        <div 
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] transition-transform duration-100 ease-out"
          style={{ transform: `translate(${xOffset * -1.5}px, ${yOffset * -1.5}px)` }}
        ></div>

        {/* Parallax Blob 2 (Indigo) */}
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] transition-transform duration-100 ease-out"
          style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
        ></div>
      </div>

      {/* --- 2. FOREGROUND CONTENT (Z-Index 10) --- */}
      <div className="relative z-10">
        
        {/* Header Section */}
        <ReportHeader primaryAppointment={primaryAppointment} isAdmin={isAdmin} navigate={navigate} handleLogout={handleLogout} />

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:space-y-6 lg:space-y-0">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            {/* Patient Profile Card */}
            <PatientProfileCard primaryAppointment={primaryAppointment} />

            {/* Medical History */}
            <MedicalHistorySection
              primaryAppointment={primaryAppointment}
              isAdmin={isAdmin}
              isEditingMedicalHistory={isEditingMedicalHistory}
              handleEditMedicalHistory={handleEditMedicalHistory}
              editableDentalProblems={editableDentalProblems}
              setEditableDentalProblems={setEditableDentalProblems}
              editableTreatments={editableTreatments}
              setEditableTreatments={setEditableTreatments}
              editableMedications={editableMedications}
              setEditableMedications={setEditableMedications}
              handleCancelEditMedicalHistory={handleCancelEditMedicalHistory}
              handleSaveMedicalHistory={handleSaveMedicalHistory}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointments Summary */}
            <AppointmentTimelineSection
              appointmentsData={appointmentsData}
              handleRescheduleClick={handleRescheduleClick}
              handleRebookClick={handleRebookClick}
            />

            <DocumentUploadDisplay
              appointmentId={primaryAppointment?._id}
              initialDocuments={documents}
              isAdmin={false} 
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
        
        {/* Modals */}
        {showReappointmentModal && selectedAppointmentToRebook && (
          <ReappointmentModal
            isOpen={showReappointmentModal}
            onClose={() => setShowReappointmentModal(false)}
            appointment={selectedAppointmentToRebook}
            onAppointmentBooked={handleRebookSuccess}
            patientData={primaryAppointment} 
          />
        )}

        <RescheduleAppointmentModal
          showRescheduleModal={showRescheduleModal}
          currentAppointmentForReschedule={currentAppointmentForReschedule}
          newRescheduleDate={newRescheduleDate}
          setNewRescheduleDate={setNewRescheduleDate}
          newRescheduleTime={newRescheduleTime}
          setNewRescheduleTime={setNewRescheduleTime}
          handleReschedule={handleReschedule}
          setShowRescheduleModal={setShowRescheduleModal}
          doctorHolidays={[]}
        />
      </div>
    </div>
  );
};


export default UserReportPage;
