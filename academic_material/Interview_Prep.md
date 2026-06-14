# Interview & Academic Prep

## 1. Viva Questions & Answers

**Q1: Why did you choose Next.js App Router over traditional React with Create React App?**
**A1:** Next.js App Router provides built-in Server-Side Rendering (SSR) and Server Components. This significantly reduces the initial JavaScript bundle sent to the client, improving page load speeds and SEO. It also allows us to write secure database logic directly in Server Actions without needing to stand up a separate Express backend.

**Q2: How are you managing state in this application?**
**A2:** Since we use Next.js Server Components, much of the data fetching happens on the server, eliminating the need for complex client-side state managers like Redux for data. For form state, we use `react-hook-form` coupled with `zod` for validation. For UI state (like dropdowns or dialogs), we use standard React `useState`.

**Q3: Explain how your database normalization works.**
**A3:** We abstracted `Company` into its own table rather than storing the company name directly in every `Application` and `Experience` record as a simple string. This ensures consistency (e.g., preventing "Google" and "Google LLC" from being treated as different entities) and allows us to easily fetch all experiences tied to a single company ID.

**Q4: How do the automated emails work?**
**A4:** We configured a `vercel.json` file to trigger a specific Next.js API route every day at a scheduled time. This API route checks the PostgreSQL database via Prisma for applications meeting certain date conditions (e.g., 2 days before an interview). It then dynamically generates an HTML email using React Email and dispatches it via Nodemailer using a Gmail SMTP relay.

## 2. Recruiter Questions & Answers

**Q: What was the most challenging technical problem you faced in this project?**
**A:** Handling asynchronous webhooks for authentication. Because Clerk manages our users, we had to set up a secure webhook endpoint to listen for `user.created` events. Validating the SVIX signatures to prevent spoofed requests and handling race conditions where a user might log in before the database was populated required careful architectural planning.

**Q: If we had to scale this platform to 100,000 active students tomorrow, what would break first?**
**A:** The PostgreSQL connection pool. In a serverless environment like Vercel, thousands of concurrent functions could instantly exhaust the database connections. We pre-emptively solved this by using Neon DB's built-in PgBouncer pooling, which multiplexes thousands of lightweight connections into a few heavy backend connections. The next bottleneck would likely be the SMTP email relay limits, which we would solve by migrating from Gmail to a dedicated service like AWS SES.

## 3. System Design Discussion

**Interviewer:** "Design a rate-limiting system for the Experience Submission endpoint."
**Discussion Strategy:** 
1. **Identify the goal:** Prevent a single user or IP from spamming the database with fake experiences.
2. **Choose the datastore:** We need a fast, in-memory datastore. Redis (via Upstash) is the perfect candidate because it operates in memory and handles TTL (Time-to-Live) expiration natively.
3. **Algorithm:** Implement a Sliding Window or Token Bucket algorithm. For example, limit to 5 requests per minute.
4. **Implementation:** Use `@upstash/ratelimit`. In the Next.js Server Action, before executing the Prisma `create` query, ping Redis with the user's ID. If the limit is exceeded, throw an error and abort the transaction.

## 4. Security Discussion

**Interviewer:** "How did you secure your API routes against unauthorized access?"
**Discussion Strategy:**
1. **User Authentication:** Clerk's Next.js middleware automatically intercepts requests. We use `auth()` from `@clerk/nextjs` to extract the session token on the server. If `userId` is null, we throw a 401 Unauthorized.
2. **Authorization:** Even if authenticated, a user shouldn't be able to edit someone else's application. Our Prisma queries explicitly enforce ownership: `prisma.application.update({ where: { id: appId, userId: currentUser.id } })`.
3. **Cron Security:** Since cron endpoints are public URLs triggered by Vercel, we protect them by requiring an `Authorization: Bearer CRON_SECRET` header, which only our Vercel environment knows.

## 5. Deployment Discussion

**Interviewer:** "Explain the CI/CD pipeline of PlaceTrack."
**Discussion Strategy:**
1. Code is written locally and pushed to a GitHub repository.
2. Vercel's GitHub integration detects the push.
3. Vercel provisions a clean build container, installs dependencies (`npm install`), and runs the build script.
4. Crucially, our build script runs `prisma generate` to create the TypeScript types, and `prisma migrate deploy` to safely apply any schema changes to the live Neon production database.
5. Next.js compiles the React code. If type-checking or linting fails, the deployment is aborted, protecting production. If successful, the new version goes live seamlessly.
