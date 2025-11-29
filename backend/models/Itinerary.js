const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  scheduled: {
    type: Boolean,
    default: false
  },
  fileNumber: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: ''
  },
  remarker: {
    type: String,
    default: ''
  },
  confirmation: {
    type: String,
    enum: ['Confirmed', 'UnConfirmed', 'Pending', ''],
    default: ''
  },
  roomType: {
    type: String,
    default: ''
  },
  transportation: {
    type: String,
    default: ''
  },
  supplier: {
    type: String,
    default: ''
  },
  clientName: {
    type: String,
    default: ''
  },
  agent: {
    type: String,
    default: ''
  },
  operator: {
    type: String,
    default: ''
  },
  accommodation: {
    type: String,
    default: ''
  },
  pax: {
    type: Number,
    default: 0
  },
  time: {
    type: String,
    default: '00:00'
  },
  itinerary: {
    type: String,
    default: ''
  },
  bookingNar: {
    type: String,
    default: ''
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
itinerarySchema.index({ date: -1 });
itinerarySchema.index({ fileNumber: 1 });
itinerarySchema.index({ scheduled: 1 });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;

