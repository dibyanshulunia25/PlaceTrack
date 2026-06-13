import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"

export default function RateLimitPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Liquid Glass Card */}
      <div className="w-full max-w-md bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden text-center p-8">
        <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Whoa there, slow down!
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          We've detected an unusually high number of requests coming from your network. To protect our platform from abuse, we've temporarily paused your access. 
          <br /><br />
          Please wait a minute before trying again.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
