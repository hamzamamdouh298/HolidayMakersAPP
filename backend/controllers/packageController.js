const Package = require('../models/Package');

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const { search, enabled, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (search) {
      query.packageName = { $regex: search, $options: 'i' };
    }
    
    if (enabled !== undefined) {
      query.enabled = enabled === 'true';
    }
    
    const packages = await Package.find(query)
      .populate('createdBy', 'username fullName')
      .sort({ serialId: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Package.countDocuments(query);
    
    res.json({
      status: 'success',
      data: {
        packages,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching packages',
      error: error.message
    });
  }
};

// Get single package by ID
exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('createdBy', 'username fullName')
      .populate('updatedBy', 'username fullName');
    
    if (!package) {
      return res.status(404).json({
        status: 'error',
        message: 'Package not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { package }
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching package',
      error: error.message
    });
  }
};

// Create new package
exports.createPackage = async (req, res) => {
  try {
    const packageData = {
      ...req.body,
      createdBy: req.user?._id
    };
    
    const package = new Package(packageData);
    await package.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Package created successfully',
      data: { package }
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating package',
      error: error.message
    });
  }
};

// Update package
exports.updatePackage = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?._id
    };
    
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!package) {
      return res.status(404).json({
        status: 'error',
        message: 'Package not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Package updated successfully',
      data: { package }
    });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating package',
      error: error.message
    });
  }
};

// Delete package
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id);
    
    if (!package) {
      return res.status(404).json({
        status: 'error',
        message: 'Package not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting package',
      error: error.message
    });
  }
};

