# HEALTH TECH – Livestock Health Monitoring & Disease Prevention

A full-stack web app that helps farmers, dairy farmers, livestock owners and veterinary professionals keep animal
health records, check symptoms (educational risk assessment), track vaccinations, schedule vet checkups and learn
about hygiene, nutrition, biosecurity and preventive care.

Supported livestock: **cattle, buffaloes, goats, sheep, poultry**.

> **Disclaimer:** HEALTH TECH is an educational and information-support system. It does **not** replace qualified
> veterinary diagnosis or treatment. The symptom checker shows an indicative risk level and matching conditions only.

## Features

| Area | What it does |
|---|---|
| Authentication | Register / login with bcrypt-hashed passwords and JWT sessions (farmer or veterinary professional) |
| Animal dashboard | Totals, sick/under-observation count, overdue vaccinations, upcoming checkups, recent records |
| Animal management | Add / edit / delete animals or poultry flocks, with status tracking |
| Symptom-based risk assessment | Select symptoms (+ optional temperature) → risk level (low / moderate / high / emergency), matching conditions, advice, zoonotic and reportable-disease flags |
| Health history | Per-animal notes, illness and treatment log; symptom checks can be saved to history |
| Vaccination reminders | Manual reminders, one-click species template, mark as given, overdue detection |
| Veterinary checkups | Schedule, complete (with outcome) and cancel visits |
| Vet contacts | Personal directory with tap-to-call and 24×7 emergency flag |
| Farmer education | Hygiene, nutrition, biosecurity, vaccination and emergency guides plus a disease library per species |
| Responsive UI | Mobile-friendly navigation and layouts |

## Tech stack

- **Frontend:** React 18, Vite, React Router, HTML/CSS/JavaScript
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Security:** JWT auth, bcrypt (cost 12), Helmet, CORS allow-list, rate-limited auth routes, per-user data isolation, field whitelisting

## Project structure

```
healthtech/
├── server/
│   ├── .env.example
│   └── src/
│       ├── index.js            # Express app + MongoDB connection
│       ├── data/knowledge.js   # Symptoms, diseases, vaccine templates, articles
│       ├── utils/riskEngine.js # Symptom-based educational risk assessment
│       ├── middleware/auth.js  # JWT middleware
│       ├── models/             # User, Animal, HealthRecord, Vaccination, Checkup, Vet
│       └── routes/             # auth, animals, records, vaccinations, checkups, risk, dashboard, info
└── client/
    ├── vite.config.js          # Dev proxy: /api → http://localhost:5000
    └── src/
        ├── pages/              # Login, Register, Dashboard, Animals, AnimalDetail, Symptoms,
        │                       # Vaccinations, Checkups, Vets, Learn
        └── components/         # Layout, RiskResult, shared UI helpers
```

## Getting started

Prerequisites: **Node.js 18+** and a running **MongoDB** (local or MongoDB Atlas).

### 1. Backend

```bash
cd server
cp .env.example .env      # then set JWT_SECRET to a long random string
npm install
npm run dev               # API on http://localhost:5000
```

`.env` values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/healthtech
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_ORIGIN=http://localhost:5173
```

### 2. Frontend

```bash
cd client
npm install
npm run dev               # App on http://localhost:5173
```

Open http://localhost:5173, create an account, add an animal, then try **Symptom Check**.

### Production build

```bash
cd client && npm run build   # outputs client/dist
```

Serve `client/dist` from any static host and set `CLIENT_ORIGIN` on the server to that site’s URL. If the API is on a
different origin, change the `fetch` base path in `client/src/api.js`.

## API overview

All routes except `/api/auth/register`, `/api/auth/login`, `/api/health` and the public `/api/info/*` content require
`Authorization: Bearer <token>`.

| Method & path | Purpose |
|---|---|
| `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Authentication |
| `GET/POST /api/animals`, `GET/PUT/DELETE /api/animals/:id` | Animal CRUD |
| `POST /api/animals/:id/vaccination-plan` | Create reminders from the species template |
| `GET/POST /api/records`, `DELETE /api/records/:id` | Health history |
| `GET/POST /api/vaccinations`, `PATCH/DELETE /api/vaccinations/:id` | Vaccination reminders (filter with `?status=` pending, overdue or done) |
| `GET/POST /api/checkups`, `PATCH/DELETE /api/checkups/:id` | Vet checkups |
| `POST /api/risk/assess` | Symptom-based risk assessment |
| `GET /api/dashboard` | Dashboard summary |
| `GET /api/info/symptoms`, `/diseases`, `/articles`, `/resources`, `/vaccine-templates` | Education content (public) |
| `GET/POST/PUT/DELETE /api/info/vets` | Personal vet contacts |

## How the risk assessment works

`server/src/utils/riskEngine.js` compares the symptoms you enter (and temperature versus the normal range for the
species) with a weighted symptom list for each condition in `knowledge.js`. It returns:

- **Risk level:** emergency if any red-flag sign is present (e.g. bloat, down and unable to rise, convulsions, paralysis,
  sudden deaths, blood in dung, laboured breathing); high for fever with several signs, a contagious best match, or
  marked fever; moderate / low otherwise.
- **Matching conditions:** the closest matches with a *match percentage* (how closely the entered symptoms resemble the
  condition’s typical signs, **not** a probability), prevention advice and contagious / zoonotic / reportable flags.

## Review before real-world use

- **Veterinary review:** the disease list, symptom weights and vaccine templates are general and illustrative. Have a
  qualified veterinarian review and adapt them to your region before deploying to farmers.
- **Vet contacts:** none are pre-loaded apart from one national helpline; users add their own local vets. Verify the
  helpline number in `knowledge.js` is current for your region.
- **Reminders:** reminders are shown in the app (dashboard and vaccinations page). Push/SMS/email notifications are not
  included; they could be added with a scheduled job (e.g. node-cron) and a messaging provider.
- **Production hardening:** use HTTPS, a strong `JWT_SECRET`, MongoDB authentication and regular backups.
