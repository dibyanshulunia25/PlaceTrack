"use client"

import { ExternalResource } from "@prisma/client"
import { ExternalLink, PlaySquare, FileText, BookOpen, Bookmark, ChevronDown, Compass } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { saveResource, unsaveResource, trackResourceView, getSimilarResources } from "@/actions/discovery"

export function ResourceCardClient({ 
  resource, 
  isSavedInitial = false 
}: { 
  resource: ExternalResource
  isSavedInitial?: boolean
}) {
  const [isSaved, setIsSaved] = useState(isSavedInitial)
  const [isSaving, setIsSaving] = useState(false)
  
  const [expanded, setExpanded] = useState(false)
  const [similarResources, setSimilarResources] = useState<ExternalResource[]>([])
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false)

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

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaving(true)
    try {
      if (isSaved) {
        await unsaveResource(resource.id)
        setIsSaved(false)
      } else {
        await saveResource(resource.id)
        setIsSaved(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleOpen = () => {
    trackResourceView(resource.id, resource.tags)
    window.open(resource.url, "_blank", "noopener,noreferrer")
  }

  const handleExpand = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!expanded && similarResources.length === 0) {
      setIsLoadingSimilar(true)
      try {
        const sim = await getSimilarResources(resource.id)
        setSimilarResources(sim)
      } finally {
        setIsLoadingSimilar(false)
      }
    }
    setExpanded(!expanded)
  }

  return (
    <motion.div 
      layout
      className="group flex flex-col h-full rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-clay-light hover:shadow-clay-md hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 flex-1 flex flex-col cursor-pointer" onClick={handleOpen}>
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${badgeColor} flex items-center gap-2 shadow-sm`}>
            <Icon className="size-4" />
            {resource.source}
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`p-2 rounded-xl transition-all duration-200 border ${
              isSaved 
                ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" 
                : "bg-white/10 text-muted-foreground border-white/20 hover:bg-white/20"
            }`}
          >
            <Bookmark className={`size-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        <h3 className="font-extrabold text-xl leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h3>
        
        {resource.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed flex-1">
            {resource.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-border/40">
          {resource.company && (
            <Link href={`/dashboard/resources?company=${encodeURIComponent(resource.company)}`} onClick={e => e.stopPropagation()} className="text-[11px] font-bold px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg shadow-sm">
              {resource.company}
            </Link>
          )}
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-white/10 dark:bg-black/20 px-2.5 py-1 rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-3 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border-t border-white/20 flex justify-between items-center">
        <button 
          onClick={handleOpen}
          className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline"
        >
          Open Resource <ExternalLink className="size-3" />
        </button>
        <button 
          onClick={handleExpand}
          className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          {expanded ? "Hide Similar" : "Show More Like This"}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown className="size-4" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/20 bg-black/5 dark:bg-white/5"
          >
            <div className="p-6">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-4 text-muted-foreground">
                <Compass className="size-4 text-primary" />
                Related Discovery
              </h4>
              {isLoadingSimilar ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-white/10 rounded-xl" />
                  <div className="h-16 bg-white/10 rounded-xl" />
                </div>
              ) : similarResources.length > 0 ? (
                <div className="space-y-3">
                  {similarResources.map(sim => (
                    <a 
                      key={sim.id}
                      href={sim.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackResourceView(sim.id, sim.tags)}
                      className="block p-3 rounded-xl bg-white/40 dark:bg-black/40 border border-white/20 hover:bg-white/60 hover:border-primary/50 transition-all shadow-sm"
                    >
                      <p className="text-sm font-bold line-clamp-1">{sim.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{sim.source}</span>
                        {sim.company && <span className="text-[10px] text-primary">· {sim.company}</span>}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No related resources found.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
