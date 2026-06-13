"use client"

import { Button } from "@/components/ui/button"
import { SlideUp } from "@/components/ui/animation"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-surface px-4 md:px-8">
      <SlideUp>
        <div className="container mx-auto rounded-[2rem] bg-glass backdrop-blur-xl shadow-clay border-none p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to secure your dream job?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Join thousands of students who are already using PlaceTrack to organize their placement journey and land top offers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-14 px-8 text-lg font-medium">
                  Get Started for Free
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Free forever for students.
            </p>
          </div>
        </div>
      </SlideUp>
    </section>
  )
}
