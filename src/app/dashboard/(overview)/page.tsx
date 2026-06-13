import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { QuickAnalytics } from '@/components/dashboard/feed/quick-analytics'
import { UpcomingEvents } from '@/components/dashboard/feed/upcoming-events'
import { TrendingCompanies } from '@/components/dashboard/feed/trending-companies'
import { CommunityFeed } from '@/components/dashboard/feed/community-feed'
import { fetchFeedExperiences } from '@/actions/feed'
import { InterviewPreparationWidget } from '@/components/dashboard/feed/interview-preparation-widget'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  // Fetch all applications for Quick Analytics and Upcoming Events
  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    include: { company: true },
    orderBy: { appliedAt: 'asc' },
  })

  // Calculate Quick Analytics stats
  const totalApplications = applications.length
  let assessmentCount = 0
  let interviewCount = 0
  let offerCount = 0

  applications.forEach(app => {
    if (app.status === 'ONLINE_ASSESSMENT') assessmentCount++
    if (app.status === 'INTERVIEW') interviewCount++
    if (app.status === 'OFFERED') offerCount++
  })

  // Pre-fetch first batch of community feed experiences on the server
  const initialExperiences = await fetchFeedExperiences({ page: 1, limit: 10, sort: 'recent' })

  return (
    <div className="flex flex-col space-y-8 pb-12">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-2">
          Dashboard <span className="text-primary text-2xl font-bold px-3 py-1 bg-primary/10 rounded-full leading-none">Community First</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="font-semibold text-foreground">{user.firstName || 'Student'}</span>! Discover trending experiences, upcoming tasks, and helpful interview questions from the community.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Massive Community Feed */}
        <div className="xl:col-span-2 space-y-8">
          <CommunityFeed initialExperiences={initialExperiences} />
        </div>

        {/* Right Column: Personal & Trending Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <InterviewPreparationWidget />
          <UpcomingEvents applications={applications} />
          
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Your Quick Stats</h3>
            <QuickAnalytics 
              applications={totalApplications} 
              assessments={assessmentCount} 
              interviews={interviewCount} 
              offers={offerCount} 
            />
          </div>

          <div className="pt-4">
            <TrendingCompanies />
          </div>
        </div>

      </div>
    </div>
  )
}
