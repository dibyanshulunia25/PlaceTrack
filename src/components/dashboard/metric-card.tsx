import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  className?: string
  highlight?: boolean
}

export function MetricCard({ title, value, icon: Icon, description, className, highlight }: MetricCardProps) {
  return (
    <Card className={cn("bg-white dark:bg-white/5 backdrop-blur-xl border-border/80 dark:border-white/10 shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-all", highlight && "border-primary/50 shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={cn("size-4", highlight ? "text-primary" : "text-muted-foreground")} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", highlight && "text-primary")}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
