import { prisma } from "@/lib/prisma"
import { PublicExperienceCard } from "@/components/experiences/public-experience-card"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { Building2, ArrowLeft, TrendingUp, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { PaginationWrapper } from "@/components/experiences/pagination-wrapper"

export default async function CompanyExperiencesPage({
  params,
  searchParams,
}: {
  params: { company: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const decodedCompany = decodeURIComponent(params.company)
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const limit = 9

  const company = await prisma.company.findFirst({
    where: { name: { equals: decodedCompany, mode: 'insensitive' } },
    include: {
      experiences: {
        include: { user: true, company: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-2xl font-bold mb-2">Company Not Found</h3>
        <p className="text-muted-foreground mb-6">We couldn't find any experiences for {decodedCompany}.</p>
        <Link href="/experiences" className="text-primary hover:underline">Return to Repository</Link>
      </div>
    )
  }

  const totalExperiences = company.experiences.length
  const avgDifficulty = company.experiences.length > 0 
    ? (company.experiences.reduce((acc, exp) => acc + exp.difficulty, 0) / company.experiences.length).toFixed(1)
    : 0
  
  const totalQuestions = company.experiences.reduce((acc, exp) => {
    let count = 0;
    if (exp.oaQuestions) count++;
    if (exp.interviewQuestions) count++;
    return acc + count;
  }, 0)

  const paginatedExperiences = company.experiences.slice((page - 1) * limit, page * limit)
  const totalPages = Math.ceil(totalExperiences / limit)

  return (
    <div className="space-y-8">
      <div>
        <Link href="/experiences" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all experiences
        </Link>
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-clay-inset">
            <Building2 className="size-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground mt-1">Interview Experiences & Insights</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-clay-light dark:shadow-none">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl font-black text-primary mb-2">{totalExperiences}</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Experiences</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-clay-light dark:shadow-none">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl font-black text-blue-500 mb-2 flex items-center">
              {avgDifficulty} <span className="text-lg ml-1 text-muted-foreground">/ 5</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="size-4" /> Average Difficulty
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-clay-light dark:shadow-none">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="text-4xl font-black text-purple-500 mb-2">{totalQuestions}+</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="size-4" /> Questions Documented
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8">
        {paginatedExperiences.map((exp, i) => (
          <PublicExperienceCard key={exp.id} experience={exp} index={i} />
        ))}
      </div>
      
      {totalExperiences > limit && (
        <PaginationWrapper currentPage={page} totalPages={totalPages} />
      )}
    </div>
  )
}
