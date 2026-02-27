"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    BarChart3,
    Target,
    Users,
    Zap,
    ArrowUpRight,
    AlertTriangle,
    CheckCircle2,
    Clock,
    BookOpen,
    LayoutDashboard
} from "lucide-react"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    AreaChart,
    Area
} from "recharts"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock Data for the Demo
const healthData = [
    { name: "Healthy", value: 65, color: "#10b981" },
    { name: "Warning", value: 25, color: "#f59e0b" },
    { name: "Critical", value: 10, color: "#ef4444" },
]

const performanceTrend = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 52 },
    { month: "Mar", value: 48 },
    { month: "Apr", value: 61 },
    { month: "May", value: 55 },
    { month: "Jun", value: 67 },
    { month: "Jul", value: 72 },
]

const recentActivity = [
    { user: "Sarah Jenkins", action: "Updated Resource", target: "Engineering Cluster", time: "2h ago", avatar: "SJ" },
    { user: "Mark Thompson", action: "Achieved KPI", target: "Market Growth 2026", time: "5h ago", avatar: "MT" },
    { user: "Alex Rivera", action: "Added Node", target: "Sustainable Energy Plan", time: "1d ago", avatar: "AR" },
]

const strategicQueue = [
    { title: "Solar Infrastructure", issue: "KPI data missing", risk: "Medium", status: "Incomplete" },
    { title: "Talent Retention", issue: "Target not met", risk: "High", status: "Critical" },
    { title: "Q3 Expansion", issue: "Budget review due", risk: "Low", status: "Pending" },
]

export default function ClientDashboardDemo() {
    return (
        <div className="min-h-screen bg-background p-6 space-y-8 max-w-7xl mx-auto transition-colors duration-500">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-secondary/10 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4" />
            </div>

            <div className="relative z-10 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Strategic Cockpit</h1>
                        <p className="text-muted-foreground mt-1">Portfolio: Relationships Australia (RSA) - Q3 2026</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            Library Suggestions
                        </Button>
                        <Button className="gap-2 bg-primary text-primary-foreground hover:opacity-90">
                            <LayoutDashboard className="h-4 w-4" />
                            Control Center
                        </Button>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-emerald-500 shadow-sm overflow-hidden relative">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Health</p>
                                    <h3 className="text-2xl font-bold mt-1">82%</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +5.2% from last month
                            </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500/10" />
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 shadow-sm overflow-hidden relative">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Systems</p>
                                    <h3 className="text-2xl font-bold mt-1">12</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <Target className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-muted-foreground">
                                3 systems require attention
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-indigo-500 shadow-sm overflow-hidden relative">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Team Efficiency</p>
                                    <h3 className="text-2xl font-bold mt-1">94%</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-indigo-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-indigo-600 font-medium">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                Optimal collaboration
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-violet-500 shadow-sm overflow-hidden relative">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ROI Realized</p>
                                    <h3 className="text-2xl font-bold mt-1">$2.4M</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-violet-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                Target exceeded
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-lg">Performance Velocity</CardTitle>
                                    <CardDescription>Aggregate KPI tracking across all active models</CardDescription>
                                </div>
                                <BarChart3 className="h-4 w-4 text-muted-foreground font-light" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceTrend}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="month"
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `${value}%`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                                itemStyle={{ color: 'hsl(var(--primary))' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="hsl(var(--primary))"
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                                strokeWidth={3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Strategy Composition</CardTitle>
                                    <CardDescription>Health distribution of nodes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[200px] w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={healthData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {healthData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex flex-col gap-2 ml-4">
                                            {healthData.map((item) => (
                                                <div key={item.name} className="flex items-center gap-2 text-xs">
                                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-muted-foreground">{item.name}:</span>
                                                    <span className="font-bold">{item.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Resource Allocation</CardTitle>
                                    <CardDescription>Shared vs Dedicated items</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium uppercase">Engineering Resources</span>
                                                <span className="font-bold">78%</span>
                                            </div>
                                            <Progress value={78} className="h-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium uppercase">Sustainable Ops</span>
                                                <span className="font-bold">42%</span>
                                            </div>
                                            <Progress value={42} className="h-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium uppercase">Digital Infrastructure</span>
                                                <span className="font-bold">91%</span>
                                            </div>
                                            <Progress value={91} className="h-2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Feeds */}
                    <div className="space-y-6">
                        {/* Strategic Queue */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Strategic Queue
                                </CardTitle>
                                <CardDescription>Critical tasks needing priority attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {strategicQueue.map((item, idx) => (
                                        <div key={idx} className="flex flex-col p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-all">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-semibold">{item.title}</h4>
                                                <Badge variant={item.risk === "High" ? "destructive" : "outline"} className="text-[10px] py-0 h-4">
                                                    {item.risk} Risk
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">{item.issue}</p>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <div className={`h-1.5 w-1.5 rounded-full ${item.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                <span className="text-[10px] font-medium uppercase tracking-tight text-muted-foreground">{item.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-4 text-xs h-8 text-muted-foreground hover:text-primary">
                                    View All Priority Tasks
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Activity Feed */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-indigo-500" />
                                    Live Collaboration
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5">
                                    {recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                                {activity.avatar}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-medium">{activity.user}</span>
                                                    <span className="text-[10px] text-muted-foreground">• {activity.time}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-snug">
                                                    {activity.action} on <span className="font-semibold text-foreground/80">{activity.target}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <ThemeToggle />
        </div>
    )
}
