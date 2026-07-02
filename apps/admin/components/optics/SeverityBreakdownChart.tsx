"use client";

import { Pie, PieChart } from "recharts";
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
import type { RaftSeverityBreakdown } from "@uwdsc/common/types";

const SEVERITY_COLORS: Record<string, string> = {
  fatal: "hsl(var(--destructive))",
  error: "hsl(25 95% 53%)",
  warning: "hsl(45 93% 47%)",
  info: "hsl(217 91% 60%)",
  debug: "hsl(var(--muted-foreground))",
};

const chartConfig = {
  count: { label: "Count" },
  fatal: { label: "Fatal", color: SEVERITY_COLORS.fatal },
  error: { label: "Error", color: SEVERITY_COLORS.error },
  warning: { label: "Warning", color: SEVERITY_COLORS.warning },
  info: { label: "Info", color: SEVERITY_COLORS.info },
  debug: { label: "Debug", color: SEVERITY_COLORS.debug },
} satisfies ChartConfig;

interface SeverityBreakdownChartProps {
  readonly data: RaftSeverityBreakdown[];
}

export function SeverityBreakdownChart({ data }: SeverityBreakdownChartProps) {
  const chartData = data.map((entry) => ({
    ...entry,
    fill: SEVERITY_COLORS[entry.severity] ?? "hsl(var(--muted))",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity distribution</CardTitle>
        <CardDescription>Share of errors by severity level</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No severity data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[240px]">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent nameKey="severity" />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="severity"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
