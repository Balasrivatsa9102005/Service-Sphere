const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });
        res.json({ success: true, count: services.length, services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;