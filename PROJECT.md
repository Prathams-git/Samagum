# Samaagum: project context (read this first)

Samaagum is one web platform that replaces the 4-5 apps club organizers use today (Meetup, Eventbrite, WhatsApp, Google Forms). It combines public/private clubs, events with free / early-bird / VIP tickets, Razorpay payments, rotating QR passes with phone-camera check-in, live chat, attendee profiles, and automatic reminders. A host can also create an event from one sentence using an AI assistant.

This is a college project. The goal is a complete, working app I can demo on localhost and through a public HTTPS tunnel. I am a beginner: explain commands, prefer simple code, and do not add features I did not ask for.

## Stack (do not change without asking)

- Frontend: React + Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query. JavaScript, NOT TypeScript.
- Backend: Node.js (LTS) + Fastify, ES modules. @fastify/cookie, @fastify/jwt, @fastify/cors, Zod for validating every request body.
- Database: PostgreSQL 16 on my laptop, accessed through Prisma 6. Install with `npm i prisma@6 @prisma/client@6` and do NOT upgrade to Prisma 7 (it moves the database URL into prisma.config.ts and needs a driver adapter, which this schema does not use). Schema is in `server/prisma/schema.prisma`.
- Live chat: Socket.IO. Reminders: pg-boss (jobs live in the same PostgreSQL).
- QR: `qrcode` to draw, `html5-qrcode` to scan. Payments: Razorpay TEST mode. AI: Google Gemini API.
- Passwords: `argon2`. Login: JWT in an httpOnly cookie.

## Folders

- `client/` React app, port 5173. `server/` Fastify API, port 3000.
- In dev, Vite proxies `/api` and `/socket.io` (with WebSocket support) to port 3000, so the app has ONE public address.

## Roles

- ADMIN: sees reports, suspends and unsuspends users and clubs, sees platform stats.
- HOST: creates clubs and events, scans tickets, sees their own ledger.
- MEMBER: joins clubs, books tickets, chats, shows QR pass.

## Rules that must always hold

1. **Suspension is instant.** On EVERY authenticated request, load the user from the database and reject if status is SUSPENDED. Do not trust the JWT alone.
2. **Never trust the browser.** Capacity, ticket price, role and ownership are re-checked on the server even if the UI already hid the button.
3. **Money is integer paise.** No floats anywhere. Never store card data.
4. **The ledger is append-only double-entry.** Each money movement is one `transactionId` with balanced DEBIT and CREDIT rows. Refunds are new reversing rows. No UPDATE or DELETE ever (a database trigger enforces this; see `server/prisma/ledger_immutable.sql`).
5. **Payments are idempotent.** The Razorpay payment id is unique, so refreshing or retrying a payment never creates a second ticket or second ledger entries. Verify the Razorpay signature on the server before issuing a ticket.
6. **Rotating QR.** The QR holds `ticketId` + a code computed as HMAC(ticket.qrSecret, current 30-second time window). The server accepts only the current window (plus one window of clock drift), and rejects a ticket already CHECKED_IN. Only the HOST of that event (or an ADMIN) may check tickets in.
7. **Chat access.** A socket may join a room only if the user is an ACTIVE member of the club, or holds a ticket for the event.
8. **Reminders** are queued at 60, 30 and 10 minutes before an event starts, for every ticket holder. If the event time changes, cancel and requeue. The unique key on Notification (user, event, kind) stops duplicates.
9. **Secrets** live in `server/.env` only. `.env` is in `.gitignore`. Never print or commit keys.
10. **Validate all input with Zod** and return clear 4xx errors, never a crash.

## Environment variables (names only, values go in server/.env)

`DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `GEMINI_API_KEY`, `QR_WINDOW_SECONDS=30`, `REMINDER_GAPS_MINUTES=60,30,10` (set to tiny values like `1,0.5,0.17` for testing)

## How we work

- One phase at a time. Before big phases (auth, QR, payments, reminders) first list the files you will change and wait for me to say go.
- After each phase give me the exact commands to run and what I should see in the browser.
- Keep code simple and commented in plain English. No new libraries without asking.

## Phases

1. Skeleton  2. Database schema  3. Login and roles  4. Clubs  5. Events and ticket types  6. Tickets, rotating QR, scanner  7. Razorpay payments and ledger  8. Live chat  9. Profiles and networking  10. AI event assistant  11. Reminders  12. Admin tools  13. Polish and demo prep

Current phase: 1. Skeleton
