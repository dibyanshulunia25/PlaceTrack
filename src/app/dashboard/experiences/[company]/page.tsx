import { prisma } from "@/lib/prisma"
import { PublicExperienceCard } from "@/components/experiences/public-experience-card"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { Building2, ArrowLeft, TrendingUp, HelpCircle, Star, Plus, CheckCircle2, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { PaginationWrapper } from "@/components/experiences/pagination-wrapper"
import { getDifficultyBadge } from "@/lib/difficulty-utils"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

export default async function CompanyExperiencesPage({
  params,
  searchParams,
}: {
  params: Promise<{ company: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const decodedCompany = decodeURIComponent(resolvedParams.company)
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 12

  const company = await prisma.company.findFirst({
    where: { name: { equals: decodedCompany, mode: "insensitive" } },
    include: {
      experiences: {
        include: {
          user: true,
          company: true,
          assessmentQuestions: true,
          interviewQuestions: true,
          votes: { where: { userId: user.id } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { applications: true },
      },
    },
  })

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Building2 className="size-6" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">Company Not Found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          We couldn't find any experiences tracked for "{decodedCompany}".
        </p>
        <Link
          href="/dashboard/experiences"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to All Companies</span>
        </Link>
      </div>
    )
  }

  const totalExperiences = company.experiences.length
  const avgDifficulty =
    totalExperiences > 0
      ? company.experiences.reduce((acc, exp) => acc + (exp.difficulty || 0), 0) / totalExperiences
      : 0
  const diffBadge = getDifficultyBadge(avgDifficulty)

  const totalQuestions = company.experiences.reduce((acc, exp) => {
    return acc + exp.assessmentQuestions.length + exp.interviewQuestions.length
  }, 0)

  // Offers shared
  const offersCount = company.experiences.filter(
    (e) => e.offerStatus && e.offerStatus.toLowerCase().includes("offer")
  ).length
  const offerRateText = totalExperiences > 0 ? `${Math.round((offersCount / totalExperiences) * 100)}%` : "N/A"

  const paginatedExperiences = company.experiences.slice((page - 1) * limit, page * limit)
  const totalPages = Math.ceil(totalExperiences / limit)

  return (
    <div className="space-y-6 pb-12 animate-page-enter">
      {/* 1. Back Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/experiences"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1 rounded-lg hover:bg-[var(--bg-elevated)]"
        >
          <ArrowLeft className="size-4" />
          <span>← All Companies</span>
        </Link>

        <Link
          href="/dashboard/experiences/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground shadow-2xs transition-colors"
        >
          <Plus className="size-3.5" />
          <span>Share {company.name} Debrief</span>
        </Link>
      </div>

      {/* 2. Company Summary Banner Card */}
      <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevation-card)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-xl text-foreground shrink-0 overflow-hidden shadow-2xs">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span>{company.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  {company.name}
                </h1>
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1",
                    diffBadge.colorClass
                  )}
                >
                  <Star className="size-3 fill-current" />
                  <span>{diffBadge.label}</span>
                  <span className="text-[10px] opacity-80">({diffBadge.score})</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {company.industry || "Technology & Engineering"} · Placement Intelligence Feed
              </p>
            </div>
          </div>
        </div>

        {/* 4-Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Shared Experiences
            </span>
            <span className="text-xl font-black text-foreground mt-1 block">
              {totalExperiences}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Interview Difficulty
            </span>
            <span className="text-xl font-black text-foreground mt-1 block">
              {avgDifficulty > 0 ? `${avgDifficulty.toFixed(1)}/5` : "N/A"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Questions Logged
            </span>
            <span className="text-xl font-black text-foreground mt-1 block">
              {totalQuestions}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Reported Offer Rate
            </span>
            <span className="text-xl font-black text-primary mt-1 block">
              {offerRateText}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Experiences Grid */}
      {paginatedExperiences.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={`No experiences yet for ${company.name}`}
          description="Be the first candidate to contribute an interview or assessment debrief for this company!"
          action={
            <Link
              href="/dashboard/experiences/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground"
            >
              <Plus className="size-3.5" />
              <span>Share Experience</span>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {paginatedExperiences.map((exp, i) => (
            <PublicExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
        </div>
      )}

      {totalExperiences > limit && (
        <div className="pt-4 flex justify-center">
          <PaginationWrapper currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
