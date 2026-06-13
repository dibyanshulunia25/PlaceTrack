"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 max-w-md w-full bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-clay-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100/50 dark:bg-red-900/30 rounded-2xl shadow-inner">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full bg-primary hover:opacity-90 transition-opacity"
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="w-full bg-white/50 dark:bg-black/50 border-white/20 shadow-clay-sm"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
