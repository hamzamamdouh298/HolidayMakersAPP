const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Hotel routes
router.get('/hotels', hotelController.getAllHotels);
router.get('/hotels/:id', hotelController.getHotelById);
router.post('/hotels', hotelController.createHotel);
router.put('/hotels/:id', hotelController.updateHotel);
router.delete('/hotels/:id', hotelController.deleteHotel);

// Hotel Contract routes (must come before /hotels/:id to avoid route conflicts)
router.get('/hotel-contracts', hotelController.getAllHotelContracts);
router.get('/hotel-contracts/:id', hotelController.getHotelContractById);
router.post('/hotel-contracts', hotelController.createHotelContract);
router.put('/hotel-contracts/:id', hotelController.updateHotelContract);
router.delete('/hotel-contracts/:id', hotelController.deleteHotelContract);

module.exports = router;

