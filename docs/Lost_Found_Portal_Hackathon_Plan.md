# Campus Lost & Found Portal — MERN Hackathon Execution Plan (PRD)

**Event:** SE3090 Mini Hackathon (Practice Run)
**Duration:** 4 hours
**Team Size:** 4 members
**Deliverables:** Working public deployment link, Git repo with contributions from all members, ≤2 min demo video, CourseWeb submission

---

## 1. Overview

A small web app where students can post and browse **Lost** and **Found** item reports on campus, view full details of a report, contact the poster, and mark reports as resolved. Full **MERN stack**: MongoDB, Express, React, Node — real backend + database, not a mock.

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Database | **MongoDB Atlas** (free tier, hosted) | No local DB install — get a connection string in ~5 min, works immediately from any deploy host |
| Backend | **Node.js + Express** | Small, fast REST API — 5 routes total, easy to reason about under time pressure |
| ODM | **Mongoose** | Simple schema definition + validation for the Report model |
| Frontend | **React 18 + Vite** | Fastest scaffold + hot reload |
| Routing | **React Router v6** | Browse / Details / Report Form pages |
| Styling | **Tailwind CSS** | Fast responsive layout without coordinating custom CSS across 4 people |
| HTTP client | **fetch()** (built-in) | No need for axios, one less dependency |
| Backend Deploy | **Render** (or Railway) | Connects to GitHub, auto-deploys Express app, free tier |
| Frontend Deploy | **Vercel** | Connects to GitHub, auto-deploys the `client/` folder |

> **Key risk to manage:** free backend hosts (Render especially) can have slow cold starts on first deploy. Deploy the backend **early and often** (even with just one dummy route) so the pipeline is proven working well before the deadline — don't leave backend deployment until the last 15 minutes.

## 3. Data Model (Mongoose Schema)

```js
// server/models/Report.js
const reportSchema = new mongoose.Schema({
  type: { type: String, enum: ["Lost", "Found"], required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  contactInfo: { type: String, required: true },
  status: { type: String, enum: ["Active", "Resolved"], default: "Active" },
}, { timestamps: true });
```

## 4. API Contract

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/reports` | Fetch all reports (Browse page). Supports optional query params: `?status=`, `?category=`, `?search=` |
| GET | `/api/reports/:id` | Fetch one report (Item Details page) |
| POST | `/api/reports` | Create a new report (Report Form submit) |
| PATCH | `/api/reports/:id/resolve` | Mark a report as Resolved |
| GET | `/api/health` | Simple check to confirm backend is deployed and reachable |

Agree on this contract **at kickoff** — it's what lets frontend and backend work in parallel without blocking each other.

## 5. File Structure

```
lost-and-found-portal/
├── README.md
├── client/                        # React frontend
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                # Router setup
│       ├── index.css
│       ├── api/
│       │   └── reports.js         # fetch() wrappers for all API calls
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ReportCard.jsx
│       │   ├── StatusBadge.jsx
│       │   └── FilterBar.jsx
│       ├── pages/
│       │   ├── BrowsePage.jsx
│       │   ├── ItemDetailsPage.jsx
│       │   └── ReportFormPage.jsx
│       └── utils/
│           └── validation.js
└── server/                        # Express backend
    ├── package.json
    ├── server.js                  # app entry, CORS, JSON middleware, mounts routes
    ├── config/
    │   └── db.js                  # mongoose.connect()
    ├── models/
    │   └── Report.js
    ├── controllers/
    │   └── reportController.js    # handler functions for each route
    ├── routes/
    │   └── reportRoutes.js
    └── seed/
        └── seed.js                # script to insert 8–10 sample reports into Atlas
```

## 6. Feature → Requirement Mapping

| Feature | Satisfies Requirement |
|---|---|
| BrowsePage fetching `GET /api/reports` | Browse Reports |
| ItemDetailsPage fetching `GET /api/reports/:id` | Item Details |
| ReportFormPage → `POST /api/reports` | Report Form |
| validation.js + inline error UI (client) + Mongoose `required` (server) | Form Validation |
| FilterBar → query params on `GET /api/reports` | Search or Filter |
| Resolve button → `PATCH /api/reports/:id/resolve` | Mark as Resolved |
| Navbar with active-link highlight | Navigation |
| Tailwind responsive classes | Responsive Layout |

---

## 7. Team Roles & Task Breakdown

### 👤 Member 1 — Backend Lead (Node/Express/MongoDB)
**Owns:** everything in `server/`, MongoDB Atlas, backend deployment

- [ ] Create MongoDB Atlas free cluster, get connection string, whitelist all IPs (0.0.0.0/0 for hackathon speed) (10 min)
- [ ] Scaffold Express app: `server.js`, CORS + JSON middleware, `config/db.js` connecting to Atlas (10 min)
- [ ] Define `Report` model with Mongoose schema (10 min)
- [ ] Build `reportController.js` + `reportRoutes.js`: all 5 routes from the API contract (30 min)
- [ ] Write `seed/seed.js` — 8–10 realistic sample reports, run it to populate Atlas (15 min)
- [ ] Push to GitHub, deploy to Render early, confirm `GET /api/health` works publicly (15 min)
- [ ] Test every route with a REST client (Postman/Thunder Client) before frontend integrates (15 min)
- [ ] Be on call during Integration phase to fix backend bugs frontend hits
- [ ] Re-deploy backend with final fixes before the deadline

### 👤 Member 2 — Frontend: Browse, Search & Filter
**Owns:** `BrowsePage.jsx`, `ReportCard.jsx`, `FilterBar.jsx`, `api/reports.js` (shared)

- [ ] Build `ReportCard.jsx`: type, item name, location, date, status badge (20 min)
- [ ] Build `BrowsePage.jsx` — **start against a local mock array** so you're not blocked on backend (20 min)
- [ ] Build `FilterBar.jsx`: status dropdown, category dropdown, keyword search (25 min)
- [ ] Wire filter state → filtered rendering (15 min)
- [ ] Write `api/reports.js` fetch wrapper functions (`getReports`, `getReport`, `createReport`, `resolveReport`) — coordinate with Member 1 on exact response shape (15 min)
- [ ] **Swap BrowsePage from mock data to real `getReports()` call** once backend is live (10 min)
- [ ] Cards link to `/item/:id`; responsive grid pass (15 min)

### 👤 Member 3 — Frontend: Report Form & Validation
**Owns:** `ReportFormPage.jsx`, `utils/validation.js`

- [ ] Build form UI: item name, category, location, date picker, description, contact info, Lost/Found toggle (25 min)
- [ ] Write `validation.js`: required fields, date-not-in-future check (15 min)
- [ ] Wire validation to submit — visible inline error messages, block submit until fixed (20 min)
- [ ] On valid submit, call `createReport()` from `api/reports.js`, then redirect to Browse page (15 min)
- [ ] Add success confirmation (toast/message) (10 min)
- [ ] Responsive form layout (10 min)
- [ ] Test against live backend once deployed: blank form, future date, valid submission (10 min)

### 👤 Member 4 — Frontend: Details, Resolved, Nav & Deployment
**Owns:** `ItemDetailsPage.jsx`, `StatusBadge.jsx`, `Navbar.jsx`, `App.jsx` routing, frontend deployment, final integration

- [ ] Scaffold Vite + React + Tailwind `client/` project, push initial commit (10 min)
- [ ] Build `App.jsx` with routes: `/`, `/item/:id`, `/report` (10 min)
- [ ] Build responsive `Navbar.jsx` with active-page indicator (15 min)
- [ ] Build `ItemDetailsPage.jsx` — start against mock data: description, contact info, resolve button (25 min)
- [ ] Build `StatusBadge.jsx`: reusable Lost/Found/Resolved pill (10 min)
- [ ] Wire resolve button to `resolveReport(id)` once backend is live; confirm it reflects on Browse page after refresh (15 min)
- [ ] Handle "report not found" edge case (5 min)
- [ ] Connect `client/` to Vercel, deploy early to prove pipeline, set backend URL as env var (15 min)
- [ ] Own final integration testing across all pages + final production deploy
- [ ] Record the demo video near the end (see script below)

---

## 8. Timeline (4 Hours / 240 Minutes)

| Time | Phase | What's Happening |
|---|---|---|
| T+0:00–0:30 | **Kickoff & Setup** | Problem revealed. Agree on API contract (Section 4). Member 1 starts Atlas + Express scaffold. Members 2–4 scaffold `client/` and start building against mock data so nobody is blocked. |
| T+0:30–1:30 | **Parallel Build — Phase 1** | Backend: routes + seed data + first deploy. Frontend: pages built against mock data, components taking shape. |
| T+1:30–1:45 | **Checkpoint 1: Backend goes live** | Member 1 confirms all 5 routes work on the deployed URL. Frontend team gets the base API URL. |
| T+1:45–2:45 | **Parallel Build — Phase 2 / Integration** | Frontend swaps mock data for real `fetch()` calls one page at a time. Form POST, resolve PATCH tested against live DB. |
| T+2:45–3:15 | **Full Integration Pass** | Merge all branches into `main`. Click through the entire app end-to-end: browse → filter → details → resolve → form submit → see it appear on Browse. |
| T+3:15–3:35 | **Deploy & Polish** | Final backend + frontend redeploy with latest fixes. Responsive check on mobile width. |
| T+3:35–3:50 | **Demo Video** | Record ≤2 min walkthrough. |
| T+3:50–4:00 | **Submission** | Submit repo link + live frontend link + video on CourseWeb. |

> **Do not wait until backend is "fully done" to start frontend.** Building pages against local mock data from minute 0 and swapping in real API calls at Checkpoint 1 is what keeps all 4 people productive in parallel.

## 9. Git Workflow

- `main` stays deployable at all times
- Branches: `feature/backend-api`, `feature/browse-filter`, `feature/report-form`, `feature/details-nav-deploy`
- Commit early and often — each person needs their own visible commits for the "meaningful contributions" requirement
- Open PRs into `main` at Checkpoint 1 and again before Full Integration Pass; Member 1 or 4 reviews/merges
- Keep `client/` and `server/` as separate folders so merge conflicts stay isolated to each person's area

## 10. Environment Variables

| Var | Where | Value |
|---|---|---|
| `MONGODB_URI` | Render (backend) | Atlas connection string |
| `PORT` | Render (backend) | Usually auto-set by host |
| `VITE_API_BASE_URL` | Vercel (frontend) | Your deployed Render backend URL, e.g. `https://your-app.onrender.com/api` |

Never commit real connection strings to Git — use a `.env` file (gitignored) locally and set the same values in each host's dashboard.

## 11. Demo Video Script (≤2 minutes)

| Time | Show |
|---|---|
| 0:00–0:10 | One-line intro: "This is our Campus Lost & Found Portal, built on MERN" |
| 0:10–0:40 | Browse page: scroll list, use status/category filter, keyword search |
| 0:40–1:10 | Submit a new report: trigger a validation error on purpose, then submit correctly — show it hitting the live database |
| 1:10–1:35 | Click into item details, show contact info, click "Mark as Resolved" |
| 1:35–1:50 | Refresh Browse page — resolved badge is reflected (proves it's really persisted in MongoDB, not just local state) |
| 1:50–2:00 | Quick resize to mobile view, sign off |

## 12. Final Submission Checklist

- [ ] Public frontend link works (test in incognito window)
- [ ] Backend is live and reachable (not asleep/crashed — check `/api/health`)
- [ ] Data persists: submitting a report and refreshing shows it's really in MongoDB, not browser memory
- [ ] GitHub repo link shared, commit history shows all 4 members contributing to both `client/` and `server/`
- [ ] Demo video ≤ 2 minutes, uploaded/linked
- [ ] All 8 key requirements verified live: Browse, Details, Form, Validation, Filter/Search, Resolve, Nav, Responsive
- [ ] CourseWeb submission completed before the 4-hour mark
