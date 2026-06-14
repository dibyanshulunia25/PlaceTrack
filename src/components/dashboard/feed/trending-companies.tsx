import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export async function TrendingCompanies() {
  const companies = await prisma.company.findMany({
    include: {
      experiences: true,
    },
  })

  const trending = companies
    .filter(c => c.experiences.length > 0)
    .sort((a, b) => b.experiences.length - a.experiences.length)
    .slice(0, 5)

  if (trending.length === 0) return null

  return (
    <Card className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border-border/50 shadow-clay-light dark:shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" /> Trending Companies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {trending.map((company, index) => {
          let questionsCount = 0;
          company.experiences.forEach(e => {
            if (e.oaQuestions) questionsCount++;
            if (e.interviewQuestions) questionsCount++;
          })

          return (
            <Link href={`/dashboard/global-repo/${encodeURIComponent(company.name)}`} key={company.id} className="block">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-border/40 group">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">{company.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{company.experiences.length} Experience{company.experiences.length !== 1 && 's'}</p>
                  </div>
                </div>
                {questionsCount > 0 && (
                  <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {questionsCount} Qs
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
