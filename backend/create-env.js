const fs = require('fs');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://ehmadmin:khaled_21062004@cluster0.bjt2kap.mongodb.net/ehm_travel?appName=Cluster0

# JWT Configuration
JWT_SECRET=ehm_travel_secret_key_2025_change_in_production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env file updated with MongoDB Atlas connection!');
console.log('✅ Now you can run: npm run seed');

