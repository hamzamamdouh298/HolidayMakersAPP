const express = require('express');
const router = express.Router();
const {
    getAll,
    getOne,
    create,
    update,
    delete: deleteTrip,
    toggleStatus
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getAll)
    .post(create);

router.route('/:id/toggle-status')
    .put(toggleStatus);

router.route('/:id')
    .get(getOne)
    .put(update)
    .delete(deleteTrip);

module.exports = router;

