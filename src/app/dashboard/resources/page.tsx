import { prisma } from "@/lib/prisma"
import { ResourceCard } from "@/components/resources/resource-card"
import { ResourceFilters } from "@/components/resources/resource-filters"
import { ResourceDiscoveryService } from "@/services/resource-discovery"
import { Compass, PlaySquare, FileText, Bookmark, Search } from "lucide-react"
import { LoadMoreButton } from "@/components/resources/load-more-button"

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 1. Auto-seed mock data if empty (for demonstration of Phase 17A.5)
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

  // 4. Fetch Resources based on filters
  const whereClause: any = {}
  if (topicFilter) {
    whereClause.tags = { has: topicFilter }
  }
  if (companyFilter) {
    whereClause.company = { equals: companyFilter, mode: 'insensitive' }
  }

  const allResources = await prisma.externalResource.findMany({
    where: whereClause,
    orderBy: { fetchedAt: 'desc' }
  })

  // 5. Categorize for Sections
  // Recommended: Hand-picked or specific tags like "Interview Experience", "Guide"
  const recommended = allResources.filter(r => 
    r.title.toLowerCase().includes('guide') || 
    r.title.toLowerCase().includes('preparation') || 
    r.tags.includes('Interview Experience')
  )

  // Videos: source is YouTube or tags include Video
  const videos = allResources.filter(r => 
    r.source.toLowerCase().includes('youtube') || r.tags.includes('Video')
  )

  // Articles: source is Medium/GeeksforGeeks or tags include Article
  const articles = allResources.filter(r => 
    !r.source.toLowerCase().includes('youtube') && 
    (r.source.toLowerCase().includes('medium') || r.source.toLowerCase().includes('geeks') || r.tags.includes('Article'))
  )

  // Topic Based (DSA, OS, DBMS) - Exclude recommended to avoid too much duplication, or just show all
  const technical = allResources.filter(r => 
    r.tags.includes('DSA') || r.tags.includes('OS') || r.tags.includes('DBMS') || r.tags.includes('System Design')
  )

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 pt-8 pb-4">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-clay-inset mb-2">
          <Compass className="size-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Resource Discovery Engine</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Aggregating the best public preparation resources without the noise. Find guides, videos, and articles across the web.
        </p>
      </div>

      {/* Filters */}
      <ResourceFilters companies={companyOptions} />

      {allResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Search className="size-12 mb-4 opacity-20" />
          <p>No resources found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* Section 1: Recommended */}
          {recommended.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Bookmark className="size-6 text-yellow-500" />
                <h2 className="text-2xl font-bold tracking-tight">Recommended Resources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommended.map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
              <LoadMoreButton category="recommended" label="Load More Recommended" />
            </section>
          )}

          {/* Section 2: Videos */}
          {videos.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <PlaySquare className="size-6 text-red-500" />
                <h2 className="text-2xl font-bold tracking-tight">Video Resources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
              <LoadMoreButton category="videos" label="Load More Videos" />
            </section>
          )}

          {/* Section 3: Articles */}
          {articles.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="size-6 text-green-500" />
                <h2 className="text-2xl font-bold tracking-tight">Articles & Guides</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
              <LoadMoreButton category="articles" label="Load More Articles" />
            </section>
          )}

          {/* Section 4: Topic Based */}
          {technical.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Compass className="size-6 text-blue-500" />
                <h2 className="text-2xl font-bold tracking-tight">Topic-Based Deep Dives</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technical.map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
              <LoadMoreButton category="technical" label="Load More Deep Dives" />
            </section>
          )}

        </div>
      )}
    </div>
  )
}
