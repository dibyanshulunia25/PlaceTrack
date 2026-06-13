"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, FilterX } from "lucide-react"

export function ResourceFilters({ companies }: { companies: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTopic = searchParams.get('topic') || ''
  const currentCompany = searchParams.get('company') || ''

  const topics = ["DSA", "System Design", "OS", "DBMS", "OOP", "Aptitude"]

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    
    router.push(`/resources?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(`/resources`)
  }

  const hasFilters = currentTopic || currentCompany

  return (
    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-clay-light dark:shadow-none mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
        
        <div className="w-full md:w-1/3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
            Filter by Topic
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <select 
              value={currentTopic}
              onChange={(e) => updateFilter('topic', e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/50 dark:bg-black/20 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              <option value="">All Topics</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {companies.length > 0 && (
          <div className="w-full md:w-1/3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Filter by Company
            </label>
            <select 
              value={currentCompany}
              onChange={(e) => updateFilter('company', e.target.value)}
              className="w-full h-10 px-4 rounded-xl bg-white/50 dark:bg-black/20 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              <option value="">All Companies</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 h-10 px-4 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <FilterX className="size-4" />
            Clear
          </button>
        )}
      </div>
      
      {/* Quick Topic Chips */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
        {topics.map(t => (
          <button
            key={t}
            onClick={() => updateFilter('topic', currentTopic === t ? '' : t)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${currentTopic === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-transparent hover:border-border/50'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
