import { ExperienceForm } from "@/components/experiences/experience-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewExperiencePage() {
  return (
    <div className="max-w-3xl mx-auto py-4 pb-12">
      <Link href="/dashboard/experiences" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Experiences
      </Link>
      
      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-border/50 rounded-2xl p-8 shadow-clay-light dark:shadow-none">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Share Your Experience</h1>
        <p className="text-muted-foreground mb-8">Document your interview rounds, technical questions, and takeaways.</p>
        
        <ExperienceForm />
      </div>
    </div>
  )
}
