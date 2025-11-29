const Bag = require('../models/Bag');

// @desc    Get all bags
// @route   GET /api/bags
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        
        // Build query
        const query = {};
        
        if (search) {
            query.$or = [
                { voucherNo: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } },
                { supervisor: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { station: { $regex: search, $options: 'i' } },
                { invoiceId: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get total count
        const total = await Bag.countDocuments(query);
        
        // Get bags with pagination
        const bags = await Bag.find(query)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username')
            .sort({ date: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            status: 'success',
            data: {
                bags,
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

// @desc    Get single bag
// @route   GET /api/bags/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const bag = await Bag.findById(req.params.id)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username');
        
        if (!bag) {
            return res.status(404).json({
                status: 'error',
                message: 'Bag not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                bag
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create bag
// @route   POST /api/bags
// @access  Private
exports.create = async (req, res) => {
    try {
        const bag = await Bag.create({
            ...req.body,
            createdBy: req.user ? req.user._id : null
        });
        
        res.status(201).json({
            status: 'success',
            data: {
                bag
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update bag
// @route   PUT /api/bags/:id
// @access  Private
exports.update = async (req, res) => {
    try {
        const bag = await Bag.findById(req.params.id);
        
        if (!bag) {
            return res.status(404).json({
                status: 'error',
                message: 'Bag not found'
            });
        }
        
        const updatedBag = await Bag.findByIdAndUpdate(
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
                bag: updatedBag
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete bag
// @route   DELETE /api/bags/:id
// @access  Private
exports.delete = async (req, res) => {
    try {
        const bag = await Bag.findById(req.params.id);
        
        if (!bag) {
            return res.status(404).json({
                status: 'error',
                message: 'Bag not found'
            });
        }
        
        await bag.deleteOne();
        
        res.status(200).json({
            status: 'success',
            message: 'Bag deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Toggle entry ID
// @route   PUT /api/bags/:id/toggle-entry
// @access  Private
exports.toggleEntryId = async (req, res) => {
    try {
        const bag = await Bag.findById(req.params.id);
        
        if (!bag) {
            return res.status(404).json({
                status: 'error',
                message: 'Bag not found'
            });
        }
        
        bag.entryId = bag.entryId === 'Confirm' ? 'UnConfirm' : 'Confirm';
        bag.updatedBy = req.user ? req.user._id : null;
        await bag.save();
        
        res.status(200).json({
            status: 'success',
            data: {
                bag
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

