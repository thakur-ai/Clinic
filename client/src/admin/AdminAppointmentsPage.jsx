import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css"; // Ensure Tailwind CSS is properly imported
import * as XLSX from "xlsx"; // For Excel export

import AppointmentNotesModal from "./components/AppointmentNotesModal";
import RescheduleAppointmentModal from "./components/RescheduleAppointmentModal";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import {
  FaCalendarAlt,
  FaFileExcel,
  FaClipboardList,
  FaEdit,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaClock,
  FaUserMd,
  FaUser,
  FaMoneyBillWave,
  FaSearch,
  FaChevronRight,
} from "react-icons/fa";

function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Appointment Notes
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentAppointmentForNotes, setCurrentAppointmentForNotes] =
    useState(null);
  const [appointmentNotes, setAppointmentNotes] = useState("");

  // State for Appointment Rescheduling
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentAppointmentForReschedule, setCurrentAppointmentForReschedule] =
    useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState(null);
  const [newRescheduleTime, setNewRescheduleTime] = useState("");

  const [activeFilterTab, setActiveFilterTab] = useState("all");
  const [filterDate, setFilterDate] = useState(null);
  const [filterId, setFilterId] = useState("");
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] =
    useState(null);
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] =
    useState(false);

  // Doctor holidays
  const [doctorHolidays, setDoctorHolidays] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: adminToken ? `Bearer ${adminToken}` : "",
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const authHeaders = getAuthHeaders();
      const appointmentsResponse = await fetch(`${API_BASE_URL}/appointments`, {
        headers: authHeaders,
      });

      if (!appointmentsResponse.ok)
        throw new Error(
          `HTTP error! status: ${appointmentsResponse.status} for appointments`
        );

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

  useEffect(() => {
    if (activeFilterTab === "today") {
      setFilterDate(new Date());
    } else if (activeFilterTab === "all") {
      setFilterDate(null);
    }
  }, [activeFilterTab]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const openNotesModal = (appointment) => {
    setCurrentAppointmentForNotes(appointment);
    setAppointmentNotes(appointment.notes || "");
    setShowNotesModal(true);
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/appointments/${currentAppointmentForNotes._id}/notes`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ notes: appointmentNotes }),
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setShowNotesModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const openRescheduleModal = (appointment) => {
    setCurrentAppointmentForReschedule(appointment);
    setNewRescheduleDate(new Date(appointment.date));
    setNewRescheduleTime(appointment.timeSlot);
    setShowRescheduleModal(true);
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!newRescheduleDate || !newRescheduleTime) {
      alert("Please select a new date and time for rescheduling.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/appointments/${currentAppointmentForReschedule._id}/reschedule`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            date: `${newRescheduleDate.getFullYear()}-${String(
              newRescheduleDate.getMonth() + 1
            ).padStart(2, "0")}-${String(newRescheduleDate.getDate()).padStart(
              2,
              "0"
            )}`,
            timeSlot: newRescheduleTime,
            status: "Rescheduled",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowRescheduleModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);
    const today = new Date();

    const matchesDate = filterDate
      ? appDate.toDateString() === filterDate.toDateString()
      : true;

    const matchesId = filterId
      ? app.appointmentId.toLowerCase().includes(filterId.toLowerCase())
      : true;

    const matchesFilterTab = () => {
      switch (activeFilterTab) {
        case "pending":
          return app.status === "Pending";
        case "completed":
          return app.status === "Completed";
        case "approved":
          return app.status === "Approved";
        case "today":
          return appDate.toDateString() === today.toDateString();
        case "all":
        default:
          return true;
      }
    };

    return matchesDate && matchesId && matchesFilterTab();
  });

  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Rescheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const exportToExcel = (data, fileName) => {
    const dataToExport = data.map((app) => ({
      "Appointment ID": app.appointmentId,
      Date: new Date(app.date).toLocaleDateString(),
      Time: app.timeSlot,
      Doctor: app.doctor?.name || "N/A",
      "Patient Name": app.patientName,
      "Patient Email": app.patientEmail,
      "Patient Phone": app.patientPhone,
      "Total Amount": app.totalAmount,
      "Payment Option": app.paymentOption,
      "Payment Status": app.paymentStatus,
      Status: app.status,
      Notes: app.notes || "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaClipboardList className="text-5xl text-indigo-500 animate-pulse mb-4 mx-auto" />
          <p className="text-lg text-gray-600 font-medium">
            Loading appointments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 flex justify-center items-start">
        <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <h1 className="text-xl font-bold text-red-600 mb-2 flex items-center">
            <FaTimesCircle className="mr-2" /> Error Loading Data
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="w-full sm:w-auto bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium border border-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto bg-white shadow-xl min-h-screen">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100 px-4 py-4 sm:px-8 sm:py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <FaClipboardList className="mr-2 sm:mr-3 text-indigo-600" />
              <span>Appointments</span>
            </h2>
            <button
              onClick={() =>
                exportToExcel(filteredAppointments, "Appointments")
              }
              className="md:hidden p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
              title="Export to Excel"
            >
              <FaFileExcel className="text-xl" />
            </button>
          </div>

          {/* Filters Control Panel */}
          <div className="space-y-4">
            {/* 1. Swipeable Tabs for Mobile / Buttons for Desktop */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap">
              {["all", "pending", "completed", "approved", "today"].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilterTab(filter)}
                    className={`flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm rounded-full font-medium transition-all duration-200 border
                    ${
                      activeFilterTab === filter
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* 2. Inputs & Desktop Export */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Date Filter */}
              <div className="relative w-full md:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <DatePicker
                  selected={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  dateFormat="dd MMM yyyy"
                  className="pl-10 pr-8 py-2.5 w-full border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition outline-none"
                  placeholderText="Filter by Date"
                />
                {filterDate && (
                  <button
                    onClick={() => setFilterDate(null)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500"
                  >
                    <FaTimesCircle />
                  </button>
                )}
              </div>

              {/* ID Filter */}
              <div className="relative w-full md:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filterId}
                  onChange={(e) => setFilterId(e.target.value)}
                  className="pl-10 pr-8 py-2.5 w-full border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition outline-none"
                  placeholder="Search ID"
                />
                {filterId && (
                  <button
                    onClick={() => setFilterId("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500"
                  >
                    <FaTimesCircle />
                  </button>
                )}
              </div>

              {/* Desktop Export Button */}
              <button
                onClick={() =>
                  exportToExcel(filteredAppointments, "Appointments")
                }
                className="hidden md:flex bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm items-center space-x-2 transition duration-150 text-sm ml-auto"
              >
                <FaFileExcel />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Appointment Content --- */}

        <div className="pb-8 pt-4">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <FaClipboardList className="text-3xl text-gray-400" />
              </div>
              <p className="text-lg text-gray-900 font-medium">
                No appointments found
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or date selection.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto mx-8 border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAppointments.map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-mono text-gray-600">
                          #{app.appointmentId}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                          <div className="font-medium">
                            {new Date(app.date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center mt-0.5">
                            <FaClock className="mr-1" />
                            {app.timeSlot}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                          {app.doctor?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                          {app.patientName}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                          <div className="font-medium">₹{app.totalAmount}</div>
                          <div
                            className={`text-xs font-semibold ${
                              app.paymentStatus === "Paid"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {app.paymentStatus}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusClasses(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          <div className="flex space-x-2">
                            <StatusActionButtons
                              app={app}
                              handleStatusUpdate={handleStatusUpdate}
                              openRescheduleModal={openRescheduleModal}
                            />
                            <NotesAndDetailsButtons
                              app={app}
                              openNotesModal={openNotesModal}
                              setSelectedAppointmentForDetails={
                                setSelectedAppointmentForDetails
                              }
                              setShowAppointmentDetailsModal={
                                setShowAppointmentDetailsModal
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 px-4 pb-12">
                {filteredAppointments.map((app) => (
                  <AppointmentCard
                    key={app._id}
                    app={app}
                    getStatusClasses={getStatusClasses}
                    handleStatusUpdate={handleStatusUpdate}
                    openRescheduleModal={openRescheduleModal}
                    openNotesModal={openNotesModal}
                    setSelectedAppointmentForDetails={
                      setSelectedAppointmentForDetails
                    }
                    setShowAppointmentDetailsModal={
                      setShowAppointmentDetailsModal
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

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

// --- Helper Components ---

const StatusActionButtons = ({
  app,
  handleStatusUpdate,
  openRescheduleModal,
  mobile = false,
}) => (
  <div className={`flex ${mobile ? "flex-row gap-2" : "space-x-2"}`}>
    {app.status === "Pending" && (
      <>
        <button
          onClick={() => handleStatusUpdate(app.appointmentId, "Approved")}
          className={`flex-1 bg-green-600 active:bg-green-700 text-white font-medium py-2 sm:py-1 px-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition duration-150 shadow-sm`}
        >
          <FaCheckCircle />
          <span>Approve</span>
        </button>
        <button
          onClick={() => openRescheduleModal(app)}
          className={`flex-1 bg-yellow-500 active:bg-yellow-600 text-white font-medium py-2 sm:py-1 px-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition duration-150 shadow-sm`}
        >
          <FaSyncAlt />
          <span>Change</span>
        </button>
      </>
    )}
    {(app.status === "Approved" || app.status === "Rescheduled") && (
      <>
        <button
          onClick={() => handleStatusUpdate(app.appointmentId, "Completed")}
          className={`flex-1 bg-blue-600 active:bg-blue-700 text-white font-medium py-2 sm:py-1 px-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition duration-150 shadow-sm`}
        >
          <FaCheckCircle />
          <span>Done</span>
        </button>
        {!(app.status === "Completed" || app.status === "Cancelled") && (
          <button
            onClick={() => openRescheduleModal(app)}
            className={`flex-1 bg-yellow-500 active:bg-yellow-600 text-white font-medium py-2 sm:py-1 px-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition duration-150 shadow-sm`}
          >
            <FaSyncAlt />
            <span>Change</span>
          </button>
        )}
      </>
    )}
  </div>
);

const NotesAndDetailsButtons = ({
  app,
  openNotesModal,
  setSelectedAppointmentForDetails,
  setShowAppointmentDetailsModal,
  mobile = false,
}) => (
  <div className={`flex ${mobile ? "flex-row gap-2 mt-2" : "space-x-2"}`}>
    <button
      onClick={() => openNotesModal(app)}
      className={`flex-1 bg-gray-500 active:bg-gray-600 text-white font-medium py-2 sm:py-1 px-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition duration-150 shadow-sm`}
    >
      <FaEdit />
      <span>{mobile ? "Notes" : app.notes ? "Edit" : "Add"}</span>
    </button>
    <button
      onClick={() => {
        setSelectedAppointmentForDetails(app);
        setShowAppointmentDetailsModal(true);
      }}
      className={`flex-1 bg-indigo-500 active:bg-indigo-600 text-white font-medium py-2 sm:py-1 px-3 rounded-lg text-sm flex items-center justify-center space-x-1.5 transition duration-150 shadow-sm`}
    >
      <FaInfoCircle />
      <span>Details</span>
    </button>
  </div>
);

// Improved Mobile Card
const AppointmentCard = ({
  app,
  getStatusClasses,
  handleStatusUpdate,
  openRescheduleModal,
  openNotesModal,
  setSelectedAppointmentForDetails,
  setShowAppointmentDetailsModal,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    {/* Card Header: Status & ID */}
    <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="font-bold text-gray-800 text-sm">
          #{app.appointmentId.slice(-6).toUpperCase()}
        </span>
        {app.notes && <FaEdit className="text-gray-400 text-xs" />}
      </div>
      <span
        className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(
          app.status
        )}`}
      >
        {app.status}
      </span>
    </div>

    {/* Card Body: Info Grid */}
    <div className="p-4 grid grid-cols-[auto_1fr] gap-y-3 gap-x-4 items-start">
      {/* Date */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600">
        <FaCalendarAlt className="text-sm" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">
          {new Date(app.date).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-xs text-gray-500">{app.timeSlot}</p>
      </div>

      {/* Doctor */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-600">
        <FaUserMd className="text-sm" />
      </div>
      <div className="self-center">
        <p className="text-sm text-gray-800">
          <span className="text-xs text-gray-500 uppercase font-semibold mr-1">
            Dr.
          </span>{" "}
          {app.doctor?.name || "N/A"}
        </p>
      </div>

      {/* Patient */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600">
        <FaUser className="text-sm" />
      </div>
      <div className="self-center">
        <p className="text-sm text-gray-800">{app.patientName}</p>
      </div>

      {/* Payment */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 text-yellow-600">
        <FaMoneyBillWave className="text-sm" />
      </div>
      <div className="flex items-center justify-between w-full self-center">
        <span className="text-sm font-bold text-gray-900">
          ₹{app.totalAmount}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded border ${
            app.paymentStatus === "Paid"
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          {app.paymentStatus}
        </span>
      </div>
    </div>

    {/* Card Actions */}
    <div className="px-4 pb-4 pt-1">
      <StatusActionButtons
        app={app}
        handleStatusUpdate={handleStatusUpdate}
        openRescheduleModal={openRescheduleModal}
        mobile={true}
      />
      <NotesAndDetailsButtons
        app={app}
        openNotesModal={openNotesModal}
        setSelectedAppointmentForDetails={setSelectedAppointmentForDetails}
        setShowAppointmentDetailsModal={setShowAppointmentDetailsModal}
        mobile={true}
      />
    </div>
  </div>
);

export default AdminAppointmentsPage;
