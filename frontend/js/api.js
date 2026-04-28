// frontend/js/api.js - API Service for Service Sphere

const API_URL = 'http://localhost:5000/api';

// Store token in localStorage
let authToken = localStorage.getItem('token');

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (requiresAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const options = {
        method,
        headers,
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== AUTH SERVICES =====
const authService = {
    // Register user
    async register(name, email, password, phone) {
        const result = await apiCall('/auth/register', 'POST', { name, email, password, phone });
        if (result.token) {
            authToken = result.token;
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result;
    },
    
    // Login user
    async login(email, password) {
        const result = await apiCall('/auth/login', 'POST', { email, password });
        if (result.token) {
            authToken = result.token;
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result;
    },
    
    // Logout user
    logout() {
        authToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    // Get current user
    async getCurrentUser() {
        return await apiCall('/auth/me', 'GET', null, true);
    },
    
    // Check if user is logged in
    isLoggedIn() {
        return !!authToken;
    },
    
    // Get current user from localStorage
    getCurrentUserFromStorage() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// ===== SERVICE SERVICES =====
const serviceService = {
    // Get all services
    async getAllServices(category = null, search = null) {
        let url = '/services';
        const params = [];
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (params.length) url += `?${params.join('&')}`;
        return await apiCall(url);
    },
    
    // Get single service
    async getServiceById(id) {
        return await apiCall(`/services/${id}`);
    },
    
    // Get all categories with counts
    async getCategories() {
        return await apiCall('/services/categories');
    }
};

// ===== PROFESSIONAL SERVICES =====
const professionalService = {
    // Get all professionals
    async getAllProfessionals(service = null, city = null) {
        let url = '/professionals';
        const params = [];
        if (service) params.push(`service=${encodeURIComponent(service)}`);
        if (city) params.push(`city=${encodeURIComponent(city)}`);
        if (params.length) url += `?${params.join('&')}`;
        return await apiCall(url);
    },
    
    // Get professionals near a location
    async getNearbyProfessionals(lat, lng, radius = 10) {
        return await apiCall(`/professionals/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    },
    
    // Get single professional
    async getProfessionalById(id) {
        return await apiCall(`/professionals/${id}`);
    }
};

// ===== BOOKING SERVICES =====
const bookingService = {
    // Create a booking
    async createBooking(bookingData) {
        return await apiCall('/bookings', 'POST', bookingData, true);
    },
    
    // Get user's bookings
    async getMyBookings() {
        return await apiCall('/bookings/my-bookings', 'GET', null, true);
    }
};

// Export all services
window.ServiceSphereAPI = {
    auth: authService,
    services: serviceService,
    professionals: professionalService,
    bookings: bookingService,
    apiCall
};