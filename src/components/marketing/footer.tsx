import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-foreground">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Col 1: Brand & Identity (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative size-8 rounded-lg overflow-hidden border border-[var(--border-subtle)] shrink-0 shadow-2xs">
                <Image
                  src="/icon.png"
                  alt="PlaceTrack"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight">PlaceTrack</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The student-first career command center designed to track applications, analyze peer interview intelligence, and conquer placement season.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-600"></span>
              </span>
              <span>All systems operational · v2.4</span>
            </div>
          </div>

          {/* Col 2: Product (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#workflow" className="hover:text-foreground transition-colors">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/#community" className="hover:text-foreground transition-colors">
                  Community Proof
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Modules (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Resources & Modules
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard/resources" className="hover:text-foreground transition-colors">
                  Discovery Engine
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mock-interviews" className="hover:text-foreground transition-colors">
                  Interview Question Bank
                </Link>
              </li>
              <li>
                <Link href="/dashboard/companies" className="hover:text-foreground transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/leaderboard" className="hover:text-foreground transition-colors">
                  Campus Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & About (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About PlaceTrack
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PlaceTrack. Built for students, by students.</p>
          <p>Strictly non-commercial · Empowering collegiate careers</p>
        </div>
      </div>
    </footer>
  )
}
