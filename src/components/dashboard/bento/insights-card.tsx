"use client"

import * as React from "react"
import Link from "next/link"
import { AlertCircle, Calendar, Clock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Application, Company } from "@prisma/client"

type ApplicationWithCompany = Application & { company: Company }

interface InsightsCardProps {
  applications: ApplicationWithCompany[]
}

export function InsightsCard({ applications }: InsightsCardProps) {
  // Find imminent events
  const imminent = applications
    .filter((app) => {
      const d = app.interviewDate || app.assessmentDate
      if (!d) return false
      return new Date(d) >= new Date()
    })
    .sort((a, b) => {
      const dateA = new Date(a.interviewDate || a.assessmentDate!).getTime()
      const dateB = new Date(b.interviewDate || b.assessmentDate!).getTime()
      return dateA - dateB
    })
    .slice(0, 2)

  return (
    <Card className="p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 flex items-center justify-center text-[var(--accent-copper)]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground leading-tight">Insights & Next Steps</h3>
              <p className="text-xs text-muted-foreground">Actionable weekly focus items</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[var(--accent-copper)] uppercase tracking-wide">
            Priority
          </span>
        </div>

        {/* Imminent Milestones List */}
        <div className="space-y-2.5 my-3">
          {imminent.length > 0 ? (
            imminent.map((app) => {
              const isInterview = !!app.interviewDate
              const date = new Date(app.interviewDate || app.assessmentDate!)
              const diffDays = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
              const daysText =
                diffDays === 0
                  ? "Today"
                  : diffDays === 1
                  ? "Tomorrow"
                  : `In ${diffDays} days`

              return (
                <div
                  key={app.id}
                  className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-foreground truncate">
                        {app.company.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-background/80 text-muted-foreground border border-[var(--border-subtle)]">
                        {isInterview ? "Interview" : "OA"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{app.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[var(--accent-copper)] block">
                      {daysText}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 text-center space-y-1">
              <CheckCircle2 className="size-5 text-primary mx-auto" />
              <p className="text-xs font-semibold text-foreground">No urgent deadlines pending</p>
              <p className="text-[11px] text-muted-foreground">
                All upcoming assessment windows and interviews are cleared.
              </p>
            </div>
          )}

          {/* Recommended Next Prep Step */}
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-2.5">
            <Clock className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs leading-snug">
              <span className="font-bold text-foreground block mb-0.5">Recommended Focus:</span>
              <p className="text-muted-foreground">
                Solve 2 Graph / Tree problems today to sustain readiness for tier-1 assessment rounds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Curated from application log</span>
        <Link
          href="/dashboard/resources"
          className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
        >
          <span>Resource Engine</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </Card>
  )
}
