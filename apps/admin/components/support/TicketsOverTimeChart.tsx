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
import type { TicketTimeSeriesPoint } from "@uwdsc/common/types";
import { formatTicketDate } from "./utils";

const chartConfig = {
  contactForm: { label: "Contact form", color: "hsl(217 91% 60%)" },
  email: { label: "Email", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

interface TicketsOverTimeChartProps {
  readonly data: TicketTimeSeriesPoint[];
}

export function TicketsOverTimeChart({ data }: TicketsOverTimeChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatTicketDate(point.date),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets over time</CardTitle>
        <CardDescription>Last 30 days, stacked by source</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.every((point) => point.contactForm === 0 && point.email === 0) ? (
          <EmptyChart message="No tickets in the last 30 days" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="contactForm"
                stackId="a"
                fill="var(--color-contactForm)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="email" stackId="a" fill="var(--color-email)" radius={[4, 4, 0, 0]} />
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
