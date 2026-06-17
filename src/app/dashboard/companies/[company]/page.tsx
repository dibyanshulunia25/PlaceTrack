import { getCompanyProfile } from "@/actions/companies"
import { notFound } from "next/navigation"
import { Building2, Globe, TrendingUp, BookOpen, HelpCircle, Briefcase, ExternalLink, MessageSquare, Target, TargetIcon, Users, FileText, CheckCircle2, ChevronRight, Play } from "lucide-react"
import { PublicExperienceCard } from "@/components/experiences/public-experience-card"
import { EmptyState } from "@/components/ui/empty-state"
import { ResourceCard } from "@/components/resources/resource-card"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function CompanyProfilePage({
  params
}: {
  params: Promise<{ company: string }>
}) {
  const decodedCompanyName = decodeURIComponent((await params).company)
  const profile = await getCompanyProfile(decodedCompanyName)

  if (!profile) {
    notFound()
  }

  // Safe percentage helper
  const percentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      
      {/* 1. Company Overview Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-white/5 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-clay-md p-8 md:p-12 backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left z-10 relative">
          <div className="size-32 rounded-3xl bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-clay-inset flex items-center justify-center border border-white/20 overflow-hidden shrink-0">
            {profile.logo ? (
              <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="size-16 text-primary/70" />
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {profile.name}
              </h1>
              <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-sm font-bold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {profile.hiringStatus || "Actively Hiring"}
              </div>
            </div>
            
            <p className="text-muted-foreground text-lg max-w-3xl">
              {profile.description || `${profile.name} is tracking robust activity across our community. View comprehensive hiring insights, candidate experiences, and trending interview questions below to structure your preparation.`}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              {profile.industry && (
                <div className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-sm font-bold">
                  <Briefcase className="size-4 text-blue-500" />
                  {profile.industry}
                </div>
              )}
              {profile.website && (
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-sm font-bold text-primary"
                >
                  <Globe className="size-4 text-primary" />
                  Careers Portal
                  <ExternalLink className="size-3 ml-0.5 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Preparation Center CTA Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href={`/dashboard/mock-interviews/practice?company=${encodeURIComponent(profile.name)}`} className="group flex items-center justify-between p-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-md hover:shadow-lg">
          <div className="flex items-center gap-2"><Play className="size-5" /> Mock Interview</div>
          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href={`/dashboard/experiences?company=${encodeURIComponent(profile.name)}`} className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 font-bold transition-all shadow-sm">
          <div className="flex items-center gap-2"><MessageSquare className="size-5 text-blue-500" /> View Questions</div>
          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href={`/dashboard/experiences?company=${encodeURIComponent(profile.name)}`} className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 font-bold transition-all shadow-sm">
          <div className="flex items-center gap-2"><BookOpen className="size-5 text-purple-500" /> Experiences</div>
          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href={`/dashboard/resources?company=${encodeURIComponent(profile.name)}`} className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 font-bold transition-all shadow-sm">
          <div className="flex items-center gap-2"><Globe className="size-5 text-emerald-500" /> View Guides</div>
          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* 3. Hiring Insights Funnel */}
          <div className="p-8 rounded-3xl bg-white/5 dark:bg-black/10 border border-white/10 shadow-clay-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="size-6 text-blue-500" /> Hiring Pipeline Insights</h2>
            <p className="text-muted-foreground text-sm mb-8">Aggregated community application data depicting the typical recruitment funnel conversion rates.</p>
            
            <div className="flex flex-col gap-3">
              <div className="relative h-12 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center px-4">
                <div className="absolute left-0 top-0 h-full bg-blue-500/20" style={{ width: '100%' }} />
                <div className="relative z-10 flex justify-between w-full font-bold">
                  <span>Applications</span>
                  <span>{profile.hiringInsights.totalApplied}</span>
                </div>
              </div>
              
              <div className="relative h-12 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center px-4">
                <div className="absolute left-0 top-0 h-full bg-purple-500/20" style={{ width: `${percentage(profile.hiringInsights.totalAssessments, profile.hiringInsights.totalApplied)}%` }} />
                <div className="relative z-10 flex justify-between w-full font-bold">
                  <span>Online Assessments</span>
                  <span>{profile.hiringInsights.totalAssessments} <span className="text-xs font-normal text-muted-foreground ml-2">({percentage(profile.hiringInsights.totalAssessments, profile.hiringInsights.totalApplied)}%)</span></span>
                </div>
              </div>
              
              <div className="relative h-12 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center px-4">
                <div className="absolute left-0 top-0 h-full bg-orange-500/20" style={{ width: `${percentage(profile.hiringInsights.totalInterviews, profile.hiringInsights.totalApplied)}%` }} />
                <div className="relative z-10 flex justify-between w-full font-bold">
                  <span>Interviews</span>
                  <span>{profile.hiringInsights.totalInterviews} <span className="text-xs font-normal text-muted-foreground ml-2">({percentage(profile.hiringInsights.totalInterviews, profile.hiringInsights.totalApplied)}%)</span></span>
                </div>
              </div>

              <div className="relative h-12 w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center px-4">
                <div className="absolute left-0 top-0 h-full bg-emerald-500/20" style={{ width: `${percentage(profile.hiringInsights.totalOffers, profile.hiringInsights.totalApplied)}%` }} />
                <div className="relative z-10 flex justify-between w-full font-bold">
                  <span>Offers Tracked</span>
                  <span>{profile.hiringInsights.totalOffers} <span className="text-xs font-normal text-emerald-500 ml-2">({percentage(profile.hiringInsights.totalOffers, profile.hiringInsights.totalApplied)}%)</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Question Analytics */}
          <div className="p-8 rounded-3xl bg-white/5 dark:bg-black/10 border border-white/10 shadow-clay-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TargetIcon className="size-6 text-orange-500" /> Question Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-muted-foreground mb-4 border-b border-white/10 pb-2">Most Asked OA Questions</h3>
                <div className="space-y-4">
                  {profile.mostAskedOa.length > 0 ? profile.mostAskedOa.map((q, i) => (
                    <div key={i} className="flex justify-between items-start gap-4">
                      <p className="text-sm font-semibold line-clamp-2 leading-relaxed">{q.question}</p>
                      <span className="shrink-0 text-xs font-bold px-2 py-1 bg-white/10 rounded-md text-orange-500 border border-orange-500/20">{q.count}x</span>
                    </div>
                  )) : <p className="text-sm text-muted-foreground italic">Insufficient data</p>}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-muted-foreground mb-4 border-b border-white/10 pb-2">Most Asked Interview Questions</h3>
                <div className="space-y-4">
                  {profile.mostAskedInterview.length > 0 ? profile.mostAskedInterview.map((q, i) => (
                    <div key={i} className="flex justify-between items-start gap-4">
                      <p className="text-sm font-semibold line-clamp-2 leading-relaxed">{q.question}</p>
                      <span className="shrink-0 text-xs font-bold px-2 py-1 bg-white/10 rounded-md text-purple-500 border border-purple-500/20">{q.count}x</span>
                    </div>
                  )) : <p className="text-sm text-muted-foreground italic">Insufficient data</p>}
                </div>
              </div>
            </div>

            {profile.topTags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-sm font-bold text-muted-foreground mb-3">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.topTags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-bold rounded-lg bg-primary/10 text-primary border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* 5. Community Insights */}
          <div className="p-8 rounded-3xl bg-white/5 dark:bg-black/10 border border-white/10 shadow-clay-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle2 className="size-5 text-emerald-500" /> Community Insights</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg"><BookOpen className="size-4 text-blue-500" /></div>
                  <span className="font-semibold text-sm">Experiences Shared</span>
                </div>
                <span className="font-extrabold text-lg">{profile._count.experiences}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg"><HelpCircle className="size-4 text-purple-500" /></div>
                  <span className="font-semibold text-sm">Questions Tracked</span>
                </div>
                <span className="font-extrabold text-lg">{profile.totalQuestionsCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg"><FileText className="size-4 text-orange-500" /></div>
                  <span className="font-semibold text-sm">Assessment Reports</span>
                </div>
                <span className="font-extrabold text-lg">{profile.assessmentReports}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg"><Users className="size-4 text-pink-500" /></div>
                  <span className="font-semibold text-sm">Interview Reports</span>
                </div>
                <span className="font-extrabold text-lg">{profile.interviewReports}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg"><TrendingUp className="size-4 text-red-500" /></div>
                  <span className="font-semibold text-sm">Avg. Difficulty</span>
                </div>
                <span className="font-extrabold text-lg">{profile.avgDifficulty}/5</span>
              </div>
            </div>
          </div>

          {/* 6. External Insights */}
          <div className="p-8 rounded-3xl bg-white/5 dark:bg-black/10 border border-white/10 shadow-clay-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Globe className="size-5 text-indigo-500" /> External Insights</h2>
            
            {profile.resources.length > 0 ? (
              <div className="space-y-4">
                {profile.resources.slice(0, 4).map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
                {profile.resources.length > 4 && (
                  <Link href={`/dashboard/resources?company=${encodeURIComponent(profile.name)}`} className="block w-full text-center text-sm font-bold text-primary hover:text-primary/80 transition-colors pt-2">
                    View all {profile.resources.length} guides →
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-white/5 border border-white/10 border-dashed rounded-xl">
                <p className="text-sm text-muted-foreground font-semibold">No external guides linked.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
