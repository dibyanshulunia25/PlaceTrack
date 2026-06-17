"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function ExperiencesNavigation() {
  const pathname = usePathname()

  const tabs = [
    {
      name: "Experience Hub",
      href: "/dashboard/experiences",
      active: pathname === "/dashboard/experiences",
    },
    {
      name: "Your Experiences",
      href: "/dashboard/experiences/yours",
      active: pathname === "/dashboard/experiences/yours",
    },
  ]

  return (
    <div className="flex space-x-1 border-b border-white/10 mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={cn(
            "px-6 py-3 text-sm font-semibold transition-all relative rounded-t-lg",
            tab.active 
              ? "text-primary bg-primary/5" 
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          {tab.name}
          {tab.active && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />
          )}
        </Link>
      ))}
    </div>
  )
}
