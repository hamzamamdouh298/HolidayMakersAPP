const mongoose = require('mongoose');

const airportTransferSchema = new mongoose.Schema({
    // Vehicle Information
    vehicle: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    guestName: String,
    driverName: String,
    delegateName: String,
    station: {
        type: String,
        required: true
    },
    kmStart: Number,
    kmReturn: Number,
    distance: Number,

    // Trip Details
    date: {
        type: Date,
        required: true
    },
    pickupTime: String,
    startLocation: String,
    endLocation: String,
    orderTime: String,
    orderDate: Date,
    flightNo: String,

    // Financial Information
    delegatorCommission: {
        type: Number,
        default: 0
    },
    commission: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'EGP'
    },
    salePrice: {
        type: Number,
        required: true
    },
    paymentLocation: String,

    // Customer Information
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming Agent is a User or Customer, adjusting based on requirements
        required: true
    },
    receiverName: String,
    arrivalDate: Date,
    arrivalTime: String,
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    referenceId: String,
    branch: String,
    entryId: {
        type: String,
        default: 'UnConfirm',
        enum: ['Confirm', 'UnConfirm']
    },
    customerName: String,

    // Payments
    payments: [{
        amount: Number,
        date: Date,
        method: String,
        notes: String
    }],

    // Admin Notes
    adminNotes: String,

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

module.exports = mongoose.model('AirportTransfer', airportTransferSchema);
