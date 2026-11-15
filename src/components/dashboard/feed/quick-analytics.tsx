import { MetricCard } from '@/components/dashboard/metric-card'
import { FileText, MonitorPlay, Users, Award } from 'lucide-react'

export function QuickAnalytics({
  applications,
  assessments,
  interviews,
  offers
}: {
  applications: number
  assessments: number
  interviews: number
  offers: number
}) {
  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-2">
      <MetricCard
        title="Applications"
        value={applications}
        icon={FileText}
      />
      <MetricCard
        title="Assessments"
        value={assessments}
        icon={MonitorPlay}
      />
      <MetricCard
        title="Interviews"
        value={interviews}
        icon={Users}
      />
      <MetricCard
        title="Offers"
        value={offers}
        icon={Award}
        highlight={offers > 0}
      />
    </div>
  )
}
