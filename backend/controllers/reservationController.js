const Reservation = require('../models/Reservation');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    const { 
      search, 
      fileNumber, 
      client, 
      progress, 
      confirmStatus,
      branch,
      dateFrom,
      dateTo,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = { isDeleted: false };

    // Search across multiple fields
    if (search) {
      query.$or = [
        { fileNumber: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { invoiceNo: { $regex: search, $options: 'i' } }
      ];
    }

    if (fileNumber) {
      query.fileNumber = { $regex: fileNumber, $options: 'i' };
    }

    if (client) {
      query.client = { $regex: client, $options: 'i' };
    }

    if (progress && progress !== 'All') {
      query.progress = progress;
    }

    if (confirmStatus && confirmStatus !== 'All') {
      query.confirmStatus = confirmStatus;
    }

    if (branch && branch !== 'All') {
      query.branch = branch;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo);
      }
    }

    const reservations = await Reservation.find(query)
      .populate('user', 'username fullName')
      .populate('updatedBy', 'username fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Reservation.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        reservations,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('updatedBy', 'username fullName');

    if (!reservation || reservation.isDeleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        reservation
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const {
      fileNumber,
      client,
      phone,
      date,
      followUp,
      amount,
      branch,
      salesOfficer,
      progress,
      confirmStatus,
      dateOfInvoice,
      invoiceNo,
      manualInvoiceSerial,
      manualInvoiceID,
      manualInvoiceDate,
      type,
      destination,
      currency,
      notes,
      hideVat
    } = req.body;

    // Check if file number already exists
    const existingReservation = await Reservation.findOne({ fileNumber });
    if (existingReservation) {
      return res.status(400).json({
        status: 'error',
        message: 'Reservation with this file number already exists'
      });
    }

    const reservation = await Reservation.create({
      fileNumber,
      client,
      phone,
      date,
      followUp,
      amount,
      user: req.user._id,
      branch,
      salesOfficer,
      progress,
      confirmStatus,
      dateOfInvoice,
      invoiceNo,
      manualInvoiceSerial,
      manualInvoiceID,
      manualInvoiceDate,
      type,
      destination,
      currency,
      notes,
      hideVat,
      updatedBy: req.user._id
    });

    await reservation.populate('user', 'username fullName');

    res.status(201).json({
      status: 'success',
      data: {
        reservation
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation || reservation.isDeleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Reservation not found'
      });
    }

    // Update fields
    const allowedFields = [
      'client', 'phone', 'date', 'followUp', 'amount', 'branch', 
      'salesOfficer', 'progress', 'confirmStatus', 'dateOfInvoice', 
      'invoiceNo', 'manualInvoiceSerial', 'manualInvoiceID', 
      'manualInvoiceDate', 'type', 'destination', 'currency', 
      'notes', 'hideVat'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        reservation[field] = req.body[field];
      }
    });

    reservation.updatedBy = req.user._id;
    await reservation.save();
    await reservation.populate('user', 'username fullName');
    await reservation.populate('updatedBy', 'username fullName');

    res.status(200).json({
      status: 'success',
      data: {
        reservation
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete reservation (soft delete)
// @route   DELETE /api/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation || reservation.isDeleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Reservation not found'
      });
    }

    reservation.isDeleted = true;
    reservation.deletedAt = new Date();
    reservation.deletedBy = req.user._id;
    await reservation.save();

    res.status(200).json({
      status: 'success',
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Bulk delete reservations
// @route   POST /api/reservations/bulk-delete
// @access  Private
exports.bulkDeleteReservations = async (req, res) => {
  try {
    const { reservationIds } = req.body;

    if (!reservationIds || !Array.isArray(reservationIds) || reservationIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide reservation IDs to delete'
      });
    }

    await Reservation.updateMany(
      { _id: { $in: reservationIds } },
      { 
        isDeleted: true, 
        deletedAt: new Date(),
        deletedBy: req.user._id
      }
    );

    res.status(200).json({
      status: 'success',
      message: `${reservationIds.length} reservation(s) deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Duplicate reservation
// @route   POST /api/reservations/:id/duplicate
// @access  Private
exports.duplicateReservation = async (req, res) => {
  try {
    const original = await Reservation.findById(req.params.id);

    if (!original || original.isDeleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Reservation not found'
      });
    }

    // Generate new file number
    const fileNumber = '30' + Math.floor(100000 + Math.random() * 900000);

    const duplicated = await Reservation.create({
      ...original.toObject(),
      _id: undefined,
      fileNumber,
      user: req.user._id,
      updatedBy: req.user._id,
      createdAt: undefined,
      updatedAt: undefined
    });

    await duplicated.populate('user', 'username fullName');

    res.status(201).json({
      status: 'success',
      data: {
        reservation: duplicated
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get reservation statistics
// @route   GET /api/reservations/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const total = await Reservation.countDocuments({ isDeleted: false });
    const pending = await Reservation.countDocuments({ progress: 'Pending', isDeleted: false });
    const inProgress = await Reservation.countDocuments({ progress: 'In Progress', isDeleted: false });
    const completed = await Reservation.countDocuments({ progress: 'Complete', isDeleted: false });
    const confirmed = await Reservation.countDocuments({ confirmStatus: 'Confirmed', isDeleted: false });

    res.status(200).json({
      status: 'success',
      data: {
        total,
        pending,
        inProgress,
        completed,
        confirmed,
        unconfirmed: total - confirmed
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

