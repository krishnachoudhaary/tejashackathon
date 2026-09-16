const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:vendorId', reviewController.getVendorReviews);
router.post('/', (req, res, next) => {
  // Optional auth
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => reviewController.createReview(req, res, next));
  }
  reviewController.createReview(req, res, next);
});

module.exports = router;
