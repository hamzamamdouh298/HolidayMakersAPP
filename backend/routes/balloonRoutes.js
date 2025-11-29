const express = require('express');
const router = express.Router();
const {
    getAll,
    getOne,
    create,
    update,
    delete: deleteBalloon,
    getCountReport,
    getProfitReport,
    getSupplierReport
} = require('../controllers/balloonController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getAll)
    .post(create);

router.route('/reports/count')
    .get(getCountReport);

router.route('/reports/profit')
    .get(getProfitReport);

router.route('/reports/supplier')
    .get(getSupplierReport);

router.route('/:id')
    .get(getOne)
    .put(update)
    .delete(deleteBalloon);

module.exports = router;

