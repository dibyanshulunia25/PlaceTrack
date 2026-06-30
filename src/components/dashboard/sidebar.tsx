"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dashboardLinks } from './nav-links'
import { cn } from '@/lib/utils'
import { ExperienceFilters } from '@/components/experiences/experience-filters'
import Image from 'next/image'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-glass backdrop-blur-xl h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image src="/icon.png" alt="PlaceTrack Logo" width={40} height={40} className="rounded-xl shadow-clay-inset object-cover w-10 h-10" />
          <span className="font-bold text-xl tracking-tight">PlaceTrack</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col">
        <nav className="flex flex-col space-y-2">
          {dashboardLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`) && link.href !== '/dashboard'
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-clay-inset"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{link.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
