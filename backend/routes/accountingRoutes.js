const express = require('express');
const router = express.Router();
const {
    getFinancialAnalytics,
    getPerformanceOverview,
    getReceiptPayment,
    getBanks,
    getAccounts,
    getSafes,
    getBanksList,
    getTransactions
} = require('../controllers/accountingController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/analytics', getFinancialAnalytics);
router.get('/performance', getPerformanceOverview);
router.get('/receipt-payment', getReceiptPayment);
router.get('/banks', getBanks);
router.get('/accounts', getAccounts);
router.get('/safes', getSafes);
router.get('/banks-list', getBanksList);
router.get('/transactions', getTransactions);

module.exports = router;

