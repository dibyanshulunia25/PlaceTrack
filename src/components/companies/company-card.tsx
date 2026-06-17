import Link from "next/link"
import { Building2, BookOpen, HelpCircle, FileText, TrendingUp } from "lucide-react"

interface CompanyCardProps {
  company: {
    id: string
    name: string
    logo: string | null
    industry: string | null
    totalExperiences: number
    totalApplications: number
    avgDifficulty: number
    totalQuestions: number
  }
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/dashboard/experiences/${encodeURIComponent(company.name)}`}>
      <div className="group flex flex-col h-full p-6 space-y-6 border border-white/20 dark:border-white/10 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-clay-sm hover:shadow-clay-md transition-all duration-300 hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-xl bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-clay-inset flex items-center justify-center border border-white/20 overflow-hidden shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="size-8 text-primary/70" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
              {company.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {company.industry || "Software & Technology"}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm">
            <BookOpen className="size-4 text-blue-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Experiences</span>
              <span className="font-semibold">{company.totalExperiences}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm">
            <HelpCircle className="size-4 text-purple-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Questions</span>
              <span className="font-semibold">{company.totalQuestions}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm">
            <FileText className="size-4 text-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Applications</span>
              <span className="font-semibold">{company.totalApplications}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm">
            <TrendingUp className="size-4 text-orange-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Avg Difficulty</span>
              <span className="font-semibold">{company.avgDifficulty}/5</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
