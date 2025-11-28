import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../index.css'; // Ensure Tailwind CSS is properly imported for custom styles
import * as XLSX from 'xlsx'; // For Excel export

import AppointmentNotesModal from './components/AppointmentNotesModal';
import RescheduleAppointmentModal from './components/RescheduleAppointmentModal';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';
import { 
  FaCalendarAlt, FaFileExcel, FaClipboardList, FaEdit, 
  FaSyncAlt, FaCheckCircle, FaTimesCircle, FaInfoCircle, 
  FaClock, FaUserMd, FaUser, FaMoneyBillWave, FaSearch 
} from 'react-icons/fa'; // Import icons

function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Appointment Notes
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentAppointmentForNotes, setCurrentAppointmentForNotes] = useState(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // State for Appointment Rescheduling
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentAppointmentForReschedule, setCurrentAppointmentForReschedule] = useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState(null);
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  const [activeFilterTab, setActiveFilterTab] = useState('all'); // 'all', 'pending', 'completed', 'approved', 'today'
  const [filterDate, setFilterDate] = useState(null); // For specific date picking or set by 'today' tab
  const [filterId, setFilterId] = useState(''); // State for filtering by ID
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState(null);
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false);

  // Doctor holidays (mocked for completeness, should ideally be fetched)
  const [doctorHolidays, setDoctorHolidays] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api'; // Base URL for API

  // Helper to get auth headers for admin
  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : '',
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const authHeaders = getAuthHeaders();
      const appointmentsResponse = await fetch(`${API_BASE_URL}/appointments`, { headers: authHeaders });

      if (!appointmentsResponse.ok) throw new Error(`HTTP error! status: ${appointmentsResponse.status} for appointments`);

      const appointmentsData = await appointmentsResponse.json();
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Effect to handle 'today' filter type automatically setting filterDate and clearing others
  useEffect(() => {
    if (activeFilterTab === 'today') {
      setFilterDate(new Date());
    } else if (activeFilterTab === 'all') {
      setFilterDate(null); // Clear specific date if on 'all' tab
    }
    // Note: filterId is intentionally not cleared by activeFilterTab changes
  }, [activeFilterTab]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchData(); // Re-fetch appointments to get the updated list
    } catch (err) {
      setError(err.message);
    }
  };

  // Appointment Notes Handlers
  const openNotesModal = (appointment) => {
    setCurrentAppointmentForNotes(appointment);
    setAppointmentNotes(appointment.notes || '');
    setShowNotesModal(true);
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${currentAppointmentForNotes._id}/notes`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes: appointmentNotes }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setShowNotesModal(false);
      fetchData(); // Refresh list to show updated notes
    } catch (err) {
      setError(err.message);
    }
  };

  // Appointment Rescheduling Handlers
  const openRescheduleModal = (appointment) => {
    setCurrentAppointmentForReschedule(appointment);
    setNewRescheduleDate(new Date(appointment.date)); // Pre-fill with current date
    setNewRescheduleTime(appointment.timeSlot); // Pre-fill with current time
    setShowRescheduleModal(true);
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!newRescheduleDate || !newRescheduleTime) {
      alert('Please select a new date and time for rescheduling.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${currentAppointmentForReschedule._id}/reschedule`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          // Format date to YYYY-MM-DD
          date: `${newRescheduleDate.getFullYear()}-${String(newRescheduleDate.getMonth() + 1).padStart(2, '0')}-${String(newRescheduleDate.getDate()).padStart(2, '0')}`,
          timeSlot: newRescheduleTime,
          status: 'Rescheduled'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowRescheduleModal(false);
      fetchData(); // Re-fetch appointments to get the updated list
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtered Appointments for display
  const filteredAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    const today = new Date(); // For 'today' filter

    // Match by specific date from DatePicker
    const matchesDate = filterDate
      ? appDate.toDateString() === filterDate.toDateString()
      : true;
    
    // Match by ID
    const matchesId = filterId
      ? app.appointmentId.toLowerCase().includes(filterId.toLowerCase())
      : true;

    // Match by status filter based on activeFilterTab
    const matchesFilterTab = () => {
      switch (activeFilterTab) {
        case 'pending':
          return app.status === 'Pending';
        case 'completed':
          return app.status === 'Completed';
        case 'approved':
          return app.status === 'Approved';
        case 'today':
          return appDate.toDateString() === today.toDateString();
        case 'all':
        default:
          return true; // Show all appointments if filterType is 'all' or not set
      }
    };

    return matchesDate && matchesId && matchesFilterTab();
  });

  // Function to get status class
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Rescheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  // Export to Excel
  const exportToExcel = (data, fileName) => {
    const dataToExport = data.map(app => ({
      'Appointment ID': app.appointmentId,
      'Date': new Date(app.date).toLocaleDateString(),
      'Time': app.timeSlot,
      'Doctor': app.doctor?.name || 'N/A',
      'Patient Name': app.patientName,
      'Patient Email': app.patientEmail,
      'Patient Phone': app.patientPhone,
      'Total Amount': app.totalAmount,
      'Payment Option': app.paymentOption,
      'Payment Status': app.paymentStatus,
      'Status': app.status,
      'Notes': app.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <FaClipboardList className="text-4xl text-indigo-500 animate-pulse mb-3" />
          <p className="text-lg text-gray-600">Loading appointments data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h1>
          <p className="text-red-500">Could not fetch appointments: {error}</p>
          <button 
            onClick={fetchData} 
            className="mt-4 text-sm bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl min-h-screen py-4 sm:py-8">
        <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 px-4 pt-4 sm:px-8 sm:pt-8 mb-6 border-b-4 border-indigo-600 pb-3">
          <FaClipboardList className="inline-block mr-3 text-indigo-600" /> Appointment Management
        </h2>

        {/* Filter and Export Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-8 mb-6 space-y-4 md:space-y-0">
          
          {/* Status and Today Filters */}
          <div className="flex gap-1 overflow-x-auto p-1 w-full md:w-auto -mt-2">
            {['all', 'pending', 'completed', 'approved', 'today'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilterTab(filter)}
                className={`whitespace-nowrap px-2 py-0.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-lg font-medium transition duration-150 ease-in-out
                  ${activeFilterTab === filter
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 w-full md:w-auto min-w-0 mt-4 md:mt-0">
            <label className="text-xs sm:text-base font-semibold text-gray-700 whitespace-nowrap">Filter by Date:</label>
            <div className="relative w-full max-w-xs">
              <DatePicker
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
                dateFormat="PPP"
                className="pl-9 pr-3 py-1 sm:py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition text-xs sm:text-sm"
                placeholderText="Select date"
                popperPlacement="bottom-start"
              />
              <FaCalendarAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            </div>
            {filterDate && (
              <button
                onClick={() => setFilterDate(null)}
                className="text-xs text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out w-full sm:w-auto mt-1 sm:mt-0"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* ID Filter */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 w-full md:w-auto min-w-0 mt-4 md:mt-0">
            <label className="text-xs sm:text-base font-semibold text-gray-700 whitespace-nowrap">Filter by ID:</label>
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={filterId}
                onChange={(e) => setFilterId(e.target.value)}
                className="pl-9 pr-3 py-1 sm:py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition text-xs sm:text-sm"
                placeholder="Enter Appointment ID"
              />
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            </div>
            {filterId && (
              <button
                onClick={() => setFilterId('')}
                className="text-xs text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out w-full sm:w-auto mt-1 sm:mt-0"
              >
                Clear Filter
              </button>
            )}
          </div>
          
          {/* Export Button */}
          <button
            onClick={() => exportToExcel(filteredAppointments, 'Appointments')}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-lg shadow-md flex items-center justify-center space-x-2 transition duration-150 ease-in-out mt-4 md:mt-0 text-sm"
          >
            <FaFileExcel className="text-sm" />
            <span>Export to Excel</span>
          </button>
        </div>
        
        {/* --- Appointment List --- */}

        {filteredAppointments.length === 0 ? (
          <p className="text-base text-gray-600 text-center py-8 border rounded-lg bg-gray-50 mx-4 sm:mx-8">
            No appointments found for the selected filter or date.
          </p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg mx-4 sm:mx-8">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date/Time</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Doctor</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 font-mono">{app.appointmentId}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                        <span className="font-semibold">{new Date(app.date).toLocaleDateString()}</span> <br/>
                        <span className="text-gray-500 text-xs flex items-center"><FaClock className="mr-1"/>{app.timeSlot}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{app.doctor?.name || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 font-medium">{app.patientName}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                        ₹{app.totalAmount} <br/>
                        <span className={`text-xs font-semibold ${app.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        <div className="flex space-x-2">
                          <StatusActionButtons app={app} handleStatusUpdate={handleStatusUpdate} openRescheduleModal={openRescheduleModal} />
                          <NotesAndDetailsButtons app={app} openNotesModal={openNotesModal} setSelectedAppointmentForDetails={setSelectedAppointmentForDetails} setShowAppointmentDetailsModal={setShowAppointmentDetailsModal} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4 px-4 sm:px-8">
              {filteredAppointments.map((app) => (
                <AppointmentCard
                  key={app._id}
                  app={app}
                  getStatusClasses={getStatusClasses}
                  handleStatusUpdate={handleStatusUpdate}
                  openRescheduleModal={openRescheduleModal}
                  openNotesModal={openNotesModal}
                  setSelectedAppointmentForDetails={setSelectedAppointmentForDetails}
                  setShowAppointmentDetailsModal={setShowAppointmentDetailsModal}
                />
              ))}
            </div>
          </>
        )}

        {/* Modals */}
        <AppointmentNotesModal
          showNotesModal={showNotesModal}
          currentAppointmentForNotes={currentAppointmentForNotes}
          appointmentNotes={appointmentNotes}
          setAppointmentNotes={setAppointmentNotes}
          handleSaveNotes={handleSaveNotes}
          setShowNotesModal={setShowNotesModal}
        />

        <RescheduleAppointmentModal
          showRescheduleModal={showRescheduleModal}
          currentAppointmentForReschedule={currentAppointmentForReschedule}
          newRescheduleDate={newRescheduleDate}
          setNewRescheduleDate={setNewRescheduleDate}
          newRescheduleTime={newRescheduleTime}
          setNewRescheduleTime={setNewRescheduleTime}
          handleReschedule={handleReschedule}
          setShowRescheduleModal={setShowRescheduleModal}
          doctorHolidays={doctorHolidays}
        />

        <AppointmentDetailsModal
          showDetailsModal={showAppointmentDetailsModal}
          setShowDetailsModal={setShowAppointmentDetailsModal}
          appointment={selectedAppointmentForDetails}
        />
      </div>
    </div>
  );
}

// --- Helper Components for Cleaner Rendering ---

// Component for Status Action Buttons
const StatusActionButtons = ({ app, handleStatusUpdate, openRescheduleModal, mobile = false }) => (
  <div className={`flex ${mobile ? 'flex-col gap-2' : 'space-x-2'}`}>
    {app.status === 'Pending' && (
      <>
        <button
          onClick={() => handleStatusUpdate(app.appointmentId, 'Approved')}
          className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md text-xs flex items-center justify-center space-x-1 transition duration-150`}
          title="Approve Appointment"
        >
          <FaCheckCircle />
          {!mobile && <span>Approve</span>}
        </button>
        <button
          onClick={() => openRescheduleModal(app)}
          className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-xs flex items-center justify-center space-x-1 transition duration-150`}
          title="Reschedule Appointment"
        >
          <FaSyncAlt />
          {!mobile && <span>Reschedule</span>}
        </button>
      </>
    )}
    {(app.status === 'Approved' || app.status === 'Rescheduled') && (
      <>
        <button
          onClick={() => handleStatusUpdate(app.appointmentId, 'Completed')}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md text-xs flex items-center justify-center space-x-1 transition duration-150`}
          title="Mark as Complete"
        >
          <FaCheckCircle />
          {!mobile && <span>Complete</span>}
        </button>
        {!(app.status === 'Completed' || app.status === 'Cancelled') && (
          <button
            onClick={() => openRescheduleModal(app)}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-xs flex items-center justify-center space-x-1 transition duration-150`}
            title="Reschedule Appointment"
          >
            <FaSyncAlt />
            {!mobile && <span>Reschedule</span>}
          </button>
        )}
      </>
    )}
  </div>
);

// Component for Notes and Details Buttons
const NotesAndDetailsButtons = ({ app, openNotesModal, setSelectedAppointmentForDetails, setShowAppointmentDetailsModal, mobile = false }) => (
    <>
      <button
        onClick={() => openNotesModal(app)}
        className={`w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-md text-xs flex items-center justify-center space-x-1 transition duration-150`}
        title={app.notes ? 'View/Edit Notes' : 'Add Notes'}
      >
        <FaEdit />
        {!mobile && <span>{app.notes ? 'Edit' : 'Add'} Notes</span>}
      </button>
      <button
        onClick={() => {
          setSelectedAppointmentForDetails(app);
          setShowAppointmentDetailsModal(true);
        }}
        className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded-md text-xs flex items-center justify-center space-x-1 transition duration-150`}
        title="View Details"
      >
        <FaInfoCircle />
        {!mobile && <span>Details</span>}
      </button>
    </>
);

// Component for Mobile Appointment Card
const AppointmentCard = ({ app, getStatusClasses, handleStatusUpdate, openRescheduleModal, openNotesModal, setSelectedAppointmentForDetails, setShowAppointmentDetailsModal }) => (
  <div key={app._id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 transition-shadow duration-300 hover:shadow-xl">
    {/* Status and ID */}
    <div className="flex justify-between items-center mb-3 border-b pb-2">
      <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusClasses(app.status)}`}>
        {app.status}
      </span>
      <span className="text-xs text-gray-500 font-mono overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] sm:max-w-none">ID: {app.appointmentId}</span>
    </div>

    {/* Core Info */}
    <div className="space-y-2 text-xs sm:text-sm">
      <p className="font-bold text-gray-900 flex items-center">
        <FaCalendarAlt className="mr-2 text-indigo-500 text-base" /> {new Date(app.date).toLocaleDateString()} at {app.timeSlot}
      </p>
      <p className="text-gray-700 flex items-center">
        <FaUserMd className="mr-2 text-purple-500 text-base" /> Doctor: <span className="font-semibold ml-1">{app.doctor?.name || 'N/A'}</span>
      </p>
      <p className="text-gray-700 flex items-center">
        <FaUser className="mr-2 text-green-500 text-base" /> Patient: <span className="font-semibold ml-1">{app.patientName}</span>
      </p>
      <p className="text-gray-700 flex items-center">
        <FaMoneyBillWave className="mr-2 text-red-500 text-base" /> Amount: <span className="font-semibold ml-1">₹{app.totalAmount}</span> ({app.paymentStatus})
      </p>
    </div>

    {/* Actions Section */}
    <div className="mt-3 pt-2 border-t border-gray-100">
      <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Actions</h4>
      <div className="grid grid-cols-2 gap-2">
        <StatusActionButtons app={app} handleStatusUpdate={handleStatusUpdate} openRescheduleModal={openRescheduleModal} mobile={true} />
        <NotesAndDetailsButtons app={app} openNotesModal={openNotesModal} setSelectedAppointmentForDetails={setSelectedAppointmentForDetails} setShowAppointmentDetailsModal={setShowAppointmentDetailsModal} mobile={true} />
      </div>
    </div>
  </div>
);

export default AdminAppointmentsPage;
