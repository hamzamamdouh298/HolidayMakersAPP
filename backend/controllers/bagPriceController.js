const BagPrice = require('../models/BagPrice');

// @desc    Get all bag prices
// @route   GET /api/bag-prices
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const { search, area, page = 1, limit = 20 } = req.query;
        
        // Build query
        const query = {};
        
        if (search) {
            query.$or = [
                { area: { $regex: search, $options: 'i' } },
                { client: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (area) {
            query.area = { $regex: area, $options: 'i' };
        }
        
        // Get total count
        const total = await BagPrice.countDocuments(query);
        
        // Get bag prices with pagination
        const bagPrices = await BagPrice.find(query)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            status: 'success',
            data: {
                bagPrices,
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

// @desc    Get single bag price
// @route   GET /api/bag-prices/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const bagPrice = await BagPrice.findById(req.params.id)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username');
        
        if (!bagPrice) {
            return res.status(404).json({
                status: 'error',
                message: 'Bag price not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                bagPrice
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create bag price
// @route   POST /api/bag-prices
// @access  Private
exports.create = async (req, res) => {
    try {
        const bagPrice = await BagPrice.create({
            ...req.body,
            createdBy: req.user ? req.user._id : null
        });
        
        res.status(201).json({
            status: 'success',
            data: {
                bagPrice
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update bag price
// @route   PUT /api/bag-prices/:id
// @access  Private
exports.update = async (req, res) => {
    try {
        const bagPrice = await BagPrice.findById(req.params.id);
        
        if (!bagPrice) {
            return res.status(404).json({
                status: 'error',
                message: 'Bag price not found'
            });
        }
        
        const updatedBagPrice = await BagPrice.findByIdAndUpdate(
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
                bagPrice: updatedBagPrice
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete bag price
// @route   DELETE /api/bag-prices/:id
// @access  Private
exports.delete = async (req, res) => {
    try {
        const bagPrice = await BagPrice.findById(req.params.id);
        
        if (!bagPrice) {
            return res.status(404).json({
                status: 'error',
                message: 'Bag price not found'
            });
        }
        
        await bagPrice.deleteOne();
        
        res.status(200).json({
            status: 'success',
            message: 'Bag price deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

