// MAST Report Detail Page - Enhanced Drill-Down
// Epic: R-HTML-01 & R-HTML-03 - Drill-Down Navigation (3 tiers)
// Replicates ERIC PDF "Drill Down Reports" section

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, BarChart3, TrendingUp, TrendingDown, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Types for drill-down
type Tier1Data = {
  overallIndex: number;
  previousIndex: number;
  movement: number;
};

type ThemeData = {
  id: string;
  name: string;
  currentIndex: number;
  previousIndex: number;
  benchmark: number;
  domains: DomainData[];
  metrics: MetricData[];
};

type DomainData = {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  benchmark: number;
  change: number;
  risks: RiskData[];
};

type MetricData = {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  benchmark: number;
  unit: string;
};

type RiskData = {
  id: string;
  title: string;
  inherentRisk: number;
  currentRisk: number;
  residualRisk: number;
  dynamicsStatus: 'new' | 'escalated' | 'de-escalated' | 'stable';
  trend: 'up' | 'down' | 'stable';
};

// Full drill-down data matching ERIC PDF
const reportData: {
  id: string;
  name: string;
  period: string;
  tier1: Tier1Data;
  themes: ThemeData[];
} = {
  id: '1',
  name: 'Dec 2021 Report',
  period: 'December 2021',
  tier1: {
    overallIndex: 83.2,
    previousIndex: 79.4,
    movement: 3.8,
  },
  themes: [
    {
      id: 'stakeholders',
      name: 'Stakeholders',
      currentIndex: 85.2,
      previousIndex: 82.1,
      benchmark: 80,
      metrics: [
        { id: 'm1', name: 'Stakeholder Numbers', value: 12500, previousValue: 11800, benchmark: 10000, unit: 'count' },
        { id: 'm2', name: 'Boat average ages', value: 12.5, previousValue: 13.2, benchmark: 14.0, unit: 'years' },
        { id: 'm3', name: 'License holder geographic dispersion', value: 92, previousValue: 88, benchmark: 85, unit: '%' },
        { id: 'm4', name: 'Schools Education Reach', value: 45, previousValue: 42, benchmark: 40, unit: 'schools' },
        { id: 'm5', name: 'Stakeholder engagement', value: 87, previousValue: 84, benchmark: 80, unit: '%' },
      ],
      domains: [
        {
          id: 'd1',
          name: 'Community Engagement',
          currentValue: 88,
          previousValue: 84,
          benchmark: 80,
          change: 4,
          risks: [
            { id: 'r1', title: 'Participation rate declining', inherentRisk: 3, currentRisk: 2, residualRisk: 1, dynamicsStatus: 'de-escalated', trend: 'down' },
          ],
        },
        {
          id: 'd2',
          name: 'Boat Registration',
          currentValue: 92,
          previousValue: 90,
          benchmark: 85,
          change: 2,
          risks: [],
        },
      ],
    },
    {
      id: 'service-delivery',
      name: 'Service Delivery',
      currentIndex: 78.5,
      previousIndex: 75.3,
      benchmark: 72,
      metrics: [
        { id: 'm6', name: 'Response time', value: 4.2, previousValue: 5.1, benchmark: 6.0, unit: 'hours' },
        { id: 'm7', name: 'Customer satisfaction', value: 89, previousValue: 86, benchmark: 82, unit: '%' },
        { id: 'm8', name: 'Service availability', value: 97, previousValue: 95, benchmark: 93, unit: '%' },
      ],
      domains: [
        {
          id: 'd3',
          name: 'Emergency Response',
          currentValue: 85,
          previousValue: 82,
          benchmark: 78,
          change: 3,
          risks: [],
        },
      ],
    },
    {
      id: 'people-culture',
      name: 'People & Culture',
      currentIndex: 71.3,
      previousIndex: 68.9,
      benchmark: 70,
      metrics: [
        { id: 'm9', name: 'Staff satisfaction', value: 72, previousValue: 70, benchmark: 75, unit: '%' },
        { id: 'm10', name: 'Training completion', value: 85, previousValue: 82, benchmark: 80, unit: '%' },
        { id: 'm11', name: 'Turnover rate', value: 8, previousValue: 10, benchmark: 12, unit: '%' },
      ],
      domains: [
        {
          id: 'd4',
          name: 'Workforce Planning',
          currentValue: 65,
          previousValue: 62,
          benchmark: 70,
          change: 3,
          risks: [
            { id: 'r2', title: 'Skills gap in technical roles', inherentRisk: 4, currentRisk: 3, residualRisk: 2, dynamicsStatus: 'escalated', trend: 'up' },
            { id: 'r3', title: 'Succession planning gaps', inherentRisk: 3, currentRisk: 3, residualRisk: 2, dynamicsStatus: 'stable', trend: 'stable' },
          ],
        },
      ],
    },
  ],
};

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/mast/reports">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{reportData.name}</h1>
          <p className="text-muted-foreground">Drill Down Reports</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Tier 1: Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{reportData.tier1.overallIndex}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">
                +{reportData.tier1.movement} from previous
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Previous Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-muted-foreground">
              {reportData.tier1.previousIndex}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Jun 2021</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {reportData.tier1.overallIndex > reportData.tier1.previousIndex ? '↑ Improving' : '↓ Declining'}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Above benchmark
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier 2 & 3: Theme and Domain Drill-Down */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Drill Down Reports - {reportData.period}
      </h2>

      {reportData.themes.map((theme) => (
        <div key={theme.id} className="mb-8">
          {/* Theme Header */}
          <div className="flex items-center gap-3 mb-4">
            <Link href="/mast/reports/board">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Board
              </Button>
            </Link>
            <h3 className="text-xl font-bold">{theme.name}</h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-semibold text-blue-600">{theme.currentIndex}</span>
          </div>

          {/* Theme Metrics */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Key Metrics - {theme.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Metric</th>
                      <th className="text-right py-3 px-4 font-medium">Current</th>
                      <th className="text-right py-3 px-4 font-medium">Previous</th>
                      <th className="text-right py-3 px-4 font-medium">Benchmark</th>
                      <th className="text-right py-3 px-4 font-medium">Change</th>
                      <th className="text-center py-3 px-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {theme.metrics.map((metric) => (
                      <tr key={metric.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{metric.name}</td>
                        <td className="text-right py-3 px-4">{metric.value} {metric.unit}</td>
                        <td className="text-right py-3 px-4 text-muted-foreground">{metric.previousValue} {metric.unit}</td>
                        <td className="text-right py-3 px-4 text-muted-foreground">{metric.benchmark} {metric.unit}</td>
                        <td className="text-right py-3 px-4">
                          <span className={metric.value > metric.previousValue ? 'text-green-600' : 'text-red-600'}>
                            {metric.value > metric.previousValue ? '+' : ''}{metric.value - metric.previousValue}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          {metric.value > metric.previousValue ? (
                            <TrendingUp className="h-4 w-4 text-green-500 inline" />
                          ) : metric.value < metric.previousValue ? (
                            <TrendingDown className="h-4 w-4 text-red-500 inline" />
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Domain Details with Risks */}
          {theme.domains.map((domain) => (
            <Card key={domain.id} className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-md">{domain.name}</CardTitle>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Current: <strong>{domain.currentValue}</strong></span>
                    <span className="text-sm">Previous: <strong>{domain.previousValue}</strong></span>
                    <span className="text-sm">Benchmark: <strong>{domain.benchmark}</strong></span>
                    <span className={`text-sm font-medium ${domain.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {domain.change >= 0 ? '+' : ''}{domain.change}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {domain.risks.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">Risk Alerts</h4>
                    {domain.risks.map((risk) => (
                      <div 
                        key={risk.id} 
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          risk.dynamicsStatus === 'escalated' ? 'border-red-300 bg-red-50' : 
                          risk.dynamicsStatus === 'de-escalated' ? 'border-green-300 bg-green-50' :
                          'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {risk.dynamicsStatus === 'escalated' && <span className="text-red-600 font-medium">⚠️ ESCALATED</span>}
                          {risk.dynamicsStatus === 'de-escalated' && <span className="text-green-600 font-medium">✓ IMPROVED</span>}
                          {risk.dynamicsStatus === 'stable' && <span className="text-gray-600 font-medium">● STABLE</span>}
                          <span className="font-medium">{risk.title}</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-center">
                            <span className="text-muted-foreground text-xs block">Inherent</span>
                            <span className="font-medium">{risk.inherentRisk}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-muted-foreground text-xs block">Current</span>
                            <span className="font-medium">{risk.currentRisk}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-muted-foreground text-xs block">Residual</span>
                            <span className="font-medium">{risk.residualRisk}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No risk alerts for this domain</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        <Link href="/mast/reports/board">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Board Report
          </Button>
        </Link>
        <Link href="/mast/reports">
          <Button variant="outline">
            All Reports
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
