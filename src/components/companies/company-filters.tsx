"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

interface CompanyFiltersProps {
  industries: string[]
}

export function CompanyFilters({ industries }: CompanyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete("page") // Reset page on filter change
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/companies?${createQueryString("search", search)}`)
  }

  const handleSelectFilter = (name: string, value: string) => {
    router.push(`/companies?${createQueryString(name, value)}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search companies by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/20 bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-clay-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
        />
        <button type="submit" className="hidden" />
      </form>

      {/* Industry Filter */}
      <div className="w-full md:w-64">
        <select
          defaultValue={searchParams.get("industry") || ""}
          onChange={(e) => handleSelectFilter("industry", e.target.value)}
          className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-clay-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground appearance-none cursor-pointer"
        >
          <option value="">All Industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="w-full md:w-48">
        <select
          defaultValue={searchParams.get("sort") || "name"}
          onChange={(e) => handleSelectFilter("sort", e.target.value)}
          className="w-full px-4 py-4 rounded-2xl border border-white/20 bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-clay-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground appearance-none cursor-pointer"
        >
          <option value="name">Sort by Name (A-Z)</option>
          <option value="popular">Most Experiences</option>
          <option value="applications">Most Applications</option>
          <option value="recent">Recently Active</option>
        </select>
      </div>
    </div>
  )
}
