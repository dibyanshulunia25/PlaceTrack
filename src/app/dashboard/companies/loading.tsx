import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/dashboard/dashboard-skeletons"
import { Card } from "@/components/ui/card"

export default function CompaniesLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12 animate-page-enter">
      <PageHeaderSkeleton />

      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-full md:w-64 rounded-xl" />
        <Skeleton className="h-11 w-full md:w-48 rounded-xl" />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-2/3 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
