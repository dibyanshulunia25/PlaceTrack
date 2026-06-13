"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { fetchFeedExperiences } from "@/actions/feed"
import { PublicExperienceCard } from "@/components/experiences/public-experience-card"
import { Loader2 } from "lucide-react"

export function CommunityFeed({ initialExperiences }: { initialExperiences: any[] }) {
  const [experiences, setExperiences] = useState(initialExperiences)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialExperiences.length === 10)
  const [sort, setSort] = useState("recent") // recent, helpful, trending
  
  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  // Reset when sort changes
  useEffect(() => {
    setLoading(true)
    fetchFeedExperiences({ page: 1, sort }).then(data => {
      setExperiences(data)
      setPage(1)
      setHasMore(data.length === 10)
      setLoading(false)
    })
  }, [sort])

  // Fetch more when page changes
  useEffect(() => {
    if (page === 1) return
    setLoading(true)
    fetchFeedExperiences({ page, sort }).then(data => {
      setExperiences(prev => [...prev, ...data])
      setHasMore(data.length === 10)
      setLoading(false)
    })
  }, [page])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6 bg-white/40 dark:bg-white/5 p-1 rounded-lg backdrop-blur-xl border border-border/50 shadow-clay-inset w-fit">
        <button 
          onClick={() => setSort('recent')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${sort === 'recent' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          🆕 Most Recent
        </button>
        <button 
          onClick={() => setSort('trending')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${sort === 'trending' ? 'bg-orange-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          🔥 Trending
        </button>
        <button 
          onClick={() => setSort('helpful')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${sort === 'helpful' ? 'bg-blue-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          🏆 Most Helpful
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {experiences.map((exp, i) => (
          <div key={`${exp.id}-${i}`} ref={i === experiences.length - 1 ? lastElementRef : null}>
            <PublicExperienceCard experience={exp} index={i} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="size-8 animate-spin text-primary/50" />
        </div>
      )}

      {!hasMore && experiences.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm font-medium">
          You've caught up with the latest experiences!
        </div>
      )}
    </div>
  )
}
