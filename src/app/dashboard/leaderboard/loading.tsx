import { Skeleton } from "@/components/ui/skeleton"

export default function LeaderboardLoading() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Skeleton */}
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-96" />
        <Skeleton className="h-10 w-64 rounded-xl mt-6" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Column Skeleton */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6">
            <Skeleton className="h-8 w-64 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10">
                  <Skeleton className="size-8 rounded-md" />
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-8">
          <div className="bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="bg-white/10 dark:bg-black/10 border border-white/20 rounded-3xl p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
