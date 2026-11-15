"use client"

import { Card } from "@/components/ui/card"
import { FadeIn, SlideUp } from "@/components/ui/animation"
import { Check, Shield, Users, Sparkles, ArrowRight } from "lucide-react"

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Capture & Track",
    description: "Save applications with one click. Automatic deadline alerts and stage management keep you ahead of portal cutoffs.",
  },
  {
    step: "02",
    title: "Access Peer Intel",
    description: "Review test patterns and coding questions reported by students who took the assessment hours before you.",
  },
  {
    step: "03",
    title: "Targeted Preparation",
    description: "Focus on company-specific mock questions, system design breakdowns, and curated engineering articles.",
  },
  {
    step: "04",
    title: "Offer Conversion",
    description: "Manage multiple offers, compare compensation packages, and share your experience back to the campus cohort.",
  },
]

export function BenefitsSection() {
  return (
    <div className="bg-[var(--bg-canvas)]">
      {/* Workflow Section */}
      <section id="workflow" className="py-24 border-t border-[var(--border-subtle)]">
        <div className="container mx-auto px-4 md:px-8">
          <SlideUp className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-primary mb-2 block">
              Architected Flow
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              From first portal submission to signed offer
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every stage of your placement journey connected in one streamlined pipeline.
            </p>
          </SlideUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {WORKFLOW_STEPS.map((item, idx) => (
              <SlideUp key={idx} delay={0.1 * idx}>
                <Card className="p-6 h-full flex flex-col justify-between hover:border-primary/40 transition-colors">
                  <div>
                    <span className="font-mono text-2xl font-black text-primary/80 mb-3 block">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center text-xs font-semibold text-primary gap-1">
                    <span>Explore stage</span>
                    <ArrowRight className="size-3" />
                  </div>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* Community Proof Section */}
      <section id="community" className="py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <SlideUp className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 text-[var(--accent-copper)]">
                <Users className="size-3.5" />
                <span>Campus Peer Network</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                Built by students who survived the placement grind.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                Placement season is high-stakes and chaotic. PlaceTrack was forged to give students an unfair advantage through collective intelligence and disciplined tracking.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "100% anonymous experience submissions supported",
                  "Verified assessment questions tagged by year & role",
                  "Direct links to curated guides without paywalls",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Check className="size-3 font-bold" />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </SlideUp>

            {/* Right Bento Experience Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SlideUp delay={0.1}>
                <Card className="p-5 space-y-3 h-full">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">Tier-1 Tech Candidate</span>
                    <span className="text-[10px] text-muted-foreground">Placed at Google</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "PlaceTrack changed everything for our batch. We shared OA questions immediately after each test and everyone knew what topics were trending."
                  </p>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Verified Alum</span>
                    <span className="font-semibold text-primary">★★★★★</span>
                  </div>
                </Card>
              </SlideUp>

              <SlideUp delay={0.2}>
                <Card className="p-5 space-y-3 h-full">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">Campus Lead</span>
                    <span className="text-[10px] text-muted-foreground">Batch of 2025</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "Managing 60+ applications across random portals used to cause missed deadlines every week. Having a clean status rail is game-changing."
                  </p>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>CS Senior</span>
                    <span className="font-semibold text-primary">★★★★★</span>
                  </div>
                </Card>
              </SlideUp>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
