const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model'); // Needed for populating doctor
const Service = require('../models/service.model'); // Needed for populating service
// No need for separate auth middleware here, as `protectAdmin` is applied in index.js

// GET /api/admin/appointments/:id - Get all appointments by appointmentId (UUID) for admin
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await Appointment.find({ appointmentId: id })
      .populate('doctor', 'name specialization')
      .populate('services', 'name basePrice'); // Changed to 'services' to match schema

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'Appointments not found for this ID.' });
    }

    res.status(200).json(appointments); // Return an array of appointments
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id - Update general patient details for an appointment
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      patientName, 
      patientEmail, 
      patientPhone, 
      date, 
      service, // This will be the service ID
      doctor,   // This will be the doctor ID
      status 
    } = req.body;

    // Optional: Validate if service and doctor IDs exist
    if (service) {
      const existingService = await Service.findOne({ name: service }); // Assuming client sends name
      if (!existingService) return res.status(404).json({ message: 'Service not found.' });
      req.body.service = existingService._id;
    }
    if (doctor) {
      const existingDoctor = await Doctor.findOne({ name: doctor }); // Assuming client sends name
      if (!existingDoctor) return res.status(404).json({ message: 'Doctor not found.' });
      req.body.doctor = existingDoctor._id;
    }


    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId: id }, 
      { $set: req.body }, // Update with all fields sent in req.body
      { new: true, runValidators: true }
    )
    .populate('doctor', 'name specialization')
    .populate('services', 'name basePrice'); // Changed to 'services' to match schema

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment details updated successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id/medical-history - Update medical history for an appointment
router.patch('/:id/medical-history', async (req, res) => {
  try {
    const { id } = req.params;
    const { medicalHistory } = req.body; 

    // Find the appointment by appointmentId (UUID) and update its medicalHistory subdocument
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId: id }, // Find by appointmentId
      {
        $set: {
          'medicalHistory.dentalProblems': medicalHistory.dentalProblems,
          'medicalHistory.treatments': medicalHistory.treatments,
          'medicalHistory.medications': medicalHistory.medications,
        },
      },
      { new: true, runValidators: true }
    )
    .populate('doctor', 'name specialization')
    .populate('services', 'name basePrice'); // Changed to 'services' to match schema

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Medical history updated successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating medical history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id/notes - Update appointment notes
router.patch('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { notes },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment notes updated successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment notes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id/status - Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required to update appointment status.' });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId: id }, // Find by appointmentId (UUID)
      { status },
      { new: true, runValidators: true }
    )
    .populate('doctor', 'name specialization')
    .populate('services', 'name basePrice'); // Populate for consistent response

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment status updated successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id/reschedule - Reschedule an appointment
router.patch('/:id/reschedule', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, timeSlot, status } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'New date and time slot are required for rescheduling.' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { date, timeSlot, status: status || 'Rescheduled' }, // Default to 'Rescheduled' if status not provided
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment rescheduled successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/admin/appointments/:id - Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAppointment = await Appointment.findOneAndDelete({ appointmentId: id });

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const multer = require('multer'); // Import multer
const path = require('path'); // Import path
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // Set the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Set unique filename
  },
});

const upload = multer({ storage: storage });

// GET /api/admin/appointments/mongo-id/:id - Get a single appointment by MongoDB _id for admin
router.get('/mongo-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('doctor', 'name specialization')
      .populate('services', 'name basePrice'); // Changed to 'services' to match schema

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching admin appointment by MongoDB _id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id/upload-before-image - Upload before treatment image
router.patch('/:id/upload-before-image', upload.single('beforeTreatmentImage'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Path to the uploaded image

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { beforeTreatmentImage: imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Before treatment image uploaded successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error uploading before treatment image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id/upload-after-image - Upload after treatment image
router.patch('/:id/upload-after-image', upload.single('afterTreatmentImage'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Path to the uploaded image

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { afterTreatmentImage: imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'After treatment image uploaded successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error uploading after treatment image:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/admin/appointments/:id/upload-document - Upload a new document
router.patch('/:id/upload-document', upload.single('document'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const documentPath = `/uploads/${req.file.filename}`;
    const documentName = req.file.originalname;
    const documentType = req.file.mimetype; // Get MIME type from multer

    const newDocument = {
      name: documentName,
      path: documentPath,
      type: documentType,
      uploadedAt: new Date(),
    };

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $push: { documents: newDocument } }, // Push new document to the array
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({ message: 'Document uploaded successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/admin/appointments/offline - Create an offline appointment
router.post('/offline', async (req, res) => {
  try {
    const {
      date,
      timeSlot,
      serviceIds,
      doctorId,
      patientName,
      patientEmail,
      patientPhone,
      totalAmount,
      isOfflineBooking,
    } = req.body;

    // Validate required fields
    if (!date || !timeSlot || !serviceIds || serviceIds.length === 0 || !doctorId || !patientName || !patientEmail || !patientPhone || totalAmount === undefined) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Check if doctor and services exist
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const servicesExist = await Service.find({ _id: { $in: serviceIds } });
    if (servicesExist.length !== serviceIds.length) {
      return res.status(404).json({ message: 'One or more services not found.' });
    }

    const newAppointment = new Appointment({
      date,
      timeSlot,
      services: serviceIds,
      doctor: doctorId,
      patientName,
      patientEmail,
      patientPhone,
      paymentOption: 'Offline Payment',
      advanceAmount: 0, // Bypassing fees for offline appointments
      totalAmount,
      paymentStatus: 'Bypassed', // Marking payment as bypassed
      isOfflineBooking: true,
      status: 'Approved', // Offline appointments created by admin are directly approved
      appointmentId: uuidv4(), // Generate a unique UUID for the appointment
    });

    const savedAppointment = await newAppointment.save();

    // Populate doctor and services for the response
    await savedAppointment.populate('doctor', 'name specialization');
    await savedAppointment.populate('services', 'name basePrice');

    res.status(201).json({ message: 'Offline appointment created successfully', appointment: savedAppointment });
  } catch (error) {
    console.error('Error creating offline appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

exports.router = router; // Use named export
