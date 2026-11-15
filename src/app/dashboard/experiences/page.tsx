import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { formatDistanceToNow, format } from "date-fns"
import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { ExperiencesNavigation } from "@/components/experiences/experiences-navigation"
import { CompanyExperiencesHub } from "@/components/experiences/company-experiences-hub"
import { CompanyExperienceCardData } from "@/components/experiences/company-experience-card"

export const dynamic = "force-dynamic"

export default async function ExperiencesRepository() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  // 1. Fetch all companies that have at least one shared experience
  const [companiesWithExperiences, allExperiences] = await Promise.all([
    prisma.company.findMany({
      where: {
        experiences: { some: {} },
      },
      include: {
        experiences: {
          select: {
            id: true,
            role: true,
            difficulty: true,
            createdAt: true,
            assessmentQuestions: { select: { id: true } },
            interviewQuestions: { select: { id: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    // 2. Fetch all individual experiences for the optional flat timeline feed
    prisma.experience.findMany({
      include: {
        company: true,
        user: true,
        votes: { where: { userId: user.id } },
      },
      orderBy: { createdAt: "desc" },
      take: 48,
    }),
  ])

  // Compute aggregated card data per company
  const companyCards: CompanyExperienceCardData[] = companiesWithExperiences.map((comp) => {
    const exps = comp.experiences
    const totalExp = exps.length

    // Average difficulty
    const totalDiff = exps.reduce((acc, e) => acc + (e.difficulty || 0), 0)
    const avgDiff = totalExp > 0 ? totalDiff / totalExp : 0

    // Common role tags
    const roleCounts: Record<string, number> = {}
    exps.forEach((e) => {
      const r = (e.role || "General").trim()
      roleCounts[r] = (roleCounts[r] || 0) + 1
    })
    const commonRoles = Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([role]) => role)

    // Total questions documented
    let totalQuestions = 0
    exps.forEach((e) => {
      totalQuestions += e.assessmentQuestions.length
      totalQuestions += e.interviewQuestions.length
    })

    // Latest submission text
    let latestSubmissionText = "Recently"
    if (exps[0]?.createdAt) {
      try {
        latestSubmissionText = formatDistanceToNow(new Date(exps[0].createdAt), { addSuffix: true })
      } catch {
        latestSubmissionText = format(new Date(exps[0].createdAt), "MMM d, yyyy")
      }
    }

    return {
      id: comp.id,
      name: comp.name,
      logo: comp.logo,
      industry: comp.industry,
      totalExperiences: totalExp,
      totalQuestions,
      avgDifficulty: avgDiff,
      commonRoles,
      latestSubmissionText,
    }
  })

  // Sort by total experiences descending by default
  companyCards.sort((a, b) => b.totalExperiences - a.totalExperiences)

  const totalSubmissions = allExperiences.length

  return (
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      <ExperiencesNavigation />

      <PageHeader
        title="Experience Repository"
        subtitle={`Browse candidate interview and OA debriefs grouped by company, with real questions and difficulty ratings.`}
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            {totalSubmissions} Submissions · {companyCards.length} Companies
          </span>
        }
        actions={
          <Link
            href="/dashboard/experiences/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground shadow-2xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Share Experience</span>
          </Link>
        }
      />

      <CompanyExperiencesHub
        companies={companyCards}
        allExperiences={allExperiences}
      />
    </div>
  )
}
