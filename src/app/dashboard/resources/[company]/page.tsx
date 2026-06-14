import { prisma } from "@/lib/prisma"
import { ResourceCard } from "@/components/resources/resource-card"
import { ResourceFilters } from "@/components/resources/resource-filters"
import { Compass, PlaySquare, FileText, Bookmark, Search, Building2 } from "lucide-react"

export default async function CompanyResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ company: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const decodedCompany = decodeURIComponent(resolvedParams.company)

  // 1. Parse Filters
  const sp = await searchParams
  const topicFilter = typeof sp.topic === 'string' ? sp.topic : undefined

  // 2. Fetch Resources strictly for this company
  const whereClause: any = {
    company: { equals: decodedCompany, mode: 'insensitive' }
  }
  
  if (topicFilter) {
    whereClause.tags = { has: topicFilter }
  }

  const allResources = await prisma.externalResource.findMany({
    where: whereClause,
    orderBy: { fetchedAt: 'desc' }
  })

  // 3. Categorize for Sections
  const recommended = allResources.filter(r => 
    r.title.toLowerCase().includes('guide') || 
    r.title.toLowerCase().includes('preparation') || 
    r.tags.includes('Interview Experience') ||
    r.tags.includes('OA')
  )

  const videos = allResources.filter(r => 
    r.source.toLowerCase().includes('youtube') || r.tags.includes('Video')
  )

  const articles = allResources.filter(r => 
    !r.source.toLowerCase().includes('youtube') && 
    (r.source.toLowerCase().includes('medium') || r.source.toLowerCase().includes('geeks') || r.tags.includes('Article'))
  )

  const technical = allResources.filter(r => 
    r.tags.includes('DSA') || r.tags.includes('OS') || r.tags.includes('DBMS') || r.tags.includes('System Design')
  )

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 pt-8 pb-4">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-clay-inset mb-2">
          <Building2 className="size-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">{decodedCompany} Resources</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Targeted preparation guides, specific online assessment patterns, and interview strategies.
        </p>
      </div>

      {/* Filters (Hide company dropdown since we are already in a company page) */}
      <ResourceFilters companies={[]} />

      {allResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Search className="size-12 mb-4 opacity-20" />
          <p>No resources found for {decodedCompany}.</p>
        </div>
      ) : (
        <div className="space-y-16">
          
          {recommended.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Bookmark className="size-6 text-yellow-500" />
                <h2 className="text-2xl font-bold tracking-tight">Recommended for {decodedCompany}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommended.slice(0, 3).map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
            </section>
          )}

          {videos.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <PlaySquare className="size-6 text-red-500" />
                <h2 className="text-2xl font-bold tracking-tight">Video Resources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.slice(0, 3).map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
            </section>
          )}

          {articles.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <FileText className="size-6 text-green-500" />
                <h2 className="text-2xl font-bold tracking-tight">Articles & Guides</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 3).map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
            </section>
          )}

          {technical.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Compass className="size-6 text-blue-500" />
                <h2 className="text-2xl font-bold tracking-tight">Topic-Based Deep Dives</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technical.slice(0, 6).map(res => <ResourceCard key={res.id} resource={res} />)}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}
