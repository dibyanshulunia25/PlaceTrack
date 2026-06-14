import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyMockHubLoading() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="rounded-3xl bg-white/10 dark:bg-black/10 border border-white/20 p-8 md:p-12 shadow-clay-md">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Skeleton className="size-32 rounded-3xl shrink-0" />
          <div className="flex-1 space-y-4 w-full text-center md:text-left flex flex-col items-center md:items-start">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-12 w-48 rounded-xl mt-4" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/10 border border-white/20 shadow-clay-sm">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
