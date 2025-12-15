const express = require('express');
const cors = require('cors');
const config = require('./config');

// Import routes
const ticketRoutes = require('./routes/ticket.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();

// Middleware - CORS configuration with multiple origins support
const allowedOrigins = config.clientUrl.split(',').map(url => url.trim());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Smart Queue API'
  });
});

// API Routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

module.exports = app;

