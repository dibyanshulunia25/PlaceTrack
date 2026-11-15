import { 
  getMockCompanies, 
  getSmartRecommendations,
  getPersonalQuestions,
  getBookmarkedQuestions,
  getUserPracticeAnalytics
} from "@/actions/mock-interviews"
import { Building2, BrainCircuit, Target, ArrowRight, Play, CheckCircle2, Bookmark, Plus } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PreparationAnalytics } from "@/components/mock-interviews/preparation-analytics"
import { PersonalQuestionBank } from "@/components/mock-interviews/personal-question-bank"
import { PageHeader } from "@/components/dashboard/page-header"
import { Card } from "@/components/ui/card"

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
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      {/* Compact PageHeader */}
      <PageHeader
        title="Interview Preparation Platform"
        subtitle="Practice company-specific questions, track your mastery streak, and conquer technical rounds."
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            Active Prep Hub
          </span>
        }
        actions={
          <Link
            href="/dashboard/mock-interviews/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground shadow-2xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Create Question</span>
          </Link>
        }
      />

      <PreparationAnalytics analytics={analytics} />

      <Tabs defaultValue="recommended" className="w-full">
        <div className="flex justify-start sm:justify-center mb-6">
          <TabsList className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-1 rounded-2xl shadow-2xs">
            <TabsTrigger
              value="recommended"
              className="rounded-xl px-4 sm:px-6 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Recommended Focus
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="rounded-xl px-4 sm:px-6 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Personal Bank
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="rounded-xl px-4 sm:px-6 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Company Question Banks
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="recommended" className="space-y-6 mt-0 border-none p-0 outline-none">
          {recommendations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.map(rec => (
                <Card key={rec.application.id} className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-copper)]/10 text-[var(--accent-copper)] border border-[var(--accent-copper)]/20 mb-2 inline-block">
                          Upcoming {rec.application.status === 'ONLINE_ASSESSMENT' ? 'Assessment' : 'Interview'}
                        </span>
                        <h3 className="text-2xl font-bold text-foreground">{rec.application.company.name}</h3>
                      </div>
                      {rec.application.company.logo ? (
                        <img src={rec.application.company.logo} alt="" className="size-11 rounded-xl object-cover border border-[var(--border-subtle)]" />
                      ) : (
                        <div className="size-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-base text-foreground">
                          {rec.application.company.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Recommended Focus Modules:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.topics.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md text-xs font-semibold text-foreground">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground pt-1">
                        <CheckCircle2 className="size-4 text-primary" />
                        <span>{rec.recommendedQuestions.length} Questions Available</span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href={`/dashboard/mock-interviews/practice?company=${encodeURIComponent(rec.application.company.name)}`}
                    className="flex items-center justify-center w-full gap-2 bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Start Practice Session</span>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 space-y-2">
              <Target className="size-10 mx-auto text-muted-foreground/40 mb-2" />
              <h3 className="text-base font-bold text-foreground">No Upcoming Interviews Scheduled</h3>
              <p className="text-xs max-w-sm mx-auto">
                Track job applications with target assessment or interview dates to unlock personalized preparation question sets.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="mt-0 border-none p-0 outline-none">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="text-lg font-bold text-foreground">Personal Question Bank</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Your private collection of logged interview questions, hints, and expected responses.</p>
              </div>
              <Link
                href="/dashboard/mock-interviews/new"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition-colors self-start sm:self-auto"
              >
                <Plus className="size-3.5" />
                <span>Add Question</span>
              </Link>
            </div>
            <PersonalQuestionBank personalQuestions={personalQuestions} bookmarkedQuestions={bookmarkedQuestions} />
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6 mt-0 border-none p-0 outline-none">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">Company Question Banks</h2>
              <p className="text-xs text-muted-foreground">Crowdsourced technical, behavioral, and system design questions.</p>
            </div>
            <Link
              href="/dashboard/mock-interviews/new"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <Plus className="size-3.5" />
              <span>Contribute Question</span>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {companies.filter(c => c.totalQuestions > 0).map(company => (
              <Link key={company.id} href={`/dashboard/mock-interviews/${encodeURIComponent(company.name)}`} className="block group">
                <Card className="p-6 h-full flex flex-col justify-between hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden shrink-0">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-extrabold text-sm text-foreground">
                            {company.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {company.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {company.totalQuestions} Questions · {company.totalContributors} Contributors
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0" />
                  </div>

                  <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-muted-foreground">
                    <span>{company.totalPracticeSessions} Sessions Completed</span>
                    <span className="font-semibold text-primary">Explore Bank →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
