# 🌐 Service Sphere - Local Services Finder

Service Sphere is a full-stack web application that connects customers with trusted local service professionals. Users can search for services like electricians, plumbers, doctors, tutors, and more, based on their location.

![Service Sphere Banner](https://img.shields.io/badge/Service-Sphere-00d4ff?style=for-the-badge&logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Node Version](https://img.shields.io/badge/node-18.x-green?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-✓-green?style=flat-square)

---

## ✨ Features

### 👤 User Features
- **User Authentication** - Sign up / Login with JWT authentication
- **Location-based Search** - Select your city to see local professionals
- **Service Categories** - Browse 36+ service categories
- **Professional Listings** - View verified professionals with experience, ratings, and contact info
- **Search Functionality** - Search for any service quickly

### 👨‍💼 Professional Features
- **Business Registration** - List your business with details
- **Profile Management** - Manage your service listings

### 🔧 Technical Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme UI** - Modern dark interface with gradient accents
- **JWT Authentication** - Secure token-based authentication
- **RESTful API** - Well-structured backend API

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript (ES6+) | Interactivity |
| Font Awesome | Icons |
| Google Fonts | Typography |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JSON Web Token | Authentication |
| Bcrypt.js | Password hashing |

---

## 📁 Project Structure
Service-Sphere/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── middleware/
│ │ └── auth.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Service.js
│ │ ├── Professional.js
│ │ └── Booking.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── services.js
│ │ ├── professionals.js
│ │ └── bookings.js
│ ├── .env
│ ├── package.json
│ ├── server.js
│ └── seed.js
│
├── frontend/
│ ├── css/
│ │ └── styles.css
│ ├── images/
│ ├── pages/
│ │ ├── index.html
│ │ ├── services.html
│ │ ├── about.html
│ │ ├── contact.html
│ │ ├── results.html
│ │ └── register-business.html
│ └── js/
│ └── script.js
│
└── README.md


---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Clone the Repository
```bash
git clone https://github.com/yourusername/Service-Sphere.git
cd Service-Sphere

cd backend
npm install
```
### 👥 Team

P. Bala Srivatsa	CEO & Founder
Sk. Zaafira Yumn	Head of Operations
M. Narendra Kumar	Technology Director

THANK YOU...
