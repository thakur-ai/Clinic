const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor.model');
const Service = require('../models/service.model');
const Appointment = require('../models/appointment.model'); // Import Appointment model
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// All routes in this file will be protected by `protectAdmin` middleware

// GET /api/admin/doctors - Get all doctors with their availability
router.get('/doctors', protectAdmin, async (req, res) => {
    try {
      const doctors = await Doctor.find({}, 'name specialization email phone availability holidays'); // Fetch all necessary fields including holidays
      res.status(200).json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/admin/doctors - Add a new doctor
router.post('/doctors', protectAdmin, async (req, res) => {
  try {
    const { name, specialization, email, phone } = req.body;
    if (!name || !specialization || !email || !phone) {
      return res.status(400).json({ message: 'Name, specialization, email, and phone are required for a doctor.' });
    }
    const newDoctor = new Doctor({ name, specialization, email, phone });
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/doctors/:id - Update doctor details
router.patch('/doctors/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, email, phone } = req.body;
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { name, specialization, email, phone },
      { new: true, runValidators: true }
    );
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/admin/doctors/:id - Delete a doctor
router.delete('/doctors/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully', doctor: deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/admin/services - Get all services with their pricing
router.get('/services', protectAdmin, async (req, res) => {
    try {
      const services = await Service.find({}, 'name basePrice minPrice maxPrice description');
      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/admin/services - Add a new service
router.post('/services', protectAdmin, async (req, res) => {
  try {
    const { name, basePrice, minPrice, maxPrice, description } = req.body;
    if (!name || !basePrice) {
      return res.status(400).json({ message: 'Name and base price are required for a service.' });
    }
    const newService = new Service({ name, basePrice, minPrice, maxPrice, description });
    await newService.save();
    res.status(201).json({ message: 'Service added successfully', service: newService });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/services/:id - Update service details
router.patch('/services/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, basePrice, minPrice, maxPrice, description } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, basePrice, minPrice, maxPrice, description },
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.status(200).json({ message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/admin/services/:id - Delete a service
router.delete('/services/:id', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.status(200).json({ message: 'Service deleted successfully', service: deletedService });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/admin/doctors/:id/holidays - Get a specific doctor's holidays
router.get('/doctors/:id/holidays', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    res.status(200).json({ holidays: doctor.holidays });
  } catch (error) {
    console.error('Error fetching doctor holidays:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/admin/doctors/:id/schedule - Get a specific doctor's appointments and holidays
router.get('/doctors/:id/schedule', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      console.warn(`Doctor with ID ${id} not found when fetching schedule.`); // Log a warning for clarity
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const appointments = await Appointment.find({ doctor: id })
      .populate('doctor', 'name specialization')
      .populate('services') // Populate all fields of the service
      .select('date timeSlot services status patientName patientEmail patientPhone totalAmount paymentOption paymentStatus appointmentId notes');

    res.status(200).json({
      doctorName: doctor.name,
      holidays: doctor.holidays,
      appointments: appointments,
    });
  } catch (error) {
    console.error(`Error fetching schedule for doctor ID ${req.params.id}:`, error); // More specific error logging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/doctors/:id/holidays - Add or remove holidays for a doctor
router.patch('/doctors/:id/holidays', protectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { holidayDate, action } = req.body; // action: 'add' or 'remove'

    if (!holidayDate || !action) {
      return res.status(400).json({ message: 'Holiday date and action (add/remove) are required.' });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const dateToAddOrRemove = new Date(holidayDate);

    if (action === 'add') {
      // Add holiday if not already present
      if (!doctor.holidays.some(h => h.toDateString() === dateToAddOrRemove.toDateString())) {
        doctor.holidays.push(dateToAddOrRemove);
      }
    } else if (action === 'remove') {
      // Remove holiday
      doctor.holidays = doctor.holidays.filter(h => h.toDateString() !== dateToAddOrRemove.toDateString());
    } else {
      return res.status(400).json({ message: 'Invalid action. Must be "add" or "remove".' });
    }

    await doctor.save();
    res.status(200).json({ message: 'Doctor holidays updated successfully', doctor: doctor });
  } catch (error) {
    console.error('Error updating doctor holidays:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
