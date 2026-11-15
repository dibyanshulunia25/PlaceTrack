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

  const now = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(now.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  // Fetch real data across user applications, practice sessions, and peer experiences
  const [
    applications,
    allSessions,
    recentSessions,
    progressList,
    bookmarksCount,
    experiencesCount,
    analytics,
    recentExperiences,
  ] = await Promise.all([
    prisma.application.findMany({
      where: { userId: user.id },
      include: { company: true },
      orderBy: { appliedAt: 'desc' },
    }).catch(() => []),
    prisma.practiceSession.findMany({
      where: { userId: user.id },
      select: { id: true, startedAt: true },
      orderBy: { startedAt: 'asc' },
    }).catch(() => []),
    prisma.practiceSession.findMany({
      where: {
        userId: user.id,
        startedAt: { gte: sevenDaysAgo },
      },
      select: { startedAt: true },
    }).catch(() => []),
    prisma.practiceProgress.findMany({
      where: { userId: user.id },
    }).catch(() => []),
    prisma.bookmark.count({
      where: { userId: user.id },
    }).catch(() => 0),
    prisma.experience.count({
      where: { userId: user.id },
    }).catch(() => 0),
    getUserPracticeAnalytics().catch(() => null),
    fetchFeedExperiences({ page: 1, limit: 5, sort: 'recent' }).catch(() => []),
  ])

  // 1. Calculate active and upcoming counts
  const activeApplications = applications.filter(
    (app) => app.status !== 'REJECTED' && app.status !== 'WITHDRAWN'
  )
  const upcomingCount = applications.filter((app) => {
    const d = app.interviewDate || app.assessmentDate
    return d && new Date(d) >= now
  }).length

  // 2. Weekly Prep Activity (Real 7-day breakdown ending today)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const weeklyDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(now.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)

    const nextD = new Date(d)
    nextD.setDate(nextD.getDate() + 1)

    const count = recentSessions.filter((s) => {
      const st = new Date(s.startedAt)
      return st >= d && st < nextD
    }).length

    return {
      day: dayNames[d.getDay()],
      date: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      count,
      isToday: i === 6,
    }
  })

  const totalSolvedThisWeek = weeklyDays.reduce((acc, d) => acc + d.count, 0)
  const streak = analytics?.streak ?? 0
  const totalSolvedAllTime = allSessions.length

  // 3. Dynamic Placement Readiness & Milestones Calculation
  const totalApps = applications.length
  const hasAssessment = applications.some(
    (a) => a.status === 'ONLINE_ASSESSMENT' || a.assessmentDate
  )
  const hasInterview = applications.some(
    (a) => a.status === 'INTERVIEW' || a.interviewDate
  )
  const hasOffer = applications.some((a) => a.status === 'OFFERED')

  const milestones = [
    { id: 'first_app', achieved: totalApps >= 1, weight: 10 },
    { id: 'multiple_apps', achieved: totalApps >= 5, weight: 10 },
    { id: 'reach_oa', achieved: hasAssessment || hasInterview || hasOffer, weight: 10 },
    { id: 'reach_interview', achieved: hasInterview || hasOffer, weight: 15 },
    { id: 'receive_offer', achieved: hasOffer, weight: 20 },
    { id: 'first_practice', achieved: totalSolvedAllTime >= 1, weight: 10 },
    { id: 'consistent_prep', achieved: totalSolvedAllTime >= 5, weight: 10 },
    { id: 'deep_practice', achieved: totalSolvedAllTime >= 15, weight: 10 },
    { id: 'practice_streak', achieved: streak >= 3, weight: 10 },
    { id: 'share_experience', achieved: experiencesCount >= 1, weight: 10 },
  ]

  const clearedMilestones = milestones.filter((m) => m.achieved).length
  const totalMilestones = milestones.length
  const rawScore = milestones.reduce((sum, m) => sum + (m.achieved ? m.weight : 0), 0)
  const readinessScore = Math.min(100, Math.max(0, rawScore))

  // Real Competencies from practiceProgress
  const competencies = (analytics?.strongAreas && analytics.strongAreas.length > 0
    ? analytics.strongAreas
    : progressList
  )
    .slice(0, 2)
    .map((item: any) => ({
      name: item.category,
      score: Math.round(
        (item.combinedScore !== undefined ? item.combinedScore : item.progressPercentage ?? 0) *
          (item.combinedScore !== undefined && item.combinedScore <= 1 ? 100 : 1)
      ),
    }))

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
            totalSolvedThisWeek={totalSolvedThisWeek}
            totalSolvedAllTime={totalSolvedAllTime}
            targetPerDay={5}
            days={weeklyDays}
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
            score={readinessScore}
            clearedMilestones={clearedMilestones}
            totalMilestones={totalMilestones}
            competencies={competencies}
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
