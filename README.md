# Campus Lost & Found Portal

**Event:** SE3090 Mini Hackathon (Practice Run)  
**Duration:** 4 hours  
**Team Size:** 4 members  
**Tech Stack:** MongoDB Atlas, Express, React (Vite + Tailwind CSS), Node.js (MERN)

---

## 1. Project Overview

The **Campus Lost & Found Portal** is a full-stack MERN application built to solve misplaced item challenges across university campuses. Students and faculty can post **Lost** and **Found** reports with detailed metadata, search and filter through real-time listings, view full report details with contact information, and mark resolved items once claimed.

---

## 2. Tech Stack & Architecture

| Layer | Technology | Purpose & Rationale |
|---|---|---|
| **Database** | **MongoDB Atlas** | Hosted cloud database, instant setup with zero local dependencies. |
| **Backend** | **Node.js & Express** | Lightweight, high-performance RESTful API with structured routing and controllers. |
| **ODM** | **Mongoose** | Schema definition, validation, and data modeling for reports. |
| **Frontend** | **React 18 + Vite** | Fast development server, rapid scaffolding, and modern component tree. |
| **Routing** | **React Router v6** | Client-side routing for Browse, Item Details, and Report Submission pages. |
| **Styling** | **Tailwind CSS** | Utility-first styling for responsive layouts across mobile, tablet, and desktop screens. |
| **HTTP Client** | **Fetch API (Native)** | Built-in browser HTTP client for lightweight asynchronous data handling. |
| **Hosting (Backend)** | **Render / Railway** | Continuous automated deployment connected to GitHub repository. |
| **Hosting (Frontend)** | **Vercel** | Continuous deployment of the React `client/` build output. |

---

## 3. Data Model (Mongoose Schema)

```javascript
// server/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: [true, 'Report type (Lost/Found) is required'],
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
```

---

## 4. API Contract

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/health` | Service health check | None |
| `GET` | `/api/reports` | Fetch all reports with optional filtering & search | `?status=Active`, `?category=Electronics`, `?search=wallet` |
| `GET` | `/api/reports/:id` | Fetch single report by ID | Path parameter: `id` |
| `POST` | `/api/reports` | Create a new report | JSON Body: `{ type, itemName, category, location, date, description, contactInfo }` |
| `PATCH` | `/api/reports/:id/resolve` | Mark a report as `Resolved` | Path parameter: `id` |

---

## 5. Repository Structure

```
lost-and-found-portal/
├── README.md                          # Project documentation and hackathon blueprint
├── .gitignore                         # Git ignore configurations
├── client/                            # React 18 + Vite frontend
│   ├── index.html                     # HTML template
│   ├── package.json                   # Frontend dependencies and scripts
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── .env.example                   # Client environment variables
│   └── src/
│       ├── main.jsx                   # React DOM entry point
│       ├── App.jsx                    # Application layout and router setup
│       ├── index.css                  # Global styles and Tailwind directives
│       ├── api/
│       │   └── reports.js             # Fetch wrappers for REST API endpoints
│       ├── components/
│       │   ├── Navbar.jsx             # Navigation bar with active route highlight
│       │   ├── ReportCard.jsx         # Card component for report display
│       │   ├── StatusBadge.jsx        # Pill badge for Lost/Found/Active/Resolved
│       │   └── FilterBar.jsx          # Search and filter controls
│       ├── pages/
│       │   ├── BrowsePage.jsx         # List and filter lost/found items
│       │   ├── ItemDetailsPage.jsx    # Detailed view and resolve action
│       │   └── ReportFormPage.jsx     # Submission form with validation
│       └── utils/
│           └── validation.js          # Client-side input validation rules
└── server/                            # Node.js + Express backend
    ├── package.json                   # Backend dependencies and scripts
    ├── server.js                      # Express server entry point & middleware
    ├── .env.example                   # Server environment variables
    ├── config/
    │   └── db.js                      # MongoDB connection helper
    ├── models/
    │   └── Report.js                  # Mongoose model schema
    ├── controllers/
    │   └── reportController.js        # Request handlers for report operations
    ├── routes/
    │   └── reportRoutes.js            # Express API router definitions
    └── seed/
        └── seed.js                    # Script to populate database with sample data
```

---

## 6. Getting Started Locally

### Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)
- MongoDB Atlas account (or local MongoDB)

---

### Backend Setup (`server/`)

1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file based on `.env.example`:
     ```env
     PORT=5000
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lostandfound?retryWrites=true&w=majority
     ```

4. Seed the database with sample reports (Optional but recommended):
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend will be available at `http://localhost:5000`.

---

### Frontend Setup (`client/`)

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file based on `.env.example`:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 7. Team Roles & Responsibilities

| Role | Member | Key Responsibilities |
|---|---|---|
| **Member 1** | **Backend Lead** | MongoDB Atlas setup, Express REST API, Mongoose model, Seed script, Render backend deployment, API testing. |
| **Member 2** | **Frontend: Browse & Search** | `BrowsePage`, `ReportCard`, `FilterBar`, API fetch wrappers (`api/reports.js`), search & category filters. |
| **Member 3** | **Frontend: Report Form** | `ReportFormPage`, form validation logic (`validation.js`), inline error handling, `POST` submission. |
| **Member 4** | **Frontend: Details, Nav & Deploy** | `ItemDetailsPage`, `StatusBadge`, `Navbar`, App router, Vercel frontend deployment, demo video recording. |

---

## 8. Hackathon Execution Timeline (4 Hours)

```mermaid
gantt
    title 4-Hour MERN Hackathon Execution Timeline
    dateFormat HH:mm
    axisFormat %H:%M
    section Phases
    Kickoff & Setup (T+0:00 - 0:30)           :done, 00:00, 30m
    Parallel Build - Phase 1 (T+0:30 - 1:30) :active, 00:30, 60m
    Checkpoint 1: Backend Live (T+1:30 - 1:45): 01:30, 15m
    Parallel Build - Phase 2 (T+1:45 - 2:45) : 01:45, 60m
    Full Integration Pass (T+2:45 - 3:15)    : 02:45, 30m
    Deploy & Polish (T+3:15 - 3:35)          : 03:15, 20m
    Demo Video Recording (T+3:35 - 3:50)     : 03:35, 15m
    Final Submission (T+3:50 - 4:00)         : 03:50, 10m
```

---

## 9. Deployment Guide

### Backend on Render / Railway
1. Push repository to GitHub.
2. Create a new **Web Service** on Render pointing to the repository.
3. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `MONGODB_URI`: `<Atlas Connection String>`
   - `PORT`: `5000` (or Render default)
5. Verify deployment via `GET https://<your-render-app>.onrender.com/api/health`.

### Frontend on Vercel
1. Create a new project on Vercel pointing to the repository.
2. Set **Root Directory** to `client`.
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-render-app>.onrender.com/api`
4. Deploy and verify all routes in an incognito window.

---

## 10. Demo Video Checklist (≤ 2 Minutes)

- [ ] **0:00–0:10:** Intro statement: Campus Lost & Found Portal built with MERN stack.
- [ ] **0:10–0:40:** Browse Page demo: Scroll items, filter by status/category, perform text search.
- [ ] **0:40–1:10:** Report Form demo: Trigger inline validation errors, submit valid report, observe redirect.
- [ ] **1:10–1:35:** Item Details demo: View full description, contact info, click "Mark as Resolved".
- [ ] **1:35–1:50:** Real-time persistence demo: Refresh page to demonstrate database update in MongoDB.
- [ ] **1:50–2:00:** Mobile responsiveness preview and wrap up.
