const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide card name'],
    trim: true
  },
  issuer: {
    type: String,
    required: [true, 'Please provide card issuer'],
    trim: true
  },
  annualFee: {
    type: Number,
    required: [true, 'Please provide annual fee']
  },
  joiningFee: {
    type: Number,
    default: 0
  },
  benefits: [{
    category: String,
    description: String,
    value: Number,
    weight: Number
  }],
  eligibility: {
    minIncome: Number,
    minCreditScore: Number
  },
  features: [String],
  imageUrl: String,
  applyLink: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
cardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Card', cardSchema); 