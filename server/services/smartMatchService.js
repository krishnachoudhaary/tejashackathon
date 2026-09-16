/**
 * Smart Match Algorithm (Transparent 100-Point Rule-Based Engine)
 * Evaluates vendor compatibility against user event requirements.
 */

const calculateSmartMatchScore = (vendor, eventRequirements) => {
  const {
    eventType = 'Wedding',
    city = 'Patna',
    guestCount = 200,
    targetBudget = 70000
  } = eventRequirements;

  let totalScore = 0;
  const reasons = [];

  // 1. Location Match (Max 20 pts)
  if (vendor.city && vendor.city.toLowerCase() === city.toLowerCase()) {
    totalScore += 20;
    reasons.push(`Located directly in ${vendor.city}`);
  } else {
    totalScore += 10;
    reasons.push(`Regional vendor serving ${city}`);
  }

  // 2. Budget Compatibility (Max 25 pts)
  const vendorPrice = Number(vendor.starting_price) || 0;
  if (targetBudget > 0) {
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
  }

  // 3. Capacity Compatibility (Max 20 pts - primarily Venues)
  if (vendor.category === 'Venue') {
    const cap = Number(vendor.max_capacity) || 0;
    if (cap >= guestCount && cap <= guestCount * 2) {
      totalScore += 20;
      reasons.push(`Optimal capacity for ${guestCount} guests (Max: ${cap})`);
    } else if (cap >= guestCount) {
      totalScore += 16;
      reasons.push(`Large capacity facility (Max: ${cap} guests)`);
    } else {
      totalScore += 6;
      reasons.push(`Capacity (${cap}) below requested guest count (${guestCount})`);
    }
  } else {
    // Non-venue vendors get full capacity points if they handle the event scale
    totalScore += 20;
    reasons.push(`Equipped for ${guestCount}+ guest event scale`);
  }

  // 4. Event Type Match (Max 20 pts)
  const supported = (vendor.supported_events || '').toLowerCase();
  if (supported.includes(eventType.toLowerCase())) {
    totalScore += 20;
    reasons.push(`Specialized experience in ${eventType} celebrations`);
  } else {
    totalScore += 10;
    reasons.push(`General celebration and event service`);
  }

  // 5. Rating & Reputation (Max 15 pts)
  const rating = Number(vendor.rating) || 4.0;
  if (rating >= 4.8) {
    totalScore += 15;
    reasons.push(`Top-rated customer satisfaction (${rating} ★)`);
  } else if (rating >= 4.5) {
    totalScore += 12;
    reasons.push(`High customer rating (${rating} ★)`);
  } else {
    totalScore += 8;
    reasons.push(`Verified service standard (${rating} ★)`);
  }

  return {
    score: Math.min(100, Math.max(30, totalScore)),
    reasons
  };
};

module.exports = {
  calculateSmartMatchScore
};
