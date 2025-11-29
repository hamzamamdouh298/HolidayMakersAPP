const Transaction = require('../models/Transaction');
const Safe = require('../models/Safe');
const Bank = require('../models/Bank');
const Account = require('../models/Account');

// @desc    Get financial analytics summary
// @route   GET /api/accounting/analytics
// @access  Private
exports.getFinancialAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const dateFilter = {};
        if (startDate) dateFilter.date = { $gte: new Date(startDate) };
        if (endDate) {
            dateFilter.date = dateFilter.date || {};
            dateFilter.date.$lte = new Date(endDate);
        }

        // Get revenue transactions
        const revenueTransactions = await Transaction.find({
            ...dateFilter,
            type: { $in: ['Receipt', 'Journal'] },
            credit: { $gt: 0 }
        });

        // Get expense transactions
        const expenseTransactions = await Transaction.find({
            ...dateFilter,
            type: { $in: ['Payment', 'Journal'] },
            debit: { $gt: 0 }
        });

        const totalRevenue = revenueTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
        const totalExpenses = expenseTransactions.reduce((sum, t) => sum + (t.debit || 0), 0);
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

        res.status(200).json({
            status: 'success',
            data: {
                totalRevenue,
                totalExpenses,
                netProfit,
                profitMargin: parseFloat(profitMargin)
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get performance overview (chart data)
// @route   GET /api/accounting/performance
// @access  Private
exports.getPerformanceOverview = async (req, res) => {
    try {
        const { year, timeRange } = req.query;
        
        // Get transactions grouped by month
        const transactions = await Transaction.find().sort({ date: 1 });
        
        const monthlyData = {};
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { revenue: 0, expenses: 0, netProfit: 0 };
            }
            
            if (transaction.credit > 0) {
                monthlyData[monthKey].revenue += transaction.credit;
            }
            if (transaction.debit > 0) {
                monthlyData[monthKey].expenses += transaction.debit;
            }
        });
        
        // Calculate net profit for each month
        Object.keys(monthlyData).forEach(month => {
            monthlyData[month].netProfit = monthlyData[month].revenue - monthlyData[month].expenses;
        });
        
        res.status(200).json({
            status: 'success',
            data: {
                monthlyData
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get receipt and payment summary
// @route   GET /api/accounting/receipt-payment
// @access  Private
exports.getReceiptPayment = async (req, res) => {
    try {
        // Get all safes grouped by currency
        const safes = await Safe.find({ isActive: true });
        
        const currencySummary = {
            EGP: 0,
            USD: 0,
            SAR: 0,
            EUR: 0,
            AED: 0,
            IQD: 0,
            KWD: 0
        };
        
        safes.forEach(safe => {
            if (currencySummary.hasOwnProperty(safe.currency)) {
                currencySummary[safe.currency] += safe.balance || 0;
            }
        });
        
        // Get safe details
        const safeDetails = safes.map(safe => ({
            _id: safe._id,
            safeName: safe.safeName,
            branch: safe.branch,
            EGP: safe.currency === 'EGP' ? safe.balance : 0,
            USD: safe.currency === 'USD' ? safe.balance : 0,
            SAR: safe.currency === 'SAR' ? safe.balance : 0,
            EUR: safe.currency === 'EUR' ? safe.balance : 0,
            AED: safe.currency === 'AED' ? safe.balance : 0,
            IQD: safe.currency === 'IQD' ? safe.balance : 0,
            KWD: safe.currency === 'KWD' ? safe.balance : 0
        }));
        
        res.status(200).json({
            status: 'success',
            data: {
                currencySummary,
                safeDetails
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get banks summary
// @route   GET /api/accounting/banks
// @access  Private
exports.getBanks = async (req, res) => {
    try {
        const banks = await Bank.find({ isActive: true });
        
        const currencySummary = {
            EGP: 0,
            USD: 0,
            SAR: 0,
            EUR: 0,
            AED: 0,
            IQD: 0,
            KWD: 0
        };
        
        banks.forEach(bank => {
            if (currencySummary.hasOwnProperty(bank.currency)) {
                currencySummary[bank.currency] += bank.balance || 0;
            }
        });
        
        const bankDetails = banks.map(bank => ({
            _id: bank._id,
            bankName: bank.bankName,
            accountNumber: bank.accountNumber,
            EGP: bank.currency === 'EGP' ? bank.balance : 0,
            USD: bank.currency === 'USD' ? bank.balance : 0,
            SAR: bank.currency === 'SAR' ? bank.balance : 0,
            EUR: bank.currency === 'EUR' ? bank.balance : 0,
            AED: bank.currency === 'AED' ? bank.balance : 0,
            IQD: bank.currency === 'IQD' ? bank.balance : 0,
            KWD: bank.currency === 'KWD' ? bank.balance : 0
        }));
        
        res.status(200).json({
            status: 'success',
            data: {
                currencySummary,
                bankDetails
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get all accounts (Chart of Accounts)
// @route   GET /api/accounting/accounts
// @access  Private
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ isActive: true })
            .populate('parentAccount', 'accountName accountCode')
            .sort({ accountCode: 1 });
        
        res.status(200).json({
            status: 'success',
            data: {
                accounts
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get all safes
// @route   GET /api/accounting/safes
// @access  Private
exports.getSafes = async (req, res) => {
    try {
        const safes = await Safe.find({ isActive: true }).sort({ safeName: 1 });
        
        res.status(200).json({
            status: 'success',
            data: {
                safes
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get all banks
// @route   GET /api/accounting/banks-list
// @access  Private
exports.getBanksList = async (req, res) => {
    try {
        const banks = await Bank.find({ isActive: true }).sort({ bankName: 1 });
        
        res.status(200).json({
            status: 'success',
            data: {
                banks
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get transactions
// @route   GET /api/accounting/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, startDate, endDate, type } = req.query;
        
        const query = {};
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (type) query.type = type;
        
        const total = await Transaction.countDocuments(query);
        const transactions = await Transaction.find(query)
            .populate('account', 'accountName accountCode')
            .populate('safe', 'safeName')
            .populate('bank', 'bankName')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            status: 'success',
            data: {
                transactions,
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

