const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ehm_travel');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('\n⚠️  MongoDB Connection Failed!');
    console.error('Please make sure MongoDB is running, or update MONGODB_URI in .env file\n');
    process.exit(1);
  }
};

module.exports = connectDB;

