"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { fetchMoreResources } from "@/actions/discover-more"

export function LoadMoreButton({ category, label = "Load More" }: { category: string, label?: string }) {
  const [loading, setLoading] = useState(false)

  const handleLoadMore = async () => {
    setLoading(true)
    try {
      await fetchMoreResources(category)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-6">
      <Button 
        variant="outline" 
        onClick={handleLoadMore} 
        disabled={loading}
        className="rounded-full px-6 border-white/20 bg-white/5 hover:bg-white/10"
      >
        {loading ? (
          <><Loader2 className="size-4 mr-2 animate-spin" /> Fetching...</>
        ) : (
          <><Plus className="size-4 mr-2" /> {label}</>
        )}
      </Button>
    </div>
  )
}
