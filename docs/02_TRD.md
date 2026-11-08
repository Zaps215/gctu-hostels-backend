# TRD - Technical Requirements Document

**Project:** GCTU StudentHostels
**Version:** 1.1
**Date:** November 2026
**Status:** Active Development — source-state snapshot
**Author:** Development Team
**Related:** PRD v1.0

---

## 1. System Overview

GCTU StudentHostels is a web-based **central hub for all hostel platforms** built with a decoupled architecture consisting of a vanilla JavaScript frontend and a Node.js/Express backend with MongoDB database. The system aggregates hostel listings from various hostel providers into one unified directory, implements session-based authentication, email verification, and serves both public and authenticated user interfaces.

**Implementation note:** This reflects the current local source. The worktree contains uncommitted changes; production deployment and live database behavior have not been verified.

## 2. Technology Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | Node.js | 20.18.0 | Server-side JavaScript runtime |
| **Framework** | Express.js | 5.x | Web application framework |
| **Database** | MongoDB Atlas | Cloud | NoSQL document database |
| **ODM** | Mongoose | 9.x | MongoDB object modeling |
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
├── middleware/      # Authentication, admin-secret, and trusted-origin checks
├── models/          # User, OTP, Hostel, Favorite, and Activity schemas
├── routes/          # Authentication, hostel, user-data, and sitemap routes
├── utils/           # Password validation
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
├── hostel-details.html  # Hostel details, favorites, and manager contact
├── add-hostel.html      # Manager listing creation
├── homepage.html        # Authenticated student home
├── dashboard.html       # Student dashboard
└── utils/activityLogger.js
```

## 4. Database Design

### 4.1 User Model
```javascript
{
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'manager'], default: 'student' },
  indexNumber: { type: String, trim: true },
  hostelName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

**Methods:**
- `comparePassword(candidatePassword)`: bcrypt comparison
- Pre-save hook for password hashing. Registration and password reset apply stronger password rules; the schema minimum itself is six characters.

### 4.2 OTP Model
```javascript
{
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  signupData: { fullName: String, username: String, password: String } // optional legacy field
}
```

OTP records are replaced by email when new codes are issued and checked against expiration in the routes. Codes are currently stored in plaintext; hashing, per-code attempt limits, and TTL cleanup are not implemented. Registration data is held in the session, not this model.

### 4.3 Hostel Model
```javascript
{
  name: { type: String, required: true, trim: true },
  university: { type: String, enum: ['GCTU', 'UG', 'UPSA', 'Other'], default: 'GCTU' },
  ownershipType: { type: String, enum: ['Private Hostel', 'University Hostel', 'Private Apartment'] },
  genderCategory: { type: String, enum: ['Male', 'Female', 'Mixed'] },
  location: { type: String, required: true, default: 'Tesano, Accra' },
  distanceFromCampus: String,
  price: { type: Number, required: true },
  description: String,
  paymentTerm: { type: String, enum: ['per semester', 'per academic year', 'per month'] },
  roomTypesAvailable: [String],
  coverImage: { type: String, required: true },
  amenities: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  contactPhone: String,
  officialUrl: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timestamps: true
}
```

### 4.4 Favorite Model
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  timestamps: true
}
```

**Compound unique index:** `{ user: 1, hostel: 1 }`.

### 4.5 Activity Model
Records `viewed_hostel`, `searched_hostels`, `opened_contact`, `saved_hostel`, `removed_favorite`, and `login`. A hostel view is upserted per user and hostel; dashboard explored-hostel totals are deduplicated by normalized hostel name.

There is no booking or user-submitted review model.

## 5. API Design

### 5.1 Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://gctu-hostels-backend.onrender.com/api`

### 5.2 Authentication Endpoints

| Method | Endpoint | Auth Required | Rate Limited | Description |
|---|---|---|---|---|
| POST | `/api/send-otp` | No | Yes (10/15min) | Send OTP for registration |
| POST | `/api/verify-otp` | No | Yes (10/15min) | Verify OTP and create account |
| POST | `/api/signup` | No | Yes (10/15min) | Disabled; returns 403 |
| POST | `/api/login` | No | Yes (10/15min) | User login with session creation |
| POST | `/api/logout` | Session optional | Global limit | Destroy session and clear cookie |
| GET | `/api/me` | Yes | No | Get current authenticated user |
| POST | `/api/forgot-password` | No | Yes (10/15min) | Send password reset OTP |
| POST | `/api/verify-reset-otp` | No | Yes (10/15min) | Verify reset OTP |
| POST | `/api/reset-password` | Verified reset session | Yes (10/15min) | Reset password within the 10-minute verification window |
| POST | `/api/register-manager` | `x-admin-secret` header | Global limit | Create a verified manager account; origin-less server requests are allowed by the trusted-origin middleware |

Student signup accepts a numeric GCTU index number. Manager accounts are not self-registered; keep `ADMIN_SECRET` only in the backend environment or a trusted administrative environment.

### 5.3 Hostel Endpoints

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| GET | `/api/hostels` | No | - | List hostels; supports university, gender, maxPrice, search, and sort query parameters |
| GET | `/api/hostels/:id` | No | - | Get single hostel details |
| POST | `/api/hostels` | Yes | Manager | Create a hostel listing |

Listing update/delete, pagination, and moderation routes are not implemented.

### 5.4 User Activity and Dashboard Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/favorites` | Yes | Get the authenticated user's favorite hostels |
| PUT | `/api/favorites/:hostelId` | Yes | Save a hostel to favorites |
| DELETE | `/api/favorites/:hostelId` | Yes | Remove a hostel from favorites |
| POST | `/api/activity` | Yes | Record a supported user activity |
| GET | `/api/dashboard` | Yes | Get saved hostels, recent activity, and dashboard counts |

Booking endpoints are not implemented.

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
| **CORS** | Explicit origin allowlist with credentials; allows `x-admin-secret` | Implemented in source |
| **Trusted Origin** | Rejects mutation requests outside allowlist; exempts only origin-less `/api/register-manager`, still guarded by admin secret | Implemented in source |
| **Rate Limiting** | Global (100/15min) + Auth (10/15min) | Implemented |
| **Input Sanitization** | express-mongo-sanitize | Implemented |
| **Parameter Pollution** | hpp | Implemented |
| **Body Size Limit** | 10kb for JSON/urlencoded | Implemented |
| **Trust Proxy** | Enabled for Render | Implemented |
| **Secure Cookies** | httpOnly, secure in production, sameSite: none in production | Implemented |
| **Password Hashing** | bcryptjs with pre-save hook; registration stores a bcrypt hash in its temporary session | Implemented |
| **Session Security** | Server-side sessions in MongoDB | Implemented |
| **Role Enforcement** | Student/manager login separation; manager-only listing creation; separate admin-secret manager provisioning | Implemented in source |

### 6.2 Remaining Security and Reliability Work
| Gap | Risk | Mitigation Plan |
|---|---|---|
| **OTP stored in plaintext and unlimited verification attempts per code** | OTP exposure or guessing | Hash OTP values and enforce a small attempt limit |
| **Validation coverage is incomplete** | Invalid or abusive values may reach persistence | Add route-level schemas for auth and hostel payloads; retain model validation |
| **Authentication and reset routes are not integration-tested** | Regressions may escape syntax checks | Add automated tests for registration, role checks, reset, favorites, and dashboard |
| **Deployment configuration is unverified for current changes** | Production behavior can diverge from local source | Verify allowlists, secrets, cookies, mail, database, and E2E behavior after deployment |

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
- **Registration**: Store name, username, email, role, index number, timestamp, and bcrypt password hash temporarily during OTP flow
- **Authentication**: Store `userId` and `userRole` after successful login
- **Password Reset**: Store verified `resetEmail` and `resetVerifiedAt`; reset requires a matching email and unexpired 10-minute window

## 8. Email System

### 8.1 Email Configuration
- **Provider**: Brevo (Sendinblue) via `@getbrevo/brevo` SDK
- **Templates**: HTML branded templates for verification and reset
- **Sender**: `GCTU StudentHostels <gctustudenthostels@gmail.com>` in `config/email.js`

### 8.2 Email Types
| Type | Purpose | Template Location |
|---|---|---|
| **Signup OTP** | Email verification during registration | `routes/authRoutes.js` |
| **Password Reset OTP** | Password reset verification | `routes/authRoutes.js` |

## 9. Environment Variables

### 9.1 Required Variables
```env
# Database
MONGO_URI=mongodb+srv://...

# Session
SESSION_SECRET=your-secret-key

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key
ADMIN_SECRET=long-random-manager-provisioning-secret

# Environment
NODE_ENV=development|production
PORT=5000
```

### 9.2 Frontend Configuration
`gctu-hostels-frontend/src/config.js` selects `http://<current-local-hostname>:5000` for localhost/127.0.0.1 and the Render API URL otherwise. The frontend is static HTML/CSS/JavaScript with no build-time environment injection.

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

## 12. Testing Strategy
No automated test runner or test suite is configured. Current verification uses JavaScript syntax checks, HTML reference checks, and focused/manual browser or API checks; production E2E behavior remains to be verified.

| Test Type | Scope | Tool |
|---|---|---|
| **Unit Tests** | Models, utils, validators | Planned |
| **Integration Tests** | API endpoints (auth, hostels) | Planned |
| **E2E Tests** | Critical user flows | Planned |
| **Security Tests** | Auth flows, input validation | Manual checks; automate |

## 13. Monitoring and Logging
- **Current**: Console logging for errors and debug info
- **Planned**: Structured logging (Winston/Pino), uptime monitoring, error tracking

## 14. Technical Debt Priorities
1. **High**: Hash OTPs and limit verification attempts per code
2. **High**: Add automated auth, authorization, hostel, favorite, and dashboard tests
3. **High**: Add comprehensive validation for incoming auth and listing payloads
4. **High**: Verify deployed CORS/origin allowlist, secrets, email, sessions, and end-to-end flows
5. **Medium**: Add listing edit/delete and admin moderation workflows
6. **Medium**: Implement booking requests only after defining status ownership and manager workflows

## 15. Compliance and Standards
- **Code Style**: CommonJS modules, ES6+ JavaScript
- **Security**: OWASP Top 10 awareness in implementation
- **API Design**: RESTful conventions where applicable
- **Database**: Mongoose schemas with validation
- **Git**: Feature branches, PR reviews via CodeRabbit
