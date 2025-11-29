const express = require('express');
const router = express.Router();
const {
    getAll,
    getOne,
    create,
    update,
    delete: deleteBagPrice
} = require('../controllers/bagPriceController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getAll)
    .post(create);

router.route('/:id')
    .get(getOne)
    .put(update)
    .delete(deleteBagPrice);

module.exports = router;

