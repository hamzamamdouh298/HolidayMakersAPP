const express = require('express');
const router = express.Router();
const {
    getAll,
    getOne,
    create,
    update,
    delete: deleteVisa,
    getTypes
} = require('../controllers/visaController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getAll)
    .post(create);

router.route('/types')
    .get(getTypes);

router.route('/:id')
    .get(getOne)
    .put(update)
    .delete(deleteVisa);

module.exports = router;

