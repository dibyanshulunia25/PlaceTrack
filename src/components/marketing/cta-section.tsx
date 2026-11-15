"use client"

import { Button } from "@/components/ui/button"
import { SlideUp } from "@/components/ui/animation"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-[var(--bg-canvas)] px-4 md:px-8 border-t border-[var(--border-subtle)]">
      <SlideUp>
        <div className="container mx-auto rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden max-w-5xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary mx-auto">
              <Sparkles className="size-3.5" />
              <span>Ready for the 2026 Season</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Start your placement journey with complete clarity
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join students already using PlaceTrack to streamline applications, crack assessments, and land top offers. Free forever for students.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base font-bold bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/sign-in" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-foreground"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              No credit card required · Instant setup with Google or GitHub
            </p>
          </div>
        </div>
      </SlideUp>
    </section>
  )
}
