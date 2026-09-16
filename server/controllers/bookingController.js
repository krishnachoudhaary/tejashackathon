const { query } = require('../config/db');
const { calculateAdvanceAmount } = require('../services/paymentService');
const { calculateCommission } = require('../services/commissionService');
const { processDemoRefund, calculateRefundAmount } = require('../services/refundService');

const generateBookingCode = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `EH-BK-${randomNum}`;
};

const createBooking = async (req, res, next) => {
  try {
    const {
      vendorId,
      eventId,
      eventDate,
      serviceCategory,
      totalAmount,
      advancePercentage = 20
    } = req.body;

    if (!vendorId || !eventDate || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID, event date, and total amount are required.'
      });
    }

    const userId = req.user ? req.user.id : 1;
    const bookingCode = generateBookingCode();

    // 1. Calculate Advance and Remaining
    const advanceInfo = calculateAdvanceAmount(totalAmount, advancePercentage);

    // 2. Calculate EventHub Commission (10%)
    const commissionInfo = calculateCommission(totalAmount, 10);

    // 3. Insert into Database
    const insertBookingSql = `
      INSERT INTO bookings (
        booking_code, user_id, event_id, vendor_id, event_date, service_category,
        total_amount, advance_percentage, advance_amount, remaining_amount,
        commission_rate, commission_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(insertBookingSql, [
      bookingCode,
      userId,
      eventId ? Number(eventId) : null,
      Number(vendorId),
      eventDate,
      serviceCategory || 'Event Service',
      advanceInfo.totalAmount,
      advanceInfo.advancePercentage,
      advanceInfo.advanceAmount,
      advanceInfo.remainingAmount,
      commissionInfo.commissionRate,
      commissionInfo.commissionAmount
    ]);

    const bookingId = result[0]?.insertId || 10;

    // Fetch vendor details for response
    const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [Number(vendorId)]);
    const vendor = vendors ? vendors[0] : null;

    res.status(201).json({
      success: true,
      message: 'Booking enquiry created successfully. Proceed to pay 20% advance to confirm.',
      booking: {
        id: bookingId,
        bookingCode,
        userId,
        eventId,
        vendorId: Number(vendorId),
        vendorName: vendor ? vendor.business_name : 'Vendor',
        vendorCategory: vendor ? vendor.category : serviceCategory,
        eventDate,
        totalAmount: advanceInfo.totalAmount,
        advancePercentage: advanceInfo.advancePercentage,
        advanceAmount: advanceInfo.advanceAmount,
        remainingAmount: advanceInfo.remainingAmount,
        commissionAmount: commissionInfo.commissionAmount,
        bookingStatus: 'PENDING',
        paymentStatus: 'PENDING'
      }
    });
  } catch (err) {
    next(err);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    const [bookings] = await query('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const booking = bookings[0];
    const [vendors] = await query('SELECT * FROM vendors WHERE id = ?', [booking.vendor_id]);
    const [payments] = await query('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);
    const [refunds] = await query('SELECT * FROM refunds WHERE booking_id = ?', [bookingId]);

    res.json({
      success: true,
      booking: {
        ...booking,
        vendor: vendors ? vendors[0] : null,
        payments: payments || [],
        refund: refunds && refunds.length > 0 ? refunds[0] : null
      }
    });
  } catch (err) {
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [bookings] = await query('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    const [allVendors] = await query('SELECT * FROM vendors');
    const [allPayments] = await query('SELECT * FROM payments');
    const [allRefunds] = await query('SELECT * FROM refunds');

    const enriched = (bookings || []).map(b => {
      const vendor = allVendors.find(v => v.id === b.vendor_id);
      const payments = allPayments.filter(p => p.booking_id === b.id);
      const refund = allRefunds.find(r => r.booking_id === b.id);
      return {
        ...b,
        vendor,
        payments,
        refund
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      bookings: enriched
    });
  } catch (err) {
    next(err);
  }
};

const getVendorBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Find vendor associated with this user
    const [vendors] = await query('SELECT * FROM vendors WHERE user_id = ?', [userId]);
    const vendorId = vendors && vendors.length > 0 ? vendors[0].id : 1;

    const [bookings] = await query('SELECT * FROM bookings WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);
    const [allUsers] = await query('SELECT id, name, email, phone FROM users');

    const enriched = (bookings || []).map(b => {
      const customer = allUsers.find(u => u.id === b.user_id);
      return {
        ...b,
        customerName: customer ? customer.name : 'Customer',
        customerPhone: customer ? customer.phone : '+91 98765 43210'
      };
    });

    res.json({
      success: true,
      vendor: vendors ? vendors[0] : null,
      bookings: enriched
    });
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body; // 'CONFIRMED' or 'CANCELLED'

    if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status.' });
    }

    await query('UPDATE bookings SET booking_status = ? WHERE id = ?', [status, bookingId]);

    res.json({
      success: true,
      message: `Booking status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);
    const { reason = 'Customer requested cancellation', platformFee } = req.body;

    const refundResult = await processDemoRefund({
      bookingId,
      cancelledBy: req.user ? req.user.role : 'CUSTOMER',
      reason,
      platformFee
    });

    res.json({
      success: true,
      message: 'Booking cancelled and simulated refund initiated successfully.',
      refund: refundResult
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  getVendorBookings,
  updateBookingStatus,
  cancelBooking
};
