"use client"

import * as React from "react"
import { BarChart3, TrendingUp, Award, Layers, Users, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface CompaniesAnalyticsData {
  totalCompanies: number
  difficultyStats: {
    easyCount: number
    mediumCount: number
    hardCount: number
    easyPercent: number
    mediumPercent: number
    hardPercent: number
    unratedCount: number
  }
  topCompanies: {
    name: string
    logo: string | null
    totalActivity: number
    experiencesCount: number
    applicationsCount: number
  }[]
  roundStats: {
    oaPercent: number
    technicalPercent: number
    systemDesignPercent: number
    hrPercent: number
    avgRounds: number
  }
}

interface CompaniesAnalyticsHeaderProps {
  analytics: CompaniesAnalyticsData
}

export function CompaniesAnalyticsHeader({ analytics }: CompaniesAnalyticsHeaderProps) {
  const { difficultyStats, topCompanies, roundStats } = analytics

  const maxActivity = Math.max(...topCompanies.map((c) => c.totalActivity), 1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
      {/* 1. Difficulty Distribution Chart Card (4 cols) */}
      <Card className="lg:col-span-4 p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BarChart3 className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground leading-tight">
                  Difficulty Distribution
                </h3>
                <p className="text-xs text-muted-foreground">Across evaluated companies</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              Live Index
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Benchmark rating calculated from real candidate debriefs and assessment cutoff scores.
          </p>

          {/* Horizontal Stacked Bar */}
          <div className="space-y-2 my-2">
            <div className="h-3 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden flex">
              <div
                style={{ width: `${difficultyStats.easyPercent}%` }}
                className="h-full bg-[var(--accent-primary)] transition-all duration-500"
                title={`Easy: ${difficultyStats.easyPercent}% (${difficultyStats.easyCount} companies)`}
              />
              <div
                style={{ width: `${difficultyStats.mediumPercent}%` }}
                className="h-full bg-[var(--accent-copper)] transition-all duration-500"
                title={`Medium: ${difficultyStats.mediumPercent}% (${difficultyStats.mediumCount} companies)`}
              />
              <div
                style={{ width: `${difficultyStats.hardPercent}%` }}
                className="h-full bg-red-500 transition-all duration-500"
                title={`Hard: ${difficultyStats.hardPercent}% (${difficultyStats.hardCount} companies)`}
              />
            </div>

            {/* Legend & Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground mb-0.5">
                  <span className="size-2 rounded-full bg-[var(--accent-primary)]" />
                  <span>Easy</span>
                </div>
                <span className="font-bold text-sm text-foreground">
                  {difficultyStats.easyPercent}%
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  ({difficultyStats.easyCount})
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground mb-0.5">
                  <span className="size-2 rounded-full bg-[var(--accent-copper)]" />
                  <span>Medium</span>
                </div>
                <span className="font-bold text-sm text-foreground">
                  {difficultyStats.mediumPercent}%
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  ({difficultyStats.mediumCount})
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground mb-0.5">
                  <span className="size-2 rounded-full bg-red-500" />
                  <span>Hard</span>
                </div>
                <span className="font-bold text-sm text-foreground">
                  {difficultyStats.hardPercent}%
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  ({difficultyStats.hardCount})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground mt-3">
          <span>{difficultyStats.mediumPercent >= 50 ? "Most roles fall in Medium tier" : "Balanced difficulty"}</span>
          <span className="font-mono text-[11px] text-primary font-semibold">
            {analytics.totalCompanies} Total Orgs
          </span>
        </div>
      </Card>

      {/* 2. Top Companies by Activity Card (4 cols) */}
      <Card className="lg:col-span-4 p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 flex items-center justify-center text-[var(--accent-copper)]">
                <Award className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground leading-tight">
                  Top Volume Organizations
                </h3>
                <p className="text-xs text-muted-foreground">Most reports & interview callbacks</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 text-[var(--accent-copper)]">
              Trending
            </span>
          </div>

          <div className="space-y-3 my-2">
            {topCompanies.length > 0 ? (
              topCompanies.slice(0, 4).map((comp, idx) => {
                const widthPercent = Math.max((comp.totalActivity / maxActivity) * 100, 15)

                return (
                  <div key={comp.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[11px] font-bold text-muted-foreground w-3.5">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-foreground truncate max-w-[150px]">
                          {comp.name}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {comp.experiencesCount} debriefs · {comp.applicationsCount} apps
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No company activity recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground mt-3">
          <span>Ranked by debriefs & applicant pool</span>
          <span className="font-semibold text-primary">Live Ranks</span>
        </div>
      </Card>

      {/* 3. Round & Topic Breakdown Card (4 cols) */}
      <Card className="lg:col-span-4 p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Layers className="size-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground leading-tight">
                  Round Format Breakdown
                </h3>
                <p className="text-xs text-muted-foreground">Stages required before offer</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              ~{roundStats.avgRounds} Rounds Avg
            </span>
          </div>

          <div className="space-y-2.5 my-2">
            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Online Assessment (OA)</span>
                <span className="font-mono font-bold text-foreground">{roundStats.oaPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${roundStats.oaPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Technical DSA & Problem Solving</span>
                <span className="font-mono font-bold text-foreground">{roundStats.technicalPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-copper)] rounded-full transition-all"
                  style={{ width: `${roundStats.technicalPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span className="font-medium text-foreground">System Design & Low-Level Design</span>
                <span className="font-mono font-bold text-foreground">{roundStats.systemDesignPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${roundStats.systemDesignPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span className="font-medium text-foreground">HR, Values & Behavioral Fit</span>
                <span className="font-mono font-bold text-foreground">{roundStats.hrPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-copper)] rounded-full transition-all"
                  style={{ width: `${roundStats.hrPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground mt-3">
          <span>Derived from logged round structures</span>
          <span className="font-semibold text-primary">Standard Tracks</span>
        </div>
      </Card>
    </div>
  )
}
