"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, FilterX } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompanyFiltersProps {
  industries: string[]
}

const CATEGORY_CHIPS = ["Product", "Fintech", "Service", "Off-Campus"]

export function CompanyFilters({ industries }: CompanyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const currentIndustry = searchParams.get("industry") || ""

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard/companies?${createQueryString("search", search)}`)
  }

  const handleSelectFilter = (name: string, value: string) => {
    router.push(`/dashboard/companies?${createQueryString(name, value)}`)
  }

  const handleClear = () => {
    setSearch("")
    router.push(`/dashboard/companies`)
  }

  const hasFilters = search || currentIndustry

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)] space-y-4">
      {/* Category Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Categories:
          </span>
          <button
            onClick={() => handleSelectFilter("industry", "")}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
              !currentIndustry
                ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {CATEGORY_CHIPS.map((cat) => {
            const isSelected = currentIndustry.toLowerCase() === cat.toLowerCase()
            return (
              <button
                key={cat}
                onClick={() => handleSelectFilter("industry", isSelected ? "" : cat)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                    : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]"
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {hasFilters && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
          >
            <FilterX className="size-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Instant Search Bar & Industry Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search companies by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            onBlur={() => router.push(`/dashboard/companies?${createQueryString("search", search)}`)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
          <button type="submit" className="hidden" />
        </form>

        {industries.length > 0 && (
          <div className="w-full sm:w-60">
            <select
              value={currentIndustry}
              onChange={(e) => handleSelectFilter("industry", e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            >
              <option value="">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
