require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Role = require('../models/Role');
const User = require('../models/User');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Role.deleteMany({});
    await User.deleteMany({});

    console.log('Creating roles...');
    
    // Create Admin Role
    const adminRole = await Role.create({
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system access',
      permissions: {
        viewDashboard: true,
        viewReservations: true,
        createReservations: true,
        editReservations: true,
        deleteReservations: true,
        exportReservations: true,
        viewUsers: true,
        createUsers: true,
        editUsers: true,
        deleteUsers: true,
        viewRoles: true,
        createRoles: true,
        editRoles: true,
        deleteRoles: true,
        viewReports: true,
        exportReports: true,
        manageSettings: true,
        manageSystem: true
      },
      isSystem: true,
      isActive: true
    });

    // Create Manager Role
    const managerRole = await Role.create({
      name: 'manager',
      displayName: 'Manager',
      description: 'Manage reservations and view reports',
      permissions: {
        viewDashboard: true,
        viewReservations: true,
        createReservations: true,
        editReservations: true,
        deleteReservations: true,
        exportReservations: true,
        viewUsers: true,
        viewRoles: false,
        createRoles: false,
        editRoles: false,
        deleteRoles: false,
        viewReports: true,
        exportReports: true,
        manageSettings: false,
        manageSystem: false
      },
      isSystem: true,
      isActive: true
    });

    // Create User Role
    const userRole = await Role.create({
      name: 'user',
      displayName: 'User',
      description: 'Basic user access',
      permissions: {
        viewDashboard: true,
        viewReservations: true,
        createReservations: true,
        editReservations: false,
        deleteReservations: false,
        exportReservations: false,
        viewUsers: false,
        createUsers: false,
        editUsers: false,
        deleteUsers: false,
        viewRoles: false,
        createRoles: false,
        editRoles: false,
        deleteRoles: false,
        viewReports: false,
        exportReports: false,
        manageSettings: false,
        manageSystem: false
      },
      isSystem: true,
      isActive: true
    });

    console.log('Creating default admin user...');
    
    // Create Admin User
    await User.create({
      username: 'admin',
      email: 'admin@ehm.com',
      password: 'admin123',
      fullName: 'System Administrator',
      phone: '+201234567890',
      role: adminRole._id,
      branch: 'Cairo',
      department: 'IT',
      isActive: true
    });

    // Create Manager User
    await User.create({
      username: 'manager',
      email: 'manager@ehm.com',
      password: 'manager123',
      fullName: 'Travel Manager',
      phone: '+201234567891',
      role: managerRole._id,
      branch: 'Cairo',
      department: 'Operations',
      isActive: true
    });

    // Create Regular User
    await User.create({
      username: 'user',
      email: 'user@ehm.com',
      password: 'user123',
      fullName: 'Regular User',
      phone: '+201234567892',
      role: userRole._id,
      branch: 'Luxor',
      department: 'Sales',
      isActive: true
    });

    console.log('✓ Seed data created successfully!');
    console.log('\nDefault Users:');
    console.log('  Admin:   username: admin   | password: admin123');
    console.log('  Manager: username: manager | password: manager123');
    console.log('  User:    username: user    | password: user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

