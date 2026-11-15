"use client"

import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import { useSidebar } from "./sidebar-context"
import { PanelLeft, Search, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
  isLast: boolean
}

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Overview",
  applications: "Applications",
  experiences: "Experiences",
  "mock-interviews": "Prep Platform",
  resources: "Resources",
  companies: "Companies",
  leaderboard: "Leaderboard",
  new: "Create",
  practice: "Practice",
  yours: "Your Submissions",
  edit: "Edit",
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const parts = pathname.split("/").filter(Boolean)
  
  const items: BreadcrumbItem[] = [
    {
      label: "PlaceTrack",
      href: "/dashboard",
      isLast: parts.length <= 1,
    },
  ]

  let accumulatedPath = ""
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    accumulatedPath += `/${part}`

    if (part === "dashboard" && i === 0) {
      if (parts.length === 1) {
        items.push({
          label: "Overview",
          href: "/dashboard",
          isLast: true,
        })
      }
      continue
    }

    const decoded = decodeURIComponent(part)
    const isId = /^[a-z0-9]{20,}$/i.test(part) || /^\d+$/.test(part)
    const label = ROUTE_LABELS[part] || (isId ? "Details" : decoded)
    const isLast = i === parts.length - 1

    items.push({
      label,
      href: accumulatedPath,
      isLast,
    })
  }

  return items
}

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const breadcrumbs = getBreadcrumbs(pathname)
  const currentTitle = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md px-4 md:px-6 select-none">
      {/* Left Area: Toggle & Clickable Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Logo */}
        <Link href="/dashboard" className="flex md:hidden items-center gap-2 shrink-0">
          <div className="relative size-7 rounded-lg overflow-hidden border border-[var(--border-subtle)] shrink-0">
            <Image
              src="/icon.png"
              alt="PlaceTrack"
              fill
              className="object-cover"
              sizes="28px"
            />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground">
            PlaceTrack
          </span>
        </Link>

        {/* Desktop Sidebar Toggle when collapsed */}
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="hidden md:inline-flex size-8 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] transition-colors shrink-0"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="size-4" />
          </button>
        )}

        {/* Interactive Desktop Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
          {breadcrumbs.map((item, index) => {
            return (
              <div key={item.href + index} className="flex items-center gap-1.5 min-w-0">
                {index > 0 && (
                  <span className="text-muted-foreground/40 text-xs shrink-0 select-none">/</span>
                )}
                {item.isLast ? (
                  <span className="font-semibold text-foreground tracking-tight truncate max-w-[160px] lg:max-w-[240px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium truncate max-w-[140px]"
                    title={`Navigate to ${item.label}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Center Area: Weekly Prep Status Pill */}
      <div className="hidden lg:flex items-center justify-center">
        <Link
          href="/dashboard/mock-interviews"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 hover:bg-[var(--bg-elevated)] hover:border-primary/40 transition-colors shadow-2xs group"
          title="View interview prep goals"
        >
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
          </span>
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            <strong className="text-foreground font-semibold">76%</strong> of weekly prep goals completed
          </span>
          <Sparkles className="size-3 text-[var(--accent-copper)] ml-0.5" />
        </Link>
      </div>

      {/* Right Area: Search, Theme Toggle, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick Search Trigger */}
        <button
          onClick={() => router.push("/dashboard/resources")}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 rounded-lg hover:border-primary/40 hover:bg-[var(--bg-elevated)] hover:text-foreground transition-all shadow-2xs"
          title="Quick Search (Discovery Engine)"
          aria-label="Quick Search"
        >
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <span className="hidden xl:inline text-xs">Quick Search...</span>
          <kbd className="hidden md:inline font-mono text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Menu */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8 border border-[var(--border-subtle)] shadow-xs rounded-full",
            },
          }}
        />
      </div>
    </header>
  )
}
