require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const customerRoutes = require('./routes/customerRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const packageRoutes = require('./routes/packageRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const tourGuideScheduleRoutes = require('./routes/tourGuideScheduleRoutes');
const hotelContractRoutes = require('./routes/hotelContractRoutes');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', hotelRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/tour-guide-schedules', tourGuideScheduleRoutes);
app.use('/api/hotel-contracts', hotelContractRoutes);
app.use('/api/airport-transfers', require('./routes/airportTransferRoutes'));
app.use('/api/visas', require('./routes/visaRoutes'));
app.use('/api/balloons', require('./routes/balloonRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/bags', require('./routes/bagRoutes'));
app.use('/api/bag-prices', require('./routes/bagPriceRoutes'));
app.use('/api/accounting', require('./routes/accountingRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EHM Travel API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

