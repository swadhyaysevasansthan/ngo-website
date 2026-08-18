# CLAUDE.md

## Project Overview
Swadhyay Seva Foundation NGO website and competition platform.

The repository contains:
- `ngo-web/` — React frontend
- `backend/` — Node.js/Express backend

## Tech Stack
**Frontend:** React 18, React Router, Tailwind CSS, Axios, React Query, Framer Motion  
**Backend:** Node.js (ES modules), Express 5, PostgreSQL (`pg`)  
**Services:** Cloudinary, Razorpay, Resend, Nodemailer  
**Other:** PDF generation, Excel processing, image/HEIC handling

## Development

### Frontend
```bash
cd ngo-web
npm install
npm start
```

Production build:
```bash
npm run build
```

### Backend
```bash
cd backend
npm install
npm run dev
```

Production:
```bash
npm start
```

## Environment
Keep secrets in `.env` files and never commit them.

Backend configuration may include:
- PostgreSQL connection
- JWT/authentication secrets
- Cloudinary credentials
- Razorpay credentials
- Resend/email credentials
- Frontend/API URLs

Use existing environment variable names in the codebase rather than introducing duplicates.

## Code Guidelines
- Follow the existing project structure and coding style.
- Prefer small, focused changes over large rewrites.
- Reuse existing components, utilities, API patterns, and validation logic.
- Do not change API contracts or database schemas unless the task requires it.
- Validate both frontend and backend changes.
- Handle loading, error, and empty states in UI changes.
- Keep authentication and authorization checks server-side.
- Never expose secrets or credentials in frontend code.

## Database & API
- PostgreSQL is the primary database.
- Preserve existing relationships, constraints, and business rules.
- Use parameterized queries.
- Validate request data on the backend even when frontend validation exists.
- For competition features, maintain existing rules for registrations, teachers, dates, payments, leaderboards, and certificates.

## Important
Before modifying functionality, inspect the relevant existing routes, components, database queries, and API calls. Avoid unnecessary dependency changes.

After changes, run the relevant frontend build and/or backend checks and report any remaining issues.
