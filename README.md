# GCTU StudentHostels

> A student hostel discovery platform for students at Ghana Communication Technology University (GCTU), Tesano campus.

[![Node.js](https://img.shields.io/badge/Node.js-20.18.0-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?logo=javascript&logoColor=222)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

GCTU StudentHostels helps students browse accommodation near campus, compare hostel details, and keep track of hostels they have saved. The project is a lightweight full-stack web application: a static HTML/CSS/JavaScript frontend backed by an Express API and MongoDB.

## Live application

- **Frontend:** [student-hostels.netlify.app](https://student-hostels.netlify.app)
- **Backend API:** [gctu-hostels-backend.onrender.com](https://gctu-hostels-backend.onrender.com)
- **Sitemap:** [gctu-hostels-backend.onrender.com/sitemap.xml](https://gctu-hostels-backend.onrender.com/sitemap.xml)

## Features

- **Hostel discovery:** Browse hostel listings and view details, prices, locations, amenities, and contact options.
- **Search and filters:** Search by hostel name or location; filter by availability, budget, walking distance, price range, and amenities.
- **Email-verified accounts:** Register and reset a password using one-time codes delivered through Brevo.
- **Session-based authentication:** Login, logout, current-user lookup, and protected user-specific API routes.
- **Saved hostels:** Save and remove favorites; records are associated with the authenticated account.
- **Manager dashboard:** Provisioned managers can create, edit, and delete only their own listings; student discovery pages refresh listing data automatically while open.
- **Activity and dashboard:** Record successful logins, hostel views, searches, and contact actions. Repeat visits to a hostel are stored and counted as one explored hostel; each successful login is recorded once.
- **Responsive interface:** Static pages built with HTML, CSS, and vanilla JavaScript.

## Technology

| Area | Technologies |
|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript, Font Awesome |
| API | Node.js 20.18.0, Express 5 |
| Database | MongoDB Atlas or MongoDB, Mongoose |
| Authentication and shared state | `express-session`, `connect-redis`, `rate-limit-redis`, `bcryptjs` |
| Email | Brevo transactional email API |
| Deployment | Netlify (frontend), Render (backend) |

## Repository layout

```text
.
├── docs/                         # Product, technical, UX, and development plans
├── gctu-hostels-backend/
│   ├── config/                   # MongoDB, Redis, and email configuration
│   ├── middleware/               # Authentication middleware
│   ├── models/                   # User, hostel, favorite, activity, and OTP models
│   ├── routes/                   # Authentication, hostel, sitemap, and user-data routes
│   ├── utils/                    # Shared backend utilities
│   ├── server.js                 # Express application entry point
│   └── seedHostels.js            # Optional hostel data seed script
├── gctu-hostels-frontend/
│   └── src/                      # Static frontend pages, scripts, styles, and assets
└── PROJECT_PLAN.md               # Project roadmap and current progress
```

## Run locally

### Prerequisites

- Node.js **20.18.0** (the version in `gctu-hostels-backend/.node-version`)
- npm
- A MongoDB database (local or MongoDB Atlas)
- A Redis server (local or hosted)
- A Brevo API key for email verification and password-reset emails

### 1. Clone the repository

```bash
git clone https://github.com/Zaps215/gctu-hostels-backend.git
cd gctu-hostels-backend
```

### 2. Configure and start the backend

```bash
cd gctu-hostels-backend
npm install
```

Create `gctu-hostels-backend/.env` with your own development credentials:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/gctu-hostels
REDIS_URL=redis://127.0.0.1:6379
SESSION_SECRET=replace-with-a-long-random-secret
OTP_SECRET=optional-dedicated-random-secret
BREVO_API_KEY=your-brevo-api-key
ADMIN_SECRET=replace-with-a-long-random-secret
```

Redis stores login sessions and shared rate-limit counters. Start the local Redis service before the backend; in production, set `REDIS_URL` to a hosted TLS connection URL using `rediss://`. The backend waits for Redis and MongoDB before listening and does not fall back to in-memory sessions or rate limits. `SESSION_SECRET` is required. `OTP_SECRET` is optional; when omitted, OTP hashes use `SESSION_SECRET`. If set, use a separate long random secret. For MongoDB Atlas, use your Atlas connection URI as `MONGO_URI`. Do not commit `.env` or paste real credentials into issues, pull requests, or documentation.

Start the API:

```bash
npm run dev
```

The backend listens on port `5000` by default. `npm start` starts it without the development file watcher.

### 3. Serve the frontend

Serve `gctu-hostels-frontend/src/` using a local static server, such as the VS Code Live Server extension. Use `http://localhost:5500` or `http://127.0.0.1:5500`; the frontend configuration recognizes these hostnames and connects to the API on port `5000`.

Do not open the HTML files using a `file://` URL. The frontend uses browser cookies and API requests, so it should be served over HTTP.

The API base URL is selected in `gctu-hostels-frontend/src/config.js`: local hostnames use the local backend, and other hostnames use the deployed Render API.
Netlify reads `gctu-hostels-frontend/src/_headers` for the frontend security headers. If an inline script changes, update its matching SHA-256 source in that file so the script remains permitted by the content security policy.

### Optional: seed hostel data

```bash
cd gctu-hostels-backend
node seedHostels.js
```

The seed script adds only missing sample listings and leaves existing listings unchanged.

## API overview

All API routes are hosted under `/api`. Routes marked **Session required** expect the session cookie created by login.

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/send-otp` | Public | Start email-verified registration |
| `POST` | `/api/verify-otp` | Public | Verify registration code and create account |
| `POST` | `/api/signup` | Disabled | Returns `403`; registration must use OTP |
| `POST` | `/api/login` | Public | Start an authenticated session |
| `POST` | `/api/logout` | Public | End the current session |
| `POST` | `/api/register-manager` | Admin secret required | Create a verified manager account |
| `GET` | `/api/me` | Session required | Return the current user |
| `POST` | `/api/forgot-password` | Public | Request a password-reset code |
| `POST` | `/api/verify-reset-otp` | Public | Verify the password-reset code |
| `POST` | `/api/reset-password` | Verified reset session | Set a new password |

Provision manager accounts from a trusted environment, not from frontend code. Set `ADMIN_SECRET` in the backend environment, then send it in the `x-admin-secret` header:

```bash
curl -X POST "$API_URL/api/register-manager" \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -d '{"fullName":"Manager Name","username":"manager-login","email":"manager@example.com","password":"Use-a-strong-password1!"}'
```

Keep the secret out of source control, browser code, and client-side requests.

### Hostels

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/hostels` | Public | List hostels; accepts `search`, `gender`, `maxPrice`, `sort`, and `university` query parameters |
| `GET` | `/api/hostels/:id` | Public | Return one hostel |
| `GET` | `/api/hostels/mine` | Manager session | List the signed-in manager's hostel listings |
| `GET` | `/api/hostels/mine/:id` | Owning manager session | Get one of the manager's listings for editing |
| `POST` | `/api/hostels` | Manager session | Create a hostel record owned by the signed-in manager |
| `PUT` | `/api/hostels/:id` | Owning manager session | Update an owned listing; changes are immediately returned by public listing APIs |
| `DELETE` | `/api/hostels/:id` | Owning manager session | Delete an owned listing |

Example:

```text
GET /api/hostels?search=Tesano&maxPrice=3000&sort=price-asc&page=1&limit=50
```

Hostel search treats search text literally (up to 100 characters), and listing results are paginated with a maximum page size of 50. The response includes `pagination.page`, `pagination.limit`, `pagination.totalCount`, and `pagination.totalPages`; the public listing pages load all result pages to preserve their existing client-side filters.

### Favorites, activity, and dashboard

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/favorites` | Session required | List the current user's saved hostels |
| `PUT` | `/api/favorites/:hostelId` | Session required | Save a hostel |
| `DELETE` | `/api/favorites/:hostelId` | Session required | Remove a saved hostel |
| `POST` | `/api/activity` | Session required | Record a supported activity |
| `GET` | `/api/dashboard` | Session required | Return favorites, recent activity, and dashboard counts |
| `GET` | `/api/test` | Public | Check that the backend is responding |

Session-protected requests from the frontend must include credentials (cookies); the frontend utilities already do this.

## Current scope and known limitations

- Hostel browsing, favorites, and activity use MongoDB-backed API data.
- Bookings and payment processing are **not implemented**; contact actions do not create bookings.
- Hostel management requires a logged-in manager session. Managers can only edit or delete listings they own. Changes are saved to MongoDB and public listing/detail pages refresh automatically about every 30 seconds while open. Manager accounts are provisioned through the admin-secret-protected endpoint above.
- Search and discovery filters on the pages are applied client-side to the fetched hostel list.
- Run backend regression tests with `npm test --prefix gctu-hostels-backend`. These tests cover OTP handling, manager listing access, bounded hostel search, session revocation, and production Redis TLS configuration; they do not replace deployment or browser-level checks.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the current roadmap and [docs/](./docs/) for product and technical documentation.

## Contributing

1. Create a branch for your change.
2. Keep changes focused and follow the existing CommonJS and vanilla JavaScript patterns.
3. Before opening a pull request, run syntax checks for changed JavaScript and verify the affected flow locally.
4. Never include credentials, user data, or production database records in commits or test output.

## License

No repository-level license has been specified yet. Contact the repository owner before reusing or redistributing this project.
