# PlaceTrack 🚀

PlaceTrack is a modern, full-stack placement management and resource discovery platform built with Next.js. It helps students and professionals track their job applications, share interview experiences, and discover curated preparation resources.

## Features

- **Application Tracking**: Keep tabs on your job applications, roles, and current statuses (Applied, Assessment, Interview, Offered, Rejected).
- **Global Experience Repository**: Read and share detailed interview experiences, complete with upvoting and leaderboards.
- **Resource Discovery Engine**: Browse curated preparation materials (videos, articles, guides) filterable by topic and company.
- **Automated Email Workflows**: Built-in CRON jobs send automated reminders for upcoming interviews and nudge you to update stale applications.
- **Secure Authentication**: Passwordless and social login powered by Clerk.
- **Rate Limiting & Security**: Robust abuse prevention using Upstash Redis.

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion, shadcn/ui
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Authentication**: Clerk
- **Rate Limiting**: Upstash Redis
- **Email Service**: Nodemailer (via Gmail SMTP) & React Email
- **Deployment**: Vercel

## Quick Start

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the required keys.
4. Run `npx prisma db push` to sync the database.
5. Run `npm run dev` to start the local development server.

---

*Built for the community, to make placement tracking effortless.*
