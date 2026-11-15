"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SlideUp } from "@/components/ui/animation"
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Building2,
  FileText,
  Star,
  Users,
  Search,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[var(--bg-canvas)] relative overflow-hidden border-t border-[var(--border-subtle)]">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <SlideUp>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary mb-4">
              <Zap className="size-3.5" />
              <span>Architected for High-Volume Placement Season</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Everything you need to convert applications into offers
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              PlaceTrack replaces scattered bookmarks, lost spreadsheets, and blind test attempts with an intelligent student career operating system.
            </p>
          </SlideUp>
        </div>

        {/* Bento Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
          
          {/* Bento 1: Segmented Application Tracker (Col Span 7) */}
          <div className="md:col-span-7">
            <SlideUp delay={0.1}>
              <Card className="p-6 md:p-8 h-full flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-2xs">
                    <FileText className="size-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Segmented Application Pipeline
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                    Organize dozens of on-campus and off-campus roles into clear status columns with automated stage advancement, interview reminders, and compensation benchmarks.
                  </p>
                </div>

                {/* Micro-UI Preview: Application Cards */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-subtle)]">
                    <span className="font-semibold text-foreground">Active Campus Pipeline</span>
                    <span className="text-muted-foreground">4 Roles in Flight</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                        G
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-foreground truncate">Google</p>
                        <p className="text-[11px] text-muted-foreground truncate">Software Engineer L3</p>
                      </div>
                    </div>
                    <span className="pill-status-interview text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                      Interview
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                        S
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-foreground truncate">Stripe</p>
                        <p className="text-[11px] text-muted-foreground truncate">Platform Engineer</p>
                      </div>
                    </div>
                    <span className="pill-status-assessment text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                      Assessment
                    </span>
                  </div>
                </div>
              </Card>
            </SlideUp>
          </div>

          {/* Bento 2: Peer OA Intelligence (Col Span 5) */}
          <div className="md:col-span-5">
            <SlideUp delay={0.2}>
              <Card className="p-6 md:p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-xl bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 flex items-center justify-center text-[var(--accent-copper)] mb-5 shadow-2xs">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Peer OA Intelligence
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                    Know the exact questions asked in recent online assessments before you sit for yours.
                  </p>
                </div>

                {/* Micro-UI Preview: Experience Snippet */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Recent Campus Report</span>
                    <span className="text-[10px] text-muted-foreground">2 hrs ago</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">Amazon SDE-1 OA</span>
                      <div className="flex text-amber-500 text-xs">★★★★☆</div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      "2 coding questions: 1 BFS grid pathfinding + 1 priority queue problem. All 15 test cases passed."
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-muted-foreground">
                        Graphs
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-muted-foreground">
                        Heap
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </SlideUp>
          </div>

          {/* Bento 3: Prep Readiness Gauge (Col Span 5) */}
          <div className="md:col-span-5">
            <SlideUp delay={0.3}>
              <Card className="p-6 md:p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-2xs">
                    <BrainCircuit className="size-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Prep Readiness Gauge
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                    Track your question completion velocity across core technical modules with target milestones.
                  </p>
                </div>

                {/* Micro-UI Preview: Readiness Metrics */}
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Weekly Practice Streak</span>
                    <span className="text-xs font-bold text-primary">5 Days Active 🔥</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Dynamic Programming</span>
                        <span className="font-semibold text-foreground">88%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[88%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>System Design Basics</span>
                        <span className="font-semibold text-foreground">75%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden">
                        <div className="h-full bg-[var(--accent-copper)] rounded-full w-[75%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </SlideUp>
          </div>

          {/* Bento 4: Company Archives & Discovery Engine (Col Span 7) */}
          <div className="md:col-span-7">
            <SlideUp delay={0.4}>
              <Card className="p-6 md:p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-2xs">
                    <Building2 className="size-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Company Archives & Curated Resources
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                    Browse company directories with verified interview rounds, package breakdowns, and video walkthroughs vetted by senior candidates.
                  </p>
                </div>

                {/* Micro-UI Preview: Company Directory Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { name: "Google", count: "48 Guides", badge: "Tier 1" },
                    { name: "Microsoft", count: "34 Guides", badge: "Tier 1" },
                    { name: "Atlassian", count: "19 Guides", badge: "Tier 1" },
                  ].map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center shadow-2xs"
                    >
                      <p className="font-bold text-xs text-foreground truncate">{comp.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{comp.count}</p>
                      <span className="inline-block text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded mt-1.5">
                        {comp.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </SlideUp>
          </div>

        </div>

      </div>
    </section>
  )
}
