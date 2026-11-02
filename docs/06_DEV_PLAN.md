# DEV PLAN Document

**Project:** GCTU StudentHostels
**Version:** 1.0
**Date:** October 2026
**Status:** Active Development
**Related:** PRD v1.0, TRD v1.0, MVP Scope v1.0

---

## 1. Overview

This Development Plan outlines the technical implementation strategy, tasks, milestones, and timeline for completing the GCTU StudentHostels MVP - a central hub for all hostel platforms. It serves as a roadmap for developers and a reference for project tracking.

## 2. Development Objectives
- Fix critical security vulnerabilities
- Migrate from hardcoded data to database-driven system
- Implement missing MVP features (favorites, bookings)
- Establish proper development practices
- Prepare platform for board presentation

## 3. Current State Assessment
Based on PROJECT_PLAN.md analysis:
- **Strengths**: Solid auth system, deployed platform, security middleware
- **Weaknesses**: Security gaps, hardcoded data, missing core features
- **Blockers**: Password reset bypass, auth bypass route, no hostel API

## 4. Development Phases

### Phase 1: Security Hardening (Critical - 3-4 Days)
**Goal:** Address all critical security vulnerabilities before feature development

| Task ID | Task | Priority | Est. Hours | Status | Assignee |
|---|---|---|---|---|---|
| SEC-001 | **Fix password reset bypass** - Require verified reset token/session flag | P0 | 4-6 | To Do | Dev |
| SEC-002 | **Remove OTP bypass route** - Delete or protect `/api/signup` | P0 | 1-2 | To Do | Dev |
| SEC-003 | **Secure session storage** - Don't store plaintext passwords in sessions | P0 | 2-3 | To Do | Dev |
| SEC-004 | **Hash OTPs** - Store hashed OTPs, add attempt counter | P0 | 3-4 | To Do | Dev |
| SEC-005 | **Remove debug logging** - Remove session debug middleware from server.js | P0 | 0.5 | To Do | Dev |
| SEC-006 | **Generic login errors** - Prevent user enumeration | P0 | 1 | To Do | Dev |
| SEC-007 | **Add input validation** - Validate all auth endpoints | P0 | 3-4 | To Do | Dev |
| SEC-008 | **Centralized error handling** - Improve error middleware | P1 | 2-3 | To Do | Dev |

**Deliverables:**
- All auth flows require proper verification steps
- No sensitive data in logs or sessions
- OTPs are hashed and rate-limited
- Generic error messages

### Phase 2: Hostel Data Model & API (High Priority - 2-3 Days)
**Goal:** Replace hardcoded hostel data with database-driven system

| Task ID | Task | Priority | Est. Hours | Status | Assignee |
|---|---|---|---|---|---|
| DATA-001 | **Create Hostel model** - Schema with all required fields | P0 | 2-3 | To Do | Dev |
| DATA-002 | **Create auth middleware** - `requireAuth` and `requireAdmin` | P0 | 2-3 | To Do | Dev |
| DATA-003 | **Create hostel routes** - CRUD operations with proper auth | P0 | 4-6 | To Do | Dev |
| DATA-004 | **Add hostel validation** - Input validation for hostel data | P0 | 2-3 | To Do | Dev |
| DATA-005 | **Create seed script** - Migrate existing 6 hostels to DB | P0 | 2-3 | To Do | Dev |
| DATA-006 | **Register routes** - Add to server.js | P0 | 0.5 | To Do | Dev |
| DATA-007 | **Update frontend** - Fetch from API instead of hardcoded arrays | P0 | 3-4 | To Do | Dev |
| DATA-008 | **Add loading/error states** - UI feedback for API calls | P1 | 2-3 | To Do | Dev |

**Deliverables:**
- Hostel model in database
- RESTful API endpoints for hostels
- Public site uses API data
- Admin routes protected

### Phase 3: User Features & Dashboard (High Priority - 2-3 Days)
**Goal:** Implement favorites, bookings, and real dashboard data

| Task ID | Task | Priority | Est. Hours | Status | Assignee |
|---|---|---|---|---|---|
| USER-001 | **Create Favorite model** - User-hostel favorites relationship | P0 | 1-2 | To Do | Dev |
| USER-002 | **Create Booking model** - Booking requests with status | P0 | 1-2 | To Do | Dev |
| USER-003 | **Create Activity model** - Track user actions (optional) | P2 | 1-2 | To Do | Dev |
| USER-004 | **Favorites API** - Add/remove/list favorites | P0 | 2-3 | To Do | Dev |
| USER-005 | **Bookings API** - Create/list booking requests | P0 | 2-3 | To Do | Dev |
| USER-006 | **Dashboard API** - Aggregate user stats and data | P0 | 3-4 | To Do | Dev |
| USER-007 | **Update homepage** - Add favorites functionality, real data | P0 | 3-4 | To Do | Dev |
| USER-007b | **Update dashboard** - Replace mock data with real API data | P0 | 3-4 | To Do | Dev |
| USER-008 | **Add role to User model** - Support admin/student roles | P1 | 1-2 | To To | Dev |
| USER-009 | **Empty states** - UI for no favorites/bookings | P1 | 1-2 | To Do | Dev |

**Deliverables:**
- Users can save favorites
- Users can express booking interest
- Dashboard shows real data
- Role-based access foundation

### Phase 4: Admin Functionality (Medium Priority - 1-2 Days)
**Goal:** Enable hostel management by admins

| Task ID | Task | Priority | Est. Hours | Status | Assignee |
|---|---|---|---|---|---|
| ADM-001 | **Admin middleware** - Role-based authorization | P1 | 1-2 | To Do | Dev |
| ADM-002 | **Admin hostel CRUD UI** - Create/Edit/Delete hostels | P1 | 4-6 | To Do | Dev |
| ADM-003 | **Hostel status management** - Draft/published/archived | P1 | 2-3 | To Do | Dev |
| ADM-4 | **User management UI** - View users (optional) | P2 | 2-3 | To Do | Dev |

**Deliverables:**
- Admin can manage hostel listings
- Role-based protection on admin routes

### Phase 5: Documentation & Testing (Medium Priority - 1-2 Days)
**Goal:** Prepare for board presentation and future development

| Task ID | Task | Priority | Est. Hours | Status | Assignee |
|---|---|---|---|---|---|
| DOC-001 | **Create .env.example** - Document all environment variables | P0 | 0.5 | To Do | Dev |
| DOC-002 | **Update README** - Setup instructions, architecture, deployment | P0 | 2-3 | To Do | Dev |
| DOC-003 | **API Documentation** - Endpoint table or Postman collection | P1 | 2-3 | To Do | Dev |
| DOC-004 | **Manual testing** - Test all critical flows | P0 | 3-4 | To Do | Dev |
| DOC-005 | **Fix bugs found** - Address issues during testing | P0 | 2-4 | To Do | Dev |
| DOC-006 | **Deploy verification** - Test on production environment | P0 | 1-2 | To Do | Dev |

**Deliverables:**
- Complete documentation
- All 6 documents present in docs/ folder
- Tested and verified on production

## 5. Sprint Plan (2 Week Sprint)

### Sprint 1: Security & Foundation (Week 1)
| Day | Focus | Tasks | Goal |
|---|---|---|---|
| **Day 1** | Security Audit | Review all auth routes, identify vulnerabilities | Understand scope |
| **Day 2** | Password Reset Fix | SEC-001, implement verified reset mechanism | Fix critical bypass |
| **Day 3** | Auth Route Security | SEC-002, SEC-003, remove bypasses | Secure auth flow |
| **Day 4** | OTP Security | SEC-004, hash OTPs, add attempt limits | Harden OTP system |
| **Day 5** | Cleanup & Validation | SEC-005, SEC-006, SEC-007, SEC-008 | Complete Phase 1 |

**Milestone:** All critical security issues resolved

### Sprint 2: Data & Features (Week 2)
| Day | Focus | Tasks | Goal |
|---|---|---|---|
| **Day 6** | Hostel Model & API | DATA-001 to DATA-004 | Create hostel infrastructure |
| **Day 7** | Seed & Migration | DATA-005, DATA-006, DATA-007 | Migrate data to DB |
| **Day 8** | Favorites & Bookings | USER-001 to USER-005 | Implement user features |
| **Day 9** | Dashboard Integration | USER-006, USER-007, USER-007b | Real dashboard data |
| **Day 10** | Testing, Docs & Deploy | DOC-001 to DOC-006, bug fixes | Complete MVP, prepare presentation |

**Milestone:** MVP complete and ready for board presentation

## 6. Technical Implementation Details

### 6.1 Password Reset Security Fix
**Current Issue:** `/api/reset-password` trusts email without verification
**Solution:**
1. After successful OTP verification, create a short-lived signed token or session flag
2. Store `resetVerified: true, resetEmail: email, resetTokenExpiry` in session
3. In `/api/reset-password`, check for verified flag and expiry
4. Invalidate flag after successful password reset

### 6.2 OTP Security Enhancement
**Current Issue:** OTPs stored in plaintext
**Solution:**
1. Hash OTP with bcrypt before storage in database
2. Add `attempts` field to OTP model
3. Limit attempts to 3-5 per OTP
4. Add cooldown period or invalidate on max attempts
5. Use crypto.randomInt for secure OTP generation

### 6.3 Hostel API Implementation
**Endpoints needed:**
```javascript
GET /api/hostels - Public, with query params for search/filter/pagination
GET /api/hostels/:id - Public
POST /api/hostels - Admin only
PUT /api/hostels/:id - Admin only
DELETE /api/hostels/:id - Admin only
```

### 6.4 Frontend API Configuration
**Issue:** Hardcoded API URL in all files
**Solution:** Create `config.js` or use environment variables
```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://gctu-hostels-backend.onrender.com/api';
```

## 7. Testing Strategy

### 7.1 Manual Testing Checklist
#### Authentication
- [ ] Register new user with valid data
- [ ] Receive and verify OTP
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (check generic error)
- [ ] Logout successfully
- [ ] Forgot password flow end-to-end
- [ ] Password reset with verified OTP
- [ ] Attempt password reset without OTP verification (should fail)
- [ ] Rate limiting on auth endpoints

#### Hostel Discovery
- [ ] Browse hostels on landing page
- [ ] Search by name/location
- [ ] Filter by availability
- [ ] Filter by budget
- [ ] Click hostel card redirects to external site
- [ ] Hostel data loads from API

#### Authenticated Features
- [ ] Access homepage when logged in
- [ ] Access dashboard when logged in
- [ ] Redirect to login when not authenticated
- [ ] Add/remove favorite hostel
- [ ] Express booking interest
- [ ] Dashboard shows real data

#### Security
- [ ] Cannot access protected routes without auth
- [ ] Cannot access admin routes as student
- [tag] OTP not stored in plaintext in DB
- [ ] Password not stored in plaintext
- [ ] Session cookies are httpOnly

### 7.2 Testing Tools
- **Browser Testing**: Chrome, Firefox, Edge
- **Mobile Testing**: Chrome DevTools responsive mode
- **API Testing**: Postman/Thunder Client
- **Security Testing**: Manual verification of fixes

## 8. Deployment Plan

### 8.1 Pre-Deployment Checklist
- [ ] All critical security fixes implemented
- [ ] No console.log debug statements
- [ ] Environment variables configured on Render
- [ ] Frontend updated with correct API URLs
- [ ] Database seed script run (or data migrated)
- [ ] All tests pass
- [ ] .env.example updated

### 8.2 Deployment Steps
1. **Backend (Render)**:
   - Commit and push changes to main branch
   - Render auto-deploys from main
   - Verify health check: GET /api/test
   - Check logs for errors

2. **Frontend (Netlify)**:
   - Commit and push changes to main branch
   - Netlify auto-deploys
   - Verify site loads
   - Check API calls work

### 8.3 Post-Deployment Verification
- [ ] Landing page loads
- [ ] Registration flow works
- [ ] Login flow works
- [ ] Hostel listings load from API
- [ ] Dashboard loads for authenticated user
- [ ] Sitemap accessible
- [ ] No console errors

## 9. Risk Management

| Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|
| **Security fixes break existing functionality** | High | Medium | Test thoroughly after each fix, keep backups | Dev |
| **Database migration issues** | High | Low | Create seed script, test locally first | Dev |
| **API changes break frontend** | High | Medium | Update frontend in sync, test integration | Dev |
| **Deployment failures** | High | Low | Check build logs, have rollback plan | Dev |
| [ **Time overrun** | Medium | Medium | Prioritize P0 tasks, defer P2/P3 if needed | Dev/PM |
| **Email delivery issues** | Medium | Low | Monitor Brevo status, test OTP delivery | Dev |

## 10. Resources & Tools
- **Version Control**: Git, GitHub
- **IDE**: VS Code
- **API Testing**: Thunder Client/Postman
- **Database**: MongoDB Compass
- **Deployment**: Render, Netlify
- **Code Review**: CodeRabbit (already setup)
- **Documentation**: Markdown

## 11. Success Metrics
| Metric | Target | Current | Status |
|---|---|---|---|
| **Critical Security Issues Fixed** | 0 | 6 issues identified | In Progress |
| **Hostel Data in DB** | 100% | 0% (hardcoded) | In Progress |
| **Real Dashboard Data** | 100% | 0% (mock) | In Progress |
| **Authentication Flows Secure** | 100% | ~70% | In Progress |
| **MVP Features Complete** | 100% | ~60% | In Progress |
| **Documentation Complete** | 100% | 0% (creating now) | In Progress |

## 12. Definition of Done (Development)
- [ ] All P0 tasks completed
- [ ] Security vulnerabilities resolved
- [ ] Hostel API implemented and integrated
- [ ] Favorites and bookings functional
- [ ] Dashboard shows real data
- [ ] All 6 documents created in docs/ folder
- [ ] README and .env.example updated
- [ ] Manual testing completed
- [ ] Production deployment verified
- [ ] Code reviewed and approved

## 13. Next Immediate Actions
1. **Start Phase 1, Task SEC-001**: Fix password reset bypass mechanism
2. **Create models directory structure**: Prepare for Hostel, Favorite, Booking models
3. **Review server.js**: Understand current auth routes before modifications
4. **Setup local environment**: Ensure can run locally for testing
5. **Create feature branch**: `git checkout -b feature/security-hardening` for Phase 1 work
