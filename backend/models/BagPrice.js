const mongoose = require('mongoose');

const bagPriceSchema = new mongoose.Schema({
    area: {
        type: String,
        required: true,
        trim: true
    },
    client: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        default: 'جنيه مصري'
    },
    fair: {
        type: Number,
        default: 0
    },
    fairRate: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 0
    },
    maxRate: {
        type: Number,
        default: 0
    },
    clear: {
        type: String,
        trim: true
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

module.exports = mongoose.model('BagPrice', bagPriceSchema);

