# PlaceTrack - Project Report

## 1. Project Abstract
PlaceTrack is a comprehensive, full-stack placement management and resource discovery platform designed to streamline the campus recruitment and job application process for students and professionals. By decentralizing the tracking of job applications, PlaceTrack empowers users to monitor their individual application life cycles—from the initial applied stage to online assessments, interviews, and final offers. Simultaneously, the platform fosters a collaborative environment by integrating a Global Experience Repository where candidates can share interview questions, tips, and experiences, ranked via a community-driven upvoting system. A Resource Discovery Engine further supplements preparation by providing curated, filterable access to external tutorials, articles, and videos. Built on a modern serverless architecture utilizing Next.js 15, PostgreSQL, and Redis, PlaceTrack ensures high performance, stringent security, and reliable automated workflows (such as interview reminders) to maximize a candidate's chances of success.

## 2. Problem Statement
**Context**: The job placement process is highly fragmented and stressful. Candidates apply to dozens of companies across various platforms, leading to lost track of application statuses, missed assessment deadlines, and disorganized preparation. Furthermore, valuable, company-specific interview experiences are often siloed in unstructured messaging groups or obscure forums, making it difficult for future candidates to access relevant preparation material.

**Solution**: PlaceTrack provides a centralized, unified dashboard to track all applications and impending deadlines. It mitigates the loss of institutional knowledge by crowd-sourcing interview experiences into a structured, searchable global database, and automates deadline tracking via cron-triggered email reminders, effectively reducing candidate cognitive load and improving placement outcomes.

## 3. System Architecture
PlaceTrack utilizes a decoupled, modern cloud-native architecture:
- **Client/Frontend**: Built with React 19 and Next.js App Router. UI components are styled using Tailwind CSS and shadcn/ui.
- **Server/Backend**: Serverless Next.js API Routes and Server Actions execute business logic securely on the edge/server.
- **Database**: A serverless PostgreSQL instance hosted on Neon, accessed securely via the Prisma ORM.
- **Caching/Rate Limiting**: Upstash Redis provides high-throughput, low-latency in-memory data structures to handle API rate limiting and abuse prevention.
- **Authentication**: Clerk handles identity management, OAuth provisioning, and secure session tokens, synchronizing users to the primary database via webhooks.
- **Background Jobs**: Vercel Cron triggers automated endpoints to process and dispatch asynchronous email reminders via Nodemailer and Google SMTP.

## 4. ER Diagram Explanation
The Entity-Relationship structure revolves around the central `User` entity:
- **User (1) <---> (N) Application**: A user can have many applications.
- **User (1) <---> (N) Experience**: A user can author many public experiences.
- **Company (1) <---> (N) Application**: A single company can have many applications from different users.
- **Company (1) <---> (N) Experience**: A single company can have many associated experiences.
- **User (M) <---> (N) Experience (via Upvote)**: A many-to-many relationship where users can upvote various experiences.
- **ExternalResource**: An independent entity storing curated learning materials with specific topic and company tags for the Discovery Engine.

## 5. Database Design Explanation
The database leverages PostgreSQL for robust ACID compliance and relational integrity.
- **Data Normalization**: The design minimizes redundancy. For example, `Company` is extracted into its own table rather than repeating company names across `Application` and `Experience` tables. This enables aggregation (e.g., finding all experiences for "Google").
- **Referential Integrity**: Foreign keys (`userId`, `companyId`) enforce constraints, ensuring that if a company or user is deleted, cascading actions prevent orphaned records.
- **Enums**: The application state (`APPLIED`, `INTERVIEW`, `OFFERED`, etc.) is strictly enforced at the database level using a PostgreSQL `ENUM` type, preventing malformed data.
- **Indexes**: Strategic indexing is applied to `userId`, `companyId`, and `status` to ensure query performance remains $O(\log n)$ as the platform scales.

## 6. Security Architecture
- **Authentication & Sessions**: Passwordless and social OAuth managed entirely by Clerk. Session tokens (JWTs) are validated on the Edge using Next.js Middleware.
- **Authorization (RBAC)**: Role-Based Access Control determines permissions. A user's role is verified securely on the server before executing operations (e.g., standard users cannot access the `/admin` dashboard or delete other users' experiences).
- **Rate Limiting**: Critical endpoints (like form submissions and upvoting) are wrapped in the `@upstash/ratelimit` library, preventing brute-force and DDoS attacks by enforcing a strict sliding-window limit per IP/User ID.
- **Data Sanitization**: All user inputs (especially markdown-enabled text areas in experiences) are sanitized using `xss` and validated against strict `zod` schemas on the server before touching the database to prevent SQL injection and Cross-Site Scripting (XSS).

## 7. Deployment Architecture
- **Vercel Edge Network**: The Next.js application is deployed directly to Vercel, which distributes static assets to a global CDN and executes Server Actions on serverless functions.
- **Database Pooling**: Because serverless environments spawn thousands of concurrent connections, Prisma connects to Neon DB via a PgBouncer connection pool, preventing connection exhaustion.
- **CI/CD**: Continuous Integration and Continuous Deployment are integrated via GitHub. Every push to the `main` branch triggers an automated build, Prisma schema generation, database migration (`prisma migrate deploy`), and subsequent deployment.

## 8. Future Scope
- **AI Mock Interviews**: Integrate an LLM (like Gemini or OpenAI) to conduct dynamic, conversational mock interviews based on the role and company the user applies for.
- **Resume Parsing**: Implement OCR and NLP to allow users to upload their resumes, automatically extracting text to autofill applications.
- **College/University Dashboards**: Create dedicated organizational sub-domains where placement coordinators can view aggregate statistics for their specific college's students.
- **In-App Messaging**: Enable peer-to-peer messaging so users can privately contact the authors of interview experiences for detailed guidance.
