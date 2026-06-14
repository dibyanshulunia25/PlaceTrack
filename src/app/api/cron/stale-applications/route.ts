import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EmailService } from "@/services/email"
import { clerkClient } from "@clerk/nextjs/server"

// Vercel CRON Jobs run automatically.
// We must secure this endpoint using the CRON secret.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // We want to find applications that have been in "APPLIED" status for over 7 days.
    // Ideally exactly 7 days so we only send the email once, but to prevent missing some due to downtime,
    // we could look for between 7 and 8 days.
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const eightDaysAgo = new Date()
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8)

    const staleApplications = await prisma.application.findMany({
      where: {
        status: "APPLIED",
        updatedAt: {
          lte: sevenDaysAgo,
          gt: eightDaysAgo,
        },
      },
      include: {
        company: true,
      },
    })

    console.log(`Found ${staleApplications.length} stale applications (7 days old).`)

    let sentCount = 0
    let errorCount = 0

    // Send emails in a loop. For very large scales, we would queue these or use batching.
    for (const app of staleApplications) {
      try {
        // Fetch the user's email address from Clerk using their userId
        const client = await clerkClient()
        const user = await client.users.getUser(app.userId)
        const primaryEmailObj = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
        
        if (!primaryEmailObj?.emailAddress) {
          console.warn(`User ${app.userId} has no primary email.`)
          continue
        }

        await EmailService.sendStaleApplicationReminder(primaryEmailObj.emailAddress, {
          companyName: app.company.name,
          role: app.role,
          applicationId: app.id,
        })
        
        sentCount++
      } catch (err) {
        console.error(`Failed to process reminder for application ${app.id}:`, err)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cron job executed successfully.`,
      stats: {
        totalFound: staleApplications.length,
        emailsSent: sentCount,
        errors: errorCount,
      }
    })
  } catch (error) {
    console.error("Error in stale-applications cron job:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
