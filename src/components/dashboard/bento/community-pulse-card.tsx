"use client"

import * as React from "react"
import Link from "next/link"
import { Users, Building, ArrowRight, MessageSquare, Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ExperienceItem {
  id: string
  title: string
  content: string
  difficulty: number
  role: string
  year: number
  createdAt: string | Date
  company: {
    name: string
  }
}

interface CommunityPulseCardProps {
  experiences: ExperienceItem[]
}

export function CommunityPulseCard({ experiences }: CommunityPulseCardProps) {
  const displayItems = experiences.slice(0, 3)

  return (
    <Card className="p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground leading-tight">Community Pulse</h3>
              <p className="text-xs text-muted-foreground">Latest peer OA & interview posts</p>
            </div>
          </div>
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" title="Live peer updates" />
        </div>

        {/* Connected Vertical Timeline */}
        <div className="my-2 relative pl-4 border-l-2 border-[var(--border-subtle)] space-y-4">
          {displayItems.length > 0 ? (
            displayItems.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Node dot on the timeline */}
                <div className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-[var(--border-subtle)] group-hover:bg-primary transition-colors ring-4 ring-[var(--bg-surface)]" />

                <Link
                  href={`/dashboard/experiences`}
                  className="block p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-foreground truncate">
                      {exp.company.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {exp.role}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {exp.content || exp.title}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2 pt-1.5 border-t border-[var(--border-subtle)]/60">
                    <span className="font-semibold text-primary">Difficulty {exp.difficulty}/5</span>
                    <span className="text-[10px]">Read breakdown →</span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No recent community reports found.
            </div>
          )}
        </div>
      </div>

      {/* Footer Button: View All Experiences → */}
      <div className="pt-3 border-t border-[var(--border-subtle)]">
        <Link
          href="/dashboard/experiences"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] text-foreground border border-[var(--border-subtle)] transition-colors"
        >
          <span>View All Experiences</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  )
}
