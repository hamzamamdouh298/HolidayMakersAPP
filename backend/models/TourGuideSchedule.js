const mongoose = require('mongoose');

const tourGuideScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  guideName: {
    type: String,
    required: true,
    trim: true
  },
  tourDetails: {
    type: String,
    default: ''
  },
  clientName: {
    type: String,
    default: ''
  },
  fileNumber: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  startTime: {
    type: String,
    default: '00:00'
  },
  endTime: {
    type: String,
    default: '00:00'
  },
  pax: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending'],
    default: 'Pending'
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
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

// Index for faster queries
tourGuideScheduleSchema.index({ date: -1 });
tourGuideScheduleSchema.index({ guideName: 1 });
tourGuideScheduleSchema.index({ status: 1 });

const TourGuideSchedule = mongoose.model('TourGuideSchedule', tourGuideScheduleSchema);

module.exports = TourGuideSchedule;

