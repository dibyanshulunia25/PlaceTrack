import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/dashboard-skeletons"
import { Card } from "@/components/ui/card"

export default function LeaderboardLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 animate-page-enter">
      <PageHeaderSkeleton />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-6 rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40">
                  <Skeleton className="size-7 rounded-md" />
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4 rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
