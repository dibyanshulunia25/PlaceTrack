# Presentation & Demonstration Scripts

## 1. 5-Minute Demo Script

**(0:00 - 1:00) Introduction & Problem**
"Hello everyone, I'm here to present **PlaceTrack**, a unified placement management and resource discovery platform. The problem we aimed to solve is simple: the job hunt is chaotic. Students apply to 50+ companies, lose track of assessment deadlines, and struggle to find reliable, company-specific interview experiences. Our solution centralizes tracking and decentralizes knowledge."

**(1:00 - 2:30) Application Tracking & Automated Reminders**
"Let me show you the Dashboard. Here, I can seamlessly log in using Google via our Clerk integration. Once inside, I can add a new application. Notice how the form dynamically updates—if I select 'Interview', it mandates an interview date. What happens under the hood is powerful: PlaceTrack features automated Vercel Cron Jobs. If my interview is in two days, the system automatically dispatches a 'T-2 Preparation Guide' directly to my email using Nodemailer."

**(2:30 - 3:30) Global Experience Repository**
"But tracking isn't enough; we need preparation. Let's move to the Global Repository. Here, any user can share their interview experience. To prevent spam, submissions are strictly rate-limited using Upstash Redis. Other students can read these experiences and upvote them. The most helpful experiences organically rise to the top of the Leaderboard."

**(3:30 - 4:30) Discovery Engine**
"Finally, our Discovery Engine allows users to filter through curated external resources, like YouTube videos on System Design or specific LeetCode patterns. It acts as a targeted search engine for placement prep."

**(4:30 - 5:00) Conclusion**
"Built entirely on a modern serverless stack with Next.js 15 and PostgreSQL, PlaceTrack isn't just an application tracker—it's a comprehensive ecosystem designed to maximize placement success. Thank you!"

---

## 2. 10-Minute Presentation Script

**(0:00 - 2:00) The Motivation & Architecture**
*Expand on the introduction. Discuss the tech stack in depth.*
"We chose Next.js 15 App Router because we wanted a highly performant application with zero layout shift. By utilizing Server Actions, we bypassed the need for a separate REST API backend, significantly reducing latency and architectural complexity. For the database, we opted for Neon Serverless PostgreSQL because it integrates beautifully with Prisma ORM and handles connection pooling efficiently at the edge."

**(2:00 - 4:00) Live Dashboard Walkthrough**
*Walk through the UI slowly.*
"Let's trace a user journey. A user signs up. A Clerk webhook securely pings our Next.js backend, instantly mirroring the user profile in our Postgres database. On the dashboard, they create an application for 'Google'. The system checks if 'Google' exists in our global `Company` table; if not, it creates it. This normalization is crucial for our analytics."

**(4:00 - 6:00) The Magic of Automated Workflows**
*Explain the Cron functionality deeply.*
"One of our proudest features is the automated reminder workflow. We didn't want users to have to check the app every day. Instead, a Vercel Cron job fires daily at 8 AM. It securely authenticates with our API, queries Prisma for any upcoming interviews or stale applications, generates a dynamic HTML template using React Email, and fires it off. It's essentially a personal assistant for the job hunt."

**(6:00 - 8:00) Security and Scaling Considerations**
"Security was paramount. We didn't just build UI; we built defenses. Every Server Action checks the user's JWT. But what about abuse? If a malicious user tries to script 10,000 fake interview experiences to ruin our repository, they'll hit our Upstash Redis rate limiter, which enforces a strict sliding window limit per IP and User ID, keeping our database pristine."

**(8:00 - 10:00) Future Roadmap & Q&A**
"Looking ahead, we plan to integrate LLMs for dynamic resume parsing and mock interviews. PlaceTrack provides a robust, scalable foundation capable of supporting an entire university's placement drive. We're now open for questions regarding the implementation, architecture, or design choices."

---

## 3. Project Showcase / Booth Script (Elevator Pitch)

"Hi! Welcome to PlaceTrack. Are you tired of tracking your job applications in a messy Excel sheet? PlaceTrack is a full-stack platform built with Next.js that completely automates your job hunt. Not only do you get a beautiful dashboard to track your application statuses, but the system actually emails you reminders 48 hours before an interview with preparation checklists! Plus, we have a community-driven repository where you can read exact interview questions asked at companies like Google or Oracle, ranked by helpfulness. Would you like a quick 30-second tour of the dashboard?"
