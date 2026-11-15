import { Star, ThumbsUp, Eye, Building2 } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface Experience {
  id: string
  title: string
  upvotes: number
  views: number
  role: string
  company: { name: string, logo: string | null }
}

export function HelpfulExperiences({ experiences }: { experiences: Experience[] }) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--border-subtle)]">
        <div className="size-8 rounded-lg bg-[var(--accent-copper)]/10 border border-[var(--accent-copper)]/20 flex items-center justify-center text-[var(--accent-copper)]">
          <Star className="size-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Most Helpful Reports</h2>
          <p className="text-xs text-muted-foreground">Top community vetted interview experiences</p>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {experiences.slice(0, 3).map((exp) => (
          <Link key={exp.id} href={`/dashboard/experiences/${encodeURIComponent(exp.company.name)}/${exp.id}`}>
            <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 hover:bg-[var(--bg-elevated)] transition-all group mb-3">
              <h3 className="font-bold text-xs text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-snug">
                {exp.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {exp.company.logo ? (
                    <img src={exp.company.logo} alt={exp.company.name} className="size-3.5 rounded-sm object-cover" />
                  ) : (
                    <Building2 className="size-3.5" />
                  )}
                  <span className="font-semibold text-foreground truncate max-w-[110px]">{exp.company.name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] font-semibold">
                  <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    <ThumbsUp className="size-2.5" /> {exp.upvotes}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground bg-[var(--bg-elevated)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                    <Eye className="size-2.5" /> {exp.views}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
