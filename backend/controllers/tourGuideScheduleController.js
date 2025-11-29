const TourGuideSchedule = require('../models/TourGuideSchedule');

// Get all tour guide schedules
exports.getAllTourGuideSchedules = async (req, res) => {
  try {
    const { 
      search, 
      date, 
      guideName, 
      status,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { guideName: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { fileNumber: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (date) {
      query.date = new Date(date);
    }
    
    if (guideName) {
      query.guideName = { $regex: guideName, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    const schedules = await TourGuideSchedule.find(query)
      .populate('reservation', 'fileNumber client')
      .populate('createdBy', 'username fullName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await TourGuideSchedule.countDocuments(query);
    
    res.json({
      status: 'success',
      data: {
        schedules,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    console.error('Error fetching tour guide schedules:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tour guide schedules',
      error: error.message
    });
  }
};

// Get single tour guide schedule by ID
exports.getTourGuideScheduleById = async (req, res) => {
  try {
    const schedule = await TourGuideSchedule.findById(req.params.id)
      .populate('reservation', 'fileNumber client')
      .populate('createdBy', 'username fullName')
      .populate('updatedBy', 'username fullName');
    
    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour guide schedule not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { schedule }
    });
  } catch (error) {
    console.error('Error fetching tour guide schedule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching tour guide schedule',
      error: error.message
    });
  }
};

// Create new tour guide schedule
exports.createTourGuideSchedule = async (req, res) => {
  try {
    const scheduleData = {
      ...req.body,
      createdBy: req.user?._id
    };
    
    const schedule = new TourGuideSchedule(scheduleData);
    await schedule.save();
    
    const populatedSchedule = await TourGuideSchedule.findById(schedule._id)
      .populate('reservation', 'fileNumber client');
    
    res.status(201).json({
      status: 'success',
      message: 'Tour guide schedule created successfully',
      data: { schedule: populatedSchedule }
    });
  } catch (error) {
    console.error('Error creating tour guide schedule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating tour guide schedule',
      error: error.message
    });
  }
};

// Update tour guide schedule
exports.updateTourGuideSchedule = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?._id
    };
    
    const schedule = await TourGuideSchedule.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('reservation', 'fileNumber client');
    
    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour guide schedule not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Tour guide schedule updated successfully',
      data: { schedule }
    });
  } catch (error) {
    console.error('Error updating tour guide schedule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating tour guide schedule',
      error: error.message
    });
  }
};

// Delete tour guide schedule
exports.deleteTourGuideSchedule = async (req, res) => {
  try {
    const schedule = await TourGuideSchedule.findByIdAndDelete(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour guide schedule not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Tour guide schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tour guide schedule:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting tour guide schedule',
      error: error.message
    });
  }
};

