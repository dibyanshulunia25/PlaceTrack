"use client"

import { FadeIn, SlideUp } from "@/components/ui/animation"

export function BenefitsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <SlideUp className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Built for Students, by Students
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop relying on messy spreadsheets. We've crafted an experience tailored to the modern placement season.
          </p>
        </SlideUp>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.2} className="order-2 md:order-1">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl bg-glass backdrop-blur-xl shadow-clay border-none overflow-hidden flex items-center justify-center p-8">
              {/* Abstract visualization or placeholder for dashboard image */}
              <div className="w-full h-full rounded-2xl bg-surface/50 shadow-clay-inset border border-white/10 flex flex-col p-6 gap-4">
                <div className="w-1/3 h-6 rounded-md bg-primary/20"></div>
                <div className="w-full h-12 rounded-lg bg-background/50"></div>
                <div className="w-full h-12 rounded-lg bg-background/50"></div>
                <div className="w-3/4 h-12 rounded-lg bg-background/50"></div>
              </div>
            </div>
          </FadeIn>
          <SlideUp delay={0.3} className="order-1 md:order-2 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">Ditch the Spreadsheets</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Managing 50+ applications across different portals, dealing with conflicting assessment times, and tracking interview stages shouldn't feel like a full-time job.
            </p>
            <ul className="space-y-4">
              {[
                "Unified dashboard for all applications",
                "Automated status transitions",
                "One-click resource access",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-foreground font-medium">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mr-3">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </SlideUp>
        </div>
      </div>
    </section>
  )
}
