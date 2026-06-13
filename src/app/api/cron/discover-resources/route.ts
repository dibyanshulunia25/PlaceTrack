import { NextResponse } from "next/server"
import { ResourceDiscoveryService } from "@/services/resource-discovery"
import { Logger } from "@/lib/logger"

/**
 * Triggered by Vercel Cron Jobs (or similar scheduler)
 * e.g., daily at 2:00 AM UTC
 */
export async function GET(request: Request) {
  try {
    // 1. Verify cron authorization token (if deployed to Vercel/AWS)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Mock seeding for demonstration (replace with actual APIs later)
    const result = await ResourceDiscoveryService.seedMockResources()

    // Future implementation:
    // await ResourceDiscoveryService.discoverYouTubePlaylists("software engineering interview")
    // await ResourceDiscoveryService.discoverArticles("system design interview guide")

    return NextResponse.json({
      success: true,
      message: "Resource discovery job completed",
      details: result
    })
  } catch (error: any) {
    Logger.error(error instanceof Error ? error : new Error(String(error)), { tag: "cron", job: "discover-resources" })
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
