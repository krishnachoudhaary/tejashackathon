const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', bookingController.createBooking);
router.get('/my', authMiddleware, bookingController.getUserBookings);
router.get('/vendor', authMiddleware, bookingController.getVendorBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', authMiddleware, bookingController.updateBookingStatus);
router.post('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
