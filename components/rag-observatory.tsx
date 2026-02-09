"use client"

import React from "react"

import { useState } from "react"
import {
  Search,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Edit,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  FileText,
  GitCompare,
  BarChart3,
  TestTube,
  Play,
  Eye,
  Link,
  Flag,
  Copy,
  Download,
  Filter,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  ChevronDown,
  Target,
  Brain,
  Layers,
  Database,
  MessageSquare,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Shield,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Enhanced trace data for comprehensive RAG workflows
const ragTraces = [
  {
    id: "trace-001",
    query: "What are the requirements for Strong Customer Authentication (SCA) in the EU?",
    status: "passing",
    type: "single-hop",
    workflow: "Q&A",
    timestamp: "2025-05-12T15:30:22",
    retrievalLatency: 245,
    generationLatency: 1240,
    totalCost: 0.0023,
    groundednessScore: 0.94,
    hallucinationRisk: "low",
    retrievalSteps: 1,
    chunksRetrieved: 5,
    chunksUsed: 3,
    contradictions: 0,
    model: "gpt-4o",
    retriever: "stripe-docs-v2.1",
    environment: "production",
  },
  {
    id: "trace-002",
    query: "Research and synthesize best practices for payment security across multiple compliance frameworks",
    status: "warning",
    type: "multi-hop",
    workflow: "Research Agent",
    timestamp: "2025-05-12T14:23:45",
    retrievalLatency: 890,
    generationLatency: 3200,
    totalCost: 0.0156,
    groundednessScore: 0.78,
    hallucinationRisk: "medium",
    retrievalSteps: 3,
    chunksRetrieved: 15,
    chunksUsed: 8,
    contradictions: 2,
    model: "claude-3-opus",
    retriever: "hybrid-search-v1.3",
    environment: "staging",
  },
  {
    id: "trace-003",
    query: "Summarize recent changes to PCI DSS requirements and their impact on our implementation",
    status: "failing",
    type: "synthesis",
    workflow: "Document Synthesis",
    timestamp: "2025-05-12T13:15:22",
    retrievalLatency: 456,
    generationLatency: 2100,
    totalCost: 0.0089,
    groundednessScore: 0.62,
    hallucinationRisk: "high",
    retrievalSteps: 2,
    chunksRetrieved: 12,
    chunksUsed: 4,
    contradictions: 3,
    model: "gpt-4o",
    retriever: "compliance-docs-v1.0",
    environment: "production",
  },
]

// Multi-hop trace steps for complex workflows
const multiHopSteps = [
  {
    id: "step-1",
    type: "initial-retrieval",
    query: "Research and synthesize best practices for payment security",
    retrievedChunks: 8,
    summary: "Retrieved foundational payment security documentation",
    timestamp: "14:23:45.123",
  },
  {
    id: "step-2",
    type: "refinement-retrieval",
    query: "compliance frameworks PCI DSS SOX GDPR payment security intersection",
    retrievedChunks: 4,
    summary: "Retrieved specific compliance framework requirements",
    timestamp: "14:23:46.890",
  },
  {
    id: "step-3",
    type: "synthesis-retrieval",
    query: "best practices implementation examples payment security compliance",
    retrievedChunks: 3,
    summary: "Retrieved implementation examples and case studies",
    timestamp: "14:23:48.234",
  },
]

// Enhanced chunk data with comprehensive metadata
const ragChunks = [
  {
    id: "chunk-1",
    content:
      "Strong Customer Authentication (SCA) is a requirement of the second Payment Services Directive (PSD2) that came into effect on September 14, 2019. SCA requires customers to provide two of the following three authentication factors: something they know (password), something they have (phone), something they are (fingerprint).",
    source: "Stripe API Documentation v2023-10",
    docType: "api-docs",
    section: "Authentication > SCA Requirements",
    relevanceScore: 0.95,
    lastUpdated: "May 10, 2025",
    isUsed: true,
    isContradictory: false,
    contradictsWith: [],
    feedback: "helpful",
    outputSpans: ["[1]", "[2]"],
    retrievalStep: 1,
    usageFrequency: 0.89,
    trustScore: 0.96,
    author: "Stripe Documentation Team",
    lastReviewed: "2025-05-10",
  },
  {
    id: "chunk-2",
    content:
      "For SCA compliance, you must implement 3D Secure authentication for transactions that require SCA. This includes most online card payments in the European Economic Area (EEA). However, certain exemptions apply for low-risk transactions under €30.",
    source: "Outdated SCA implementation guide v2020-08",
    docType: "guide",
    section: "Implementation > 3D Secure",
    relevanceScore: 0.73,
    lastUpdated: "Aug 15, 2020",
    isUsed: false,
    isContradictory: true,
    contradictsWith: ["chunk-4"],
    feedback: "outdated",
    outputSpans: [],
    retrievalStep: 1,
    usageFrequency: 0.12,
    trustScore: 0.34,
    author: "Legacy Documentation",
    lastReviewed: "2020-08-15",
  },
  {
    id: "chunk-3",
    content:
      "Payment Intents API automatically handles SCA requirements when you create a payment with confirmation_method='automatic'. The API will prompt for additional authentication when required, ensuring compliance without manual intervention.",
    source: "Payment Intents API - Implementation Guide",
    docType: "api-docs",
    section: "Payment Intents > SCA Handling",
    relevanceScore: 0.87,
    lastUpdated: "Apr 22, 2025",
    isUsed: true,
    isContradictory: false,
    contradictsWith: [],
    feedback: "helpful",
    outputSpans: ["[3]"],
    retrievalStep: 1,
    usageFrequency: 0.76,
    trustScore: 0.92,
    author: "Stripe Engineering",
    lastReviewed: "2025-04-22",
  },
  {
    id: "chunk-4",
    content:
      "Recent updates to SCA requirements have lowered the exemption threshold to €25 for contactless payments, effective January 2025. This supersedes previous €30 thresholds mentioned in older documentation.",
    source: "PSD2 Updates 2025 - Regulatory Changes",
    docType: "regulatory",
    section: "Recent Changes > Exemption Thresholds",
    relevanceScore: 0.82,
    lastUpdated: "Jan 15, 2025",
    isUsed: true,
    isContradictory: true,
    contradictsWith: ["chunk-2"],
    feedback: null,
    outputSpans: ["[4]"],
    retrievalStep: 1,
    usageFrequency: 0.45,
    trustScore: 0.88,
    author: "EU Regulatory Team",
    lastReviewed: "2025-01-15",
  },
]

// Enhanced LLM output with detailed attribution
const ragOutput = {
  content: `Strong Customer Authentication (SCA) is a regulatory requirement under the second Payment Services Directive (PSD2) that applies to most online card payments in the European Economic Area [1].

**Authentication Requirements:**
SCA requires customers to provide at least two of these authentication factors [1][2]:
• Something they know (password, PIN)
• Something they have (mobile phone, hardware token)  
• Something they are (fingerprint, facial recognition)

**Implementation with Stripe:**
The Payment Intents API automatically handles SCA compliance when you use confirmation_method='automatic' [3]. The API will prompt customers for additional authentication when required, ensuring compliance without manual intervention.

**Recent Regulatory Updates:**
As of January 2025, the exemption threshold for contactless payments has been lowered to €25, superseding the previous €30 threshold [4]. This affects transaction routing and exemption logic in payment flows.

**Key Implementation Steps:**
1. Use Payment Intents API with automatic confirmation
2. Handle authentication challenges in your frontend
3. Update exemption logic for the new €25 threshold
4. Test with SCA-required test cards in development`,

  sourceMap: [
    { span: "[1]", chunkId: "chunk-1", startPos: 125, endPos: 200, confidence: 0.96 },
    { span: "[2]", chunkId: "chunk-1", startPos: 280, endPos: 420, confidence: 0.94 },
    { span: "[3]", chunkId: "chunk-3", startPos: 520, endPos: 650, confidence: 0.91 },
    { span: "[4]", chunkId: "chunk-4", startPos: 720, endPos: 820, confidence: 0.88 },
  ],

  groundednessScore: 0.94,
  hallucinatedSpans: [
    {
      text: "Test with SCA-required test cards in development",
      reason: "Implementation detail not found in retrieved context",
      severity: "low",
      startPos: 890,
      endPos: 940,
    },
  ],

  contradictionAnalysis: {
    detected: true,
    contradictions: [
      {
        chunkIds: ["chunk-2", "chunk-4"],
        issue: "Conflicting exemption thresholds (€30 vs €25)",
        resolution: "Used more recent regulatory update (chunk-4)",
        severity: "medium",
      },
    ],
  },

  qualityMetrics: {
    totalTokens: 256,
    responseTime: 1240,
    citationCoverage: 0.87,
    factualAccuracy: 0.92,
    completeness: 0.89,
    coherence: 0.94,
  },
}

export function RagObservatory() {
  const [selectedTrace, setSelectedTrace] = useState(ragTraces[0])
  const [activeTab, setActiveTab] = useState("overview")
  const [showSourceMap, setShowSourceMap] = useState(true)
  const [selectedChunk, setSelectedChunk] = useState(null)
  const [testCaseDialog, setTestCaseDialog] = useState(false)
  const [filterDialog, setFilterDialog] = useState(false)
  const [expandedSteps, setExpandedSteps] = useState({})
  const [liveFilters, setLiveFilters] = useState({
    excludeNDA: false,
    excludeOutdated: true,
    minRelevance: 0.7,
    onlyUsedChunks: false,
  })

  const getStatusBadge = (status) => {
    const configs = {
      failing: { icon: XCircle, bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
      passing: { icon: CheckCircle, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
      warning: { icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
      unreviewed: { icon: Clock, bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
    }
    const config = configs[status] || configs.unreviewed
    const Icon = config.icon

    return (
      <Badge variant="outline" className={`${config.bg} ${config.text} ${config.border} text-xs font-medium`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getWorkflowIcon = (workflow) => {
    const icons = {
      "Q&A": MessageSquare,
      "Research Agent": Brain,
      "Document Synthesis": FileText,
      Classification: Target,
      "Multi-hop": Layers,
    }
    return icons[workflow] || MessageSquare
  }

  const getRiskBadge = (risk) => {
    const configs = {
      low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
      medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
      high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    }
    const config = configs[risk] || configs.medium

    return (
      <Badge variant="outline" className={`${config.bg} ${config.text} ${config.border} text-xs font-medium`}>
        <Shield className="h-3 w-3 mr-1" />
        {risk} risk
      </Badge>
    )
  }

  const handleChunkFeedback = (chunkId, feedback) => {
    console.log(`Chunk ${chunkId} feedback: ${feedback}`)
    // In real app, this would update the chunk feedback and trigger retriever retraining
  }

  const toggleStepExpansion = (stepId) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }))
  }

  const renderOutputWithSources = (content, sourceMap, showSources) => {
    if (!showSources) {
      return <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{content}</div>
    }

    let result = content
    sourceMap.forEach(({ span, chunkId, confidence }) => {
      const chunk = ragChunks.find((c) => c.id === chunkId)
      const confidenceColor =
        confidence > 0.9
          ? "bg-emerald-100 text-emerald-800"
          : confidence > 0.8
            ? "bg-blue-100 text-blue-800"
            : "bg-amber-100 text-amber-800"

      result = result.replace(
        span,
        `<span class="inline-flex items-center ${confidenceColor} px-1.5 py-0.5 rounded text-xs font-medium cursor-pointer hover:shadow-sm transition-all" title="${chunk?.source || "Unknown source"} (${(confidence * 100).toFixed(1)}% confidence)">${span}</span>`,
      )
    })

    return <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: result }} />
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-white">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">RAG Observatory</h1>
                <p className="text-sm text-slate-600">Comprehensive RAG observability, debugging & evaluation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center px-3 py-1"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                Live Monitoring
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center px-3 py-1">
                <Database className="h-3 w-3 mr-1" />
                {ragTraces.length} Active Traces
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setFilterDialog(true)}>
              <Filter className="h-4 w-4 mr-1" />
              Live Filters
            </Button>
            <Button variant="outline" size="sm">
              <GitCompare className="h-4 w-4 mr-1" />
              Compare
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Enhanced Left Panel - Trace List */}
          <div className="w-1/3 border-r border-slate-200 overflow-hidden flex flex-col bg-slate-50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">RAG Traces</h2>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-emerald-50 rounded-lg">
                  <div className="text-lg font-mono font-bold text-emerald-700">
                    {ragTraces.filter((t) => t.status === "passing").length}
                  </div>
                  <div className="text-xs text-emerald-600">Passing</div>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded-lg">
                  <div className="text-lg font-mono font-bold text-amber-700">
                    {ragTraces.filter((t) => t.status === "warning").length}
                  </div>
                  <div className="text-xs text-amber-600">Warning</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <div className="text-lg font-mono font-bold text-red-700">
                    {ragTraces.filter((t) => t.status === "failing").length}
                  </div>
                  <div className="text-xs text-red-600">Failing</div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search traces, queries, models..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select className="text-sm border border-slate-200 bg-white rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Workflows</option>
                  <option>Q&A</option>
                  <option>Research Agent</option>
                  <option>Synthesis</option>
                  <option>Multi-hop</option>
                </select>
                <select className="text-sm border border-slate-200 bg-white rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Models</option>
                  <option>GPT-4o</option>
                  <option>Claude-3-Opus</option>
                  <option>Llama-3-70B</option>
                </select>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {ragTraces.map((trace) => {
                const WorkflowIcon = getWorkflowIcon(trace.workflow)
                return (
                  <div
                    key={trace.id}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition-all ${
                      selectedTrace.id === trace.id ? "bg-white border-l-4 border-l-blue-500 shadow-sm" : ""
                    }`}
                    onClick={() => setSelectedTrace(trace)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <WorkflowIcon className="h-4 w-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">{trace.workflow}</span>
                        {trace.type === "multi-hop" && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                            {trace.retrievalSteps} steps
                          </Badge>
                        )}
                      </div>
                      {getStatusBadge(trace.status)}
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium truncate max-w-[280px] text-slate-900 mb-2">{trace.query}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{trace.query}</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono">
                        {trace.model}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-mono"
                      >
                        {trace.chunksUsed}/{trace.chunksRetrieved} chunks
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono"
                      >
                        {(trace.groundednessScore * 100).toFixed(0)}% grounded
                      </Badge>
                      {getRiskBadge(trace.hallucinationRisk)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {trace.retrievalLatency + trace.generationLatency}ms
                        </span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />${trace.totalCost.toFixed(4)}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          trace.environment === "production"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {trace.environment}
                      </Badge>
                    </div>

                    {trace.contradictions > 0 && (
                      <div className="mt-2 flex items-center text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {trace.contradictions} contradiction{trace.contradictions > 1 ? "s" : ""} detected
                      </div>
                    )}
                  </div>
                )
              })}
            </ScrollArea>
          </div>

          {/* Enhanced Right Panel - Comprehensive Trace Details */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Enhanced Pinned Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {React.createElement(getWorkflowIcon(selectedTrace.workflow), {
                      className: "h-5 w-5 text-blue-600",
                    })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedTrace.workflow} Trace</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-mono"
                      >
                        {selectedTrace.id}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                        {new Date(selectedTrace.timestamp).toLocaleString()}
                      </Badge>
                      {getStatusBadge(selectedTrace.status)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="bg-white">
                    <Save className="h-4 w-4 mr-1" />
                    Save as Test
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Replay
                  </Button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
                <p className="text-sm text-slate-900 font-medium mb-2">{selectedTrace.query}</p>
                <div className="flex items-center space-x-6 text-xs text-slate-600">
                  <div className="flex items-center">
                    <Database className="h-3 w-3 mr-1" />
                    {selectedTrace.retriever}
                  </div>
                  <div className="flex items-center">
                    <Brain className="h-3 w-3 mr-1" />
                    {selectedTrace.model}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedTrace.retrievalLatency + selectedTrace.generationLatency}ms total
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1" />${selectedTrace.totalCost.toFixed(4)}
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {(selectedTrace.groundednessScore * 100).toFixed(1)}% grounded
                  </div>
                </div>
              </div>

              {/* Quality Overview Cards */}
              <div className="grid grid-cols-4 gap-3">
                <Card className="border-slate-200 bg-white">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Groundedness</span>
                      <span className="text-sm font-mono font-bold text-emerald-600">
                        {(selectedTrace.groundednessScore * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={selectedTrace.groundednessScore * 100} className="mt-1 h-1" />
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Chunk Usage</span>
                      <span className="text-sm font-mono font-bold text-blue-600">
                        {selectedTrace.chunksUsed}/{selectedTrace.chunksRetrieved}
                      </span>
                    </div>
                    <Progress
                      value={(selectedTrace.chunksUsed / selectedTrace.chunksRetrieved) * 100}
                      className="mt-1 h-1"
                    />
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Contradictions</span>
                      <span
                        className={`text-sm font-mono font-bold ${
                          selectedTrace.contradictions === 0 ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {selectedTrace.contradictions}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Risk Level</span>
                      {getRiskBadge(selectedTrace.hallucinationRisk)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Comprehensive Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-7 bg-slate-50 p-1 mx-6 mt-4 rounded-lg">
                <TabsTrigger value="overview" className="text-xs font-semibold">
                  🎯 Overview
                </TabsTrigger>
                <TabsTrigger value="retrieval" className="text-xs font-semibold">
                  🔍 Retrieval
                </TabsTrigger>
                <TabsTrigger value="output" className="text-xs font-semibold">
                  📝 Output
                </TabsTrigger>
                <TabsTrigger value="attribution" className="text-xs font-semibold">
                  🔗 Attribution
                </TabsTrigger>
                <TabsTrigger value="quality" className="text-xs font-semibold">
                  ✨ Quality
                </TabsTrigger>
                <TabsTrigger value="testing" className="text-xs font-semibold">
                  🧪 Testing
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs font-semibold">
                  📊 Insights
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="overview" className="h-full p-6">
                  <div className="space-y-6 h-full overflow-y-auto">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Trace Overview</h3>

                      {/* Multi-hop workflow visualization */}
                      {selectedTrace.type === "multi-hop" && (
                        <Card className="border-slate-200 mb-6">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center">
                              <Layers className="h-4 w-4 mr-2" />
                              Multi-hop Retrieval Flow
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {multiHopSteps.map((step, index) => (
                                <div key={step.id} className="relative">
                                  {index < multiHopSteps.length - 1 && (
                                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200"></div>
                                  )}
                                  <div
                                    className="flex items-start space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                                    onClick={() => toggleStepExpansion(step.id)}
                                  >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm font-medium text-slate-900 capitalize">
                                            {step.type.replace("-", " ")}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                                          >
                                            {step.retrievedChunks} chunks
                                          </Badge>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs text-slate-500 font-mono">{step.timestamp}</span>
                                          {expandedSteps[step.id] ? (
                                            <ChevronDown className="h-4 w-4 text-slate-400" />
                                          ) : (
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-xs text-slate-600 mt-1">{step.summary}</p>

                                      {expandedSteps[step.id] && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                          <div className="text-xs text-slate-600 mb-2">Query:</div>
                                          <div className="text-sm text-slate-900 font-mono bg-white p-2 rounded border">
                                            {step.query}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Performance metrics */}
                      <div className="grid grid-cols-2 gap-6">
                        <Card className="border-slate-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Performance Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Retrieval Latency</span>
                              <span className="text-sm font-mono font-bold">{selectedTrace.retrievalLatency}ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Generation Latency</span>
                              <span className="text-sm font-mono font-bold">{selectedTrace.generationLatency}ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Total Time</span>
                              <span className="text-sm font-mono font-bold text-blue-600">
                                {selectedTrace.retrievalLatency + selectedTrace.generationLatency}ms
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Cost</span>
                              <span className="text-sm font-mono font-bold">${selectedTrace.totalCost.toFixed(4)}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Quality Indicators</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Groundedness Score</span>
                              <span className="text-sm font-mono font-bold text-emerald-600">
                                {(selectedTrace.groundednessScore * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Hallucination Risk</span>
                              {getRiskBadge(selectedTrace.hallucinationRisk)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Contradictions</span>
                              <span
                                className={`text-sm font-mono font-bold ${
                                  selectedTrace.contradictions === 0 ? "text-emerald-600" : "text-amber-600"
                                }`}
                              >
                                {selectedTrace.contradictions}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">Citation Coverage</span>
                              <span className="text-sm font-mono font-bold">
                                {Math.round((selectedTrace.chunksUsed / selectedTrace.chunksRetrieved) * 100)}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="retrieval" className="h-full p-6">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Retrieved Chunks Analysis</h3>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setFilterDialog(true)}>
                          <Filter className="h-4 w-4 mr-1" />
                          Filter Chunks
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Retriever Config
                        </Button>
                      </div>
                    </div>

                    {/* Chunk statistics */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <Card className="border-slate-200">
                        <CardContent className="p-3 text-center">
                          <div className="text-lg font-mono font-bold text-slate-900">{ragChunks.length}</div>
                          <div className="text-xs text-slate-600">Total Retrieved</div>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-3 text-center">
                          <div className="text-lg font-mono font-bold text-emerald-600">
                            {ragChunks.filter((c) => c.isUsed).length}
                          </div>
                          <div className="text-xs text-slate-600">Used in Output</div>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-3 text-center">
                          <div className="text-lg font-mono font-bold text-amber-600">
                            {ragChunks.filter((c) => c.isContradictory).length}
                          </div>
                          <div className="text-xs text-slate-600">Contradictory</div>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-3 text-center">
                          <div className="text-lg font-mono font-bold text-blue-600">
                            {(ragChunks.reduce((acc, c) => acc + c.relevanceScore, 0) / ragChunks.length).toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-600">Avg Relevance</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Enhanced chunk list */}
                    <div className="space-y-4">
                      {ragChunks.map((chunk, index) => (
                        <Card
                          key={chunk.id}
                          className={`border transition-all hover:shadow-sm ${
                            chunk.isContradictory
                              ? "border-amber-200 bg-amber-50"
                              : chunk.isUsed
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-slate-200 bg-white"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono"
                                >
                                  {chunk.relevanceScore.toFixed(2)} relevance
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-mono"
                                >
                                  {(chunk.trustScore * 100).toFixed(0)}% trust
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                                >
                                  {chunk.docType}
                                </Badge>
                                {chunk.isUsed ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Used
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                                  >
                                    Unused
                                  </Badge>
                                )}
                                {chunk.isContradictory && (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                                  >
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Contradictory
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {chunk.outputSpans.map((span) => (
                                  <Badge
                                    key={span}
                                    variant="outline"
                                    className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-mono"
                                  >
                                    {span}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <p className="text-sm text-slate-900 mb-3 leading-relaxed">{chunk.content}</p>

                            <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                              <div className="flex items-center space-x-4">
                                <span className="font-medium">{chunk.source}</span>
                                <span>{chunk.section}</span>
                                <span>by {chunk.author}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span>Updated {chunk.lastUpdated}</span>
                                <span className="flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {(chunk.usageFrequency * 100).toFixed(0)}% usage
                                </span>
                              </div>
                            </div>

                            {chunk.contradictsWith.length > 0 && (
                              <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-center text-xs text-amber-700">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Contradicts chunks: {chunk.contradictsWith.join(", ")}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`text-xs ${
                                    chunk.feedback === "helpful"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-transparent"
                                  }`}
                                  onClick={() => handleChunkFeedback(chunk.id, "helpful")}
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Relevant
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`text-xs ${
                                    chunk.feedback === "irrelevant"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-transparent"
                                  }`}
                                  onClick={() => handleChunkFeedback(chunk.id, "irrelevant")}
                                >
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  Not Relevant
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs bg-transparent"
                                  onClick={() => setSelectedChunk(chunk)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  <Flag className="h-3 w-3 mr-1" />
                                  Exclude
                                </Button>
                              </div>
                              {chunk.isUsed && (
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  <Link className="h-3 w-3 mr-1" />
                                  Show in Output
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="output" className="h-full p-6">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Generated Response</h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`text-xs ${showSourceMap ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-transparent"}`}
                          onClick={() => setShowSourceMap(!showSourceMap)}
                        >
                          <Link className="h-3 w-3 mr-1" />
                          {showSourceMap ? "Hide" : "Show"} Sources
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Full Screen
                        </Button>
                      </div>
                    </div>

                    <Card className="border-slate-200">
                      <CardContent className="p-6">
                        {renderOutputWithSources(ragOutput.content, ragOutput.sourceMap, showSourceMap)}
                      </CardContent>
                    </Card>

                    {/* Output quality metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-600">Groundedness</span>
                            <span className="text-sm font-mono font-bold text-emerald-600">
                              {(ragOutput.groundednessScore * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={ragOutput.groundednessScore * 100} className="h-2" />
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-600">Citation Coverage</span>
                            <span className="text-sm font-mono font-bold text-blue-600">
                              {(ragOutput.qualityMetrics.citationCoverage * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={ragOutput.qualityMetrics.citationCoverage * 100} className="h-2" />
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-600">Coherence</span>
                            <span className="text-sm font-mono font-bold text-purple-600">
                              {(ragOutput.qualityMetrics.coherence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={ragOutput.qualityMetrics.coherence * 100} className="h-2" />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Hallucination detection */}
                    {ragOutput.hallucinatedSpans.length > 0 && (
                      <Card className="border-red-200 bg-red-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-red-800 flex items-center">
                            <Flag className="h-4 w-4 mr-2" />
                            Potential Hallucinations Detected
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {ragOutput.hallucinatedSpans.map((span, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 font-medium mb-1">{span.text}</p>
                                <p className="text-xs text-red-600">{span.reason}</p>
                                <Badge
                                  variant="outline"
                                  className={`mt-2 text-xs ${
                                    span.severity === "high"
                                      ? "bg-red-100 text-red-700 border-red-300"
                                      : span.severity === "medium"
                                        ? "bg-amber-100 text-amber-700 border-amber-300"
                                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                                  }`}
                                >
                                  {span.severity} severity
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="attribution" className="h-full p-6">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Source Attribution Map</h3>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          Highlight Mode
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <Download className="h-3 w-3 mr-1" />
                          Export Map
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {ragOutput.sourceMap.map((mapping, index) => (
                        <Card key={index} className="border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-mono mt-1 flex-shrink-0"
                              >
                                {mapping.span}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <div className="bg-slate-50 p-3 rounded-lg mb-3">
                                  <div className="text-sm text-slate-900 font-medium">
                                    "{ragOutput.content.substring(mapping.startPos, mapping.endPos)}"
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-slate-600">
                                    <div className="font-medium">
                                      Maps to: {ragChunks.find((c) => c.id === mapping.chunkId)?.source}
                                    </div>
                                    <div className="mt-1">
                                      Section: {ragChunks.find((c) => c.id === mapping.chunkId)?.section}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                    >
                                      {(mapping.confidence * 100).toFixed(1)}% confidence
                                    </Badge>
                                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View Chunk
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Contradiction analysis */}
                    {ragOutput.contradictionAnalysis.detected && (
                      <Card className="border-amber-200 bg-amber-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-amber-800 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Contradiction Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {ragOutput.contradictionAnalysis.contradictions.map((contradiction, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg border border-amber-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-amber-800">
                                    Chunks {contradiction.chunkIds.join(" vs ")}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      contradiction.severity === "high"
                                        ? "bg-red-100 text-red-700 border-red-300"
                                        : "bg-amber-100 text-amber-700 border-amber-300"
                                    }`}
                                  >
                                    {contradiction.severity} severity
                                  </Badge>
                                </div>
                                <p className="text-xs text-amber-700 mb-2">{contradiction.issue}</p>
                                <p className="text-xs text-slate-600">
                                  <strong>Resolution:</strong> {contradiction.resolution}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="quality" className="h-full p-6">
                  <div className="space-y-6 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Quality Assessment</h3>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Re-evaluate
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <Settings className="h-3 w-3 mr-1" />
                          Quality Config
                        </Button>
                      </div>
                    </div>

                    {/* Quality metrics grid */}
                    <div className="grid grid-cols-2 gap-6">
                      <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Content Quality</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Factual Accuracy</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={ragOutput.qualityMetrics.factualAccuracy * 100} className="w-16 h-2" />
                              <span className="text-sm font-mono font-bold text-emerald-600">
                                {(ragOutput.qualityMetrics.factualAccuracy * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Completeness</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={ragOutput.qualityMetrics.completeness * 100} className="w-16 h-2" />
                              <span className="text-sm font-mono font-bold text-blue-600">
                                {(ragOutput.qualityMetrics.completeness * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Coherence</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={ragOutput.qualityMetrics.coherence * 100} className="w-16 h-2" />
                              <span className="text-sm font-mono font-bold text-purple-600">
                                {(ragOutput.qualityMetrics.coherence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Citation Coverage</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={ragOutput.qualityMetrics.citationCoverage * 100} className="w-16 h-2" />
                              <span className="text-sm font-mono font-bold text-indigo-600">
                                {(ragOutput.qualityMetrics.citationCoverage * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Trust & Safety</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Groundedness</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={ragOutput.groundednessScore * 100} className="w-16 h-2" />
                              <span className="text-sm font-mono font-bold text-emerald-600">
                                {(ragOutput.groundednessScore * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Hallucination Risk</span>
                            <div className="flex items-center space-x-2">
                              {getRiskBadge(selectedTrace.hallucinationRisk)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Source Diversity</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-mono font-bold text-slate-900">
                                {new Set(ragChunks.map((c) => c.docType)).size} types
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-600">Contradictions</span>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm font-mono font-bold ${
                                  selectedTrace.contradictions === 0 ? "text-emerald-600" : "text-amber-600"
                                }`}
                              >
                                {selectedTrace.contradictions}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quality insights */}
                    <Card className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Quality Insights & Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-emerald-800">High Groundedness Score</div>
                              <div className="text-xs text-emerald-700">
                                94% of the response is well-supported by retrieved context
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-amber-800">Contradictory Sources Detected</div>
                              <div className="text-xs text-amber-700">
                                Consider updating retrieval filters to exclude outdated documentation
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-blue-800">Optimization Opportunity</div>
                              <div className="text-xs text-blue-700">
                                3 unused chunks could be filtered out to improve retrieval efficiency
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="testing" className="h-full p-6">
                  <div className="space-y-6 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Test Case Management</h3>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        onClick={() => setTestCaseDialog(true)}
                      >
                        <TestTube className="h-3 w-3 mr-1" />
                        Save as Test Case
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Replay & Testing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Replay with New Retriever
                          </Button>
                          <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                            <Play className="h-3 w-3 mr-1" />
                            Replay with New Prompt
                          </Button>
                          <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                            <Zap className="h-3 w-3 mr-1" />
                            Replay with New Model
                          </Button>
                          <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                            <GitCompare className="h-3 w-3 mr-1" />
                            A/B Test Configuration
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Test History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-600">v1.3 (current)</span>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {selectedTrace.model}
                                </Badge>
                              </div>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pass
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-600">v1.2</span>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  gpt-4
                                </Badge>
                              </div>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pass
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-600">v1.1</span>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  gpt-3.5-turbo
                                </Badge>
                              </div>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Fail
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Evaluation Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-6 text-center">
                          <div>
                            <div className="text-2xl font-mono font-bold text-emerald-600">
                              {(ragOutput.groundednessScore * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-600">Groundedness</div>
                            <div className="text-xs text-emerald-600 mt-1">↑ +2% vs v1.2</div>
                          </div>
                          <div>
                            <div className="text-2xl font-mono font-bold text-blue-600">
                              {(ragOutput.qualityMetrics.factualAccuracy * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-600">Accuracy</div>
                            <div className="text-xs text-blue-600 mt-1">→ Same as v1.2</div>
                          </div>
                          <div>
                            <div className="text-2xl font-mono font-bold text-purple-600">
                              {(ragOutput.qualityMetrics.completeness * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-600">Completeness</div>
                            <div className="text-xs text-purple-600 mt-1">↑ +5% vs v1.2</div>
                          </div>
                          <div>
                            <div className="text-2xl font-mono font-bold text-indigo-600">
                              {(ragOutput.qualityMetrics.citationCoverage * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-600">Citations</div>
                            <div className="text-xs text-indigo-600 mt-1">↑ +8% vs v1.2</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Regression Testing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-slate-900">SCA Requirements Test Suite</div>
                              <div className="text-xs text-slate-600">
                                12 test cases covering authentication requirements
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                              >
                                11/12 passing
                              </Badge>
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Run Suite
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-slate-900">Payment Security Best Practices</div>
                              <div className="text-xs text-slate-600">
                                8 test cases for security implementation guidance
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                6/8 passing
                              </Badge>
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Run Suite
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="h-full p-6">
                  <div className="space-y-6 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">RAG Performance Insights</h3>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trends
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <Download className="h-3 w-3 mr-1" />
                          Export Report
                        </Button>
                      </div>
                    </div>

                    {/* Performance trends */}
                    <div className="grid grid-cols-2 gap-6">
                      <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Retrieval Efficiency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Chunk Utilization Rate</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono font-bold text-blue-600">
                                  {Math.round((selectedTrace.chunksUsed / selectedTrace.chunksRetrieved) * 100)}%
                                </span>
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Avg Relevance Score</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono font-bold text-purple-600">
                                  {(ragChunks.reduce((acc, c) => acc + c.relevanceScore, 0) / ragChunks.length).toFixed(
                                    2,
                                  )}
                                </span>
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Retrieval Latency</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono font-bold text-slate-900">
                                  {selectedTrace.retrievalLatency}ms
                                </span>
                                <TrendingDown className="h-3 w-3 text-emerald-500" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Generation Quality</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Groundedness Trend</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono font-bold text-emerald-600">
                                  {(ragOutput.groundednessScore * 100).toFixed(1)}%
                                </span>
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Citation Coverage</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono font-bold text-indigo-600">
                                  {(ragOutput.qualityMetrics.citationCoverage * 100).toFixed(1)}%
                                </span>
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Generation Latency</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono font-bold text-slate-900">
                                  {selectedTrace.generationLatency}ms
                                </span>
                                <Minus className="h-3 w-3 text-slate-400" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Document insights */}
                    <Card className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Document Source Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-mono font-bold text-blue-700">
                              {ragChunks.filter((c) => c.docType === "api-docs").length}
                            </div>
                            <div className="text-xs text-blue-600">API Docs</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {Math.round(
                                (ragChunks.filter((c) => c.docType === "api-docs" && c.isUsed).length /
                                  ragChunks.filter((c) => c.docType === "api-docs").length) *
                                  100,
                              )}
                              % used
                            </div>
                          </div>
                          <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <div className="text-lg font-mono font-bold text-emerald-700">
                              {ragChunks.filter((c) => c.docType === "guide").length}
                            </div>
                            <div className="text-xs text-emerald-600">Guides</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {Math.round(
                                (ragChunks.filter((c) => c.docType === "guide" && c.isUsed).length /
                                  ragChunks.filter((c) => c.docType === "guide").length) *
                                  100,
                              )}
                              % used
                            </div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-mono font-bold text-purple-700">
                              {ragChunks.filter((c) => c.docType === "regulatory").length}
                            </div>
                            <div className="text-xs text-purple-600">Regulatory</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {Math.round(
                                (ragChunks.filter((c) => c.docType === "regulatory" && c.isUsed).length /
                                  ragChunks.filter((c) => c.docType === "regulatory").length) *
                                  100,
                              )}
                              % used
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Optimization recommendations */}
                    <Card className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Optimization Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-blue-800">Improve Chunk Filtering</div>
                              <div className="text-xs text-blue-700">
                                Consider raising relevance threshold to 0.8 to filter out{" "}
                                {ragChunks.filter((c) => c.relevanceScore < 0.8).length} low-relevance chunks
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-amber-800">Update Document Freshness</div>
                              <div className="text-xs text-amber-700">
                                {ragChunks.filter((c) => new Date(c.lastUpdated) < new Date("2024-01-01")).length}{" "}
                                chunks are over 1 year old and may need review
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-emerald-800">Excellent Citation Coverage</div>
                              <div className="text-xs text-emerald-700">
                                {(ragOutput.qualityMetrics.citationCoverage * 100).toFixed(1)}% citation coverage is
                                above target threshold
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Live Filters Dialog */}
        <Dialog open={filterDialog} onOpenChange={setFilterDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Live RAG Filters</DialogTitle>
              <DialogDescription>
                Configure real-time filters to test different retrieval configurations
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="exclude-nda" className="text-sm font-medium">
                    Exclude NDA Documents
                  </Label>
                  <p className="text-xs text-slate-600">Filter out confidential or restricted content</p>
                </div>
                <Switch
                  id="exclude-nda"
                  checked={liveFilters.excludeNDA}
                  onCheckedChange={(checked) => setLiveFilters((prev) => ({ ...prev, excludeNDA: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="exclude-outdated" className="text-sm font-medium">
                    Exclude Outdated Content
                  </Label>
                  <p className="text-xs text-slate-600">Filter out documents older than 2 years</p>
                </div>
                <Switch
                  id="exclude-outdated"
                  checked={liveFilters.excludeOutdated}
                  onCheckedChange={(checked) => setLiveFilters((prev) => ({ ...prev, excludeOutdated: checked }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-relevance" className="text-sm font-medium">
                  Minimum Relevance Score
                </Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    id="min-relevance"
                    min="0"
                    max="1"
                    step="0.1"
                    value={liveFilters.minRelevance}
                    onChange={(e) =>
                      setLiveFilters((prev) => ({ ...prev, minRelevance: Number.parseFloat(e.target.value) }))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-mono font-bold w-12">{liveFilters.minRelevance.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="only-used" className="text-sm font-medium">
                    Show Only Used Chunks
                  </Label>
                  <p className="text-xs text-slate-600">Display only chunks that contributed to the output</p>
                </div>
                <Switch
                  id="only-used"
                  checked={liveFilters.onlyUsedChunks}
                  onCheckedChange={(checked) => setLiveFilters((prev) => ({ ...prev, onlyUsedChunks: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setFilterDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setFilterDialog(false)}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Save as Test Case Dialog */}
        <Dialog open={testCaseDialog} onOpenChange={setTestCaseDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Save as Test Case</DialogTitle>
              <DialogDescription>
                Create a regression test from this trace to monitor future RAG performance
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-name" className="text-right text-sm">
                  Name
                </Label>
                <Input id="test-name" defaultValue="SCA Requirements Accuracy Test" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-description" className="text-right text-sm">
                  Description
                </Label>
                <Textarea
                  id="test-description"
                  defaultValue="Validates correct SCA requirements explanation for EU compliance, including recent regulatory updates and implementation guidance"
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-tags" className="text-right text-sm">
                  Tags
                </Label>
                <Input id="test-tags" defaultValue="sca, compliance, eu, stripe, psd2" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expected-groundedness" className="text-right text-sm">
                  Min Groundedness
                </Label>
                <Input
                  id="expected-groundedness"
                  defaultValue="0.90"
                  className="col-span-3"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="max-contradictions" className="text-right text-sm">
                  Max Contradictions
                </Label>
                <Input id="max-contradictions" defaultValue="1" className="col-span-3" type="number" min="0" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setTestCaseDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setTestCaseDialog(false)}>
                <TestTube className="h-4 w-4 mr-1" />
                Save Test Case
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
