const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// Create booking
router.post('/', protect, async (req, res) => {
    try {
        const booking = await Booking.create({
            ...req.body,
            user: req.user.id
        });
        
        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('professional', 'businessName')
            .populate('service', 'name');
        res.json({ success: true, count: bookings.length, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;