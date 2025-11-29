const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production');

      // Get user from token
      req.user = await User.findById(decoded.id).populate('role');

      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'User account is disabled'
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error in authentication'
    });
  }
};

// Check specific permission
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied - No role assigned'
      });
    }

    if (!req.user.role.permissions[permission]) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied - Missing permission: ${permission}`
      });
    }

    next();
  };
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }

  if (req.user.role.name !== 'admin' && !req.user.role.permissions.manageSystem) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied - Admin only'
    });
  }

  next();
};

