import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyProfileLoading() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      
      {/* Header Skeleton */}
      <div className="rounded-3xl bg-white/10 dark:bg-black/10 border border-white/20 p-8 md:p-12 shadow-clay-md">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Skeleton className="size-32 rounded-3xl shrink-0" />
          <div className="flex-1 space-y-4 w-full text-center md:text-left flex flex-col items-center md:items-start">
            <Skeleton className="h-12 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col p-6 rounded-2xl bg-white/10 dark:bg-black/10 border border-white/20 shadow-clay-sm items-center text-center">
            <Skeleton className="size-12 rounded-xl mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 border border-white/20 shadow-clay-sm space-y-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 border border-white/20 shadow-clay-sm space-y-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 border border-white/20 shadow-clay-sm">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/10 border border-white/20 shadow-clay-sm">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
