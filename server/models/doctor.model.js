const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  availability: [
    {
      date: {
        type: Date,
        required: true,
      },
      timeSlots: [
        {
          slot: {
            type: String, // e.g., "09:00-10:00"
            required: true,
          },
          isBooked: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  holidays: [
    {
      type: Date,
    },
  ],
}, {
  timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
