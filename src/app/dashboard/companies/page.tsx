import { getCompaniesDirectory, getUniqueIndustries } from "@/actions/companies"
import { CompanyCard } from "@/components/companies/company-card"
import { CompanyFilters } from "@/components/companies/company-filters"
import { PaginationWrapper } from "@/components/experiences/pagination-wrapper"
import { EmptyState } from "@/components/ui/empty-state"
import { Building2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CompaniesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const search = typeof params.search === 'string' ? params.search : undefined
  const industry = typeof params.industry === 'string' ? params.industry : undefined
  const sort = typeof params.sort === 'string' ? params.sort : undefined

  const [directoryData, industries] = await Promise.all([
    getCompaniesDirectory({ search, industry, sort, page }),
    getUniqueIndustries()
  ])

  const { companies, totalPages, totalCompanies } = directoryData

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="p-4 bg-primary/10 rounded-full mb-2 shadow-clay-inset">
          <Building2 className="size-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          Companies Directory
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Explore {totalCompanies} companies to find interview questions, experiences, and application insights.
        </p>
      </div>

      <CompanyFilters industries={industries} />

      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="We couldn't find any companies matching your current filters. Try adjusting them."
        />
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {companies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <PaginationWrapper currentPage={page} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  )
}
