import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2", className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
    </div>
  )
}

export function BentoKPISkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-4 flex flex-col justify-between h-[104px]", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="size-4 rounded-md" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-7 w-12 rounded-md" />
        <Skeleton className="h-3 w-28 rounded-md" />
      </div>
    </Card>
  )
}

export function BentoKPIGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-3 grid-cols-2 lg:grid-cols-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <BentoKPISkeleton key={i} />
      ))}
    </div>
  )
}

export function ApplicationCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden flex flex-col h-[230px]", className)}>
      <div className="p-5 pb-3 flex justify-between items-start gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <div className="flex items-center gap-1.5 pt-0.5">
            <Skeleton className="size-3.5 rounded-sm" />
            <Skeleton className="h-3.5 w-1/3 rounded-md" />
          </div>
        </div>
        <Skeleton className="size-7 rounded-md" />
      </div>
      <div className="px-5 py-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="mt-auto px-5 pb-4 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>
    </Card>
  )
}

export function ApplicationGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ApplicationCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ExperienceCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-5 flex flex-col space-y-4", className)}>
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-5/6 rounded-md" />
        <Skeleton className="h-3.5 w-4/6 rounded-md" />
      </div>
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
        <Skeleton className="h-3 w-12 rounded-md" />
      </div>
    </Card>
  )
}

export function TimelineItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]">
      <Skeleton className="size-8 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>
    </div>
  )
}

export function UpcomingEventsSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-5 w-32 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
      </CardContent>
    </Card>
  )
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      <PageHeaderSkeleton />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Community Feed skeleton */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="p-4 flex items-center justify-between">
            <Skeleton className="h-9 w-64 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </Card>
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
          <ExperienceCardSkeleton />
        </div>

        {/* Right Column: Widgets */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="p-4 space-y-3">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </Card>
          
          <UpcomingEventsSkeleton />

          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <BentoKPIGridSkeleton count={4} />
          </div>

          <Card className="p-4 space-y-3">
            <Skeleton className="h-5 w-36 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
