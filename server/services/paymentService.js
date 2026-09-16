/**
 * Dummy Advance Payment Service
 * Realistic simulated payment processing with transaction references.
 */

const { query } = require('../config/db');

const DEFAULT_ADVANCE_PERCENTAGE = 20.0; // 20% advance payment required for confirmation

const calculateAdvanceAmount = (totalAmount, percentage = DEFAULT_ADVANCE_PERCENTAGE) => {
  const total = Number(totalAmount) || 0;
  const advance = Math.round((total * percentage) / 100);
  const remaining = total - advance;

  return {
    totalAmount: total,
    advancePercentage: percentage,
    advanceAmount: advance,
    remainingAmount: remaining
  };
};

const generateTransactionRef = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `EH-DEMO-${randomNum}`;
};

const processDemoPayment = async ({
  bookingId,
  amount,
  paymentMethod = 'UPI (Simulated)',
  paymentType = 'ADVANCE',
  notes = 'Simulated Advance Payment'
}) => {
  const transactionRef = generateTransactionRef();

  // 1. Insert Payment Record
  const insertSql = `
    INSERT INTO payments (booking_id, transaction_ref, amount, payment_type, payment_method, payment_status, notes)
    VALUES (?, ?, ?, ?, ?, 'PAID', ?)
  `;
  await query(insertSql, [bookingId, transactionRef, amount, paymentType, paymentMethod, notes]);

  // 2. Update Booking Status to CONFIRMED and payment_status to PAID
  const updateBookingSql = `
    UPDATE bookings 
    SET booking_status = 'CONFIRMED', payment_status = 'PAID'
    WHERE id = ?
  `;
  await query(updateBookingSql, [bookingId]);

  return {
    success: true,
    transactionRef,
    amount: Number(amount),
    paymentType,
    paymentMethod,
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
    timestamp: new Date().toISOString(),
    message: 'Demo payment processed successfully. Booking confirmed!'
  };
};

module.exports = {
  DEFAULT_ADVANCE_PERCENTAGE,
  calculateAdvanceAmount,
  generateTransactionRef,
  processDemoPayment
};
