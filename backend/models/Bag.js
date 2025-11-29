const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
    voucherNo: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    entryId: {
        type: String,
        default: 'UnConfirm',
        enum: ['Confirm', 'UnConfirm']
    },
    supervisor: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    reportNo: {
        type: String,
        trim: true
    },
    bagsCount: {
        type: Number,
        required: true,
        default: 0
    },
    station: {
        type: String,
        trim: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        default: 'جنيه مصري'
    },
    invoiceId: {
        type: String,
        trim: true
    },
    // Additional fields from Add Request form
    bagPackagesCount: {
        type: Number,
        default: 0
    },
    bagPackagesNums: {
        type: String,
        trim: true
    },
    clientPhone: {
        type: String,
        trim: true
    },
    receiverName: {
        type: String,
        trim: true
    },
    client: {
        type: String,
        trim: true
    },
    area: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        default: 0
    },
    byAssistant: {
        type: Boolean,
        default: false
    },
    driverName: {
        type: String,
        trim: true
    },
    vehicle: {
        type: String,
        trim: true
    },
    vehicleType: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    extra: {
        type: Number,
        default: 0
    },
    fast: {
        type: Boolean,
        default: false
    },
    clear: {
        type: Boolean,
        default: false
    },
    clearByBags: {
        type: Boolean,
        default: false
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

// Pre-save hook to calculate total price
bagSchema.pre('save', function(next) {
    if (this.isModified('price') || this.isModified('extra')) {
        this.totalPrice = this.price + this.extra;
    }
    next();
});

module.exports = mongoose.model('Bag', bagSchema);

