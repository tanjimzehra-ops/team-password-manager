// MAST Reports Page - Premium Design

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import Link from 'next/link';

const reports = [
  { id: '1', name: 'December 2021', date: '31 Dec 2021', index: 84, status: 'Complete' },
  { id: '2', name: 'June 2021', date: '30 Jun 2021', index: 81, status: 'Complete' },
  { id: '3', name: 'December 2020', date: '31 Dec 2020', index: 78, status: 'Complete' },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="mt-1">View and generate ERIC reports</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Latest Report Card */}
        <Card className="mb-8 shadow-lg border-2 border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
            <h2 className="text-lg font-semibold text-blue-800">Latest Report</h2>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{reports[0].name}</h3>
                <p className="text-gray-500 mt-1">Generated: {reports[0].date}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-4xl font-bold text-blue-600">{reports[0].index}</span>
                  <span className="text-green-600 text-sm">Composite Index</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/mast/reports/board">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </Link>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Reports */}
        <h2 className="text-lg font-semibold mb-4 text-gray-700">All Reports</h2>
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{report.name}</h3>
                      <p className="text-sm text-gray-500">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{report.index}</div>
                      <div className="text-xs text-gray-500">Index</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/mast/reports/board">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t mt-8">
          <p className="text-gray-500 text-sm">© 2022 - Eric - Privacy | MAST Performance Framework</p>
        </div>
      </div>
    </div>
  );
}
