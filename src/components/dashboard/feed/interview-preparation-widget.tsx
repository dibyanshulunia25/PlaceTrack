import { getSmartRecommendations } from "@/actions/mock-interviews"
import { Target, ArrowRight } from "lucide-react"
import Link from "next/link"

export async function InterviewPreparationWidget() {
  const recommendations = await getSmartRecommendations()

  if (recommendations.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-3xl border border-orange-500/20 p-5 shadow-clay-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-16 bg-orange-500/20 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      
      <div className="flex items-center gap-2 mb-4">
        <Target className="size-5 text-orange-500" />
        <h3 className="font-bold text-lg text-foreground">Interview Prep</h3>
      </div>

      <div className="space-y-4 z-10 relative">
        {recommendations.slice(0, 2).map((rec, i) => {
          const targetDate = rec.application.status === 'INTERVIEW' ? rec.application.interviewDate : rec.application.assessmentDate
          const daysLeft = targetDate ? Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null
          
          return (
            <div key={i} className="p-4 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/20 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold">{rec.application.company.name}</h4>
                  <p className="text-xs text-orange-500 font-bold">
                    {daysLeft !== null ? (daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `In ${daysLeft} days`) : "Upcoming"}
                  </p>
                </div>
                {rec.application.company.logo ? (
                  <img src={rec.application.company.logo} alt="" className="size-8 rounded-lg" />
                ) : null}
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-muted-foreground bg-background/50 px-2 py-1 rounded">
                  {rec.recommendedQuestions.length} Questions
                </span>
                <Link 
                  href={`/mock-interviews/practice?company=${encodeURIComponent(rec.application.company.name)}`}
                  className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Start Practice <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      
      <Link href="/mock-interviews" className="block w-full text-center mt-4 text-xs font-bold text-muted-foreground hover:text-orange-500 transition-colors">
        View Hub
      </Link>
    </div>
  )
}
