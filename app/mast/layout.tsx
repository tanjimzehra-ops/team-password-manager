// MAST Application Layout
// Epic: R-HTML-01 - Report Infrastructure

import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Users, 
  Settings,
  BarChart3,
  Shield,
  ClipboardList
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/mast', icon: LayoutDashboard },
  { name: 'Reports', href: '/mast/reports', icon: FileText },
  { name: 'Board Report', href: '/mast/reports/board', icon: BarChart3 },
  { name: 'Upload Data', href: '/mast/upload', icon: Upload },
  { name: 'Risks', href: '/mast/risks', icon: Shield },
  { name: 'Users', href: '/mast/users', icon: Users },
  { name: 'Settings', href: '/mast/settings', icon: Settings },
];

export default function MastLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h2 className="text-xl font-bold">MAST</h2>
          <p className="text-sm text-muted-foreground">ERIC Reporting</p>
        </div>
        <nav className="px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
