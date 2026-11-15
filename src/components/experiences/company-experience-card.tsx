"use client"

import Link from "next/link"
import { Building2, ArrowRight, Star, Clock, HelpCircle, Briefcase } from "lucide-react"
import { getDifficultyBadge } from "@/lib/difficulty-utils"
import { cn } from "@/lib/utils"

export interface CompanyExperienceCardData {
  id: string
  name: string
  logo: string | null
  totalExperiences: number
  totalQuestions: number
  avgDifficulty: number
  commonRoles: string[]
  latestSubmissionText: string
  industry?: string | null
}

interface CompanyExperienceCardProps {
  company: CompanyExperienceCardData
}

export function CompanyExperienceCard({ company }: CompanyExperienceCardProps) {
  const diffBadge = getDifficultyBadge(company.avgDifficulty)

  return (
    <Link
      href={`/dashboard/experiences/${encodeURIComponent(company.name)}`}
      className="block h-full group"
    >
      <div className="h-full min-h-[220px] flex flex-col justify-between p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-primary/40 shadow-[var(--shadow-elevation-card)] transition-all duration-150 select-none">
        {/* Top Zone: Monogram + Company Name + Experiences Badge + Difficulty Badge */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="size-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-sm text-foreground shrink-0 overflow-hidden group-hover:border-primary/40 group-hover:text-primary transition-colors">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{company.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                  {company.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {company.industry || "Technology & Engineering"}
                </p>
              </div>
            </div>

            <span
              className={cn(
                "text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 inline-flex items-center gap-1",
                diffBadge.colorClass
              )}
            >
              <Star className="size-3 fill-current" />
              <span>{diffBadge.label}</span>
              <span className="text-[10px] opacity-80">({diffBadge.score})</span>
            </span>
          </div>

          {/* Experiences Count & Questions Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
              {company.totalExperiences} {company.totalExperiences === 1 ? "Experience" : "Experiences"}
            </span>

            {company.totalQuestions > 0 && (
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <HelpCircle className="size-3 text-muted-foreground" />
                {company.totalQuestions} questions
              </span>
            )}
          </div>

          {/* Common Role Tags */}
          <div className="flex flex-wrap gap-1.5 min-h-[26px]">
            {company.commonRoles && company.commonRoles.length > 0 ? (
              company.commonRoles.slice(0, 3).map((role) => (
                <span
                  key={role}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-elevated)]/80 text-muted-foreground border border-[var(--border-subtle)] truncate max-w-[150px]"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground italic">General Engineering</span>
            )}
          </div>
        </div>

        {/* Bottom Zone: Latest Submission Date + Link CTA */}
        <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3 text-muted-foreground shrink-0" />
            <span>{company.latestSubmissionText}</span>
          </span>

          <span className="font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
            <span>Explore Debriefs</span>
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
