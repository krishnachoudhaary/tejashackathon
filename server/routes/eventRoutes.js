const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', eventController.createEvent);
router.get('/my', authMiddleware, eventController.getUserEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id/plan', eventController.updateEventPlanVendors);

module.exports = router;
