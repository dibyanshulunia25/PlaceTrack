"use client"

import { ExternalResource } from "@prisma/client"
import { ResourceCardClient } from "./resource-card-client"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { fetchResources } from "@/actions/discovery"
import { Search, Loader2 } from "lucide-react"

export function ResourceFeed({
  initialResources,
  initialBookmarks,
  topic,
  company
}: {
  initialResources: ExternalResource[]
  initialBookmarks: string[]
  topic?: string
  company?: string
}) {
  const [resources, setResources] = useState<ExternalResource[]>(initialResources)
  const [bookmarks, setBookmarks] = useState<string[]>(initialBookmarks)
  const [page, setPage] = useState(2) // Next page to fetch
  const [hasMore, setHasMore] = useState(initialResources.length >= 12)
  const [isLoading, setIsLoading] = useState(false)

  const { ref, inView } = useInView()

  useEffect(() => {
    // Reset state if topic or company changes
    setResources(initialResources)
    setBookmarks(initialBookmarks)
    setPage(2)
    setHasMore(initialResources.length >= 12)
  }, [topic, company, initialResources, initialBookmarks])

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore()
    }
  }, [inView])

  const loadMore = async () => {
    setIsLoading(true)
    try {
      const data = await fetchResources(page, 12, topic, company)
      setResources(prev => [...prev, ...data.resources])
      setBookmarks(prev => Array.from(new Set([...prev, ...data.userBookmarks])))
      setHasMore(data.hasMore)
      setPage(p => p + 1)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Search className="size-12 mb-4 opacity-20" />
        <p>No resources found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <ResourceCardClient 
            key={res.id} 
            resource={res} 
            isSavedInitial={bookmarks.includes(res.id)} 
          />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="py-8 flex justify-center text-muted-foreground">
          {isLoading ? (
            <Loader2 className="size-8 animate-spin text-primary" />
          ) : (
            <p className="text-sm">Scroll down to load more</p>
          )}
        </div>
      )}

      {!hasMore && resources.length > 0 && (
        <div className="py-8 text-center text-muted-foreground text-sm font-bold border-t border-white/10">
          You've reached the end of the personalized feed.
        </div>
      )}
    </div>
  )
}
