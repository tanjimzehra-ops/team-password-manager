// MAST Board Report Page - Exact ERIC PDF Replica
// Layout: Header → Title → Line Charts Grid → Drill Down Reports Accordion → Footer

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { Download, ChevronRight, TrendingUp, TrendingDown, Users, FileText, Shield, Heart, DollarSign } from 'lucide-react';

const period = 'December 2021';

// ─── SVG Line Chart (multi-series) ───────────────────────────────────────────
function MultiLineChart({
  title,
  series,
  labels,
  yAxisRange,
}: {
  title: string;
  series: { name: string; color: string; data: number[] }[];
  labels: string[];
  yAxisRange?: { min: number; max: number };
}) {
  const W = 440;
  const H = 160;
  const pad = { t: 20, r: 10, b: 30, l: 35 };
  const allVals = series.flatMap((s) => s.data);
  const minV = yAxisRange ? yAxisRange.min : Math.min(...allVals) * 0.9;
  const maxV = yAxisRange ? yAxisRange.max : Math.max(...allVals) * 1.05;
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

// ─── SVG Bar Chart (Previous vs Current Period) ─────────────────────────────────
function BarChart({
  title,
  categories,
  currentData,
  previousData,
}: {
  title: string;
  categories: string[];
  currentData: number[];
  previousData: number[];
}) {
  const W = 440;
  const H = 180;
  const pad = { t: 30, r: 20, b: 50, l: 50 };
  const barWidth = 30;
  const gap = 15;
  const allVals = [...currentData, ...previousData];
  const maxV = Math.max(...allVals) * 1.1;
  const minV = 0;

  function toX(i: number, isCurrent: boolean) {
    const groupWidth = (barWidth * 2) + gap;
    const groupStart = pad.l + 20;
    return groupStart + i * groupWidth + (isCurrent ? 0 : barWidth + 4);
  }
  function toY(v: number) {
    return H - pad.b - ((v - minV) / (maxV - minV)) * (H - pad.t - pad.b);
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-2">{title}</h3>
      {/* Legend */}
      <div className="flex gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span className="inline-block w-4 h-3" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-[10px] text-gray-600">Current Period</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-4 h-3" style={{ backgroundColor: '#9ca3af' }} />
          <span className="text-[10px] text-gray-600">Previous Period</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        {/* Y axis grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = minV + f * (maxV - minV);
          const y = toY(v);
          return (
            <g key={f}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
              <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="8" fill="#9ca3af">
                {Math.round(v)}
              </text>
            </g>
          );
        })}
        {/* Bars */}
        {categories.map((cat, i) => {
          const currentH = toY(currentData[i]) - toY(0);
          const previousH = toY(previousData[i]) - toY(0);
          return (
            <g key={cat}>
              {/* Previous period bar */}
              <rect
                x={toX(i, false)}
                y={toY(previousData[i])}
                width={barWidth}
                height={previousH}
                fill="#9ca3af"
                rx="2"
              />
              {/* Current period bar */}
              <rect
                x={toX(i, true)}
                y={toY(currentData[i])}
                width={barWidth}
                height={currentH}
                fill="#3b82f6"
                rx="2"
              />
              {/* X label */}
              <text
                x={toX(i, true) + barWidth / 2}
                y={H - 10}
                textAnchor="end"
                fontSize="7"
                fill="#6b7280"
                transform={`rotate(-45, ${toX(i, true) + barWidth / 2}, ${H - 10})`}
              >
                {cat.length > 12 ? cat.substring(0, 12) + '...' : cat}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Chart data matching ERIC PDF ────────────────────────────────────────────
// 12 periods - 5 years × 2/year (every 6 months)
const periods = ['Dec 21', 'Jun 21', 'Dec 20', 'Jun 20', 'Dec 19', 'Jun 19', 'Dec 18', 'Jun 18', 'Dec 17', 'Jun 17', 'Dec 16', 'Jun 16'];

const charts: { title: string; yAxisRange: { min: number; max: number }; series: { name: string; color: string; data: number[] }[] }[] = [
  {
    title: 'BOARDS EYE VIEW - Composite KPI Index\nresults (100 base score)',
    yAxisRange: { min: 0, max: 180 },
    series: [
      { name: 'Stakeholders', color: '#3b82f6', data: [115, 113, 110, 108, 105, 103, 100, 98, 96, 94, 92, 90] },
      { name: 'Service Delivery', color: '#6b7280', data: [108, 106, 104, 102, 100, 99, 98, 97, 96, 95, 94, 93] },
      { name: 'Mngt & Governance', color: '#10b981', data: [118, 116, 114, 112, 110, 108, 106, 104, 102, 100, 98, 96] },
      { name: 'People & Culture', color: '#ef4444', data: [105, 103, 101, 99, 98, 97, 96, 98, 100, 102, 104, 106] },
      { name: 'Financial Mngt', color: '#f59e0b', data: [120, 118, 115, 112, 110, 108, 105, 103, 100, 98, 96, 94] },
    ],
  },
  {
    title: 'Stakeholder Numbers',
    yAxisRange: { min: 0, max: 70000 },
    series: [
      { name: 'No. of license holders', color: '#3b82f6', data: [35000, 34000, 33000, 32000, 31000, 30000, 32000, 33000, 34000, 35000, 36000, 37000] },
      { name: 'No. of boats registered', color: '#ef4444', data: [60000, 59000, 58000, 57000, 56000, 55000, 57000, 58000, 59000, 60000, 61000, 62000] },
      { name: 'No. of moorings', color: '#10b981', data: [5500, 5400, 5300, 5200, 5100, 5000, 5100, 5200, 5300, 5400, 5500, 5600] },
    ],
  },
  {
    title: 'Boat average ages',
    yAxisRange: { min: 0, max: 20 },
    series: [
      { name: 'All boats', color: '#3b82f6', data: [16.0, 15.8, 15.6, 15.4, 15.2, 15.0, 14.8, 14.6, 14.4, 14.2, 14.0, 13.8] },
      { name: 'Glass', color: '#6b7280', data: [14.5, 14.3, 14.1, 13.9, 13.7, 13.5, 13.3, 13.1, 12.9, 12.7, 12.5, 12.3] },
      { name: 'Alloy', color: '#ef4444', data: [9.5, 9.3, 9.1, 8.9, 8.7, 8.5, 8.3, 8.1, 7.9, 7.7, 7.5, 7.3] },
      { name: 'Other', color: '#10b981', data: [19.0, 18.8, 18.6, 18.4, 18.2, 18.0, 17.8, 17.6, 17.4, 17.2, 17.0, 16.8] },
    ],
  },
  {
    title: 'Boat and license holder geographic dispersion',
    yAxisRange: { min: 0, max: 30000 },
    series: [
      { name: '% Licenses in North', color: '#3b82f6', data: [35, 34, 34, 33, 33, 32, 31, 31, 30, 30, 29, 28] },
      { name: '% Boats in North', color: '#93c5fd', data: [32, 31, 31, 30, 30, 29, 29, 28, 28, 27, 27, 26] },
      { name: '% Licenses in East', color: '#ef4444', data: [25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30] },
      { name: '% Boats in East', color: '#fca5a5', data: [28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33] },
      { name: '% Licenses in South', color: '#10b981', data: [30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31] },
      { name: '% Boats in South', color: '#6ee7b7', data: [30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31] },
      { name: '% Licenses in NW', color: '#8b5cf6', data: [10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11] },
      { name: '% Boats in NW', color: '#c4b5fd', data: [10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12] },
    ],
  },
  {
    title: 'Schools Education Reach',
    yAxisRange: { min: 0, max: 6000 },
    series: [
      { name: 'Total No. schools visited', color: '#3b82f6', data: [140, 135, 130, 125, 120, 115, 110, 105, 100, 95, 90, 85] },
      { name: 'Target No. schools visited', color: '#ef4444', data: [150, 145, 140, 135, 130, 125, 120, 115, 110, 105, 100, 95] },
      { name: 'Total No. students engaged', color: '#10b981', data: [5800, 5600, 5400, 5200, 5000, 4800, 4600, 4400, 4200, 4000, 3800, 3600] },
      { name: 'Target No. students engaged', color: '#f59e0b', data: [6200, 6000, 5800, 5600, 5400, 5200, 5000, 4800, 4600, 4400, 4200, 4000] },
    ],
  },
  {
    title: 'Stakeholder engagement',
    yAxisRange: { min: 0, max: 80000 },
    series: [
      { name: 'No. website visits', color: '#3b82f6', data: [90000, 88000, 86000, 84000, 82000, 80000, 78000, 76000, 74000, 72000, 70000, 68000] },
      { name: 'No. phone calls', color: '#6b7280', data: [14000, 13500, 13000, 12500, 12000, 11500, 11000, 10500, 10000, 9500, 9000, 8500] },
      { name: 'No. social media followers', color: '#10b981', data: [28000, 26000, 24000, 22000, 20000, 18000, 16000, 14000, 12000, 10000, 8000, 6000] },
    ],
  },
  {
    title: 'Frequency rates',
    yAxisRange: { min: 0, max: 1.0 },
    series: [
      { name: 'Inspections per 1,000 boats', color: '#3b82f6', data: [0.65, 0.62, 0.58, 0.55, 0.52, 0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38] },
      { name: 'Incidents per 1,000 boats', color: '#ef4444', data: [0.12, 0.14, 0.16, 0.18, 0.20, 0.22, 0.24, 0.26, 0.28, 0.30, 0.32, 0.34] },
    ],
  },
  {
    title: 'Financial Management',
    yAxisRange: { min: -0.4, max: 0.2 },
    series: [
      { name: 'Income variance analysis (% Var. budget)', color: '#3b82f6', data: [0.08, 0.06, 0.04, 0.02, 0.00, -0.02, -0.04, -0.06, -0.08, -0.10, -0.12, -0.14] },
      { name: 'Expenditure variance (% Var. budget)', color: '#ef4444', data: [-0.02, -0.04, -0.06, -0.08, -0.10, -0.12, -0.14, -0.16, -0.18, -0.20, -0.22, -0.24] },
    ],
  },
  {
    title: 'Solvency',
    yAxisRange: { min: 0, max: 20 },
    series: [
      { name: 'Current ratio', color: '#3b82f6', data: [2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4] },
      { name: 'MAST Min. comfort threshold', color: '#ef4444', data: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5] },
    ],
  },
  {
    title: 'People & Culture - Profile',
    yAxisRange: { min: 0, max: 60 },
    series: [
      { name: 'No. of FTE', color: '#3b82f6', data: [58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47] },
      { name: 'Ave. age', color: '#6b7280', data: [45, 44.5, 44, 43.5, 43, 42.5, 42, 41.5, 41, 40.5, 40, 39.5] },
      { name: 'Ave. tenure', color: '#10b981', data: [9.0, 8.7, 8.4, 8.1, 7.8, 7.5, 7.2, 6.9, 6.6, 6.3, 6.0, 5.7] },
      { name: 'No. WHS incidents', color: '#ef4444', data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    ],
  },
  {
    title: 'People & Culture - Utilisation',
    yAxisRange: { min: 0, max: 1.2 },
    series: [
      { name: 'Planned (rostered/worked) as % of capacity', color: '#3b82f6', data: [0.95, 0.93, 0.92, 0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.76, 0.74] },
      { name: 'Worked as % of planned', color: '#6b7280', data: [0.98, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.90, 0.89, 0.88, 0.87, 0.86] },
      { name: 'OT & TOIL hours worked as % of planned', color: '#10b981', data: [0.05, 0.07, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20, 0.22, 0.24, 0.26] },
    ],
  },
];

// ─── Bar Chart Data: Previous vs Current Period ─────────────────────────────────
const barCharts: { title: string; categories: string[]; currentData: number[]; previousData: number[] }[] = [
  {
    title: 'Composite KPI Index - Current vs Previous',
    categories: ['Stakeholders', 'Service Delivery', 'Mngt & Gov', 'People & Culture', 'Financial Mngt'],
    currentData: [105, 102, 108, 95, 110],
    previousData: [103, 100, 106, 97, 108],
  },
  {
    title: 'Stakeholder Numbers - Current vs Previous',
    categories: ['License Holders', 'Boats Reg', 'Moorings', 'Active Users', 'Events'],
    currentData: [65000, 18000, 12000, 45000, 1250],
    previousData: [62000, 17500, 11500, 42000, 1100],
  },
  {
    title: 'Boat Average Ages - Current vs Previous',
    categories: ['All Boats', 'Glass', 'Alloy', 'Fiberglass', 'Other'],
    currentData: [14.2, 12.5, 8.5, 15.0, 18.0],
    previousData: [14.0, 12.3, 8.3, 14.8, 17.5],
  },
  {
    title: 'Frequency Rates - Current vs Previous',
    categories: ['Inspections', 'Incidents', 'Compliance Checks', 'Safety Audits', 'Training'],
    currentData: [450, 85, 320, 45, 280],
    previousData: [420, 95, 290, 40, 250],
  },
  {
    title: 'Financial Metrics - Current vs Previous',
    categories: ['Income ($K)', 'Expenditure', 'Net Position', 'Reserves', 'Debt Ratio'],
    currentData: [2500, 2100, 400, 1800, 0.35],
    previousData: [2350, 2050, 300, 1650, 0.38],
  },
];

// ─── Drill-down data with variables for each theme ─────────────────────────────────────
// Color coding: Green (≥100), Yellow (95-99), Red (<95) based on 100 baseline

interface DrillDownVariable {
  name: string;
  current: number;
  previous: number;
  benchmark: number;
  hasSubRows?: boolean;
  subRows?: { name: string; current: number; previous: number; benchmark: number }[];
}

interface DrillDownItem {
  id: string;
  name: string;
  icon: any;
  variables: DrillDownVariable[];
}

const drillDownItems: DrillDownItem[] = [
  {
    id: 'stakeholders',
    name: 'Stakeholders',
    icon: Users,
    variables: [
      { name: 'No. of license holders', current: 35200, previous: 34800, benchmark: 35000 },
      { name: 'No. of boats registered', current: 61200, previous: 60800, benchmark: 62000 },
      { name: 'No. of moorings', current: 5450, previous: 5300, benchmark: 5500 },
      { name: 'License holder retention rate', current: 96, previous: 94, benchmark: 95 },
      { name: 'Boat registration retention rate', current: 102, previous: 98, benchmark: 100, hasSubRows: true, subRows: [
        { name: 'North', current: 104, previous: 100, benchmark: 100 },
        { name: 'South', current: 100, previous: 96, benchmark: 100 },
        { name: 'East', current: 98, previous: 95, benchmark: 100 },
      ]},
      { name: 'Website visits', current: 88500, previous: 82000, benchmark: 90000 },
    ],
  },
  {
    id: 'service-delivery',
    name: 'Service Delivery',
    icon: FileText,
    variables: [
      { name: 'Service level achieved', current: 98, previous: 96, benchmark: 95 },
      { name: 'Average response time (hrs)', current: 4.2, previous: 4.8, benchmark: 4.0 },
      { name: 'Customer satisfaction score', current: 88, previous: 85, benchmark: 90 },
      { name: 'Cases resolved within SLA', current: 94, previous: 91, benchmark: 95 },
      { name: 'Inspections completed', current: 1250, previous: 1180, benchmark: 1200 },
    ],
  },
  {
    id: 'management-governance',
    name: 'Management & Governance',
    icon: Shield,
    variables: [
      { name: 'Governance score', current: 105, previous: 102, benchmark: 100 },
      { name: 'Policy compliance rate', current: 98, previous: 96, benchmark: 95 },
      { name: 'Audit findings resolved', current: 100, previous: 92, benchmark: 100 },
      { name: 'Board meetings held', current: 12, previous: 12, benchmark: 12 },
      { name: 'Risk register up to date', current: 102, previous: 100, benchmark: 100 },
    ],
  },
  {
    id: 'people-culture',
    name: 'People & Culture',
    icon: Heart,
    variables: [
      { name: 'FTE count', current: 56, previous: 54, benchmark: 55 },
      { name: 'Staff turnover rate', current: 12, previous: 15, benchmark: 10 },
      { name: 'Training hours per employee', current: 42, previous: 38, benchmark: 40 },
      { name: 'Employee satisfaction index', current: 78, previous: 82, benchmark: 80 },
      { name: 'WHS incidents', current: 3, previous: 5, benchmark: 0 },
    ],
  },
  {
    id: 'financial-management',
    name: 'Financial Management',
    icon: DollarSign,
    variables: [
      { name: 'Income variance (% budget)', current: 103, previous: 98, benchmark: 100 },
      { name: 'Expenditure variance (% budget)', current: 97, previous: 102, benchmark: 100 },
      { name: 'Current ratio', current: 2.3, previous: 2.1, benchmark: 1.5 },
      { name: 'Budget utilization', current: 94, previous: 91, benchmark: 95 },
      { name: 'Debt to equity ratio', current: 0.35, previous: 0.38, benchmark: 0.40 },
    ],
  },
  {
    id: 'mast-performance-framework',
    name: 'MAST PERFORMANCE FRAMEWORK REPORT',
    icon: TrendingUp,
    variables: [
      { name: 'Composite KPI Index', current: 108, previous: 105, benchmark: 100 },
      { name: 'Strategic objective alignment', current: 95, previous: 93, benchmark: 95 },
      { name: 'Operational efficiency score', current: 102, previous: 99, benchmark: 100 },
      { name: 'Innovation adoption rate', current: 78, previous: 72, benchmark: 80 },
      { name: 'Stakeholder trust index', current: 88, previous: 86, benchmark: 85 },
    ],
  },
];

// Helper function to get color based on value vs benchmark
function getCellColor(value: number, benchmark: number): string {
  const ratio = (value / benchmark) * 100;
  if (ratio >= 100) return 'bg-green-100 text-green-800';
  if (ratio >= 95) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function getTrendIndicator(current: number, previous: number): string {
  if (current > previous) return '↑';
  if (current < previous) return '↓';
  return '→';
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function BoardReportPage() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (key: string) => {
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar - dark maroon/burgundy as per ERIC branding */}
      <div className="bg-[#5a2d3e] text-white">
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
                  yAxisRange={chart.yAxisRange}
                  series={chart.series}
                  labels={periods}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Bar Charts - Previous vs Current */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <h2 className="text-lg font-bold text-red-700 mb-4">Bar Charts (Previous vs Current Period)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barCharts.map((chart, idx) => (
            <Card key={idx} className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                <BarChart
                  title={chart.title}
                  categories={chart.categories}
                  currentData={chart.currentData}
                  previousData={chart.previousData}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Drill Down Reports - 6 Maroon Accordion Bars as per ERIC */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Accordion type="multiple" className="space-y-2">
          {drillDownItems.map((item) => {
            const Icon = item.icon;
            return (
              <AccordionItem key={item.id} value={item.id} className="border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-[#5a2d3e] hover:bg-[#4a2533] rounded-md">
                  <div className="flex items-center gap-4 w-full pr-4">
                    <div className="p-1.5 rounded bg-white/20">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-lg font-semibold text-white">{item.name}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-gray-50 rounded-b-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-semibold text-gray-700">Variable</th>
                        <th className="text-right py-2 font-semibold text-gray-700">Current</th>
                        <th className="text-right py-2 font-semibold text-gray-700">Previous</th>
                        <th className="text-right py-2 font-semibold text-gray-700">Benchmark</th>
                        <th className="text-center py-2 font-semibold text-gray-700">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.variables?.map((variable, idx) => {
                        const rowKey = `${item.id}-${idx}`;
                        const isExpanded = expandedRows[rowKey] || false;
                        return (
                          <React.Fragment key={idx}>
                            <tr 
                              className={`border-b border-gray-100 hover:bg-gray-100 ${variable.hasSubRows ? 'cursor-pointer' : ''}`}
                              onClick={() => variable.hasSubRows && toggleRow(rowKey)}
                            >
                              <td className="py-2 text-gray-800">
                                {variable.hasSubRows && (
                                  <span className="mr-2 text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                                )}
                                {variable.name}
                              </td>
                              <td className={`text-right py-2 px-2 rounded ${getCellColor(variable.current, variable.benchmark)}`}>
                                {variable.current.toLocaleString()}
                              </td>
                              <td className="text-right py-2 text-gray-600">
                                {variable.previous.toLocaleString()}
                              </td>
                              <td className="text-right py-2 text-gray-500">
                                {variable.benchmark.toLocaleString()}
                              </td>
                              <td className="text-center py-2">
                                <span className="text-lg">{getTrendIndicator(variable.current, variable.previous)}</span>
                              </td>
                            </tr>
                            {variable.hasSubRows && isExpanded && variable.subRows?.map((sub, subIdx) => (
                              <tr key={`${idx}-${subIdx}`} className="border-b border-gray-50 bg-gray-25">
                                <td className="py-1.5 pl-8 text-gray-600 text-xs">↳ {sub.name}</td>
                                <td className={`text-right py-1.5 px-2 rounded text-xs ${getCellColor(sub.current, sub.benchmark)}`}>
                                  {sub.current.toLocaleString()}
                                </td>
                                <td className="text-right py-1.5 text-gray-500 text-xs">
                                  {sub.previous.toLocaleString()}
                                </td>
                                <td className="text-right py-1.5 text-gray-400 text-xs">
                                  {sub.benchmark.toLocaleString()}
                                </td>
                                <td className="text-center py-1.5">
                                  <span className="text-sm">{getTrendIndicator(sub.current, sub.previous)}</span>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
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
