const Balloon = require('../models/Balloon');

// @desc    Get all balloons
// @route   GET /api/balloons
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        
        // Build query
        const query = {};
        
        if (search) {
            query.$or = [
                { customer: { $regex: search, $options: 'i' } },
                { supplier: { $regex: search, $options: 'i' } },
                { trip: { $regex: search, $options: 'i' } },
                { balloon: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get total count
        const total = await Balloon.countDocuments(query);
        
        // Get balloons with pagination
        const balloons = await Balloon.find(query)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            status: 'success',
            data: {
                balloons,
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

// @desc    Get single balloon
// @route   GET /api/balloons/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const balloon = await Balloon.findById(req.params.id)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username');
        
        if (!balloon) {
            return res.status(404).json({
                status: 'error',
                message: 'Balloon not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                balloon
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create balloon
// @route   POST /api/balloons
// @access  Private
exports.create = async (req, res) => {
    try {
        const balloon = await Balloon.create({
            ...req.body,
            createdBy: req.user ? req.user._id : null
        });
        
        res.status(201).json({
            status: 'success',
            data: {
                balloon
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update balloon
// @route   PUT /api/balloons/:id
// @access  Private
exports.update = async (req, res) => {
    try {
        const balloon = await Balloon.findById(req.params.id);
        
        if (!balloon) {
            return res.status(404).json({
                status: 'error',
                message: 'Balloon not found'
            });
        }
        
        const updatedBalloon = await Balloon.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedBy: req.user ? req.user._id : null
            },
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            status: 'success',
            data: {
                balloon: updatedBalloon
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete balloon
// @route   DELETE /api/balloons/:id
// @access  Private
exports.delete = async (req, res) => {
    try {
        const balloon = await Balloon.findById(req.params.id);
        
        if (!balloon) {
            return res.status(404).json({
                status: 'error',
                message: 'Balloon not found'
            });
        }
        
        await balloon.deleteOne();
        
        res.status(200).json({
            status: 'success',
            message: 'Balloon deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get reports
// @route   GET /api/balloons/reports/count
// @access  Private
exports.getCountReport = async (req, res) => {
    try {
        const count = await Balloon.countDocuments();
        res.status(200).json({
            status: 'success',
            data: { count }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get profit report
// @route   GET /api/balloons/reports/profit
// @access  Private
exports.getProfitReport = async (req, res) => {
    try {
        const balloons = await Balloon.find();
        const totalProfit = balloons.reduce((sum, b) => sum + (b.totalPrice - b.cost), 0);
        res.status(200).json({
            status: 'success',
            data: { totalProfit }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get supplier report
// @route   GET /api/balloons/reports/supplier
// @access  Private
exports.getSupplierReport = async (req, res) => {
    try {
        const supplierStats = await Balloon.aggregate([
            {
                $group: {
                    _id: '$supplier',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: { supplierStats }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

