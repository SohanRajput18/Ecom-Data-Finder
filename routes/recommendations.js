const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const User = require('../models/User');

// Get card recommendations based on user preferences
router.post('/', async (req, res) => {
  try {
    const { preferences } = req.body;
    const cards = await Card.find({ isActive: true });

    // Calculate scores for each card
    const scoredCards = cards.map(card => {
      let score = 0;
      let totalWeight = 0;

      // Match spending categories
      preferences.spendingCategories.forEach(userCategory => {
        const cardBenefit = card.benefits.find(
          benefit => benefit.category === userCategory.category
        );
        if (cardBenefit) {
          score += cardBenefit.value * userCategory.weight;
          totalWeight += userCategory.weight;
        }
      });

      // Match preferred benefits
      preferences.preferredBenefits.forEach(benefit => {
        if (card.features.includes(benefit)) {
          score += 10; // Add bonus points for matching preferred benefits
        }
      });

      // Penalize for high fees if user prefers low fees
      if (preferences.preferredBenefits.includes('low fee')) {
        const feePenalty = card.annualFee * 0.1;
        score -= feePenalty;
      }

      // Check eligibility
      if (
        preferences.incomeRange &&
        card.eligibility.minIncome &&
        parseInt(preferences.incomeRange) < card.eligibility.minIncome
      ) {
        score = 0; // Disqualify if income requirement not met
      }

      if (
        preferences.creditScore &&
        card.eligibility.minCreditScore &&
        parseInt(preferences.creditScore) < card.eligibility.minCreditScore
      ) {
        score = 0; // Disqualify if credit score requirement not met
      }

      // Normalize score
      const normalizedScore = totalWeight > 0 ? score / totalWeight : 0;

      return {
        ...card.toObject(),
        matchScore: normalizedScore
      };
    });

    // Sort cards by match score
    const recommendedCards = scoredCards
      .filter(card => card.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Return top 5 recommendations

    res.json(recommendedCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save user preferences
router.post('/preferences', async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = preferences;
    await user.save();

    res.json({ message: 'Preferences saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 