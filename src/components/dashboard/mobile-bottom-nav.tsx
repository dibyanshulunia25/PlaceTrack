"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BrainCircuit,
  MoreHorizontal,
  Building2,
  Trophy,
  Compass,
  X,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function MobileBottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Apps",
      href: "/dashboard/applications",
      icon: FileText,
      isActive: pathname.startsWith("/dashboard/applications"),
    },
    {
      title: "Experiences",
      href: "/dashboard/experiences",
      icon: Briefcase,
      isActive: pathname.startsWith("/dashboard/experiences"),
    },
    {
      title: "Prep",
      href: "/dashboard/mock-interviews",
      icon: BrainCircuit,
      isActive: pathname.startsWith("/dashboard/mock-interviews"),
    },
  ]

  const moreDestinations = [
    {
      title: "Companies Directory",
      description: "Explore hiring records & compensation",
      href: "/dashboard/companies",
      icon: Building2,
      isActive: pathname.startsWith("/dashboard/companies"),
    },
    {
      title: "Discovery Engine",
      description: "Curated learning videos & articles",
      href: "/dashboard/resources",
      icon: Compass,
      isActive: pathname.startsWith("/dashboard/resources"),
    },
    {
      title: "Community Leaderboard",
      description: "Top contributors & active members",
      href: "/dashboard/leaderboard",
      icon: Trophy,
      isActive: pathname.startsWith("/dashboard/leaderboard"),
    },
  ]

  const isMoreActive = moreDestinations.some((d) => d.isActive)

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-50 h-16 md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] px-1 select-none shadow-lg"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 h-full text-[11px] font-medium transition-colors relative",
                  item.isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-5", item.isActive && "text-primary")} />
                <span className="truncate max-w-[60px]">{item.title}</span>
                {item.isActive && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}

          {/* 5th destination: More Drawer Trigger */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 h-full text-[11px] font-medium transition-colors relative",
              isMoreActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="More destinations"
          >
            <MoreHorizontal className={cn("size-5", isMoreActive && "text-primary")} />
            <span>More</span>
            {isMoreActive && (
              <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Slide-Up Drawer for More Destinations */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 max-h-[80vh] overflow-y-auto"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="text-base font-bold text-foreground">
              More Destinations
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-2">
            {moreDestinations.map((dest) => {
              const Icon = dest.icon
              return (
                <Link
                  key={dest.href}
                  href={dest.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-2xl border transition-all",
                    dest.isActive
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-[var(--bg-elevated)]/60 border-[var(--border-subtle)] text-foreground hover:bg-[var(--bg-elevated)]"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-background flex items-center justify-center border border-[var(--border-subtle)] shrink-0">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-sm leading-tight truncate">
                        {dest.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {dest.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0 ml-2" />
                </Link>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
