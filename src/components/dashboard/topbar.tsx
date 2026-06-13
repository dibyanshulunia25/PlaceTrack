"use client"

import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { dashboardLinks } from "./nav-links"

export function Topbar() {
  const pathname = usePathname()
  
  // Find current page title
  let currentTitle = "Dashboard"
  for (const link of dashboardLinks) {
    if (pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== '/dashboard')) {
      currentTitle = link.title
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8">
      <div className="flex items-center">
        <MobileNav />
        <h1 className="text-lg font-semibold tracking-tight">{currentTitle}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "size-9 border border-border shadow-clay-sm"
            }
          }}
        />
      </div>
    </header>
  )
}
