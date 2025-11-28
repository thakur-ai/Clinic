import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Calendar, Phone, Mail, 
  FileText, Activity, Clock, 
  ChevronRight, Stethoscope, ArrowLeft, Download, LogOut, Edit, Save, X, Trash2, LayoutDashboard
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

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : '',
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Logout admin
    navigate('/admin/login'); // Redirect to admin login page
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="text-4xl text-indigo-500 animate-pulse mb-3" />
          <p className="text-lg text-gray-600">Loading medical report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h1>
          <p className="text-red-500">Could not fetch report: {error.message}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-4 text-sm bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200 transition"
          >
            Clear Error
          </button>
          <button 
            onClick={fetchAppointmentData} 
            className="mt-4 ml-2 text-sm bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentReportId || !primaryAppointment) { 
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center justify-center">
         <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-2xl text-center">
            <LayoutDashboard className="text-5xl text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">View Medical Reports</h2>
            <p className="text-gray-600 mb-6">
              {currentReportId && !primaryAppointment 
                ? `No report found for ID: ${currentReportId}. Please try again.`
                : 'Please enter a patient or report ID to view their medical history and treatment details.'}
            </p>
            <div className="flex space-x-3">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="Enter Report ID (e.g., UUID or MongoDB _id)"
                value={inputtedId}
                onChange={(e) => setInputtedId(e.target.value)}
              />
              <button
                onClick={handleFetchReport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                <FileText size={18} />
                <span>Fetch Report</span>
              </button>
            </div>
         </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ReportHeader 
          reportId={primaryAppointment?.appointmentId} 
          patientName={primaryAppointment?.patientName}
          handleLogout={handleLogout}
          showActions={true} 
          onDeleteReport={handleDeleteReport}
          onRebookAppointment={() => setIsReappointmentModalOpen(true)}
        />

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-1 space-y-6">
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

          <div className="lg:col-span-2 space-y-6 mt-6 lg:mt-0">
            <AppointmentTimelineSection appointmentsData={appointmentsData} />

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
