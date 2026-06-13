import Link from 'next/link'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export default function MockHubNotFound() {
  return (
    <div className="container max-w-2xl mx-auto py-24 px-4 text-center animate-in fade-in duration-500">
      <div className="size-24 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-clay-inset">
        <FileQuestion className="size-12 text-primary" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
        Hub Not Found
      </h1>
      <p className="text-xl text-muted-foreground mb-12">
        We couldn't find the mock interview content you were looking for. It may have been removed or the company doesn't exist yet.
      </p>
      
      <Link
        href="/mock-interviews"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
      >
        <ArrowLeft className="size-5" />
        Return to Mock Hub
      </Link>
    </div>
  )
}
