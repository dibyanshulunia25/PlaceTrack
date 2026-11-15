"use client"

import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/ui/animation"
import { ArrowRight, Sparkles, Compass } from "lucide-react"
import Link from "next/link"
import { CareerTrajectoryCanvas } from "./career-trajectory-canvas"
import { InteractiveHeroPreview } from "./interactive-hero-preview"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent pt-20 pb-28 md:pt-24 md:pb-36">
      {/* Living Interactive Career Trajectory Canvas */}
      <CareerTrajectoryCanvas />

      <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col items-center text-center">
        {/* Status Pill */}
        <FadeIn delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold shadow-2xs mb-6">
            <span className="flex size-2 rounded-full bg-primary" />
            <span className="text-foreground">Campus Placement Season 2026 Ready</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-[var(--accent-copper)] font-medium inline-flex items-center gap-1">
              <Sparkles className="size-3" />
              Real Peer Intel
            </span>
          </div>
        </FadeIn>

        {/* Editorial Headline */}
        <SlideUp delay={0.15} className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground mb-6 leading-[1.08]">
            Master your placement journey with{" "}
            <span className="text-primary">
              PlaceTrack
            </span>
          </h1>
        </SlideUp>

        {/* Subtitle */}
        <SlideUp delay={0.25} className="max-w-2xl">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            The modern student command center for tracking applications, analyzing peer assessment intelligence, and crushing technical rounds without spreadsheet chaos.
          </p>
        </SlideUp>

        {/* Action Buttons */}
        <SlideUp delay={0.35} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-7 text-base font-bold bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground shadow-sm inline-flex items-center justify-center gap-2"
            >
              <span>Start Tracking Free</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 px-7 text-base font-semibold border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-foreground shadow-2xs"
            >
              Explore Features
            </Button>
          </a>
        </SlideUp>

        {/* Interactive Live Product Preview */}
        <SlideUp delay={0.45} className="w-full">
          <InteractiveHeroPreview />
        </SlideUp>
      </div>
    </section>
  )
}
