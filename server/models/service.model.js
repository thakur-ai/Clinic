const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  // If a service has a price range, min/max can be stored
  minPrice: {
    type: Number,
  },
  maxPrice: {
    type: Number,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
