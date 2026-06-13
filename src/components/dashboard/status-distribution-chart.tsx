"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function StatusDistributionChart({ data }: { data: { status: string, count: number, fill: string }[] }) {
  const chartConfig = {
    count: { label: "Count" },
    Applied: { label: "Applied", color: "hsl(var(--primary))" },
    Assessment: { label: "Assessment", color: "#a855f7" }, // Purple
    Interview: { label: "Interview", color: "#eab308" }, // Yellow
    Offer: { label: "Offer", color: "#22c55e" }, // Green
    Rejected: { label: "Rejected", color: "hsl(var(--destructive))" },
  } satisfies ChartConfig

  return (
    <Card className="bg-white dark:bg-white/5 backdrop-blur-xl border-border/80 dark:border-white/10 shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-all h-full">
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>Current state of all applications</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="status" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={85} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
