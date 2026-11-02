# TRD - Technical Requirements Document

**Project:** GCTU StudentHostels
**Version:** 1.0
**Date:** October 2026
**Status:** Active Development
**Author:** Development Team
**Related:** PRD v1.0

---

## 1. System Overview

GCTU StudentHostels is a web-based **central hub for all hostel platforms** built with a decoupled architecture consisting of a vanilla JavaScript frontend and a Node.js/Express backend with MongoDB database. The system aggregates hostel listings from various hostel providers into one unified directory, implements session-based authentication, email verification, and serves both public and authenticated user interfaces.

## 2. Technology Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | Node.js | 20.18.0 | Server-side JavaScript runtime |
| **Framework** | Express.js | 5.2.1 | Web application framework |
| **Database** | MongoDB Atlas | Cloud | NoSQL document database |
| **ODM** | Mongoose | 9.6.2 | MongoDB object modeling |
| **Session Store** | connect-mongo | 5.1.0 | MongoDB session storage |
| **Authentication** | express-session | 1.19.0 | Session-based auth |
| **Password Hashing** | bcryptjs | 3.0.3 | Secure password hashing |
| **Email Service** | @getbrevo/brevo | 5.0.4 | Transactional emails |
| **Security** | helmet, express-rate-limit, express-mongo-sanitize, hpp | Various | Security middleware |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | ES6+ | Client-side interface |
| **Deployment** | Render (Backend), Netlify (Frontend) | - | Production hosting |

## 3. Architecture Design

### 3.1 System Architecture
```
┌─────────────────┐    HTTPS    ┌─────────────────┐    MongoDB    ┌─────────────────┐
│   Netlify       │ ──────────> │   Render        │ ────────────> │   MongoDB Atlas │
│   (Frontend)    │             │   (Backend API) │               │   (Database)    │
└─────────────────┘             └─────────────────┘               └─────────────────┘
        │                              │
        │                              │
        └────────── CORS ─────────────┘
                    (credentials: true)
```

### 3.2 Backend Architecture
The backend follows MVC-like pattern with clear separation of concerns:

```
gctu-hostels-backend/
├── config/          # Database, email configuration
├── middleware/      # Auth, validation, error handling (to be expanded)
├── models/          # Mongoose schemas (User, OTP, Hostel - planned)
├── routes/          # API route handlers
├── utils/           # Helper functions (password validation)
├── server.js        # Application entry point
└── package.json     # Dependencies and scripts
```

### 3.3 Frontend Architecture
```
gctu-hostels-frontend/src/
├── index.html           # Public landing page
├── landingpage.*        # Landing page assets
├── signup.html/js       # Registration flow
├── login.html/js        # Authentication
├── forgot-password.*    # Password reset flow
├── verify-reset-otp.*   # OTP verification
├── set-new-password.*   # New password setup
├── homepage.html        # Authenticated student home
├── dashboard.html       # Student dashboard
└── assets/              # Images, icons (if any)
```

## 4. Database Design

### 4.1 User Model
```javascript
{
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }, // planned
  createdAt: { type: Date, default: Date.now }
}
```

**Methods:**
- `comparePassword(candidatePassword)`: bcrypt comparison
- Pre-save hook for password hashing

### 4.2 OTP Model
```javascript
{
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'reset'], required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  used: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 }, // planned
  createdAt: { type: Date, default: Date.now }
}
```

### 4.3 Hostel Model (Planned)
```javascript
{
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  priceLabel: { type: String, default: 'per semester' },
  amenities: [{ type: String }],
  availability: { type: String, enum: ['available', 'limited', 'full'], default: 'available' },
  category: { type: String, enum: ['private', 'shared', 'mixed'] },
  distance: { type: String }, // e.g., "5 mins walk"
  images: [{ type: String }], // URLs
  officialUrl: { type: String, required: true },
  contact: {
    phone: String,
    email: String,
    whatsapp: String
  },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 4.4 Booking Model (Planned)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  status: { type: String, enum: ['pending', 'contacted', 'confirmed', 'cancelled'], default: 'pending' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 4.5 Favorite Model (Planned)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  createdAt: { type: Date, default: Date.now }
}
```

**Compound Index:** `{ userId: 1, hostelId: 1 }` for uniqueness

## 5. API Design

### 5.1 Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://gctu-hostels-backend.onrender.com/api`

### 5.2 Authentication Endpoints

| Method | Endpoint | Auth Required | Rate Limited | Description |
|---|---|---|---|---|
| POST | `/api/send-otp` | No | Yes (10/15min) | Send OTP for registration |
| POST | `/api/verify-otp` | No | Yes (10/15min) | Verify OTP and create account |
| POST | `/api/signup` | No | Yes (10/15min) | **[TO REMOVE]** Bypass route |
| POST | `/api/login` | No | Yes (10/15min) | User login with session creation |
| POST | `/api/logout` | Yes | No | Destroy session |
| GET | `/api/me` | Yes | No | Get current authenticated user |
| POST | `/api/forgot-password` | No | Yes (10/15min) | Send password reset OTP |
| POST | `/api/verify-reset-otp` | No | Yes (10/15min) | Verify reset OTP |
| POST | `/api/reset-password` | No | Yes (10/15min) | Reset password (needs verification proof) |

### 5.3 Hostel Endpoints (Planned)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| GET | `/api/hostels` | No | - | List all published hostels with filters/pagination |
| GET | `/api/hostels/:id` | No | - | Get single hostel details |
| POST | `/api/hostels` | Yes | Admin | Create new hostel listing |
| PUT | `/api/hostels/:id` | Yes | Admin | Update hostel listing |
| DELETE | `/api/hostels/:id` | Yes | Admin | Delete hostel listing |

### 5.4 User Activity and Dashboard Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/favorites` | Yes | Get the authenticated user's favorite hostels |
| PUT | `/api/favorites/:hostelId` | Yes | Save a hostel to favorites |
| DELETE | `/api/favorites/:hostelId` | Yes | Remove a hostel from favorites |
| POST | `/api/activity` | Yes | Record a supported user activity |
| GET | `/api/dashboard` | Yes | Get saved hostels, recent activity, and dashboard counts |
| GET | `/api/bookings` | Yes | Get user's booking requests (planned) |
| POST | `/api/bookings` | Yes | Create booking request (planned) |

### 5.5 Utility Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/test` | No | Health check endpoint |
| GET | `/sitemap.xml` | No | SEO sitemap |

## 6. Security Implementation

### 6.1 Current Security Measures
| Measure | Implementation | Status |
|---|---|---|
| **Security Headers** | Helmet.js | Implemented |
| **CORS** | Whitelist-based with credentials | Implemented |
| **Rate Limiting** | Global (100/15min) + Auth (10/15min) | Implemented |
| **Input Sanitization** | express-mongo-sanitize | Implemented |
| **Parameter Pollution** | hpp | Implemented |
| **Body Size Limit** | 10kb for JSON/urlencoded | Implemented |
| **Trust Proxy** | Enabled for Render | Implemented |
| **Secure Cookies** | httpOnly, secure in prod, sameSite: none in prod | Implemented |
| **Password Hashing** | bcryptjs with pre-save hook | Implemented |
| **Session Security** | Server-side sessions in MongoDB | Implemented |

### 6.2 Security Gaps (To Address)
| Gap | Risk | Mitigation Plan |
|---|---|---|
| **Password reset bypass** | Account takeover | Require server-side verified reset token/session flag |
| **Plaintext passwords in session** | Credential exposure | Store only email/verification state, hash before temp storage |
| **OTP bypass route exists** | Account creation without verification | Remove `/api/signup` endpoint |
| **OTP in plaintext** | Interception risk | Hash OTPs before storage, add attempt counter |
| **Debug logging** | Information leakage | Remove session debug middleware |
| **Login user enumeration** | Privacy leak | Use generic "Invalid credentials" message |
| **No input validation** | Injection/XSS | Add express-validator or custom validation middleware |

## 7. Session Management

### 7.1 Session Configuration
```javascript
{
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}
```

### 7.2 Session Usage
- **Registration**: Store `signupData` (temp) during OTP flow
- **Authentication**: Store `userId` after successful login
- **Password Reset**: Store `resetEmail` during reset flow (needs hardening)

## 8. Email System

### 8.1 Email Configuration
- **Provider**: Brevo (Sendinblue) via `@getbrevo/brevo` SDK
- **Templates**: HTML branded templates for verification and reset
- **Sender**: Configured via environment variables

### 8.1 Email Types
| Type | Purpose | Template Location |
|---|---|---|
| **Signup OTP** | Email verification during registration | `config/email.js` |
| **Password Reset OTP** | Password reset verification | `config/email.js` |

## 9. Environment Variables

### 9.1 Required Variables
```env
# Database
MONGO_URI=mongodb+srv://...

# Session
SESSION_SECRET=your-secret-key

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key
SENDER_EMAIL=your-sender-email
SENDER_NAME=GCTU StudentHostels

# Environment
NODE_ENV=development|production
PORT=5000
```

### 9.2 Frontend Configuration
Frontend uses hardcoded API URL to `https://gctu-hostels-backend.onrender.com/api` - needs refactoring to environment-based configuration.

## 10. Deployment

### 10.1 Backend (Render)
- **Build Command**: `npm run build` (`npm install --legacy-peer-deps`)
- **Start Command**: `npm start` (`node server.js`)
- **Node Version**: 20.18.0 (pinned)
- **Environment**: Production with secure cookies
- **Auto-Deploy**: From main branch

### 10.2 Frontend (Netlify)
- **Publish Directory**: `gctu-hostels-frontend/src`
- **Build Command**: None (static site)
- **Redirects**: `/sitemap.xml` redirected to backend
- **Auto-Deploy**: From main branch

## 11. Performance Considerations
- **Database**: MongoDB Atlas with connection pooling via Mongoose
- **Sessions**: Stored in MongoDB (persistent across restarts)
- **Rate Limiting**: Prevents abuse and brute force
- **Body Limits**: Prevents large payload attacks
- **Static Assets**: Served directly by Netlify CDN

## 12. Testing Strategy (Planned)
| Test Type | Scope | Tool |
|---|---|---|
| **Unit Tests** | Models, utils, validators | Jest/Mocha |
| **Integration Tests** | API endpoints (auth, hostels) | Supertest |
| **E2E Tests** | Critical user flows | Playwright/Cypress |
| **Security Tests** | Auth flows, input validation | Manual + automated |

## 13. Monitoring and Logging
- **Current**: Console logging for errors and debug info
- **Planned**: Structured logging (Winston/Pino), uptime monitoring, error tracking

## 14. Technical Debt Priorities
1. **Critical**: Fix password reset security bypass
2. **Critical**: Remove OTP bypass route and secure session storage
3. **High**: Implement Hostel model and API (replace hardcoded data)
4. **High**: Add auth middleware and role-based access
5. **High**: Centralize error handling and validation
6. **Medium**: Environment-based frontend API config
7. **Medium**: Add comprehensive logging

## 15. Compliance and Standards
- **Code Style**: CommonJS modules, ES6+ JavaScript
- **Security**: OWASP Top 10 awareness in implementation
- **API Design**: RESTful conventions where applicable
- **Database**: Mongoose schemas with validation
- **Git**: Feature branches, PR reviews via CodeRabbit
