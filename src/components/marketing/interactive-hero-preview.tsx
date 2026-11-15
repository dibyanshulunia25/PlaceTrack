"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StageData {
  id: string
  stageName: string
  stepIndex: number
  company: string
  role: string
  location: string
  compensation: string
  statusPillClass: string
  statusLabel: string
  deadlineText: string
  readinessScore: number
  oaInsights: {
    pattern: string
    difficulty: string
    reportedCount: number
  }
}

const STAGES: StageData[] = [
  {
    id: "applied",
    stageName: "Resume Screen",
    stepIndex: 1,
    company: "Google",
    role: "Software Engineer — Early Career",
    location: "Mountain View / Hybrid",
    compensation: "$165k Base + Equity",
    statusPillClass: "pill-status-applied",
    statusLabel: "Application Sent",
    deadlineText: "Applied 4 days ago · Recruiter review",
    readinessScore: 68,
    oaInsights: {
      pattern: "Resume parsed · ATS Match 94%",
      difficulty: "High standard",
      reportedCount: 420,
    },
  },
  {
    id: "assessment",
    stageName: "Online Assessment",
    stepIndex: 2,
    company: "Stripe",
    role: "Backend Platform Engineer",
    location: "San Francisco / Remote",
    compensation: "$175k Base + Sign-on",
    statusPillClass: "pill-status-assessment",
    statusLabel: "OA Scheduled",
    deadlineText: "Due in 3 days · 90 min HackerRank",
    readinessScore: 78,
    oaInsights: {
      pattern: "2 Graph Problems + Currency Rate Limiter",
      difficulty: "Hard (Time-pressured)",
      reportedCount: 86,
    },
  },
  {
    id: "interview",
    stageName: "Technical Round",
    stepIndex: 3,
    company: "Microsoft",
    role: "Azure Distributed Systems",
    location: "Redmond, WA",
    compensation: "$155k Base + $40k Stock",
    statusPillClass: "pill-status-interview",
    statusLabel: "Technical Round 2/3",
    deadlineText: "Tomorrow at 2:00 PM PST",
    readinessScore: 89,
    oaInsights: {
      pattern: "Distributed Key-Value Cache + Concurrency",
      difficulty: "Medium-Hard",
      reportedCount: 142,
    },
  },
  {
    id: "offer",
    stageName: "Offer Unlocked",
    stepIndex: 4,
    company: "Atlassian",
    role: "Full-Stack Software Engineer",
    location: "Remote",
    compensation: "$160k + $50k RSUs",
    statusPillClass: "pill-status-offer",
    statusLabel: "Selected · Offer Extended",
    deadlineText: "Offer Accepted · Season Conquered! 🎉",
    readinessScore: 98,
    oaInsights: {
      pattern: "All rounds passed · Top 3% cohort",
      difficulty: "Completed",
      reportedCount: 310,
    },
  },
]

export function InteractiveHeroPreview() {
  const [selectedStageIndex, setSelectedStageIndex] = React.useState(1) // Default to Assessment
  const active = STAGES[selectedStageIndex]

  const handleNextStage = () => {
    setSelectedStageIndex((prev) => (prev + 1) % STAGES.length)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 text-left">
      {/* Outer Preview Window */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-xl shadow-[var(--shadow-elevation-card)] overflow-hidden transition-all duration-300">
        
        {/* Top Window Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/80 inline-block" />
              <span className="size-2.5 rounded-full bg-amber-400/80 inline-block" />
              <span className="size-2.5 rounded-full bg-emerald-400/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-medium text-muted-foreground ml-2">
              placetrack.app/dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 border border-primary/20 text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Live Interactive Sandbox
            </span>
          </div>
        </div>

        {/* Pipeline Stage Tabs */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                Pipeline Lifecycle Preview
              </p>
              <h3 className="text-sm font-semibold text-foreground">
                Click any milestone to inspect real-time dashboard state:
              </h3>
            </div>
            <button
              onClick={handleNextStage}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--border-subtle)] transition-colors self-start sm:self-auto text-foreground"
            >
              <span>Advance Stage</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {/* Interactive Stepper Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STAGES.map((s, idx) => {
              const isSelected = idx === selectedStageIndex
              const isPast = idx < selectedStageIndex

              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStageIndex(idx)}
                  className={cn(
                    "relative flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 hover:bg-[var(--bg-elevated)] text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isPast
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isPast ? <Check className="size-3" /> : idx + 1}
                  </div>
                  <span className="text-xs font-semibold truncate">{s.stageName}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Preview Bento Area */}
        <div className="p-4 sm:p-6 bg-[var(--bg-canvas)]/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4"
            >
              {/* Card 1: Active Application Card (Span 7) */}
              <div className="md:col-span-7 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5",
                        active.statusPillClass
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {active.statusLabel}
                    </span>
                    <span className="text-xs font-mono font-medium text-muted-foreground">
                      {active.compensation}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-foreground tracking-tight leading-snug">
                    {active.role}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Building2 className="size-4 shrink-0 text-primary" />
                    <span className="font-semibold text-foreground">{active.company}</span>
                    <span>·</span>
                    <span>{active.location}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                    <span className="text-muted-foreground">Progress tracker</span>
                    <span className="text-primary font-bold">Stage {active.stepIndex} of 4</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(active.stepIndex / 4) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 font-medium">
                    <Clock className="size-3.5 text-[var(--accent-copper)]" />
                    <span>{active.deadlineText}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Readiness Score Gauge (Span 5) */}
              <div className="md:col-span-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <BrainCircuit className="size-3.5 text-primary" />
                      <span>Prep Readiness</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-foreground">
                      Target Role
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-black text-foreground">
                      {active.readinessScore}%
                    </span>
                    <span className="text-xs font-semibold text-primary inline-flex items-center gap-0.5">
                      <TrendingUp className="size-3" />
                      Ready to Clear
                    </span>
                  </div>

                  {/* Micro sub-scores */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-muted-foreground mb-0.5 font-medium">
                        <span>Data Structures & Alg</span>
                        <span className="font-semibold text-foreground">92%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[92%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-muted-foreground mb-0.5 font-medium">
                        <span>System Design Fundamentals</span>
                        <span className="font-semibold text-foreground">84%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                        <div className="h-full bg-[var(--accent-copper)] rounded-full w-[84%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Peer OA Intelligence note */}
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <div className="flex items-start gap-2 text-xs">
                    <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground leading-tight">
                        {active.oaInsights.pattern}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Crowdsourced from {active.oaInsights.reportedCount} verified campus candidates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
