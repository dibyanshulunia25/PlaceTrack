import { getMostActiveCompanies, getMostHelpfulExperiences, getPopularTopics, getTopContributors, Timeframe } from "@/actions/leaderboard"
import { TopContributors } from "@/components/leaderboard/top-contributors"
import { HelpfulExperiences } from "@/components/leaderboard/helpful-experiences"
import { TrendingGrid } from "@/components/leaderboard/trending-grid"
import { Trophy } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  const tfParam = typeof params.timeframe === 'string' ? params.timeframe : 'all-time'
  const timeframe: Timeframe = (tfParam === 'weekly' || tfParam === 'monthly') ? tfParam : 'all-time'

  const [contributors, experiences, companies, topics] = await Promise.all([
    getTopContributors(timeframe),
    getMostHelpfulExperiences(timeframe),
    getMostActiveCompanies(timeframe),
    getPopularTopics(timeframe)
  ])

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="p-4 bg-yellow-500/10 rounded-full mb-2 shadow-clay-inset">
          <Trophy className="size-12 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
          Community Leaderboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Celebrating the most active and helpful members of our community.
        </p>

        {/* Timeframe Filters */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
          <Link 
            href="/leaderboard?timeframe=weekly"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${timeframe === 'weekly' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            Weekly
          </Link>
          <Link 
            href="/leaderboard?timeframe=monthly"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${timeframe === 'monthly' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            Monthly
          </Link>
          <Link 
            href="/leaderboard?timeframe=all-time"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${timeframe === 'all-time' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            All-Time
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Column: Top Contributors */}
        <div className="lg:col-span-7 xl:col-span-8">
          <TopContributors contributors={contributors} />
        </div>

        {/* Sidebar: Experiences & Trending */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-8">
          <HelpfulExperiences experiences={experiences} />
          <TrendingGrid companies={companies} topics={topics} />
        </div>

      </div>

    </div>
  )
}
