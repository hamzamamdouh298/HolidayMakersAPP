const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a role name'],
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: [true, 'Please provide a display name']
  },
  description: {
    type: String,
    default: ''
  },
  permissions: {
    // Dashboard
    viewDashboard: { type: Boolean, default: true },
    
    // Reservations
    viewReservations: { type: Boolean, default: false },
    createReservations: { type: Boolean, default: false },
    editReservations: { type: Boolean, default: false },
    deleteReservations: { type: Boolean, default: false },
    exportReservations: { type: Boolean, default: false },
    
    // Users
    viewUsers: { type: Boolean, default: false },
    createUsers: { type: Boolean, default: false },
    editUsers: { type: Boolean, default: false },
    deleteUsers: { type: Boolean, default: false },
    
    // Roles
    viewRoles: { type: Boolean, default: false },
    createRoles: { type: Boolean, default: false },
    editRoles: { type: Boolean, default: false },
    deleteRoles: { type: Boolean, default: false },
    
    // Reports
    viewReports: { type: Boolean, default: false },
    exportReports: { type: Boolean, default: false },
    
    // System Settings
    manageSettings: { type: Boolean, default: false },
    manageSystem: { type: Boolean, default: false }
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;

