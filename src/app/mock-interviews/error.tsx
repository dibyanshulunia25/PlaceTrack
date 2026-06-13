"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function MockHubError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container max-w-2xl mx-auto py-24 px-4 text-center animate-in fade-in duration-500">
      <div className="size-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-clay-inset">
        <AlertTriangle className="size-12 text-red-500" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
        Something went wrong!
      </h1>
      <p className="text-xl text-muted-foreground mb-12">
        We encountered an error while loading the Mock Interview Hub. Our team has been notified.
      </p>
      
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
      >
        <RotateCcw className="size-5" />
        Try Again
      </button>
    </div>
  )
}
