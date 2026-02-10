"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"
import { ChevronRight, Bot, Brain, Clock, AlertTriangle, CheckCircle, XCircle, Play, Network, Search, Activity, Eye, Maximize2, Target, Lock, Circle, Share2, Info, Loader, Cloud, Pause, RefreshCw, Radio, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

// Live multi-agent flows with coordination status
const multiAgentFlows = [
  {
    id: "flow-customer-support",
    name: "Customer Support Flow",
    description: "Handle customer inquiries with coordinated agents",
    status: "active",
    activeAgents: 3,
    totalAgents: 5,
    throughput: 45,
    avgWaitTime: 1.2,
    bottlenecks: 1,
    deadlocks: 0,
    sharedState: {
      customerContext: "active",
      conversationHistory: "synced",
      ticketQueue: 12
    },
    stateOwnership: {
      customerContext: "context-manager",
      conversationHistory: "response-generator"
    },
    checkpoints: ["initial_routing", "intent_classified", "response_ready"],
    handoffs: 3,
    waitingReasons: ["context-manager: waiting_for_router_data"]
  },
  {
    id: "flow-code-review",
    name: "Code Review Pipeline",
    description: "Multi-agent code analysis with state coordination",
    status: "bottleneck",
    activeAgents: 2,
    totalAgents: 4,
    throughput: 12,
    avgWaitTime: 5.7,
    bottlenecks: 2,
    deadlocks: 0,
    sharedState: {
      codeQueue: "blocked",
      reviewResults: "partial",
      approvalsPending: 8
    },
    stateOwnership: {
      codeQueue: "orchestrator",
      reviewResults: "syntax-checker"
    },
    checkpoints: ["code_received", "syntax_checked"],
    handoffs: 2,
    waitingReasons: ["merge-reviewer: waiting_for_security_scanner", "security-scanner: blocked_on_dependency"]
  },
  {
    id: "flow-data-processing",
    name: "Data Processing Pipeline",
    description: "ETL workflow with sequential pipeline coordination",
    status: "active",
    activeAgents: 4,
    totalAgents: 4,
    throughput: 120,
    avgWaitTime: 0.8,
    bottlenecks: 0,
    deadlocks: 0,
    sharedState: {
      dataBuffer: "flowing",
      validationResults: "passing",
      recordsProcessed: 12450
    },
    stateOwnership: {
      dataBuffer: "ingestion",
      validationResults: "validator",
      recordsProcessed: "aggregator"
    },
    checkpoints: ["data_received", "validation_complete", "transformation_complete", "aggregation_complete"],
    handoffs: 4,
    waitingReasons: []
  },
  {
    id: "flow-security-scan",
    name: "Security Scanning Flow",
    description: "Coordinated scanning with deadlock detection",
    status: "stalled",
    activeAgents: 1,
    totalAgents: 5,
    throughput: 2,
    avgWaitTime: 15.3,
    bottlenecks: 1,
    deadlocks: 1,
    sharedState: {
      scanQueue: "stalled",
      findings: "blocked",
      dependencies: "circular"
    },
    stateOwnership: {
      scanQueue: "scanner-orchestrator",
      findings: "vuln-scanner"
    },
    checkpoints: ["scan_initiated"],
    handoffs: 0,
    waitingReasons: ["vuln-scanner: circular_dependency (stalled 920s)", "compliance-checker: waiting_for_vuln_scanner"]
  },
]

// DAG structure — positions spread out for readability
const flowDAGs: Record<string, { nodes: any[]; edges: any[] }> = {
  "flow-customer-support": {
    nodes: [
      {
        id: "router",
        name: "Request Router",
        type: "orchestrator",
        status: "active",
        position: { x: 360, y: 40 },
        state: "processing",
        queueSize: 5,
        throughput: 45,
        checkpoints: ["initial_routing"],
        sharedStateAccess: ["customerContext", "conversationHistory"],
        stateOwnership: ["customerContext"],
        children: ["intent-analyzer", "context-manager"],
        waitingReason: null,
        chainAwareness: ["router", "intent-analyzer", "context-manager"],
        goalAwareness: "route_customer_inquiry",
        actionEligibility: "eligible",
        completionSignal: false
      },
      {
        id: "intent-analyzer",
        name: "Intent Analyzer",
        type: "specialist",
        status: "active",
        position: { x: 120, y: 220 },
        state: "processing",
        queueSize: 3,
        throughput: 38,
        checkpoints: ["intent_classified"],
        sharedStateAccess: ["conversationHistory"],
        children: ["response-generator"]
      },
      {
        id: "context-manager",
        name: "Context Manager",
        type: "specialist",
        status: "waiting",
        position: { x: 600, y: 220 },
        state: "waiting_for_data",
        queueSize: 0,
        throughput: 22,
        waitingFor: "router",
        waitingReason: "waiting_for_router_data",
        checkpoints: ["context_loaded"],
        sharedStateAccess: ["customerContext", "ticketQueue"],
        stateOwnership: ["customerContext"],
        children: ["response-generator"],
        chainAwareness: ["router", "context-manager", "response-generator"],
        goalAwareness: "load_customer_context",
        actionEligibility: "waiting",
        completionSignal: false
      },
      {
        id: "response-generator",
        name: "Response Generator",
        type: "specialist",
        status: "active",
        position: { x: 360, y: 400 },
        state: "generating",
        queueSize: 7,
        throughput: 35,
        checkpoints: ["response_ready"],
        sharedStateAccess: ["conversationHistory"],
        stateOwnership: ["conversationHistory"],
        children: ["quality-checker"],
        chainAwareness: ["intent-analyzer", "context-manager", "response-generator", "quality-checker"],
        goalAwareness: "generate_response",
        actionEligibility: "eligible",
        completionSignal: true
      },
      {
        id: "quality-checker",
        name: "Quality Checker",
        type: "validator",
        status: "eligible",
        position: { x: 360, y: 570 },
        state: "ready",
        queueSize: 0,
        throughput: 40,
        checkpoints: ["quality_verified"],
        sharedStateAccess: [],
        stateOwnership: [],
        children: [],
        chainAwareness: ["response-generator", "quality-checker"],
        goalAwareness: "verify_quality",
        actionEligibility: "eligible",
        completionSignal: true
      }
    ],
    edges: [
      { from: "router", to: "intent-analyzer" },
      { from: "router", to: "context-manager" },
      { from: "intent-analyzer", to: "response-generator" },
      { from: "context-manager", to: "response-generator" },
      { from: "response-generator", to: "quality-checker" }
    ]
  },
  "flow-code-review": {
    nodes: [
      {
        id: "orchestrator",
        name: "Review Orchestrator",
        type: "orchestrator",
        status: "active",
        position: { x: 360, y: 40 },
        state: "coordinating",
        queueSize: 8,
        throughput: 12,
        checkpoints: ["code_received"],
        sharedStateAccess: ["codeQueue", "reviewResults"],
        children: ["syntax-checker", "security-scanner"]
      },
      {
        id: "syntax-checker",
        name: "Syntax Checker",
        type: "specialist",
        status: "active",
        position: { x: 120, y: 240 },
        state: "checking",
        queueSize: 4,
        throughput: 25,
        checkpoints: ["syntax_checked"],
        sharedStateAccess: ["reviewResults"],
        children: ["merge-reviewer"]
      },
      {
        id: "security-scanner",
        name: "Security Scanner",
        type: "specialist",
        status: "blocked",
        position: { x: 600, y: 240 },
        state: "blocked_on_dependency",
        queueSize: 8,
        throughput: 5,
        blockedBy: "external_api",
        waitingReason: "blocked_on_external_api",
        checkpoints: ["security_scanned"],
        sharedStateAccess: ["reviewResults"],
        stateOwnership: [],
        children: ["merge-reviewer"],
        chainAwareness: ["orchestrator", "security-scanner", "merge-reviewer"],
        goalAwareness: "scan_security",
        actionEligibility: "blocked",
        completionSignal: false
      },
      {
        id: "merge-reviewer",
        name: "Merge Reviewer",
        type: "specialist",
        status: "waiting",
        position: { x: 360, y: 440 },
        state: "waiting_for_all",
        queueSize: 0,
        throughput: 8,
        waitingFor: "security-scanner",
        waitingReason: "waiting_for_security_scanner",
        checkpoints: ["merge_approved"],
        sharedStateAccess: ["approvalsPending"],
        stateOwnership: ["approvalsPending"],
        children: [],
        chainAwareness: ["syntax-checker", "security-scanner", "merge-reviewer"],
        goalAwareness: "approve_merge",
        actionEligibility: "waiting",
        completionSignal: false
      }
    ],
    edges: [
      { from: "orchestrator", to: "syntax-checker" },
      { from: "orchestrator", to: "security-scanner" },
      { from: "syntax-checker", to: "merge-reviewer" },
      { from: "security-scanner", to: "merge-reviewer" }
    ]
  },
  "flow-data-processing": {
    nodes: [
      {
        id: "ingestion",
        name: "Data Ingestion",
        type: "orchestrator",
        status: "active",
        position: { x: 360, y: 40 },
        state: "ingesting",
        queueSize: 120,
        throughput: 450,
        checkpoints: ["data_received"],
        sharedStateAccess: ["dataBuffer"],
        children: ["validator", "transformer"]
      },
      {
        id: "validator",
        name: "Data Validator",
        type: "specialist",
        status: "active",
        position: { x: 120, y: 240 },
        state: "validating",
        queueSize: 85,
        throughput: 380,
        checkpoints: ["validation_complete"],
        sharedStateAccess: ["validationResults"],
        children: ["aggregator"]
      },
      {
        id: "transformer",
        name: "Data Transformer",
        type: "specialist",
        status: "active",
        position: { x: 600, y: 240 },
        state: "transforming",
        queueSize: 92,
        throughput: 420,
        checkpoints: ["transformation_complete"],
        sharedStateAccess: ["dataBuffer"],
        children: ["aggregator"]
      },
      {
        id: "aggregator",
        name: "Data Aggregator",
        type: "specialist",
        status: "active",
        position: { x: 360, y: 440 },
        state: "aggregating",
        queueSize: 45,
        throughput: 350,
        checkpoints: ["aggregation_complete"],
        sharedStateAccess: ["recordsProcessed"],
        children: []
      }
    ],
    edges: [
      { from: "ingestion", to: "validator" },
      { from: "ingestion", to: "transformer" },
      { from: "validator", to: "aggregator" },
      { from: "transformer", to: "aggregator" }
    ]
  },
  "flow-security-scan": {
    nodes: [
      {
        id: "scanner-orchestrator",
        name: "Scan Orchestrator",
        type: "orchestrator",
        status: "active",
        position: { x: 360, y: 40 },
        state: "coordinating",
        queueSize: 15,
        throughput: 2,
        checkpoints: ["scan_initiated"],
        sharedStateAccess: ["scanQueue", "findings"],
        children: ["vuln-scanner", "compliance-checker"]
      },
      {
        id: "vuln-scanner",
        name: "Vulnerability Scanner",
        type: "specialist",
        status: "stalled",
        position: { x: 120, y: 240 },
        state: "stalled",
        queueSize: 15,
        throughput: 0,
        stalledReason: "circular_dependency",
        stalledFor: 920,
        waitingReason: "circular_dependency_with_compliance_checker",
        checkpoints: [],
        sharedStateAccess: ["findings", "dependencies"],
        stateOwnership: ["findings"],
        children: ["compliance-checker"],
        chainAwareness: ["scanner-orchestrator", "vuln-scanner", "compliance-checker"],
        goalAwareness: "scan_vulnerabilities",
        actionEligibility: "stalled",
        completionSignal: false
      },
      {
        id: "compliance-checker",
        name: "Compliance Checker",
        type: "specialist",
        status: "blocked",
        position: { x: 600, y: 240 },
        state: "waiting_for_dependency",
        queueSize: 0,
        throughput: 0,
        blockedBy: "vuln-scanner",
        waitingReason: "waiting_for_vuln_scanner",
        checkpoints: [],
        sharedStateAccess: ["findings"],
        stateOwnership: [],
        children: ["vuln-scanner"],
        chainAwareness: ["scanner-orchestrator", "vuln-scanner", "compliance-checker"],
        goalAwareness: "check_compliance",
        actionEligibility: "blocked",
        completionSignal: false
      },
      {
        id: "report-generator",
        name: "Report Generator",
        type: "specialist",
        status: "eligible",
        position: { x: 360, y: 440 },
        state: "ready",
        queueSize: 0,
        throughput: 0,
        checkpoints: [],
        sharedStateAccess: ["findings"],
        children: []
      }
    ],
    edges: [
      { from: "scanner-orchestrator", to: "vuln-scanner" },
      { from: "scanner-orchestrator", to: "compliance-checker" },
      { from: "vuln-scanner", to: "compliance-checker" },
      { from: "compliance-checker", to: "vuln-scanner" },
      { from: "compliance-checker", to: "report-generator" }
    ]
  }
}

export function MultiAgentDebugger() {
  const [selectedFlow, setSelectedFlow] = useState(multiAgentFlows[0])
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Drag state
  const [dagStructure, setDagStructure] = useState(flowDAGs)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<any>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const dagContainerRef = useRef<any>(null)

  const filteredFlows = multiAgentFlows.filter((flow) =>
    flow.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="h-4 w-4 text-emerald-500" />
      case "bottleneck": return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "stalled": return <XCircle className="h-4 w-4 text-red-500" />
      case "waiting": return <Clock className="h-4 w-4 text-blue-500" />
      case "blocked": return <Lock className="h-4 w-4 text-red-500" />
      case "eligible": return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Circle className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
      case "bottleneck": return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Bottleneck</Badge>
      case "stalled": return <Badge className="bg-red-100 text-red-800 border-red-200">Stalled</Badge>
      case "waiting": return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Waiting</Badge>
      case "blocked": return <Badge className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>
      case "eligible": return <Badge className="bg-green-100 text-green-800 border-green-200">Eligible</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case "orchestrator": return <Network className="h-4 w-4 text-purple-600" />
      case "specialist": return <Brain className="h-4 w-4 text-blue-600" />
      case "validator": return <Shield className="h-4 w-4 text-green-600" />
      default: return <Bot className="h-4 w-4 text-slate-500" />
    }
  }

  // Drag handlers
  const handleMouseDown = useCallback((e: any, node: any) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = dagContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    setIsDragging(true)
    setDraggedNode(node.id)
    setDragOffset({ x: e.clientX - rect.left - node.position.x, y: e.clientY - rect.top - node.position.y })
  }, [])

  const handleMouseMove = useCallback(
    (e: any) => {
      if (!isDragging || !draggedNode) return
      const rect = dagContainerRef.current?.getBoundingClientRect()
      if (!rect) return
      const newX = e.clientX - rect.left - dragOffset.x
      const newY = e.clientY - rect.top - dragOffset.y
      setDagStructure((prev: any) => {
        const newStructure = { ...prev }
        const flowNodes = newStructure[selectedFlow.id as keyof typeof prev]?.nodes
        if (!flowNodes) return prev
        const nodeIndex = flowNodes.findIndex((n: any) => n.id === draggedNode)
        if (nodeIndex === -1) return prev
        flowNodes[nodeIndex] = {
          ...flowNodes[nodeIndex],
          position: { x: Math.max(0, Math.min(newX, 1100)), y: Math.max(0, Math.min(newY, 600)) },
        }
        return newStructure
      })
    },
    [isDragging, draggedNode, dragOffset, selectedFlow.id],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedNode(null)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const renderDAGNode = (node: any) => {
    const isSelected = selectedAgent?.id === node.id
    const isBeingDragged = draggedNode === node.id

    return (
      <div
        key={node.id}
        className={`absolute bg-white rounded-xl shadow-lg border-2 transition-all duration-200 select-none ${
          isBeingDragged ? "cursor-grabbing scale-105 shadow-2xl z-50" : "cursor-grab hover:shadow-xl hover:scale-105"
        } ${
          node.status === "blocked" || node.status === "stalled"
            ? "border-red-300 bg-gradient-to-br from-red-50 to-red-100"
            : node.status === "active"
              ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100"
              : node.status === "waiting"
                ? "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100"
              : "border-slate-300 bg-gradient-to-br from-slate-50 to-white"
        } ${isSelected ? "ring-4 ring-blue-400 ring-opacity-50 scale-105" : ""}`}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: "220px",
          minHeight: "140px",
        }}
        onMouseDown={(e) => handleMouseDown(e, node)}
        onClick={() => { if (!isDragging) setSelectedAgent(node) }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${
                node.status === "active" ? "bg-emerald-100" :
                node.status === "blocked" || node.status === "stalled" ? "bg-red-100" :
                node.status === "waiting" ? "bg-blue-100" : "bg-slate-100"
              }`}>
                {getAgentTypeIcon(node.type)}
              </div>
              {getStatusIcon(node.status)}
            </div>
            <Tooltip>
              <TooltipTrigger>
                {node.status === "active" && <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />}
                {node.status === "stalled" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {node.status === "blocked" && <Lock className="h-4 w-4 text-red-500" />}
                {node.status === "waiting" && <Loader className="h-4 w-4 text-blue-500 animate-spin" />}
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{node.state}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm leading-tight">{node.name}</h4>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Queue</span>
                <Badge variant="outline" className="text-xs">{node.queueSize} items</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Throughput</span>
                <span className="font-medium">{node.throughput}/min</span>
              </div>
            </div>

            {node.checkpoints && node.checkpoints.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {node.checkpoints.map((cp: any) => (
                  <Badge key={cp} variant="outline" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="h-2.5 w-2.5 mr-1" />
                    {cp.split("_")[0]}
                  </Badge>
                ))}
              </div>
            )}

            {(node.waitingFor || node.blockedBy) && (
              <div className="text-xs bg-amber-50 text-amber-700 rounded-lg px-2 py-1 truncate">
                <Clock className="h-2.5 w-2.5 inline mr-0.5" />
                {node.waitingFor || node.blockedBy}
              </div>
            )}

            {node.stalledReason && (
              <div className="text-xs bg-red-50 text-red-700 rounded-lg px-2 py-1 truncate">
                Stalled: {node.stalledReason} ({Math.floor(node.stalledFor / 60)}m)
              </div>
            )}

            {node.stateOwnership && node.stateOwnership.length > 0 && (
              <div className="text-xs text-purple-600 truncate">
                <Lock className="h-2.5 w-2.5 inline mr-0.5" />
                {node.stateOwnership.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderDAGEdges = (edges: any[], nodes: any[]) => {
    return edges.map((edge: any, index: number) => {
      const fromNode = nodes.find((n: any) => n.id === edge.from)
      const toNode = nodes.find((n: any) => n.id === edge.to)
      if (!fromNode || !toNode) return null

      const fromX = fromNode.position.x + 110
      const fromY = fromNode.position.y + 70
      const toX = toNode.position.x + 110
      const toY = toNode.position.y + 70

      const isDeadlock = (edge.from === "vuln-scanner" && edge.to === "compliance-checker") ||
                         (edge.from === "compliance-checker" && edge.to === "vuln-scanner")

      return (
        <svg
          key={index}
          className="absolute pointer-events-none"
          style={{
            left: Math.min(fromX, toX) - 20,
            top: Math.min(fromY, toY) - 20,
            width: Math.abs(toX - fromX) + 40,
            height: Math.abs(toY - fromY) + 40,
          }}
        >
          <defs>
            <marker
              id={`arrowhead-${index}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={isDeadlock ? "#ef4444" : "#6366f1"} />
            </marker>
          </defs>
          <line
            x1={fromX - Math.min(fromX, toX) + 20}
            y1={fromY - Math.min(fromY, toY) + 20}
            x2={toX - Math.min(fromX, toX) + 20}
            y2={toY - Math.min(fromY, toY) + 20}
            stroke={isDeadlock ? "#ef4444" : "#6366f1"}
            strokeWidth="3"
            strokeDasharray={isDeadlock ? "8,4" : "5,5"}
            markerEnd={`url(#arrowhead-${index})`}
            className={isDeadlock ? "animate-pulse" : ""}
          />
        </svg>
      )
    })
  }

  const currentDAG = dagStructure[selectedFlow.id as keyof typeof dagStructure]

  return (
    <TooltipProvider>
      <div className="flex h-full">
        {/* Left Sidebar — compact flow list */}
        <div className="w-56 border-r bg-white flex flex-col shrink-0">
          {/* Header */}
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-4 w-4 text-[var(--splinter-red)]" />
              <span className="font-semibold text-sm">Coordination</span>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200" variant="outline">
                <Cloud className="h-3 w-3 mr-1" />
                Cloud
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search flows..."
                className="pl-8 h-7 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Flow list */}
          <div className="flex-1 overflow-y-auto">
            {filteredFlows.map((flow) => (
              <button
                key={flow.id}
                className={`w-full text-left p-3 border-b transition-colors ${
                  selectedFlow.id === flow.id ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-gray-50 border-l-2 border-l-transparent"
                }`}
                onClick={() => { setSelectedFlow(flow); setSelectedAgent(null) }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  {getStatusIcon(flow.status)}
                  <span className="font-medium text-xs truncate">{flow.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 pl-5">
                  <span>{flow.activeAgents}/{flow.totalAgents} agents</span>
                  <span>{flow.throughput}/min</span>
                </div>
                {(flow.bottlenecks > 0 || flow.deadlocks > 0) && (
                  <div className="flex gap-1.5 mt-1 pl-5">
                    {flow.bottlenecks > 0 && (
                      <span className="text-xs text-amber-600">{flow.bottlenecks} bottleneck</span>
                    )}
                    {flow.deadlocks > 0 && (
                      <span className="text-xs text-red-600">{flow.deadlocks} deadlock</span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="p-3 border-t bg-gray-50 text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Active flows</span>
              <span className="font-medium">{multiAgentFlows.filter(f => f.status === "active").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total bottlenecks</span>
              <span className="font-medium text-amber-600">{multiAgentFlows.reduce((s, f) => s + f.bottlenecks, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total deadlocks</span>
              <span className="font-medium text-red-600">{multiAgentFlows.reduce((s, f) => s + f.deadlocks, 0)}</span>
            </div>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm">{selectedFlow.name}</span>
              {getStatusBadge(selectedFlow.status)}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span><span className="font-medium text-green-700">{selectedFlow.activeAgents}</span>/{selectedFlow.totalAgents} agents</span>
              <Separator orientation="vertical" className="h-3" />
              <span><span className="font-medium">{selectedFlow.throughput}</span>/min</span>
              <Separator orientation="vertical" className="h-3" />
              <span>wait <span className="font-medium">{selectedFlow.avgWaitTime}s</span></span>
              {selectedFlow.bottlenecks > 0 && (
                <>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="text-amber-600 font-medium">{selectedFlow.bottlenecks} bottleneck{selectedFlow.bottlenecks > 1 ? "s" : ""}</span>
                </>
              )}
              {selectedFlow.deadlocks > 0 && (
                <>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="text-red-600 font-medium">{selectedFlow.deadlocks} deadlock</span>
                </>
              )}
            </div>
          </div>

          {/* DAG + detail split */}
          <div className="flex-1 flex overflow-hidden">
            {/* DAG */}
            <div className="flex-1 relative bg-gray-50 overflow-auto">
              {/* Legend */}
              <div className="absolute top-3 left-3 z-10 bg-white/90 border rounded px-2.5 py-1.5 flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Play className="h-3 w-3 text-green-600" />Active</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-blue-600" />Waiting</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-red-600" />Blocked</span>
                <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-amber-600" />Stalled</span>
              </div>

              <div
                ref={dagContainerRef}
                className="relative w-full h-full p-6"
                style={{ cursor: isDragging ? "grabbing" : "default", minHeight: "700px", minWidth: "1200px" }}
              >
                {currentDAG && renderDAGEdges(currentDAG.edges, currentDAG.nodes)}
                {currentDAG && currentDAG.nodes.map((node: any) => renderDAGNode(node))}
              </div>
            </div>

            {/* Right detail panel — agent coordination + shared state */}
            <div className="w-72 border-l bg-white flex flex-col shrink-0 overflow-y-auto">
              {/* Shared State */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-1.5 mb-2">
                  <Share2 className="h-3.5 w-3.5 text-purple-600" />
                  <span className="font-medium text-xs">Shared State</span>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(selectedFlow.sharedState).map(([key, value]) => {
                    const owner = (selectedFlow.stateOwnership as any)?.[key]
                    const isHealthy = value === "active" || value === "flowing" || value === "synced" || value === "passing"
                    const isBad = value === "blocked" || value === "stalled" || value === "circular"
                    return (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isHealthy ? <CheckCircle className="h-3 w-3 text-green-500 shrink-0" /> :
                           isBad ? <XCircle className="h-3 w-3 text-red-500 shrink-0" /> :
                           <Clock className="h-3 w-3 text-amber-500 shrink-0" />}
                          <span className="text-gray-600 truncate">{key.replace(/_/g, ' ')}</span>
                        </div>
                        <span className={`font-mono ${isHealthy ? "text-green-700" : isBad ? "text-red-700" : "text-amber-700"}`}>
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {Object.entries(selectedFlow.stateOwnership).length > 0 && (
                  <div className="mt-2 pt-2 border-t space-y-1">
                    <span className="text-xs text-gray-500 font-medium">Ownership</span>
                    {Object.entries(selectedFlow.stateOwnership).map(([key, owner]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 truncate">{key.replace(/_/g, ' ')}</span>
                        <span className="text-purple-600 font-mono text-xs">{owner as string}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkpoints */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                  <span className="font-medium text-xs">Checkpoints</span>
                  <span className="text-xs text-gray-400">({selectedFlow.checkpoints.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedFlow.checkpoints.map((cp: string) => (
                    <Badge key={cp} variant="outline" className="text-xs px-1.5 py-0 bg-blue-50 text-blue-700 border-blue-200">
                      {cp.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
                {selectedFlow.handoffs > 0 && (
                  <div className="mt-1.5 text-xs text-gray-500">
                    {selectedFlow.handoffs} handoff{selectedFlow.handoffs > 1 ? 's' : ''} completed
                  </div>
                )}
              </div>

              {/* Waiting Reasons */}
              {selectedFlow.waitingReasons.length > 0 && (
                <div className="p-3 border-b">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Pause className="h-3.5 w-3.5 text-amber-600" />
                    <span className="font-medium text-xs">Wait Reasons</span>
                  </div>
                  <div className="space-y-1">
                    {selectedFlow.waitingReasons.map((wr: string, i: number) => (
                      <div key={i} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 font-mono">
                        {wr}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Agent */}
              {selectedAgent ? (
                <div className="p-3 flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bot className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-medium text-xs">Agent Detail</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium text-sm">{selectedAgent.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{selectedAgent.type}</Badge>
                        {getStatusBadge(selectedAgent.status)}
                      </div>
                    </div>

                    <div className="text-xs space-y-1 text-gray-600">
                      <div className="flex justify-between">
                        <span>State</span>
                        <span className="font-mono">{selectedAgent.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Queue</span>
                        <span className="font-mono">{selectedAgent.queueSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Throughput</span>
                        <span className="font-mono">{selectedAgent.throughput}/min</span>
                      </div>
                    </div>

                    {selectedAgent.waitingReason && (
                      <div className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-1">
                        <Info className="h-3 w-3 inline mr-1" />
                        {selectedAgent.waitingReason}
                      </div>
                    )}

                    {selectedAgent.chainAwareness && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Chain:</span>
                        <div className="font-mono mt-0.5">{selectedAgent.chainAwareness.join(" → ")}</div>
                      </div>
                    )}

                    {selectedAgent.goalAwareness && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Goal:</span> {selectedAgent.goalAwareness.replace(/_/g, ' ')}
                      </div>
                    )}

                    {selectedAgent.actionEligibility && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">Eligibility:</span>
                        <Badge variant="outline" className={`text-xs ${
                          selectedAgent.actionEligibility === "eligible" ? "bg-green-50 text-green-700 border-green-200" :
                          selectedAgent.actionEligibility === "waiting" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {selectedAgent.actionEligibility}
                        </Badge>
                      </div>
                    )}

                    {selectedAgent.sharedStateAccess && selectedAgent.sharedStateAccess.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Reads:</span> {selectedAgent.sharedStateAccess.join(", ")}
                      </div>
                    )}

                    {selectedAgent.stateOwnership && selectedAgent.stateOwnership.length > 0 && (
                      <div className="text-xs text-purple-600">
                        <Lock className="h-3 w-3 inline mr-0.5" />
                        <span className="font-medium">Owns:</span> {selectedAgent.stateOwnership.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Bot className="h-6 w-6 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Click an agent node</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
