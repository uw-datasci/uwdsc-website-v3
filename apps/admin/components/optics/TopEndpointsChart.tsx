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
import type { RaftEndpointBreakdown } from "@uwdsc/common/types";
import { truncateText } from "./utils";

const chartConfig = {
  count: { label: "Errors", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

interface TopEndpointsChartProps {
  readonly data: RaftEndpointBreakdown[];
}

export function TopEndpointsChart({ data }: TopEndpointsChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: truncateText(item.endpoint, 40),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top endpoints</CardTitle>
        <CardDescription>Grouped by metadata.route (fallback: url)</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            No endpoint data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <BarChart data={chartData} layout="vertical" accessibilityLayer>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                width={160}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.endpoint ?? ""}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
