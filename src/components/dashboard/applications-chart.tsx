"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ApplicationsChart({ data }: { data: { date: string, applications: number }[] }) {
  return (
    <Card className="bg-white dark:bg-white/5 backdrop-blur-xl border-border/80 dark:border-white/10 shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-all h-full">
      <CardHeader>
        <CardTitle>Application Trend</CardTitle>
        <CardDescription>Your activity over time</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-applications)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-applications)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tickMargin={10} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="var(--color-applications)"
              fillOpacity={1}
              fill="url(#fillApps)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
