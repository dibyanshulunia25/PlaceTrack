import { getCompanyMockHub } from "@/actions/mock-interviews"
import { notFound } from "next/navigation"
import { Building2, Plus, Target, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function CompanyMockHub({
  params
}: {
  params: { company: string }
}) {
  const decodedCompany = decodeURIComponent((await params).company)
  const company = await getCompanyMockHub(decodedCompany)

  if (!company) {
    notFound()
  }

  const uniqueContributors = new Set(company.mockQuestions.map(q => q.userId)).size
  
  // Category distribution
  const categories = company.mockQuestions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-white/20 dark:border-white/10 shadow-clay-md p-8 md:p-12 backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left z-10">
          <div className="size-32 rounded-3xl bg-white/50 dark:bg-black/50 shadow-clay-inset flex items-center justify-center border border-white/20 overflow-hidden shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="size-16 text-emerald-500/70" />
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-bold text-emerald-500 tracking-wider uppercase mb-1">Company Mock Hub</p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{company.name}</h1>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
              <span className="flex items-center gap-1.5"><BookOpen className="size-4 text-blue-500" /> {company.mockQuestions.length} Questions</span>
              <span className="flex items-center gap-1.5"><Users className="size-4 text-purple-500" /> {uniqueContributors} Contributors</span>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href={`/mock-interviews/practice?company=${encodeURIComponent(company.name)}`}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              >
                <Target className="size-5" />
                Start Practice Session
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Sidebar: Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-sm">
            <h2 className="text-xl font-bold mb-4">Question Categories</h2>
            <div className="space-y-2">
              {Object.entries(categories).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm">
                  <span className="font-medium">{cat}</span>
                  <span className="bg-background/50 px-2 py-0.5 rounded-md text-xs font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(categories).length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">No categories yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Main: Question List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Community Questions</h2>
          </div>

          <div className="grid gap-4">
            {company.mockQuestions.map(q => (
              <Link key={q.id} href={`/mock-interviews/${encodeURIComponent(company.name)}/${q.id}`}>
                <div className="p-5 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-sm hover:shadow-clay-md transition-all group">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-500 transition-colors">
                      {q.question}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-background/50 border border-white/10 shrink-0">
                      Difficulty: {q.difficulty}/5
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold text-xs border border-emerald-500/20">
                      {q.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold text-xs border border-blue-500/20">
                      {q.role}
                    </span>
                    <span>• By {q.user.name}</span>
                  </div>
                </div>
              </Link>
            ))}
            
            {company.mockQuestions.length === 0 && (
              <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-white/30 bg-white/5">
                <p className="text-muted-foreground mb-4">No questions have been added for this company yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
