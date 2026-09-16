/**
 * Budget Calculation & Optimization Service
 * Handles percentage allocations, dynamic totals, remaining budget, and overrun warnings.
 */

// Default realistic allocation percentages by category
const DEFAULT_ALLOCATION_WEIGHTS = {
  Venue: 0.30,       // 30%
  Catering: 0.35,    // 35%
  Decoration: 0.15,  // 15%
  Photography: 0.12, // 12%
  DJ: 0.08           // 8%
};

/**
 * Calculates budget allocation per required service
 */
const calculateCategoryAllocations = (totalBudget, requiredServices = []) => {
  const budget = Number(totalBudget) || 0;
  if (requiredServices.length === 0) return {};

  let totalWeight = 0;
  requiredServices.forEach(svc => {
    totalWeight += (DEFAULT_ALLOCATION_WEIGHTS[svc] || 0.10);
  });

  const allocations = {};
  requiredServices.forEach(svc => {
    const rawWeight = DEFAULT_ALLOCATION_WEIGHTS[svc] || 0.10;
    const normalizedWeight = rawWeight / totalWeight;
    allocations[svc] = Math.round(budget * normalizedWeight);
  });

  return allocations;
};

/**
 * Generates an optimized event plan by picking compatible vendors within budget
 */
const generateBudgetPlan = (totalBudget, requiredServices, availableVendors, eventRequirements) => {
  const allocations = calculateCategoryAllocations(totalBudget, requiredServices);
  const selectedVendors = [];
  let allocatedTotal = 0;

  const { calculateSmartMatchScore } = require('./smartMatchService');

  requiredServices.forEach(category => {
    const targetBudgetForCategory = allocations[category] || 50000;
    
    // Filter vendors in this category
    let categoryVendors = availableVendors.filter(v => v.category === category);
    
    // Fallback if none in exact category
    if (categoryVendors.length === 0) return;

    // Score vendors with Smart Match
    const scored = categoryVendors.map(vendor => {
      const match = calculateSmartMatchScore(vendor, {
        ...eventRequirements,
        targetBudget: targetBudgetForCategory
      });
      return {
        ...vendor,
        matchScore: match.score,
        matchReasons: match.reasons
      };
    });

    // Sort by: price within target budget + highest match score
    scored.sort((a, b) => {
      // Prioritize vendors <= target budget, then by match score
      const aWithin = a.starting_price <= targetBudgetForCategory ? 1 : 0;
      const bWithin = b.starting_price <= targetBudgetForCategory ? 1 : 0;
      if (aWithin !== bWithin) return bWithin - aWithin;
      return b.matchScore - a.matchScore;
    });

    const chosen = scored[0];
    if (chosen) {
      selectedVendors.push(chosen);
      allocatedTotal += Number(chosen.starting_price);
    }
  });

  const remainingBudget = Number(totalBudget) - allocatedTotal;
  const isOverBudget = remainingBudget < 0;

  return {
    totalBudget: Number(totalBudget),
    allocatedTotal,
    remainingBudget,
    isOverBudget,
    overrunAmount: isOverBudget ? Math.abs(remainingBudget) : 0,
    allocations,
    selectedVendors,
    statusMessage: isOverBudget
      ? `Your selected plan exceeds the budget by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}.`
      : `Your event plan is within budget with ₹${remainingBudget.toLocaleString('en-IN')} remaining.`
  };
};

/**
 * Recalculates plan totals when a vendor is selected, replaced, or removed
 */
const recalculatePlan = (totalBudget, selectedVendorsList) => {
  const budget = Number(totalBudget) || 0;
  let allocatedTotal = 0;

  selectedVendorsList.forEach(vendor => {
    allocatedTotal += Number(vendor.starting_price || vendor.allocated_price || 0);
  });

  const remainingBudget = budget - allocatedTotal;
  const isOverBudget = remainingBudget < 0;

  return {
    totalBudget: budget,
    allocatedTotal,
    remainingBudget,
    isOverBudget,
    overrunAmount: isOverBudget ? Math.abs(remainingBudget) : 0,
    percentageUsed: budget > 0 ? Math.min(100, Math.round((allocatedTotal / budget) * 100)) : 0,
    statusMessage: isOverBudget
      ? `Your selected plan exceeds the budget by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}.`
      : `Your event plan is within budget with ₹${remainingBudget.toLocaleString('en-IN')} remaining.`
  };
};

module.exports = {
  calculateCategoryAllocations,
  generateBudgetPlan,
  recalculatePlan
};
