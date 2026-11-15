"use client"

import * as React from "react"
import { ExternalResource } from "@prisma/client"
import { ExternalLink, PlaySquare, FileText, BookOpen, Bookmark, Check } from "lucide-react"
import Link from "next/link"
import { formatResourceTitle } from "@/lib/resource-utils"
import { cn } from "@/lib/utils"

export function ResourceCard({ resource }: { resource: ExternalResource }) {
  const [isBookmarked, setIsBookmarked] = React.useState(false)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`bookmark_resource_${resource.id}`)
      if (saved === "true") setIsBookmarked(true)
    } catch {}
  }, [resource.id])

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !isBookmarked
    setIsBookmarked(next)
    try {
      if (next) {
        localStorage.setItem(`bookmark_resource_${resource.id}`, "true")
      } else {
        localStorage.removeItem(`bookmark_resource_${resource.id}`)
      }
    } catch {}
  }

  // Determine media icon and badge styling
  let Icon = BookOpen
  let badgeLabel = resource.source || "Guide"
  let badgeColor = "bg-primary/10 text-primary border-primary/20"

  const src = (resource.source || "").toLowerCase()
  const tagsStr = (resource.tags || []).join(" ").toLowerCase()

  if (src.includes("youtube") || tagsStr.includes("video")) {
    Icon = PlaySquare
    badgeLabel = "Video Guide"
    badgeColor = "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
  } else if (src.includes("medium") || src.includes("geeks") || tagsStr.includes("article")) {
    Icon = FileText
    badgeLabel = "Article / Deep Dive"
    badgeColor = "bg-[var(--accent-copper)]/10 text-[var(--accent-copper)] border-[var(--accent-copper)]/20"
  }

  const cleanTitle = formatResourceTitle(resource.title)

  return (
    <div className="group flex flex-col justify-between h-full p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)] hover:border-primary/40 transition-all duration-150">
      <div>
        {/* Header: Media Type Pill + Bookmark & Link */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 shrink-0",
              badgeColor
            )}
          >
            <Icon className="size-3" />
            <span>{badgeLabel}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleBookmark}
              className={cn(
                "p-1.5 rounded-lg border transition-all text-xs",
                isBookmarked
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-[var(--border-subtle)] text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]"
              )}
              title={isBookmarked ? "Remove bookmark" : "Save resource"}
              aria-label="Bookmark resource"
            >
              <Bookmark className={cn("size-3.5", isBookmarked && "fill-current")} />
            </button>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] transition-colors"
              title="Open external resource"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Title */}
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
          <h3 className="font-bold text-base text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {cleanTitle}
          </h3>
        </a>

        {/* Summary */}
        {resource.summary && (
          <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {resource.summary}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-3 border-t border-[var(--border-subtle)]">
        {resource.company && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-foreground border border-[var(--border-subtle)]">
            {resource.company}
          </span>
        )}
        {resource.tags &&
          resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-muted-foreground bg-[var(--bg-elevated)]/40 px-1.5 py-0.5 rounded border border-[var(--border-subtle)]/50"
            >
              #{tag}
            </span>
          ))}
      </div>
    </div>
  )
}
