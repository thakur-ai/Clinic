const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  services: [{ // Changed to services (array)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Reference to the Service model
    required: true,
  }],
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to the Doctor model
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  paymentOption: {
    type: String,
    enum: ['Pay advance', 'Offline Payment'], // Added Offline Payment
    default: 'Pay advance',
  },
  advanceAmount: {
    type: Number,
    required: true, // No default, or make it conditional in route
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Failed', 'Refunded', 'Bypassed'], // Added Bypassed
    default: 'Paid',
  },
  isOfflineBooking: {
    type: Boolean,
    default: false,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Pending',
  },
  appointmentId: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  medicalHistory: {
    dentalProblems: {
      type: [String], // Array of strings for dental problems
      default: [],
    },
    treatments: {
      type: [String], // Array of strings for treatments
      default: [],
    },
    medications: {
      type: String, // Free-form text for medications
      default: '',
    },
  },
  beforeTreatmentImage: {
    type: String,
  },
  afterTreatmentImage: {
    type: String,
  },
  documents: [
    {
      name: { type: String, required: true },
      path: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      type: { type: String }, // e.g., 'PDF', 'Image', 'Text', based on mime type
    },
  ],
}, {
  timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
