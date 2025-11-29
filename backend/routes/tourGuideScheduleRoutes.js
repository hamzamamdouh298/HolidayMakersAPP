const express = require('express');
const router = express.Router();
const tourGuideScheduleController = require('../controllers/tourGuideScheduleController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', tourGuideScheduleController.getAllTourGuideSchedules);
router.get('/:id', tourGuideScheduleController.getTourGuideScheduleById);
router.post('/', tourGuideScheduleController.createTourGuideSchedule);
router.put('/:id', tourGuideScheduleController.updateTourGuideSchedule);
router.delete('/:id', tourGuideScheduleController.deleteTourGuideSchedule);

module.exports = router;

