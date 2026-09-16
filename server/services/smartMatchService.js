/**
 * Smart Match Algorithm (Transparent 100-Point Rule-Based Engine)
 * Evaluates vendor compatibility against user event requirements.
 * Fully guarded against missing payload keys, null values, and undefined properties.
 */

const calculateSmartMatchScore = (vendor = {}, eventRequirements = {}) => {
  // Safe extraction with fallbacks for alternative key names (e.g., location, budget, budgetTier)
  const eventType = eventRequirements.eventType || eventRequirements.event_type || 'Wedding';
  const city = eventRequirements.city || eventRequirements.location || 'Patna';
  const guestCount = Number(eventRequirements.guestCount || eventRequirements.guest_count || eventRequirements.guests || 200);
  const targetBudget = Number(eventRequirements.targetBudget || eventRequirements.target_budget || eventRequirements.budget || 70000);

  let totalScore = 0;
  const reasons = [];

  // Safe vendor field extraction
  const vendorCity = (vendor.city || vendor.location || '').toString();
  const vendorPrice = Number(vendor.starting_price || vendor.price || vendor.allocated_price || 0);
  const vendorCategory = (vendor.category || vendor.service_category || 'Service').toString();
  const vendorCapacity = Number(vendor.max_capacity || vendor.capacity || 0);
  const supportedEvents = (vendor.supported_events || vendor.supportedEvents || 'Wedding, Birthday, Corporate, Reception').toString();
  const vendorRating = Number(vendor.rating || 4.5);

  // 1. Location Match (Max 20 pts)
  if (vendorCity && city && vendorCity.toLowerCase() === city.toLowerCase()) {
    totalScore += 20;
    reasons.push(`Located directly in ${vendorCity}`);
  } else if (vendorCity) {
    totalScore += 10;
    reasons.push(`Regional vendor serving ${city}`);
  } else {
    totalScore += 10;
    reasons.push(`Available in your selected region`);
  }

  // 2. Budget Compatibility (Max 25 pts)
  if (targetBudget > 0 && vendorPrice > 0) {
    const ratio = vendorPrice / targetBudget;
    if (ratio <= 1.0) {
      totalScore += 25;
      reasons.push(`Within target budget allocation (₹${vendorPrice.toLocaleString('en-IN')})`);
    } else if (ratio <= 1.15) {
      totalScore += 18;
      reasons.push(`Slightly above target budget (+${Math.round((ratio - 1) * 100)}%)`);
    } else if (ratio <= 1.35) {
      totalScore += 10;
      reasons.push(`Moderately above target budget`);
    } else {
      totalScore += 5;
      reasons.push(`Premium pricing tier`);
    }
  } else {
    totalScore += 20;
    reasons.push(`Standard pricing compatibility`);
  }

  // 3. Capacity Compatibility (Max 20 pts)
  if (vendorCategory.toLowerCase() === 'venue') {
    if (vendorCapacity >= guestCount && vendorCapacity <= guestCount * 2.5) {
      totalScore += 20;
      reasons.push(`Optimal capacity for ${guestCount} guests (Max: ${vendorCapacity})`);
    } else if (vendorCapacity >= guestCount) {
      totalScore += 16;
      reasons.push(`Large capacity facility (Max: ${vendorCapacity} guests)`);
    } else if (vendorCapacity > 0) {
      totalScore += 8;
      reasons.push(`Capacity (${vendorCapacity}) suitable for intimate sections`);
    } else {
      totalScore += 15;
      reasons.push(`Flexible banquet capacity`);
    }
  } else {
    totalScore += 20;
    reasons.push(`Equipped for ${guestCount}+ guest event scale`);
  }

  // 4. Event Type Match (Max 20 pts)
  if (supportedEvents.toLowerCase().includes(eventType.toLowerCase())) {
    totalScore += 20;
    reasons.push(`Specialized experience in ${eventType} celebrations`);
  } else {
    totalScore += 12;
    reasons.push(`General celebration and event service`);
  }

  // 5. Rating & Reputation (Max 15 pts)
  if (vendorRating >= 4.8) {
    totalScore += 15;
    reasons.push(`Top-rated customer satisfaction (${vendorRating} ★)`);
  } else if (vendorRating >= 4.5) {
    totalScore += 12;
    reasons.push(`High customer rating (${vendorRating} ★)`);
  } else {
    totalScore += 8;
    reasons.push(`Verified service standard (${vendorRating} ★)`);
  }

  const finalScore = Math.min(100, Math.max(30, totalScore));

  return {
    score: finalScore,
    reasons
  };
};

module.exports = {
  calculateSmartMatchScore
};
