import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Stethoscope, Mail, Phone, User as UserIcon } from 'lucide-react';

const ReappointmentModal = ({ isOpen, onClose, patientData, onAppointmentBooked }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill patient details if available
  useEffect(() => {
    if (patientData) {
      // You might want to set these as initial values for *hidden* inputs
      // or just pass them directly in the booking API call
    }
  }, [patientData]);

  // Fetch doctors and services on modal open
  useEffect(() => {
    if (isOpen) {
      const fetchDoctorsAndServices = async () => {
        setLoading(true);
        setError(null);
        try {
          const doctorsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/doctors`);
          const servicesResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/services`);

          if (!doctorsResponse.ok || !servicesResponse.ok) {
            throw new Error('Failed to fetch doctors or services');
          }

          const doctorsData = await doctorsResponse.json();
          const servicesData = await servicesResponse.json();

          setDoctors(doctorsData);
          setServices(servicesData);
        } catch (err) {
          console.error('Error fetching doctors/services:', err);
          setError('Failed to load doctors and services.');
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
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken'); // Assuming token is needed for booking

      const serviceObj = services.find(s => s.name === selectedService);
      const doctorObj = doctors.find(d => d.name === selectedDoctor);

      if (!serviceObj || !doctorObj) {
        setError('Selected service or doctor not found.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Add authorization if needed
        },
        body: JSON.stringify({
          date,
          timeSlot,
          serviceId: serviceObj._id,
          doctorId: doctorObj._id,
          patientName: patientData.patientName,
          patientEmail: patientData.patientEmail,
          patientPhone: patientData.patientPhone,
          paymentOption: 'Pay advance', // Assuming this default for rebooking
          advanceAmount: 50, // Assuming a default for rebooking
          originalAppointmentId: patientData.appointmentId, // Pass the original appointment's UUID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess(true);
      setDate('');
      setTimeSlot('');
      setSelectedService('');
      setSelectedDoctor('');
      onAppointmentBooked(result.appointment); // Notify parent of new appointment

    } catch (err) {
      console.error('Error booking reappointment:', err);
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Rebook Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">Appointment rebooked successfully!</p>}

        <form onSubmit={(e) => { e.preventDefault(); handleBookAppointment(); }} className="space-y-4">
          
          {/* Patient Info (Display Only) */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Patient Details</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <UserIcon size={16} /><p>{patientData?.patientName}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail size={16} /><p>{patientData?.patientEmail}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone size={16} /><p>{patientData?.patientPhone}</p>
            </div>
          </div>

          {/* New Appointment Details */}
          <div>
            <label htmlFor="reapp-date" className="block text-sm font-medium text-gray-700">Appointment Date</label>
            <input
              type="date"
              id="reapp-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              required
            />
          </div>

          <div>
            <label htmlFor="reapp-time" className="block text-sm font-medium text-gray-700">Time Slot</label>
            <input
              type="time"
              id="reapp-time"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="reapp-service" className="block text-sm font-medium text-gray-700">Service</label>
            <select
              id="reapp-service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a Service</option>
              {services.map((s) => (
                <option key={s._id} value={s.name}>{s.name} - ₹{s.basePrice}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reapp-doctor" className="block text-sm font-medium text-gray-700">Doctor</label>
            <select
              id="reapp-doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a Doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d.name}>{d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReappointmentModal;
