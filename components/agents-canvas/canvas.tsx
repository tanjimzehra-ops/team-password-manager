'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnSelectionChangeParams,
  MarkerType,
  ConnectionMode,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { AgentNode } from './nodes/agent-node'
import { CommandNode } from './nodes/command-node'
import { OrchestratorNode } from './nodes/orchestrator-node'
import { AgentsSidebar } from './sidebar'
import { type AgentNode as AgentNodeType, workstreamColors } from '@/lib/agent-types'
import agentsData from '@/data/agents.json'

// Register custom node types
const nodeTypes = {
  agent: AgentNode,
  command: CommandNode,
  orchestrator: OrchestratorNode,
}

// Convert agents data to React Flow nodes
function createNodes(): Node[] {
  const nodes: Node[] = []
  let yOffset = 0

  // Orchestrator at top center
  const orchestrator = agentsData.agents.find(a => a.type === 'orchestrator')
  if (orchestrator) {
    nodes.push({
      id: orchestrator.id,
      type: 'orchestrator',
      position: { x: 400, y: 0 },
      data: orchestrator,
    })
    yOffset = 150
  }

  // Group agents by workstream
  const agentsByWorkstream = agentsData.agents
    .filter(a => a.type === 'agent')
    .reduce((acc, agent) => {
      const ws = (agent as { workstream?: string }).workstream || '00-utils'
      if (!acc[ws]) acc[ws] = []
      acc[ws].push(agent)
      return acc
    }, {} as Record<string, typeof agentsData.agents>)

  // Position agents by workstream
  const workstreams = Object.keys(agentsByWorkstream).sort()
  workstreams.forEach((ws, wsIndex) => {
    const agents = agentsByWorkstream[ws]
    const baseX = wsIndex * 250
    agents.forEach((agent, agentIndex) => {
      nodes.push({
        id: agent.id,
        type: 'agent',
        position: { x: baseX, y: yOffset + agentIndex * 120 },
        data: agent,
      })
    })
  })

  // Commands in a row at bottom
  const commandY = yOffset + 400
  agentsData.commands.forEach((cmd, i) => {
    nodes.push({
      id: cmd.id,
      type: 'command',
      position: { x: 100 + i * 180, y: commandY },
      data: cmd,
    })
  })

  return nodes
}

// Create edges from upstream/downstream relationships
function createEdges(): Edge[] {
  const edges: Edge[] = []

  agentsData.agents.forEach((agent) => {
    const downstream = (agent as { downstream?: string[] }).downstream
    if (downstream) {
      downstream.forEach((targetId) => {
        edges.push({
          id: `${agent.id}-${targetId}`,
          source: agent.id,
          target: targetId,
          type: 'smoothstep',
          animated: agent.type === 'orchestrator',
          style: {
            stroke: workstreamColors[(agent as { workstream?: string }).workstream || '00-orchestrator'] || '#6366f1',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: workstreamColors[(agent as { workstream?: string }).workstream || '00-orchestrator'] || '#6366f1',
          },
        })
      })
    }
  })

  // Connect commands to Claudia
  agentsData.commands.forEach((cmd) => {
    edges.push({
      id: `claudia-${cmd.id}`,
      source: 'claudia',
      target: cmd.id,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5,5' },
    })
  })

  return edges
}

interface AgentsCanvasProps {
  className?: string
}

export function AgentsCanvas({ className }: AgentsCanvasProps) {
  const initialNodes = useMemo(() => createNodes(), [])
  const initialEdges = useMemo(() => createEdges(), [])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<AgentNodeType | null>(null)

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: OnSelectionChangeParams) => {
    if (selectedNodes.length === 1) {
      const agent = agentsData.agents.find(a => a.id === selectedNodes[0].id)
      if (agent) {
        setSelectedNode(agent as AgentNodeType)
      }
    } else {
      setSelectedNode(null)
    }
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSelectedNode(null)
  }, [])

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        className="bg-background"
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls className="!bg-card !border !border-border !rounded-lg !shadow-sm" />
        <MiniMap
          nodeStrokeColor="#6366f1"
          nodeColor={(node: Node) => {
            if (node.type === 'orchestrator') return '#8b5cf6'
            if (node.type === 'command') return '#a78bfa'
            const ws = (node.data as { workstream?: string }).workstream
            return ws ? workstreamColors[ws] || '#6366f1' : '#6366f1'
          }}
          className="!bg-card !border !border-border !rounded-lg"
        />
      </ReactFlow>

      <AgentsSidebar
        node={selectedNode}
        isOpen={!!selectedNode}
        onClose={handleCloseSidebar}
      />
    </div>
  )
}
