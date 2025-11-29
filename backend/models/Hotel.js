const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true
  },
  address: String,
  city: String,
  country: String,
  phone: String,
  email: String,
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate hotel code automatically if not provided
hotelSchema.pre('save', async function(next) {
  if (!this.code) {
    const count = await mongoose.model('Hotel').countDocuments();
    this.code = `HTL${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;

