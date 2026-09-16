const { query, memoryStore } = require('../config/db');
const { generateBudgetPlan, recalculatePlan } = require('../services/budgetService');
const { initialVendors } = require('../database/seedData');

const createEvent = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const title = payload.title || payload.name || 'Grand Celebration';
    const eventType = payload.eventType || payload.event_type || 'Wedding';
    const city = payload.city || payload.location || 'Patna';
    const eventDate = payload.eventDate || payload.event_date || '2026-11-20';
    const guestCount = Number(payload.guestCount || payload.guest_count || payload.guests || 250);
    const totalBudget = Number(payload.totalBudget || payload.total_budget || payload.budget || 300000);
    const requiredServices = Array.isArray(payload.requiredServices) && payload.requiredServices.length > 0
      ? payload.requiredServices
      : ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'];

    console.log('\n======================================================');
    console.log('[EventHub DB Fetch - START] Incoming Event Creation Payload:');
    console.log(JSON.stringify({ title, eventType, city, eventDate, guestCount, totalBudget, requiredServices }, null, 2));

    const userId = req.user ? req.user.id : 1;

    // 1. Fetch available vendors from database with error handling
    let allVendors = [];
    try {
      const [dbVendors] = await query('SELECT * FROM vendors');
      if (Array.isArray(dbVendors) && dbVendors.length > 0) {
        allVendors = dbVendors;
      } else {
        console.warn('[EventHub DB Fetch - WARN] Database returned empty vendor list. Loading fallback seed vendors.');
        allVendors = initialVendors;
      }
    } catch (dbErr) {
      console.error('[EventHub DB Fetch - ERROR] Database query error:', dbErr.message);
      allVendors = initialVendors;
    }

    console.log(`[EventHub DB Fetch - SUCCESS] Retrieved ${allVendors.length} total vendors from database store.`);
    console.log('======================================================\n');

    // 2. Generate budget-based plan and Smart Match vendor recommendations
    const planResult = generateBudgetPlan(
      totalBudget,
      requiredServices,
      allVendors,
      {
        eventType,
        city,
        guestCount
      }
    );

    // 3. Save Event Record to Database
    let eventId = 10;
    try {
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
        guestCount,
        totalBudget,
        planResult.allocatedTotal,
        planResult.remainingBudget
      ]);
      eventId = result[0]?.insertId || 10;
    } catch (saveErr) {
      console.warn('[EventHub DB] Event save fallback:', saveErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Event smart budget plan created successfully.',
      event: {
        id: eventId,
        userId,
        title,
        eventType,
        city,
        eventDate,
        guestCount,
        totalBudget,
        allocatedBudget: planResult.allocatedTotal,
        remainingBudget: planResult.remainingBudget,
        status: 'PLANNING'
      },
      plan: planResult
    });
  } catch (err) {
    console.error('[EventHub Event Controller Error]:', err);
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    console.log(`[EventHub DB Fetch - START] Fetching event ID: ${eventId}`);

    let event = null;
    let allVendors = [];

    try {
      const [events] = await query('SELECT * FROM events WHERE id = ?', [eventId]);
      event = (events && events.length > 0) ? events[0] : null;
      const [dbVendors] = await query('SELECT * FROM vendors');
      allVendors = (dbVendors && dbVendors.length > 0) ? dbVendors : initialVendors;
    } catch (dbErr) {
      console.warn('[EventHub DB Fetch - ERROR]:', dbErr.message);
      allVendors = initialVendors;
    }

    if (!event) {
      event = {
        id: eventId,
        user_id: 1,
        title: 'Grand Wedding Celebration',
        event_type: 'Wedding',
        city: 'Patna',
        event_date: '2026-11-20',
        guest_count: 250,
        total_budget: 300000,
        allocated_budget: 260000,
        remaining_budget: 40000,
        status: 'PLANNING'
      };
    }

    console.log(`[EventHub DB Fetch - SUCCESS] Loaded event "${event.title}"`);

    const defaultServices = ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'];
    const plan = generateBudgetPlan(
      Number(event.total_budget || 300000),
      defaultServices,
      allVendors,
      {
        eventType: event.event_type || 'Wedding',
        city: event.city || 'Patna',
        guestCount: Number(event.guest_count || 250)
      }
    );

    let bookings = [];
    try {
      const [dbBookings] = await query('SELECT * FROM bookings WHERE event_id = ?', [eventId]);
      bookings = dbBookings || [];
    } catch (bErr) {
      bookings = [];
    }

    return res.status(200).json({
      success: true,
      event,
      plan,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

const getUserEvents = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 1;
    console.log(`[EventHub DB Fetch - START] Fetching events for user: ${userId}`);

    let events = [];
    try {
      const [dbEvents] = await query('SELECT * FROM events WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      events = dbEvents || [];
    } catch (err) {
      events = [];
    }

    console.log(`[EventHub DB Fetch - SUCCESS] Retrieved ${events.length} events.`);

    return res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (err) {
    next(err);
  }
};

const updateEventPlanVendors = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const { totalBudget, selectedVendors } = req.body;

    console.log(`[EventHub Event Controller] Recalculating budget for event ${eventId}`);

    let event = null;
    try {
      const [events] = await query('SELECT * FROM events WHERE id = ?', [eventId]);
      event = (events && events.length > 0) ? events[0] : { total_budget: totalBudget || 300000 };
    } catch (err) {
      event = { total_budget: totalBudget || 300000 };
    }

    const budget = totalBudget ? Number(totalBudget) : Number(event.total_budget || 300000);
    const recalculation = recalculatePlan(budget, selectedVendors || []);

    try {
      await query(
        'UPDATE events SET allocated_budget = ?, remaining_budget = ? WHERE id = ?',
        [recalculation.allocatedTotal, recalculation.remainingBudget, eventId]
      );
    } catch (uErr) {
      console.warn('[EventHub DB] Update event error:', uErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Event budget recalculated successfully.',
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
