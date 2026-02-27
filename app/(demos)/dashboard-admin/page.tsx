"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck,
    Globe,
    Library,
    Users,
    Activity,
    Settings2,
    Lock,
    ChevronRight,
    Database,
    Search,
    Plus
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts"
import { ThemeToggle } from "@/components/theme-toggle"

const clientHealthData = [
    { name: "RSA Tas", health: 82, systems: 12, userCount: 45 },
    { name: "MERA Energy", health: 64, systems: 8, userCount: 22 },
    { name: "Kiraa Tech", health: 91, systems: 5, userCount: 18 },
    { name: "Central Council", health: 45, systems: 15, userCount: 30 },
    { name: "Sustainable Org", health: 76, systems: 3, userCount: 12 },
]

const systemUsageTrend = [
    { day: "Mon", active: 140 },
    { day: "Tue", active: 155 },
    { day: "Wed", active: 210 },
    { day: "Thu", active: 180 },
    { day: "Fri", active: 160 },
    { day: "Sat", active: 90 },
    { day: "Sun", active: 110 },
]

const libraryMasterItems = [
    { category: "Outcome", title: "Carbon Neutrality 2030", usage: "14 Clients" },
    { category: "Resource", title: "Cloud Infrastructure", usage: "22 Clients" },
    { category: "Value Chain", title: "Strategic Procurement", usage: "9 Clients" },
]

export default function AdminDashboardDemo() {
    return (
        <div className="min-h-screen bg-background p-6 space-y-8 max-w-7xl mx-auto transition-colors duration-500">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-30">
                <div className="absolute top-0 left-0 h-[600px] w-[600px] bg-secondary/15 blur-[140px] rounded-full -translate-y-1/2 -translate-x-1/4" />
                <div className="absolute top-1/2 right-0 h-[500px] w-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
            </div>

            <div className="relative z-10 space-y-8">
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl border shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <ShieldCheck className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">Control Tower</h1>
                            <p className="text-sm text-muted-foreground">Platform Management System v2.1</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-primary" />
                            <input
                                placeholder="Search clients..."
                                className="pl-9 h-10 w-64 rounded-lg bg-slate-50 dark:bg-slate-800 border focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-lg">
                            <Settings2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Global Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-sm border-none bg-slate-900 text-white overflow-hidden relative">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Clients</p>
                                    <h3 className="text-4xl font-bold mt-2">24</h3>
                                </div>
                                <Users className="h-10 w-10 text-slate-700 opacity-50" />
                            </div>
                            <div className="mt-6 flex items-center gap-2 relative z-10">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-none">+3 this month</Badge>
                                <span className="text-slate-500 text-xs">Growth: 12.5%</span>
                            </div>
                        </CardContent>
                        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                    </Card>

                    <Card className="shadow-sm border-none bg-indigo-900 text-white overflow-hidden relative">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Total Systems</p>
                                    <h3 className="text-4xl font-bold mt-2">156</h3>
                                </div>
                                <Globe className="h-10 w-10 text-indigo-700 opacity-50" />
                            </div>
                            <div className="mt-6 flex items-center gap-2 relative z-10">
                                <Badge className="bg-indigo-500/20 text-indigo-400 border-none">Stable</Badge>
                                <span className="text-indigo-400 text-xs">Syncing 99.9%</span>
                            </div>
                        </CardContent>
                        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                    </Card>

                    <Card className="shadow-sm border-none bg-white dark:bg-slate-900 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Library Items</p>
                                    <h3 className="text-4xl font-bold mt-2 text-slate-900 dark:text-slate-100">842</h3>
                                </div>
                                <Library className="h-10 w-10 text-slate-200 dark:text-slate-700 font-light" />
                            </div>
                            <div className="mt-6">
                                <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2">
                                    <Plus className="h-3 w-3" />
                                    Add Master Template
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Admin Central Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Client Health Management */}
                    <Card className="lg:col-span-3 shadow-sm border-slate-200 dark:border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Client Portfolio Overview</CardTitle>
                                <CardDescription>Health and usage metrics across the organization</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Online</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={clientHealthData}>
                                        <XAxis dataKey="name" fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} stroke="#888888" tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                        />
                                        <Bar dataKey="health" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                                        <Bar dataKey="systems" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar Controls */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Platform Health</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase">
                                        <span>Convex DB Load</span>
                                        <span className="text-emerald-500">Normal</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[22%] bg-emerald-500" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase">
                                        <span>API Latency</span>
                                        <span className="text-slate-500">32ms</span>
                                    </div>
                                    <div className="h-[40px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={systemUsageTrend}>
                                                <Line type="monotone" dataKey="active" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Database className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                                            <span className="text-xs font-medium">Backup Manager</span>
                                        </div>
                                        <ChevronRight className="h-3 w-3 text-slate-300" />
                                    </div>
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                                            <span className="text-xs font-medium">Permission Audit</span>
                                        </div>
                                        <ChevronRight className="h-3 w-3 text-slate-300" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-950/20">
                            <CardHeader className="pb-2 text-center">
                                <div className="mx-auto h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-2">
                                    <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <CardTitle className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Live Diagnostics</CardTitle>
                                <CardDescription className="text-[10px] text-emerald-600 dark:text-emerald-500">All environments operating within optimal parameters</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                {/* Library Master Hub Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Strategic Master Library</CardTitle>
                                <CardDescription>Global templates pushed across all systems</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">Manage Library</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-[1px] rounded-lg border overflow-hidden">
                                {libraryMasterItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Badge variant="secondary" className="text-[10px] font-bold tracking-tight uppercase px-1.5 py-0">
                                                {item.category}
                                            </Badge>
                                            <span className="font-semibold">{item.title}</span>
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium">{item.usage}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Security Events</CardTitle>
                            <CardDescription>Access logs and critical system changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                                    <p><strong>Admin Login:</strong> nicolas@... accessed from Sydney, AU (IPv4: 124.xx.xx.xx)</p>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-xs text-orange-700 dark:text-orange-400">
                                    <div className="h-2 w-2 rounded-full bg-orange-500 mt-1" />
                                    <p><strong>Config Change:</strong> Galaxy View enabled for client <em>'Relationships Australia'</em></p>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-xs text-emerald-700 dark:text-emerald-400">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1" />
                                    <p><strong>Backup Success:</strong> Full strategic snapshot captured at 02:00 AM UTC</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <ThemeToggle />
        </div>
    )
}
