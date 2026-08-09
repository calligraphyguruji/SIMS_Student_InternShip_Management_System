# SIMS — Student Internship Management System

A full-stack internship management platform built for a college final-year project. Five roles
(Student, Faculty Mentor, Internship Coordinator, Company HR, Admin) share one system of record
for posting internships, applying, mentor sign-off, and tracking status end to end.

This is the **core release**: authentication, role-based dashboards, internship posting/browsing,
and the apply → mentor review → decision workflow are fully implemented and working. It's built to
be extended — attendance, daily logs, messaging, and the other modules from the original spec can
be layered on top of this foundation (see "Extending this project" below).

## Tech stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, React Hook Form, Axios, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt

## Folder structure

```
sims/
  backend/
    config/         MongoDB connection
    controllers/     Route handlers (auth, users, internships, applications, stats)
    middleware/       JWT auth guard, role authorization, error handler
    models/           User, Internship, Application (Mongoose schemas)
    routes/            Express routers
    utils/             Token helper + database seed script
    server.js
  frontend/
    src/
      components/layout   Sidebar, Navbar, DashboardLayout, ProtectedRoute
      components/ui       StatCard, StatusBadge, Loader/EmptyState/ErrorBanner
      context/             AuthContext (login/register/logout/session)
      pages/               Landing, Login, Register, Dashboard, Internships,
                            InternshipDetail, MyApplications, ManageApplications,
                            MenteeApplications, AdminUsers, Profile, NotFound
      services/api.js      Axios instance with JWT + 401 handling
      App.jsx, main.jsx, index.css
```

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# replace <db_password> in .env with your MongoDB Atlas database password
npm run seed    # optional but recommended — creates one demo account per role
npm run dev
```

The API runs at `http://localhost:5001`. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

### Demo accounts (after running `npm run seed`)

| Role         | Email                | Password    |
|--------------|-----------------------|-------------|
| Admin        | admin@sims.edu        | password123 |
| Coordinator  | coordinator@sims.edu  | password123 |
| Faculty      | faculty@sims.edu      | password123 |
| Company HR   | hr@techcorp.com       | password123 |
| Student      | student@sims.edu      | password123 |

## What's implemented

- **Auth:** register, login, logout, JWT (httpOnly cookie + bearer token), change password,
  bcrypt-hashed passwords, role selection at signup (admin accounts can't self-register).
- **Roles & permissions:** every backend route is guarded by `protect` + `authorize(...)`
  middleware; the frontend hides/blocks routes that don't belong to the signed-in role.
- **Internships:** Company HR and Admin can post/edit/delete; everyone can browse with search,
  mode filter, and pagination.
- **Applications:** students apply once per internship; Company HR/Coordinator/Admin move an
  application through `pending → shortlisted → interview_scheduled → approved/rejected →
  offer_received → completed`, with every change logged to a visible history timeline.
- **Mentor workflow:** Coordinators/Admins assign a faculty mentor to each student; mentors see
  only their mentees' applications and can approve/flag them with a comment, separate from the
  final HR/coordinator decision.
- **Dashboards:** each role gets a `/api/stats/dashboard` response tailored to what they need —
  students see their application funnel, faculty see mentee load, company HR sees applicant
  volume by stage with a chart, coordinators/admins see registry-wide counts.

## Extending this project

The original brief covers a lot more ground (attendance with QR codes, daily work logs,
real-time messaging, notifications, certificate generation, resume analysis, reports/exports,
etc). The schema and route structure here are deliberately set up so each of those is an
additive module:

- **Attendance / Daily Logs:** new `Attendance` and `DailyLog` models referencing `Application`
  or `User`, plus a controller/route pair and a page under `/attendance`.
- **Messaging/Notifications:** would need a `Message`/`Notification` model and, for real-time
  delivery, a `socket.io` server alongside the existing Express app.
- **File uploads** (resume, offer letters, certificates): add `multer` middleware and an
  `/uploads` static route on the backend; the `resumeUrl`/`avatarUrl` fields on `User` are
  already there to store the resulting paths.
- **Reports/exports:** a reporting controller that queries `Application`/`Internship` and pipes
  results through a PDF/Excel library (e.g. `exceljs`, `pdfkit`).

## Deployment notes

- **Frontend:** deploy the `frontend` folder to Vercel; set `VITE_API_URL` to your deployed
  backend URL.
- **Backend:** deploy the `backend` folder to Render (or similar).
  - Root directory: `backend`
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment variables:
    - `NODE_ENV=production`
    - `MONGO_URI=mongodb+srv://hiaman4046_db_user:<db_password>@sims.cw9yfgt.mongodb.net/?appName=SIMS`
    - `JWT_SECRET=<a long random secret>`
    - `CLIENT_URL=<your deployed frontend URL>`

On Render, replace `<db_password>` with the real MongoDB Atlas database password before deploying.
