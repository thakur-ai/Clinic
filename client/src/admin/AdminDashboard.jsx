
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import DoctorFormModal from './components/DoctorFormModal';

import AdminContactsPage from './AdminContactsPage';
import AdminServicePage from './AdminServicePage';
import AdminAppointmentsPage from './AdminAppointmentsPage'; // Import the new Appointments page
import DoctorSchedulePage from './DoctorSchedulePage'; // Import the new Doctor Schedule page
import OfflineAppointmentBookingPage from './OfflineAppointmentBookingPage'; // Import the new Offline Appointment Booking page

function AdminDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [doctors, setDoctors] = useState([]); // Keep doctors state for doctor management tab
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'doctors', 'services', 'contacts', 'doctorSchedule', 'offlineAppointments'

  // State for Doctor Management Form
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null); // For editing
  const [doctorFormData, setDoctorFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Base URL for API

  // Helper to get auth headers for admin
  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : '',
    };
  };

  // Fetch doctors for the doctor management tab
  const fetchDoctorsData = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const doctorsResponse = await fetch(`${API_BASE_URL}/appointments/doctors`, { headers: authHeaders });

      if (!doctorsResponse.ok) throw new Error(`HTTP error! status: ${doctorsResponse.status} for doctors`);

      const doctorsData = await doctorsResponse.json();

      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctorsData();
    }
  }, [activeTab]);


  // Doctor Management Handlers
  const openAddDoctorForm = () => {
    setCurrentDoctor(null);
    setDoctorFormData({ name: '', specialization: '', email: '', phone: '' });
    setShowDoctorForm(true);
  };

  const openEditDoctorForm = (doctor) => {
    setCurrentDoctor(doctor);
    setDoctorFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      email: doctor.email || '',
      phone: doctor.phone ? String(doctor.phone) : ''
    });
    setShowDoctorForm(true);
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const doctorData = doctorFormData;
    try {
      let response;
      if (currentDoctor) {
        response = await fetch(`${API_BASE_URL}/appointments/doctors/${currentDoctor._id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(doctorData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/appointments/doctors`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(doctorData),
        });
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setShowDoctorForm(false);
      fetchDoctorsData(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchDoctorsData(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Remove the admin token
    navigate('/admin/login'); // Redirect to the admin login page
  };


  if (loading && activeTab === 'doctors') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Loading doctor data...</p>
      </div>
    );
  }

  if (error && activeTab === 'doctors') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto sm:p-6 bg-gray-50 rounded-lg shadow-lg my-10">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6">
        {/* Logout Button (appears first on mobile, then moves to right on larger screens) */}
        <div className="w-full sm:w-auto text-center sm:text-right order-1 sm:order-2 mb-0 sm:mb-0">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm sm:py-2 sm:px-4 sm:text-base rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>

        {/* Admin Dashboard title and description (appears after logout on mobile, then centers on larger screens) */}
        <div className="flex-grow text-center order-2 sm:order-1">
          <h1 className="hidden sm:block text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="hidden sm:block text-base sm:text-lg text-gray-600">Manage appointments, doctors, services, and contacts.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'appointments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'doctors'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contacts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('doctorSchedule')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'doctorSchedule'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Doctor Schedule
          </button>
          <button
            onClick={() => setActiveTab('offlineAppointments')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'offlineAppointments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Offline Appointments
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div>
        {activeTab === 'appointments' && <AdminAppointmentsPage />}
        {activeTab === 'offlineAppointments' && <OfflineAppointmentBookingPage />}

        {activeTab === 'services' && <AdminServicePage />}

        {activeTab === 'doctors' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Doctors</h2>
            <button
              onClick={openAddDoctorForm}
              className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Add New Doctor
            </button>
            {doctors.length === 0 ? (
              <p className="text-gray-600">No doctors added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Specialization</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Phone</th>
                      <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{doctor.name}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{doctor.specialization}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{doctor.email}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">{doctor.phone || 'N/A'}</td>
                        <td className="py-2 px-4 border-b text-sm text-gray-700">
                          <button
                            onClick={() => openEditDoctorForm(doctor)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doctor._id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && <AdminContactsPage />}

        {activeTab === 'doctorSchedule' && <DoctorSchedulePage />}
      </div>
      {/* Modals for Doctor Management */}
      <DoctorFormModal
        showDoctorForm={showDoctorForm}
        currentDoctor={currentDoctor}
        doctorFormData={doctorFormData}
        setDoctorFormData={setDoctorFormData}
        handleDoctorSubmit={handleDoctorSubmit}
        setShowDoctorForm={setShowDoctorForm}
      />
    </div>
  );
}

export default AdminDashboard;
