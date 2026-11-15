"use client"

import * as React from "react"
import { Application, Company } from "@prisma/client"
import { LayoutList, LayoutGrid, Search, Plus, FileText } from "lucide-react"
import { GroupedApplicationList } from "./grouped-application-list"
import { ApplicationCard } from "./application-card"
import { ApplicationInspector } from "./application-inspector"
import { NewApplicationButton } from "./new-application-button"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

type ApplicationWithCompany = Application & { company: Company }

interface ApplicationsViewProps {
  initialApplications: ApplicationWithCompany[]
}

export function ApplicationsView({ initialApplications }: ApplicationsViewProps) {
  const [viewMode, setViewMode] = React.useState<"list" | "board">("list")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedApp, setSelectedApp] = React.useState<ApplicationWithCompany | null>(null)
  const [inspectorOpen, setInspectorOpen] = React.useState(false)

  // Filter applications by search query
  const filteredApps = React.useMemo(() => {
    if (!searchQuery.trim()) return initialApplications
    const q = searchQuery.toLowerCase()
    return initialApplications.filter(
      (app) =>
        app.company.name.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        (app.location && app.location.toLowerCase().includes(q))
    )
  }, [initialApplications, searchQuery])

  const handleSelectApp = (app: ApplicationWithCompany) => {
    setSelectedApp(app)
    setInspectorOpen(true)
  }

  // Keep selected app synced if initialApplications updates
  React.useEffect(() => {
    if (selectedApp) {
      const updated = initialApplications.find((a) => a.id === selectedApp.id)
      if (updated) setSelectedApp(updated)
    }
  }, [initialApplications])

  return (
    <div className="space-y-6">
      {/* Control Bar: Search Filter & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by company, role, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>

        {/* View Switcher: Grouped List | Board */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Grouped stage list"
          >
            <LayoutList className="size-3.5" />
            <span>Grouped List</span>
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              viewMode === "board"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Board grid view"
          >
            <LayoutGrid className="size-3.5" />
            <span>Board Grid</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={searchQuery ? "No matching applications" : "No applications tracked yet"}
          description={
            searchQuery
              ? `No results found for "${searchQuery}". Try a different keyword.`
              : "You haven't tracked any applications yet. Click the button above to add your first one!"
          }
          action={<NewApplicationButton />}
        />
      ) : viewMode === "list" ? (
        <GroupedApplicationList
          applications={filteredApps}
          onSelectApplication={handleSelectApp}
          selectedId={inspectorOpen ? selectedApp?.id : null}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredApps.map((app) => (
            <div key={app.id} onClick={() => handleSelectApp(app)} className="cursor-pointer">
              <ApplicationCard application={app} />
            </div>
          ))}
        </div>
      )}

      {/* Right Contextual Inspector Drawer */}
      <ApplicationInspector
        application={selectedApp}
        open={inspectorOpen}
        onOpenChange={setInspectorOpen}
      />
    </div>
  )
}
