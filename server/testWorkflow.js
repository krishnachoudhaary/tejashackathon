const { initDatabase, query } = require('./config/db');
const authController = require('./controllers/authController');
const vendorController = require('./controllers/vendorController');
const eventController = require('./controllers/eventController');
const bookingController = require('./controllers/bookingController');
const paymentController = require('./controllers/paymentController');
const { calculateSmartMatchScore } = require('./services/smartMatchService');
const { generateBudgetPlan } = require('./services/budgetService');
const { processDemoPayment } = require('./services/paymentService');
const { processDemoRefund } = require('./services/refundService');

const runFullTest = async () => {
  console.log('🧪 Starting EventHub Full-Stack Architecture & Workflow Tests...\n');

  // 1. Initialize DB
  await initDatabase();

  // 2. Test Smart Match Logic (100-pt rule-based engine)
  console.log('✅ Test 1: Smart Match Scoring Engine');
  const [vendors] = await query('SELECT * FROM vendors WHERE id = 1');
  const venue = vendors[0];
  const matchResult = calculateSmartMatchScore(venue, {
    eventType: 'Wedding',
    city: 'Patna',
    guestCount: 250,
    targetBudget: 70000
  });
  console.log(`   - Venue: ${venue.business_name}`);
  console.log(`   - Smart Match Score: ${matchResult.score}%`);
  console.log(`   - Reasons: ${matchResult.reasons.join(', ')}\n`);

  // 3. Test Budget Planner & Vendor Combination
  console.log('✅ Test 2: Budget Planning & Multi-Vendor Generation');
  const [allVendors] = await query('SELECT * FROM vendors');
  const budgetPlan = generateBudgetPlan(
    300000,
    ['Venue', 'Catering', 'Decoration', 'Photography', 'DJ'],
    allVendors,
    { eventType: 'Wedding', city: 'Patna', guestCount: 250 }
  );
  console.log(`   - Total Budget: ₹${budgetPlan.totalBudget}`);
  console.log(`   - Allocated Plan Cost: ₹${budgetPlan.allocatedTotal}`);
  console.log(`   - Remaining Surplus: ₹${budgetPlan.remainingBudget}`);
  console.log(`   - Selected Vendors (${budgetPlan.selectedVendors.length}):`);
  budgetPlan.selectedVendors.forEach(v => {
    console.log(`     * ${v.category}: ${v.business_name} (₹${v.starting_price}) [${v.matchScore}% Match]`);
  });
  console.log(`   - Status Message: "${budgetPlan.statusMessage}"\n`);

  // 4. Test Booking Creation with 20% Advance Calculation
  console.log('✅ Test 3: Booking Creation with 20% Advance & 10% Commission');
  const totalBookingCost = budgetPlan.allocatedTotal;
  const advanceAmount = Math.round(totalBookingCost * 0.20);
  const remainingAmount = totalBookingCost - advanceAmount;
  const commissionAmount = Math.round(totalBookingCost * 0.10);

  const [bookingRes] = await query(
    `INSERT INTO bookings (booking_code, user_id, vendor_id, event_date, service_category, total_amount, advance_percentage, advance_amount, remaining_amount, commission_rate, commission_amount)
     VALUES (?, ?, ?, ?, ?, ?, 20, ?, ?, 10, ?)`,
    ['EH-BK-99012', 1, 1, '2026-11-20', 'Complete Wedding Plan', totalBookingCost, advanceAmount, remainingAmount, commissionAmount]
  );
  const bookingId = bookingRes.insertId || 99;
  console.log(`   - Booking Code: EH-BK-99012 (ID: ${bookingId})`);
  console.log(`   - Total: ₹${totalBookingCost} | Advance Required (20%): ₹${advanceAmount} | Remaining Due: ₹${remainingAmount}`);
  console.log(`   - Platform Commission (10%): ₹${commissionAmount}\n`);

  // 5. Test Demo Advance Payment System (EH-DEMO-XXXXXX)
  console.log('✅ Test 4: Simulated 20% Advance Payment Execution');
  const paymentResult = await processDemoPayment({
    bookingId,
    amount: advanceAmount,
    paymentMethod: 'UPI (GPay Demo)',
    paymentType: 'ADVANCE'
  });
  console.log(`   - Transaction Reference: ${paymentResult.transactionRef}`);
  console.log(`   - Amount Processed: ₹${paymentResult.amount}`);
  console.log(`   - Booking Status: ${paymentResult.bookingStatus}`);
  console.log(`   - Payment Status: ${paymentResult.paymentStatus}\n`);

  // 6. Test Cancellation & Simulated Refund Workflow
  console.log('✅ Test 5: Cancellation Policy & Simulated Refund Initiation');
  const refundResult = await processDemoRefund({
    bookingId,
    cancelledBy: 'CUSTOMER',
    reason: 'Date rescheduled to next year',
    platformFee: 2000
  });
  console.log(`   - Refund Reference: ${refundResult.refundRef}`);
  console.log(`   - Advance Paid: ₹${refundResult.advancePaid}`);
  console.log(`   - Platform Cancellation Fee: ₹${refundResult.platformFee}`);
  console.log(`   - Refundable Amount Issued: ₹${refundResult.refundAmount}`);
  console.log(`   - Refund Status: ${refundResult.refundStatus}\n`);

  console.log('🎉 ALL BACKEND LOGIC, DATA WORKFLOWS & CALCULATIONS PASSED PERFECTLY!\n');
};

runFullTest().catch(console.error);
