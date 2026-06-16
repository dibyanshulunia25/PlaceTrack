"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, FilterX } from "lucide-react"

export function ExperienceFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams(searchParams.toString())
    
    // reset page on new search
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

  const handleClear = () => {
    router.push(pathname)
  }

  return (
    <div className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-clay-light dark:shadow-none rounded-2xl p-4">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-end gap-4">
        
        <div className="flex-1 space-y-2">
          <Label htmlFor="search" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Keywords</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="search" 
              name="search" 
              placeholder="Search..." 
              className="pl-10 h-10 text-sm bg-background/50 border-white/20 dark:border-white/10 rounded-xl" 
              defaultValue={searchParams.get("search") || ""}
            />
          </div>
        </div>

        <div className="w-full lg:w-48 space-y-2">
          <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Company</Label>
          <Input 
            id="company" 
            name="company" 
            placeholder="e.g. Google" 
            className="h-10 text-sm bg-background/50 border-white/20 dark:border-white/10 rounded-xl"
            defaultValue={searchParams.get("company") || ""}
          />
        </div>

        <div className="w-full lg:w-40 space-y-2">
          <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Role</Label>
          <Input 
            id="role" 
            name="role" 
            placeholder="e.g. SDE" 
            className="h-10 text-sm bg-background/50 border-white/20 dark:border-white/10 rounded-xl"
            defaultValue={searchParams.get("role") || ""}
          />
        </div>

        <div className="w-full lg:w-40 space-y-2">
          <Label htmlFor="difficulty" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Difficulty</Label>
          <select 
            id="difficulty" 
            name="difficulty" 
            className="flex h-10 w-full items-center justify-between rounded-xl border border-white/20 dark:border-white/10 bg-background/50 px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={searchParams.get("difficulty") || "all"}
          >
            <option value="all">All Levels</option>
            <option value="1">1 - Very Easy</option>
            <option value="2">2 - Easy</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - Hard</option>
            <option value="5">5 - Very Hard</option>
          </select>
        </div>

        <div className="w-full lg:w-28 space-y-2">
          <Label htmlFor="year" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Year</Label>
          <Input 
            id="year" 
            name="year" 
            type="number" 
            placeholder="e.g. 2024" 
            className="h-10 text-sm bg-background/50 border-white/20 dark:border-white/10 rounded-xl"
            defaultValue={searchParams.get("year") || ""}
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto mt-4 lg:mt-0">
          <Button type="submit" className="h-10 bg-primary hover:opacity-90 rounded-xl px-6 flex-1 lg:flex-none">Apply</Button>
          <Button type="button" variant="outline" className="h-10 border-border/50 rounded-xl px-4" onClick={handleClear}>
            <FilterX className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
