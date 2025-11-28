import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt, FaClock, FaUserMd, FaStethoscope,
  FaUser, FaEnvelope, FaPhoneAlt, FaReceipt,
  FaCheckCircle, FaHospital, FaExclamationTriangle, FaMoneyBillWave
} from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Define API Base URL

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
];

const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .react-datepicker-wrapper {
    width: 100%;
    position: relative;
    z-index: 10;
  }
  .react-datepicker__input-container input {
    width: 100%;
    position: relative;
    z-index: 20;
  }
  .react-datepicker__input-container input:focus {
    background-color: #ffffff;
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
  .react-datepicker {
    font-family: inherit;
    border: 1px solid #f3f4f6;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 9999;
  }
  .react-datepicker__month-container {
    float: none;
  }
  .react-datepicker__header {
    background-color: #ffffff;
    border-bottom: 1px solid #f3f4f6;
    padding-top: 1rem;
  }
  .react-datepicker__day--selected {
    background-color: #4f46e5 !important;
    border-radius: 50%;
    font-weight: bold;
  }
  .react-datepicker__day--highlighted-holiday {
    background-color: #fee2e2 !important;
    color: #ef4444 !important;
    border-radius: 50%;
  }
  .custom-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.2em 1.2em;
  }
`;

const FormSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-4 mt-[50px]">
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 md:w-1/4 mx-auto mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
        <div className="h-14 bg-gray-100 rounded-xl"></div>
        <div className="h-14 bg-gray-100 rounded-xl"></div>
        <div className="h-14 bg-gray-100 rounded-xl"></div>
        <div className="h-14 bg-gray-100 rounded-xl"></div>
      </div>
      <div className="h-40 bg-gray-100 rounded-xl mb-6"></div>
      <div className="h-14 bg-indigo-100 rounded-xl"></div>
    </div>
  </div>
);

const OfflineAppointmentBookingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const xOffset = (mousePos.x - window.innerWidth / 2) / 40;
  const yOffset = (mousePos.y - window.innerHeight / 2) / 40;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [doctorHolidays, setDoctorHolidays] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDoctorSelectionAlert, setShowDoctorSelectionAlert] = useState(false);
  const [showHolidayAlert, setShowHolidayAlert] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const serviceDropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [doctorsResponse, servicesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/appointments/doctors`),
          fetch(`${API_BASE_URL}/appointments/services`),
        ]);

        if (!doctorsResponse.ok) throw new Error(`HTTP error! status: ${doctorsResponse.status} for doctors`);
        if (!servicesResponse.ok) throw new Error(`HTTP error! status: ${servicesResponse.status} for services`);

        const doctorsData = await doctorsResponse.json();
        const servicesData = await servicesResponse.json();

        setDoctors(doctorsData);
        setServices(servicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
    };

    if (showServiceDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showServiceDropdown]);

  useEffect(() => {
    if (selectedDoctor) {
      const fetchHolidays = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/appointments/doctors/${selectedDoctor}/holidays`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for doctor holidays`);
          const data = await response.json();
          setDoctorHolidays(data.holidays.map(h => new Date(h)));
        } catch (err) {
          console.error("Failed to fetch doctor holidays:", err);
          setDoctorHolidays([]);
        }
      };
      fetchHolidays();
    } else {
      setDoctorHolidays([]);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedServiceIds.length > 0 && services.length > 0) {
      const total = selectedServiceIds.reduce((sum, serviceId) => {
        const service = services.find(s => s._id === serviceId);
        return sum + (service ? service.basePrice : 0);
      }, 0);
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [selectedServiceIds, services]);

  const handleOfflineBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!selectedDate || !selectedTimeSlot || selectedServiceIds.length === 0 || !selectedDoctor || !patientName || !patientEmail || !patientPhone) {
      setError('Please fill in all required fields, including at least one service.');
      setIsSubmitting(false);
      return;
    }

    try {
      const bookingResponse = await fetch(`${API_BASE_URL}/admin/appointments/offline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Assuming admin token is stored
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          timeSlot: selectedTimeSlot,
          serviceIds: selectedServiceIds,
          doctorId: selectedDoctor,
          patientName,
          patientEmail,
          patientPhone,
          paymentOption: 'Offline Payment', // Indicate offline payment
          totalAmount, // Still send total amount for record, even if fees bypassed
          advanceAmount: 0, // No advance for offline
          isOfflineBooking: true, // Custom flag for backend
        }),
      });

      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok) throw new Error(bookingData.message || 'Offline booking failed.');

      setBookingStatus('success');
      setAppointmentDetails(bookingData.appointment);
    } catch (err) {
      setError(err.message);
      setBookingStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <FormSkeleton />;

  if (bookingStatus === 'success' && appointmentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 font-sans mt-[30px] md:mt-[50px]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in relative mx-auto">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-100 rounded-full z-0"></div>

          <div className="relative z-10 pt-10 pb-6 px-6 text-center">
            <div className="bg-green-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FaCheckCircle className="text-green-500 text-4xl md:text-5xl animate-bounce" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">Confirmed!</h1>
            <p className="text-sm md:text-base text-gray-500">Offline appointment is set.</p>
            <div className="mt-4 inline-block bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs md:text-sm font-semibold border border-green-200">
              ID: {appointmentDetails._id?.substring(0, 8).toUpperCase() || '12345'}
            </div>
          </div>

          <div className="relative bg-gray-50 px-6 py-6 border-t-2 border-dashed border-gray-200">
             <div className="absolute -top-3 -left-3 w-6 h-6 bg-emerald-100 rounded-full"></div>
             <div className="absolute -top-3 -right-3 w-6 h-6 bg-emerald-100 rounded-full"></div>

            <div className="space-y-4 md:space-y-5">
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Appointment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center"><FaCalendarAlt className="mr-2 text-green-600"/> Date</span>
                  <span className="font-semibold text-gray-800 text-sm md:text-base">{new Date(appointmentDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center"><FaClock className="mr-2 text-green-600"/> Time</span>
                  <span className="font-semibold text-gray-800 text-sm md:text-base">{appointmentDetails.timeSlot}</span>
                </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500 text-sm flex items-center"><FaStethoscope className="mr-2 text-green-600"/> Service(s)</span>
                <div className="font-semibold text-gray-800 text-sm md:text-base text-right flex flex-col items-end">
                  {appointmentDetails.services && appointmentDetails.services.length > 0 ? (
                    appointmentDetails.services.map(s => <span key={s._id}>{s.name}</span>)
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center"><FaUserMd className="mr-2 text-green-600"/> Doctor</span>
                  <span className="font-semibold text-gray-800 text-sm md:text-base text-right">{appointmentDetails.doctor?.name || 'N/A'}</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider pt-4 mt-4 border-t border-gray-200 mb-2">Patient Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center"><FaUser className="mr-2 text-green-600"/> Name</span>
                  <span className="font-medium text-gray-800">{appointmentDetails.patientName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center"><FaEnvelope className="mr-2 text-green-600"/> Email</span>
                  <span className="font-medium text-gray-800 truncate">{appointmentDetails.patientEmail}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center"><FaPhoneAlt className="mr-2 text-green-600"/> Phone</span>
                  <span className="font-medium text-gray-800">{appointmentDetails.patientPhone}</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider pt-4 mt-4 border-t border-gray-200 mb-2">Payment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Consultation Fee</span>
                  <span className="font-semibold text-gray-800 text-base">₹{appointmentDetails.totalAmount?.toLocaleString() || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-500 text-sm font-medium">Payment Status</span>
                  <span className="font-bold text-green-600 text-lg">Bypassed (Offline)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white">
            <button
              onClick={() => navigate('/admin/appointments')}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors shadow-lg active:scale-95 transform duration-150"
            >
              View Appointments
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg active:scale-95 transform duration-150"
            >
              Book Another Offline Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 font-sans mt-[30px] md:mt-[50px] selection:bg-indigo-100">
      <style>{customStyles}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`
          }}
        ></div>

        <div
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-[120px] transition-transform duration-100 ease-out animate-pulse-slow"
          style={{ transform: `translate(${xOffset * -1.5}px, ${yOffset * -1.5}px)` }}
        ></div>

        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[100px] transition-transform duration-100 ease-out animate-pulse-slow delay-700"
          style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        <div className="text-center mb-6 md:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-1 drop-shadow-sm">
            Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Offline Appointment</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Admin tool to schedule appointments for walk-in patients.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 animate-fade-in flex flex-col lg:flex-row">
          <form onSubmit={handleOfflineBookingSubmit} className="flex-1 p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 relative">

            <section>
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-200 shrink-0">1</div>
                <h3 className="text-base md:text-xl font-bold text-slate-800">Consultation Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="group overflow-visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Service</label>
                  <div className="relative" ref={serviceDropdownRef}>
                    <FaStethoscope
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 text-base z-10 cursor-pointer"
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                    />
                    <div
                      className="custom-select w-full pl-9 pr-2 py-2 sm:py-2.5 md:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs sm:text-xs md:text-base shadow-sm cursor-pointer flex items-center justify-between hover:border-indigo-300"
                      onClick={(e) => { e.stopPropagation(); setShowServiceDropdown(!showServiceDropdown); }}
                    >
                      <span>
                        {selectedServiceIds.length === 0
                          ? 'Select Service(s)'
                          : `${selectedServiceIds.length} service(s) selected`}
                      </span>
                      <span className="text-gray-500">▼</span>
                    </div>

                    {showServiceDropdown && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-2 z-50 max-h-[200px] overflow-y-auto">
                        {services.length === 0 && <p className="text-gray-500 text-xs text-center">No services available.</p>}
                        {services.map((s) => (
                          <div key={s._id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`service-${s._id}`}
                              value={s._id}
                              checked={selectedServiceIds.includes(s._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedServiceIds([...selectedServiceIds, s._id]);
                                } else {
                                  setSelectedServiceIds(selectedServiceIds.filter((id) => id !== s._id));
                                }
                              }}
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <label htmlFor={`service-${s._id}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                              {s.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Doctor</label>
                  <div className="relative group-focus-within:scale-[1.02] transition-transform duration-200">
                    <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none text-base" />
                    <select
                      className="custom-select w-full pl-9 pr-2 py-2 sm:py-2.5 md:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs sm:text-xs md:text-base shadow-sm"
                      value={selectedDoctor}
                      onChange={(e) => {
                        setSelectedDoctor(e.target.value);
                        setSelectedDate(null);
                        setSelectedTimeSlot('');
                        setShowDoctorSelectionAlert(false);
                      }}
                      required
                    >
                      <option value="">Select Specialist</option>
                      {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
                    </select>
                  </div>
                  {showDoctorSelectionAlert && <p className="mt-2 text-xs text-red-600 animate-fade-in">Please select a doctor first.</p>}
                </div>
              </div>

                <div className="group overflow-visible">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Date</label>
                  <div
                    className="relative"
                    onClick={() => !selectedDoctor && setShowDoctorSelectionAlert(true)}
                  >
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 z-10 text-base" />
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        const isHoliday = doctorHolidays.some(
                          (holiday) => holiday.toDateString() === date.toDateString()
                        );
                        if (isHoliday) {
                          setShowHolidayAlert(true);
                          setSelectedDate(null);
                        } else {
                          setSelectedDate(date);
                          setShowHolidayAlert(false);
                        }
                      }}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select Date"
                      className={`w-full pl-9 pr-2 py-2 sm:py-2.5 md:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs sm:text-xs md:text-base shadow-sm ${!selectedDoctor ? 'pointer-events-none opacity-60' : ''}`}
                      dayClassName={(date) =>
                        doctorHolidays.some(holiday => holiday.toDateString() === date.toDateString())
                          ? 'react-datepicker__day--highlighted-holiday'
                          : undefined
                      }
                      required
                    />
                  </div>
                  {showHolidayAlert && <p className="mt-2 text-xs text-red-600 animate-fade-in">Doctor unavailable on this date.</p>}
                </div>

                <div className="group">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Time</label>
                  <div className="relative group-focus-within:scale-[1.02] transition-transform duration-200">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 pointer-events-none text-base" />
                    <select
                      className={`custom-select w-full pl-9 pr-2 py-2 sm:py-2.5 md:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs sm:text-xs md:text-base shadow-sm ${!selectedDoctor || !selectedDate ? 'pointer-events-none opacity-60' : ''}`}
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      onClick={() => !selectedDoctor && setShowDoctorSelectionAlert(true)}
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                </div>
            </section>

            <section className="pt-5 md:pt-8 border-t border-gray-100/80">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-200 shrink-0">2</div>
                <h3 className="text-base md:text-xl font-bold text-slate-800">Personal Info</h3>
              </div>

              <div className="space-y-3">
                <div className="relative group-focus-within:scale-[1.01] transition-transform duration-200">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-2 py-2 sm:py-2.5 md:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs sm:text-xs md:text-base shadow-sm"
                    placeholder="Full Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative group-focus-within:scale-[1.02] transition-transform duration-200">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                    <input
                      type="email"
                      className="w-full pl-9 pr-2 py-2 sm:py-2.5 md:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs sm:text-xs md:text-base shadow-sm"
                      placeholder="Email Address"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group-focus-within:scale-[1.02] transition-transform duration-200">
                    <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base" />
                    <input
                      type="tel"
                      className="w-full pl-9 pr-2 py-2 sm:py-2.5 md:py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs sm:text-xs md:text-base shadow-sm"
                      placeholder="Phone Number"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              onClick={handleOfflineBookingSubmit}
              disabled={isSubmitting}
              className={`
                relative z-10 w-full py-3 md:py-4 px-6 rounded-xl text-white font-bold text-sm md:text-lg shadow-xl shadow-indigo-200
                transition-all duration-300 transform active:scale-95 mt-6 hover:shadow-2xl hover:-translate-y-1 overflow-hidden
                ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-700'}
              `}
            >
              {!isSubmitting && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-shine-fast pointer-events-none"></div>}

              {isSubmitting ? 'Booking Offline Appointment...' : <span className="flex items-center justify-center gap-2 relative z-10">Confirm Offline Appointment <FaMoneyBillWave className="text-green-200 opacity-80"/></span>}
            </button>
          </form>

          <div className="hidden lg:flex lg:w-1/3 bg-slate-50/50 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-slate-200 p-4 md:p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-base md:text-xl font-bold text-slate-800 mb-4 flex items-center">
                <FaReceipt className="mr-2 text-indigo-600 text-base" /> Summary
              </h3>

              <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-slate-200/60 space-y-3 mb-4 md:mb-8 backdrop-blur-md">

                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Appointment Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-start text-sm pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center"><FaStethoscope className="mr-2 text-indigo-400"/>Service(s)</span>
                    <div className="font-medium text-slate-800 text-right flex flex-col items-end">
                      {selectedServiceIds.length > 0 ? (
                        selectedServiceIds.map(id => {
                          const service = services.find(s => s._id === id);
                          return service ? <span key={id}>{service.name}</span> : null;
                        })
                      ) : (
                        <span className="text-slate-300 text-xs italic">Not selected</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center"><FaClock className="mr-2 text-indigo-400"/>Time</span>
                    <span className="font-medium text-slate-800">
                      {selectedTimeSlot || <span className="text-slate-300 text-xs italic">--:--</span>}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center"><FaUserMd className="mr-2 text-indigo-400"/>Doctor</span>
                    <span className="font-medium text-slate-800 text-right max-w-[100px] truncate">
                      {selectedDoctor ? doctors.find(d => d._id === selectedDoctor)?.name : <span className="text-slate-300 text-xs italic">Not selected</span>}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Patient Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center"><FaUser className="mr-2 text-indigo-400"/>Name</span>
                      <span className="font-medium text-slate-800">
                        {patientName || <span className="text-slate-300 text-xs italic">Not entered</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center"><FaEnvelope className="mr-2 text-indigo-400"/>Email</span>
                      <span className="font-medium text-slate-800 truncate">
                        {patientEmail || <span className="text-slate-300 text-xs italic">Not entered</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center"><FaPhoneAlt className="mr-2 text-indigo-400"/>Phone</span>
                      <span className="font-medium text-slate-800">
                        {patientPhone || <span className="text-slate-300 text-xs italic">Not entered</span>}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Payment Overview</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Consultation Fee</span>
                    <span className="font-medium text-slate-800">₹{totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-2 mt-2 bg-slate-50/50 -mx-4 px-4 pb-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-700">Payment Status</span>
                      <span className="text-lg font-bold text-green-600">Bypassed (Offline)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-4">
                  <span className="text-lg font-bold text-slate-800">Total Payable</span>
                  <span className="2xl font-extrabold text-indigo-700">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && !bookingStatus && (
          <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 bg-white border-l-4 border-red-500 shadow-2xl rounded-r-lg p-4 flex items-center animate-fade-in z-50 max-w-md mx-auto">
            <div className="text-red-500 bg-red-50 rounded-full p-2 mr-3 shrink-0">
              <FaExclamationTriangle />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 break-words">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-3 text-gray-400 hover:text-gray-600 px-2">✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineAppointmentBookingPage;
