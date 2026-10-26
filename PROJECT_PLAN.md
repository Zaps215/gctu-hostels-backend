# GCTU StudentHostels — Project Plan and Progress Report

**Project:** Student hostel discovery platform for Ghana Communication Technology University (GCTU)
**Repository:** `Zaps215/gctu-hostels-backend`
**Current status date:** October 2026
**Live frontend:** https://student-hostels.netlify.app
**Live backend:** https://gctu-hostels-backend.onrender.com

---

## 1. Project Summary

GCTU StudentHostels helps students find and compare hostels around the GCTU Tesano campus. The application currently consists of:

- A public marketing and hostel-discovery frontend (HTML, CSS, vanilla JavaScript).
- A Node.js/Express backend with a complete session-based authentication system.
- Email OTP verification powered by Brevo.
- MongoDB persistence through Mongoose.
- Production deployment on Netlify (frontend) and Render (backend).

The project has reached the stage where **user accounts and authentication are functional end-to-end**, while the **hostel catalog, bookings, favourites, and dashboard data are still hardcoded on the frontend**.

---

## 2. Architecture

| Layer | Technology | Location |
|---|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript, Font Awesome | `gctu-hostels-frontend/src/` |
| Backend | Node.js 20.18.0, Express 5 | `gctu-hostels-backend/` |
| Database | MongoDB Atlas + Mongoose | configured in `config/db.js` |
| Sessions | `express-session` + `connect-mongo` | `server.js` |
| Email | Brevo transactional email API | `config/email.js` |
| Hosting | Render (API) and Netlify (static site) | deployment settings |

### Backend structure

```
config/       database and email configuration
middleware/   auth middleware (currently empty)
models/       User and OTP schemas
routes/       auth routes, hostel routes (empty), sitemap
utils/        password strength validator
server.js     app setup, security middleware, session, routes
```

### Frontend structure

```
index.html                  public landing page
landingpage.js/.css         hostel cards, filters, reviews
signup.html + script.js     registration with OTP modal
login.html + login.js       login and loading states
forgot-password.*           request reset code
verify-reset-otp.*          verify reset code
set-new-password.*          set new password
homepage.html               authenticated home view
dashboard.html              authenticated dashboard view
```

---

## 3. Work Completed So Far

### Milestone 1 — Project foundation and deployment

Status: **Complete**

- Initialized the Node.js/Express backend with CommonJS modules.
- Connected MongoDB Atlas with error handling and process exit on failure.
- Configured environment variables with `dotenv`.
- Pinned Node.js `20.18.0` for Render compatibility.
- Added a `build` script using `--legacy-peer-deps` to resolve Render dependency conflicts.
- Separated frontend and backend into two deployable folders.
- Deployed the backend on Render and the frontend on Netlify.
- Updated all frontend API calls to the Render backend URL.
- Configured CORS for local development and production Netlify/Render origins.

### Milestone 2 — User registration and email verification

Status: **Complete**

- Built `User` model with `fullName`, `username`, `email`, `password`, and `createdAt`.
- Added unique constraints and lowercase/trim normalization for email.
- Added bcrypt password hashing via a Mongoose `pre('save')` hook.
- Added a `comparePassword` instance method.
- Added a reusable password strength validator requiring:
  - at least 8 characters,
  - one uppercase letter,
  - one lowercase letter,
  - one number,
  - one special character.
- Built the registration flow:
  1. `POST /api/send-otp` validates input, checks duplicate username/email, generates a 6-digit OTP, stores it with a 10-minute expiry, saves temporary signup data in the session, and sends the OTP email.
  2. `POST /api/verify-otp` validates the OTP, marks it used, creates the user, and clears temporary session data.
- Added an OTP model with expiry and `used` flags.
- Added frontend OTP modal with:
  - masked email display,
  - 10-minute countdown timer,
  - resend functionality,
  - verify and cancel actions.

### Milestone 3 — Login, session, and logout

Status: **Complete**

- Built `POST /api/login` using username and bcrypt password comparison.
- Stored the authenticated user ID in the server-side session.
- Added `GET /api/me` to return the current user (excluding password).
- Added `POST /api/logout` to destroy the session.
- Protected the homepage and dashboard by redirecting unauthenticated users to login.
- Added loading spinners and error messages to login, signup, and password reset forms.
- Added a login success popup and redirect to the homepage.

### Milestone 4 — Password reset

Status: **Complete for the UI flow; backend flow needs hardening**

- Added `POST /api/forgot-password` to check the email, generate a 10-minute OTP, and send a reset email.
- Added `POST /api/verify-reset-otp` to validate and consume the reset OTP.
- Added `POST /api/reset-password` to validate the new password and save it hashed through the User model hook.
- Built the full frontend flow:
  `forgot-password.html` → `verify-reset-otp.html` → `set-new-password.html` → `login.html`.
- Added OTP timers, masked email display, password strength checks, confirmation matching, and success popups.

### Milestone 5 — Email delivery

Status: **Complete**

- Replaced early Gmail SMTP/nodemailer experiments with the Brevo transactional email API.
- Integrated the `@getbrevo/brevo` SDK.
- Centralized email sending in `config/email.js`.
- Added branded HTML email templates for signup verification and password reset.
- Added success/failure handling for email delivery.

### Milestone 6 — Security hardening

Status: **Substantial, with remaining gaps**

- Added `helmet` security headers.
- Limited JSON and URL-encoded bodies to `10kb` to reduce payload abuse.
- Added `express-mongo-sanitize` to strip NoSQL operators from user input.
- Added `hpp` to prevent HTTP parameter pollution.
- Added a query object patch to keep sanitization compatible with Express 5.
- Added a global rate limiter of 100 requests per 15 minutes per IP.
- Added a stricter auth limiter of 10 attempts per 15 minutes on login, signup, OTP, and reset endpoints.
- Enabled `trust proxy` for Render.
- Configured secure, `httpOnly`, `sameSite` cookies for production.
- Configured CORS with an explicit origin allowlist.

### Milestone 7 — Authenticated UI

Status: **UI complete; data still mocked**

- Built an authenticated homepage showing:
  - welcome banner,
  - user avatar initials,
  - recommended hostel cards,
  - recent activity,
  - logout confirmation modal.
- Built a dashboard showing:
  - welcome section and avatar,
  - stats cards,
  - current bookings,
  - booking history,
  - saved hostels,
  - profile summary,
  - recent activity,
  - dark mode toggle,
  - quick search and logout.
- Wired both pages to `GET /api/me` for the real user identity.
- Bookings, favourites, activity, and spending figures are currently sample data.

### Milestone 8 — Public landing page and discovery UI

Status: **Complete as a frontend prototype**

- Built a landing page with hero section, statistics, search, filters, hostel cards, and student testimonials.
- Added filtering by availability, budget, nearby, and far.
- Added live client-side name/location search.
- Added hostel cards linking to official hostel websites.
- Added contact form handled by Netlify Forms and a thank-you page.
- Added pricing/payment preview UI (visual only).

### Milestone 9 — SEO and search console

Status: **Complete**

- Added a dynamic `/sitemap.xml` route using the `sitemap` package.
- Registered the sitemap route in `server.js`.
- Added a Netlify redirect so `/sitemap.xml` resolves to the backend.
- Added Google Search Console verification file.
- Added page titles across the application.

### Milestone 10 — Development workflow

Status: **Complete**

- Used feature branches and pull requests for sitemap and CodeRabbit setup.
- Added CodeRabbit review workflow testing.
- Maintained a single `main` deployment branch.

---

## 4. What Works End-to-End Today

| Flow | Status |
|---|---|
| Register with email OTP | Working |
| OTP email delivery | Working |
| Login with username/password | Working |
| Session persistence across requests | Working |
| Logout | Working |
| Forgot password email | Working |
| Verify reset OTP | Working |
| Set new password | Working |
| Load current user on homepage/dashboard | Working |
| Hostel browsing, search, filters | Working, but static data |
| Production deployment | Working |
| Sitemap and search console | Working |

---

## 5. Current Gaps and Technical Debt

### High priority

1. **Password reset can bypass OTP verification.** `/api/reset-password` trusts any supplied email. The verification step does not create a server-side verified marker. Anyone who knows an email can reset that account.
2. **Temporary signup stores plaintext passwords in the session store.** Move to a short-lived signed token or encrypted record, or hash before temporary storage.
3. **`POST /api/signup` bypasses OTP and password-strength validation.** Remove it or restrict it to internal/admin use.
4. **No hostel data model or hostel API.** Hostel data is duplicated in `landingpage.js` and `homepage.html` and is not persisted.
5. **Bookings, favourites, activity, and dashboard stats are mock data.**
6. **`middleware/authMiddleware.js` and `routes/hostelRoutes.js` are empty.** Protected-route middleware has not been implemented.
7. **No centralized error handling or request validation layer.**
8. **Debug middleware logs full session data and session IDs** in `server.js`; remove for production.

### Medium priority

9. OTPs are stored in plaintext and have no attempt limit or cooldown beyond rate limiting.
10. Frontend API base URL is hardcoded to Render in every file, preventing clean local development.
11. No `.env.example`, setup instructions, or API documentation.
12. No automated tests or CI pipeline beyond PR review.
13. Contact form, payment screen, and "Start Booking" button are not connected to backend logic.
14. Login error messages reveal whether a username exists.
15. No account roles, admin interface, or hostel management workflow.

### Low priority

16. `OTP` model contains an unused `signupData` field.
17. The sitemap only lists static pages.
18. Some UI copy and footer links (KNUST, UG, UCC) are unrelated to GCTU.
19. No image asset pipeline; hostel images rely on external URLs.
20. Accessibility, Lighthouse performance, and mobile QA have not been formally tested.

---

## 6. Recommended Roadmap

### Phase 1 — Security and cleanup (1 week)

Objective: make the existing authentication system safe and production-ready.

- Add a server-side verified-reset mechanism:
  - on successful `/api/verify-reset-otp`, set a short-lived signed reset token or session flag tied to the email;
  - require it in `/api/reset-password`;
  - invalidate it after use.
- Remove or protect `POST /api/signup`.
- Stop storing plaintext passwords in the session.
- Hash OTP codes before storage and add an attempt counter.
- Remove session debug logging.
- Add basic input validation for all routes.
- Add centralized error handling middleware.
- Add `.env.example` and rotate any exposed credentials.
- Use a generic login failure message.

**Acceptance criteria:** no auth endpoint can be used without completing its intended prior step; no plaintext password or debug session data is stored or logged.

### Phase 2 — Hostel catalog API (1–2 weeks)

Objective: replace hardcoded hostel data with a real database-backed catalog.

- Create `models/Hostel.js` with name, slug, description, location, price, price label, amenities, availability, category, distance, images, official URL, contact details, and timestamps.
- Create `routes/hostelRoutes.js`:
  - `GET /api/hostels` with search, filter, sort, and pagination;
  - `GET /api/hostels/:id`;
  - protected admin create/update/delete endpoints.
- Add a seed script with the current six hostels.
- Register routes in `server.js`.
- Build `middleware/authMiddleware.js` with `requireAuth` and `requireAdmin`.
- Refactor `landingpage.js` and `homepage.html` to fetch hostels from the API.
- Add loading, empty, and error states.

**Acceptance criteria:** one source of truth for hostel data; public listing works while unauthenticated; admin writes are protected.

### Phase 3 — User activity, favourites, and bookings (2 weeks)

Objective: make the dashboard reflect real user actions.

- Create `Booking`, `Favorite`, and `Activity` models.
- Add endpoints for:
  - saving/removing favourites,
  - creating and listing booking requests,
  - recording and reading activity,
  - dashboard summary statistics.
- Replace mock arrays in `homepage.html` and `dashboard.html`.
- Define the booking flow:
  - Option A (recommended for current scope): a booking request/referral that records interest and redirects to the hostel's official site.
  - Option B: in-app booking with payment (larger scope, phase 5).
- Add empty states when a user has no bookings or favourites.

**Acceptance criteria:** dashboard values are derived from the database, not constants; a user sees only their own data.

### Phase 4 — Admin and hostel management (1–2 weeks)

Objective: allow non-developers to manage listings.

- Add a `role` field to the User model (`student`, `admin`).
- Build admin-only hostel CRUD screens.
- Add image URL management or upload integration.
- Add listing status (`draft`, `published`, `archived`).
- Add moderation for testimonials/reviews if they are moved to the database.

**Acceptance criteria:** an admin can add a hostel and see it appear on the public site without a code deployment.

### Phase 5 — Payments and booking confirmation (optional, 2–3 weeks)

Objective: support real in-app bookings if the product moves beyond referral.

- Integrate Paystack (Ghana-friendly) or a comparable provider.
- Create booking records with status transitions (`pending`, `paid`, `confirmed`, `cancelled`).
- Add webhook verification and idempotency.
- Generate receipts and confirmation emails.
- Add cancellation policy and refund handling.

**Acceptance criteria:** payment state is server-verified, never trusted from the client; failed payments do not create confirmed bookings.

### Phase 6 — Quality, documentation, and release (ongoing)

Objective: make the project maintainable and demonstrable.

- Add API integration tests for auth and hostel routes.
- Add a CI workflow for install, lint, and tests.
- Add a README with setup, environment variables, scripts, and architecture.
- Add a Postman/OpenAPI collection or endpoint table.
- Add structured logging and uptime monitoring.
- Run Lighthouse and accessibility checks.
- Add privacy policy and terms pages.
- Add a staging environment and database backup plan.

**Acceptance criteria:** a new developer can clone, configure, run, and test the project using the README; CI passes on every pull request.

---

## 7. Suggested Two-Week Sprint

| Day | Focus |
|---|---|
| 1–2 | Fix reset-password verification, remove direct signup route, remove plaintext session password |
| 3 | Add OTP hashing, attempt limits, and generic login errors |
| 4 | Add centralized error handling, validation, `.env.example`, remove debug logs |
| 5 | Create Hostel model and seed script |
| 6–7 | Build hostel list/detail API and auth middleware |
| 8–9 | Connect landing page and authenticated homepage to the hostel API |
| 10 | Add loading/empty/error states and test mobile layouts |
| 11–12 | Create favorites and activity models and endpoints |
| 13 | Connect dashboard favourites/stats to real data |
| 14 | Regression test, update README, open PR, deploy |

---

## 8. Definition of Done Checklist

- [ ] All authentication flows require the correct prior step.
- [ ] No secrets, plaintext passwords, or sensitive session data are committed or logged.
- [ ] Hostel data comes from the database.
- [ ] Users can only read and modify their own bookings and favourites.
- [ ] Protected API routes reject unauthenticated requests with `401`.
- [ ] Admin routes reject non-admin users with `403`.
- [ ] Every endpoint validates input and returns consistent error shapes.
- [ ] The frontend handles loading, empty, and failure states.
- [ ] Automated tests cover signup, login, reset, and hostel listing.
- [ ] README, `.env.example`, and API documentation exist.
- [ ] Production deployment and cookie/CORS settings are verified.

---

## 9. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Password reset bypass | Account takeover | Bind reset to a verified, expiring server-side token |
| Plaintext password in session store | Credential exposure | Use a signed short-lived signup token or hash before storage |
| Hardcoded/mock data drift | Misleading dashboard | Move all data to MongoDB in Phase 2–3 |
| Duplicate hostel data in two frontends | Inconsistent listings | Single hostel API and shared fetch layer |
| No automated tests | Regressions in auth | Add integration tests and CI |
| Render cold starts | Slow first request | Uptime ping, paid instance, or status messaging |
| Third-party email limits | OTP delivery failure | Monitor Brevo quota, add retry and fallback |
| Frontend API URL hardcoded | Local development friction | Central `config.js` with environment switching |

---

## 10. Immediate Next Five Tasks

1. Secure `/api/reset-password` by requiring proof of OTP verification.
2. Remove the OTP-bypassing `/api/signup` route and stop storing plaintext passwords in sessions.
3. Add `models/Hostel.js`, `routes/hostelRoutes.js`, and a seed script.
4. Implement `middleware/authMiddleware.js` with `requireAuth` and `requireAdmin`.
5. Connect `landingpage.js` and `homepage.html` to `GET /api/hostels` and delete the duplicated arrays.

---

## 11. Summary

The project has a solid foundation: deployed frontend and backend, complete account creation with email OTP, session-based login, password reset UI, security middleware, and a polished responsive interface. The largest remaining gap is that the product is still a **hostel discovery prototype** rather than a data-driven booking platform. The next milestone should focus on security correctness and replacing hardcoded hostel, booking, and dashboard data with real backend models and APIs.
