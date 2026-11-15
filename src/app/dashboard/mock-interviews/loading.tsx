import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/dashboard-skeletons"
import { Card } from "@/components/ui/card"

export default function MockHubLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 animate-page-enter">
      <PageHeaderSkeleton />

      {/* Recommendations Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 h-56 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl" />
            </Card>
          ))}
        </div>
      </div>

      {/* Company Banks Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-1/3 rounded-md" />
                  <Skeleton className="h-3.5 w-1/2 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
