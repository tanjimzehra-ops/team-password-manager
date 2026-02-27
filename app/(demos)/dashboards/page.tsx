"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DemoHub() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 transition-colors duration-500 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_70%)] opacity-10 dark:opacity-20 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
            </div>

            <div className="max-w-4xl w-full text-center space-y-8 relative z-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl pt-12">
                        Visual <span className="text-primary italic">Prototyping</span> Center
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Experience the future of Jigsaw. These high-fidelity demos showcase the strategic vision for Clients and Administrators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
                    {/* Client Dashboard Card */}
                    <Card className="bg-card/50 border-border hover:border-primary/50 transition-all group overflow-hidden backdrop-blur-md">
                        <CardHeader className="relative">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <LayoutDashboard className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-card-foreground">Client Cockpit</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                A mission-control experience for strategic leaders. Focus on health monitoring, KPI velocity, and team momentum.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full h-12 text-lg font-bold gap-2 group-hover:bg-primary/90 transition-all">
                                <Link href="/dashboard-client">
                                    Launch Console
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </CardContent>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.07] group-hover:scale-110 transition-transform">
                            <ExternalLink className="h-24 w-24 text-foreground" />
                        </div>
                    </Card>

                    {/* Admin Dashboard Card */}
                    <Card className="bg-card/50 border-border hover:border-secondary/50 transition-all group overflow-hidden backdrop-blur-md">
                        <CardHeader className="relative">
                            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-6 w-6 text-secondary" />
                            </div>
                            <CardTitle className="text-2xl text-card-foreground">Control Tower</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                The administrative heartbeat. Manage Master Libraries, oversee global client health, and monitor platform diagnostics.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="secondary" className="w-full h-12 text-lg font-bold gap-2 group-hover:bg-secondary/90 transition-all">
                                <Link href="/dashboard-admin">
                                    Access Tower
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </CardContent>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.07] group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-24 w-24 text-foreground" />
                        </div>
                    </Card>
                </div>

                <div className="pt-12 text-muted-foreground/50 text-xs font-bold tracking-[0.2em] uppercase">
                    Jigsaw RSA • Strategic Prototyping Phase
                </div>
            </div>
            <ThemeToggle />
        </div>
    )
}
