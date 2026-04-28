const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const Professional = require('./models/Professional');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

async function fixMissingData() {
    try {
        console.log('🔍 Checking for missing services...\n');
        
        // Get all existing services
        const existingServices = await Service.find();
        const existingServiceNames = existingServices.map(s => s.name);
        
        console.log('Existing services:', existingServiceNames.length);
        
        // Check if Doctor (GP) exists - note the exact name
        let doctorService = await Service.findOne({ name: 'Doctor (GP)' });
        if (!doctorService) {
            console.log('❌ Doctor (GP) not found! Creating...');
            doctorService = await Service.create({
                name: 'Doctor (GP)',
                category: 'Health & Wellness',
                description: 'General physicians for primary healthcare'
            });
            console.log('✅ Created Doctor (GP) service');
        } else {
            console.log('✅ Doctor (GP) already exists');
        }
        
        // Check if Photographer exists
        let photographerService = await Service.findOne({ name: 'Photographer' });
        if (!photographerService) {
            console.log('❌ Photographer not found! Creating...');
            photographerService = await Service.create({
                name: 'Photographer',
                category: 'Professional Services',
                description: 'Professional photography for events and occasions'
            });
            console.log('✅ Created Photographer service');
        } else {
            console.log('✅ Photographer already exists');
        }
        
        // Get admin user
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('❌ No admin user found. Creating...');
            const bcrypt = require('bcryptjs');
            const newAdmin = await User.create({
                name: 'Admin User',
                email: 'admin@servicesphere.com',
                password: await bcrypt.hash('admin123', 10),
                phone: '9999999999',
                role: 'admin'
            });
            console.log('✅ Created admin user');
        }
        
        const adminUser = await User.findOne({ role: 'admin' });
        
        const cities = ['Vijayawada', 'Guntur', 'Tenali', 'Mangalgiri', 'Amaravati'];
        
        console.log('\n📝 Adding professionals for each city...\n');
        
        // Add doctors for each city
        for (const city of cities) {
            const existingDoctors = await Professional.find({ 
                city: city, 
                services: doctorService._id 
            });
            
            if (existingDoctors.length === 0) {
                const cityCode = city.slice(0, 3).toUpperCase();
                const doctors = [
                    { name: `Dr. Priya Sharma (${cityCode})`, phone: `99${Math.floor(Math.random()*90000000)+10000000}`, exp: 12 },
                    { name: `Dr. Anjali Reddy (${cityCode})`, phone: `98${Math.floor(Math.random()*90000000)+10000000}`, exp: 8 },
                    { name: `Dr. Vikram Singh (${cityCode})`, phone: `97${Math.floor(Math.random()*90000000)+10000000}`, exp: 15 },
                    { name: `Dr. Meera Nair (${cityCode})`, phone: `96${Math.floor(Math.random()*90000000)+10000000}`, exp: 10 },
                    { name: `Dr. Rajiv Malhotra (${cityCode})`, phone: `95${Math.floor(Math.random()*90000000)+10000000}`, exp: 20 }
                ];
                
                for (const doc of doctors) {
                    await Professional.create({
                        userId: adminUser._id,
                        businessName: doc.name,
                        services: [doctorService._id],
                        description: `Experienced ${doctorService.name} serving ${city} for ${doc.exp}+ years. Specialized in general medicine and family care.`,
                        experience: doc.exp,
                        city: city,
                        phone: doc.phone,
                        hourlyRate: 500 + (doc.exp * 20),
                        rating: 4.5,
                        totalReviews: Math.floor(Math.random() * 100) + 20,
                        isVerified: true,
                        isAvailable: true
                    });
                }
                console.log(`   ✅ Added 5 doctors for ${city}`);
            } else {
                console.log(`   ✅ Doctors already exist for ${city} (${existingDoctors.length})`);
            }
        }
        
        // Add photographers for each city
        for (const city of cities) {
            const existingPhotographers = await Professional.find({ 
                city: city, 
                services: photographerService._id 
            });
            
            if (existingPhotographers.length === 0) {
                const cityCode = city.slice(0, 3).toUpperCase();
                const photographers = [
                    { name: `Arun Kumar (${cityCode})`, phone: `94${Math.floor(Math.random()*90000000)+10000000}`, exp: 8 },
                    { name: `Praveen (${cityCode})`, phone: `93${Math.floor(Math.random()*90000000)+10000000}`, exp: 5 },
                    { name: `Sathish (${cityCode})`, phone: `92${Math.floor(Math.random()*90000000)+10000000}`, exp: 12 },
                    { name: `Vignesh (${cityCode})`, phone: `91${Math.floor(Math.random()*90000000)+10000000}`, exp: 6 },
                    { name: `Karthik (${cityCode})`, phone: `90${Math.floor(Math.random()*90000000)+10000000}`, exp: 10 }
                ];
                
                for (const photog of photographers) {
                    await Professional.create({
                        userId: adminUser._id,
                        businessName: photog.name,
                        services: [photographerService._id],
                        description: `Professional ${photographerService.name} serving ${city} for ${photog.exp}+ years. Specializing in weddings, events, and portraits.`,
                        experience: photog.exp,
                        city: city,
                        phone: photog.phone,
                        hourlyRate: 800 + (photog.exp * 30),
                        rating: 4.6,
                        totalReviews: Math.floor(Math.random() * 80) + 15,
                        isVerified: true,
                        isAvailable: true
                    });
                }
                console.log(`   ✅ Added 5 photographers for ${city}`);
            } else {
                console.log(`   ✅ Photographers already exist for ${city} (${existingPhotographers.length})`);
            }
        }
        
        console.log('\n📊 Summary:');
        const totalDoctors = await Professional.countDocuments({ services: doctorService._id });
        const totalPhotographers = await Professional.countDocuments({ services: photographerService._id });
        console.log(`   - Total Doctors: ${totalDoctors}`);
        console.log(`   - Total Photographers: ${totalPhotographers}`);
        console.log(`   - Cities: ${cities.length}`);
        
        console.log('\n🎉 Data fix completed!');
        
        mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error);
        mongoose.disconnect();
    }
}

fixMissingData();