const mysql = require('mysql2/promise');
const {
  initialUsers,
  initialVendors,
  initialReviews,
  initialEvents,
  initialBookings,
  initialPayments,
  initialRefunds
} = require('../database/seedData');

let pool = null;
let isUsingFallback = false;

// In-memory relational store fallback
const memoryStore = {
  users: JSON.parse(JSON.stringify(initialUsers)),
  vendors: JSON.parse(JSON.stringify(initialVendors)),
  reviews: JSON.parse(JSON.stringify(initialReviews)),
  events: JSON.parse(JSON.stringify(initialEvents)),
  event_vendors: [
    { id: 1, event_id: 1, vendor_id: 1, category: 'Venue', allocated_price: 70000, status: 'BOOKED' },
    { id: 2, event_id: 1, vendor_id: 5, category: 'Catering', allocated_price: 90000, status: 'BOOKED' },
    { id: 3, event_id: 1, vendor_id: 8, category: 'Decoration', allocated_price: 40000, status: 'SELECTED' },
    { id: 4, event_id: 1, vendor_id: 11, category: 'Photography', allocated_price: 35000, status: 'SELECTED' },
    { id: 5, event_id: 1, vendor_id: 13, category: 'DJ', allocated_price: 25000, status: 'SELECTED' }
  ],
  bookings: JSON.parse(JSON.stringify(initialBookings)),
  payments: JSON.parse(JSON.stringify(initialPayments)),
  refunds: JSON.parse(JSON.stringify(initialRefunds))
};

let nextIds = {
  users: 10,
  vendors: 20,
  reviews: 10,
  events: 10,
  event_vendors: 10,
  bookings: 10,
  payments: 10,
  refunds: 10
};

const initDatabase = async () => {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'eventhub_db';
  const dbPort = process.env.DB_PORT || 3306;

  try {
    const tempPool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 2000
    });

    // Test connectivity
    await tempPool.query('SELECT 1');
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tempPool.end();

    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log(`[EventHub DB] Successfully connected to MySQL at ${dbHost}:${dbPort}/${dbName}`);
    isUsingFallback = false;
  } catch (err) {
    console.warn(`[EventHub DB] MySQL connection not established (${err.message}).`);
    console.log('[EventHub DB] Running with built-in resilient In-Memory Database store with 15 Tier-2/3 seed vendors.');
    isUsingFallback = true;
  }
};

const extractIdFromSql = (sql, param) => {
  if (param !== undefined && param !== null) return Number(param);
  const match = sql.match(/=\s*(\d+)/);
  return match ? Number(match[1]) : 1;
};

const query = async (sql, params = []) => {
  if (!isUsingFallback && pool) {
    try {
      const [rows, fields] = await pool.query(sql, params);
      return [rows, fields];
    } catch (error) {
      console.error('[EventHub DB] MySQL Query Error:', error.message);
      throw error;
    }
  }

  // Fallback SQL execution simulation for core patterns
  const trimmed = sql.trim();
  const upper = trimmed.toUpperCase();

  // 1. SELECT queries
  if (upper.startsWith('SELECT')) {
    if (upper.includes('FROM USERS')) {
      if (upper.includes('WHERE EMAIL =')) {
        const email = params[0] || (sql.match(/EMAIL\s*=\s*['"]([^'"]+)['"]/i)?.[1]);
        const match = memoryStore.users.filter(u => u.email.toLowerCase() === String(email).toLowerCase());
        return [match];
      }
      if (upper.includes('WHERE ID =')) {
        const id = extractIdFromSql(sql, params[0]);
        const match = memoryStore.users.filter(u => u.id === id);
        return [match];
      }
      return [memoryStore.users];
    }

    if (upper.includes('FROM VENDORS')) {
      let results = [...memoryStore.vendors];
      if (upper.includes('WHERE ID =')) {
        const id = extractIdFromSql(sql, params[0]);
        return [results.filter(v => v.id === id)];
      }
      if (upper.includes('WHERE USER_ID =')) {
        const uid = extractIdFromSql(sql, params[0]);
        return [results.filter(v => v.user_id === uid)];
      }
      return [results];
    }

    if (upper.includes('FROM REVIEWS')) {
      if (upper.includes('WHERE VENDOR_ID =')) {
        const vid = extractIdFromSql(sql, params[0]);
        const matched = memoryStore.reviews.filter(r => r.vendor_id === vid);
        return [matched];
      }
      return [memoryStore.reviews];
    }

    if (upper.includes('FROM EVENTS')) {
      if (upper.includes('WHERE USER_ID =')) {
        const uid = extractIdFromSql(sql, params[0]);
        return [memoryStore.events.filter(e => e.user_id === uid)];
      }
      if (upper.includes('WHERE ID =')) {
        const id = extractIdFromSql(sql, params[0]);
        return [memoryStore.events.filter(e => e.id === id)];
      }
      return [memoryStore.events];
    }

    if (upper.includes('FROM BOOKINGS')) {
      if (upper.includes('WHERE USER_ID =')) {
        const uid = extractIdFromSql(sql, params[0]);
        return [memoryStore.bookings.filter(b => b.user_id === uid)];
      }
      if (upper.includes('WHERE VENDOR_ID =')) {
        const vid = extractIdFromSql(sql, params[0]);
        return [memoryStore.bookings.filter(b => b.vendor_id === vid)];
      }
      if (upper.includes('WHERE ID =')) {
        const id = extractIdFromSql(sql, params[0]);
        return [memoryStore.bookings.filter(b => b.id === id)];
      }
      if (upper.includes('WHERE BOOKING_CODE =')) {
        const code = params[0] || (sql.match(/BOOKING_CODE\s*=\s*['"]([^'"]+)['"]/i)?.[1]);
        return [memoryStore.bookings.filter(b => b.booking_code === code)];
      }
      return [memoryStore.bookings];
    }

    if (upper.includes('FROM PAYMENTS')) {
      if (upper.includes('WHERE BOOKING_ID =')) {
        const bid = extractIdFromSql(sql, params[0]);
        return [memoryStore.payments.filter(p => p.booking_id === bid)];
      }
      return [memoryStore.payments];
    }

    if (upper.includes('FROM REFUNDS')) {
      if (upper.includes('WHERE BOOKING_ID =')) {
        const bid = extractIdFromSql(sql, params[0]);
        return [memoryStore.refunds.filter(r => r.booking_id === bid)];
      }
      return [memoryStore.refunds];
    }
  }

  // 2. INSERT queries
  if (upper.startsWith('INSERT INTO')) {
    if (upper.includes('INTO USERS')) {
      const newUser = {
        id: nextIds.users++,
        name: params[0],
        email: params[1],
        password_hash: params[2],
        role: params[3] || 'CUSTOMER',
        phone: params[4] || '',
        city: params[5] || 'Patna',
        created_at: new Date().toISOString()
      };
      memoryStore.users.push(newUser);
      return [{ insertId: newUser.id, affectedRows: 1 }];
    }

    if (upper.includes('INTO EVENTS')) {
      const newEvent = {
        id: nextIds.events++,
        user_id: Number(params[0]),
        title: params[1],
        event_type: params[2],
        city: params[3],
        event_date: params[4],
        guest_count: Number(params[5]),
        total_budget: Number(params[6]),
        allocated_budget: Number(params[7] || 0),
        remaining_budget: Number(params[8] || params[6]),
        status: 'PLANNING',
        created_at: new Date().toISOString()
      };
      memoryStore.events.push(newEvent);
      return [{ insertId: newEvent.id, affectedRows: 1 }];
    }

    if (upper.includes('INTO BOOKINGS')) {
      const newBooking = {
        id: nextIds.bookings++,
        booking_code: params[0],
        user_id: Number(params[1]),
        event_id: params[2] ? Number(params[2]) : null,
        vendor_id: Number(params[3]),
        event_date: params[4],
        service_category: params[5],
        total_amount: Number(params[6]),
        advance_percentage: Number(params[7] || 20),
        advance_amount: Number(params[8]),
        remaining_amount: Number(params[9]),
        commission_rate: Number(params[10] || 10),
        commission_amount: Number(params[11]),
        booking_status: 'PENDING',
        payment_status: 'PENDING',
        created_at: new Date().toISOString()
      };
      memoryStore.bookings.push(newBooking);
      return [{ insertId: newBooking.id, affectedRows: 1 }];
    }

    if (upper.includes('INTO PAYMENTS')) {
      const newPayment = {
        id: nextIds.payments++,
        booking_id: Number(params[0]),
        transaction_ref: params[1],
        amount: Number(params[2]),
        payment_type: params[3] || 'ADVANCE',
        payment_method: params[4] || 'UPI (Simulated)',
        payment_status: params[5] || 'PAID',
        notes: params[6] || 'Simulated Hackathon Demo Payment',
        payment_date: new Date().toISOString()
      };
      memoryStore.payments.push(newPayment);
      return [{ insertId: newPayment.id, affectedRows: 1 }];
    }

    if (upper.includes('INTO REFUNDS')) {
      const newRefund = {
        id: nextIds.refunds++,
        booking_id: Number(params[0]),
        refund_ref: params[1],
        total_paid: Number(params[2]),
        platform_fee: Number(params[3]),
        refund_amount: Number(params[4]),
        refund_status: 'REFUND_INITIATED',
        reason: params[5] || 'Customer requested cancellation',
        created_at: new Date().toISOString()
      };
      memoryStore.refunds.push(newRefund);
      return [{ insertId: newRefund.id, affectedRows: 1 }];
    }

    if (upper.includes('INTO REVIEWS')) {
      const newReview = {
        id: nextIds.reviews++,
        vendor_id: Number(params[0]),
        user_id: params[1] ? Number(params[1]) : null,
        reviewer_name: params[2],
        rating: Number(params[3]),
        comment: params[4],
        event_type: params[5] || 'Wedding',
        created_at: new Date().toISOString()
      };
      memoryStore.reviews.push(newReview);
      return [{ insertId: newReview.id, affectedRows: 1 }];
    }
  }

  // 3. UPDATE queries
  if (upper.startsWith('UPDATE')) {
    if (upper.includes('BOOKINGS')) {
      const id = extractIdFromSql(sql, params[params.length - 1]);
      const booking = memoryStore.bookings.find(b => b.id === id);
      if (booking) {
        if (upper.includes('SET BOOKING_STATUS = ?, PAYMENT_STATUS = ?')) {
          booking.booking_status = params[0];
          booking.payment_status = params[1];
        } else if (upper.includes('SET BOOKING_STATUS = ?, PAYMENT_STATUS = ?, CANCELLATION_REASON = ?')) {
          booking.booking_status = params[0];
          booking.payment_status = params[1];
          booking.cancellation_reason = params[2];
          booking.cancelled_by = params[3];
          booking.cancelled_at = new Date().toISOString();
        } else if (upper.includes('SET BOOKING_STATUS = ?')) {
          booking.booking_status = params[0];
        }
        return [{ affectedRows: 1 }];
      }
    }

    if (upper.includes('EVENTS')) {
      const id = extractIdFromSql(sql, params[params.length - 1]);
      const event = memoryStore.events.find(e => e.id === id);
      if (event) {
        if (upper.includes('ALLOCATED_BUDGET = ?, REMAINING_BUDGET = ?')) {
          event.allocated_budget = Number(params[0]);
          event.remaining_budget = Number(params[1]);
        }
        return [{ affectedRows: 1 }];
      }
    }
  }

  return [[]];
};

module.exports = {
  initDatabase,
  query,
  memoryStore,
  isFallback: () => isUsingFallback
};
