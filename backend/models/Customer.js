const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  // Basic Information
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerType: {
    type: String,
    required: true,
    enum: ['Individual', 'Corporate', 'Agency', 'Other']
  },
  customerCode: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Contact Information
  telephone: {
    countryCode: String,
    number: String
  },
  additionalPhone: {
    countryCode: String,
    number: String
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  fax: String,
  
  // Address Information
  country: String,
  city: String,
  regionCity: String,
  branch: String,
  buildingNumber: String,
  address1: String,
  address2: String,
  zipCode: String,
  
  // Financial Information
  creditTerm: {
    type: Number,
    default: 0
  },
  accountingCode: String,
  galileoCode: String,
  costPlus: Number,
  customerCommission: Number,
  taxNumber: String,
  
  // Identification
  nationalId: String,
  passportNumber: String,
  licenseNumber: String,
  nationality: String,
  
  // Business Information
  ownerName: String,
  staffOwner: String,
  accountManager: String,
  andOfficeIds: String,
  title: String,
  
  // Additional Information
  refNote: String,
  url: String,
  remarkForInvoice: String,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate customer code automatically if not provided
customerSchema.pre('save', async function(next) {
  if (!this.customerCode) {
    const count = await mongoose.model('Customer').countDocuments();
    this.customerCode = `CUST${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

