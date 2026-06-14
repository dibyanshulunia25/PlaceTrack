import { Building2, Hash, TrendingUp, HelpCircle } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  logo: string | null
  totalExperiences: number
  totalQuestions: number
  views: number
}

interface Topic {
  topic: string
  count: number
}

export function TrendingGrid({ companies, topics }: { companies: Company[], topics: Topic[] }) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Active Companies */}
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-clay-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl shadow-inner">
            <Building2 className="size-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Most Active Companies</h2>
          </div>
        </div>

        <div className="space-y-3">
          {companies.map((company, i) => (
            <Link key={company.id} href={`/dashboard/global-repo/${encodeURIComponent(company.name)}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm hover:bg-white/30 transition-colors mb-3">
                <div className="font-bold text-muted-foreground w-4">{i + 1}</div>
                <div className="size-8 rounded-lg bg-white/50 dark:bg-black/50 overflow-hidden shrink-0 flex items-center justify-center">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="size-4 text-primary/50" />
                  )}
                </div>
                <div className="flex-1 font-semibold truncate">{company.name}</div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1"><HelpCircle className="size-3" />{company.totalQuestions}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="size-3" />{company.views}</span>
                </div>
              </div>
            </Link>
          ))}
          {companies.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">No active companies.</div>
          )}
        </div>
      </div>

      {/* Popular Topics */}
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-clay-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500/10 rounded-xl shadow-inner">
            <Hash className="size-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Trending Topics</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic, i) => (
            <div key={topic.topic} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm ${
              i < 3 ? 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold' : 'bg-white/20 dark:bg-white/5 border-white/10 text-muted-foreground font-medium'
            }`}>
              <span>{topic.topic}</span>
              <span className="bg-background/50 px-1.5 py-0.5 rounded text-[10px]">
                {topic.count}
              </span>
            </div>
          ))}
          {topics.length === 0 && (
            <div className="text-center py-4 text-muted-foreground w-full">No topics found.</div>
          )}
        </div>
      </div>

    </div>
  )
}
