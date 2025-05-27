const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  spendingCategories: [{
    type: String,
    required: true
  }],
  incomeRange: {
    type: String
  },
  creditScore: {
    type: String
  },
  preferredBenefits: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
userPreferenceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema); 