const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor.model');

// GET /api/doctors - Get all doctors (publicly accessible)
router.get('/', async (req, res) => {
    try {
      const doctors = await Doctor.find({}, 'name specialization'); // Fetch only necessary public fields
      res.status(200).json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
