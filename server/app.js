const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const smartMatchRoutes = require('./routes/smartMatchRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'EventHub API',
    tagline: 'Plan Smart. Spend Smart. Celebrate Better.',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/smart-match', smartMatchRoutes);

// Static assets & SPA client fallback for unified production deployment
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // SPA fallback for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
      });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  });
}

// Error handling
app.use(errorHandler);

module.exports = app;
