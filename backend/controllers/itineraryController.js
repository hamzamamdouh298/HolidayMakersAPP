const Itinerary = require('../models/Itinerary');

// Get all itineraries
exports.getAllItineraries = async (req, res) => {
  try {
    const { 
      search, 
      fileNumber, 
      dateFrom, 
      dateTo, 
      scheduled,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { fileNumber: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { agent: { $regex: search, $options: 'i' } },
        { itinerary: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (fileNumber) {
      query.fileNumber = { $regex: fileNumber, $options: 'i' };
    }
    
    if (scheduled !== undefined) {
      query.scheduled = scheduled === 'true';
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
    
    const itineraries = await Itinerary.find(query)
      .populate('reservation', 'fileNumber client')
      .populate('createdBy', 'username fullName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Itinerary.countDocuments(query);
    
    res.json({
      status: 'success',
      data: {
        itineraries,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching itineraries',
      error: error.message
    });
  }
};

// Get single itinerary by ID
exports.getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate('reservation', 'fileNumber client')
      .populate('createdBy', 'username fullName')
      .populate('updatedBy', 'username fullName');
    
    if (!itinerary) {
      return res.status(404).json({
        status: 'error',
        message: 'Itinerary not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { itinerary }
    });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching itinerary',
      error: error.message
    });
  }
};

// Create new itinerary
exports.createItinerary = async (req, res) => {
  try {
    const itineraryData = {
      ...req.body,
      createdBy: req.user?._id
    };
    
    const itinerary = new Itinerary(itineraryData);
    await itinerary.save();
    
    const populatedItinerary = await Itinerary.findById(itinerary._id)
      .populate('reservation', 'fileNumber client');
    
    res.status(201).json({
      status: 'success',
      message: 'Itinerary created successfully',
      data: { itinerary: populatedItinerary }
    });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating itinerary',
      error: error.message
    });
  }
};

// Update itinerary
exports.updateItinerary = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?._id
    };
    
    const itinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('reservation', 'fileNumber client');
    
    if (!itinerary) {
      return res.status(404).json({
        status: 'error',
        message: 'Itinerary not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Itinerary updated successfully',
      data: { itinerary }
    });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating itinerary',
      error: error.message
    });
  }
};

// Delete itinerary
exports.deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    
    if (!itinerary) {
      return res.status(404).json({
        status: 'error',
        message: 'Itinerary not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Itinerary deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting itinerary',
      error: error.message
    });
  }
};

