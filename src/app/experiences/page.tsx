import { prisma } from "@/lib/prisma"
import { PublicExperienceCard } from "@/components/experiences/public-experience-card"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { ExperienceFilters } from "@/components/experiences/experience-filters"
import { PaginationWrapper } from "@/components/experiences/pagination-wrapper"

export default async function ExperiencesRepository({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await currentUser()
  if (!user) redirect("/sign-in")
  
  const params = await searchParams

  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const limit = 9
  
  const search = typeof params.search === 'string' ? params.search : undefined
  const company = typeof params.company === 'string' ? params.company : undefined
  const role = typeof params.role === 'string' ? params.role : undefined
  const year = typeof params.year === 'string' ? parseInt(params.year) : undefined
  const difficulty = typeof params.difficulty === 'string' ? parseInt(params.difficulty) : undefined

  // Helper to format query for Postgres FTS tsquery
  const formatSearchQuery = (query: string) => {
    return query.trim().split(/\s+/).join(' | ')
  }

  const whereClause: any = {}
  
  if (search) {
    const formattedSearch = formatSearchQuery(search)
    whereClause.OR = [
      { title: { search: formattedSearch } },
      { content: { search: formattedSearch } },
      { role: { search: formattedSearch } },
      { company: { is: { name: { search: formattedSearch } } } },
      { tags: { hasSome: search.split(/\s+/) } }
    ]
    
    // Also extract year if a 4-digit number is present
    const yearMatch = search.match(/\b(20\d{2})\b/)
    if (yearMatch) {
      whereClause.OR.push({ year: parseInt(yearMatch[1]) })
    }
  }
  
  if (company) {
    whereClause.company = { is: { name: { search: formatSearchQuery(company) } } }
  }
  
  if (role) {
    whereClause.role = { search: formatSearchQuery(role) }
  }
  
  if (year) {
    whereClause.year = year
  }
  
  if (difficulty) {
    whereClause.difficulty = difficulty
  }

  const [experiences, total] = await Promise.all([
    prisma.experience.findMany({
      where: whereClause,
      include: {
        company: true,
        user: true,
        votes: { where: { userId: user.id } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.experience.count({ where: whereClause })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <ExperienceFilters />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Experience Repository
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Browse {total} interview experiences from the community.
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-xl bg-white/30 dark:bg-white/5 backdrop-blur-md">
            <h3 className="text-xl font-bold mb-2">No experiences found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {experiences.map((exp, i) => (
                <PublicExperienceCard key={exp.id} experience={exp} index={i} />
              ))}
            </div>
            
            <PaginationWrapper currentPage={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  )
}
