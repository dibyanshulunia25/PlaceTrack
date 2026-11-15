import { Building2, Hash, TrendingUp, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

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
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--border-subtle)]">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Building2 className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Most Active Companies</h2>
            <p className="text-xs text-muted-foreground">Highest community submissions</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {companies.slice(0, 5).map((company, i) => (
            <Link key={company.id} href={`/dashboard/experiences/${encodeURIComponent(company.name)}`}>
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 hover:bg-[var(--bg-elevated)] transition-colors">
                <div className="font-mono text-xs font-bold text-muted-foreground w-4 text-center">{i + 1}</div>
                <div className="size-7 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden shrink-0 flex items-center justify-center">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-xs text-foreground">{company.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 font-semibold text-xs text-foreground truncate">{company.name}</div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <span>{company.totalQuestions} Qs</span>
                  <span>·</span>
                  <span>{company.views} views</span>
                </div>
              </div>
            </Link>
          ))}
          {companies.length === 0 && (
            <div className="text-center py-4 text-xs text-muted-foreground">No active companies found.</div>
          )}
        </div>
      </Card>

      {/* Popular Topics */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
          <div className="size-8 rounded-lg bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 flex items-center justify-center text-[var(--accent-copper)]">
            <Hash className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Trending Tags</h2>
            <p className="text-xs text-muted-foreground">High-frequency question topics</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <div
              key={t.topic}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 text-xs font-medium text-foreground"
            >
              <span className="text-primary font-bold">#{t.topic}</span>
              <span className="text-[10px] font-mono text-muted-foreground bg-[var(--bg-surface)] px-1.5 py-0.2 rounded border border-[var(--border-subtle)]">
                {t.count}
              </span>
            </div>
          ))}
          {topics.length === 0 && (
            <div className="text-center py-4 text-xs text-muted-foreground w-full">No topics recorded.</div>
          )}
        </div>
      </Card>
    </div>
  )
}
