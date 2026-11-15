"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, ChevronRight, Calendar, ArrowUpRight, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StatusPill } from "@/components/ui/status-pill"
import { Application, Company } from "@prisma/client"
import { getStageProgress } from "@/lib/stage-progress"
import { cn } from "@/lib/utils"

type ApplicationWithCompany = Application & { company: Company }

interface ApplicationStatusCardProps {
  applications: ApplicationWithCompany[]
}

export function ApplicationStatusCard({ applications }: ApplicationStatusCardProps) {
  // Show the most recent / active up to 4 applications
  const displayApps = applications.slice(0, 4)

  return (
    <Card className="p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)] overflow-hidden">
      {/* Header with "See all >" */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="font-bold text-base text-foreground leading-tight">Applications Tracking Status</h3>
          <p className="text-xs text-muted-foreground">Active interview pipelines in flight</p>
        </div>
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline hover:text-[var(--accent-primary-hover)] transition-colors"
        >
          <span>See all ({applications.length})</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {/* Content Area */}
      {applications.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Building2 className="size-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">No applications tracked yet</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Add your active job or internship applications to monitor stages, assessments, and interview callbacks.
          </p>
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-[var(--accent-primary-hover)] transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Track Application</span>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-subtle)]">
          {displayApps.map((app) => {
            const progress = getStageProgress(app.status)

            // Target date text
            let nextDateText = "No date set"
            if (app.interviewDate) {
              nextDateText = `Int: ${new Date(app.interviewDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
            } else if (app.assessmentDate) {
              nextDateText = `OA: ${new Date(app.assessmentDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
            } else if (app.appliedAt) {
              nextDateText = `Applied: ${new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
            }

            return (
              <div
                key={app.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors hover:bg-[var(--bg-elevated)]/40 -mx-2 px-2 rounded-lg"
              >
                {/* Left: Company & Role */}
                <div className="min-w-0 sm:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {app.company.name}
                    </span>
                    <StatusPill status={app.status} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{app.role}</p>
                </div>

                {/* Center: Visual 4-Step Stage Progress Bar with exact getStageProgress */}
                <div className="flex-1 max-w-[200px]">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                    <span className={cn(progress.step >= 1 && "text-foreground font-bold")}>Applied</span>
                    <span className={cn(progress.step >= 2 && "text-foreground font-bold")}>OA</span>
                    <span className={cn(progress.step >= 3 && "text-foreground font-bold")}>Interview</span>
                    <span
                      className={cn(
                        progress.isOffer && "text-emerald-600 dark:text-emerald-400 font-bold",
                        progress.isRejected && "text-red-500 font-bold"
                      )}
                    >
                      {progress.isRejected ? "Rejected" : progress.isWithdrawn ? "Withdrawn" : "Offer"}
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-300", progress.colorClass)}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Right: Next Date & Link */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0">
                  <span className="text-muted-foreground flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="size-3 text-muted-foreground" />
                    {nextDateText}
                  </span>
                  <Link
                    href={`/dashboard/applications`}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] transition-colors"
                    title="View application details"
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground">
        <span>Pipeline updated directly from application records</span>
        <Link href="/dashboard/applications" className="font-semibold text-primary hover:underline">
          Manage all applications →
        </Link>
      </div>
    </Card>
  )
}
