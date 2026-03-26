# HarvestGuard Client

HarvestGuard Client is the frontend for a climate-aware crop safety platform.  
It combines risk visibility, weather context, and AI-assisted crop scanning in one experience designed for real field workflows in Bangladesh.

## Why This Project Exists

Farm decisions are often time-sensitive, but data is scattered. HarvestGuard brings key signals together so users can act earlier and with more confidence.

- crop storage tracking in one place
- localized weather-aware warnings
- image-based crop health checks
- bilingual usage (Bangla and English)

## What Makes It Different

- Practical first: focuses on actions users can take now, not only analytics.
- Local context: district/division-aware flows and Bangladesh-focused data.
- Built for mixed users: clear UI for non-technical users plus rich data for operators.
- Resilient behavior: fallback logic in alerting keeps the experience usable.

## Feature Highlights

### Authentication

- registration and login
- forgot password, verify, reset flow
- profile update and session restore

### Dashboard

- create, update, delete crop batches
- weather highlights and forecast context
- location-aware advisories and alerts

### Risk and Warnings

- division and district filtering
- XLSX-driven mock risk dataset support
- smart alert generation with local fallback handling

### Crop Scan

- camera capture and image upload
- AI prediction integration for leaf health

### User Experience

- Bangla and English language support
- smooth transitions with Framer Motion
- responsive layout for desktop and mobile

## Stack

- React 19
- Vite 7
- React Router
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Leaflet / React Leaflet
- TensorFlow.js
- XLSX

## Project Layout

```text
src/
  components/  reusable UI building blocks
  context/     auth and language providers
  data/        static datasets and form helpers
  pages/       route-level pages
  services/    API wrapper and smart alert logic
  styles/      global and page-level styles
  utils/       risk engine and helpers
```

## Route Map

- / : landing page
- /dashboard : crop and weather workspace
- /warnings : risk dashboard
- /scan-crop : AI scan flow
- /about : project information
- /login : sign in
- /register : sign up
- /forgot : password recovery
- /verify : account verification
- /reset-password : password reset
- /profile : user profile

## Quick Start

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Install

```bash
npm install
```

### Environment

Create `.env` in the root:

```env
VITE_API_BASE=https://your-backend-api.example.com
```

Behavior notes:

- if `VITE_API_BASE` is not set, local development uses a hosted fallback backend
- production should always define `VITE_API_BASE` explicitly

### Run

```bash
npm run dev
```

## Scripts

- `npm run dev` : start development server
- `npm run build` : build production bundle
- `npm run preview` : preview production build
- `npm run lint` : run lint checks

## Data Sources

- `public/mock_batch_state_data.xlsx` powers warning dashboard mock inputs
- `src/data/` contains crisis, location, and form datasets

## API Surface Used by Client

- `/user/*` for auth and profile
- `/crop/*` for crop batch management
- `/api/smart-alert` for smart alert generation
- `/api/predict` for AI leaf/crop prediction endpoint

## Build and Deploy

```bash
npm run build
```

Deploy `dist/` to your static host of choice.  
Set `VITE_API_BASE` in the deployment environment before release.

## Engineering Notes

- lint config is defined in `eslint.config.js`
- keep service URLs in environment variables when possible
- API access is centralized in `src/services/api.js`

---

Built for Hackethon as the frontend experience for HarvestGuard.
