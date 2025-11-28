const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const Service = require('../models/service.model');
const { v4: uuidv4 } = require('uuid'); // For generating unique appointment IDs
const Razorpay = require('razorpay');
const crypto = require('crypto');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/appointments/create-order - Create a new Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: 50 * 100, // amount in smallest currency unit (e.g., paise for INR)
      currency: 'INR',
      receipt: uuidv4(),
      payment_capture: 1, // 1 for automatic capture
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/appointments/verify-payment - Verify Razorpay payment
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
});

// GET /api/appointments - Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('doctor', 'name specialization')
      .populate('services', 'name basePrice');

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/appointments/services - Get all services
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/appointments/doctors - Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/appointments/doctors - Create a new doctor
router.post('/doctors', async (req, res) => {
  try {
    const { name, specialization, email, phone, availability, holidays } = req.body;

    // Validate required fields
    if (!name || !specialization || !email) {
      return res.status(400).json({ message: 'Name, specialization, and email are required for a new doctor.' });
    }

    // Check if a doctor with the same email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: 'A doctor with this email already exists.' });
    }

    const newDoctor = new Doctor({
      name,
      specialization,
      email,
      phone,
      availability: availability || [],
      holidays: holidays || [],
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor created successfully!', doctor: newDoctor });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// GET /api/appointments/doctors/:id/holidays - Get holidays for a specific doctor
router.get('/doctors/:id/holidays', async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.status(200).json({ holidays: doctor.holidays || [] }); // Assuming doctor model has a 'holidays' array
  } catch (error) {
    console.error('Error fetching doctor holidays:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// POST /api/appointments - Create a new appointment
router.post('/', async (req, res) => {
  try {
    const {
      date,
      timeSlot,
      serviceIds, // Changed to serviceIds (array)
      doctorId,
      patientName,
      patientEmail,
      patientPhone,
      paymentOption,
      advanceAmount,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Validate input
    if (!date || !timeSlot || !serviceIds || serviceIds.length === 0 || !doctorId || !patientName || !patientEmail || !patientPhone || !paymentOption) {
      return res.status(400).json({ message: 'All required fields must be provided, and at least one service must be selected.' });
    }

    // Find the selected doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Find the services and calculate total amount
    const servicesData = await Service.find({ _id: { $in: serviceIds } });
    if (servicesData.length !== serviceIds.length) {
      return res.status(404).json({ message: 'One or more services not found.' });
    }

    const totalAmount = servicesData.reduce((sum, service) => sum + service.basePrice, 0);

    const { originalAppointmentId } = req.body;
    const appointmentId = originalAppointmentId || uuidv4();

    const newAppointment = new Appointment({
      date,
      timeSlot,
      services: serviceIds, // Changed to services (array)
      doctor: doctorId,
      patientName,
      patientEmail,
      patientPhone,
      paymentOption: 'Pay advance',
      advanceAmount: 50,
      totalAmount,
      paymentStatus: 'Paid',
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      appointmentId,
      status: 'Pending',
    });

    await newAppointment.save();

    // After saving, populate doctor and service details for the response
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('doctor', 'name specialization')
      .populate('services', 'name basePrice'); // Changed to services (plural)

    // TODO: Update doctor's availability (mark the time slot as booked)
    // This will involve finding the specific date and time slot in doctor.availability array and setting isBooked to true.

    // TODO: Send email confirmation to patient

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment: populatedAppointment,
      appointmentId: newAppointment.appointmentId,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/appointments/:id - Get all appointments by appointmentId (UUID)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Assuming 'id' from req.params is the UUID generated as 'appointmentId'
    const appointments = await Appointment.find({ appointmentId: id })
      .populate('doctor', 'name specialization')
      .populate('services', 'name basePrice'); // Changed to services (plural)

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'Appointments not found for this ID.' });
    }

    res.status(200).json(appointments); // Return an array of appointments
  } catch (error) {
    console.error('Error fetching appointments by UUID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/appointments/mongo-id/:id - Get a single appointment by MongoDB _id
router.get('/mongo-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('doctor', 'name specialization')
      .populate('services', 'name basePrice'); // Changed to services (plural)

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment by MongoDB _id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/appointments/patient/:email - Get all appointments for a specific patient email
router.get('/patient/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const patientAppointments = await Appointment.find({ patientEmail: email })
      .populate('doctor', 'name specialization')
      .populate('services', 'name basePrice') // Changed to services (plural)
      .sort({ date: -1, timeSlot: -1 }); // Sort by most recent appointments first

    if (!patientAppointments || patientAppointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this patient email.' });
    }

    res.status(200).json(patientAppointments);
  } catch (error) {
    console.error('Error fetching appointments by patient email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
