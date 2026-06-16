import { Skeleton } from "@/components/ui/skeleton"

export default function CompaniesLoading() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 w-full md:w-64 rounded-2xl" />
        <Skeleton className="h-14 w-full md:w-48 rounded-2xl" />
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col h-full p-6 space-y-6 border border-white/20 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-clay-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
