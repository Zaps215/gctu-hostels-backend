# UI PLAN Document

**Project:** GCTU StudentHostels
**Version:** 1.0
**Date:** October 2026
**Status:** In Progress
**Related:** PRD v1.0, User Flow v1.0

---

## 1. Overview

This document outlines the User Interface design strategy, components, layouts, and design system for the GCTU StudentHostels platform - the central hub for all hostel platforms. The design follows a clean, student-friendly approach with focus on usability and mobile responsiveness to help students discover all hostels in one place.

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
| **Primary** | `#0066cc` / `#007bff` | Buttons, links, CTAs | Brand primary action color |
| **Primary Dark** | `#0056b3` | Hover states | Interactive element hover |
| **Secondary** | `#6c757d` | Secondary buttons | Less prominent actions |
| **Success** | `#28a745` | Success messages, confirmations | Positive feedback |
| **Danger** | `#dc3545` | Errors, logout, warnings | Error states |
| **Warning** | `#ffc107` | Warnings, alerts | Caution states |
| **Info** | `#17a2b8` | Information messages | Informational feedback |
| **Background** | `#f8f9fa` / `#ffffff` | Page backgrounds | Main background |
| **Text Primary** | `#333333` / `#212529` | Body text | Main content |
| **Text Secondary** | `#6c757d` | Labels, meta info | Secondary content |
| **Border** | `#dee2e6` / `#e0e0e0` | Cards, inputs | Element borders |

### 3.2 Typography

| Element | Font Family | Weight | Size (Desktop) | Size (Mobile) | Usage |
|---|---|---|---|---|---|
| **Headings H1** | System/Arial/Sans-serif | 700 (Bold) | 2.5rem - 3rem | 2rem - 2.5rem | Page titles |
| **Headings H2** | System/Arial/Sans-serif | 600-700 | 2rem - 2.5rem | 1.75rem - 2rem | Section titles |
| **Headings H3** | System/Arial/Sans-serif | 600 | 1.5rem - 1.75rem | 1.25rem - 1.5rem | Card titles |
| **Body Text** | System/Arial/Sans-serif | 400 (Regular) | 1rem | 0.9rem - 1rem | Main content |
| **Small Text** | System/Arial/Sans-serif | 400 | 0.875rem | 0.8rem | Labels, captions |
| **Button Text** | System/Arial/Sans-serif | 600 | 0.9rem - 1rem | 0.875rem - 0.9rem | CTAs |

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
- Navigation links (Home, Hostels, Contact)
- Sign Up / Login buttons
- Mobile hamburger menu (responsive)

**Structure:**
```html
<nav class="navbar">
  <div class="nav-brand">GCTU StudentHostels</div>
  <ul class="nav-menu">
    <li><a href="#home">Home</a></li>
    <li><a href="#hostels">Hostels</a></tag></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="signup.html" class="btn btn-primary">Sign Up</a></li>
    <li><a href="login.html" class="btn btn-outline">Login</a></li>
  </ul>
</nav>
```

#### Header/Navbar (Authenticated)
**Purpose:** Navigation for logged-in students
**Elements:**
- Logo
- Navigation links (Home, Dashboard, Hostels)
- User avatar with initials
- Logout button/modal trigger
- Responsive menu

### 4.2 Button Components

| Type | Style | Usage |
|---|---|---|
| **Primary** | `background: #007bff; color: white;` | Main actions (Sign Up, Login, Submit) |
| **Secondary** | `background: #6c757d; color: white;` | Secondary actions |
| **Outline** | `background: transparent; border: 2px solid #007bff; color: #007bff;` | Alternative actions |
| **Danger** | `background: #dc3545; color: white;` | Delete, Logout confirmation |
| **Success** | `background: #28a745; color: white;` | Confirmations |
| **Link** | `background: transparent; color: #007bff; text-decoration: underline;` | Text links |

### 4.3 Form Components

#### Input Fields
- **Text Input**: Standard text entry with label
- **Email Input**: Email validation
- **Password Input**: With show/hide toggle (planned)
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
- "View Details" / "Book Now" button
- Favorite heart icon (planned)

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
│ [View Details Button]   │
└─────────────────────────┘
```

#### Stats Card (Dashboard)
**Purpose:** Display user statistics
**Elements:**
- Icon
- Value (number)
- Label
- Optional trend indicator

### 4.5 Modal Components

#### OTP Modal
**Purpose:** Email verification during signup
**Elements:**
- Title "Verify Your Email"
- Masked email display
- 6-digit OTP input fields
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
3. **Filters**: Budget, availability, distance filters
4. **Hostel Grid**: Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
5. **Testimonials**: Student reviews
6. **Contact**: Netlify Forms integration
7. **Footer**: Links, copyright

### 5.2 Login Page (login.html)
**Layout:**
```
┌─────────────────────────────────────────┐
│                Centered Card             │
│  ┌─────────────────────────────────┐   │
│  │          Login Form              │   │
│  │  - Username/Email input          │   │
│  │  - Password input                │   │
│  │  - Forgot Password link          │   │
│  │  - Login Button                  │   │
│  │  - Sign Up link                  │   │
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
│  │  - Username                      │   │
│  │  - Email                         │   │
│  │  - Password                      │   │
│  │  - Password Strength Indicator   │   │
│  │  - Sign Up Button                │   │
│  │  - Login link                    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
└── OTP Modal (overlay) ──┘
```

### 5.4 Student Homepage (homepage.html)
**Layout:**
```
┌─────────────────────────────────────────┐
│              Navigation Bar              │
├─────────────────────────────────────────┤
│              Welcome Banner              │
│        "Welcome back, [User Name]!"      │
├─────────────────────────────────────────┤
│             Recommended Hostels          │
│              (Card Grid)                 │
├─────────────────────────────────────────┤
│              Recent Activity             │
│                (List View)               │
├─────────────────────────────────────────┤
│                Quick Actions             │
└─────────────────────────────────────────┘
└── Logout Confirmation Modal ──┘
```

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
│        (Bookings, Saved, Spent)          │
├─────────────────────────────────────────┤
│ ┌─────────────┬─────────────────────┐   │
│ │   Bookings   │      Saved Hostels   │   │
│ │   Section    │        Section       │   │
│ ├─────────────┼─────────────────────┤   │
│ │   History    │      Profile         │   │
│ │   Section    │        Summary       │   │
│ └─────────────┴─────────────────────┘   │
├─────────────────────────────────────────┤
│              Recent Activity             │
└─────────────────────────────────────────┘
```

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

### 7.2 Micro-interactions
- **Heart/Favorite**: Scale animation on click (planned)
- **Form Validation**: Shake animation on error (planned)
- **Success Popup**: Fade in/out animation
- **OTP Timer**: Countdown animation
- **Loading States**: Button disabled with spinner

## 8. UI States

### 8.1 Loading States
- **Page Load**: Skeleton screens or spinners
- **Button Loading**: Disabled button with spinner and text
- **Form Submission**: Loading overlay
- **Data Fetch**: Spinner in cards/grid area

### 8.2 Empty States
- **No Hostels Found**: Illustration + message "No hostels found matching your filters"
- **No Favorites**: Message "You haven't saved any hostels yet"
- **No Bookings**: Message "No booking requests yet"
- **Search Results Empty**: Suggest adjusting filters

### 8.2 Error States
- **Form Errors**: Red text below inputs
- **API Errors**: Toast/alert messages
- **Network Error**: Retry button
- **404 Page**: Not found message (planned)

### 8.4 Success States
- **Registration Success**: Modal/alert with confirmation
- **Login Success**: Popup animation
- **Password Reset Success**: Confirmation message
- **Booking Request Success**: Confirmation popup (planned)

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

## 11. Accessibility Checklist
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

### Immediate (MVP Critical)
1. **Hostel Card Redesign**: Ensure consistent card layout
2. **Dashboard Data Integration**: Replace mock with real data UI
3. **Favorites UI**: Add heart icons and favorite functionality
4. **Booking UI**: Add booking buttons and modals
5. **Loading States**: Add spinners for all async operations

### Short-term (Post-MVP Polish)
1. **Dark Mode**: Complete dashboard dark mode implementation
2. **Mobile Menu**: Improve hamburger menu functionality
3 **Image Optimization**: Better placeholder handling
4. **Toast Notifications**: Replace alerts with toast messages
5. **Skeleton Loaders**: Add skeleton screens

### Long-term
1. **Admin Dashboard UI**: Design admin interface
2. **Hostel Detail Page**: Dedicated detail view page
3. **Advanced Filters**: More filter options UI
4. **Reviews UI**: Connect review system
5. **Payment UI**: Design payment flow

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
