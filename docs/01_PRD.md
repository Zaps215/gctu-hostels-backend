# PRD - Product Requirements Document

**Project:** GCTU StudentHostels
**Version:** 1.1
**Date:** October 2026
**Status:** Active Development
**Author:** Development Team
**Target Audience:** Board of Members, Stakeholders, Developers

---

## 1. Executive Summary

GCTU StudentHostels is a **central hub for all hostel platforms** designed specifically for students of Ghana Communication Technology University (GCTU). The platform acts as a unified directory that aggregates all hostel listings around the GCTU Tesano campus into one place, bridging the gap between students searching for accommodation and hostel managers looking to promote their properties. By serving as the central discovery point, students can easily find, compare, and connect with any hostel near campus through a single platform.

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
- **Hostel Browsing**: Grid view of all available hostels with key information
- **Advanced Search & Filters**: Filter by price range, distance from campus, availability, amenities
- **Hostel Details**: Comprehensive view with images, pricing, amenities, location, contact info
- **Responsive Design**: Mobile-friendly interface for on-the-go access

### 5.2 Student Features (Authenticated)
- **User Account**: Registration with email OTP verification, secure login/logout
- **Personal Dashboard**: Overview of favorites, bookings, activity, and profile
- **Favorites/Wishlist**: Save hostels for later comparison
- **Booking Requests**: Express interest in hostels (referral model)
- **Password Management**: Forgot password with OTP-based reset
- **Profile Management**: Update personal information

### 5.3 Admin Features (Planned)
- **Hostel Management**: CRUD operations for hostel listings
- **User Management**: View and manage user accounts
- **Content Moderation**: Approve/reject listings
- **Analytics Dashboard**: Platform usage insights

## 6. User Stories

| ID | User Story | Priority | Status |
|---|---|---|---|
| US-001 | As a student, I want to browse hostels without creating an account so I can explore options | P0 | Done |
| US-002 | As a student, I want to register with email verification so my account is secure | P0 | Done |
| US-003 | As a student, I want to search and filter hostels so I can find suitable options within budget | P0 | Done |
| US-004 | As a student, I want to save favorite hostels so I can compare them later | P0 | In Progress |
| US-005 | As a student, I want to request booking for a hostel so I can express interest | P0 | In Progress |
| US-006 | As an admin, I want to add/edit hostel listings so I can keep information current | P0 | Planned |
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
- Real-time chat between students and managers
- Room availability calendar
- Mobile native applications
- Multi-campus support
- Review/rating system (UI exists but not connected)

## 10. Release Criteria
- [x] User authentication (register, login, logout, password reset) fully functional
- [x] Public hostel browsing with search and filters
- [x] Responsive design across devices
- [x] Production deployment operational
- [ ] Hostel data migrated from hardcoded to database
- [ ] Dashboard showing real user data (favorites, bookings)
- [ ] Admin functionality for hostel management
- [ ] Security vulnerabilities addressed per project plan

## 11. Approval
This PRD serves as the foundation for all subsequent technical documentation and development activities.
