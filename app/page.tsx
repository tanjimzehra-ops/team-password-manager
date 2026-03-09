"use client";

import { Shield, Users, Lock, Search, Copy, KeyRound, FolderKey, Activity, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Team Password Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/login")}>Sign In</Button>
            <Button onClick={() => router.push("/login")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure Password Management<br />for Your Team
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enterprise-grade password management that enables your team to securely share 
            credentials while maintaining full audit control and role-based access.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Users className="h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything Your Team Needs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Add/Manage Passwords */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <KeyRound className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Password Management</h3>
              <p className="text-muted-foreground">
                Store and manage passwords for all your team's applications with military-grade encryption.
              </p>
            </div>

            {/* Feature 2: Team Shared Access */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Team Sharing</h3>
              <p className="text-muted-foreground">
                Securely share passwords with team members or groups. Control who can access what.
              </p>
            </div>

            {/* Feature 3: Categories */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <FolderKey className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Categories</h3>
              <p className="text-muted-foreground">
                Organize passwords by application type, team, or project with customizable categories.
              </p>
            </div>

            {/* Feature 4: Search */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Search className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
              <p className="text-muted-foreground">
                Find any password instantly with powerful search and filtering capabilities.
              </p>
            </div>

            {/* Feature 5: Copy to Clipboard */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Copy className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">One-Click Copy</h3>
              <p className="text-muted-foreground">
                Copy usernames and passwords to clipboard with a single click. Auto-clear after use.
              </p>
            </div>

            {/* Feature 6: Role-Based Access */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Settings className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Define roles (Admin, Editor, Viewer) with granular permissions for each team member.
              </p>
            </div>

            {/* Feature 7: Audit Logs */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Activity className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Audit Logs</h3>
              <p className="text-muted-foreground">
                Track who accessed what password and when. Complete compliance trail for enterprises.
              </p>
            </div>

            {/* Feature 8: Security */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Lock className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">
                AES-256 encryption, master password protection, and advanced security features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Secure Your Team's Passwords?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free 14-day trial. No credit card required.
          </p>
          <Button size="lg" className="gap-2">
            <Shield className="h-5 w-5" />
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Team Password Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
