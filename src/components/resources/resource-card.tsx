import { ExternalResource } from "@prisma/client"
import { ExternalLink, PlaySquare, FileText, BookOpen } from "lucide-react"
import Link from "next/link"

export function ResourceCard({ resource }: { resource: ExternalResource }) {
  // Determine icon and color based on source
  let Icon = BookOpen
  let badgeColor = "bg-primary/10 text-primary border-primary/20"

  const src = resource.source.toLowerCase()
  if (src.includes("youtube") || src.includes("video")) {
    Icon = PlaySquare
    badgeColor = "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
  } else if (src.includes("medium") || src.includes("article") || src.includes("blog")) {
    Icon = FileText
    badgeColor = "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400"
  } else if (src.includes("github")) {
    badgeColor = "bg-foreground/10 text-foreground border-foreground/20"
  }

  return (
    <div className="group flex flex-col h-full p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-clay-light dark:shadow-none hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeColor} flex items-center gap-1.5`}>
          <Icon className="size-3" />
          {resource.source}
        </div>
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="size-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
        </a>
      </div>

      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        <h3 className="font-bold text-lg leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h3>
      </a>
      
      {resource.summary && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {resource.summary}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-border/40">
        {resource.company && (
          <Link href={`/resources/${encodeURIComponent(resource.company)}`} className="text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors rounded-md">
            {resource.company}
          </Link>
        )}
        {resource.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
