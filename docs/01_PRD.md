# PRD - Product Requirements Document

**Project:** GCTU StudentHostels
**Version:** 1.2
**Date:** November 2026
**Status:** Active Development — source-state snapshot
**Author:** Development Team
**Target Audience:** Board of Members, Stakeholders, Developers

---

## 1. Executive Summary

GCTU StudentHostels is a **central hub for all hostel platforms** designed specifically for students of Ghana Communication Technology University (GCTU). The platform acts as a unified directory that aggregates all hostel listings around the GCTU Tesano campus into one place, bridging the gap between students searching for accommodation and hostel managers looking to promote their properties. By serving as the central discovery point, students can easily find, compare, and connect with any hostel near campus through a single platform.

**Implementation note:** This document describes the current local source state. Recent security, UI, and documentation changes have not been verified against the deployed services.

## 2. Problem Statement

### Current Challenges
- **Fragmented Information**: Students rely on word-of-mouth, posters, or scattered social media posts to find hostels
- **Lack of Transparency**: No centralized place to compare prices, amenities, distances, and availability
- **Difficult Discovery**: New students struggle to find suitable accommodation near campus
- **Limited Reach**: Hostel managers have difficulty reaching the entire student population effectively

### Solution
Create a centralized digital platform where all GCTU-approved hostels can be listed with comprehensive details, allowing students to search, filter, and compare options in one place with direct links to hostel management for booking.

## 3. Goals and Objectives

### Primary Goals
1. **Centralize Hostel Listings**: Provide a single source of truth for all hostels near GCTU campus
2. **Simplify Discovery**: Enable students to find hostels based on budget, location, amenities, and availability
3. **Streamline Connection**: Connect students directly with hostel managers through official channels
4. **Build Trust**: Provide verified hostel information with accurate pricing and contact details

### Secondary Goals
1. **User Management**: Secure authentication system for personalized experience
2. **Data-Driven Platform**: Move from static listings to a dynamic, manageable system
3. **Scalable Foundation**: Build architecture that can support future features like in-app bookings and payments

## 4. Target Users

| User Type | Description | Needs |
|---|---|---|
| **GCTU Students** | Primary users actively searching for accommodation | Easy search, filters, price comparison, hostel details, direct contact |
| **Hostel Managers/Owners** | Property owners looking to list accommodations | Platform to showcase properties, reach students, manage listings |
| **System Administrators** | Platform operators managing the system | User management, hostel moderation, analytics, content control |

## 5. Core Features

### 5.1 Public Features (Unauthenticated)
- **Landing Page**: Hero section with search functionality and platform overview
- **Hostel Browsing**: Grid of database-backed listings, with details pages
- **Search & Filters**: Client-side search by name/location and filters for availability, budget, walking distance, price bands, and amenities
- **Hostel Details**: Description, price, location, amenities, validated image, save action, and manager phone/WhatsApp contacts when supplied
- **Contact Us**: Netlify Forms submission from the landing page
- **Responsive Design**: Mobile-friendly interface for on-the-go access

### 5.2 Student Features (Authenticated)
- **User Account**: Registration with email OTP verification, secure login/logout
- **Personal Dashboard**: Saved-hostel count, unique hostels explored, search count, saved listings, profile summary, and recent activity
- **Favorites/Wishlist**: Save/remove hostels; records are stored per account
- **Activity Tracking**: Record login, unique hostel views, searches, and contact actions
- **Password Management**: Forgot password with OTP-based reset
- **Profile Display**: Show the verified account name, email, and index number; profile editing is not implemented

### 5.3 Manager and Administrator Features
- **Manager Listing Creation**: A provisioned manager can publish a hostel listing from the manager portal. Listing edit/delete and moderation are not implemented.
- **Manager Provisioning**: An administrator creates manager accounts through the `POST /api/register-manager` endpoint using the server-side `ADMIN_SECRET`; there is no public manager registration or admin UI.
- **Administration UI, User Management, Moderation, and Admin Analytics**: Not implemented.

## 6. User Stories

| ID | User Story | Priority | Status |
|---|---|---|---|
| US-001 | As a student, I want to browse hostels without creating an account so I can explore options | P0 | Done |
| US-002 | As a student, I want to register with email verification so my account is secure | P0 | Done |
| US-003 | As a student, I want to search and filter hostels so I can find suitable options within budget | P0 | Done |
| US-004 | As a student, I want to save favorite hostels so I can compare them later | P0 | Implemented |
| US-005 | As a student, I want to request booking for a hostel so I can express interest | P0 | Not implemented |
| US-006 | As a manager, I want to publish a hostel listing so students can find it | P0 | Create only; edit/delete not implemented |
| US-007 | As a student, I want to reset my password if forgotten so I can regain access | P0 | Done |

## 7. Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| **User Registration** | 500+ students in first semester | User count in database |
| **Hostel Coverage** | 100% of GCTU-area hostels | Admin verification |
| **Platform Usage** | 70% of registered users active monthly | Login/session analytics |
| **Search Conversion** | 40% click-through to hostel websites | Click tracking |
| **User Satisfaction** | 4.5/5 rating | Student feedback surveys |

## 8. Constraints and Assumptions

### Constraints
- **Initial Scope**: Referral-based model (redirect to hostel websites) rather than full in-app payments
- **Campus Focus**: Primarily serving GCTU Tesano campus initially
- **Technology**: Must work on existing infrastructure (Netlify + Render)
- **Security**: Must comply with basic security practices for user data

### Assumptions
- Hostel managers willing to provide accurate listing information
- Students have internet access and devices to browse
- Official hostel websites exist for booking/contact
- Email delivery via Brevo remains reliable

## 9. Out of Scope (Current Release)
- In-app payment processing
- In-app booking requests, reservation status, and booking history
- Real-time chat between students and managers
- Room availability calendar
- Mobile native applications
- Multi-campus support
- User-submitted review/rating system (landing page testimonials are static sample content)

## 10. Release Criteria
- [x] Student email-OTP registration, login, logout, and OTP-backed password reset are implemented in source
- [x] Public hostel browsing, details, and client-side search/filter UI use the hostel API
- [x] Favorites and dashboard activity/statistics use authenticated API routes
- [x] Manager-only hostel listing creation is implemented; manager accounts are provisioned by admin secret
- [ ] Full booking-request and payment workflows
- [ ] Hostel listing edit/delete, admin UI, moderation, and user-management UI
- [ ] OTP hashing and per-code verification attempt limits
- [ ] Automated test suite and CI
- [ ] Verify current changes and end-to-end flows against production

## 11. Approval
This PRD serves as the foundation for all subsequent technical documentation and development activities.
