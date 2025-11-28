import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import AddHolidayModal from './components/AddHolidayModal';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';
import AppointmentNotesModal from './components/AppointmentNotesModal';
import RescheduleAppointmentModal from './components/RescheduleAppointmentModal';

function DoctorSchedulePage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Doctor Schedule
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [viewDate, setViewDate] = useState(new Date()); 
  const [doctorSchedule, setDoctorSchedule] = useState({
    doctorName: '',
    holidays: [],
    appointments: [],
  });
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
  const [selectedHolidayDate, setSelectedHolidayDate] = useState(null);
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState(null);
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false);

  // States specific to appointment interactions
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentAppointmentForNotes, setCurrentAppointmentForNotes] = useState(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentAppointmentForReschedule, setCurrentAppointmentForReschedule] = useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState(null);
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : '',
    };
  };

  const fetchData = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const doctorsResponse = await fetch(`${API_BASE_URL}/admin/doctors`, { headers: authHeaders });
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
    fetchData();
  }, []);

  const handleAddHoliday = async () => {
    if (!selectedDoctorId || !selectedHolidayDate) {
      alert('Please select a doctor and a date for the holiday.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors/${selectedDoctorId}/holidays`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          holidayDate: `${selectedHolidayDate.getFullYear()}-${String(selectedHolidayDate.getMonth() + 1).padStart(2, '0')}-${String(selectedHolidayDate.getDate()).padStart(2, '0')}`,
          action: 'add',
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setShowAddHolidayModal(false);
      setSelectedHolidayDate(null);
      fetchDoctorSchedule(selectedDoctorId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveHoliday = async (holidayDate) => {
    if (!selectedDoctorId || !holidayDate) {
      alert('Error: Doctor or holiday date missing.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove the holiday on ${holidayDate.toLocaleDateString()}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors/${selectedDoctorId}/holidays`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          holidayDate: holidayDate.toISOString(),
          action: 'remove',
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchDoctorSchedule(selectedDoctorId);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDoctorSchedule = async (doctorId) => {
    if (!doctorId) {
      setDoctorSchedule({ doctorName: '', holidays: [], appointments: [] });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors/${doctorId}/schedule`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDoctorSchedule({
        doctorName: data.doctorName,
        holidays: data.holidays.map(h => new Date(h)),
        appointments: data.appointments.map(app => ({
          ...app,
          date: new Date(app.date),
        })),
      });
    } catch (err) {
      setError(err.message);
      setDoctorSchedule({ doctorName: '', holidays: [], appointments: [] });
    }
  };

  useEffect(() => {
    if (selectedDoctorId) {
      fetchDoctorSchedule(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  const openNotesModal = (appointment) => {
    setCurrentAppointmentForNotes(appointment);
    setAppointmentNotes(appointment.notes || '');
    setShowNotesModal(true);
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/appointments/${currentAppointmentForNotes._id}/notes`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes: appointmentNotes }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setShowNotesModal(false);
      if (selectedDoctorId) fetchDoctorSchedule(selectedDoctorId);
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
      alert('Please select a new date and time for rescheduling.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/appointments/${currentAppointmentForReschedule._id}/reschedule`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          date: `${newRescheduleDate.getFullYear()}-${String(newRescheduleDate.getMonth() + 1).padStart(2, '0')}-${String(newRescheduleDate.getDate()).padStart(2, '0')}`,
          timeSlot: newRescheduleTime,
          status: 'Rescheduled'
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setShowRescheduleModal(false);
      if (selectedDoctorId) fetchDoctorSchedule(selectedDoctorId);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading schedule...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-10">
      <style>{`
        .react-datepicker {
          font-family: inherit;
          border: none;
          box-shadow: none;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .react-datepicker__month-container {
            width: 100%;
            max-width: 350px; /* Prevent it from getting too wide on tablets */
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: 1px solid #f3f4f6;
          padding-top: 1rem;
        }
        .react-datepicker__day-name, .react-datepicker__day {
          width: 2.2rem;
          height: 2.2rem;
          line-height: 2.2rem;
          margin: 0.15rem;
        }
        @media (min-width: 640px) {
             .react-datepicker__day-name, .react-datepicker__day {
                width: 2.5rem;
                height: 2.5rem;
                line-height: 2.5rem;
                margin: 0.2rem;
             }
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #4f46e5 !important;
          color: white !important;
        }
        .holiday-flag { background-color: #fee2e2 !important; color: #991b1b !important; position: relative; }
        .holiday-flag::after { content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background-color: #ef4444; border-radius: 50%; }
        .appt-flag { background-color: #eff6ff !important; color: #1e40af !important; position: relative; }
        .appt-flag::after { content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background-color: #3b82f6; border-radius: 50%; }

        /* Additional styles for very small screens to improve mobile calendar view */
        @media (max-width: 500px) {
            .react-datepicker {
                width: unset; /* Override default 100% to allow max-content/auto sizing */
                max-width: 280px; /* Smaller overall width for the calendar */
                padding: 0; /* Remove any extra padding around the calendar itself */
                margin: 0 auto; /* Center the datepicker */
            }
            .react-datepicker__month-container {
                max-width: 100%; 
            }
            .react-datepicker__day-name, .react-datepicker__day {
                width: 1.6rem; /* Even smaller width for days */
                height: 1.6rem; /* Even smaller height for days */
                line-height: 1.6rem; /* Adjust line height */
                font-size: 0.7rem; /* Even smaller font size */
                margin: 0.05rem; /* Even smaller margin */
            }
            .react-datepicker__header {
                padding-top: 0.3rem; /* Reduce padding for header */
            }
            .react-datepicker__navigation--previous,
            .react-datepicker__navigation--next {
                top: 0.4rem; /* Adjust navigation button position */
                padding: 0.2rem; /* Reduce padding for navigation buttons */
            }
        }
        @media (max-width: 360px) { /* Even smaller adjustments for very narrow screens */
            .react-datepicker__day-name, .react-datepicker__day {
                width: 1.4rem;
                height: 1.4rem;
                line-height: 1.4rem;
                font-size: 0.65rem;
                margin: 0.02rem;
            }
            .react-datepicker__current-month {
                font-size: 0.9rem;
            }
        }
      `}</style>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Doctor Schedule</h2>
                    <p className="text-sm text-gray-500 hidden sm:block">Manage physician availability and agendas.</p>
                </div>
                
                <div className="w-full md:w-72">
                    <div className="relative group">
                        <select
                            className="block w-full pl-4 pr-10 py-2.5 sm:py-3 text-base border-gray-300 bg-gray-50 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow cursor-pointer"
                            value={selectedDoctorId}
                            onChange={(e) => {
                                setSelectedDoctorId(e.target.value);
                                setViewDate(new Date());
                            }}
                        >
                            <option value="">Select a Doctor...</option>
                            {doctors.map(doctor => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.name} ({doctor.specialization})
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {selectedDoctorId && doctorSchedule.doctorName ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Calendar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                     <h3 className="font-bold text-gray-700">Calendar</h3>
                     <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                        {viewDate.getFullYear()}
                     </span>
                </div>
                <div className="p-2 sm:p-4 flex justify-center">
                  <DatePicker
                    inline
                    selected={viewDate}
                    onChange={(date) => setViewDate(date)}
                    highlightDates={[
                      { "holiday-flag": doctorSchedule.holidays },
                      { "appt-flag": doctorSchedule.appointments.map(a => a.date) }
                    ]}
                    dayClassName={(date) => {
                      const dateStr = date.toDateString();
                      const isHoliday = doctorSchedule.holidays.some(h => h.toDateString() === dateStr);
                      const hasAppt = doctorSchedule.appointments.some(a => a.date.toDateString() === dateStr);
                      if (isHoliday) return 'holiday-flag';
                      if (hasAppt) return 'appt-flag';
                      return undefined;
                    }}
                  />
                </div>
                {/* Legend */}
                <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-200 border border-red-400 mr-1.5"></span>Off</div>
                    <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-blue-400 mr-1.5"></span>Appt</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedHolidayDate(viewDate);
                  setShowAddHolidayModal(true);
                }}
                className="w-full bg-white border-2 border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                 <span>Mark {viewDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})} as Off</span>
              </button>
            </div>

            {/* Right Column: Agenda */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col relative">
                
                {/* Sticky Header for Agenda */}
                <div className="sticky top-[73px] lg:static z-20 bg-white/95 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-5 border-b border-gray-100 rounded-t-2xl flex flex-row items-center justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest sm:text-xs">Daily Agenda</h4>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                            {viewDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                        </h3>
                    </div>
                     <div className="text-right hidden sm:block">
                        <div className="text-sm text-gray-500 font-medium">Dr. {doctorSchedule.doctorName}</div>
                    </div>
                </div>

                <div className="p-3 sm:p-6 flex-1 bg-gray-50/50 rounded-b-2xl">
                  {(() => {
                    const isHoliday = doctorSchedule.holidays.some(h => h.toDateString() === viewDate.toDateString());
                    const todaysAppointments = doctorSchedule.appointments.filter(a => a.date.toDateString() === viewDate.toDateString());

                    if (isHoliday) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 bg-red-50 rounded-lg shadow-inner border border-red-100">
                          <div className="bg-red-100 p-4 rounded-full mb-4 shadow-md">
                            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2">Office Closed</h3>
                          <p className="text-sm text-red-700 mb-6 max-w-xs">You marked this day as a holiday. No appointments scheduled.</p>
                          <button onClick={() => handleRemoveHoliday(viewDate)} className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg shadow-sm hover:bg-red-50 transition-colors border border-red-200 text-xs sm:text-sm">Restore Availability</button>
                        </div>
                      );
                    } else if (todaysAppointments.length > 0) {
                      return (
                        <div className="space-y-3 sm:space-y-4">
                          {todaysAppointments
                            .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                            .map((app) => (
                            <div
                              key={app._id}
                              className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl p-0 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                              onClick={() => {
                                setSelectedAppointmentForDetails(app);
                                setShowAppointmentDetailsModal(true);
                              }}
                            >
                                {/* Mobile-Optimized Card Layout */}
                                <div className="flex flex-col sm:flex-row">
                                    
                                    {/* Left: Time Strip (Mobile) / Box (Desktop) */}
                                    <div className="bg-indigo-50/50 sm:bg-indigo-50 p-2 sm:p-4 sm:w-32 flex flex-row sm:flex-col justify-between sm:justify-center sm:items-center border-b sm:border-b-0 sm:border-r border-indigo-100">
                                        <div className="flex items-center gap-1 sm:flex-col sm:gap-0">
                                            <svg className="w-3.5 h-3.5 text-indigo-500 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="font-bold text-indigo-700 text-xs sm:text-lg whitespace-nowrap">{app.timeSlot.split(' - ')[0]}</span>
                                            <span className="text-[10px] text-indigo-400 hidden sm:block mt-1">{app.timeSlot.split(' - ')[1]}</span>
                                        </div>
                                        {/* Status Badge mobile position */}
                                        <div className="sm:hidden">
                                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                                                ${app.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                app.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Center: Details */}
                                    <div className="p-3 flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-1">
                                                    {app.services && app.services.length > 0
                                                        ? app.services[0].name
                                                        : 'Unknown Service'}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                                    <svg className="w-3 h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 0 00-7-7z" /></svg>
                                                    {app.patientName}
                                                </p>
                                            </div>
                                            {/* Status Badge Desktop Position */}
                                            <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${app.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                app.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right/Bottom: Actions */}
                                    <div className="border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/30 sm:bg-transparent p-2 sm:p-3 flex sm:flex-col items-center justify-end gap-1.5">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openNotesModal(app); }}
                                            className="flex-1 sm:flex-none w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-white sm:bg-transparent border border-gray-200 sm:border-transparent rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            <span className="hidden sm:inline">Notes</span> {/* Hide text on mobile, show on sm and up */}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openRescheduleModal(app); }}
                                            className="flex-1 sm:flex-none w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-white sm:bg-transparent border border-gray-200 sm:border-transparent rounded-md hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="hidden sm:inline">Reschedule</span> {/* Hide text on mobile, show on sm and up */}
                                        </button>
                                    </div>
                                </div>
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-100 rounded-lg shadow-inner border border-gray-200">
                            <div className="bg-white p-4 rounded-full mb-4 shadow-md border border-gray-200">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments</h3>
                            <p className="text-sm text-gray-600 mb-6 max-w-xs">The schedule is clear for this day. Enjoy your free time!</p>
                            <button
                                onClick={() => { setSelectedHolidayDate(viewDate); setShowAddHolidayModal(true); }}
                                className="px-4 py-2 bg-white border border-indigo-200 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                            >
                                Mark as Day Off
                            </button>
                        </div>
                    );
                  }
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-dashed border-gray-300 mx-4 sm:mx-0">
            <div className="bg-indigo-50 p-5 rounded-full mb-3 animate-pulse">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900">Select a Doctor</h3>
            <p className="text-gray-500 text-center max-w-xs mt-2 text-xs sm:text-sm">Use the dropdown above to manage schedules.</p>
          </div>
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
          doctorHolidays={doctorSchedule.holidays}
        />
        <AddHolidayModal
          showAddHolidayModal={showAddHolidayModal}
          doctorName={doctorSchedule.doctorName}
          selectedHolidayDate={selectedHolidayDate}
          setSelectedHolidayDate={setSelectedHolidayDate}
          handleAddHoliday={handleAddHoliday}
          setShowAddHolidayModal={setShowAddHolidayModal}
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
export default DoctorSchedulePage;
