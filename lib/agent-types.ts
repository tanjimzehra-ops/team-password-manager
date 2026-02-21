// Types for Agents Canvas Dashboard

export type Priority = 'P0' | 'P1' | 'P2'
export type AgentStatus = 'operativo' | 'planificado'
export type NodeType = 'agent' | 'command' | 'orchestrator'

export interface Agent {
  [key: string]: unknown
  id: string
  name: string
  type: 'agent'
  workstream: string
  priority: Priority
  status: AgentStatus
  purpose: string
  upstream?: string[]
  downstream?: string[]
}

export interface Command {
  [key: string]: unknown
  id: string
  name: string
  type: 'command'
  trigger: string
  output: string
  relatedAgents?: string[]
}

export interface Orchestrator {
  [key: string]: unknown
  id: string
  name: string
  type: 'orchestrator'
  purpose: string
  downstream: string[]
}

export type AgentNode = Agent | Command | Orchestrator

// Priority colors for visual distinction
export const priorityColors: Record<Priority, { bg: string; border: string; text: string }> = {
  P0: { bg: 'bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-600' },
  P1: { bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-600' },
  P2: { bg: 'bg-gray-500/10', border: 'border-gray-400', text: 'text-gray-500' },
}

// Status badge styles
export const statusStyles: Record<AgentStatus, { bg: string; text: string }> = {
  operativo: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  planificado: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
}

// Workstream colors for grouping
export const workstreamColors: Record<string, string> = {
  '00-orchestrator': '#8b5cf6',  // violet
  '00-utils': '#6366f1',         // indigo
  '01-tasmania': '#06b6d4',      // cyan
  '02-jigsaw': '#10b981',        // emerald
  '03-byterover': '#f59e0b',     // amber
  '04-mera': '#ef4444',          // red
  '05-kiraa': '#ec4899',         // pink
  '06-levur': '#84cc16',         // lime
}
