"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@uwdsc/ui";
import type { RaftAppBreakdown } from "@uwdsc/common/types";

const chartConfig = {
  count: { label: "Errors", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

interface ErrorsByAppChartProps {
  readonly data: RaftAppBreakdown[];
}

export function ErrorsByAppChart({ data }: ErrorsByAppChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Errors by app</CardTitle>
        <CardDescription>Grouped by RAFT_APP_NAME</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No app data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
            <BarChart data={data} layout="vertical" accessibilityLayer>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="app_name"
                width={100}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
