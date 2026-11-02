# MVP Scope Document

**Project:** GCTU StudentHostels
**Version:** 1.0
**Date:** October 2026
**Status:** In Progress
**Related:** PRD v1.0, TRD v1.0

---

## 1. MVP Definition

The Minimum Viable Product (MVP) for GCTU StudentHostels is a **central hub for all hostel platforms** that aggregates and centralizes hostel listings around the GCTU Tesano campus. It allows GCTU students to find and compare all available hostels in one place, with secure user accounts and direct connections to hostel management. The MVP focuses on solving the core problem of fragmented hostel information across multiple platforms while establishing a solid, secure foundation for future enhancements.

## 2. MVP Goals
1. Provide a functional platform where students can discover all GCTU-area hostels in one place
2. Enable secure user registration and authentication
3. Allow students to search and filter hostels based on their preferences
4. Connect students to hostel managers through official channels
5. Establish a scalable, secure technical foundation

## 3. MVP Scope

### 3.1 In Scope - Core Features

#### User Authentication & Management
- [x] **User Registration**: Email, username, full name, password with validation
- [x] **Email Verification**: OTP-based verification via Brevo
- [x] **User Login**: Username/password with session management
- [x] **User Logout**: Session destruction
- [x] **Password Reset**: Forgot password flow with OTP verification
- [x] **Current User API**: Get authenticated user details
- [x] **Session Persistence**: Secure cookie-based sessions

#### Public Hostel Discovery
- [x] **Landing Page**: Marketing page with platform overview
- [x] **Hostel Listings**: Display hostels in card/grid format
- [x] **Search Functionality**: Search by hostel name or location
- [x] **Filters**: Filter by availability, budget range, distance
- [x] **Hostel Cards**: Show key info (name, price, location, amenities)
- [x] **External Links**: Direct links to official hostel websites

#### Authenticated Student Experience
- [x] **Student Homepage**: Personalized welcome with recommendations
- [x] **Student Dashboard**: Overview of user activity
- [x] **User Profile Display**: Show user info from session
- [ ] **Favorites/Wishlist**: Save and manage favorite hostels
- [ ] **Booking Requests**: Express interest in hostels
- [ ] **Dashboard Data**: Real data instead of mock values

#### System Infrastructure
- [x] **Backend API**: RESTful API with Express.js
- [x] **Database**: MongoDB with Mongoose ODM
- [x] **Security Middleware**: Helmet, CORS, rate limiting, sanitization
- [x] **Email Service**: Brevo integration for OTPs
- [x] **Deployment**: Live on Render and Netlify
- [x] **SEO**: Sitemap.xml and Google Search Console setup

### 3.2 In Scope - Critical Fixes (MVP Blockers)
- [ ] **Secure Password Reset**: Fix OTP verification bypass vulnerability
- [ ] **Remove Auth Bypass**: Remove or secure `/api/signup` route
- [ ] **Secure Session Storage**: Don't store plaintext passwords in sessions
- [ ] **OTP Security**: Hash OTPs and add attempt limits
- [ ] **Hostel Data Migration**: Move from hardcoded to database
- [ ] **Auth Middleware**: Implement route protection

### 3.3 Out of Scope for MVP
| Feature | Reason | Future Phase |
|---|---|---|
| **In-app Payments** | Complex integration, referral model sufficient initially | Phase 5 |
| **Real-time Chat** | Not critical for discovery/connect flow | Post-MVP |
| **Room Booking Calendar** | Requires complex availability management | Post-MVP |
| **Mobile Apps** | Web-first approach is sufficient | Post-MVP |
| **Review System Backend** | UI exists but needs moderation system | Post-MVP |
| **Multi-campus Support** | Focus on GCTU first | Post-MVP |
| **Hostel Image Upload** | Use external URLs initially | Post-MVP |
| **Advanced Analytics** | Basic usage tracking sufficient | Post-MVP |

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
3. Browse hostels on landing page or authenticated home
4. Use search/filters to find suitable hostels
5. Click hostel card → Redirect to official hostel website

### 4.3 Password Reset
1. Click "Forgot Password" on login
2. Enter email → OTP sent
3. Verify OTP → Redirect to new password
4. Set new password → Success, redirect to login

### 4.4 Express Interest (Planned)
1. Authenticated user views hostel details
2. Click "Book/Express Interest"
3. System records booking request
4. Optionally redirect to hostel website
5. Appears in user's dashboard bookings

## 5. MVP Success Criteria

### Functional Criteria
- [ ] All authentication flows work end-to-end without security bypasses
- [ ] Users can browse, search, and filter hostels
- [ ] Hostel data comes from database (not hardcoded)
- [ ] Authenticated users have working dashboard
- [ ] Favorites and booking requests functional
- [ ] All critical security issues from PROJECT_PLAN addressed

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
| **Phase 1: Security Hardening** | 3-4 days | Fix critical vulnerabilities | To Do |
| **Phase 2: Data Migration** | 2-3 days | Hostel model, API, seed data | To Do |
| **Phase 3: User Features** | 2-3 days | Favorites, bookings, dashboard data | To Do |
| **Phase 4: Testing & Polish** | 1-2 days | Bug fixes, validation, deployment check | To Do |

**Total Estimated:** 1-2 weeks

## 7. MVP Deliverables

| Deliverable | Description | Status |
|---|---|---|
| **Working Platform** | Deployed app on Netlify + Render | Done |
| **Authentication System** | Complete auth flow with security | Done (needs hardening) |
| **Hostel Discovery** | Browse, search, filter functionality | Done (needs DB migration) |
| **User Dashboard** | Personalized student dashboard | Done (needs real data) |
| **API Documentation** | Endpoint documentation | To Do |
| **Environment Setup** | .env.example and setup instructions | To Do |
| **Security Compliance** | All critical issues resolved | To Do |

## 8. MVP Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| **Security vulnerabilities found** | High | Medium | Prioritize Phase 1 fixes before feature additions |
| **Data migration complexity** | Medium | Low | Create seed script with existing hostel data |
| **Time constraints** | Medium | Medium | Focus on critical path, defer nice-to-haves |
| **Deployment issues** | High | Low | Test in staging-like environment before deploy |
| **Email delivery limits** | Medium | Low | Monitor Brevo quota, have fallback plan |

## 9. Definition of Done (MVP)
- [ ] No critical security vulnerabilities remain
- [ ] Hostel data served from MongoDB via API
- [ ] Authenticated users see real dashboard data
- [ ] Favorites and booking requests work
- [ ] All 6 required documents created and reviewed
- [ ] Platform demonstrated and approved by stakeholders
- [ ] README updated with setup instructions
Winvalid-docs: false
