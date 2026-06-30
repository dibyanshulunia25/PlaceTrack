import Link from "next/link"

import Image from 'next/image'

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-surface py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-8">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left flex flex-wrap items-center justify-center md:justify-start gap-1">
          Built by
          <span className="font-medium text-foreground inline-flex items-center gap-1.5">
            <Image src="/icon.png" alt="PlaceTrack Logo" width={16} height={16} className="rounded-sm" />
            PlaceTrack
          </span>
          . The ultimate placement management platform.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
