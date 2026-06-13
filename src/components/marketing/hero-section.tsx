"use client"

import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/ui/animation"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col items-center text-center">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center rounded-full border border-border bg-glass backdrop-blur-md px-3 py-1 text-sm font-medium shadow-clay mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Now in open beta
          </div>
        </FadeIn>

        <SlideUp delay={0.2} className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6">
            Master your placement journey with <span className="text-primary">PlaceTrack</span>
          </h1>
        </SlideUp>

        <SlideUp delay={0.3} className="max-w-2xl">
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            The all-in-one platform to track applications, ace assessments, manage interviews, and conquer your placement season without the stress.
          </p>
        </SlideUp>

        <SlideUp delay={0.4} className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="h-14 px-8 text-lg font-medium">
              Start Tracking Free
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium">
            View Demo
          </Button>
        </SlideUp>
      </div>
    </section>
  )
}
