import { PageHeaderSkeleton, ApplicationGridSkeleton } from "@/components/dashboard/dashboard-skeletons"

export default function ApplicationsLoading() {
  return (
    <div className="flex flex-col space-y-6 pb-12 animate-page-enter">
      <PageHeaderSkeleton />
      <ApplicationGridSkeleton count={8} />
    </div>
  )
}
