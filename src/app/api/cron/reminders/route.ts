import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EmailService } from "@/services/email"
import { differenceInDays, startOfDay, format } from "date-fns"
import { Logger } from "@/lib/logger"

// Standard Vercel Cron Secret validation
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(req: Request) {
  // 1. Verify Authorization
  const authHeader = req.headers.get("authorization")
  
  // In development, we might not have a CRON_SECRET, but in production we require it to prevent abuse
  if (process.env.NODE_ENV === "production" && CRON_SECRET) {
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const today = startOfDay(new Date())

    // 2. Fetch all applications with upcoming/recent events (not rejected/withdrawn/offered)
    const activeApplications = await prisma.application.findMany({
      where: {
        status: { in: ['APPLIED', 'ONLINE_ASSESSMENT', 'INTERVIEW'] },
        OR: [
          { assessmentDate: { not: null } },
          { interviewDate: { not: null } }
        ]
      },
      include: {
        user: true,
        company: true
      }
    })

    const results = []

    // 3. Process Reminders
    for (const app of activeApplications) {
      if (!app.user.email) continue

      // Determine the next event date
      let eventDate = null
      let eventType = "Upcoming Event"
      
      if (app.interviewDate) {
        eventDate = startOfDay(app.interviewDate)
        eventType = "Interview"
      } else if (app.assessmentDate) {
        eventDate = startOfDay(app.assessmentDate)
        eventType = "Online Assessment"
      }

      if (!eventDate) continue

      const diffDays = differenceInDays(eventDate, today)
      
      let reminderToSend = null
      let reminderTag = ""

      // 4. Decide workflow state
      if (diffDays === 2 && !app.remindersSent.includes("t2")) {
        reminderToSend = EmailService.sendT2Reminder.bind(EmailService)
        reminderTag = "t2"
      } else if (diffDays === 1 && !app.remindersSent.includes("t1")) {
        reminderToSend = EmailService.sendT1Reminder.bind(EmailService)
        reminderTag = "t1"
      } else if (diffDays === 0 && !app.remindersSent.includes("dayOf")) {
        reminderToSend = EmailService.sendGoodLuckEmail.bind(EmailService)
        reminderTag = "dayOf"
      } else if (diffDays === -1 && !app.remindersSent.includes("feedback")) {
        reminderToSend = EmailService.sendFeedbackRequestEmail.bind(EmailService)
        reminderTag = "feedback"
      }

      // 5. Send Email and Update DB
      if (reminderToSend) {
        const props = {
          candidateName: app.user.name || "Candidate",
          companyName: app.company.name,
          role: app.role,
          eventType,
          date: format(eventDate, "MMMM do, yyyy"),
          time: format(app.interviewDate || app.assessmentDate!, "h:mm a")
        }

        // Send the email (incorporates retry strategy internally)
        const sendResult = await reminderToSend(app.user.email, props)

        if (sendResult.success) {
          // Record successful send
          await prisma.application.update({
            where: { id: app.id },
            data: {
              remindersSent: { push: reminderTag }
            }
          })
          results.push({ app: app.id, tag: reminderTag, status: "success" })
        } else {
          // Retry failed entirely. We leave remindersSent unchanged, allowing a retry on the next cron run
          results.push({ app: app.id, tag: reminderTag, status: "failed", error: sendResult.error })
        }
      }
    }

    return NextResponse.json({ success: true, processed: results })

  } catch (error) {
    Logger.error(error instanceof Error ? error : new Error(String(error)), { tag: "cron", job: "reminders" })
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
