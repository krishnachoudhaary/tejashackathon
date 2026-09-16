const { query } = require('../config/db');
const { processDemoPayment } = require('../services/paymentService');

const processPayment = async (req, res, next) => {
  try {
    const {
      bookingId,
      amount,
      paymentMethod = 'UPI (Simulated)',
      paymentType = 'ADVANCE',
      notes
    } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and payment amount are required.'
      });
    }

    const [bookings] = await query('SELECT * FROM bookings WHERE id = ?', [Number(bookingId)]);
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const paymentResult = await processDemoPayment({
      bookingId: Number(bookingId),
      amount: Number(amount),
      paymentMethod,
      paymentType,
      notes: notes || `Simulated ${paymentType} payment via ${paymentMethod}`
    });

    res.status(200).json({
      success: true,
      message: 'Payment simulation successful. Booking confirmed!',
      payment: paymentResult
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentByBookingId = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const [payments] = await query('SELECT * FROM payments WHERE booking_id = ? ORDER BY payment_date DESC', [bookingId]);

    res.json({
      success: true,
      count: payments.length,
      payments: payments || []
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  processPayment,
  getPaymentByBookingId
};
