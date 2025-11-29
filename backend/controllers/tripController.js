const Trip = require('../models/Trip');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
exports.getAll = async (req, res) => {
    try {
        const { search, status, type, page = 1, limit = 20 } = req.query;
        
        // Build query
        const query = {};
        
        if (search) {
            query.$or = [
                { tripName: { $regex: search, $options: 'i' } },
                { file: { $regex: search, $options: 'i' } },
                { tripNo: isNaN(search) ? null : parseInt(search) }
            ].filter(item => item !== null);
        }
        
        if (status && status !== 'All') {
            query.tripStatus = status;
        }
        
        if (type && type !== 'All') {
            query.type = type;
        }
        
        // Get total count
        const total = await Trip.countDocuments(query);
        
        // Get trips with pagination
        const trips = await Trip.find(query)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username')
            .sort({ tripNo: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.status(200).json({
            status: 'success',
            data: {
                trips,
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

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
exports.getOne = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('createdBy', 'fullName username')
            .populate('updatedBy', 'fullName username');
        
        if (!trip) {
            return res.status(404).json({
                status: 'error',
                message: 'Trip not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                trip
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create trip
// @route   POST /api/trips
// @access  Private
exports.create = async (req, res) => {
    try {
        // Get the next trip number
        const count = await Trip.countDocuments();
        const tripNo = count + 1;
        
        const trip = await Trip.create({
            ...req.body,
            tripNo,
            createdBy: req.user ? req.user._id : null
        });
        
        res.status(201).json({
            status: 'success',
            data: {
                trip
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.update = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({
                status: 'error',
                message: 'Trip not found'
            });
        }
        
        const updatedTrip = await Trip.findByIdAndUpdate(
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
                trip: updatedTrip
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.delete = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({
                status: 'error',
                message: 'Trip not found'
            });
        }
        
        await trip.deleteOne();
        
        res.status(200).json({
            status: 'success',
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Toggle trip status
// @route   PUT /api/trips/:id/toggle-status
// @access  Private
exports.toggleStatus = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({
                status: 'error',
                message: 'Trip not found'
            });
        }
        
        trip.tripStatus = trip.tripStatus === 'Active' ? 'Not Active' : 'Active';
        trip.updatedBy = req.user ? req.user._id : null;
        await trip.save();
        
        res.status(200).json({
            status: 'success',
            data: {
                trip
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

