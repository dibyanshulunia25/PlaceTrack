'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Share2, BrainCircuit, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplicationForm } from '@/components/applications/application-form';
import { Button } from '@/components/ui/button';

interface QuickActionStripProps {
  userName: string;
  activeCount: number;
  upcomingCount: number;
}

export function QuickActionStrip({
  userName,
  activeCount,
  upcomingCount,
}: QuickActionStripProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-elevation-card)] lg:flex-row lg:items-center">
      {/* Left: Greeting & Focus Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
            Welcome back, {userName}!
          </h1>
          <span className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold">
            <span className="bg-primary size-1.5 animate-pulse rounded-full" />
            Live Season
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          You have{' '}
          <strong className="text-foreground font-semibold">
            {activeCount}
          </strong>{' '}
          active {activeCount === 1 ? 'role' : 'roles'} in flight and{' '}
          <strong className="text-foreground font-semibold">
            {upcomingCount}
          </strong>{' '}
          upcoming {upcomingCount === 1 ? 'milestone' : 'milestones'} this week.
        </p>
      </div>

      {/* Right: Horizontal Quick Action Launcher Cards */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* + Track Application Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all hover:bg-[var(--accent-primary-hover)] hover:shadow-xs">
            <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Plus className="size-3" strokeWidth={3} />
            </div>
            <span>Track Application</span>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader className="mb-4">
              <DialogTitle>Add New Application</DialogTitle>
              <DialogDescription>
                Track a new role you have applied for.
              </DialogDescription>
            </DialogHeader>
            <ApplicationForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Share OA Experience */}
        <Link
          href="/dashboard/experiences/new"
          className="hover:border-primary/40 text-foreground inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all hover:bg-[var(--bg-canvas)]"
        >
          <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--accent-copper)]/15 text-[var(--accent-copper)]">
            <Share2 className="size-2.5" />
          </div>
          <span>Share OA Experience</span>
        </Link>

        {/* Continue Prep */}
        <Link
          href="/dashboard/mock-interviews"
          className="hover:border-primary/40 text-foreground inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all hover:bg-[var(--bg-canvas)]"
        >
          <div className="bg-primary/15 text-primary flex size-4 shrink-0 items-center justify-center rounded-full">
            <BrainCircuit className="size-2.5" />
          </div>
          <span>Continue Prep</span>
        </Link>
      </div>
    </div>
  );
}
