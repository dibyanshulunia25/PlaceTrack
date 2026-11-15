import Link from "next/link"
import { Building2, BookOpen, HelpCircle, FileText, ArrowRight, Star } from "lucide-react"

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
  const formattedDifficulty = company.avgDifficulty > 0 ? company.avgDifficulty.toFixed(1) : "N/A"

  return (
    <Link href={`/dashboard/experiences/${encodeURIComponent(company.name)}`} className="block h-full group">
      <div className="flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)] hover:border-primary/40 transition-all duration-150">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/40 transition-colors">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-extrabold text-base text-foreground">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {company.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {company.industry || "Technology & Engineering"}
                </p>
              </div>
            </div>

            {company.avgDifficulty > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--accent-copper)]/10 text-[var(--accent-copper)] border border-[var(--accent-copper)]/20 shrink-0 inline-flex items-center gap-1">
                <Star className="size-3 fill-[var(--accent-copper)]" />
                {formattedDifficulty} / 5
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Experiences
            </span>
            <span className="text-sm font-black text-foreground mt-0.5 block">
              {company.totalExperiences}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Questions
            </span>
            <span className="text-sm font-black text-foreground mt-0.5 block">
              {company.totalQuestions}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Applicants
            </span>
            <span className="text-sm font-black text-foreground mt-0.5 block">
              {company.totalApplications}
            </span>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground">
          <span>Hiring Archive</span>
          <span className="font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Explore Rounds</span>
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
