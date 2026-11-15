"use client"

import * as React from "react"
import { ExternalResource } from "@prisma/client"
import { ResourceCard } from "./resource-card"
import { Search, PlaySquare, FileText, Compass, Sparkles, FilterX } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatResourceTitle } from "@/lib/resource-utils"

interface UnifiedResourcesViewProps {
  resources: ExternalResource[]
  companies: string[]
}

type MediaFilter = "all" | "videos" | "articles" | "dsa"

export function UnifiedResourcesView({ resources, companies }: UnifiedResourcesViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mediaFilter, setMediaFilter] = React.useState<MediaFilter>("all")
  const [selectedCompany, setSelectedCompany] = React.useState("")

  const filteredResources = React.useMemo(() => {
    return resources.filter((res) => {
      // 1. Media Type Filter
      const src = (res.source || "").toLowerCase()
      const tags = (res.tags || []).map((t) => t.toLowerCase())
      const tagsStr = tags.join(" ")

      if (mediaFilter === "videos") {
        const isVideo = src.includes("youtube") || tagsStr.includes("video")
        if (!isVideo) return false
      } else if (mediaFilter === "articles") {
        const isArticle =
          !src.includes("youtube") &&
          (src.includes("medium") || src.includes("geeks") || tagsStr.includes("article"))
        if (!isArticle) return false
      } else if (mediaFilter === "dsa") {
        const isDsa =
          tags.includes("dsa") ||
          tags.includes("system design") ||
          tags.includes("os") ||
          tags.includes("dbms")
        if (!isDsa) return false
      }

      // 2. Company Filter
      if (selectedCompany && res.company?.toLowerCase() !== selectedCompany.toLowerCase()) {
        return false
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const cleanTitle = formatResourceTitle(res.title).toLowerCase()
        const summary = (res.summary || "").toLowerCase()
        const company = (res.company || "").toLowerCase()
        const match =
          cleanTitle.includes(q) ||
          summary.includes(q) ||
          company.includes(q) ||
          tagsStr.includes(q)
        if (!match) return false
      }

      return true
    })
  }, [resources, mediaFilter, selectedCompany, searchQuery])

  const clearFilters = () => {
    setSearchQuery("")
    setMediaFilter("all")
    setSelectedCompany("")
  }

  const hasActiveFilters = searchQuery || mediaFilter !== "all" || selectedCompany

  return (
    <div className="space-y-6">
      {/* Unified Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Media-Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setMediaFilter("all")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                mediaFilter === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]"
              )}
            >
              All Resources ({resources.length})
            </button>
            <button
              onClick={() => setMediaFilter("videos")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border inline-flex items-center gap-1.5",
                mediaFilter === "videos"
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]"
              )}
            >
              <PlaySquare className="size-3 text-red-500" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setMediaFilter("articles")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border inline-flex items-center gap-1.5",
                mediaFilter === "articles"
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]"
              )}
            >
              <FileText className="size-3 text-[var(--accent-copper)]" />
              <span>Articles & Guides</span>
            </button>
            <button
              onClick={() => setMediaFilter("dsa")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border inline-flex items-center gap-1.5",
                mediaFilter === "dsa"
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]"
              )}
            >
              <Compass className="size-3 text-primary" />
              <span>DSA & System Design</span>
            </button>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors self-start md:self-auto"
            >
              <FilterX className="size-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Search Input & Company Select */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[var(--border-subtle)]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search guides, video tutorials, or engineering topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
          </div>

          {companies.length > 0 && (
            <div className="w-full sm:w-56">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              >
                <option value="">All Companies</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 3-Column Bento Grid */}
      {filteredResources.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60">
          <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Search className="size-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">No matching resources found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query or media filter to browse all curated engineering guides.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-foreground border border-[var(--border-subtle)] transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  )
}
