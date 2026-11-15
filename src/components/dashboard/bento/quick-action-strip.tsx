"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Share2, BrainCircuit, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { ApplicationForm } from "@/components/applications/application-form"
import { Button } from "@/components/ui/button"

interface QuickActionStripProps {
  userName: string
  activeCount: number
  upcomingCount: number
}

export function QuickActionStrip({ userName, activeCount, upcomingCount }: QuickActionStripProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false)

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)]">
      {/* Left: Greeting & Focus Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Welcome back, {userName}!
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 border border-primary/20 text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live Season
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          You have <strong className="text-foreground font-semibold">{activeCount}</strong> active {activeCount === 1 ? "role" : "roles"} in flight and{" "}
          <strong className="text-foreground font-semibold">{upcomingCount}</strong> upcoming {upcomingCount === 1 ? "milestone" : "milestones"} this week.
        </p>
      </div>

      {/* Right: Horizontal Quick Action Launcher Cards */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* + Track Application Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground shadow-2xs transition-all hover:shadow-xs">
            <div className="size-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Plus className="size-3" strokeWidth={3} />
            </div>
            <span>+ Track Application</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle>Add New Application</DialogTitle>
              <DialogDescription>Track a new role you have applied for.</DialogDescription>
            </DialogHeader>
            <ApplicationForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Share OA Experience */}
        <Link
          href="/dashboard/experiences/new"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-canvas)] hover:border-primary/40 text-foreground transition-all shadow-2xs"
        >
          <div className="size-4 rounded-full bg-[var(--accent-copper)]/15 text-[var(--accent-copper)] flex items-center justify-center shrink-0">
            <Share2 className="size-2.5" />
          </div>
          <span>Share OA Experience</span>
        </Link>

        {/* Continue Prep */}
        <Link
          href="/dashboard/mock-interviews"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-canvas)] hover:border-primary/40 text-foreground transition-all shadow-2xs"
        >
          <div className="size-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <BrainCircuit className="size-2.5" />
          </div>
          <span>Continue Prep</span>
        </Link>
      </div>
    </div>
  )
}
