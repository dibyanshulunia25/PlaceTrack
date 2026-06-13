import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background/50">
      <div className="p-8 max-w-md w-full bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-clay-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-2xl shadow-inner">
            <Compass className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2">404</h2>
        <h3 className="text-xl font-semibold mb-4">Page Not Found</h3>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/dashboard"
            className={buttonVariants({ className: "w-full bg-primary hover:opacity-90 transition-opacity" })}
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/"
            className={buttonVariants({ variant: "outline", className: "w-full bg-white/50 dark:bg-black/50 border-white/20 shadow-clay-sm" })}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
