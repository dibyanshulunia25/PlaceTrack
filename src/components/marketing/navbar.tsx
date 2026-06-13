"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { UserButton, useAuth } from "@clerk/nextjs"

export function Navbar() {
  const pathname = usePathname()
  const { userId } = useAuth()

  const links = [
    { name: "Home", href: "/" },
    { name: "Experiences", href: "/experiences" },
    { name: "Mock Interviews", href: "/mock-interviews" },
    { name: "Companies", href: "/companies" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Resources", href: "/resources" },
    { name: "About", href: "/about" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.8 }}
      className="sticky top-0 z-50 w-full border-none bg-glass backdrop-blur-xl shadow-clay"
    >
      <div className="container flex h-16 items-center mx-auto px-4 md:px-8">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="size-8 rounded-xl bg-primary shadow-clay-inset flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl leading-none">P</span>
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
              PlaceTrack
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Nav could go here */}
        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <div className="size-8 rounded-xl bg-primary shadow-clay-inset flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl leading-none">P</span>
          </div>
          <span className="font-bold inline-block text-xl tracking-tight">
            PlaceTrack
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          <nav className="flex items-center space-x-2">
            {!userId && (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="hidden sm:flex">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            {userId && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="hidden sm:flex mr-2">
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
