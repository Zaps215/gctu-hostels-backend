# Development Plan

**Project:** GCTU StudentHostels
**Version:** 2.0
**Status:** Active development
**Last reviewed:** November 2026
**Related:** [PRD](./01_PRD.md), [TRD](./02_TRD.md), [MVP Scope](./03_MVP_SCOPE.md)

---

## 1. Purpose and Current-State Note

This plan tracks remaining work against the current repository source. It is not a deployment report: production behavior, live database configuration, and complete end-to-end flows have not been independently verified. Priorities should be revisited after those checks.

## 2. Current Baseline

Implemented in source:
- Student registration with email OTP, login, logout, and verified-session password reset
- Role-aware student and manager access; manager accounts are provisioned by an administrator
- MongoDB-backed hostel listings and public hostel discovery
- Client-side search and filters, hostel details, and favorite management
- Authenticated dashboard showing profile, saved listings, and activity metrics
- Manager listing creation
- Non-destructive sample listing seed behavior

Not implemented or still requiring verification:
- Booking/viewing-request workflow
- Editing and deleting hostel listings; manager/admin management UI
- OTP hashing and per-code attempt limits
- Comprehensive automated coverage of security and user journeys
- Production deployment, live email delivery, database, and end-to-end verification

See the TRD for endpoint and security details. Do not treat a feature as production-verified solely because it exists in source.

## 3. Prioritized Work

### P0 — Security and production readiness

| Task | Completion criteria |
|---|---|
| Hash OTPs at rest | Persist only a one-way hash; compare submitted codes safely; test expired and incorrect codes. |
| Bound OTP verification attempts | Enforce per-code attempt limits and invalidate/cool down exhausted codes; test resend and lockout behavior. |
| Review validation and authorization coverage | Exercise auth, manager provisioning, manager listing creation, favorites, and activity endpoints with valid and invalid roles/input. |
| Verify production configuration | Confirm secrets remain server-side, trusted origins are correct, secure cookie/session settings work behind the deployed proxy, and email delivery succeeds. |
| Complete end-to-end journey verification | Walk through student signup/login, discovery/filtering, details/contact, favorites, dashboard activity, logout, and manager-provisioned listing creation. Record failures and environment. |

### P1 — Core product completion

| Task | Completion criteria |
|---|---|
| Add booking/viewing requests | Define request lifecycle and manager notification/response behavior before implementing API, persistence, and UI. |
| Add listing update and removal | Allow authorized managers to manage only their own listings; define admin behavior and safe deletion semantics. |
| Add automated regression tests | Cover authentication, role boundaries, validation, favorites/activity, listing ownership, and non-destructive seeding. |
| Improve operational feedback | Replace remaining generic alerts where appropriate; provide accessible loading, empty, and error states without hiding API failures. |

### P2 — Follow-up improvements

- Add a manager-facing listing management view.
- Consider student reviews only after moderation and abuse-handling requirements are defined.
- Improve image delivery and test responsive layouts on target devices.
- Reassess analytics and additional discovery filters based on student feedback.

## 4. Verification Checklist

### Authentication and authorization
- [ ] Student signup requires successful email OTP verification.
- [ ] Login, logout, and password reset work end-to-end; reset fails without recent verified-email state.
- [ ] Student requests cannot use manager-only functionality.
- [ ] Manager provisioning requires the server-side administrator secret and cannot be performed through public student signup.
- [ ] OTP expiry, resend, repeated failures, and session expiry behave as expected.

### Hostel discovery and student journey
- [ ] Public and authenticated discovery load listings from the API.
- [ ] Search and filters return accurate results, including the no-results state.
- [ ] Listing details safely render user-managed content and only show usable contact actions.
- [ ] A student can add/remove favorites and see saved listings in the dashboard.
- [ ] Dashboard activity metrics reflect the corresponding actions.

### Manager journey and operations
- [ ] A provisioned manager can create a listing; a student cannot.
- [ ] Invalid listing data is rejected with a useful error.
- [ ] Seeding adds missing sample records without deleting or overwriting existing listings.
- [ ] Production logs, cookies, CORS/origin behavior, email, and database connectivity are checked.

## 5. Release and Documentation

Before a release:
1. Run the relevant backend and frontend checks and record the results.
2. Verify required environment variables and deployment secrets without exposing their values.
3. Deploy backend and frontend, then repeat the critical user journeys against production.
4. Update this plan and the related docs with verified outcomes; distinguish source implementation from live verification.

## 6. Definition of Done

- The change meets its documented acceptance criteria and has focused regression coverage where practical.
- Authorization, validation, and error handling are verified for affected routes.
- Related documentation reflects actual behavior.
- Production-only behavior is labeled unverified until tested in the deployed environment.
