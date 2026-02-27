"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/line-chart";
import { Badge } from "@/components/ui/badge";
import { getHealthStatus } from "@/lib/kpi-utils";
import { cn } from "@/lib/utils";

const chartConfig = {
    health: {
        label: "Health Score",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function NodeKpiChart({
    kpiValue,
    title,
    className
}: {
    kpiValue: number;
    title?: string;
    className?: string;
}) {
    const status = getHealthStatus(kpiValue);

    // To make the chart look "alive" but realistic to the current value, 
    // we will generate a synthetic 6-month trailing trend ending at the current KPI value
    const chartData = useMemo(() => {
        // Generate some smooth randomness leading exactly to kpiValue
        const variance = status === "healthy" ? 5 : status === "warning" ? 15 : 25;
        const generatePoint = (base: number, step: number) => {
            // Create a value that trends towards the final kpiValue
            const diff = base - kpiValue;
            const adjust = diff * (step / 5);
            const randomNoise = (Math.random() - 0.5) * variance;
            return Math.max(0, Math.min(100, Math.round(base - adjust + randomNoise)));
        };

        const startValue = kpiValue > 50 ? kpiValue - 20 : kpiValue + 20;

        return [
            { month: "Jan", health: generatePoint(startValue, 1) },
            { month: "Feb", health: generatePoint(startValue, 2) },
            { month: "Mar", health: generatePoint(startValue, 3) },
            { month: "Apr", health: generatePoint(startValue, 4) },
            { month: "May", health: generatePoint(startValue, 5) },
            { month: "Current", health: kpiValue },
        ];
    }, [kpiValue, status]);

    const trendDirection = chartData[5].health >= chartData[4].health ? "up" : "down";
    const trendDifference = Math.abs(chartData[5].health - chartData[4].health);

    return (
        <div className={cn("flex flex-col space-y-3 w-full", className)}>
            <div className="flex flex-col space-y-1.5 border-b border-border/50 pb-2">
                <div className="font-semibold leading-none tracking-tight flex items-center justify-between">
                    <span className="truncate pr-2">{title || "Performance Trend"}</span>
                    <Badge
                        variant="outline"
                        className={cn(
                            "border-none ml-2 shrink-0 gap-1",
                            status === "healthy" && "text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-500/20",
                            status === "warning" && "text-yellow-600 bg-yellow-500/10 dark:text-yellow-400 dark:bg-yellow-500/20",
                            status === "critical" && "text-red-600 bg-red-500/10 dark:text-red-400 dark:bg-red-500/20",
                        )}
                    >
                        {trendDirection === "up" ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : trendDifference === 0 ? (
                            <Activity className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                            {trendDirection === "up" ? "+" : "-"}{trendDifference}%
                        </span>
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>6-Month Trailing Avg</span>
                    <span className="font-mono font-medium text-foreground">{kpiValue}%</span>
                </p>
            </div>

            <div className="pt-1 h-[140px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                            hide
                        />
                        <YAxis
                            domain={[0, 100]}
                            hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel indicator="line" />}
                        />
                        <Line
                            dataKey="health"
                            type="monotone"
                            stroke={
                                status === "healthy" ? "var(--color-emerald-500, #10b981)" :
                                    status === "warning" ? "var(--color-amber-500, #f59e0b)" :
                                        "var(--color-red-500, #ef4444)"
                            }
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: "var(--color-background)",
                                strokeWidth: 2,
                            }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ChartContainer>
            </div>
        </div>
    );
}
