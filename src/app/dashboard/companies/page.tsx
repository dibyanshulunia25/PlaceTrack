import { getCompaniesDirectory, getUniqueIndustries } from "@/actions/companies"
import { CompanyCard } from "@/components/companies/company-card"
import { CompanyFilters } from "@/components/companies/company-filters"
import { PaginationWrapper } from "@/components/experiences/pagination-wrapper"
import { EmptyState } from "@/components/ui/empty-state"
import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"

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
    <div className="container max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Companies Directory"
        subtitle={`Explore ${totalCompanies} hiring organizations, past rounds, and compensation insights.`}
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-muted-foreground">
            {totalCompanies} Companies
          </span>
        }
      />

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
