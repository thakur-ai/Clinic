import React, { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ReappointmentModal = ({
  isOpen,
  onClose,
  patientData,
  onAppointmentBooked,
}) => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill patient details if available
  useEffect(() => {
    if (patientData) {
      // Logic unchanged
    }
  }, [patientData]);

  // Fetch doctors and services on modal open
  useEffect(() => {
    if (isOpen) {
      const fetchDoctorsAndServices = async () => {
        setLoading(true);
        setError(null);
        try {
          const doctorsResponse = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/admin/doctors`
          );
          const servicesResponse = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/admin/services`
          );

          if (!doctorsResponse.ok || !servicesResponse.ok) {
            throw new Error("Failed to fetch doctors or services");
          }

          const doctorsData = await doctorsResponse.json();
          const servicesData = await servicesResponse.json();

          setDoctors(doctorsData);
          setServices(servicesData);
        } catch (err) {
          console.error("Error fetching doctors/services:", err);
          setError("Failed to load doctors and services.");
        } finally {
          setLoading(false);
        }
      };
      fetchDoctorsAndServices();
    }
  }, [isOpen]);

  const handleBookAppointment = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!date || !timeSlot || !selectedService || !selectedDoctor) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      const serviceObj = services.find((s) => s.name === selectedService);
      const doctorObj = doctors.find((d) => d.name === selectedDoctor);

      if (!serviceObj || !doctorObj) {
        setError("Selected service or doctor not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            date,
            timeSlot,
            serviceId: serviceObj._id,
            doctorId: doctorObj._id,
            patientName: patientData.patientName,
            patientEmail: patientData.patientEmail,
            patientPhone: patientData.patientPhone,
            paymentOption: "Pay advance",
            advanceAmount: 50,
            originalAppointmentId: patientData.appointmentId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setSuccess(true);
      setDate("");
      setTimeSlot("");
      setSelectedService("");
      setSelectedDoctor("");
      onAppointmentBooked(result.appointment);
    } catch (err) {
      console.error("Error booking reappointment:", err);
      setError(err.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop: Modern blur effect
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-opacity duration-300">
      {/* Modal Container */}
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        style={{ maxHeight: "90vh" }}
      >
        {/* Sticky Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Rebook Appointment
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Schedule a follow-up for this patient
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Notifications */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3 text-green-700 animate-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                Appointment rebooked successfully!
              </p>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBookAppointment();
            }}
            className="space-y-6"
          >
            {/* Patient Info Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <UserIcon className="w-4 h-4" /> Patient Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-0.5">Name</span>
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {patientData?.patientName}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-0.5">Email</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">
                      {patientData?.patientEmail}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-0.5">Phone</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {patientData?.patientPhone}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2"></div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label
                  htmlFor="reapp-date"
                  className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1"
                >
                  Appointment Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    id="reapp-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label
                  htmlFor="reapp-time"
                  className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1"
                >
                  Time Slot
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <input
                    type="time"
                    id="reapp-time"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Service */}
              <div className="md:col-span-2">
                <label
                  htmlFor="reapp-service"
                  className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1"
                >
                  Service
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <select
                    id="reapp-service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm appearance-none"
                    required
                  >
                    <option value="">Select a Service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name} - ₹{s.basePrice}
                      </option>
                    ))}
                  </select>
                  {/* Custom Chevron */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Doctor */}
              <div className="md:col-span-2">
                <label
                  htmlFor="reapp-doctor"
                  className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1"
                >
                  Doctor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <select
                    id="reapp-doctor"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm appearance-none"
                    required
                  >
                    <option value="">Select a Doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d.name}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                  {/* Custom Chevron */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
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
                    <span>Processing...</span>
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReappointmentModal;
