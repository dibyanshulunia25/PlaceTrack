"use client"

import * as React from "react"
import { BrainCircuit, Trophy, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export interface Competency {
  name: string
  score: number
}

interface ReadinessGaugeCardProps {
  score?: number
  clearedMilestones?: number
  totalMilestones?: number
  competencies?: Competency[]
}

export function ReadinessGaugeCard({
  score = 0,
  clearedMilestones = 0,
  totalMilestones = 10,
  competencies = [],
}: ReadinessGaugeCardProps) {
  // SVG circular calculation
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  const confidenceBadge =
    clampedScore >= 75
      ? { label: "High Confidence", color: "bg-primary/10 border-primary/20 text-primary" }
      : clampedScore >= 40
      ? { label: "Building Pace", color: "bg-[var(--accent-copper)]/10 border-[var(--accent-copper)]/20 text-[var(--accent-copper)]" }
      : { label: "Initial Phase", color: "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-muted-foreground" }

  return (
    <Card className="p-5 md:p-6 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BrainCircuit className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground leading-tight">Readiness Score</h3>
              <p className="text-xs text-muted-foreground">Placement preparedness gauge</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${confidenceBadge.color}`}>
            {confidenceBadge.label}
          </span>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex items-center justify-center gap-5 my-3">
          <div className="relative size-24 shrink-0 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 96 96">
              {/* Background Ring */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[var(--bg-elevated)]"
                strokeWidth="7"
                fill="none"
              />
              {/* Active Progress Ring */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-[var(--accent-primary)] transition-all duration-1000 ease-out"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground tracking-tight leading-none">
                {clampedScore}%
              </span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                Ready
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs flex-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Trophy className="size-3.5 text-[var(--accent-copper)]" />
              <span>{clearedMilestones} of {totalMilestones} Milestones</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Computed from completed practice questions, active pipeline stages, and streak continuity.
            </p>
          </div>
        </div>

        {/* Competency breakdown */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          {competencies.length > 0 ? (
            competencies.map((comp, idx) => (
              <div key={comp.name || idx}>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1 font-medium">
                  <span className="truncate">{comp.name}</span>
                  <span className="font-bold text-foreground">{comp.score}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${idx === 0 ? "bg-primary" : "bg-[var(--accent-copper)]"}`}
                    style={{ width: `${Math.min(100, Math.max(0, comp.score))}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-2 text-center text-[11px] text-muted-foreground">
              Complete mock interview questions to calibrate your competency breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Calibrated live</span>
        <Link
          href="/dashboard/mock-interviews"
          className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
        >
          <span>Continue Practice</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </Card>
  )
}
