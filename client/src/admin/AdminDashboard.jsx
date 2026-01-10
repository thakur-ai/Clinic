import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DoctorFormModal from "./components/DoctorFormModal";
import AdminContactsPage from "./AdminContactsPage";
import AdminServicePage from "./AdminServicePage";
import AdminAppointmentsPage from "./AdminAppointmentsPage";
import DoctorSchedulePage from "./DoctorSchedulePage";
import OfflineAppointmentBookingPage from "./OfflineAppointmentBookingPage";

// --- Mobile Doctor Card Component ---
const DoctorCard = ({ doctor, openEditDoctorForm, handleDeleteDoctor }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4 transition-all duration-300 hover:shadow-md">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          {doctor.specialization}
        </span>
      </div>
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>

    <div className="space-y-2 text-sm text-gray-600 mb-4">
      <div className="flex items-center">
        <svg
          className="w-4 h-4 mr-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
        <span className="truncate">{doctor.email}</span>
      </div>
      <div className="flex items-center">
        <svg
          className="w-4 h-4 mr-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          ></path>
        </svg>
        <span>{doctor.phone || "N/A"}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
      <button
        onClick={() => openEditDoctorForm(doctor)}
        className="flex items-center justify-center py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>
        Edit
      </button>
      <button
        onClick={() => handleDeleteDoctor(doctor._id)}
        className="flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          ></path>
        </svg>
        Delete
      </button>
    </div>
  </div>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");

  // State for Doctor Management Form
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [doctorFormData, setDoctorFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: adminToken ? `Bearer ${adminToken}` : "",
    };
  };

  const fetchDoctorsData = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const doctorsResponse = await fetch(
        `${API_BASE_URL}/appointments/doctors`,
        { headers: authHeaders }
      );

      if (!doctorsResponse.ok)
        throw new Error(
          `HTTP error! status: ${doctorsResponse.status} for doctors`
        );

      const doctorsData = await doctorsResponse.json();

      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "doctors") {
      fetchDoctorsData();
    }
  }, [activeTab]);

  const openAddDoctorForm = () => {
    setCurrentDoctor(null);
    setDoctorFormData({ name: "", specialization: "", email: "", phone: "" });
    setShowDoctorForm(true);
  };

  const openEditDoctorForm = (doctor) => {
    setCurrentDoctor(doctor);
    setDoctorFormData({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      email: doctor.email || "",
      phone: doctor.phone ? String(doctor.phone) : "",
    });
    setShowDoctorForm(true);
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const doctorData = doctorFormData;
    try {
      let response;
      if (currentDoctor) {
        response = await fetch(
          `${API_BASE_URL}/appointments/doctors/${currentDoctor._id}`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(doctorData),
          }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/appointments/doctors`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(doctorData),
        });
      }

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setShowDoctorForm(false);
      fetchDoctorsData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/doctors/${doctorId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      fetchDoctorsData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading && activeTab === "doctors") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading doctor data...</p>
        </div>
      </div>
    );
  }

  if (error && activeTab === "doctors") {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // --- Navigation Items Array for cleaner rendering ---
  const navItems = [
    { id: "appointments", label: "Appointments" },
    { id: "services", label: "Services" },
    { id: "doctors", label: "Doctors" },
    { id: "contacts", label: "Contacts" },
    { id: "doctorSchedule", label: "Schedule" },
    { id: "offlineAppointments", label: "Offline Booking" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Title & Subtitle */}
            <div className="text-center sm:text-left order-2 sm:order-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Manage your clinic's daily operations.
              </p>
            </div>

            {/* Logout Button */}
            <div className="w-full sm:w-auto order-1 sm:order-2 flex justify-end">
              <button
                onClick={handleLogout}
                className="w-auto bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200 border border-red-100 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs - Scrollable Pills */}
          <div className="mt-6 sm:mt-8 border-t border-gray-100 pt-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                    activeTab === item.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-transparent sm:bg-white sm:rounded-xl sm:shadow-lg sm:p-6 min-h-[500px]">
          {activeTab === "appointments" && <AdminAppointmentsPage />}
          {activeTab === "offlineAppointments" && (
            <OfflineAppointmentBookingPage />
          )}
          {activeTab === "services" && <AdminServicePage />}
          {activeTab === "contacts" && <AdminContactsPage />}
          {activeTab === "doctorSchedule" && <DoctorSchedulePage />}

          {activeTab === "doctors" && (
            <div className="px-4 sm:px-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Doctor List
                  </h2>
                  <p className="text-sm text-gray-500">
                    Total: {doctors.length} doctors
                  </p>
                </div>

                <button
                  onClick={openAddDoctorForm}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Add Doctor
                </button>
              </div>

              {doctors.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  <p className="text-gray-500 font-medium">
                    No doctors added yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Specialization
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {doctors.map((doctor) => (
                          <tr
                            key={doctor._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">
                              {doctor.name}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">
                              <span className="bg-indigo-50 text-indigo-700 py-1 px-2 rounded-md text-xs font-medium border border-indigo-100">
                                {doctor.specialization}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">
                              {doctor.email}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">
                              {doctor.phone || "N/A"}
                            </td>
                            <td className="py-4 px-6 text-sm font-medium">
                              <button
                                onClick={() => openEditDoctorForm(doctor)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(doctor._id)}
                                className="text-red-600 hover:text-red-900 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden">
                    {doctors.map((doctor) => (
                      <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        openEditDoctorForm={openEditDoctorForm}
                        handleDeleteDoctor={handleDeleteDoctor}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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
