const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const User = require('../models/User');

// Get all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({ isActive: true });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single card
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new card (admin only)
router.post('/', async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update card (admin only)
router.put('/:id', async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete card (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save card to user's favorites
router.post('/:id/save', async (req, res) => {
  try {
    const userId = req.user.id;
    const cardId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.savedCards.includes(cardId)) {
      user.savedCards.push(cardId);
      await user.save();
    }

    res.json({ message: 'Card saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove card from user's favorites
router.delete('/:id/save', async (req, res) => {
  try {
    const userId = req.user.id;
    const cardId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedCards = user.savedCards.filter(id => id.toString() !== cardId);
    await user.save();

    res.json({ message: 'Card removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get card recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { spendingCategories, incomeRange, creditScore } = req.body;
    
    // Get all active cards
    let cards = await Card.find({ isActive: true });
    
    // Filter cards based on income range
    if (incomeRange) {
      const [minIncome, maxIncome] = incomeRange.split('-').map(Number);
      cards = cards.filter(card => {
        const cardMinIncome = card.eligibility.minIncome || 0;
        return cardMinIncome >= minIncome && (!maxIncome || cardMinIncome <= maxIncome);
      });
    }
    
    // Filter cards based on credit score
    if (creditScore) {
      const scoreRanges = {
        poor: [300, 579],
        fair: [580, 669],
        good: [670, 739],
        very_good: [740, 799],
        excellent: [800, 850]
      };
      
      const [minScore, maxScore] = scoreRanges[creditScore] || [0, 850];
      cards = cards.filter(card => {
        const cardMinScore = card.eligibility.minCreditScore || 0;
        return cardMinScore >= minScore && cardMinScore <= maxScore;
      });
    }
    
    // Sort cards based on spending categories
    if (spendingCategories && spendingCategories.length > 0) {
      cards.sort((a, b) => {
        const aBenefits = a.benefits || [];
        const bBenefits = b.benefits || [];
        
        const aMatches = aBenefits.filter(benefit => 
          spendingCategories.some(category => 
            benefit.category.toLowerCase().includes(category.toLowerCase())
          )
        ).length;
        
        const bMatches = bBenefits.filter(benefit => 
          spendingCategories.some(category => 
            benefit.category.toLowerCase().includes(category.toLowerCase())
          )
        ).length;
        
        return bMatches - aMatches;
      });
      
      // Add match score to each card
      cards = cards.map(card => {
        const benefits = card.benefits || [];
        const matches = benefits.filter(benefit => 
          spendingCategories.some(category => 
            benefit.category.toLowerCase().includes(category.toLowerCase())
          )
        ).length;
        
        const matchScore = (matches / benefits.length) * 100;
        return { ...card.toObject(), matchScore };
      });
    }
    
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 