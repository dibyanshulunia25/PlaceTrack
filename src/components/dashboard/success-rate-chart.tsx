"use client"

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export function SuccessRateChart({ rate }: { rate: number }) {
  const chartConfig = {
    rate: {
      label: "Success Rate",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  const data = [{ name: "Success Rate", value: rate, fill: "var(--color-rate)" }]

  return (
    <Card className="bg-white dark:bg-white/5 backdrop-blur-xl border-border/80 dark:border-white/10 shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none transition-all h-full flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Success Rate</CardTitle>
        <CardDescription>Offers vs Total</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-[200px] w-full aspect-square">
          <RadialBarChart 
            data={data} 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={15} 
            startAngle={90} 
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar 
              background={{ fill: "hsl(var(--secondary))" }}
              dataKey="value"
              cornerRadius={10}
            />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-bold">
              {rate}%
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
