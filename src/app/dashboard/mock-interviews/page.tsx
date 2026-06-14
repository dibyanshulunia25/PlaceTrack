import { 
  getMockCompanies, 
  getSmartRecommendations,
  getPersonalQuestions,
  getBookmarkedQuestions,
  getUserPracticeAnalytics
} from "@/actions/mock-interviews"
import { Building2, BrainCircuit, Target, ArrowRight, Play, CheckCircle2, Bookmark } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PreparationAnalytics } from "@/components/mock-interviews/preparation-analytics"
import { PersonalQuestionBank } from "@/components/mock-interviews/personal-question-bank"

export const dynamic = 'force-dynamic'

export default async function MockInterviewsHub() {
  const [companies, recommendations, personalQuestions, bookmarkedQuestions, analytics] = await Promise.all([
    getMockCompanies(),
    getSmartRecommendations(),
    getPersonalQuestions(),
    getBookmarkedQuestions(),
    getUserPracticeAnalytics()
  ])

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="p-4 bg-emerald-500/10 rounded-full mb-2 shadow-clay-inset">
          <BrainCircuit className="size-12 text-emerald-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
          Preparation Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Practice company-specific questions, track your progress, and master your technical interviews.
        </p>
      </div>

      <PreparationAnalytics analytics={analytics} />

      <Tabs defaultValue="recommended" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl shadow-inner">
            <TabsTrigger value="recommended" className="rounded-xl px-6 data-[state=active]:bg-orange-500 data-[state=active]:text-white">Recommended</TabsTrigger>
            <TabsTrigger value="personal" className="rounded-xl px-6 data-[state=active]:bg-orange-500 data-[state=active]:text-white">Personal Bank</TabsTrigger>
            <TabsTrigger value="community" className="rounded-xl px-6 data-[state=active]:bg-orange-500 data-[state=active]:text-white">Community Hub</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="recommended" className="space-y-6 mt-0 border-none p-0 outline-none">
          {recommendations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.map(rec => (
                <div key={rec.application.id} className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-clay-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-24 bg-orange-500/5 rounded-full blur-[80px] -z-10 mix-blend-multiply" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm font-medium text-orange-500 mb-1">Upcoming {rec.application.status === 'ONLINE_ASSESSMENT' ? 'Assessment' : 'Interview'}</p>
                      <h3 className="text-2xl font-bold">{rec.application.company.name}</h3>
                    </div>
                    {rec.application.company.logo ? (
                      <img src={rec.application.company.logo} alt="" className="size-12 rounded-xl" />
                    ) : (
                      <Building2 className="size-12 p-2 bg-white/20 rounded-xl" />
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Recommended Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.topics.map(t => (
                          <span key={t} className="px-2 py-1 bg-white/20 dark:bg-white/5 border border-white/10 rounded-md text-xs font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span>{rec.recommendedQuestions.length} Questions Available</span>
                    </div>
                  </div>

                  <Link 
                    href={`/dashboard/mock-interviews/practice?company=${encodeURIComponent(rec.application.company.name)}`}
                    className="flex items-center justify-center w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    <Play className="size-4" fill="currentColor" />
                    Start Practice Session
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <Target className="size-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-bold text-foreground">No Upcoming Interviews</h3>
              <p>Apply to jobs to get personalized recommendations here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="mt-0 border-none p-0 outline-none">
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-clay-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Personal Question Bank</h2>
                <p className="text-sm text-muted-foreground mt-1">Your private collection of questions and expected answers.</p>
              </div>
              <Link href="/dashboard/mock-interviews/new" className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 transition-colors">
                + Create Question
              </Link>
            </div>
            <PersonalQuestionBank personalQuestions={personalQuestions} bookmarkedQuestions={bookmarkedQuestions} />
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6 mt-0 border-none p-0 outline-none">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="size-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Company Question Banks</h2>
            </div>
            <Link href="/dashboard/mock-interviews/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              Contribute Question
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.filter(c => c.totalQuestions > 0).map(company => (
              <Link key={company.id} href={`/dashboard/mock-interviews/${encodeURIComponent(company.name)}`}>
                <div className="group flex flex-col h-full p-6 space-y-6 border border-white/20 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-clay-sm hover:shadow-clay-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-xl bg-white/50 dark:bg-black/50 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="size-6 text-primary/70" />
                      )}
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold line-clamp-1">{company.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {company.totalQuestions} Questions • {company.totalContributors} Contributors
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>{company.totalPracticeSessions} Sessions</span>
                  </div>
                </div>
              </Link>
            ))}
            {companies.filter(c => c.totalQuestions > 0).length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-white/5 rounded-3xl border border-white/10 border-dashed">
                No mock questions have been added yet. Be the first to contribute!
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
