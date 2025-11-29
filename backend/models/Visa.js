const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        default: 'All'
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String, // URL or path to image
        default: ''
    },
    requirements: [{
        title: String,
        description: String,
        isRequired: {
            type: Boolean,
            default: false
        }
    }],
    links: [{
        title: String,
        url: String,
        description: String
    }],
    serialNumber: {
        type: Number,
        unique: true,
        default: function() {
            // Auto-increment serial number
            return this.constructor.countDocuments() + 1;
        }
    },
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

// Pre-save hook to ensure unique serial number
visaSchema.pre('save', async function(next) {
    if (this.isNew && !this.serialNumber) {
        const count = await this.constructor.countDocuments();
        this.serialNumber = count + 1;
    }
    next();
});

module.exports = mongoose.model('Visa', visaSchema);

