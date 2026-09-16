const express = require('express');
const router = express.Router();
const { calculateCategoryAllocations, recalculatePlan, generateBudgetPlan } = require('../services/budgetService');
const { query } = require('../config/db');

router.post('/calculate', (req, res) => {
  const { totalBudget, requiredServices = [], selectedVendors = [] } = req.body;

  if (selectedVendors.length > 0) {
    const summary = recalculatePlan(totalBudget, selectedVendors);
    return res.json({ success: true, ...summary });
  }

  const allocations = calculateCategoryAllocations(totalBudget, requiredServices);
  res.json({
    success: true,
    totalBudget: Number(totalBudget),
    allocations
  });
});

router.post('/auto-plan', async (req, res, next) => {
  try {
    const { totalBudget, requiredServices, eventRequirements } = req.body;
    const [vendors] = await query('SELECT * FROM vendors');

    const plan = generateBudgetPlan(
      totalBudget,
      requiredServices || ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'],
      vendors,
      eventRequirements || {}
    );

    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
