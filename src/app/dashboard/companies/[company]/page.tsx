import { getCompanyProfile } from "@/actions/companies"
import { notFound } from "next/navigation"
import { Building2, Globe, TrendingUp, BookOpen, HelpCircle, Briefcase, ExternalLink, MessageSquare, Target } from "lucide-react"
import { PublicExperienceCard } from "@/components/experiences/public-experience-card"
import { EmptyState } from "@/components/ui/empty-state"
import { ResourceCard } from "@/components/resources/resource-card"

export const dynamic = 'force-dynamic'

export default async function CompanyProfilePage({
  params
}: {
  params: { company: string }
}) {
  const decodedCompanyName = decodeURIComponent((await params).company)
  const profile = await getCompanyProfile(decodedCompanyName)

  if (!profile) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      
      {/* 1. Header / Overview Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 border border-white/20 dark:border-white/10 shadow-clay-md p-8 md:p-12 backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 p-32 bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left z-10">
          <div className="size-32 rounded-3xl bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-clay-inset flex items-center justify-center border border-white/20 overflow-hidden shrink-0">
            {profile.logo ? (
              <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="size-16 text-primary/70" />
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {profile.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
              {profile.industry && (
                <div className="flex items-center gap-1.5 bg-white/20 dark:bg-black/20 px-3 py-1.5 rounded-full border border-white/10 shadow-sm text-sm font-medium">
                  <Briefcase className="size-4 text-blue-500" />
                  {profile.industry}
                </div>
              )}
              {profile.website && (
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 bg-white/20 dark:bg-black/20 px-3 py-1.5 rounded-full border border-white/10 shadow-sm hover:bg-white/30 dark:hover:bg-white/10 transition-colors text-sm font-medium text-primary"
                >
                  <Globe className="size-4" />
                  Careers Website
                  <ExternalLink className="size-3 ml-0.5 opacity-70" />
                </a>
              )}
            </div>

            {profile.topTags.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2 font-medium">Most Discussed Topics:</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {profile.topTags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary/10 text-primary border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Experiences", value: profile._count.experiences, color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: HelpCircle, label: "Interview Questions", value: profile.totalQuestionsCount, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: Target, label: "Applications Tracked", value: profile._count.applications, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { icon: TrendingUp, label: "Avg Difficulty", value: `${profile.avgDifficulty}/5`, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col p-6 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-sm items-center text-center">
            <div className={`p-3 rounded-xl mb-4 shadow-inner ${stat.bg}`}>
              <stat.icon className={`size-6 ${stat.color}`} />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Questions & Resources */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Question Bank Preview */}
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <MessageSquare className="size-5 text-primary" />
              <h2 className="text-xl font-bold">Question Bank</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Recent OA Questions ({profile.oaQuestions.length})
                </h3>
                {profile.oaQuestions.length > 0 ? (
                  <ul className="space-y-3">
                    {profile.oaQuestions.slice(0, 3).map((q, i) => (
                      <li key={i} className="text-sm p-3 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 shadow-sm line-clamp-3">
                        <span className="font-medium text-primary mr-2">[{q.year} - {q.role}]</span>
                        {q.content}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic p-3">No OA questions reported yet.</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Recent Interview Questions ({profile.interviewQuestions.length})
                </h3>
                {profile.interviewQuestions.length > 0 ? (
                  <ul className="space-y-3">
                    {profile.interviewQuestions.slice(0, 3).map((q, i) => (
                      <li key={i} className="text-sm p-3 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 shadow-sm line-clamp-3">
                        <span className="font-medium text-primary mr-2">[{q.year} - {q.role}]</span>
                        {q.content}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic p-3">No interview questions reported yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* External Resources */}
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <Globe className="size-5 text-emerald-500" />
              <h2 className="text-xl font-bold">Preparation Guides</h2>
            </div>
            
            {profile.resources.length > 0 ? (
              <div className="flex flex-col gap-4">
                {profile.resources.slice(0, 3).map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic p-3">No external guides linked for this company.</p>
            )}
          </div>

        </div>

        {/* Right Column: Experiences */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-blue-500" />
                <h2 className="text-xl font-bold">Top Experiences</h2>
              </div>
            </div>

            {profile.topExperiences.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.topExperiences.slice(0, 4).map((exp, i) => (
                  <PublicExperienceCard key={exp.id} experience={{...exp, company: profile}} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No experiences yet"
                description={`Be the first to share your interview experience at ${profile.name}!`}
              />
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-orange-500" />
                <h2 className="text-xl font-bold">Recent Experiences</h2>
              </div>
            </div>

            {profile.recentExperiences.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.recentExperiences.slice(0, 4).map((exp, i) => (
                  <PublicExperienceCard key={exp.id} experience={{...exp, company: profile}} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic p-3 text-center">No recent experiences.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
