"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, FilterX, Flame, Clock, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ExperienceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get("sort") || "recent"

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams(searchParams.toString())
    
    params.set("page", "1")

    const search = formData.get("search") as string
    const company = formData.get("company") as string
    const role = formData.get("role") as string
    const difficulty = formData.get("difficulty") as string
    const year = formData.get("year") as string

    if (search) params.set("search", search); else params.delete("search")
    if (company) params.set("company", company); else params.delete("company")
    if (role) params.set("role", role); else params.delete("role")
    if (difficulty && difficulty !== "all") params.set("difficulty", difficulty); else params.delete("difficulty")
    if (year) params.set("year", year); else params.delete("year")

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1")
    if (newSort === "recent") {
      params.delete("sort")
    } else {
      params.set("sort", newSort)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    router.push(pathname)
  }

  return (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-elevation-card)] rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Top Strip: Segmented Sort Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <button
            onClick={() => handleSortChange("recent")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all",
              currentSort === "recent"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="size-3" />
            <span>Most Recent</span>
          </button>
          <button
            onClick={() => handleSortChange("trending")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all",
              currentSort === "trending"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Flame className="size-3 text-[var(--accent-copper)]" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => handleSortChange("helpful")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all",
              currentSort === "helpful"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ThumbsUp className="size-3" />
            <span>Most Helpful</span>
          </button>
        </div>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
        >
          <FilterX className="size-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Main Search & Filter Form */}
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-0.5">
            Keywords
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              id="search" 
              name="search" 
              placeholder="Search by topic, question, or technology..." 
              className="pl-9 h-9 text-xs bg-[var(--bg-canvas)] border-[var(--border-subtle)] rounded-xl" 
              defaultValue={searchParams.get("search") || ""}
            />
          </div>
        </div>

        <div className="w-full lg:w-44 space-y-1.5">
          <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-0.5">
            Company
          </Label>
          <Input 
            id="company" 
            name="company" 
            placeholder="e.g. Google, Stripe" 
            className="h-9 text-xs bg-[var(--bg-canvas)] border-[var(--border-subtle)] rounded-xl" 
            defaultValue={searchParams.get("company") || ""}
          />
        </div>

        <div className="w-full lg:w-40 space-y-1.5">
          <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-0.5">
            Role
          </Label>
          <Input 
            id="role" 
            name="role" 
            placeholder="e.g. SDE, Analyst" 
            className="h-9 text-xs bg-[var(--bg-canvas)] border-[var(--border-subtle)] rounded-xl" 
            defaultValue={searchParams.get("role") || ""}
          />
        </div>

        <div className="w-full lg:w-32 space-y-1.5">
          <Label htmlFor="difficulty" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-0.5">
            Difficulty
          </Label>
          <select 
            id="difficulty" 
            name="difficulty" 
            defaultValue={searchParams.get("difficulty") || "all"}
            className="w-full h-9 px-3 text-xs bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Any</option>
            <option value="1">1 - Easy</option>
            <option value="2">2 - Medium</option>
            <option value="3">3 - Hard</option>
            <option value="4">4 - Very Hard</option>
            <option value="5">5 - Extreme</option>
          </select>
        </div>

        <Button type="submit" size="sm" className="h-9 px-4 text-xs font-bold bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground shadow-2xs">
          Filter
        </Button>
      </form>
    </div>
  )
}
