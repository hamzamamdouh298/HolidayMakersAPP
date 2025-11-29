const Hotel = require('../models/Hotel');
const HotelContract = require('../models/HotelContract');

// ========== HOTEL CONTROLLERS ==========

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true })
      .sort({ name: 1 });
    
    res.json({
      status: 'success',
      data: { hotels }
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching hotels',
      error: error.message
    });
  }
};

// Get single hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { hotel }
    });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching hotel',
      error: error.message
    });
  }
};

// Create new hotel
exports.createHotel = async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      createdBy: req.user?._id
    };
    
    const hotel = new Hotel(hotelData);
    await hotel.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Hotel created successfully',
      data: { hotel }
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Hotel code already exists',
        error: error.message
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error creating hotel',
      error: error.message
    });
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?._id
    };
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Hotel updated successfully',
      data: { hotel }
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating hotel',
      error: error.message
    });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting hotel',
      error: error.message
    });
  }
};

// ========== HOTEL CONTRACT CONTROLLERS ==========

// Get all hotel contracts
exports.getAllHotelContracts = async (req, res) => {
  try {
    const contracts = await HotelContract.find()
      .populate('hotel', 'name code')
      .populate('createdBy', 'username fullName')
      .sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: { contracts }
    });
  } catch (error) {
    console.error('Error fetching hotel contracts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching hotel contracts',
      error: error.message
    });
  }
};

// Get single hotel contract by ID
exports.getHotelContractById = async (req, res) => {
  try {
    const contract = await HotelContract.findById(req.params.id)
      .populate('hotel', 'name code')
      .populate('createdBy', 'username fullName');
    
    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel contract not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { contract }
    });
  } catch (error) {
    console.error('Error fetching hotel contract:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching hotel contract',
      error: error.message
    });
  }
};

// Create new hotel contract
exports.createHotelContract = async (req, res) => {
  try {
    const contractData = {
      ...req.body,
      createdBy: req.user?._id
    };
    
    // Validate hotel exists
    const hotel = await Hotel.findById(contractData.hotel);
    if (!hotel) {
      return res.status(400).json({
        status: 'error',
        message: 'Hotel not found'
      });
    }
    
    const contract = new HotelContract(contractData);
    await contract.save();
    
    const populatedContract = await HotelContract.findById(contract._id)
      .populate('hotel', 'name code');
    
    res.status(201).json({
      status: 'success',
      message: 'Hotel contract created successfully',
      data: { contract: populatedContract }
    });
  } catch (error) {
    console.error('Error creating hotel contract:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Contract code already exists',
        error: error.message
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error creating hotel contract',
      error: error.message
    });
  }
};

// Update hotel contract
exports.updateHotelContract = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?._id
    };
    
    // If hotel is being updated, validate it exists
    if (updateData.hotel) {
      const hotel = await Hotel.findById(updateData.hotel);
      if (!hotel) {
        return res.status(400).json({
          status: 'error',
          message: 'Hotel not found'
        });
      }
    }
    
    const contract = await HotelContract.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('hotel', 'name code');
    
    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel contract not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Hotel contract updated successfully',
      data: { contract }
    });
  } catch (error) {
    console.error('Error updating hotel contract:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating hotel contract',
      error: error.message
    });
  }
};

// Delete hotel contract
exports.deleteHotelContract = async (req, res) => {
  try {
    const contract = await HotelContract.findByIdAndDelete(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        status: 'error',
        message: 'Hotel contract not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Hotel contract deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hotel contract:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting hotel contract',
      error: error.message
    });
  }
};

