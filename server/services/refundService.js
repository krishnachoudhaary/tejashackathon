/**
 * Dummy Refund & Cancellation Service
 * Handles transparent cancellation fee calculations and simulated refund issuance.
 */

const { query } = require('../config/db');

const DEFAULT_PLATFORM_FEE = 2000.00; // Flat platform/cancellation fee

const calculateRefundAmount = (advancePaid, customFee = DEFAULT_PLATFORM_FEE) => {
  const paid = Number(advancePaid) || 0;
  const fee = Math.min(paid, Number(customFee));
  const refundable = Math.max(0, paid - fee);

  return {
    advancePaid: paid,
    platformFee: fee,
    refundableAmount: refundable,
    policyNotes: 'Standard cancellation policy: Flat ₹2,000 platform processing fee applies. Remaining advance is fully refundable.'
  };
};

const generateRefundRef = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `EH-REFUND-${randomNum}`;
};

const processDemoRefund = async ({
  bookingId,
  cancelledBy = 'CUSTOMER',
  reason = 'Customer requested cancellation',
  platformFee = DEFAULT_PLATFORM_FEE
}) => {
  // 1. Fetch booking
  const [bookings] = await query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
  if (!bookings || bookings.length === 0) {
    throw new Error('Booking not found');
  }

  const booking = bookings[0];
  const advancePaid = Number(booking.advance_amount) || 0;
  const { refundableAmount, platformFee: calculatedFee } = calculateRefundAmount(advancePaid, platformFee);
  const refundRef = generateRefundRef();

  // 2. Insert Refund Record
  const insertRefundSql = `
    INSERT INTO refunds (booking_id, refund_ref, total_paid, platform_fee, refund_amount, refund_status, reason)
    VALUES (?, ?, ?, ?, ?, 'REFUND_INITIATED', ?)
  `;
  await query(insertRefundSql, [bookingId, refundRef, advancePaid, calculatedFee, refundableAmount, reason]);

  // 3. Update Booking Status
  const updateBookingSql = `
    UPDATE bookings 
    SET booking_status = 'CANCELLED', payment_status = 'REFUND_INITIATED', cancellation_reason = ?, cancelled_by = ?
    WHERE id = ?
  `;
  await query(updateBookingSql, [reason, cancelledBy, bookingId]);

  return {
    success: true,
    refundRef,
    bookingId,
    advancePaid,
    platformFee: calculatedFee,
    refundAmount: refundableAmount,
    refundStatus: 'REFUND_INITIATED',
    bookingStatus: 'CANCELLED',
    message: 'Refund initiated successfully. Funds will reflect in simulated account within 24-48 hours.'
  };
};

module.exports = {
  DEFAULT_PLATFORM_FEE,
  calculateRefundAmount,
  generateRefundRef,
  processDemoRefund
};
