const express = require('express');
const router = express.Router();
const hotelContractController = require('../controllers/hotelContractController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET all contracts and POST new contract
router.route('/')
    .get(hotelContractController.getAll)
    .post(hotelContractController.create);

// GET, PUT, DELETE single contract
router.route('/:id')
    .get(hotelContractController.getOne)
    .put(hotelContractController.update)
    .delete(hotelContractController.delete);

module.exports = router;
