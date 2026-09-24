# OfferPilot Frontend

OfferPilot is a React and TypeScript frontend for software engineers managing a focused job-preparation workflow. It combines goals, learning, applications, resume intelligence, ATS analysis, and career tracking in one dashboard.

## Stack

- React 19 and React Router
- TypeScript 6
- Vite 8
- Tailwind CSS 3
- React Hook Form and Zod
- Zustand
- Axios
- ESLint 10

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (Node 24 is recommended; see `.nvmrc`)
- npm 10 or newer
- A running OfferPilot backend API for authenticated features

## Local setup

1. Install the exact dependency versions from the lockfile:

   ```powershell
   npm ci
   ```

2. Create the local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Set the backend URL in `.env`:

   ```dotenv
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Start the Vite development server:

   ```powershell
   npm run dev
   ```

The local app is available at the URL printed by Vite, normally `http://localhost:5173`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL of the OfferPilot backend API. Do not include a trailing slash. |

Vite embeds `VITE_*` variables in the client bundle. Never store passwords, access tokens, API keys, or other secrets in these files.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with HMR |
| `npm run lint` | Run ESLint across the project |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
src/
  app/          Application providers and router
  components/   Shared layout, UI, and common components
  features/     Feature-specific pages, services, types, and components
  lib/          Shared constants and utilities
  services/     Shared API client and error handling
  styles/       Global Tailwind styles
  types/        Shared API types
```

Feature modules follow a `pages`, `components`, `services`, `store`, `schemas`, and `types` structure where needed.

## Production deployment

Run `npm run build` and deploy the generated `dist/` directory as a static site.

The application uses `createBrowserRouter`, so the hosting provider must rewrite unknown application routes to `index.html`. Configure the backend URL in the deployment environment before building.
