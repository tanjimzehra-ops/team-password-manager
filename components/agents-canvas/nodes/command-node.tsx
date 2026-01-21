'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Command } from '@/lib/agent-types'

interface CommandNodeData extends Command {
  selected?: boolean
}

export const CommandNode = memo(({ data, selected }: NodeProps<CommandNodeData>) => {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 shadow-sm min-w-[160px] transition-all',
        'bg-violet-500/10 border-violet-500',
        selected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-violet-500 !w-2 !h-2"
      />

      <div className="flex items-start gap-2">
        <Terminal className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-mono font-medium text-sm text-violet-700 dark:text-violet-400">
            {data.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {data.trigger}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-violet-500 !w-2 !h-2"
      />
    </div>
  )
})

CommandNode.displayName = 'CommandNode'
