// MAST Drill Down Pages - Dynamic Theme-Based Reports
// Each theme shows unique domains and risks based on ERIC PDF structure

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

// Theme-specific data for drill-down
const themeData: Record<string, {
  name: string;
  description: string;
  currentIndex: number;
  previousIndex: number;
  benchmark: number;
  domains: {
    id: string;
    name: string;
    score: number;
    previousScore: number;
    status: 'good' | 'warning' | 'critical';
    risks: {
      id: string;
      title: string;
      inherentRisk: number;
      currentRisk: number;
      trend: 'up' | 'down' | 'stable';
      status: 'new' | 'escalated' | 'de-escalated' | 'stable';
    }[];
    capabilities: {
      id: string;
      name: string;
      maturity: number;
      trend: 'improving' | 'declining' | 'stable';
    }[];
  }[];
}> = {
  stakeholders: {
    name: 'Stakeholders',
    description: 'Analysis of stakeholder engagement, communication, and relationship management',
    currentIndex: 84,
    previousIndex: 81,
    benchmark: 79,
    domains: [
      {
        id: 'stakeholder-engagement',
        name: 'Stakeholder Engagement',
        score: 86,
        previousScore: 82,
        status: 'good',
        risks: [
          { id: 'r1', title: 'Limited engagement with external stakeholders', inherentRisk: 65, currentRisk: 45, trend: 'down', status: 'de-escalated' },
          { id: 'r2', title: 'Inconsistent communication channels', inherentRisk: 55, currentRisk: 40, trend: 'stable', status: 'stable' },
          { id: 'r3', title: 'Feedback mechanism gaps', inherentRisk: 70, currentRisk: 55, trend: 'up', status: 'new' },
        ],
        capabilities: [
          { id: 'c1', name: 'Community Consultation Processes', maturity: 4, trend: 'improving' },
          { id: 'c2', name: 'Stakeholder Mapping', maturity: 3, trend: 'stable' },
          { id: 'c3', name: 'Communication Strategy', maturity: 4, trend: 'improving' },
        ],
      },
      {
        id: 'customer-relations',
        name: 'Customer Relations',
        score: 82,
        previousScore: 80,
        status: 'good',
        risks: [
          { id: 'r4', title: 'Customer satisfaction decline', inherentRisk: 60, currentRisk: 35, trend: 'down', status: 'de-escalated' },
          { id: 'r5', title: 'Response time delays', inherentRisk: 50, currentRisk: 30, trend: 'down', status: 'de-escalated' },
        ],
        capabilities: [
          { id: 'c4', name: 'Customer Feedback Systems', maturity: 3, trend: 'stable' },
          { id: 'c5', name: 'Complaint Management', maturity: 4, trend: 'improving' },
        ],
      },
      {
        id: 'community-impact',
        name: 'Community Impact',
        score: 85,
        previousScore: 81,
        status: 'good',
        risks: [
          { id: 'r6', title: 'Community perception issues', inherentRisk: 45, currentRisk: 25, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c6', name: 'Community Liaison', maturity: 4, trend: 'stable' },
          { id: 'c7', name: 'Public Transparency', maturity: 3, trend: 'improving' },
        ],
      },
    ],
  },
  'service-delivery': {
    name: 'Service Delivery',
    description: 'Evaluation of service quality, efficiency, and performance outcomes',
    currentIndex: 82,
    previousIndex: 79,
    benchmark: 77,
    domains: [
      {
        id: 'service-quality',
        name: 'Service Quality',
        score: 84,
        previousScore: 81,
        status: 'good',
        risks: [
          { id: 'r7', title: 'Service standard variations', inherentRisk: 55, currentRisk: 35, trend: 'stable', status: 'stable' },
          { id: 'r8', title: 'Service delivery delays', inherentRisk: 65, currentRisk: 40, trend: 'down', status: 'de-escalated' },
        ],
        capabilities: [
          { id: 'c8', name: 'Quality Assurance Framework', maturity: 4, trend: 'improving' },
          { id: 'c9', name: 'Service Monitoring', maturity: 3, trend: 'stable' },
        ],
      },
      {
        id: 'operational-efficiency',
        name: 'Operational Efficiency',
        score: 80,
        previousScore: 77,
        status: 'good',
        risks: [
          { id: 'r9', title: 'Resource constraints', inherentRisk: 70, currentRisk: 50, trend: 'up', status: 'escalated' },
          { id: 'r10', title: 'Process bottlenecks', inherentRisk: 60, currentRisk: 45, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c10', name: 'Process Automation', maturity: 3, trend: 'improving' },
          { id: 'c11', name: 'Workflow Optimization', maturity: 3, trend: 'stable' },
        ],
      },
      {
        id: 'performance-monitoring',
        name: 'Performance Monitoring',
        score: 82,
        previousScore: 79,
        status: 'good',
        risks: [
          { id: 'r11', title: 'KPI tracking gaps', inherentRisk: 50, currentRisk: 30, trend: 'down', status: 'de-escalated' },
        ],
        capabilities: [
          { id: 'c12', name: 'Performance Dashboards', maturity: 4, trend: 'improving' },
          { id: 'c13', name: 'Data Analytics', maturity: 3, trend: 'stable' },
        ],
      },
    ],
  },
  'management-governance': {
    name: 'Management & Governance',
    description: 'Assessment of leadership, decision-making, and governance frameworks',
    currentIndex: 89,
    previousIndex: 86,
    benchmark: 84,
    domains: [
      {
        id: 'leadership',
        name: 'Leadership',
        score: 90,
        previousScore: 87,
        status: 'good',
        risks: [
          { id: 'r12', title: 'Leadership succession gaps', inherentRisk: 55, currentRisk: 35, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c14', name: 'Executive Development', maturity: 4, trend: 'stable' },
          { id: 'c15', name: 'Strategic Planning', maturity: 5, trend: 'improving' },
        ],
      },
      {
        id: 'governance',
        name: 'Governance',
        score: 88,
        previousScore: 85,
        status: 'good',
        risks: [
          { id: 'r13', title: 'Policy compliance gaps', inherentRisk: 45, currentRisk: 25, trend: 'down', status: 'de-escalated' },
          { id: 'r14', title: 'Board reporting delays', inherentRisk: 40, currentRisk: 20, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c16', name: 'Risk Management Framework', maturity: 4, trend: 'improving' },
          { id: 'c17', name: 'Compliance Monitoring', maturity: 4, trend: 'stable' },
        ],
      },
      {
        id: 'decision-making',
        name: 'Decision Making',
        score: 89,
        previousScore: 86,
        status: 'good',
        risks: [
          { id: 'r15', title: 'Decision latency', inherentRisk: 50, currentRisk: 30, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c18', name: 'Decision Framework', maturity: 4, trend: 'stable' },
          { id: 'c19', name: 'Escalation Processes', maturity: 4, trend: 'improving' },
        ],
      },
    ],
  },
  'people-culture': {
    name: 'People & Culture',
    description: 'Evaluation of workforce capability, culture, and HR practices',
    currentIndex: 78,
    previousIndex: 75,
    benchmark: 76,
    domains: [
      {
        id: 'workforce-capability',
        name: 'Workforce Capability',
        score: 76,
        previousScore: 73,
        status: 'warning',
        risks: [
          { id: 'r16', title: 'Skills shortage', inherentRisk: 75, currentRisk: 60, trend: 'up', status: 'escalated' },
          { id: 'r17', title: 'Training gaps', inherentRisk: 65, currentRisk: 50, trend: 'stable', status: 'stable' },
          { id: 'r18', title: 'Retention concerns', inherentRisk: 70, currentRisk: 55, trend: 'up', status: 'new' },
        ],
        capabilities: [
          { id: 'c20', name: 'Competency Framework', maturity: 3, trend: 'stable' },
          { id: 'c21', name: 'Learning & Development', maturity: 3, trend: 'improving' },
        ],
      },
      {
        id: 'organisational-culture',
        name: 'Organisational Culture',
        score: 80,
        previousScore: 78,
        status: 'good',
        risks: [
          { id: 'r19', title: 'Cultural misalignment', inherentRisk: 55, currentRisk: 35, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c22', name: 'Employee Engagement', maturity: 3, trend: 'improving' },
          { id: 'c23', name: 'Change Management', maturity: 3, trend: 'stable' },
        ],
      },
      {
        id: 'health-safety',
        name: 'Health & Safety',
        score: 79,
        previousScore: 74,
        status: 'good',
        risks: [
          { id: 'r20', title: 'WHS incident potential', inherentRisk: 60, currentRisk: 40, trend: 'down', status: 'de-escalated' },
        ],
        capabilities: [
          { id: 'c24', name: 'Safety Systems', maturity: 4, trend: 'improving' },
          { id: 'c25', name: 'Incident Management', maturity: 4, trend: 'stable' },
        ],
      },
    ],
  },
  'financial-management': {
    name: 'Financial Management',
    description: 'Assessment of financial performance, controls, and resource allocation',
    currentIndex: 88,
    previousIndex: 85,
    benchmark: 83,
    domains: [
      {
        id: 'financial-performance',
        name: 'Financial Performance',
        score: 90,
        previousScore: 87,
        status: 'good',
        risks: [
          { id: 'r21', title: 'Revenue variability', inherentRisk: 50, currentRisk: 30, trend: 'stable', status: 'stable' },
          { id: 'r22', title: 'Cost overruns', inherentRisk: 55, currentRisk: 35, trend: 'down', status: 'de-escalated' },
        ],
        capabilities: [
          { id: 'c26', name: 'Financial Planning', maturity: 5, trend: 'improving' },
          { id: 'c27', name: 'Budget Management', maturity: 4, trend: 'stable' },
        ],
      },
      {
        id: 'financial-controls',
        name: 'Financial Controls',
        score: 87,
        previousScore: 84,
        status: 'good',
        risks: [
          { id: 'r23', title: 'Control weaknesses', inherentRisk: 45, currentRisk: 25, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c28', name: 'Internal Controls', maturity: 4, trend: 'stable' },
          { id: 'c29', name: 'Audit Framework', maturity: 4, trend: 'improving' },
        ],
      },
      {
        id: 'asset-management',
        name: 'Asset Management',
        score: 86,
        previousScore: 84,
        status: 'good',
        risks: [
          { id: 'r24', title: 'Asset deterioration', inherentRisk: 60, currentRisk: 40, trend: 'stable', status: 'stable' },
        ],
        capabilities: [
          { id: 'c30', name: 'Asset Tracking', maturity: 4, trend: 'improving' },
          { id: 'c31', name: 'Maintenance Planning', maturity: 3, trend: 'stable' },
        ],
      },
    ],
  },
};

// SVG Risk Matrix Component
function RiskMatrix({ risks }: { risks: { inherentRisk: number; currentRisk: number }[] }) {
  const size = 200;
  const maxRisk = 100;
  
  return (
    <svg width={size} height={size} className="border border-gray-300 bg-white">
      {/* Grid */}
      {[0, 25, 50, 75, 100].map((val) => (
        <g key={val}>
          <line x1={0} y1={size - (val / maxRisk) * size} x2={size} y2={size - (val / maxRisk) * size} stroke="#eee" strokeWidth="1" />
          <line x1={(val / maxRisk) * size} y1={0} x2={(val / maxRisk) * size} y2={size} stroke="#eee" strokeWidth="1" />
        </g>
      ))}
      {/* Axis labels */}
      <text x={size / 2} y={size + 15} textAnchor="middle" className="text-xs fill-gray-500">Inherent Risk</text>
      <text x={-size / 2} y={-size / 2 + 20} textAnchor="middle" transform="rotate(-90)" className="text-xs fill-gray-500">Current Risk</text>
      {/* Risk points */}
      {risks.map((risk, i) => (
        <circle
          key={i}
          cx={(risk.inherentRisk / maxRisk) * size}
          cy={size - (risk.currentRisk / maxRisk) * size}
          r={6}
          fill={risk.currentRisk > 50 ? '#ef4444' : risk.currentRisk > 30 ? '#f59e0b' : '#22c55e'}
          stroke="white"
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}

// Maturity Gauge Component
function MaturityGauge({ maturity }: { maturity: number }) {
  const maxMaturity = 5;
  const width = 120;
  const height = 20;
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden" style={{ width }}>
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          style={{ width: `${(maturity / maxMaturity) * 100}%` }}
        />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-0.5 bg-white"
            style={{ left: `${(i / maxMaturity) * 100}%` }}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{maturity}/5</span>
    </div>
  );
}

// Trend Arrow Component
function TrendArrow({ trend }: { trend: string }) {
  if (trend === 'up' || trend === 'improving') {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  }
  if (trend === 'down' || trend === 'declining') {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <span className="text-gray-400">→</span>;
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-red-100 text-red-800',
    escalated: 'bg-orange-100 text-orange-800',
    'de-escalated': 'bg-green-100 text-green-800',
    stable: 'bg-gray-100 text-gray-800',
    good: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.stable}`}>
      {status}
    </span>
  );
}

// Domain Score Bar Component
function DomainScoreBar({ score, previousScore }: { score: number; previousScore: number }) {
  const change = score - previousScore;
  const isPositive = change >= 0;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-semibold w-8">{score}</span>
      <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{change}
      </span>
    </div>
  );
}

export default async function DrillDownPage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme: themeId } = await params;
  const theme = themeData[themeId];
  
  if (!theme) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800">Theme Not Found</h1>
          <p className="text-gray-600 mt-2">The requested theme does not exist.</p>
          <Link href="/mast/reports">
            <Button className="mt-4">Back to Reports</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalRisks = theme.domains.reduce((sum, d) => sum + d.risks.length, 0);
  const escalatedRisks = theme.domains.reduce((sum, d) => 
    sum + d.risks.filter(r => r.status === 'escalated' || r.status === 'new').length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50" id="drilldown-content">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
        <div className="container mx-auto px-6">
          <Link href="/mast/reports/board" className="inline-flex items-center text-blue-200 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Board Report
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{theme.name}</h1>
              <p className="text-blue-100 mt-1">{theme.description}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{theme.currentIndex}</div>
              <div className="text-blue-200 text-sm">Current Index</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Previous Index</div>
              <div className="text-2xl font-bold">{theme.previousIndex}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Benchmark</div>
              <div className="text-2xl font-bold">{theme.benchmark}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Change</div>
              <div className="text-2xl font-bold text-green-600">+{theme.currentIndex - theme.previousIndex}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Active Risks</div>
              <div className="text-2xl font-bold">{totalRisks} <span className="text-sm text-red-500">({escalatedRisks} new)</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Domains - Accordion Style */}
        <Accordion type="single" collapsible defaultValue={theme.domains[0]?.id} className="space-y-4">
          {theme.domains.map((domain) => (
            <AccordionItem key={domain.id} value={domain.id} className="border rounded-lg bg-white">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex-1">
                    <span className="text-lg font-semibold text-gray-800">{domain.name}</span>
                  </div>
                  <StatusBadge status={domain.status} />
                  <DomainScoreBar score={domain.score} previousScore={domain.previousScore} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">

              <div className="grid grid-cols-2 gap-6">
                {/* Risks Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Risks & Issues ({domain.risks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {domain.risks.length > 0 ? (
                      <div className="space-y-4">
                        {domain.risks.map((risk) => (
                          <div key={risk.id} className="border-l-4 border-orange-400 pl-4 py-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-800">{risk.title}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Inherent: {risk.inherentRisk} → Current: {risk.currentRisk}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendArrow trend={risk.trend} />
                                <StatusBadge status={risk.status} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No active risks</p>
                    )}
                  </CardContent>
                </Card>

                {/* Capabilities Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Capabilities ({domain.capabilities.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {domain.capabilities.map((cap) => (
                        <div key={cap.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{cap.name}</p>
                            <div className="mt-1">
                              <MaturityGauge maturity={cap.maturity} />
                            </div>
                          </div>
                          <TrendArrow trend={cap.trend} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Matrix for Domain */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <RiskMatrix risks={domain.risks} />
                </CardContent>
              </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Footer */}
        <div className="text-center py-6 border-t mt-8">
          <p className="text-gray-500 text-sm">© 2022 - Eric - Privacy</p>
        </div>
      </div>
    </div>
  );
}
