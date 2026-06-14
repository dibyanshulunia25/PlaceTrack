"use client"

import { Target, Flame, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react"

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Streak */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-orange-500/10 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/20 rounded-xl">
            <Flame className="size-5 text-orange-500" />
          </div>
          <h4 className="font-semibold text-muted-foreground">Practice Streak</h4>
        </div>
        <div className="text-3xl font-extrabold">{analytics.streak} <span className="text-lg text-muted-foreground font-normal">Days</span></div>
      </div>

      {/* Sessions */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-blue-500/10 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Target className="size-5 text-blue-500" />
          </div>
          <h4 className="font-semibold text-muted-foreground">Questions Practiced</h4>
        </div>
        <div className="text-3xl font-extrabold">{analytics.totalSessions}</div>
      </div>

      {/* Strong Areas */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <TrendingUp className="size-5 text-emerald-500" />
          </div>
          <h4 className="font-semibold text-emerald-500">Strong Areas</h4>
        </div>
        <div className="space-y-2">
          {analytics.strongAreas.length > 0 ? analytics.strongAreas.map(a => (
            <div key={a.category} className="flex justify-between items-center text-sm font-semibold">
              <span>{a.category}</span>
              <span className="text-emerald-500">{(a.combinedScore * 100).toFixed(0)}%</span>
            </div>
          )) : <div className="text-sm text-muted-foreground">Keep practicing to build your strengths.</div>}
        </div>
      </div>

      {/* Weak Areas */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 bg-red-500/10 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <AlertTriangle className="size-5 text-red-500" />
          </div>
          <h4 className="font-semibold text-red-500">Focus Areas</h4>
        </div>
        <div className="space-y-2">
          {analytics.weakAreas.length > 0 ? analytics.weakAreas.map(a => (
            <div key={a.category} className="flex justify-between items-center text-sm font-semibold">
              <span>{a.category}</span>
              <span className="text-red-500">{(a.combinedScore * 100).toFixed(0)}%</span>
            </div>
          )) : <div className="text-sm text-muted-foreground">Not enough data to determine weak areas.</div>}
        </div>
      </div>
    </div>
  )
}
