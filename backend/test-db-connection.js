require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') || 'Not found');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ehm_travel')
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('You can now run: npm run seed');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed!');
    console.log('Error:', error.message);
    console.log('\n📝 Next Steps:');
    console.log('1. Check if MongoDB is running locally, OR');
    console.log('2. Use MongoDB Atlas (cloud) - See MONGODB_SETUP.md');
    console.log('3. Update MONGODB_URI in backend/.env file');
    process.exit(1);
  });

