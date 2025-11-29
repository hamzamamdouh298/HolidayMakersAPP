const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  fileNumber: {
    type: String,
    required: [true, 'File number is required'],
    unique: true,
    trim: true
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  followUp: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', ''],
    default: ''
  },
  amount: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: String,
    default: ''
  },
  salesOfficer: {
    type: String,
    default: ''
  },
  progress: {
    type: String,
    enum: ['Pending', 'In Progress', 'Complete', 'Cancelled'],
    default: 'Pending'
  },
  confirmStatus: {
    type: String,
    enum: ['Confirmed', 'UnConfirmed'],
    default: 'UnConfirmed'
  },
  dateOfInvoice: {
    type: Date,
    default: Date.now
  },
  invoiceNo: {
    type: String,
    default: ''
  },
  manualInvoiceSerial: {
    type: String,
    default: ''
  },
  manualInvoiceID: {
    type: String,
    default: ''
  },
  manualInvoiceDate: {
    type: Date,
    default: null
  },
  type: {
    type: String,
    enum: ['individual', 'corporate', 'government', 'travel_agent', 'tour_operator', ''],
    default: ''
  },
  destination: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    enum: ['EGP', 'USD', 'EUR', 'SAR', 'GBP', 'AED'],
    default: 'EGP'
  },
  notes: {
    type: String,
    default: ''
  },
  hideVat: {
    type: Boolean,
    default: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
// Note: fileNumber index is automatically created by unique: true, so we don't need to add it again
reservationSchema.index({ client: 1 });
reservationSchema.index({ date: -1 });
reservationSchema.index({ isDeleted: 1 });

// Virtual for updated at display
reservationSchema.virtual('updatedAtDisplay').get(function() {
  return this.updatedAt.toLocaleString();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

