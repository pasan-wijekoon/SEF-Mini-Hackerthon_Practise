# Campus Lost & Found Portal — Team Task Division

**Team Size:** 4 members | **Duration:** 4 hours

---

## 👤 Member 1 — Backend Lead (Node/Express/MongoDB)

**Owns:** everything in `server/`, MongoDB Atlas, backend deployment

- [ ] Create MongoDB Atlas free cluster, get connection string, whitelist all IPs (0.0.0.0/0 for hackathon speed) — *10 min*
- [ ] Scaffold Express app: `server.js`, CORS + JSON middleware, `config/db.js` connecting to Atlas — *10 min*
- [ ] Define `Report` model with Mongoose schema — *10 min*
- [ ] Build `reportController.js` + `reportRoutes.js`: all 5 routes from the API contract — *30 min*
- [ ] Write `seed/seed.js` — 8–10 realistic sample reports, run it to populate Atlas — *15 min*
- [ ] Push to GitHub, deploy to Render early, confirm `GET /api/health` works publicly — *15 min*
- [ ] Test every route with a REST client (Postman/Thunder Client) before frontend integrates — *15 min*
- [ ] Be on call during Integration phase to fix backend bugs frontend hits
- [ ] Re-deploy backend with final fixes before the deadline

---

## 👤 Member 2 — Frontend: Browse, Search & Filter

**Owns:** `BrowsePage.jsx`, `ReportCard.jsx`, `FilterBar.jsx`, `api/reports.js` (shared)

- [ ] Build `ReportCard.jsx`: type, item name, location, date, status badge — *20 min*
- [ ] Build `BrowsePage.jsx` — start against a local mock array so you're not blocked on backend — *20 min*
- [ ] Build `FilterBar.jsx`: status dropdown, category dropdown, keyword search — *25 min*
- [ ] Wire filter state → filtered rendering — *15 min*
- [ ] Write `api/reports.js` fetch wrapper functions (`getReports`, `getReport`, `createReport`, `resolveReport`) — coordinate with Member 1 on exact response shape — *15 min*
- [ ] Swap BrowsePage from mock data to real `getReports()` call once backend is live — *10 min*
- [ ] Cards link to `/item/:id`; responsive grid pass — *15 min*

---

## 👤 Member 3 — Frontend: Report Form & Validation

**Owns:** `ReportFormPage.jsx`, `utils/validation.js`

- [ ] Build form UI: item name, category, location, date picker, description, contact info, Lost/Found toggle — *25 min*
- [ ] Write `validation.js`: required fields, date-not-in-future check — *15 min*
- [ ] Wire validation to submit — visible inline error messages, block submit until fixed — *20 min*
- [ ] On valid submit, call `createReport()` from `api/reports.js`, then redirect to Browse page — *15 min*
- [ ] Add success confirmation (toast/message) — *10 min*
- [ ] Responsive form layout — *10 min*
- [ ] Test against live backend once deployed: blank form, future date, valid submission — *10 min*

---

## 👤 Member 4 — Frontend: Details, Resolved, Nav & Deployment

**Owns:** `ItemDetailsPage.jsx`, `StatusBadge.jsx`, `Navbar.jsx`, `App.jsx` routing, frontend deployment, final integration

- [ ] Scaffold Vite + React + Tailwind `client/` project, push initial commit — *10 min*
- [ ] Build `App.jsx` with routes: `/`, `/item/:id`, `/report` — *10 min*
- [ ] Build responsive `Navbar.jsx` with active-page indicator — *15 min*
- [ ] Build `ItemDetailsPage.jsx` — start against mock data: description, contact info, resolve button — *25 min*
- [ ] Build `StatusBadge.jsx`: reusable Lost/Found/Resolved pill — *10 min*
- [ ] Wire resolve button to `resolveReport(id)` once backend is live; confirm it reflects on Browse page after refresh — *15 min*
- [ ] Handle "report not found" edge case — *5 min*
- [ ] Connect `client/` to Vercel, deploy early to prove pipeline, set backend URL as env var — *15 min*
- [ ] Own final integration testing across all pages + final production deploy
- [ ] Record the demo video near the end

---

## Quick Reference Table

| Member | Role | Owns | Key Deliverable |
|---|---|---|---|
| 1 | Backend Lead | `server/`, MongoDB Atlas, backend deploy | Live API with 5 working routes |
| 2 | Frontend — Browse/Search | `BrowsePage`, `ReportCard`, `FilterBar`, `api/reports.js` | Filterable, searchable item list |
| 3 | Frontend — Form | `ReportFormPage`, `validation.js` | Working, validated report submission |
| 4 | Frontend — Details/Nav/Deploy | `ItemDetailsPage`, `StatusBadge`, `Navbar`, routing, deploy | Full app wired together + shipped |

