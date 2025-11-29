const mongoose = require('mongoose');

const balloonSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true,
        trim: true
    },
    cost: {
        type: Number,
        default: 0
    },
    supplier: {
        type: String,
        trim: true
    },
    entryId: {
        type: String,
        default: 'UnConfirm',
        enum: ['Confirm', 'UnConfirm']
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    pax: {
        type: Number,
        default: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    extra: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'EGP'
    },
    rate: {
        type: Number,
        default: 1
    },
    trip: {
        type: String,
        trim: true
    },
    balloon: {
        type: String,
        trim: true
    },
    operationDate: {
        type: Date
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
balloonSchema.pre('save', function(next) {
    if (this.isModified('price') || this.isModified('discount') || this.isModified('extra') || this.isModified('pax')) {
        this.totalPrice = (this.price * this.pax) - this.discount + this.extra;
    }
    next();
});

module.exports = mongoose.model('Balloon', balloonSchema);

