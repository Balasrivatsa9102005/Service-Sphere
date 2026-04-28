const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    description: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        default: 500
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 4.5
    },
    totalReviews: {
        type: Number,
        default: 25
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Professional', professionalSchema);