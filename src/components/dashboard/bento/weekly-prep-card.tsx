"use client"

import * as React from "react"
import { Flame, TrendingUp, Sparkles, Target } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DayActivity {
  day: string
  date: string
  count: number
  isToday?: boolean
}

interface WeeklyPrepCardProps {
  streak?: number
  totalSolved?: number
  targetPerDay?: number
}

const DEFAULT_DAYS: DayActivity[] = [
  { day: "Mon", date: "Nov 10", count: 4 },
  { day: "Tue", date: "Nov 11", count: 6 },
  { day: "Wed", date: "Nov 12", count: 5 },
  { day: "Thu", date: "Nov 13", count: 8 },
  { day: "Fri", date: "Nov 14", count: 7, isToday: true },
  { day: "Sat", date: "Nov 15", count: 3 },
  { day: "Sun", date: "Nov 16", count: 2 },
]

export function WeeklyPrepCard({
  streak = 5,
  totalSolved = 35,
  targetPerDay = 5,
}: WeeklyPrepCardProps) {
  const maxVal = Math.max(...DEFAULT_DAYS.map((d) => d.count), targetPerDay, 10)
  const [hoveredDay, setHoveredDay] = React.useState<DayActivity | null>(null)

  return (
    <Card className="p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Target className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground leading-tight">Weekly Prep Activity</h3>
              <p className="text-xs text-muted-foreground">Practice question velocity</p>
            </div>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-[var(--accent-copper)] bg-[var(--accent-copper)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-copper)]/20 shadow-2xs">
              <Flame className="size-3.5 fill-[var(--accent-copper)]" />
              <span>{streak} Day Streak</span>
            </div>
          )}
        </div>

        {/* Big metric & delta */}
        <div className="flex items-baseline gap-2.5 my-3">
          <span className="text-3xl font-black tracking-tight text-foreground">{totalSolved}</span>
          <span className="text-xs font-semibold text-muted-foreground">solved this week</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto">
            <TrendingUp className="size-3" />
            +18% vs avg
          </span>
        </div>
      </div>

      {/* Vertical Bar Chart (Mon-Sun) */}
      <div className="my-2 pt-2">
        {/* Target threshold indicator */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-[1.5px] bg-[var(--accent-copper)] inline-block" />
            Daily Target: {targetPerDay} questions
          </span>
          {hoveredDay && (
            <span className="text-xs font-bold text-foreground">
              {hoveredDay.day}: <strong className="text-primary">{hoveredDay.count}</strong> solved
            </span>
          )}
        </div>

        {/* Chart Canvas */}
        <div className="relative h-32 w-full pt-4 pb-1 flex items-end justify-between gap-2 border-b border-[var(--border-subtle)]">
          {/* Target Threshold Dashed Line */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-[var(--accent-copper)]/50 pointer-events-none z-10"
            style={{ bottom: `${(targetPerDay / maxVal) * 100}%` }}
          />

          {DEFAULT_DAYS.map((d) => {
            const heightPercent = Math.max((d.count / maxVal) * 100, 6)
            const reachedTarget = d.count >= targetPerDay

            return (
              <div
                key={d.day}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Bar */}
                <div className="w-full max-w-[28px] bg-[var(--bg-elevated)] rounded-t-md overflow-hidden flex flex-col justify-end transition-all group-hover:scale-y-105">
                  <div
                    className="w-full rounded-t-md transition-all duration-300"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: reachedTarget
                        ? "var(--accent-primary)"
                        : "var(--accent-copper)",
                      opacity: d.isToday ? 1 : 0.85,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Day Labels */}
        <div className="flex items-center justify-between gap-2 pt-2 text-[11px] font-semibold text-muted-foreground">
          {DEFAULT_DAYS.map((d) => (
            <div
              key={d.day}
              className={`flex-1 text-center transition-colors ${
                d.isToday ? "text-primary font-bold" : "group-hover:text-foreground"
              }`}
            >
              {d.day}
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground">
        <span>76% of weekly target completed</span>
        <span className="font-semibold text-primary">On Pace</span>
      </div>
    </Card>
  )
}
