const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const auth = require('./routes/auth');
const services = require('./routes/services');
const professionals = require('./routes/professionals');
const bookings = require('./routes/bookings');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', auth);
app.use('/api/services', services);
app.use('/api/professionals', professionals);
app.use('/api/bookings', bookings);

app.get('/', (req, res) => {
    res.json({ message: 'Service Sphere API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
});