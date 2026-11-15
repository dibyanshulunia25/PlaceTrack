import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton, ExperienceCardSkeleton } from "@/components/dashboard/dashboard-skeletons"
import { Card } from "@/components/ui/card"

export default function FeedLoading() {
  return (
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      <PageHeaderSkeleton />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar Skeleton */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Card className="p-5 space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          </Card>
        </aside>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ExperienceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
