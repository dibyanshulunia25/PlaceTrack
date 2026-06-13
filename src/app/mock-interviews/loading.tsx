import { Skeleton } from "@/components/ui/skeleton"

export default function MockHubLoading() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <Skeleton className="size-20 rounded-full mb-2" />
        <Skeleton className="h-12 w-64 md:w-96" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>

      {/* Recommendations Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-3xl" />
          ))}
        </div>
      </div>

      {/* Company Banks Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-3xl" />
          ))}
        </div>
      </div>

    </div>
  )
}
