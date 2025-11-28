const express = require('express');
const router = express.Router();
const Service = require('../models/service.model');

// GET /api/services - Get all services (publicly accessible)
router.get('/', async (req, res) => {
    try {
      const services = await Service.find({}, 'name basePrice'); // Fetch only necessary public fields
      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
