const { query } = require('../config/db');

const getVendorReviews = async (req, res, next) => {
  try {
    const vendorId = Number(req.params.vendorId);
    const [reviews] = await query('SELECT * FROM reviews WHERE vendor_id = ? ORDER BY created_at DESC', [vendorId]);

    res.json({
      success: true,
      count: reviews.length,
      reviews: reviews || []
    });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { vendorId, reviewerName, rating, comment, eventType = 'Wedding' } = req.body;

    if (!vendorId || !reviewerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID, reviewer name, rating (1-5), and comment are required.'
      });
    }

    const userId = req.user ? req.user.id : null;

    const insertSql = `
      INSERT INTO reviews (vendor_id, user_id, reviewer_name, rating, comment, event_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await query(insertSql, [
      Number(vendorId),
      userId,
      reviewerName,
      Number(rating),
      comment,
      eventType
    ]);

    const reviewId = result[0]?.insertId || 10;

    res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      review: {
        id: reviewId,
        vendorId: Number(vendorId),
        reviewerName,
        rating: Number(rating),
        comment,
        eventType,
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVendorReviews,
  createReview
};
