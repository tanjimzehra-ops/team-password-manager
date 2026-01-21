'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Orchestrator } from '@/lib/agent-types'

interface OrchestratorNodeData extends Orchestrator {
  selected?: boolean
}

export const OrchestratorNode = memo(({ data, selected }: NodeProps<OrchestratorNodeData>) => {
  return (
    <div
      className={cn(
        'px-6 py-4 rounded-xl border-2 shadow-lg min-w-[200px] transition-all',
        'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20',
        'border-violet-500',
        selected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-violet-500/20">
          <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base">{data.name}</div>
          <div className="text-xs text-muted-foreground">Orchestrator</div>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground line-clamp-2">
        {data.purpose}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-violet-500 !w-3 !h-3"
      />
    </div>
  )
})

OrchestratorNode.displayName = 'OrchestratorNode'
