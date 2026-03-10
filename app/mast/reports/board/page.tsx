// MAST Board Report Page - Exact ERIC PDF Replica
// Layout: Header → Title → Line Charts Grid → Drill Down Reports Accordion → Footer

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, ChevronRight } from 'lucide-react';

const period = 'December 2021';

// ─── SVG Line Chart (multi-series) ───────────────────────────────────────────
function MultiLineChart({
  title,
  series,
  labels,
}: {
  title: string;
  series: { name: string; color: string; data: number[] }[];
  labels: string[];
}) {
  const W = 440;
  const H = 160;
  const pad = { t: 20, r: 10, b: 30, l: 35 };
  const allVals = series.flatMap((s) => s.data);
  const minV = Math.min(...allVals) * 0.9;
  const maxV = Math.max(...allVals) * 1.05;
  const xStep = (W - pad.l - pad.r) / (labels.length - 1);

  function toX(i: number) {
    return pad.l + i * xStep;
  }
  function toY(v: number) {
    return H - pad.b - ((v - minV) / (maxV - minV)) * (H - pad.t - pad.b);
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-1">{title}</h3>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-0 mb-1">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1">
            <span className="inline-block w-3 h-[3px]" style={{ backgroundColor: s.color }} />
            <span className="text-[9px] text-gray-600">{s.name}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = minV + f * (maxV - minV);
          const y = toY(v);
          return (
            <g key={f}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
              <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#9ca3af">
                {Math.round(v)}
              </text>
            </g>
          );
        })}
        {/* Lines */}
        {series.map((s) => {
          const d = s.data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />
              {s.data.map((v, i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill={s.color} />
              ))}
            </g>
          );
        })}
        {/* X labels */}
        {labels.map((l, i) => (
          <text key={i} x={toX(i)} y={H - 8} textAnchor="middle" fontSize="7" fill="#9ca3af">
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ─── Chart data matching ERIC PDF ────────────────────────────────────────────
const periods = ['Current period', '12 months ago', '24 months ago', '36 months ago', '48 months ago'];

const charts: { title: string; series: { name: string; color: string; data: number[] }[] }[] = [
  {
    title: 'BOARDS EYE VIEW - Composite KPI Index\nresults (100 base score)',
    series: [
      { name: 'Stakeholders', color: '#3b82f6', data: [105, 103, 101, 100, 98] },
      { name: 'Service Delivery', color: '#6b7280', data: [102, 100, 99, 98, 97] },
      { name: 'Mngt & Governance', color: '#10b981', data: [108, 106, 104, 102, 100] },
      { name: 'People & Culture', color: '#ef4444', data: [95, 97, 96, 98, 99] },
      { name: 'Financial Mngt', color: '#f59e0b', data: [110, 108, 105, 103, 101] },
    ],
  },
  {
    title: 'Stakeholder Numbers',
    series: [
      { name: 'No. of license holders', color: '#3b82f6', data: [65000, 62000, 60000, 58000, 55000] },
      { name: 'No. of boats registered', color: '#ef4444', data: [18000, 17500, 17000, 16500, 16000] },
      { name: 'No. of moorings', color: '#10b981', data: [12000, 11500, 11000, 10500, 10000] },
    ],
  },
  {
    title: 'Boat average ages',
    series: [
      { name: 'All boats', color: '#3b82f6', data: [14.2, 14.0, 13.8, 13.5, 13.2] },
      { name: 'Glass', color: '#6b7280', data: [12.5, 12.3, 12.0, 11.8, 11.5] },
      { name: 'Alloy', color: '#ef4444', data: [8.5, 8.3, 8.0, 7.8, 7.5] },
      { name: 'Other', color: '#10b981', data: [18.0, 17.5, 17.0, 16.5, 16.0] },
    ],
  },
  {
    title: 'Boat and license holder geographic dispersion',
    series: [
      { name: '% Licenses in North', color: '#3b82f6', data: [35, 34, 34, 33, 33] },
      { name: '% Boats in North', color: '#93c5fd', data: [32, 31, 31, 30, 30] },
      { name: '% Licenses in East', color: '#ef4444', data: [25, 25, 26, 26, 27] },
      { name: '% Boats in East', color: '#fca5a5', data: [28, 28, 29, 29, 30] },
      { name: '% Licenses in South', color: '#10b981', data: [30, 31, 30, 31, 30] },
      { name: '% Boats in South', color: '#6ee7b7', data: [30, 31, 30, 31, 30] },
    ],
  },
  {
    title: 'Schools Education Reach',
    series: [
      { name: 'Total No. schools visited', color: '#3b82f6', data: [120, 115, 110, 105, 100] },
      { name: 'Target No. schools visited', color: '#ef4444', data: [130, 125, 120, 115, 110] },
      { name: 'Total No. students engaged', color: '#10b981', data: [5500, 5200, 4800, 4500, 4200] },
      { name: 'Target No. students engaged', color: '#f59e0b', data: [6000, 5800, 5500, 5200, 5000] },
    ],
  },
  {
    title: 'Stakeholder engagement',
    series: [
      { name: 'No. website visits', color: '#3b82f6', data: [85000, 80000, 75000, 70000, 65000] },
      { name: 'No. phone calls', color: '#6b7280', data: [12000, 11500, 11000, 10500, 10000] },
      { name: 'No. social media followers', color: '#10b981', data: [25000, 22000, 19000, 16000, 13000] },
    ],
  },
  {
    title: 'Frequency rates',
    series: [
      { name: 'Inspections per 1,000 boats', color: '#3b82f6', data: [45, 42, 40, 38, 35] },
      { name: 'Incidents per 1,000 boats', color: '#ef4444', data: [8, 9, 10, 11, 12] },
    ],
  },
  {
    title: 'Financial Management',
    series: [
      { name: 'Income variance analysis (% Var. budget)', color: '#3b82f6', data: [0.05, 0.02, -0.1, 0.08, 0.03] },
      { name: 'Expenditure variance (% Var. budget)', color: '#ef4444', data: [-0.03, -0.05, -0.15, -0.08, -0.02] },
    ],
  },
  {
    title: 'Solvency',
    series: [
      { name: 'Current ratio', color: '#3b82f6', data: [2.1, 2.0, 1.9, 1.8, 1.7] },
      { name: 'MAST Min. comfort threshold', color: '#ef4444', data: [1.5, 1.5, 1.5, 1.5, 1.5] },
    ],
  },
  {
    title: 'People & Culture - Profile',
    series: [
      { name: 'No. of FTE', color: '#3b82f6', data: [55, 54, 52, 50, 48] },
      { name: 'Ave. age', color: '#6b7280', data: [42, 41, 40, 39, 38] },
      { name: 'Ave. tenure', color: '#10b981', data: [8, 7.5, 7, 6.5, 6] },
      { name: 'No. WHS incidents', color: '#ef4444', data: [3, 4, 5, 6, 7] },
    ],
  },
  {
    title: 'People & Culture - Utilisation',
    series: [
      { name: 'Planned (rostered/worked) as % of capacity', color: '#3b82f6', data: [92, 90, 88, 86, 84] },
      { name: 'Worked as % of planned', color: '#6b7280', data: [95, 94, 93, 92, 91] },
      { name: 'OT & TOIL hours worked as % of planned', color: '#10b981', data: [8, 9, 10, 11, 12] },
    ],
  },
];

// ─── Drill-down categories ───────────────────────────────────────────────────
const drillDownItems = [
  { name: 'Stakeholders', href: '/mast/reports/drilldown/stakeholders' },
  { name: 'Service Delivery', href: '/mast/reports/drilldown/service-delivery' },
  { name: 'Management & Governance', href: '/mast/reports/drilldown/management-governance' },
  { name: 'People & Culture', href: '/mast/reports/drilldown/people-culture' },
  { name: 'Financial Management', href: '/mast/reports/drilldown/financial-management' },
  { name: 'MAST PERFORMANCE FRAMEWORK REPORT', href: '/mast/reports/1' },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function BoardReportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="bg-[#5a6d7e] text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">ERIC&nbsp;|&nbsp;REPORTS</span>
          </div>
          <div className="text-sm">
            Hello Martin Farley [Administrators,Client]!&nbsp;&nbsp;
            <span className="underline cursor-pointer">Sign out</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-gray-900">
          Marine and Safety Tasmania (MAST) Reports for period:
        </h1>
        <h2 className="text-xl font-bold text-gray-900">{period}</h2>
      </div>

      {/* Section: Line Charts */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <h2 className="text-lg font-bold text-red-700 mb-4">Line Charts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charts.map((chart, idx) => (
            <Card key={idx} className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                <MultiLineChart
                  title={chart.title}
                  series={chart.series}
                  labels={periods}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Drill Down Reports */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Drill Down Reports</h2>

        <div className="space-y-2">
          {drillDownItems.map((item) => (
            <Link key={item.name} href={item.href} className="block">
              <div
                className="flex items-center gap-3 px-5 py-4 text-white font-medium text-base rounded"
                style={{ backgroundColor: '#5a6d7e' }}
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-4">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © 2022 - Eric - Privacy
        </div>
      </div>

      {/* Floating export */}
      <div className="fixed bottom-6 right-6">
        <Button className="shadow-lg bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
