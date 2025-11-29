const express = require('express');
const router = express.Router();
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  bulkDeleteReservations,
  duplicateReservation,
  getStats
} = require('../controllers/reservationController');
const { protect, checkPermission } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Stats route
router.get('/stats', checkPermission('viewReservations'), getStats);

// Bulk operations
router.post('/bulk-delete', checkPermission('deleteReservations'), bulkDeleteReservations);

// Main CRUD routes
router
  .route('/')
  .get(checkPermission('viewReservations'), getReservations)
  .post(checkPermission('createReservations'), createReservation);

router.post('/:id/duplicate', checkPermission('createReservations'), duplicateReservation);

router
  .route('/:id')
  .get(checkPermission('viewReservations'), getReservation)
  .put(checkPermission('editReservations'), updateReservation)
  .delete(checkPermission('deleteReservations'), deleteReservation);

module.exports = router;

