const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    tripNo: {
        type: Number,
        unique: true,
        required: true
    },
    tripName: {
        type: String,
        required: true,
        trim: true
    },
    tripStatus: {
        type: String,
        enum: ['Active', 'Not Active'],
        default: 'Active'
    },
    date: {
        type: Date,
        required: true
    },
    currency: {
        type: String,
        default: 'EGP'
    },
    available: {
        type: Number,
        required: true,
        default: 0
    },
    remaining: {
        type: Number,
        default: function() {
            return this.available;
        }
    },
    booked: {
        type: Number,
        default: 0
    },
    adults: {
        type: Number,
        default: 0
    },
    children: {
        type: Number,
        default: 0
    },
    infant: {
        type: Number,
        default: 0
    },
    file: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['Hajj', 'Umrah', 'Other'],
        default: 'Other'
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

// Pre-save hook to ensure remaining is calculated
tripSchema.pre('save', function(next) {
    if (this.isModified('available') || this.isModified('booked')) {
        this.remaining = this.available - this.booked;
    }
    if (!this.file) {
        this.file = this.tripName;
    }
    next();
});

// Pre-save hook to auto-increment tripNo
tripSchema.pre('save', async function(next) {
    if (this.isNew && !this.tripNo) {
        const count = await this.constructor.countDocuments();
        this.tripNo = count + 1;
    }
    next();
});

module.exports = mongoose.model('Trip', tripSchema);

