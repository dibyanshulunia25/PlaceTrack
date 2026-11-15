"use client"

import { Target, Flame, TrendingUp, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AnalyticsProps {
  analytics: {
    streak: number
    totalSessions: number
    strongAreas: { category: string; combinedScore: number }[]
    weakAreas: { category: string; combinedScore: number }[]
  }
}

export function PreparationAnalytics({ analytics }: AnalyticsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Streak */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 flex items-center justify-center text-[var(--accent-copper)]">
              <Flame className="size-4 fill-[var(--accent-copper)]" />
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Practice Streak
            </span>
          </div>
        </div>
        <div className="text-3xl font-black text-foreground mt-1">
          {analytics.streak}{" "}
          <span className="text-xs font-medium text-muted-foreground">Days Active</span>
        </div>
      </Card>

      {/* Questions Practiced */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Target className="size-4" />
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Sessions Logged
            </span>
          </div>
        </div>
        <div className="text-3xl font-black text-foreground mt-1">
          {analytics.totalSessions}{" "}
          <span className="text-xs font-medium text-muted-foreground">Questions</span>
        </div>
      </Card>

      {/* Strong Areas */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <TrendingUp className="size-4" />
          </div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Strongest Focus
          </span>
        </div>
        <div className="space-y-1.5">
          {analytics.strongAreas.length > 0 ? (
            analytics.strongAreas.slice(0, 2).map((a) => (
              <div key={a.category} className="flex justify-between items-center text-xs font-semibold">
                <span className="text-foreground truncate">{a.category}</span>
                <span className="text-primary font-mono font-bold">
                  {(a.combinedScore * 100).toFixed(0)}%
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground">Keep practicing to build your mastery.</div>
          )}
        </div>
      </Card>

      {/* Areas to Review */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-8 rounded-lg bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 flex items-center justify-center text-[var(--accent-copper)]">
            <AlertTriangle className="size-4" />
          </div>
          <span className="text-xs font-bold text-[var(--accent-copper)] uppercase tracking-wider">
            Growth Areas
          </span>
        </div>
        <div className="space-y-1.5">
          {analytics.weakAreas.length > 0 ? (
            analytics.weakAreas.slice(0, 2).map((a) => (
              <div key={a.category} className="flex justify-between items-center text-xs font-semibold">
                <span className="text-foreground truncate">{a.category}</span>
                <span className="text-[var(--accent-copper)] font-mono font-bold">
                  {(a.combinedScore * 100).toFixed(0)}%
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground">No weak areas identified yet.</div>
          )}
        </div>
      </Card>
    </div>
  )
}
