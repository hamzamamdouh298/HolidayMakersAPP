const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  serialId: {
    type: Number,
    unique: true
  },
  packageName: {
    type: String,
    required: true,
    trim: true
  },
  noDays: {
    type: Number,
    required: true,
    min: 1
  },
  cost: {
    type: Number,
    default: 0
  },
  sellingPrice: {
    type: Number,
    default: 0
  },
  pricePerAdult: {
    type: Number,
    default: 0
  },
  pricePerChild: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'جنيه مصري'
  },
  priceInclude: {
    type: String,
    default: ''
  },
  priceNotInclude: {
    type: String,
    default: ''
  },
  enabled: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
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

// Pre-save hook to auto-increment serialId
packageSchema.pre('save', async function(next) {
  if (this.isNew && !this.serialId) {
    const count = await this.constructor.countDocuments();
    this.serialId = count + 1;
  }
  next();
});

// Index for faster queries
packageSchema.index({ packageName: 1 });
packageSchema.index({ enabled: 1 });
packageSchema.index({ serialId: 1 });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;

