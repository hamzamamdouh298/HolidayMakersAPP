const express = require('express');
const router = express.Router();
const {
    getAll,
    getOne,
    create,
    update,
    delete: deleteBag,
    toggleEntryId
} = require('../controllers/bagController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getAll)
    .post(create);

router.route('/:id/toggle-entry')
    .put(toggleEntryId);

router.route('/:id')
    .get(getOne)
    .put(update)
    .delete(deleteBag);

module.exports = router;

