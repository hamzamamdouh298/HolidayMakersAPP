const Visa = require('../models/Visa');

// @desc    Get all visas
// @route   GET /api/visas
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const { search, type, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { serialNumber: isNaN(search) ? null : parseInt(search) }
            ].filter(item => item !== null);
        }
        
        if (type && type !== 'All') {
            query.type = type;
        }
        
        query.isActive = true;
        
        // Get total count
        const total = await Visa.countDocuments(query);
        
        // Get visas with pagination
        const visas = await Visa.find(query)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            status: 'success',
            data: {
                visas,
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

// @desc    Get single visa
// @route   GET /api/visas/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const visa = await Visa.findById(req.params.id)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username');
        
        if (!visa) {
            return res.status(404).json({
                status: 'error',
                message: 'Visa not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                visa
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create visa
// @route   POST /api/visas
// @access  Private
exports.create = async (req, res) => {
    try {
        // Get the next serial number
        const count = await Visa.countDocuments();
        const serialNumber = count + 1;
        
        const visa = await Visa.create({
            ...req.body,
            serialNumber,
            createdBy: req.user ? req.user._id : null
        });
        
        res.status(201).json({
            status: 'success',
            data: {
                visa
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update visa
// @route   PUT /api/visas/:id
// @access  Private
exports.update = async (req, res) => {
    try {
        const visa = await Visa.findById(req.params.id);
        
        if (!visa) {
            return res.status(404).json({
                status: 'error',
                message: 'Visa not found'
            });
        }
        
        const updatedVisa = await Visa.findByIdAndUpdate(
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
                visa: updatedVisa
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete visa
// @route   DELETE /api/visas/:id
// @access  Private
exports.delete = async (req, res) => {
    try {
        const visa = await Visa.findById(req.params.id);
        
        if (!visa) {
            return res.status(404).json({
                status: 'error',
                message: 'Visa not found'
            });
        }
        
        // Soft delete
        visa.isActive = false;
        await visa.save();
        
        res.status(200).json({
            status: 'success',
            message: 'Visa deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get visa types
// @route   GET /api/visas/types
// @access  Private
exports.getTypes = async (req, res) => {
    try {
        const types = await Visa.distinct('type', { isActive: true });
        res.status(200).json({
            status: 'success',
            data: {
                types: ['All', ...types]
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

