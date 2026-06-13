"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Marquee } from "@/components/ui/marquee"
import { SlideUp } from "@/components/ui/animation"
import { BookOpen, Calendar, CheckSquare, LineChart, Target, Users } from "lucide-react"

const features = [
  {
    title: "Application Tracking",
    description: "Keep all your job applications, stages, and notes in one unified dashboard.",
    icon: <CheckSquare className="size-6 text-primary" />,
  },
  {
    title: "Interview Prep",
    description: "Log interview questions, experiences, and feedback to improve every time.",
    icon: <Users className="size-6 text-primary" />,
  },
  {
    title: "Deadlines & Reminders",
    description: "Never miss an assessment or interview with automated tracking.",
    icon: <Calendar className="size-6 text-primary" />,
  },
  {
    title: "Analytics & Insights",
    description: "Visualize your success rate and identify areas for improvement.",
    icon: <LineChart className="size-6 text-primary" />,
  },
  {
    title: "Resource Library",
    description: "Store links, resume versions, and study materials efficiently.",
    icon: <BookOpen className="size-6 text-primary" />,
  },
  {
    title: "Goal Setting",
    description: "Set placement targets and track your daily preparation progress.",
    icon: <Target className="size-6 text-primary" />,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 mb-16 text-center">
        <SlideUp>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need to get placed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PlaceTrack combines application management, preparation resources, and intelligent insights into a single platform.
          </p>
        </SlideUp>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--gap:2rem] py-4">
          {features.map((feature, i) => (
            <Card key={i} className="w-[300px] shrink-0">
              <CardHeader className="pb-2">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 shadow-clay-inset">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </Marquee>
        
        {/* Gradient fades for Marquee */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-surface to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-surface to-transparent"></div>
      </div>
    </section>
  )
}
