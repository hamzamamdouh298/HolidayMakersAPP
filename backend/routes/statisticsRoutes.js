const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect } = require('../middleware/auth');

// All statistics routes are protected
router.use(protect);

// @route   GET /api/statistics
// @desc    Get general statistics
// @access  Private
router.get('/', statisticsController.getGeneralStatistics);

// @route   GET /api/statistics/reservations
// @desc    Get reservation statistics with date range
// @access  Private
router.get('/reservations', statisticsController.getReservationStatistics);

// @route   GET /api/statistics/user/:userId?
// @desc    Get user performance statistics
// @access  Private
router.get('/user/:userId?', statisticsController.getUserPerformance);

module.exports = router;

