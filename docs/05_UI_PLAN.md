# UI PLAN Document

**Project:** GCTU StudentHostels
**Version:** 1.1
**Date:** November 2026
**Status:** Active Development — source-state snapshot
**Related:** PRD v1.0, User Flow v1.0

---

## 1. Overview

This document outlines the User Interface design strategy, components, layouts, and design system for GCTU StudentHostels, a student-facing hostel discovery platform.

**Implementation note:** This records the UI as currently implemented in source. It is not a claim that every accessibility or production check has passed.

## 2. Design Goals
- **Simplicity**: Clean interface that's easy to navigate for students
- **Clarity**: Clear information hierarchy for hostel listings
- **Responsiveness**: Seamless experience across desktop, tablet, and mobile
- **Accessibility**: Readable fonts, good contrast, intuitive navigation
- **Brand Consistency**: Professional look suitable for presentation to board members
- **Speed**: Fast loading with minimal distractions

## 3. Design System

### 3.1 Color Palette

| Color | Hex Code | Usage | Purpose |
|---|---|---|---|
| **Primary blue** | `#2b5f8a` | Navigation, headings, primary actions |
| **Teal** | `#1f8a7c` | Secondary actions, success accents |
| **Warm accent** | `#f4a261` | Highlights, icons, calls to action |
| **Coral** | `#e76f51` | Price and logout/emphasis accents |
| **Background** | `#fefcf5` / `#f8f3e9` | Warm page backgrounds |
| **Surface** | `#ffffff` | Cards and form surfaces |
| **Body text** | `#1e2a2f` | Primary text |
| **Muted text** | `#6c7e82` | Labels and secondary content |

### 3.2 Typography

| Element | Font Family | Weight | Size (Desktop) | Size (Mobile) | Usage |
|---|---|---|---|---|---|
| **Headings** | Inter, sans-serif | 600–800 | Page/section-specific | Responsive | Page titles and sections |
| **Body Text** | Inter, sans-serif | 400–500 | Usually 1rem | Responsive | Main content |
| **Button Text** | Inter, sans-serif | 600–700 | Component-specific | Responsive | Actions |

### 3.3 Spacing System
Using rem-based spacing for consistency:
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### 3.4 Border Radius
- **sm**: 4px - Small elements (badges)
- **md**: 8px - Buttons, inputs
- **lg**: 12px - Cards
- **xl**: 16px - Modals
- **full**: 9999px - Pills/badges

### 3.5 Shadows
- **sm**: `0 1px 3px rgba(0,0,0,0.1)` - Subtle elevation
- **md**: `0 4px 6px rgba(0,0,0,0.1)` - Cards
- **lg**: `0 10px 15px rgba(0,0,0,0.1)` - Modals, dropdowns
- **xl**: `0 20px 25px rgba(0,0,0,0.15)` - Prominent elements

## 4. Component Library

### 4.1 Navigation Components

#### Header/Navbar (Public)
**Purpose:** Main navigation for guest users
**Elements:**
- Logo/Brand name "GCTU StudentHostels"
- Anchor navigation (Home, Search, Hostels, Reviews)
- Student and manager portal actions
- Contact section and footer links lower on page

**Structure:**
```html
The implemented landing navbar uses the corresponding section anchors and portal buttons. Authenticated session state replaces those buttons with user details, a destination appropriate to the user's role, and logout.
```

#### Header/Navbar (Authenticated)
**Purpose:** Navigation for logged-in users
**Elements:**
- Logo
- Navigation links (Home, Dashboard, Hostels)
- Dashboard or manager listing destination
- Logout action
- Responsive menu

### 4.2 Button Components

| Type | Style | Usage |
|---|---|---|
| **Primary** | Blue/teal gradients or page-specific solid colors | Main actions |
| **Secondary/Outline** | Transparent or muted backgrounds with blue/teal borders | Alternative actions |
| **Danger** | Coral accent | Logout confirmation and error states |
| **Link** | Blue/teal text | Navigation and detail links |

### 4.3 Form Components

#### Input Fields
- **Text Input**: Standard text entry with label
- **Email Input**: Email validation
- **Password Input**: With show/hide toggle
- **Select Dropdown**: For filters
- **Textarea**: For messages

#### Form Validation
- Real-time validation where possible
- Clear error messages below inputs
- Password strength indicator
- Required field indicators

### 4.4 Card Components

#### Hostel Card
**Purpose:** Display hostel information in grid
**Elements:**
- Hostel image (or placeholder)
- Hostel name
- Location/distance
- Price (e.g., "GHS 2000 - GHS 2500")
- Amenities badges (WiFi, Water, Security)
- Availability status
- "View Details & Contact" link; booking is not implemented
- Favorite heart action is on the details page
- Availability/amenity details as supplied by the listing

**Layout:**
```
┌─────────────────────────┐
│      [Hostel Image]     │
├─────────────────────────┤
│ Hostel Name             │
│ 📍 Location             │
│ 💰 Price                │
│ 🏷️ Amenities            │
│ ✅ Availability         │
│ [View Details & Contact]│
└─────────────────────────┘
```

#### Stats Card (Dashboard)
**Purpose:** Display user statistics
Implemented dashboard metrics: saved hostels, unique hostels explored, and searches made, plus account status.

### 4.5 Modal Components

#### OTP Modal
**Purpose:** Email verification during signup
**Elements:**
- Title "Verify Your Email"
- Email display
- 6-digit OTP input
- Countdown timer (10 minutes)
- Resend button
- Verify and Cancel buttons

#### Logout Confirmation Modal
**Purpose:** Confirm logout action
**Elements:**
- Warning icon/message
- "Are you sure you want to logout?"
- Cancel and Logout buttons

#### Loading Modal/Spinner
**Purpose:** Show during async operations
**Elements:**
- Spinner animation
- Loading text

## 5. Page Layouts

### 5.1 Landing Page (index.html)
**Layout Structure:**
```
┌─────────────────────────────────────────┐
│              Navigation Bar              │
├─────────────────────────────────────────┤
│                Hero Section              │
│  - Headline, Subtext, CTA Buttons        │
├─────────────────────────────────────────┤
│               Statistics Section         │
│  - Hostels, Students, Locations          │
├─────────────────────────────────────────┤
│                Search/Filter Bar         │
├─────────────────────────────────────────┤
│              Hostel Listings Grid        │
│           (Dynamically populated)        │
├─────────────────────────────────────────┤
│               Testimonials Section       │
├─────────────────────────────────────────┤
│                Contact Section           │
├─────────────────────────────────────────┤
│                  Footer                  │
└─────────────────────────────────────────┘
```

**Key Sections:**
1. **Hero**: "Find Your Perfect Hostel Near GCTU" with search CTA
2. **Stats**: Display platform metrics
3. **Filters**: Search, price range, and amenity filters
4. **Hostel Grid**: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
5. **Testimonials**: Landing-page testimonials
6. **Contact**: Labeled contact form using Netlify Forms and `thankyou.html`
7. **Footer**: Links, copyright

### 5.2 Login Page (login.html)
**Layout:**
```
┌─────────────────────────────────────────┐
│                Centered Card             │
│  ┌─────────────────────────────────┐   │
│  │          Login Form              │   │
│  │  - Student index / hostel name   │   │
│  │  - Password input                │   │
│  │  - Forgot Password link          │   │
│  │  - Login Button                  │   │
│  │  - Student registration link     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 5.3 Signup Page (signup.html)
**Layout:**
```
┌─────────────────────────────────────────┐
│                Centered Card             │
│  ┌─────────────────────────────────┐   │
│  │        Registration Form         │   │
│  │  - Full Name                     │   │
│  │  - GCTU Index Number             │   │
│  │  - Email                         │   │
│  │  - Password                      │   │
│  │  - Password requirements         │   │
│  │  - Sign Up Button                │   │
│  │  - Login link                    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
└── OTP Modal (overlay) ──┘
```

Student registration is available through email OTP. A manager query parameter displays an administrator-provisioning message and manager sign-in link; it does not create a manager account.

### 5.4 Student Homepage (homepage.html)
**Layout:**
```
┌─────────────────────────────────────────┐
│              Navigation Bar              │
├─────────────────────────────────────────┤
│        Welcome + student identity         │
├─────────────────────────────────────────┤
│        Search, filters, amenity chips     │
├─────────────────────────────────────────┤
│      API-backed hostel details cards      │
└─────────────────────────────────────────┘
└── Logout Confirmation Modal ──┘
```

Recent activity is shown on the dashboard rather than the homepage.

### 5.5 Student Dashboard (dashboard.html)
**Layout:**
```
┌─────────────────────────────────────────┐
│              Navigation Bar              │
├─────────────────────────────────────────┤
│              Welcome Section             │
│           Avatar + User Info             │
├─────────────────────────────────────────┤
│                Stats Cards               │
│ (Saved, Explored, Searches, Account)      │
├─────────────────────────────────────────┤
│ ┌─────────────┬─────────────────────┐   │
│ │ Saved Hostels│   Verified Profile   │   │
│ │   Section    │ Name/Email/Index No. │   │
│ └─────────────┴─────────────────────┘   │
├─────────────────────────────────────────┤
│              Recent Activity             │
└─────────────────────────────────────────┘
```

The dashboard does not display bookings, booking history, spending, or profile-edit controls.

### 5.6 Hostel Details (hostel-details.html)
- Listing image, name, location/distance, price/payment term, description, and amenities
- Save/remove favorite button for authenticated students
- Phone and WhatsApp actions only when a contact phone is present
- Missing manager contact is shown as unavailable; no placeholder phone number is dialed

### 5.7 Manager Listing Creation (add-hostel.html)
- Manager-only form for creating a hostel listing
- Session/role check before use; API also enforces manager role
- Editing/deleting existing listings is not provided

## 6. Responsive Design

### 6.1 Breakpoints
| Breakpoint | Width | Target Device | Adjustments |
|---|---|---|---|
| **Mobile** | < 576px | Phones | Single column, stacked layouts, hamburger menu |
| **Tablet** | 576px - 768px | Small tablets | 2-column grid, adjusted spacing |
| **Medium** | 768px - 992px | Tablets/Laptops | 2-3 column grid |
| **Desktop** | 992px - 1200px | Laptops | 3-column grid, full layout |
| **Large Desktop** | > 1200px | Large screens | Max-width containers, optimal spacing |

### 6.2 Responsive Patterns
- **Grid System**: CSS Grid with `auto-fit` and `minmax()`
- **Flexbox**: For navigation, cards, forms
- **Media Queries**: Breakpoint-specific styles
- **Images**: Responsive with `max-width: 100%`
- **Typography**: Fluid sizing where appropriate
- **Navigation**: Collapsible hamburger menu on mobile

## 7. Interactive Elements

### 7.1 Animations & Transitions
| Element | Animation | Duration | Purpose |
|---|---|---|---|
| **Buttons** | Background color change | 0.2s ease | Hover feedback |
| **Cards** | Box-shadow elevation | 0.3s ease | Hover lift effect |
| **Links** | Color transition | 0.2s ease | Smooth hover |
| **Modals** | Fade in/out | 0.3s ease | Smooth appearance |
| **Spinners** | Rotation | 1s linear infinite | Loading indicator |

### 7.2 Current Interactions
- **Favorites**: Save/remove actions are available from the details page.
- **Form Validation**: Forms use required fields and client-side checks where implemented.
- **Authentication Feedback**: Login and signup provide status/error feedback.
- **OTP Timer**: Signup verification displays a countdown and resend action.
- **Loading Feedback**: Async form actions expose loading state where implemented.

## 8. UI States

### 8.1 Loading States
- Loading and disabled-button feedback varies by page and operation.
- A consistent skeleton-loading pattern is not implemented.

### 8.2 Empty States
- **No Hostels Found**: Search/filter no-results feedback is shown.
- **No Favorites**: The dashboard explains that no hostels have been saved and points students back to discovery.

### 8.3 Error States
- **Form Errors**: Red text below inputs
- **API Errors**: Inline messages or alerts depending on the page
- **Network/API failures**: User feedback is present but not a uniform retry experience

### 8.4 Success States
- **Registration Success**: Modal/alert with confirmation
- **Login Success**: Confirmation popup before redirect
- **Password Reset Success**: Confirmation message

## 9. Iconography
- **Library**: Font Awesome (mentioned in PROJECT_PLAN)
- **Usage**: Location pins, home icons, user icons, heart, search, filter, etc.
- **Style**: Solid/regular icons matching color palette
- **Size**: 16px, 18px, 20px, 24px

## 10. Image Guidelines
- **Hostel Images**: Use external URLs (current approach)
- **Placeholders**: Use stock images or placeholders for missing images
- **Optimization**: Keep image sizes reasonable
- **Alt Text**: Always provide descriptive alt text
- **Aspect Ratio**: 16:9 or 4:3 for hostel cards

## 11. Accessibility Verification Checklist
This is a checklist for future/manual verification, not a claim that every item has passed.
- [ ] Semantic HTML elements used
- [ ] Proper heading hierarchy (H1-H6)
- [ ] Form labels associated with inputs
- [ ] Alt text for all images
- [ ] Sufficient color contrast ratios
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] ARIA labels for icons/buttons where needed
- [ ] Responsive text sizing
- [ ] Error messages associated with inputs

## 12. UI Development Priorities

### Immediate
1. **Accessibility review**: Verify labels, keyboard behavior, focus visibility, and contrast across pages.
2. **Responsive verification**: Test discovery, details, dashboard, and manager listing forms on mobile and desktop.
3. **Error/loading consistency**: Improve recovery and feedback for failed API requests.
4. **Security-flow verification**: Test authentication and role-specific views against the deployed configuration.

### Short-term
1. **Manager listing management**: Add edit/remove actions with backend ownership enforcement.
2. **Booking/viewing requests**: Design the workflow before adding booking controls.
3. **Notifications**: Consider consistent toast feedback and skeleton loading after current journeys are verified.
4. **Image handling**: Improve fallback and optimization behavior.

### Long-term
1. **Reviews**: Define moderation and abuse handling before designing a review flow.
2. **Advanced filters**: Prioritize based on student feedback.
3. **Payments**: No payment flow is currently implemented or committed to scope.

## 13. Design Tools & Assets
- **Design Approach**: Direct HTML/CSS/JS implementation
- **CSS Framework**: Custom CSS (no framework)
- **Icons**: Font Awesome
- **Images**: External URLs, no local asset pipeline yet
- **Prototyping**: Implemented directly in code

## 14. UI Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS/Android)
- [ ] Test all forms with validation
- [ ] Test responsive breakpoints
- [ ] Test modal interactions
- [ ] Test navigation flows
- [ ] Test loading and error states
- [ ] Verify accessibility with keyboard navigation
- [ ] Check color contrast
- [ ] Test on slow network connections
