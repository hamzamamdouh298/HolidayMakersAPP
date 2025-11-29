require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    const users = await User.find({}).select('username email isActive role');
    console.log('Users in database:');
    users.forEach(u => {
      console.log(`- username: ${u.username} | email: ${u.email} | isActive: ${u.isActive}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing users:', err.message);
    process.exit(1);
  }
})();
