import { prisma } from "@/lib/prisma"
import { ResourceDiscoveryService } from "@/services/resource-discovery"
import { PageHeader } from "@/components/dashboard/page-header"
import { UnifiedResourcesView } from "@/components/resources/unified-resources-view"
import { deduplicateResources } from "@/lib/resource-utils"

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 1. Auto-seed mock data if empty
  const count = await prisma.externalResource.count()
  if (count === 0) {
    await ResourceDiscoveryService.seedMockResources()
  } else {
    await ResourceDiscoveryService.migrateBrokenUrls()
  }

  // 2. Parse Filters
  const sp = await searchParams
  const topicFilter = typeof sp.topic === "string" ? sp.topic : undefined
  const companyFilter = typeof sp.company === "string" ? sp.company : undefined

  // 3. Fetch Distinct Companies for the filter dropdown
  const distinctCompanies = await prisma.externalResource.findMany({
    select: { company: true },
    distinct: ["company"],
    where: { company: { not: null } },
  })
  const companyOptions = distinctCompanies
    .map((c) => c.company as string)
    .filter(Boolean)
    .sort()

  // 4. Fetch Resources based on filters
  const whereClause: any = {}
  if (topicFilter) {
    whereClause.tags = { has: topicFilter }
  }
  if (companyFilter) {
    whereClause.company = { equals: companyFilter, mode: "insensitive" }
  }

  const rawResources = await prisma.externalResource.findMany({
    where: whereClause,
    orderBy: { fetchedAt: "desc" },
  })

  // 5. Deduplicate overlapping resources by URL and cleaned title
  const allResources = deduplicateResources(rawResources)

  return (
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      {/* Header */}
      <PageHeader
        title="Resource Discovery Engine"
        subtitle="Aggregating curated public preparation guides, interview breakdowns, and engineering tutorials."
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            {allResources.length} Curated Guides
          </span>
        }
      />

      {/* Unified Filter Bar + 3-Column Bento Grid */}
      <UnifiedResourcesView resources={allResources} companies={companyOptions} />
    </div>
  )
}
