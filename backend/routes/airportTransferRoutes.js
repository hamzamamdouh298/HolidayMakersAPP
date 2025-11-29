const express = require('express');
const router = express.Router();
const airportTransferController = require('../controllers/airportTransferController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
    .get(airportTransferController.getAll)
    .post(airportTransferController.create);

router.route('/:id')
    .get(airportTransferController.getOne)
    .put(airportTransferController.update)
    .delete(airportTransferController.delete);

module.exports = router;
