const AirportTransfer = require('../models/AirportTransfer');

// @desc    Get all airport transfers
// @route   GET /api/airport-transfers
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const transfers = await AirportTransfer.find()
            .populate('agent', 'fullName username')
            .populate('createdBy', 'fullName username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: {
                transfers
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get single airport transfer
// @route   GET /api/airport-transfers/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const transfer = await AirportTransfer.findById(req.params.id)
            .populate('agent', 'fullName username')
            .populate('createdBy', 'fullName username');

        if (!transfer) {
            return res.status(404).json({
                status: 'error',
                message: 'Airport transfer not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                transfer
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create airport transfer
// @route   POST /api/airport-transfers
// @access  Private
exports.create = async (req, res) => {
    try {
        const transfer = await AirportTransfer.create({
            ...req.body,
            createdBy: req.user ? req.user._id : null
        });

        res.status(201).json({
            status: 'success',
            data: {
                transfer
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update airport transfer
// @route   PUT /api/airport-transfers/:id
// @access  Private
exports.update = async (req, res) => {
    try {
        const transfer = await AirportTransfer.findById(req.params.id);

        if (!transfer) {
            return res.status(404).json({
                status: 'error',
                message: 'Airport transfer not found'
            });
        }

        const updatedTransfer = await AirportTransfer.findByIdAndUpdate(
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
                transfer: updatedTransfer
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete airport transfer
// @route   DELETE /api/airport-transfers/:id
// @access  Private
exports.delete = async (req, res) => {
    try {
        const transfer = await AirportTransfer.findById(req.params.id);

        if (!transfer) {
            return res.status(404).json({
                status: 'error',
                message: 'Airport transfer not found'
            });
        }

        await transfer.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'Airport transfer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
