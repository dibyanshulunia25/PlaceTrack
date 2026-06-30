"use client"

import { useState, Suspense } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { dashboardLinks } from "./nav-links"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ExperienceFilters } from "@/components/experiences/experience-filters"

import Image from 'next/image'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={<Button variant="ghost" size="icon" className="md:hidden mr-2" />}
      >
        <Menu className="size-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-glass backdrop-blur-xl border-r-border p-0">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
            <Image src="/icon.png" alt="PlaceTrack Logo" width={40} height={40} className="rounded-xl shadow-clay-inset object-cover w-10 h-10" />
            <span className="font-bold text-xl tracking-tight">PlaceTrack</span>
          </Link>
        </div>
        <div className="overflow-y-auto py-6 px-4 flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex flex-col space-y-2">
            {dashboardLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`) && link.href !== '/dashboard'
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  )
}
