const mongoose = require('mongoose');

const periodGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  roomsCount: {
    type: Number,
    default: 0
  },
  commitment: {
    type: Number,
    default: 0
  },
  allotment: {
    type: String,
    default: ''
  }
}, { _id: false });

const hotelContractSchema = new mongoose.Schema({
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
  notes: String,
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  season: {
    type: String,
    trim: true
  },
  periods: [periodGroupSchema],
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

// Generate contract code automatically if not provided
hotelContractSchema.pre('save', async function (next) {
  if (!this.code) {
    const count = await mongoose.model('HotelContract').countDocuments();
    this.code = String(count + 1).padStart(8, '0');
  }
  next();
});

// Index for faster queries
hotelContractSchema.index({ hotel: 1 });
// Note: code index is automatically created by unique: true, so we don't need to add it again

const HotelContract = mongoose.model('HotelContract', hotelContractSchema);

module.exports = HotelContract;

