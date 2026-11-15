"use client"

import * as React from "react"
import { BrainCircuit, CheckCircle2, Trophy, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface ReadinessGaugeCardProps {
  score?: number
  clearedMilestones?: number
  totalMilestones?: number
}

export function ReadinessGaugeCard({
  score = 78,
  clearedMilestones = 12,
  totalMilestones = 15,
}: ReadinessGaugeCardProps) {
  // SVG circular calculation
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

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
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            High Confidence
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
                {score}%
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
              Based on completed mock question banks, OA test passes, and resume reviews.
            </p>
          </div>
        </div>

        {/* Competency breakdown */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1 font-medium">
              <span>Data Structures & Algorithms</span>
              <span className="font-bold text-foreground">88%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[88%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1 font-medium">
              <span>System Design & OS</span>
              <span className="font-bold text-foreground">72%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
              <div className="h-full bg-[var(--accent-copper)] rounded-full w-[72%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Calibrated daily</span>
        <Link
          href="/dashboard/mock-interviews"
          className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
        >
          <span>Run Calibration</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </Card>
  )
}
