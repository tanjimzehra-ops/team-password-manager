// MAST Dashboard - Premium Design
// Matches ERIC PDF styling

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function MastDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">MAST Dashboard</h1>
          <p className="mt-1">Marine and Safety Tasmania - ERIC Performance Framework</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">Current Period</div>
              <div className="text-2xl font-bold text-gray-800">Dec 2021</div>
              <div className="text-xs text-green-600 mt-1">Active</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">Composite Index</div>
              <div className="text-2xl font-bold text-blue-600">84</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +3 from previous
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">Data Status</div>
              <div className="text-2xl font-bold text-green-600">Complete</div>
              <div className="text-xs text-gray-500 mt-1">All 287 Entry IDs</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">Risk Alerts</div>
              <div className="text-2xl font-bold text-amber-600">1</div>
              <div className="text-xs text-amber-600 mt-1">Requires attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo Card */}
        <Card className="mb-8 shadow-lg border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Demo: View Board Report
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              This is the main deliverable - replicates the ERIC PDF report with:
            </p>
            <ul className="grid grid-cols-2 gap-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" /> 5 Management Themes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" /> Bar Charts (Current/Previous/Benchmark)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" /> Line Charts (Trends)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full" /> Drill-down navigation
              </li>
            </ul>
            <Link href="/mast/reports/board">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Board Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Other Pages */}
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Other Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/mast/reports">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">All Reports</div>
                    <div className="text-sm text-gray-500">View report history</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/mast/reports/1">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">Drill-Down Demo</div>
                    <div className="text-sm text-gray-500">3-tier structure</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="opacity-60">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-500">Upload Data</div>
                  <div className="text-sm text-gray-400">Coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t">
          <p className="text-gray-500 text-sm">© 2022 - Eric - Privacy | MAST Performance Framework</p>
        </div>
      </div>
    </div>
  );
}
