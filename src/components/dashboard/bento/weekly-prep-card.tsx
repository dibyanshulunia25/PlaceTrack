"use client"

import * as React from "react"
import { Flame, TrendingUp, Target } from "lucide-react"
import { Card } from "@/components/ui/card"

export interface DayActivity {
  day: string
  date: string
  count: number
  isToday?: boolean
}

interface WeeklyPrepCardProps {
  streak?: number
  totalSolvedThisWeek?: number
  totalSolvedAllTime?: number
  targetPerDay?: number
  days?: DayActivity[]
}

const FALLBACK_DAYS: DayActivity[] = [
  { day: "Mon", date: "Day 1", count: 0 },
  { day: "Tue", date: "Day 2", count: 0 },
  { day: "Wed", date: "Day 3", count: 0 },
  { day: "Thu", date: "Day 4", count: 0 },
  { day: "Fri", date: "Day 5", count: 0 },
  { day: "Sat", date: "Day 6", count: 0 },
  { day: "Sun", date: "Today", count: 0, isToday: true },
]

export function WeeklyPrepCard({
  streak = 0,
  totalSolvedThisWeek = 0,
  totalSolvedAllTime = 0,
  targetPerDay = 5,
  days = FALLBACK_DAYS,
}: WeeklyPrepCardProps) {
  const targetForWeek = targetPerDay * 7
  const displayDays = days && days.length === 7 ? days : FALLBACK_DAYS
  const maxVal = Math.max(...displayDays.map((d) => d.count), targetPerDay, 5)
  const [hoveredDay, setHoveredDay] = React.useState<DayActivity | null>(null)

  const percentComplete = Math.min(100, Math.round((totalSolvedThisWeek / targetForWeek) * 100))
  const paceStatus =
    totalSolvedThisWeek >= targetForWeek
      ? { label: "Goal Reached", class: "text-emerald-600 dark:text-emerald-400 font-bold" }
      : percentComplete >= 50
      ? { label: "On Pace", class: "text-primary font-semibold" }
      : totalSolvedThisWeek > 0
      ? { label: "In Progress", class: "text-[var(--accent-copper)] font-semibold" }
      : { label: "Awaiting Practice", class: "text-muted-foreground font-medium" }

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

          {streak > 0 ? (
            <div className="flex items-center gap-1 text-xs font-bold text-[var(--accent-copper)] bg-[var(--accent-copper)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-copper)]/20 shadow-2xs">
              <Flame className="size-3.5 fill-[var(--accent-copper)]" />
              <span>{streak} Day Streak</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              Daily Target: {targetPerDay}
            </span>
          )}
        </div>

        {/* Big metric & delta */}
        <div className="flex items-baseline gap-2.5 my-3">
          <span className="text-3xl font-black tracking-tight text-foreground">{totalSolvedThisWeek}</span>
          <span className="text-xs font-semibold text-muted-foreground">solved this week</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto">
            <TrendingUp className="size-3" />
            {totalSolvedAllTime > 0 ? `${totalSolvedAllTime} all-time` : "Ready to start"}
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
          {hoveredDay ? (
            <span className="text-xs font-bold text-foreground">
              {hoveredDay.day} ({hoveredDay.date}): <strong className="text-primary">{hoveredDay.count}</strong> solved
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">Hover bar to inspect</span>
          )}
        </div>

        {/* Chart Canvas */}
        <div className="relative h-32 w-full pt-4 pb-1 flex items-end justify-between gap-2 border-b border-[var(--border-subtle)]">
          {/* Target Threshold Dashed Line */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-[var(--accent-copper)]/50 pointer-events-none z-10"
            style={{ bottom: `${(targetPerDay / maxVal) * 100}%` }}
          />

          {displayDays.map((d) => {
            const heightPercent = d.count > 0 ? Math.max((d.count / maxVal) * 100, 10) : 6
            const reachedTarget = d.count >= targetPerDay

            return (
              <div
                key={d.day + d.date}
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
                      backgroundColor:
                        d.count === 0
                          ? "var(--border-subtle)"
                          : reachedTarget
                          ? "var(--accent-primary)"
                          : "var(--accent-copper)",
                      opacity: d.count === 0 ? 0.35 : d.isToday ? 1 : 0.85,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Day Labels */}
        <div className="flex items-center justify-between gap-2 pt-2 text-[11px] font-semibold text-muted-foreground">
          {displayDays.map((d) => (
            <div
              key={d.day + d.date}
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
        <span>
          {percentComplete}% of weekly target completed ({totalSolvedThisWeek}/{targetForWeek})
        </span>
        <span className={paceStatus.class}>{paceStatus.label}</span>
      </div>
    </Card>
  )
}
