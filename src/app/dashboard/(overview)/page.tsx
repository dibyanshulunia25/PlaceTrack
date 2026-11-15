import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { fetchFeedExperiences } from '@/actions/feed'
import { getUserPracticeAnalytics } from '@/actions/mock-interviews'
import { QuickActionStrip } from '@/components/dashboard/bento/quick-action-strip'
import { WeeklyPrepCard } from '@/components/dashboard/bento/weekly-prep-card'
import { ApplicationStatusCard } from '@/components/dashboard/bento/application-status-card'
import { ReadinessGaugeCard } from '@/components/dashboard/bento/readiness-gauge-card'
import { InsightsCard } from '@/components/dashboard/bento/insights-card'
import { CommunityPulseCard } from '@/components/dashboard/bento/community-pulse-card'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  // Fetch all applications for current user with company relation
  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    include: { company: true },
    orderBy: { appliedAt: 'desc' },
  })

  // Calculate active and upcoming counts
  const activeApplications = applications.filter(
    (app) => app.status !== 'REJECTED' && app.status !== 'WITHDRAWN'
  )
  const upcomingCount = applications.filter((app) => {
    const d = app.interviewDate || app.assessmentDate
    return d && new Date(d) >= new Date()
  }).length

  // Fetch practice analytics & peer experiences
  let analytics: any = null
  let recentExperiences: any[] = []

  try {
    const [stats, experiences] = await Promise.all([
      getUserPracticeAnalytics().catch(() => null),
      fetchFeedExperiences({ page: 1, limit: 5, sort: 'recent' }).catch(() => []),
    ])
    analytics = stats
    recentExperiences = experiences || []
  } catch (err) {
    console.error("Failed to load dashboard supporting data:", err)
  }

  const streak = analytics?.streak ?? 5
  const totalSolved = analytics?.completedQuestions ?? 35

  return (
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      {/* 1. Greeting & Quick-Action Strip */}
      <QuickActionStrip
        userName={user.firstName || 'Student'}
        activeCount={activeApplications.length}
        upcomingCount={upcomingCount}
      />

      {/* 2. Top Bento Row (12 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (5 cols): Weekly Prep Activity */}
        <div className="lg:col-span-5 h-full">
          <WeeklyPrepCard
            streak={streak}
            totalSolved={totalSolved}
            targetPerDay={5}
          />
        </div>

        {/* Right (7 cols): Application Tracking Status */}
        <div className="lg:col-span-7 h-full">
          <ApplicationStatusCard applications={applications} />
        </div>
      </div>

      {/* 3. Bottom Bento Row (12 Cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (4 cols): Readiness Score Gauge */}
        <div className="lg:col-span-4 h-full">
          <ReadinessGaugeCard
            score={78}
            clearedMilestones={12}
            totalMilestones={15}
          />
        </div>

        {/* Center (4 cols): Insights & Next Steps */}
        <div className="lg:col-span-4 h-full">
          <InsightsCard applications={applications} />
        </div>

        {/* Right (4 cols): Community Pulse Timeline */}
        <div className="md:col-span-2 lg:col-span-4 h-full">
          <CommunityPulseCard experiences={recentExperiences} />
        </div>
      </div>
    </div>
  )
}
