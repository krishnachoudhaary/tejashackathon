const { query, memoryStore } = require('../config/db');
const { generateBudgetPlan, recalculatePlan } = require('../services/budgetService');

const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      eventType = 'Wedding',
      city = 'Patna',
      eventDate,
      guestCount,
      totalBudget,
      requiredServices = ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ']
    } = req.body;

    if (!title || !eventDate || !guestCount || !totalBudget) {
      return res.status(400).json({
        success: false,
        message: 'Event title, date, guest count, and total budget are required.'
      });
    }

    if (Number(totalBudget) <= 0 || Number(guestCount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget and guest count must be positive numbers.'
      });
    }

    const userId = req.user ? req.user.id : 1; // Default to demo user if testing public planner

    // Fetch all available vendors
    const [allVendors] = await query('SELECT * FROM vendors');

    // Generate initial budget plan and Smart Match selection
    const planResult = generateBudgetPlan(
      Number(totalBudget),
      requiredServices,
      allVendors,
      {
        eventType,
        city,
        guestCount: Number(guestCount)
      }
    );

    // Save Event to Database
    const insertEventSql = `
      INSERT INTO events (user_id, title, event_type, city, event_date, guest_count, total_budget, allocated_budget, remaining_budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PLANNING')
    `;
    const result = await query(insertEventSql, [
      userId,
      title,
      eventType,
      city,
      eventDate,
      Number(guestCount),
      Number(totalBudget),
      planResult.allocatedTotal,
      planResult.remainingBudget
    ]);

    const eventId = result[0]?.insertId || 10;

    res.status(201).json({
      success: true,
      message: 'Event plan created successfully with Smart Match vendor recommendations.',
      event: {
        id: eventId,
        userId,
        title,
        eventType,
        city,
        eventDate,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        allocatedBudget: planResult.allocatedTotal,
        remainingBudget: planResult.remainingBudget,
        status: 'PLANNING'
      },
      plan: planResult
    });
  } catch (err) {
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const [events] = await query('SELECT * FROM events WHERE id = ?', [eventId]);

    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    const event = events[0];
    const [allVendors] = await query('SELECT * FROM vendors');

    // Generate fresh plan calculation for current event state
    const defaultServices = ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'];
    const plan = generateBudgetPlan(
      Number(event.total_budget),
      defaultServices,
      allVendors,
      {
        eventType: event.event_type,
        city: event.city,
        guestCount: Number(event.guest_count)
      }
    );

    // Fetch existing bookings for this event if any
    const [bookings] = await query('SELECT * FROM bookings WHERE event_id = ?', [eventId]);

    res.json({
      success: true,
      event,
      plan,
      bookings: bookings || []
    });
  } catch (err) {
    next(err);
  }
};

const getUserEvents = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [events] = await query('SELECT * FROM events WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    res.json({
      success: true,
      count: events.length,
      events: events || []
    });
  } catch (err) {
    next(err);
  }
};

const updateEventPlanVendors = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const { totalBudget, selectedVendors } = req.body;

    const [events] = await query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (!events || events.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = events[0];
    const budget = totalBudget ? Number(totalBudget) : Number(event.total_budget);

    const recalculation = recalculatePlan(budget, selectedVendors || []);

    // Update in database
    await query(
      'UPDATE events SET allocated_budget = ?, remaining_budget = ? WHERE id = ?',
      [recalculation.allocatedTotal, recalculation.remainingBudget, eventId]
    );

    res.json({
      success: true,
      message: 'Event budget recalculated and updated.',
      event: {
        ...event,
        total_budget: budget,
        allocated_budget: recalculation.allocatedTotal,
        remaining_budget: recalculation.remainingBudget
      },
      planSummary: recalculation
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent,
  getEventById,
  getUserEvents,
  updateEventPlanVendors
};
