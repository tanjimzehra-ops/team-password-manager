'use client'

import { memo } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { type Agent, priorityColors, statusStyles } from '@/lib/agent-types'

type AgentNodeData = Node<Agent, 'agent'>

export const AgentNode = memo(({ data, selected }: NodeProps<AgentNodeData>) => {
  const colors = priorityColors[data.priority]
  const status = statusStyles[data.status]

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 shadow-sm min-w-[180px] transition-all',
        colors.bg,
        colors.border,
        selected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground !w-2 !h-2"
      />

      <div className="flex items-start gap-2">
        <span className={cn('text-lg', colors.text)}>●</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{data.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {data.workstream}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span
          className={cn(
            'px-3 py-1 text-xs font-bold rounded-full shadow-sm',
            status.bg,
            status.text
          )}
        >
          {data.status === 'operativo' ? 'Operativo' : 'Planificado'}
        </span>
        <span
          className={cn(
            'px-2 py-1 rounded shadow-sm border border-black/5 dark:border-white/5',
            colors.text,
            'bg-background/50',
            'text-xs',
            'font-black uppercase tracking-widest',
          )}
        >
          {data.priority}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted-foreground !w-2 !h-2"
      />
    </div>
  )
})

AgentNode.displayName = 'AgentNode'
