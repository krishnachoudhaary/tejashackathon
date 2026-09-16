const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', vendorController.getAllVendors);
router.get('/me', authMiddleware, vendorController.getVendorForCurrentUser);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', authMiddleware, vendorController.updateVendorProfile);

module.exports = router;
