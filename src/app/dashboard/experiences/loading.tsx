import { Skeleton } from "@/components/ui/skeleton"

export default function FeedLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* Sidebar Skeleton */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="p-6 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-clay-md space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 space-y-6">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col p-6 space-y-4 border border-white/20 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-clay-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="size-10 rounded-full" />
              </div>
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
