const express = require('express');
const router = express.Router();
const { calculateSmartMatchScore } = require('../services/smartMatchService');
const { query } = require('../config/db');

router.post('/', async (req, res, next) => {
  try {
    const { eventType, city, guestCount, targetBudget, category } = req.body;
    const [allVendors] = await query('SELECT * FROM vendors');

    let vendors = allVendors;
    if (category && category !== 'All') {
      vendors = vendors.filter(v => v.category.toLowerCase() === category.toLowerCase());
    }

    const scored = vendors.map(vendor => {
      const match = calculateSmartMatchScore(vendor, {
        eventType: eventType || 'Wedding',
        city: city || 'Patna',
        guestCount: Number(guestCount) || 200,
        targetBudget: Number(targetBudget) || Number(vendor.starting_price)
      });
      return {
        ...vendor,
        matchScore: match.score,
        matchReasons: match.reasons
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: scored.length,
      vendors: scored
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
