'use client'

import { X, Terminal, Sparkles, Circle, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  type AgentNode,
  type Agent,
  type Command,
  type Orchestrator,
  priorityColors,
  statusStyles,
} from '@/lib/agent-types'

interface AgentsSidebarProps {
  node: AgentNode | null
  isOpen: boolean
  onClose: () => void
}

function isAgent(node: AgentNode): node is Agent {
  return node.type === 'agent'
}

function isCommand(node: AgentNode): node is Command {
  return node.type === 'command'
}

function isOrchestrator(node: AgentNode): node is Orchestrator {
  return node.type === 'orchestrator'
}

export function AgentsSidebar({ node, isOpen, onClose }: AgentsSidebarProps) {
  if (!node) return null

  return (
    <div
      className={cn(
        'absolute top-0 right-0 h-full w-80 bg-card border-l border-border shadow-lg',
        'transform transition-transform duration-300 ease-in-out z-50',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {isOrchestrator(node) && <Sparkles className="w-5 h-5 text-violet-500" />}
          {isCommand(node) && <Terminal className="w-5 h-5 text-violet-500" />}
          {isAgent(node) && (
            <Circle
              className={cn('w-4 h-4', priorityColors[node.priority].text)}
              fill="currentColor"
            />
          )}
          <span className="font-semibold">{node.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {node.type}
          </Badge>
          {isAgent(node) && (
            <>
              <Badge
                className={cn(
                  'text-[10px]',
                  priorityColors[node.priority].bg,
                  priorityColors[node.priority].text,
                  'border',
                  priorityColors[node.priority].border
                )}
              >
                {node.priority}
              </Badge>
              <Badge
                className={cn(
                  'text-[10px]',
                  statusStyles[node.status].bg,
                  statusStyles[node.status].text
                )}
              >
                {node.status === 'operativo' ? 'Operativo' : 'Planificado'}
              </Badge>
            </>
          )}
        </div>

        {/* Agent-specific fields */}
        {isAgent(node) && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Workstream
              </label>
              <p className="text-sm mt-1">{node.workstream}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Purpose
              </label>
              <p className="text-sm mt-1">{node.purpose}</p>
            </div>

            {node.upstream && node.upstream.length > 0 && (
              <>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" /> Upstream
                  </label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.upstream.map((id) => (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {id}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {node.downstream && node.downstream.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <ArrowDown className="w-3 h-3" /> Downstream
                </label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {node.downstream.map((id) => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Command-specific fields */}
        {isCommand(node) && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Trigger
              </label>
              <p className="text-sm mt-1">{node.trigger}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Output
              </label>
              <p className="text-sm mt-1">{node.output}</p>
            </div>
            {node.relatedAgents && node.relatedAgents.length > 0 && (
              <>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Related Agents
                  </label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.relatedAgents.map((id) => (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {id}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Orchestrator-specific fields */}
        {isOrchestrator(node) && (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Purpose
              </label>
              <p className="text-sm mt-1">{node.purpose}</p>
            </div>
            {node.downstream && node.downstream.length > 0 && (
              <>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <ArrowDown className="w-3 h-3" /> Downstream Agents
                  </label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.downstream.map((id) => (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {id}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
