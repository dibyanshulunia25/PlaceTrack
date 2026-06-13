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
    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-clay-light dark:shadow-none rounded-2xl p-6 sticky top-20">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        Filters
      </h3>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Keywords</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="search" 
              name="search" 
              placeholder="Search..." 
              className="pl-9 bg-background/50 border-white/20 dark:border-white/10" 
              defaultValue={searchParams.get("search") || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            name="company" 
            placeholder="e.g. Google" 
            className="bg-background/50 border-white/20 dark:border-white/10"
            defaultValue={searchParams.get("company") || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input 
            id="role" 
            name="role" 
            placeholder="e.g. SDE" 
            className="bg-background/50 border-white/20 dark:border-white/10"
            defaultValue={searchParams.get("role") || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select 
            id="difficulty" 
            name="difficulty" 
            className="flex h-10 w-full items-center justify-between rounded-md border border-white/20 dark:border-white/10 bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year" 
            name="year" 
            type="number" 
            placeholder="e.g. 2024" 
            className="bg-background/50 border-white/20 dark:border-white/10"
            defaultValue={searchParams.get("year") || ""}
          />
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <Button type="submit" className="w-full bg-primary hover:opacity-90">Apply Filters</Button>
          <Button type="button" variant="outline" className="w-full border-border/50" onClick={handleClear}>
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </form>
    </div>
  )
}
