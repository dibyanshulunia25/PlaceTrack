import { prisma } from "@/lib/prisma"
import { ResourceFilters } from "@/components/resources/resource-filters"
import { ResourceDiscoveryService } from "@/services/resource-discovery"
import { Compass, Search, Bookmark, Target, TrendingUp } from "lucide-react"
import { ResourceFeed } from "@/components/resources/resource-feed"
import { fetchResources, getDiscoveryAnalytics } from "@/actions/discovery"

export const dynamic = 'force-dynamic'

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 1. Auto-seed mock data if empty
  const count = await prisma.externalResource.count()
  if (count === 0) {
    await ResourceDiscoveryService.seedMockResources()
  }

  // 2. Parse Filters
  const sp = await searchParams
  const topicFilter = typeof sp.topic === 'string' ? sp.topic : undefined
  const companyFilter = typeof sp.company === 'string' ? sp.company : undefined

  // 3. Fetch Distinct Companies for the filter dropdown
  const distinctCompanies = await prisma.externalResource.findMany({
    select: { company: true },
    distinct: ['company'],
    where: { company: { not: null } }
  })
  const companyOptions = distinctCompanies.map(c => c.company as string).filter(Boolean).sort()

  // 4. Fetch initial feed
  const { resources, userBookmarks } = await fetchResources(1, 12, topicFilter, companyFilter)
  
  // 5. Fetch User Analytics
  const analytics = await getDiscoveryAnalytics()

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 pt-8 pb-4">
        <div className="size-16 rounded-3xl bg-blue-500/10 flex items-center justify-center shadow-clay-inset mb-2 border border-blue-500/20">
          <Compass className="size-8 text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Discovery Engine</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Aggregating the best public preparation resources without the noise. Personalized to your active applications and search history.
        </p>
      </div>

      {analytics && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl"><Target className="size-5 text-blue-500" /></div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Resources Explored</p>
              <p className="text-2xl font-black">{analytics.viewedCount}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl"><Bookmark className="size-5 text-yellow-500" /></div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Saved Resources</p>
              <p className="text-2xl font-black">{analytics.savedCount}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl"><TrendingUp className="size-5 text-emerald-500" /></div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Top Interests</p>
              <p className="text-sm font-bold truncate max-w-[150px]">
                {analytics.topTags.length > 0 ? analytics.topTags.slice(0, 2).join(", ") : "Start exploring!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <ResourceFilters companies={companyOptions} />

      {/* Infinite Scroll Feed */}
      <ResourceFeed 
        initialResources={resources} 
        initialBookmarks={userBookmarks}
        topic={topicFilter}
        company={companyFilter}
      />
      
    </div>
  )
}
