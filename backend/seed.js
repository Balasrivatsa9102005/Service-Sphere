const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');
const Professional = require('./models/Professional');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

// Services list (36 services)
const services = [
    // Home Services
    { name: 'Electrician', category: 'Home Services', description: 'Electrical repairs, installations, and maintenance' },
    { name: 'Plumber', category: 'Home Services', description: 'Plumbing repairs, pipe fitting, and installations' },
    { name: 'Carpenter', category: 'Home Services', description: 'Woodwork, furniture repair, and custom carpentry' },
    { name: 'HVAC Technician', category: 'Home Services', description: 'AC, heater, and ventilation system repair' },
    { name: 'Painter', category: 'Home Services', description: 'Interior and exterior painting services' },
    { name: 'Home Cleaner', category: 'Home Services', description: 'House cleaning, deep cleaning, and sanitization' },
    // Health & Wellness
    { name: 'Doctor', category: 'Health & Wellness', description: 'General physicians for primary healthcare' },
    { name: 'Dentist', category: 'Health & Wellness', description: 'Dental care, cleaning, and treatments' },
    { name: 'Physiotherapist', category: 'Health & Wellness', description: 'Physical therapy and rehabilitation' },
    { name: 'Massage Therapist', category: 'Health & Wellness', description: 'Therapeutic massage and relaxation' },
    { name: 'Nutritionist', category: 'Health & Wellness', description: 'Diet planning and nutrition advice' },
    { name: 'Yoga Instructor', category: 'Health & Wellness', description: 'Yoga classes and wellness coaching' },
    // Education & Tutoring
    { name: 'Math Tutor', category: 'Education & Tutoring', description: 'Mathematics coaching for all levels' },
    { name: 'Science Tutor', category: 'Education & Tutoring', description: 'Physics, Chemistry, Biology tutoring' },
    { name: 'Language Teacher', category: 'Education & Tutoring', description: 'English, Hindi, Telugu language classes' },
    { name: 'Music Instructor', category: 'Education & Tutoring', description: 'Vocal and instrumental music lessons' },
    { name: 'Test Prep', category: 'Education & Tutoring', description: 'Competitive exam preparation coaching' },
    { name: 'Coding Tutor', category: 'Education & Tutoring', description: 'Programming and web development classes' },
    // Automotive
    { name: 'Mechanic', category: 'Automotive', description: 'Car and bike repair, maintenance services' },
    { name: 'Car Wash', category: 'Automotive', description: 'Car cleaning and detailing services' },
    { name: 'Auto Electrician', category: 'Automotive', description: 'Vehicle electrical systems repair' },
    { name: 'Tire Services', category: 'Automotive', description: 'Tire repair, replacement, and alignment' },
    { name: 'Detailing', category: 'Automotive', description: 'Premium car detailing and polishing' },
    { name: 'Towing Services', category: 'Automotive', description: '24/7 vehicle towing and roadside assistance' },
    // Professional Services
    { name: 'Lawyer', category: 'Professional Services', description: 'Legal advice and representation' },
    { name: 'Accountant', category: 'Professional Services', description: 'Tax filing, accounting, and auditing' },
    { name: 'Financial Advisor', category: 'Professional Services', description: 'Investment and financial planning' },
    { name: 'Real Estate Agent', category: 'Professional Services', description: 'Property buying, selling, and rental' },
    { name: 'Insurance Broker', category: 'Professional Services', description: 'Insurance policy advice and sales' },
    { name: 'Notary', category: 'Professional Services', description: 'Document notarization and certification' },
    // Beauty & Personal Care
    { name: 'Hair Stylist', category: 'Beauty & Personal Care', description: 'Haircuts, styling, and treatments' },
    { name: 'Nail Technician', category: 'Beauty & Personal Care', description: 'Manicure, pedicure, and nail art' },
    { name: 'Makeup Artist', category: 'Beauty & Personal Care', description: 'Professional makeup for events' },
    { name: 'Barber', category: 'Beauty & Personal Care', description: 'Men\'s haircuts and grooming' },
    { name: 'Esthetician', category: 'Beauty & Personal Care', description: 'Skincare and facial treatments' },
    { name: 'Spa Therapist', category: 'Beauty & Personal Care', description: 'Spa treatments and body therapies' }
];

const cities = ['Vijayawada', 'Guntur', 'Tenali', 'Mangalgiri', 'Amaravati'];

// Generate random phone number
const randomPhone = () => `9${Math.floor(Math.random() * 900000000) + 100000000}`;

// Get names for service and city
const getNames = (service, city, index) => {
    const prefixes = {
        'Vijayawada': ['Rajesh', 'Suresh', 'Venkatesh', 'Naveen', 'Prakash'],
        'Guntur': ['Srinivas', 'Ramana', 'Chandra', 'Koteswara', 'Malleswara'],
        'Tenali': ['Veerabhadra', 'Surya', 'Prasad', 'Harish', 'Madhav'],
        'Mangalgiri': ['Lakshmi', 'Siva', 'Krishna', 'Raju', 'Mani'],
        'Amaravati': ['Buddha', 'Dharma', 'Ananda', 'Santhi', 'Sree']
    };
    
    const surnames = {
        'Doctor': ['Dr. Priya', 'Dr. Anjali', 'Dr. Vikram', 'Dr. Meera', 'Dr. Rajiv'],
        'Photographer': ['Arun', 'Praveen', 'Sathish', 'Vignesh', 'Karthik'],
        'Electrician': ['Kumar', 'Reddy', 'Rao', 'Babu', 'Sharma'],
        'Plumber': ['Verma', 'Lal', 'Shankar', 'Patel', 'Choudhary'],
        'default': ['Kumar', 'Reddy', 'Rao', 'Naidu', 'Sharma']
    };
    
    const prefix = prefixes[city][index % 5];
    let surname = surnames[service] || surnames.default;
    let fullName = `${prefix} ${surname[index % 5]}`;
    
    // Add city code
    const cityCode = city.slice(0, 3).toUpperCase();
    return fullName;
};

async function seedDatabase() {
    try {
        console.log('🗑️ Clearing existing data...');
        await Professional.deleteMany({});
        await Service.deleteMany({});
        await User.deleteMany({});
        
        console.log('📝 Creating services...');
        const createdServices = await Service.insertMany(services);
        
        const serviceMap = {};
        createdServices.forEach(s => { serviceMap[s.name] = s._id; });
        
        console.log(`✅ Created ${createdServices.length} services\n`);
        
        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@servicesphere.com',
            password: await bcrypt.hash('admin123', 10),
            phone: '9999999999',
            role: 'admin'
        });
        
        console.log('👥 Creating professionals...\n');
        
        const allProfessionals = [];
        let count = 0;
        
        for (const city of cities) {
            console.log(`📍 ${city}:`);
            
            for (const service of services) {
                const serviceId = serviceMap[service.name];
                
                for (let i = 0; i < 5; i++) {
                    const name = getNames(service.name, city, i);
                    const experience = Math.floor(Math.random() * 20) + 2;
                    const phone = randomPhone();
                    
                    allProfessionals.push({
                        userId: admin._id,
                        businessName: name,
                        services: [serviceId],
                        description: `Experienced ${service.name.toLowerCase()} serving ${city} for ${experience}+ years. Quality service guaranteed.`,
                        experience: experience,
                        city: city,
                        phone: phone,
                        hourlyRate: 300 + (experience * 20),
                        rating: 4 + Math.random(),
                        totalReviews: Math.floor(Math.random() * 100) + 10,
                        isVerified: true,
                        isAvailable: true
                    });
                }
                console.log(`   ✅ ${service.name}: 5 professionals`);
                count += 5;
            }
            console.log('');
        }
        
        await Professional.insertMany(allProfessionals);
        
        console.log('✅ Database seeded successfully!');
        console.log(`\n📊 Summary: ${count} professionals (${cities.length} cities × ${services.length} services × 5)`);
        console.log('\n🎉 Start server: npm run dev');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedDatabase();