require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');
const User = require('../models/User');

const resetPasswords = async () => {
  try {
    await connectDB();

    console.log('Resetting all user passwords...\n');
    
    // Get all users
    const users = await User.find();
    
    for (const user of users) {
      let newPassword = '';
      
      if (user.username === 'admin') {
        newPassword = 'admin123';
      } else if (user.username === 'manager') {
        newPassword = 'manager123';
      } else if (user.username === 'user') {
        newPassword = 'user123';
      }
      
      if (newPassword) {
        // Set password (will be hashed automatically by the pre-save hook)
        user.password = newPassword;
        await user.save();
        
        console.log(`✅ Reset password for: ${user.username} → ${newPassword}`);
      }
    }
    
    console.log('\n✅ All passwords reset successfully!');
    console.log('\nYou can now login with:');
    console.log('  - admin / admin123');
    console.log('  - manager / manager123');
    console.log('  - user / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetPasswords();

