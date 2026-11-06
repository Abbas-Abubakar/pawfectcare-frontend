# PawfectCare Frontend

![CI](https://github.com/Abbas-Abubakar/pawfectcare-frontend/actions/workflows/ci.yml/badge.svg)

A responsive web app that brings pet owners, veterinarians and animal shelters into one platform: health records, vet appointments, adoption, a pet store and care articles. This repo is the React + TypeScript client. The API is in [pawfectcare-backend](https://github.com/Abbas-Abubakar/pawfectcare-backend).

**Live demo:** https://the-pawfect-care.vercel.app

> The API runs on a free hosting tier, so the first request after a quiet period can take up to a minute while the server wakes up. The app shows loading skeletons and a notice while it waits.

<img width="1896" height="925" alt="image" src="https://github.com/user-attachments/assets/7deeddf8-fd50-4e03-9d7d-ae481e81d0d3" />

## The problem

Pet owners juggle separate services for health records, vet visits, supplies and adoption, which leads to missed vaccinations and no single history for a pet. Vets and shelters lack one organized place to manage appointments, adoptions and communication. PawfectCare puts all three groups on one platform. It was built from a software requirements specification for a pet care app, originally specified as a Flutter mobile app and rebuilt here as a responsive MERN web app.

## Features

**Pet owners**
- Pet profiles with photos and a complete health history (vaccinations, deworming, allergies, checkups), with in-app reminders before due dates
- Book, reschedule and cancel vet appointments against each vet's real availability
- Browse adoptable pets, apply to adopt, and track or withdraw requests
- Pet store with category filters, search and a wishlist
- Care articles from vets and shelters, with search and bookmarks

**Veterinarians**
- Availability calendar: add and remove time slots by date
- Confirm or decline appointment requests, mark visits complete, then record diagnosis, prescription and notes with image attachments (such as X-rays)
- Patient list with each pet's health records and medical history
- Write and manage care articles

**Shelter admins**
- Adoption listings with multiple photos and status tracking
- Review adoption requests; approving one creates the pet in the adopter's account
- Success stories, contact and volunteer messages, and user feedback
- Write and manage care articles

**Everyone**
- Public home, adoption, blog, store, success stories and contact pages (no login needed)
- Global search across products, articles and adoptable pets
- In-app notifications, profile and password management, feedback form
- Mobile-friendly navigation, loading skeletons, empty and error states

## Tech stack

- React 18, TypeScript, Vite
- React Router (data router with nested layout routes)
- TanStack Query for server state, Zustand for the session
- Axios with a token-refresh interceptor
- Tailwind CSS v4 (theme tokens defined in CSS)
- Deployed on Vercel, with CI on GitHub Actions

## Try the demo

The login page has one-click demo accounts. They are shared and public, so password changes and account deactivation are disabled for them.

| Role | Email | Password |
|---|---|---|
| Pet Owner | owner1@pawfectcare.test | Password123 |
| Veterinarian | vet1@pawfectcare.test | Password123 |
| Shelter Admin | shelter1@pawfectcare.test | Password123 |

You can also register your own account. On the demo site, new accounts are Pet Owners only, and the verification code is shown on screen instead of being emailed, because the demo's email goes to a sandbox. For the same reason, password-reset emails don't reach real inboxes on the demo site.

## Getting started

**Prerequisites:** Node.js 20 or newer (developed on 22), and the [backend](https://github.com/Abbas-Abubakar/pawfectcare-backend) running locally.

```bash
git clone https://github.com/Abbas-Abubakar/pawfectcare-frontend.git
cd pawfectcare-frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at http://localhost:5173 and expects the API at http://localhost:5000/api.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | API base URL: `http://localhost:5000/api` locally, `/api` in production (see Deployment) |
| `VITE_SHOW_DEMO_ACCOUNTS` | `true` shows the demo-account panel and demo notices. Leave `false` for a real deployment. |

Vite embeds these at build time, so changing one requires a rebuild or redeploy.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check with `tsc`, then build for production |
| `npm run preview` | Preview the production build locally |

## Project structure

```
src/
  api/          Axios client (refresh interceptor) and per-resource API modules
  components/   Shared UI: modal, tabs, skeletons, empty and error states
  config/       Role navigation, demo account config
  hooks/        TanStack Query hooks per resource
  layouts/      Root, auth, dashboard and public layouts
  pages/        auth/, public/, owner/, vet/, shelter/, shared/
  routes/       ProtectedRoute (role-based guard)
  store/        Zustand auth store
  types/        Shared TypeScript types
  utils/        Small helpers
```

## Design decisions

- **Cookie sessions, same-origin API.** The API sets httpOnly cookies, so no tokens are readable from JavaScript. On Vercel, a rewrite proxies `/api/*` to the backend, so the browser only talks to one site and `SameSite=Strict` cookies work without a custom domain.
- **Server state vs. client state.** TanStack Query owns fetched data and invalidates caches after mutations. Zustand holds only the current user.
- **Refresh handled once.** The Axios interceptor silently refreshes an expired access token, queues concurrent requests behind a single refresh, and skips the login, register and refresh endpoints so a wrong password can't trigger a refresh loop.
- **Optimistic where it's cheap to undo.** Wishlist and bookmark toggles update instantly and roll back on failure. Bookings, cancellations and account deactivation wait for the server.
- **Role-aware routing.** Nested layout routes share the sidebar and auth panel, `ProtectedRoute` guards each role's section, and navigation is generated from one config.
- **Built for slow starts.** Skeleton loaders, empty and error states, an error boundary, and a notice when loading drags on.

## Deployment

Deployed on Vercel. Set `VITE_API_BASE_URL=/api` (plus `VITE_SHOW_DEMO_ACCOUNTS=true` if you want the demo panel), then point the proxy in `vercel.json` at your backend:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://<your-backend>.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The first rule proxies the API. The second lets React Router handle deep links. Rule order matters.

## CI

GitHub Actions runs `npm ci` and `npm run build` (type-check plus bundle) on every push to `main` and every pull request.

## Known limitations

- Notifications are in-app only, not push or email
- No checkout: the store is browse and wishlist only
- No offline mode and no map integration
- No automated tests yet; CI covers the type-check and build
- Free-tier hosting means cold starts after idle periods

## About

Built from a software requirements specification for a pet care app. Developed with AI pair-programming assistance (Claude).
