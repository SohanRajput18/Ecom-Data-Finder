const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all cards including inactive ones (admin only)
router.get('/cards', isAdmin, async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analytics (admin only)
router.get('/analytics', isAdmin, async (req, res) => {
  try {
    // Get total number of users
    const totalUsers = await User.countDocuments();

    // Get total number of cards
    const totalCards = await Card.countDocuments();

    // Get most saved cards
    const mostSavedCards = await User.aggregate([
      { $unwind: '$savedCards' },
      { $group: { _id: '$savedCards', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get card recommendations by category
    const recommendationsByCategory = await Card.aggregate([
      { $unwind: '$benefits' },
      { $group: { _id: '$benefits.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalCards,
      mostSavedCards,
      recommendationsByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 