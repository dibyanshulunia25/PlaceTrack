"use client"

import * as React from "react"
import { Application, Company, ApplicationStatus } from "@prisma/client"
import { StatusPill } from "@/components/ui/status-pill"
import { ChevronDown, ChevronRight, Building2, Calendar, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

type ApplicationWithCompany = Application & { company: Company }

interface GroupedApplicationListProps {
  applications: ApplicationWithCompany[]
  onSelectApplication: (app: ApplicationWithCompany) => void
  selectedId?: string | null
}

interface StageGroup {
  id: string
  title: string
  statusMatcher: (s: ApplicationStatus) => boolean
  items: ApplicationWithCompany[]
  colorBadgeClass: string
}

export function GroupedApplicationList({
  applications,
  onSelectApplication,
  selectedId,
}: GroupedApplicationListProps) {
  // Define stage groups
  const groups: StageGroup[] = [
    {
      id: "interview",
      title: "Interview Rounds",
      statusMatcher: (s) => s === "INTERVIEW",
      items: applications.filter((a) => a.status === "INTERVIEW"),
      colorBadgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
    {
      id: "assessment",
      title: "Online Assessment",
      statusMatcher: (s) => s === "ONLINE_ASSESSMENT",
      items: applications.filter((a) => a.status === "ONLINE_ASSESSMENT"),
      colorBadgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      id: "applied",
      title: "Applied / Resume Screen",
      statusMatcher: (s) => s === "APPLIED",
      items: applications.filter((a) => a.status === "APPLIED"),
      colorBadgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    },
    {
      id: "offered",
      title: "Selected & Offered",
      statusMatcher: (s) => s === "OFFERED",
      items: applications.filter((a) => a.status === "OFFERED"),
      colorBadgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      id: "rejected",
      title: "Archived & Other",
      statusMatcher: (s) => s === "REJECTED" || s === "WITHDRAWN",
      items: applications.filter((a) => a.status === "REJECTED" || a.status === "WITHDRAWN"),
      colorBadgeClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
  ]

  // Track collapsed groups
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({
    rejected: true, // Default collapsed for archived
  })

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      {groups
        .filter((g) => g.items.length > 0)
        .map((group) => {
          const isCollapsed = !!collapsed[group.id]

          return (
            <div
              key={group.id}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)] overflow-hidden"
            >
              {/* Group Collapsible Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-5 py-3.5 flex items-center justify-between bg-[var(--bg-elevated)]/40 hover:bg-[var(--bg-elevated)]/70 transition-colors border-b border-[var(--border-subtle)] select-none text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">
                    {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
                  </span>
                  <h3 className="font-bold text-sm text-foreground">{group.title}</h3>
                  <span
                    className={cn(
                      "text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border",
                      group.colorBadgeClass
                    )}
                  >
                    {group.items.length}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {isCollapsed ? "Click to expand" : "Click to collapse"}
                </span>
              </button>

              {/* Group Rows (Linear-inspired table rows) */}
              {!isCollapsed && (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {group.items.map((app) => {
                    const isSelected = selectedId === app.id

                    // Target date display
                    let targetDateText = "No date"
                    if (app.interviewDate) {
                      targetDateText = `Int: ${new Date(app.interviewDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                    } else if (app.assessmentDate) {
                      targetDateText = `OA: ${new Date(app.assessmentDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                    } else if (app.appliedAt) {
                      targetDateText = `Applied: ${new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                    }

                    return (
                      <div
                        key={app.id}
                        onClick={() => onSelectApplication(app)}
                        className={cn(
                          "px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors group",
                          isSelected
                            ? "bg-primary/5 hover:bg-primary/10"
                            : "hover:bg-[var(--bg-elevated)]/50"
                        )}
                      >
                        {/* Role & Company */}
                        <div className="flex items-center gap-3 min-w-0 sm:w-2/5">
                          <div className="size-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xs text-foreground shrink-0 group-hover:border-primary/40 group-hover:text-primary transition-colors">
                            {app.company.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                              {app.role}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground/80 truncate">
                                {app.company.name}
                              </span>
                              {app.location && (
                                <>
                                  <span>·</span>
                                  <span className="truncate">{app.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Pill */}
                        <div className="shrink-0 flex items-center">
                          <StatusPill status={app.status} size="sm" />
                        </div>

                        {/* Target Date & Meta */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs shrink-0">
                          {app.salary && (
                            <span className="text-muted-foreground hidden md:inline font-mono text-[11px]">
                              {app.salary}
                            </span>
                          )}
                          <span className="text-muted-foreground font-mono text-[11px] flex items-center gap-1">
                            <Calendar className="size-3 text-muted-foreground" />
                            {targetDateText}
                          </span>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors p-1 rounded hover:bg-[var(--bg-elevated)]">
                            <ChevronRight className="size-4" />
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
