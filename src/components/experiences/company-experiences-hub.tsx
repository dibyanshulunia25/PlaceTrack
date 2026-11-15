"use client"

import * as React from "react"
import { Search, Filter, Layers, ListFilter, Building2, FileText, ArrowRight, Plus } from "lucide-react"
import { CompanyExperienceCard, CompanyExperienceCardData } from "./company-experience-card"
import { PublicExperienceCard } from "./public-experience-card"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

interface CompanyExperiencesHubProps {
  companies: CompanyExperienceCardData[]
  allExperiences: any[]
}

export function CompanyExperiencesHub({
  companies,
  allExperiences,
}: CompanyExperiencesHubProps) {
  const [search, setSearch] = React.useState("")
  const [filterMode, setFilterMode] = React.useState<"all" | "popular" | "recent" | "hard">("all")
  const [viewMode, setViewMode] = React.useState<"folders" | "feed">("folders")

  // Filter & sort companies
  const filteredCompanies = React.useMemo(() => {
    let result = [...companies]

    // 1. Text Search Filter (matches company name or any common role)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.commonRoles.some((r) => r.toLowerCase().includes(q)) ||
          (c.industry && c.industry.toLowerCase().includes(q))
      )
    }

    // 2. Sort/Filter Pill
    if (filterMode === "popular") {
      result.sort((a, b) => b.totalExperiences - a.totalExperiences)
    } else if (filterMode === "recent") {
      // already sorted by latest submission in query
    } else if (filterMode === "hard") {
      result = result.filter((c) => c.avgDifficulty > 3.7)
      result.sort((a, b) => b.avgDifficulty - a.avgDifficulty)
    }

    return result
  }, [companies, search, filterMode])

  // Filter all individual experiences when in feed view
  const filteredExperiences = React.useMemo(() => {
    if (!search.trim()) return allExperiences
    const q = search.toLowerCase()
    return allExperiences.filter(
      (exp) =>
        exp.company.name.toLowerCase().includes(q) ||
        exp.role.toLowerCase().includes(q) ||
        exp.title.toLowerCase().includes(q)
    )
  }, [allExperiences, search])

  return (
    <div className="space-y-6">
      {/* Control Bar: Search Input + Filter Pills + View Mode Toggle */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)] space-y-4">
        {/* Top Filter Row: Pills & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Filter:
            </span>
            <button
              onClick={() => setFilterMode("all")}
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
                filterMode === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground"
              )}
            >
              All Companies ({companies.length})
            </button>
            <button
              onClick={() => setFilterMode("popular")}
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
                filterMode === "popular"
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground"
              )}
            >
              Most Experiences
            </button>
            <button
              onClick={() => setFilterMode("recent")}
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
                filterMode === "recent"
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground"
              )}
            >
              Recent Updates
            </button>
            <button
              onClick={() => setFilterMode("hard")}
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
                filterMode === "hard"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground"
              )}
            >
              High Difficulty
            </button>
          </div>

          {/* View Mode Toggle: Folders vs Feed */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 self-start sm:self-auto shrink-0 shadow-2xs">
            <button
              onClick={() => setViewMode("folders")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                viewMode === "folders"
                  ? "bg-[var(--bg-surface)] text-foreground border border-[var(--border-subtle)] shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Company Folders View"
            >
              <Layers className="size-3.5" />
              <span>Company Folders</span>
            </button>
            <button
              onClick={() => setViewMode("feed")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                viewMode === "feed"
                  ? "bg-[var(--bg-surface)] text-foreground border border-[var(--border-subtle)] shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="All Submissions Timeline Feed"
            >
              <ListFilter className="size-3.5" />
              <span>All Submissions ({allExperiences.length})</span>
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company name, role (e.g. SDE-1, Data Analyst), or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "folders" ? (
        filteredCompanies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={search ? "No matching companies found" : "No experiences tracked yet"}
            description={
              search
                ? `No company experiences match "${search}". Try clearing your search keyword.`
                : "Be the first to share an interview or online assessment experience!"
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {filteredCompanies.map((company) => (
              <CompanyExperienceCard key={company.id} company={company} />
            ))}
          </div>
        )
      ) : filteredExperiences.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search ? "No matching experiences" : "No experiences in feed"}
          description="Try adjusting your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {filteredExperiences.map((exp, i) => (
            <PublicExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
