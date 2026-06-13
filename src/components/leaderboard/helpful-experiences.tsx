import { Star, ThumbsUp, Eye, Building2 } from "lucide-react"
import Link from "next/link"

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
    <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-clay-md p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/10 rounded-xl shadow-inner">
          <Star className="size-6 text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Most Helpful Experiences</h2>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {experiences.map((exp) => (
          <Link key={exp.id} href={`/experiences/${encodeURIComponent(exp.company.name)}/${exp.id}`}>
            <div className="p-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/10 shadow-sm hover:shadow-clay-sm transition-all group mb-4">
              <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                {exp.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {exp.company.logo ? (
                    <img src={exp.company.logo} alt={exp.company.name} className="size-4 rounded-sm" />
                  ) : (
                    <Building2 className="size-4" />
                  )}
                  <span className="font-medium truncate max-w-[100px]">{exp.company.name}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                    <ThumbsUp className="size-3" /> {exp.upvotes}
                  </span>
                  <span className="flex items-center gap-1 text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">
                    <Eye className="size-3" /> {exp.views}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12 text-muted-foreground flex-1 flex items-center justify-center">
            No experiences found.
          </div>
        )}
      </div>
    </div>
  )
}
