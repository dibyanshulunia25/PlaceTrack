"use client"

import Link from "next/link"
import { Building2, ArrowRight, Star, Layers, Users, BookOpen } from "lucide-react"
import { getDifficultyBadge } from "@/lib/difficulty-utils"
import { cn } from "@/lib/utils"

export interface CompanyCardData {
  id: string
  name: string
  logo: string | null
  industry: string | null
  totalExperiences: number
  totalApplications: number
  avgDifficulty: number
  totalQuestions: number
  avgRounds?: number
  selectionRate?: number
}

interface CompanyCardProps {
  company: CompanyCardData
}

export function CompanyCard({ company }: CompanyCardProps) {
  const diffBadge = getDifficultyBadge(company.avgDifficulty)
  const estimatedRounds = company.avgRounds || (company.totalQuestions > 0 ? Math.min(5, Math.max(2, Math.round(company.totalQuestions / Math.max(1, company.totalExperiences)))) : 3)
  const selectionText = company.selectionRate !== undefined ? `${company.selectionRate}% Offer Rate` : company.totalApplications > 0 ? `${company.totalApplications} Applicants` : "Open Pool"

  return (
    <div className="h-full min-h-[220px] flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)] hover:border-primary/40 transition-all duration-150 select-none group">
      {/* Top Zone: Monogram + Name + Industry + Difficulty Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/40 transition-colors shadow-2xs font-extrabold text-base text-foreground">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span>{company.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate leading-snug">
                {company.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {company.industry || "Technology & Cloud Systems"}
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

        {/* Middle Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block truncate">
              Experiences
            </span>
            <span className="text-sm font-black text-foreground mt-0.5 block">
              {company.totalExperiences}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block truncate">
              Rounds
            </span>
            <span className="text-sm font-black text-foreground mt-0.5 block">
              ~{estimatedRounds} Stages
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block truncate">
              Applicants
            </span>
            <span className="text-sm font-black text-foreground mt-0.5 block truncate">
              {company.totalApplications}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Zone: Pinned Footer with Direct View Experiences Button */}
      <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground">
        <span className="text-[11px] text-muted-foreground truncate max-w-[130px]">
          {selectionText}
        </span>

        <Link
          href={`/dashboard/experiences/${encodeURIComponent(company.name)}`}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-[var(--accent-primary-hover)] group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Experiences</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
