const HotelContract = require('../models/HotelContract');

// @desc    Get all hotel contracts
// @route   GET /api/hotel-contracts
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const { search } = req.query;

        let query = {};

        // Search functionality
        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { hotelName: { $regex: search, $options: 'i' } }
            ];
        }

        const contracts = await HotelContract.find(query)
            .populate('createdBy', 'fullName username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: {
                contracts
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get single hotel contract
// @route   GET /api/hotel-contracts/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const contract = await HotelContract.findById(req.params.id)
            .populate('createdBy', 'fullName username');

        if (!contract) {
            return res.status(404).json({
                status: 'error',
                message: 'Hotel contract not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                contract
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create hotel contract
// @route   POST /api/hotel-contracts
// @access  Private
exports.create = async (req, res) => {
    try {
        const { code, name, hotelName, season, notes, periods } = req.body;

        // Check if code already exists
        const existingContract = await HotelContract.findOne({ code });
        if (existingContract) {
            return res.status(400).json({
                status: 'error',
                message: 'A contract with this code already exists'
            });
        }

        const contract = await HotelContract.create({
            code,
            name,
            hotelName,
            season,
            notes,
            periods: periods || [],
            createdBy: req.user ? req.user._id : null
        });

        await contract.populate('createdBy', 'fullName username');

        res.status(201).json({
            status: 'success',
            data: {
                contract
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update hotel contract
// @route   PUT /api/hotel-contracts/:id
// @access  Private
exports.update = async (req, res) => {
    try {
        const { code, name, hotelName, season, notes, periods } = req.body;

        const contract = await HotelContract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                status: 'error',
                message: 'Hotel contract not found'
            });
        }

        // Check if code is being changed and if it already exists
        if (code && code !== contract.code) {
            const existingContract = await HotelContract.findOne({ code });
            if (existingContract) {
                return res.status(400).json({
                    status: 'error',
                    message: 'A contract with this code already exists'
                });
            }
        }

        // Update fields
        if (code !== undefined) contract.code = code;
        if (name !== undefined) contract.name = name;
        if (hotelName !== undefined) contract.hotelName = hotelName;
        if (season !== undefined) contract.season = season;
        if (notes !== undefined) contract.notes = notes;
        if (periods !== undefined) contract.periods = periods;

        await contract.save();
        await contract.populate('createdBy', 'fullName username');

        res.status(200).json({
            status: 'success',
            data: {
                contract
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete hotel contract
// @route   DELETE /api/hotel-contracts/:id
// @access  Private
exports.delete = async (req, res) => {
    try {
        const contract = await HotelContract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                status: 'error',
                message: 'Hotel contract not found'
            });
        }

        await contract.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'Hotel contract deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
