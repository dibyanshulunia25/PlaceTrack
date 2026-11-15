"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { UserButton, useAuth } from "@clerk/nextjs"
import { ArrowRight, Menu, X } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  const pathname = usePathname()
  const { userId } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Workflow", href: "/#workflow" },
    { name: "Community", href: "/#community" },
  ]

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative size-9 rounded-xl overflow-hidden border border-[var(--border-subtle)] shrink-0 shadow-2xs group-hover:border-primary/40 transition-colors">
            <Image
              src="/icon.png"
              alt="PlaceTrack Logo"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-foreground leading-tight">
              PlaceTrack
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none">
              Career Engine
            </span>
          </div>
        </Link>

        {/* Section Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-8 decoration-primary decoration-2"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Utility & Launch CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {!userId ? (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground font-semibold px-4 shadow-sm inline-flex items-center gap-1.5 transition-all"
                >
                  <span>Launch App</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-[var(--accent-primary-hover)] text-primary-foreground font-semibold px-4 shadow-sm inline-flex items-center gap-1.5 transition-all"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8 border border-[var(--border-subtle)] rounded-full",
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-4 space-y-3"
          >
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-2">
              {!userId ? (
                <>
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2">
                      <span>Launch App</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2">
                    <span>Enter Dashboard</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
