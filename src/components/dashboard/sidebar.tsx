"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { dashboardLinks } from "./nav-links"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useSidebar } from "./sidebar-context"
import { PanelLeftClose, PanelLeft, ChevronRight } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-30 h-screen transition-[width] duration-200 ease-in-out border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 select-none overflow-x-hidden",
          isCollapsed ? "w-[68px]" : "w-[232px]"
        )}
        aria-label="Sidebar navigation"
      >
        {/* Brand Header (56px matching topbar) */}
        <div
          className={cn(
            "h-14 flex items-center border-b border-[var(--border-subtle)] px-3.5 shrink-0 overflow-hidden w-full",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden group/logo shrink-0"
            title="PlaceTrack Dashboard"
          >
            <div className="relative size-8 shrink-0 rounded-lg overflow-hidden border border-[var(--border-subtle)] shadow-2xs group-hover/logo:scale-105 transition-transform">
              <Image
                src="/icon.png"
                alt="PlaceTrack"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-base tracking-tight text-foreground truncate whitespace-nowrap">
                PlaceTrack
              </span>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="size-7 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] transition-colors shrink-0"
              title="Collapse sidebar (68px)"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="size-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 flex flex-col gap-1 w-full">
          <nav className="flex flex-col gap-1 w-full overflow-hidden" aria-label="Main navigation">
            {dashboardLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname.startsWith(`${link.href}/`) && link.href !== "/dashboard")
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.title}
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-150 text-sm font-medium overflow-hidden",
                    isCollapsed
                      ? "justify-center size-11 mx-auto shrink-0"
                      : "gap-3 px-3 py-2.5 w-full",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-2xs font-semibold"
                      : "text-muted-foreground hover:bg-[var(--bg-elevated)] hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-4.5 shrink-0", isActive && "text-primary")} />

                  {!isCollapsed && (
                    <span className="truncate whitespace-nowrap flex-1">{link.title}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Footer Area */}
        <div className="border-t border-[var(--border-subtle)] p-2 shrink-0 overflow-hidden w-full">
          {isCollapsed ? (
            <button
              onClick={toggleSidebar}
              className="size-11 mx-auto rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] transition-colors shrink-0"
              title="Expand sidebar (232px)"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="size-4" />
            </button>
          ) : (
            <div className="flex items-center justify-between px-2 py-1.5 text-xs text-muted-foreground w-full overflow-hidden">
              <span className="font-mono text-[11px] opacity-75 truncate">v0.2.0</span>
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors shrink-0"
              >
                <span>Collapse</span>
                <ChevronRight className="size-3 rotate-180" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Static layout spacer to reserve space in document flow so content never slides under the fixed sidebar */}
      <div
        aria-hidden="true"
        className={cn(
          "hidden md:block shrink-0 transition-[width] duration-200 ease-in-out pointer-events-none select-none",
          isCollapsed ? "w-[68px]" : "w-[232px]"
        )}
      />
    </>
  )
}
