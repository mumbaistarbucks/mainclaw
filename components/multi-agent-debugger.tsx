"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronRight, Bot, Brain, Zap, Clock, DollarSign, AlertTriangle, CheckCircle, XCircle, Play, Save, Network, MessageSquare, PenToolIcon as Tool, Download, Search, Users, Activity, Eye, GitBranch, Layers, Timer, Hash, User, RefreshCw, Settings, Maximize2, Workflow, Target, TrendingUp, MemoryStick, Radio, FileText, ExternalLink, Bug, Database, Code, Shield, Server, Terminal, Pause, Lock, Unlock, Circle, ArrowRightLeft, Share2, GitMerge, Loader, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

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

// DAG structure for live agent coordination
const flowDAGs = {
  "flow-customer-support": {
    nodes: [
      {
        id: "router",
        name: "Request Router",
        type: "orchestrator", 
        status: "active",
        position: { x: 400, y: 80 },
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
        position: { x: 200, y: 220 },
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
        position: { x: 400, y: 360 },
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
        position: { x: 400, y: 500 },
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
        position: { x: 400, y: 80 },
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
        position: { x: 200, y: 220 },
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
        position: { x: 600, y: 220 },
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
        position: { x: 400, y: 360 },
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
        position: { x: 400, y: 80 },
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
        position: { x: 200, y: 220 },
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
        position: { x: 600, y: 220 },
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
        position: { x: 400, y: 360 },
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
        position: { x: 400, y: 80 },
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
        position: { x: 200, y: 220 },
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
        position: { x: 600, y: 220 },
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
        position: { x: 400, y: 360 },
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
  const router = useRouter()
  const [selectedFlow, setSelectedFlow] = useState(multiAgentFlows[0])
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Drag state
  const [dagStructure, setDagStructure] = useState(flowDAGs)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<any>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const dagContainerRef = useRef<any>(null)

  // Filter flows based on search and status
  const filteredFlows = multiAgentFlows.filter((flow) => {
    const matchesSearch =
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || flow.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-emerald-500" />
      case "bottleneck":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "stalled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "waiting":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "blocked":
        return <Lock className="h-4 w-4 text-red-500" />
      case "eligible":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Circle className="h-4 w-4 text-slate-400" />
    }
  }

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case "orchestrator":
        return <Network className="h-4 w-4 text-purple-600" />
      case "specialist":
        return <Brain className="h-4 w-4 text-blue-600" />
      case "validator":
        return <Shield className="h-4 w-4 text-green-600" />
      default:
        return <Bot className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
      case "bottleneck":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Bottleneck</Badge>
      case "stalled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Stalled</Badge>
      case "waiting":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Waiting</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>
      case "eligible":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Eligible</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleRefresh = () => {
    console.log("Refreshing flows...")
  }

  // Drag handlers
  const handleMouseDown = useCallback((e: any, node: any) => {
    e.preventDefault()
    e.stopPropagation()

    const rect = dagContainerRef.current?.getBoundingClientRect()
    if (!rect) return

    const offsetX = e.clientX - rect.left - node.position.x
    const offsetY = e.clientY - rect.top - node.position.y

    setIsDragging(true)
    setDraggedNode(node.id)
    setDragOffset({ x: offsetX, y: offsetY })
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
          position: {
            x: Math.max(0, Math.min(newX, 1100)),
            y: Math.max(0, Math.min(newY, 600)),
          },
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
        onClick={(e) => {
          if (!isDragging) {
            setSelectedAgent(node)
          }
        }}
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
              <div className="text-xs bg-amber-50 text-amber-700 font-medium rounded px-2 py-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Waiting: {node.waitingFor || node.blockedBy}
              </div>
            )}

            {node.waitingReason && (
              <div className="text-xs bg-blue-50 text-blue-700 font-medium rounded px-2 py-1 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                {node.waitingReason}
              </div>
            )}

            {node.stalledReason && (
              <div className="text-xs bg-red-50 text-red-700 font-medium rounded px-2 py-1">
                Stalled: {node.stalledReason} ({Math.floor(node.stalledFor / 60)}m)
                  </div>
            )}

            {node.stateOwnership && node.stateOwnership.length > 0 && (
              <div className="text-xs bg-purple-50 text-purple-700 font-medium rounded px-2 py-1 flex items-center">
                <Share2 className="h-3 w-3 mr-1" />
                Owns: {node.stateOwnership.join(", ")}
              </div>
            )}

            {node.actionEligibility && (
              <div className={`text-xs font-medium rounded px-2 py-1 ${
                node.actionEligibility === "eligible" ? "bg-green-50 text-green-700" :
                node.actionEligibility === "waiting" ? "bg-amber-50 text-amber-700" :
                node.actionEligibility === "blocked" ? "bg-red-50 text-red-700" :
                "bg-slate-50 text-slate-700"
              }`}>
                Eligibility: {node.actionEligibility}
              </div>
            )}

            {node.completionSignal && (
              <div className="text-xs bg-emerald-50 text-emerald-700 font-medium rounded px-2 py-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
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

      // Detect if this edge is part of a deadlock
      const isDeadlock = edge.from === "vuln-scanner" && edge.to === "compliance-checker" ||
                         edge.from === "compliance-checker" && edge.to === "vuln-scanner"

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

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100" style={{ zoom: 0.85 }}>
        {/* Collapsible Left Panel - Flows */}
        <div className={`bg-white border-r border-slate-200 flex flex-col shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 100 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
                    <path
                      d="M50 10 L85 30 L85 50 L70 60 L70 80 L50 90 L30 80 L30 60 L15 50 L15 30 Z"
                      fill="#EF4444"
                      stroke="#DC2626"
                      strokeWidth="2"
                    />
                    <path
                      d="M35 65 L50 75 L65 65 L50 95 Z"
                      fill="#EF4444"
                      stroke="#DC2626"
                      strokeWidth="2"
                    />
                    <path
                      d="M50 35 L65 45 L50 55 L35 45 Z"
                      fill="#EF4444"
                      stroke="#DC2626"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-slate-900">Splinter</h2>
                    <Workflow className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-sm text-slate-600">Live coordination view</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="hover:bg-white/50">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search flows..."
                  className="pl-10 h-10 bg-white/80 border-slate-200 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className="flex-1"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                  className="flex-1"
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "bottleneck" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("bottleneck")}
                  className="flex-1"
                >
                  Issues
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-3 bg-emerald-100 rounded-xl border border-emerald-200">
                <div className="text-lg font-bold text-emerald-700">
                  {multiAgentFlows.filter((f) => f.status === "active").length}
                </div>
                <div className="text-xs text-emerald-600 font-medium">Active</div>
              </div>
              <div className="text-center p-3 bg-amber-100 rounded-xl border border-amber-200">
                <div className="text-lg font-bold text-amber-700">
                  {multiAgentFlows.reduce((sum, f) => sum + f.bottlenecks, 0)}
                </div>
                <div className="text-xs text-amber-600 font-medium">Bottlenecks</div>
              </div>
              <div className="text-center p-3 bg-red-100 rounded-xl border border-red-200">
                <div className="text-lg font-bold text-red-700">
                  {multiAgentFlows.reduce((sum, f) => sum + f.deadlocks, 0)}
                </div>
                <div className="text-xs text-red-600 font-medium">Deadlocks</div>
              </div>
            </div>
          </div>

          {/* Flows List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredFlows.map((flow) => (
                <Card
                  key={flow.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    selectedFlow.id === flow.id
                      ? "border-purple-400 bg-purple-50 shadow-md"
                      : "border-slate-200 hover:border-purple-200"
                  }`}
                  onClick={() => setSelectedFlow(flow)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{flow.name}</h3>
                          {getStatusIcon(flow.status)}
                      </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{flow.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Agents</span>
                        <span className="font-medium">
                          <span className="text-emerald-600">{flow.activeAgents}</span> / {flow.totalAgents}
                          </span>
                        </div>
                      <Progress value={(flow.activeAgents / flow.totalAgents) * 100} className="h-1.5" />
                      </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <div className="text-xs text-slate-600">Throughput</div>
                        <div className="text-sm font-bold text-slate-900">{flow.throughput}/min</div>
                        </div>
                      <div className="bg-slate-50 rounded-lg p-2">
                        <div className="text-xs text-slate-600">Avg Wait</div>
                        <div className="text-sm font-bold text-slate-900">{flow.avgWaitTime}s</div>
                      </div>
                    </div>

                    {(flow.bottlenecks > 0 || flow.deadlocks > 0) && (
                      <div className="flex items-center gap-2 mt-3">
                        {flow.bottlenecks > 0 && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {flow.bottlenecks} bottleneck{flow.bottlenecks > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {flow.deadlocks > 0 && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            {flow.deadlocks} deadlock{flow.deadlocks > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Panel - Flow Visualization */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Compact Header */}
          <div className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Splinter Logo */}
                <div className="flex items-center space-x-2">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 100 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
                      <path
                        d="M50 10 L85 30 L85 50 L70 60 L70 80 L50 90 L30 80 L30 60 L15 50 L15 30 Z"
                        fill="#EF4444"
                        stroke="#DC2626"
                        strokeWidth="2"
                      />
                      <path
                        d="M35 65 L50 75 L65 65 L50 95 Z"
                        fill="#EF4444"
                        stroke="#DC2626"
                        strokeWidth="2"
                      />
                      <path
                        d="M50 35 L65 45 L50 55 L35 45 Z"
                        fill="#EF4444"
                        stroke="#DC2626"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-slate-900 tracking-tight">Splinter</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
      <Button
        variant="outline"
        size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hover:bg-slate-50"
      >
                  <Workflow className="h-4 w-4 mr-2" />
                  {sidebarOpen ? 'Hide' : 'Flows'}
      </Button>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{selectedFlow.name}</h1>
    </div>
  </div>
              <div className="flex items-center space-x-3">
                {/* Compact Metrics */}
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">{selectedFlow.activeAgents}/{selectedFlow.totalAgents}</span>
                    <span className="text-slate-600">agents</span>
        </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-700">{selectedFlow.throughput}</span>
                    <span className="text-slate-600">/min</span>
        </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-700">{selectedFlow.avgWaitTime}s</span>
                    <span className="text-slate-600">wait</span>
        </div>
                  {selectedFlow.bottlenecks > 0 && (
                    <>
                      <div className="h-4 w-px bg-slate-200" />
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {selectedFlow.bottlenecks}
                      </Badge>
                    </>
                  )}
                  {selectedFlow.deadlocks > 0 && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      {selectedFlow.deadlocks}
                    </Badge>
                  )}
        </div>
                <div className="h-4 w-px bg-slate-200" />
                {getStatusBadge(selectedFlow.status)}
        </div>
        </div>
        </div>

          {/* DAG Visualization */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full relative bg-gradient-to-br from-slate-50 to-slate-100">
              {/* Compact Legend & Controls */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-3">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Play className="h-3 w-3 text-emerald-500" />
                      <span className="text-slate-600">Active</span>
        </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-slate-600">Waiting</span>
  </div>
                    <div className="flex items-center space-x-1">
                      <Lock className="h-3 w-3 text-red-500" />
                      <span className="text-slate-600">Blocked</span>
</div>
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span className="text-slate-600">Stalled</span>
            </div>
                    <div className="h-3 w-px bg-slate-200 mx-1" />
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Maximize2 className="h-3 w-3 mr-1" />
                      Fit
                  </Button>
                    </div>
                  </div>
                </div>

              {/* DAG Container */}
                <div
                  ref={dagContainerRef}
                  className="relative w-full h-full overflow-auto p-8"
                  style={{ cursor: isDragging ? "grabbing" : "default" }}
                >
                  <div className="relative" style={{ width: "1200px", height: "700px" }}>
                    {/* Render Edges */}
                  {dagStructure[selectedFlow.id as keyof typeof dagStructure] &&
                    renderDAGEdges(dagStructure[selectedFlow.id as keyof typeof dagStructure].edges, dagStructure[selectedFlow.id as keyof typeof dagStructure].nodes)}

                    {/* Render Nodes */}
                  {dagStructure[selectedFlow.id as keyof typeof dagStructure] &&
                    dagStructure[selectedFlow.id as keyof typeof dagStructure].nodes.map((node: any) => renderDAGNode(node))}
                  </div>
                </div>

              {/* Compact Shared State & Coordination Panel */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg">
                <div className="p-4">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Shared State */}
                    <div className="col-span-5">
                      <div className="flex items-center space-x-2 mb-3">
                        <Share2 className="h-4 w-4 text-purple-600" />
                        <h3 className="font-semibold text-sm text-slate-900">Shared State & Ownership</h3>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          OSS
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(selectedFlow.sharedState).map(([key, value]) => {
                          const owner = (selectedFlow.stateOwnership as any)?.[key] || "none"
                          return (
                            <div key={key} className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-700 truncate">{key.replace(/_/g, ' ')}</span>
                                {value === "active" || value === "flowing" || value === "synced" || value === "passing" ? (
                                  <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                ) : value === "blocked" || value === "stalled" || value === "circular" ? (
                                  <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                                ) : (
                                  <Clock className="h-3 w-3 text-amber-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className={`text-xs font-bold truncate mb-1 ${
                                value === "active" || value === "flowing" || value === "synced" || value === "passing" ? "text-emerald-700" :
                                value === "blocked" || value === "stalled" || value === "circular" ? "text-red-700" :
                                "text-amber-700"
                              }`}>
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </div>
                              {owner !== "none" && (
                                <div className="text-xs text-purple-600 font-medium truncate flex items-center">
                                  <Lock className="h-2.5 w-2.5 mr-1" />
                                  {owner}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {selectedFlow.checkpoints && selectedFlow.checkpoints.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-slate-700">Checkpoints ({selectedFlow.checkpoints.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedFlow.checkpoints.map((cp: string) => (
                              <Badge key={cp} variant="outline" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                {cp.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedFlow.handoffs > 0 && (
                        <div className="mt-2 flex items-center space-x-2 text-xs text-slate-600">
                          <ArrowRightLeft className="h-3 w-3" />
                          <span>{selectedFlow.handoffs} handoff{selectedFlow.handoffs > 1 ? 's' : ''} completed</span>
                        </div>
                      )}
                    </div>

                    {/* Selected Agent Info */}
                {selectedAgent ? (
                      <div className="col-span-7 border-l border-slate-200 pl-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Bot className="h-4 w-4 text-blue-600" />
                          <h3 className="font-semibold text-sm text-slate-900">Agent Coordination</h3>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            Paid
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg">
                            {getAgentTypeIcon(selectedAgent.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-slate-900 truncate">{selectedAgent.name}</h4>
                            <div className="flex items-center space-x-2 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">{selectedAgent.type}</Badge>
                              {getStatusBadge(selectedAgent.status)}
                              <span className="text-xs text-slate-600">
                                {selectedAgent.state} • Queue: <span className="font-medium">{selectedAgent.queueSize}</span>
                              </span>
                            </div>
                            {selectedAgent.waitingReason && (
                              <div className="mt-2 text-xs bg-blue-50 text-blue-700 rounded px-2 py-1 flex items-center">
                                <Info className="h-3 w-3 mr-1" />
                                Waiting: {selectedAgent.waitingReason}
                              </div>
                            )}
                            {selectedAgent.chainAwareness && selectedAgent.chainAwareness.length > 0 && (
                              <div className="mt-2 text-xs text-slate-600">
                                <span className="font-medium">Chain Awareness:</span> {selectedAgent.chainAwareness.join(" → ")}
                              </div>
                            )}
                            {selectedAgent.goalAwareness && (
                              <div className="mt-1 text-xs text-slate-600">
                                <span className="font-medium">Goal:</span> {selectedAgent.goalAwareness.replace(/_/g, ' ')}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Badge variant="outline" className="text-xs">
                              <Share2 className="h-3 w-3 mr-1" />
                              {selectedAgent.sharedStateAccess?.length || 0} states
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {selectedAgent.checkpoints?.length || 0} checkpoints
                            </Badge>
                            {selectedAgent.stateOwnership && selectedAgent.stateOwnership.length > 0 && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                <Lock className="h-3 w-3 mr-1" />
                                Owns {selectedAgent.stateOwnership.length} state{selectedAgent.stateOwnership.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {selectedAgent.actionEligibility && (
                              <Badge variant="outline" className={`text-xs ${
                                selectedAgent.actionEligibility === "eligible" ? "bg-green-50 text-green-700 border-green-200" :
                                selectedAgent.actionEligibility === "waiting" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-red-50 text-red-700 border-red-200"
                              }`}>
                                {selectedAgent.actionEligibility}
                              </Badge>
                            )}
                            {selectedAgent.completionSignal && (
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                                      </div>
                                    </div>
                    ) : (
                      <div className="col-span-7 border-l border-slate-200 pl-4 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Click an agent to view coordination details</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                          </div>
                                          </div>
                                            </div>
                                          </div>
                                      </div>
      </div>
    </TooltipProvider>
  )
}
