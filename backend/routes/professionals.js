const express = require('express');
const router = express.Router();
const Professional = require('../models/Professional');
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

// Get professionals with filters (service and city)
router.get('/', async (req, res) => {
    try {
        const { service, city, search } = req.query;
        
        console.log('📥 API Call - service:', service, 'city:', city);
        
        let query = { isAvailable: true };
        
        // Filter by service name - IMPORTANT: exact match
        if (service) {
            const serviceDoc = await Service.findOne({ name: { $regex: new RegExp(`^${service}$`, 'i') } });
            if (serviceDoc) {
                query.services = serviceDoc._id;
                console.log('   Found service:', serviceDoc.name);
            } else {
                console.log('   No service found for:', service);
                return res.json({ success: true, count: 0, professionals: [] });
            }
        }
        
        // Filter by city - EXACT MATCH
        if (city && city !== 'null' && city !== 'undefined' && city !== '') {
            query.city = city;
            console.log('   Filtering by city EXACT:', city);
        } else {
            console.log('   No city filter applied');
        }
        
        if (search) {
            query.businessName = { $regex: search, $options: 'i' };
        }
        
        console.log('   Final query:', JSON.stringify(query));
        
        const professionals = await Professional.find(query)
            .populate('userId', 'name email phone')
            .populate('services', 'name category');
        
        console.log(`   Found ${professionals.length} professionals`);
        
        // Log first few results for debugging
        if (professionals.length > 0) {
            professionals.slice(0, 3).forEach(p => {
                console.log(`      - ${p.businessName} | City: ${p.city}`);
            });
        }
        
        res.json({ success: true, count: professionals.length, professionals });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single professional
router.get('/:id', async (req, res) => {
    try {
        const professional = await Professional.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('services', 'name category');
        
        if (!professional) {
            return res.status(404).json({ success: false, message: 'Professional not found' });
        }
        
        res.json({ success: true, professional });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Register new professional
router.post('/register', protect, async (req, res) => {
    try {
        const { businessName, service, experience, city, hourlyRate, description, phone } = req.body;
        
        const serviceDoc = await Service.findOne({ name: service });
        if (!serviceDoc) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        
        const existingProfessional = await Professional.findOne({ userId: req.user.id });
        if (existingProfessional) {
            return res.status(400).json({ success: false, message: 'You already have a business listing' });
        }
        
        const professional = await Professional.create({
            userId: req.user.id,
            businessName: businessName,
            services: [serviceDoc._id],
            description: description,
            experience: experience,
            city: city,
            hourlyRate: hourlyRate || 500,
            phone: phone || req.user.phone,
            isVerified: false,
            isAvailable: true
        });
        
        res.status(201).json({
            success: true,
            message: 'Business listed successfully! Awaiting verification.',
            professional
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;