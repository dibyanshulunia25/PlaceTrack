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
        className="shadow-sm border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-xl"
      />
      <MetricCard
        title="Assessments"
        value={assessments}
        icon={MonitorPlay}
        className="shadow-sm border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-xl"
      />
      <MetricCard
        title="Interviews"
        value={interviews}
        icon={Users}
        className="shadow-sm border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-xl"
      />
      <MetricCard
        title="Offers"
        value={offers}
        icon={Award}
        highlight={offers > 0}
        className="shadow-sm border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-xl"
      />
    </div>
  )
}
