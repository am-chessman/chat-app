# ChatWave (`chat-app`)

Realtime room-based chat built with **Next.js App Router**, **NextAuth credentials auth**, **Socket.IO**, and **PostgreSQL (Neon) + Drizzle**.

## Overview

ChatWave is a lightweight authenticated chat app where users can:
- sign up/sign in
- join a room by room number
- exchange realtime messages with others in the same room

It combines server-rendered/authenticated routes with a custom Socket.IO server for realtime events.

## Features

- Email/password authentication (NextAuth Credentials)
- User persistence with Drizzle ORM + PostgreSQL
- Protected routes via middleware
- Realtime room join + messaging using Socket.IO
- Dark, modern UI with Tailwind + Radix/shadcn primitives
- Basic toasts and form validation (react-hook-form + zod)

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Auth:** NextAuth v5 beta (Credentials provider)
- **Realtime:** Socket.IO (server + client)
- **Database:** PostgreSQL (Neon-compatible), Drizzle ORM, Drizzle Kit
- **Styling/UI:** Tailwind CSS v4, Radix UI, shadcn/ui, lucide-react
- **Validation/forms:** zod, react-hook-form

## Project Structure (high level)

- `app/` — routes and layouts
  - `(auth)/` sign-in/sign-up
  - `(root)/room/[roomNumber]` room chat page
  - `join-room/` room entry UI
  - `api/auth/[...nextauth]` auth handlers
- `components/` — auth/chat/join UI components
- `database/` — Drizzle client and schema
- `lib/actions/` — server actions (sign in/up)
- `auth.ts` — NextAuth configuration
- `middleware.ts` — route protection/redirects
- `server.mts` — custom HTTP + Socket.IO server
- `migrations/` — Drizzle SQL migrations

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` (or `.env`) with:

```bash
# Required
AUTH_SECRET=your-long-random-secret
DATABASE_URL=postgresql://user:password@host:port/dbname

# Recommended
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional runtime
PORT=3000
NODE_ENV=development
```

> `drizzle.config.ts` and app runtime both read `DATABASE_URL`.

### 3) Run database migrations

```bash
npm run db:generate
npm run db:migrate
```

### 4) Start development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` — start Next dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint
- `npm test` — lightweight test runner (`test.js`)
- `npm run db:generate` — generate Drizzle migrations
- `npm run db:migrate` — run migrations
- `npm run db:studio` — open Drizzle Studio
- `npm run run` — chained helper (DB generate/migrate/studio + build + start)

## Architecture Notes

- App routes are protected by `middleware.ts`:
  - unauthenticated users are redirected to `/sign-in`
  - authenticated users are redirected away from auth pages
- Auth sessions are created with JWT strategy.
- Realtime transport is handled in `server.mts`:
  - clients emit `join-room`
  - clients emit `message`
  - server broadcasts room-scoped events (`message`, `user_joined`)
- Chat UI subscribes to Socket.IO events client-side and renders sender/system messages.

## Deployment Notes

- For realtime features in production, run the custom server (`server.mts`) behind a process manager/container.
- Ensure WebSocket support is enabled in your reverse proxy/load balancer.
- Set production-safe values for:
  - `AUTH_SECRET`
  - `DATABASE_URL`
  - `NEXT_PUBLIC_BASE_URL`
- If deploying on platforms optimized for serverless-only Next runtimes, verify custom Socket.IO server compatibility first.

## Known Issues / Limitations

- "Recent rooms" are currently static UI placeholders (not persisted per user).
- Attachment UI is present but upload/camera flows are not fully implemented.
- Message history is in-memory via socket events (not persisted yet).
- CORS origin settings in `server.mts` are broad for development and should be tightened for production.

## Contribution Guidelines

1. Create a branch from `main`
2. Keep changes focused and low-risk
3. Run validation before opening PR:
   ```bash
   npm run lint
   npm test
   npm run build
   ```
4. Open a PR with:
   - concise summary
   - screenshots/GIFs for UI changes (if applicable)
   - validation output

---

If you’re extending this app, next high-impact improvements are usually: message persistence, typed socket contracts, and production-hardening of server/CORS settings.
