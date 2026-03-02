"use client"

import React, { FC, useMemo, useState, useEffect } from 'react';
import { LayoutGrid, TrendingUp, Activity, BarChart, Clock, ListChecks } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils"
import ShaderBackground from "@/components/ui/shader-background"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

interface DashboardOverviewProps {
    systemCount: number
    orgName?: string
}

interface ActivityDataPoint {
    time: string;
    activity: number;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
    valueClassName?: string;
    glowing?: boolean;
}

const MetricCard: FC<MetricCardProps> = ({ title, value, icon, description, valueClassName, glowing = true }) => (
    <Card className="flex-1 min-w-[300px] relative transition-all duration-300 group bg-card border border-border shadow-sm hover:shadow-md py-4">
        {glowing && <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent className="relative z-10">
            <div className={cn("text-5xl font-black tracking-tight", valueClassName)}>
                {value}
            </div>
            {description && <p className="text-xs text-muted-foreground/60 mt-2 font-medium">{description}</p>}
        </CardContent>
    </Card>
);

interface RealtimeChartProps {
    data: ActivityDataPoint[];
    title: string;
    dataKey: keyof ActivityDataPoint;
    lineColor: string;
    tooltipFormatter?: (value: number) => string;
    legendName: string;
}

const RealtimeChart: FC<RealtimeChartProps> = React.memo(({ data, title, dataKey, lineColor, tooltipFormatter, legendName }) => {
    const chartKey = useMemo(() => `chart-${title}-${dataKey}`, [title, dataKey]);

    const colors = {
        grid: 'var(--border)',
        axis: 'var(--muted-foreground)',
        legend: 'var(--muted-foreground)',
        cursor: lineColor
    };

    return (
        <Card className="flex-1 min-w-[300px] w-full lg:max-w-[calc(50%-8px)] bg-card border border-border shadow-sm relative overflow-hidden group">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <CardHeader className="relative z-10 pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-bold uppercase tracking-widest text-muted-foreground">
                    <BarChart className="h-6 w-6 opacity-70" style={{ color: lineColor }} />{title}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-4">
                <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            key={chartKey}
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.6} />
                            <XAxis
                                dataKey="time"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                interval="preserveStartEnd"
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickFormatter={tooltipFormatter || ((value) => value.toString())}
                            />
                            <RechartsTooltip
                                cursor={{ stroke: colors.cursor, strokeWidth: 1 }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                                formatter={tooltipFormatter ? (value: any) => {
                                    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
                                    return [tooltipFormatter(numValue), legendName];
                                } : undefined}
                            />
                            <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))', paddingTop: '10px' }} />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={lineColor}
                                strokeWidth={2}
                                dot={false}
                                name={legendName}
                                isAnimationActive={true}
                                animationDuration={800}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
});

// Mock logic
const generateMockActivity = () => {
    const data: ActivityDataPoint[] = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
        const t = new Date(now.getTime() - i * 3600000);
        data.push({
            time: `${t.getHours().toString().padStart(2, '0')}:00`,
            activity: Math.floor(Math.random() * 50) + 10
        });
    }
    return data;
}

const generateMockCumulative = () => {
    const data: ActivityDataPoint[] = [];
    const now = new Date();
    let current = 100;
    for (let i = 20; i >= 0; i--) {
        const t = new Date(now.getTime() - i * 3600000);
        current += Math.floor(Math.random() * 5);
        data.push({
            time: `${t.getHours().toString().padStart(2, '0')}:00`,
            activity: current
        });
    }
    return data;
}

export function DashboardOverview({ systemCount, orgName }: DashboardOverviewProps) {
    const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
    const [cumulativeData, setCumulativeData] = useState<ActivityDataPoint[]>([]);

    useEffect(() => {
        setActivityData(generateMockActivity());
        setCumulativeData(generateMockCumulative());
    }, []);

    const recentUpdates = [
        { id: 1, action: "Node Updated", detail: "Quality Control in Value Chain", time: "2 mins ago" },
        { id: 2, action: "System Created", detail: "Global Expansion Strategy", time: "1 hour ago" },
        { id: 3, action: "KPI Adjusted", detail: "Revenue Growth target to 15%", time: "3 hours ago" },
        { id: 4, action: "User Joined", detail: "Sarah added to Strategy Team", time: "5 hours ago" },
        { id: 5, action: "Node Added", detail: "New Resource: Automated Testing", time: "1 day ago" },
    ];

    return (
        <div className="flex-1 p-8 md:p-16 overflow-y-auto w-full relative bg-background">
            <ShaderBackground className="opacity-30" />
            <div className="max-w-[1400px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">

                {/* Header */}
                <div className="flex flex-col items-center justify-center space-y-6 mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-center tracking-tighter text-primary drop-shadow-sm">
                        Active Strategy Tracker
                    </h1>
                    <p className="text-center text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-medium leading-relaxed">
                        Real-time insights into your strategic performance{orgName ? ` for ${orgName}` : ""}.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Systems"
                        value={systemCount}
                        icon={<Activity className="h-4 w-4 text-primary" />}
                        description="Active strategic portfolios"
                    />
                    <MetricCard
                        title="Strategic Alignment"
                        value="84%"
                        icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                        description="+2.4% from last month"
                        valueClassName="text-emerald-500"
                    />
                    <MetricCard
                        title="Active Projects"
                        value="12"
                        icon={<LayoutGrid className="h-4 w-4 text-sky-500" />}
                        description="Across all value chains"
                    />
                    <Card className="flex-1 min-w-[300px] relative transition-all duration-300 group bg-card border border-border shadow-sm py-4">
                        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Activity Status</CardTitle>
                            <Clock className="h-5 w-5 text-muted-foreground animate-pulse" />
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-5xl font-black flex items-center gap-4">
                                <span className="relative flex h-6 w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500"></span>
                                </span>
                                Live
                            </div>
                            <p className="text-xs text-muted-foreground/60 mt-2 font-medium uppercase tracking-widest">Data streaming in real-time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="flex flex-col lg:flex-row gap-4 justify-center items-stretch">
                    <RealtimeChart
                        data={activityData}
                        title="Platform Activity"
                        dataKey="activity"
                        lineColor="#3b82f6"
                        legendName="Node Updates"
                    />
                    <RealtimeChart
                        data={cumulativeData}
                        title="Cumulative Strategic Progress"
                        dataKey="activity"
                        lineColor="#10b981"
                        legendName="Overall Alignment Score"
                    />
                </div>

                {/* Latest Activity Section */}
                <Card className="relative overflow-hidden group bg-card border border-border shadow-md">
                    <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                    <CardHeader className="relative z-10 p-8">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            <ListChecks className="h-7 w-7 text-primary" /> Recent System Activity
                        </CardTitle>
                        <CardDescription className="text-base mt-2">Recently completed updates, reflecting live.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 relative z-10">
                        <ScrollArea className="h-[400px]">
                            <div className="divide-y divide-border">
                                {recentUpdates.map((update) => (
                                    <div key={update.id} className="flex items-center justify-between p-8 hover:bg-muted/30 transition-all duration-200">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-2xl text-foreground tracking-tight">{update.action}</span>
                                            <span className="text-sm text-muted-foreground font-medium">{update.detail}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <Badge variant="outline" className="text-xs px-3 py-1 font-bold text-muted-foreground bg-muted/20 border-muted-foreground/20">
                                                {update.time}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
