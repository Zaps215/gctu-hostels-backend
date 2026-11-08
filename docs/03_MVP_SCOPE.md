# MVP Scope Document

**Project:** GCTU StudentHostels
**Version:** 1.1
**Date:** November 2026
**Status:** Active Development — source-state snapshot
**Related:** PRD v1.0, TRD v1.0

---

## 1. MVP Definition

The Minimum Viable Product (MVP) for GCTU StudentHostels is a **central hub for all hostel platforms** that aggregates and centralizes hostel listings around the GCTU Tesano campus. It allows GCTU students to find and compare all available hostels in one place, with secure user accounts and direct connections to hostel management. The MVP focuses on solving the core problem of fragmented hostel information across multiple platforms while establishing a solid, secure foundation for future enhancements.

**Implementation note:** Statuses describe the current local source state. Current local changes have not been verified against the deployed services.

## 2. MVP Goals
1. Provide a functional platform where students can discover all GCTU-area hostels in one place
2. Enable secure user registration and authentication
3. Allow students to search and filter hostels based on their preferences
4. Connect students to hostel managers through official channels
5. Establish a scalable, secure technical foundation

## 3. MVP Scope

### 3.1 In Scope - Core Features

#### User Authentication & Management
- [x] **Student Registration**: Index number, name, email, password; manager public signup is blocked
- [x] **Email Verification**: OTP-based verification via Brevo
- [x] **User Login**: Username/password with session management
- [x] **User Logout**: Session destruction
- [x] **Password Reset**: Forgot password flow with OTP verification
- [x] **Current User API**: Get authenticated user details
- [x] **Session Persistence**: MongoDB-backed session cookies (`httpOnly`, secure in production, `sameSite: none` in production)
- [x] **Manager Provisioning**: Admin-secret-protected endpoint; no self-service manager registration

#### Public Hostel Discovery
- [x] **Landing Page**: Marketing page with platform overview
- [x] **Hostel Listings**: Display hostels in card/grid format
- [x] **Search Functionality**: Search by hostel name or location
- [x] **Filters**: Filter by availability, budget range, distance
- [x] **Hostel Cards**: Show key info (name, price, location, amenities)
- [x] **External Links**: Direct links to official hostel websites
- [x] **Hostel Details**: Database-backed detail page, escaped listing content, validated image URLs, and optional phone/WhatsApp contacts
- [x] **Landing Contact Form**: Netlify Forms form and thank-you page (delivery depends on deployed Netlify configuration)

#### Authenticated Student Experience
- [x] **Student Homepage**: Session-protected hostel discovery page
- [x] **Student Dashboard**: API-backed favorites, unique hostels explored, search count, and recent activity
- [x] **User Profile Display**: Name, email, and index number
- [x] **Favorites/Wishlist**: Save and remove per-user saved hostels
- [ ] **Booking Requests**: Express interest in hostels
- [ ] **Dashboard Data**: Real data instead of mock values

#### System Infrastructure
- [x] **Backend API**: RESTful API with Express.js
- [x] **Database**: MongoDB with Mongoose ODM
- [x] **Security Middleware**: Helmet, CORS, rate limiting, sanitization
- [x] **Email Service**: Brevo integration for OTPs
- [x] **Deployment**: Live on Render and Netlify
- [x] **SEO**: Sitemap.xml and Google Search Console setup

### 3.2 Security and Reliability Status
- [x] Password reset requires a verified reset email and a 10-minute server-side session window
- [x] `/api/signup` rejects direct signup; account creation follows the OTP flow
- [x] Registration stores a bcrypt hash, not a plaintext password, in the temporary session
- [x] Authentication routes have IP-based rate limits; API mutations require an allowed origin, except manager provisioning protected by `ADMIN_SECRET`
- [x] Hostel listing creation requires an authenticated manager
- [ ] OTP codes are stored in plaintext and have no per-code attempt counter; add hashing and attempt limits
- [ ] Add automated tests and verify production configuration and live user journeys
- [x] Hostel listings and dashboard features use MongoDB-backed APIs

### 3.3 Out of Scope for MVP
| Feature | Reason | Future Phase |
|---|---|---|
| **In-app Payments** | Complex integration, referral model sufficient initially | Phase 5 |
| **Real-time Chat** | Not critical for discovery/connect flow | Post-MVP |
| **Room Booking Calendar** | Requires complex availability management | Post-MVP |
| **Mobile Apps** | Web-first approach is sufficient | Post-MVP |
| **Review System Backend** | Landing testimonials are static; there is no user-submitted review system | Post-MVP |
| **Multi-campus Support** | Focus on GCTU first | Post-MVP |
| **Hostel Image Upload** | Use external URLs initially | Post-MVP |
| **Advanced Analytics** | Basic usage tracking sufficient | Post-MVP |

Provisioned managers can create listings. Editing, deletion, and administrative moderation are not implemented.

## 4. MVP User Flows

### 4.1 New Student Registration
1. Visit landing page → Click "Sign Up"
2. Fill registration form (fullName, username, email, password)
3. System validates input and password strength
4. OTP sent to email via Brevo
5. Enter OTP in modal (10-min timer, resend option)
6. Account created, redirect to login

### 4.2 Student Login & Discovery
1. Login with credentials → Session created
2. Redirect to homepage/dashboard
3. Browse the public landing page or session-protected student homepage
4. Search and filter the API-backed hostel list
5. Open hostel details; follow an official site link if available or contact the manager by phone/WhatsApp

### 4.3 Password Reset
1. Click "Forgot Password" on login
2. Enter email → OTP sent
3. Verify OTP → Redirect to new password
4. Set new password → Success, redirect to login

### 4.4 Contact a Manager (Implemented)
1. Student opens a hostel details page
2. Student uses the phone or WhatsApp link when a manager phone number is present
3. This opens an external communication channel; it does not create an in-app booking or reservation

## 5. MVP Success Criteria

### Functional Criteria
- [ ] Verify all authentication flows end-to-end against the running backend
- [x] Users can browse, search, and filter API-backed hostels
- [x] Hostel data is served from MongoDB
- [x] Authenticated users have dashboard data for implemented features
- [x] Favorites are functional; booking requests are not implemented
- [ ] Complete remaining security work, including OTP hashing and attempt limits

### Technical Criteria
- [ ] No plaintext passwords stored in sessions or logs
- [ ] All protected routes require authentication
- [ ] Input validation on all endpoints
- [ ] Error handling implemented
- [ ] Production deployment stable
- [ ] CORS and security headers configured

### Business Criteria
- [ ] Platform covers major hostels near GCTU Tesano
- [ ] Students can discover hostels without friction
- [ ] System ready for demonstration to board members
- [ ] Codebase is maintainable and documented

## 6. MVP Timeline

| Phase | Duration | Focus | Status |
|---|---|---|---|
| **Phase 1: Security Hardening** | Ongoing | Security controls are present; OTP hashing/attempt limits and broader validation remain | In Progress |
| **Phase 2: Data & Hostel API** | Implemented in source | MongoDB hostel model, public reads, manager create, safe idempotent seed | Done in source |
| **Phase 3: Student Features** | Partial | Favorites and dashboard activity done; booking requests are not implemented | In Progress |
| **Phase 4: Testing & Deployment** | Ongoing | Syntax/manual checks only; automated tests and production E2E verification remain | To Do |

**Total Estimated:** 1-2 weeks

## 7. MVP Deliverables

| Deliverable | Description | Status |
|---|---|---|
| **Working Platform** | Deployed app on Netlify + Render | Done |
| **Authentication System** | Student OTP registration, sessions, role-aware login, password reset; admin-secret manager provisioning | Implemented in source; live flow unverified |
| **Hostel Discovery** | API-backed search, filters, cards, and details | Implemented in source |
| **User Dashboard** | Favorites, counts, and activity from authenticated APIs | Implemented in source; bookings absent |
| **API Documentation** | Endpoint documentation | README overview; expand as needed |
| **Automated Tests** | Unit/integration/E2E suite | Not configured |
| **Security Compliance** | Controls and remaining gaps documented | Ongoing; OTP hardening remains |

## 8. MVP Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| **Security vulnerabilities found** | High | Medium | Prioritize Phase 1 fixes before feature additions |
| **Data migration complexity** | Medium | Low | Create seed script with existing hostel data |
| **Time constraints** | Medium | Medium | Focus on critical path, defer nice-to-haves |
| **Deployment issues** | High | Low | Test in staging-like environment before deploy |
| **Email delivery limits** | Medium | Low | Monitor Brevo quota, have fallback plan |

## 9. Definition of Done (MVP)
- [ ] Complete security review, including OTP hashing/attempt limits
- [x] Hostel data served from MongoDB via API
- [x] Authenticated users see real dashboard data for supported features
- [x] Favorites work; booking requests are not implemented
- [ ] All 6 required documents created and reviewed
- [ ] Production deployment and end-to-end journey verified
- [ ] README updated with setup instructions
Winvalid-docs: false
