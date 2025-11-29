const Role = require('../models/Role');
const User = require('../models/User');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
exports.getRoles = async (req, res) => {
  try {
    const { search, isActive, page = 1, limit = 20 } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const roles = await Role.find(query)
      .populate('createdBy', 'username fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Role.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        roles,
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

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Private
exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate('createdBy', 'username fullName');

    if (!role) {
      return res.status(404).json({
        status: 'error',
        message: 'Role not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        role
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create role
// @route   POST /api/roles
// @access  Private
exports.createRole = async (req, res) => {
  try {
    const { name, displayName, description, permissions } = req.body;

    // Check if role already exists
    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Role already exists with this name'
      });
    }

    const role = await Role.create({
      name,
      displayName,
      description,
      permissions: permissions || {},
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        role
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private
exports.updateRole = async (req, res) => {
  try {
    const { name, displayName, description, permissions, isActive } = req.body;

    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        status: 'error',
        message: 'Role not found'
      });
    }

    // Prevent updating system roles
    if (role.isSystem) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot update system roles'
      });
    }

    if (name) role.name = name;
    if (displayName) role.displayName = displayName;
    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = { ...role.permissions, ...permissions };
    if (isActive !== undefined) role.isActive = isActive;

    await role.save();

    res.status(200).json({
      status: 'success',
      data: {
        role
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        status: 'error',
        message: 'Role not found'
      });
    }

    // Prevent deleting system roles
    if (role.isSystem) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete system roles'
      });
    }

    // Check if any users have this role
    const usersWithRole = await User.countDocuments({ role: role._id });
    if (usersWithRole > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role`
      });
    }

    await role.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

