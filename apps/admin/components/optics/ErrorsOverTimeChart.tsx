"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@uwdsc/ui";
import type { RaftTimeSeriesPoint } from "@uwdsc/common/types";
import { formatRaftDate } from "./utils";

const chartConfig = {
  fatal: { label: "Fatal", color: "hsl(var(--destructive))" },
  error: { label: "Error", color: "hsl(25 95% 53%)" },
  warning: { label: "Warning", color: "hsl(45 93% 47%)" },
  info: { label: "Info", color: "hsl(217 91% 60%)" },
  debug: { label: "Debug", color: "hsl(var(--muted-foreground))" },
} satisfies ChartConfig;

interface ErrorsOverTimeChartProps {
  readonly data: RaftTimeSeriesPoint[];
}

export function ErrorsOverTimeChart({ data }: ErrorsOverTimeChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatRaftDate(point.bucket),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Errors over time</CardTitle>
        <CardDescription>Stacked by severity</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyChart message="No errors in this time range" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="fatal"
                stackId="a"
                fill="var(--color-fatal)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="error" stackId="a" fill="var(--color-error)" />
              <Bar dataKey="warning" stackId="a" fill="var(--color-warning)" />
              <Bar dataKey="info" stackId="a" fill="var(--color-info)" />
              <Bar
                dataKey="debug"
                stackId="a"
                fill="var(--color-debug)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChart({ message }: { readonly message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
