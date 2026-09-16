/**
 * Commission & Revenue Service
 * EventHub earns a configurable platform commission on confirmed vendor bookings.
 */

const DEFAULT_COMMISSION_RATE = 10.0; // 10% platform commission

const calculateCommission = (bookingAmount, customRate = null) => {
  const rate = customRate !== null ? Number(customRate) : DEFAULT_COMMISSION_RATE;
  const amount = Number(bookingAmount) || 0;
  const commissionAmount = Math.round((amount * rate) / 100);

  return {
    commissionRate: rate,
    commissionAmount,
    vendorNetPayout: amount - commissionAmount
  };
};

module.exports = {
  DEFAULT_COMMISSION_RATE,
  calculateCommission
};
