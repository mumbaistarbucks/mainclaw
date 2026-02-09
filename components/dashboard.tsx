"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle, XCircle, Clock, TrendingDown, TrendingUp, Eye, Play, Bug, Filter, RefreshCw, TestTube, BarChart3, Activity, AlertCircle, ChevronRight, ExternalLink, ChevronDown, User, Search, Zap, FileText, DollarSign, Hash, MemoryStick, Lock, Network } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export function Dashboard() {
  const router = useRouter()
  const [focusMode, setFocusMode] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in real app this would come from API
  const criticalIssues = [
    {
      type: "budget_threshold",
      count: 3,
      severity: "critical",
      message: "3 Agents Hit Budget Limits",
      action: "Adjust Budgets",
      href: "/agents?status=budget_exceeded",
      details: ["Research Agent: 95% token budget", "Code Agent: 100% step limit", "Data Agent: 88% memory limit"],
      trend: "up",
      trendValue: "+2 today",
      sparkline: [1, 1, 2, 3, 3],
      lastFailure: "2m ago",
    },
    {
      type: "coordination_stall",
      count: 2,
      severity: "high",
      message: "Coordination Stalls Detected",
      action: "View Coordination",
      href: "/multi-agent",
      details: ["Security Scan: Deadlock detected", "Code Review: Agent waiting 15.3s"],
      trend: "up",
      trendValue: "2 active stalls",
      sparkline: [0, 1, 1, 2, 2],
      lastFailure: "5m ago",
    },
    {
      type: "circuit_breaker",
      count: 1,
      severity: "critical",
      message: "Global Circuit Breaker Triggered",
      action: "Review Safety",
      href: "/settings",
      details: ["Rate limit exceeded: 1000 req/min threshold"],
      trend: "stable",
      trendValue: "1 active",
      sparkline: [0, 0, 1, 1, 1],
      lastFailure: "12m ago",
    },
    {
      type: "loop_detection",
      count: 4,
      severity: "medium",
      message: "Loop Detection Alerts",
      action: "Break Loops",
      href: "/agents",
      details: ["4 agents in retry loops detected"],
      trend: "up",
      trendValue: "+1 today",
      sparkline: [3, 3, 4, 4, 4],
      lastFailure: "8m ago",
    },
  ]

  const agents = [
    {
      id: "agent-1",
      name: "Research Agent",
      status: "failing",
      lastError: "Budget threshold exceeded: 95% token limit",
      lastRun: "2m ago",
      model: "GPT-4o",
      version: "v2.1",
      env: "prod",
      errorCount: 5,
      successRate: 78,
      errorType: "budget_exceeded",
      budgetUsed: 95,
      stepLimit: 45,
      memoryUsed: 2.1,
      toolAccess: ["web_search", "file_read"],
      loopDetected: false,
      rateLimit: "50/min",
    },
    {
      id: "agent-2",
      name: "Code Agent",
      status: "failing",
      lastError: "Step limit reached: 100 steps (limit: 100)",
      lastRun: "3m ago",
      model: "Claude 3 Opus",
      version: "v3.2",
      env: "prod",
      errorCount: 8,
      successRate: 65,
      errorType: "step_limit",
      budgetUsed: 78,
      stepLimit: 100,
      memoryUsed: 1.8,
      toolAccess: ["code_exec", "git"],
      loopDetected: true,
      rateLimit: "30/min",
    },
    {
      id: "agent-3",
      name: "Data Processing Agent",
      status: "failing",
      lastError: "Memory limit exceeded: 2.5GB (limit: 2GB)",
      lastRun: "5m ago",
      model: "Claude 3 Opus",
      version: "v1.8",
      env: "prod",
      errorCount: 3,
      successRate: 85,
      errorType: "memory_limit",
      budgetUsed: 82,
      stepLimit: 67,
      memoryUsed: 2.5,
      toolAccess: ["db_query", "file_write"],
      loopDetected: false,
      rateLimit: "20/min",
    },
    {
      id: "agent-4",
      name: "Security Scanner Agent",
      status: "failing",
      lastError: "Tool access denied: 'rm' command blocked",
      lastRun: "8m ago",
      model: "GPT-4o",
      version: "v1.5",
      env: "prod",
      errorCount: 2,
      successRate: 89,
      errorType: "tool_access_denied",
      budgetUsed: 45,
      stepLimit: 23,
      memoryUsed: 0.8,
      toolAccess: ["scan", "read_only"],
      loopDetected: false,
      rateLimit: "10/min",
    },
    {
      id: "agent-5",
      name: "Multi-Agent Coordinator",
      status: "active",
      lastError: null,
      lastRun: "1m ago",
      model: "Claude 3 Sonnet",
      version: "v1.2",
      env: "staging",
      errorCount: 0,
      successRate: 96,
      errorType: null,
      budgetUsed: 34,
      stepLimit: 12,
      memoryUsed: 0.5,
      toolAccess: ["coordinate", "state_manage"],
      loopDetected: false,
      rateLimit: "100/min",
    },
    {
      id: "agent-6",
      name: "Response Generator Agent",
      status: "active",
      lastError: null,
      lastRun: "3m ago",
      model: "GPT-4o",
      version: "v1.0",
      env: "prod",
      errorCount: 1,
      successRate: 94,
      errorType: null,
      budgetUsed: 67,
      stepLimit: 45,
      memoryUsed: 1.2,
      toolAccess: ["llm_generate", "template"],
      loopDetected: false,
      rateLimit: "60/min",
    },
  ]

  const recentActivity = [
    {
      type: "budget_threshold",
      title: "Research Agent Budget Threshold Exceeded",
      description: "Token budget reached 95% - threshold behavior: WARN",
      time: "2m ago",
      severity: "critical",
      traceId: "trace-002",
      logPreview: "BudgetAlert: Research Agent token usage 95% (limit: 100k tokens) - Circuit breaker: ACTIVE",
    },
    {
      type: "circuit_breaker",
      title: "Global Circuit Breaker Triggered",
      description: "Rate limit exceeded: 1000 req/min threshold",
      time: "12m ago",
      severity: "critical",
      traceId: "trace-001",
      logPreview: "CircuitBreaker: Global rate limit exceeded (1000/min) - All agents paused",
    },
    {
      type: "loop_detection",
      title: "Code Agent Loop Detected",
      description: "Agent stuck in retry loop - 15 consecutive retries",
      time: "5m ago",
      severity: "high",
      agentId: "agent-2",
      logPreview: "LoopDetection: Code Agent retry loop detected (15 attempts) - Auto-breaking loop",
    },
    {
      type: "coordination_stall",
      title: "Security Scan Coordination Stall",
      description: "Deadlock detected: Vulnerability Scanner ↔ Compliance Checker",
      time: "8m ago",
      severity: "critical",
      testId: "coordination-789",
      logPreview: "CoordinationStall: Circular dependency detected - Deadlock resolution: PENDING",
    },
    {
      type: "tool_access_denied",
      title: "Security Agent Tool Access Blocked",
      description: "Attempted 'rm' command blocked by tool access rules",
      time: "1h ago",
      severity: "medium",
      comparison: "v1.2 → v1.3",
      logPreview: "ToolAccessDenied: Security Agent attempted 'rm -rf /tmp' - Blocked by tool permissions",
    },
    {
      type: "coordination_success",
      title: "Multi-Agent Coordination Completed",
      description: "Successfully coordinated 3 agents with shared state handoff",
      time: "2h ago",
      severity: "low",
      workflowId: "workflow-789",
      logPreview: "CoordinationSuccess: Research → Code → Response agents - State ownership transferred",
    },
  ]

  const testMetrics = {
    total: 22,
    passed: 14,
    failed: 6,
    warning: 2,
    coverage: 79,
    regressions: 3,
  }

  const ragMetrics = {
    chunksRetrieved: 1847,
    avgRelevance: 0.81,
    groundednessScore: 84.7,
    hallucinations: 6,
  }

  // Filter agents based on focus mode
  const filteredAgents = focusMode ? agents.filter((agent) => agent.status === "failing") : agents

  // Sort agents: failing first, then active, then idle
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    const statusOrder = { failing: 0, active: 1, idle: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200"
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "failing":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "active":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "idle":
        return <Clock className="h-4 w-4 text-slate-400" />
      default:
        return null
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "budget_threshold":
        return <DollarSign className="h-4 w-4 text-red-500" />
      case "circuit_breaker":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "loop_detection":
        return <RefreshCw className="h-4 w-4 text-amber-500" />
      case "coordination_stall":
        return <Network className="h-4 w-4 text-red-500" />
      case "tool_access_denied":
        return <Lock className="h-4 w-4 text-amber-500" />
      case "coordination_success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

  const getErrorIcon = (errorType: string | null) => {
    switch (errorType) {
      case "budget_exceeded":
        return <DollarSign className="h-3 w-3 text-red-500" />
      case "step_limit":
        return <Hash className="h-3 w-3 text-red-500" />
      case "memory_limit":
        return <MemoryStick className="h-3 w-3 text-red-500" />
      case "tool_access_denied":
        return <Lock className="h-3 w-3 text-amber-500" />
      case "loop_detected":
        return <RefreshCw className="h-3 w-3 text-red-500" />
      case "circuit_breaker":
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      default:
        return <XCircle className="h-3 w-3 text-red-500" />
    }
  }

  const getModelBadgeColor = (model: string) => {
    if (model.includes("GPT")) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (model.includes("Claude")) return "bg-purple-50 text-purple-700 border-purple-200"
    if (model.includes("Llama")) return "bg-blue-50 text-blue-700 border-blue-200"
    return "bg-slate-50 text-slate-700 border-slate-200"
  }

  const getEnvBadgeColor = (env: string) => {
    return env === "prod" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
  }

  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data)
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 40
        const y = 16 - (value / max) * 12
        return `${x},${y}`
      })
      .join(" ")

    return (
      <svg width="40" height="16" className="inline-block ml-2">
        <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={points} />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Splinter Control & Coordination Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Monitor agent control limits, coordination state, and system health</p>
          </div>

          {/* Critical Issues Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {criticalIssues.map((issue, index) => (
              <Card
                key={index}
                className={`cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-slate-200 ${
                  issue.severity === "critical" ? "ring-1 ring-red-200 bg-red-50/30" : "bg-white"
                }`}
                onClick={() => router.push(issue.href)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={`${getSeverityColor(issue.severity)} text-xs font-medium`}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-xs text-slate-500">
                      {issue.trend === "up" && <TrendingUp className="h-3 w-3 text-red-500 mr-1" />}
                      {issue.trend === "down" && <TrendingDown className="h-3 w-3 text-emerald-500 mr-1" />}
                      {issue.trendValue}
                      {renderSparkline(issue.sparkline)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{issue.message}</h3>
                    <p className="text-xs text-slate-600">{issue.details[0]}</p>
                    <p className="text-xs text-slate-500 mt-1">Last failure {issue.lastFailure}</p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-7 active:scale-98 transition-transform"
                  >
                    {issue.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-4 mb-4 px-1">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Filters:</span>
            </div>
            <select className="text-sm border-0 bg-slate-50 rounded-md px-3 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Environments</option>
              <option>Production</option>
              <option>Staging</option>
            </select>
            <select className="text-sm border-0 bg-slate-50 rounded-md px-3 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Models</option>
              <option>GPT-4o</option>
              <option>Claude 3</option>
              <option>Llama 3</option>
            </select>
            <select className="text-sm border-0 bg-slate-50 rounded-md px-3 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Failing</option>
              <option>Active</option>
              <option>Idle</option>
            </select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-50 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="eval"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Eval
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Insights
              </TabsTrigger>
              <TabsTrigger
                value="rag"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                RAG
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Compact Agent Table */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 px-6 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-slate-900">LLM Workflow & Agent Status</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-mono">
                        {agents.filter((a) => a.status === "failing").length} failing
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono"
                      >
                        {agents.filter((a) => a.status === "active").length} active
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-mono"
                      >
                        {agents.filter((a) => a.status === "idle").length} idle
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Agent
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Control Limits
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Last Error
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Last Run
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sortedAgents.map((agent) => (
                          <tr
                            key={agent.id}
                            className={`hover:bg-slate-50 transition-colors ${
                              agent.status === "failing" ? "bg-red-50/50" : ""
                            }`}
                          >
                            <td className="px-6 py-3">
                              <div className="flex items-center">
                                <div className="text-sm mr-2">
                                  <Activity className="h-4 w-4 text-slate-500" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm text-slate-900">{agent.name}</div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className={`${getModelBadgeColor(agent.model)} text-xs font-mono`}
                                    >
                                      {agent.model}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={`${getEnvBadgeColor(agent.env)} text-xs font-mono`}
                                    >
                                      {agent.env}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-mono"
                                    >
                                      {agent.version}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {getStatusIcon(agent.status)}
                                <span className="ml-2 text-sm font-medium capitalize text-slate-900">
                                  {agent.status}
                                </span>
                                {agent.errorCount > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-red-50 text-red-700 border-red-200 text-xs font-mono"
                                  >
                                    {agent.errorCount}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-slate-600">Budget:</span>
                                  <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        agent.budgetUsed >= 90 ? 'bg-red-500' : 
                                        agent.budgetUsed >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${agent.budgetUsed}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-mono text-xs">{agent.budgetUsed}%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-slate-600">Steps:</span>
                                  <span className="font-mono">{agent.stepLimit}</span>
                                  <span className="text-slate-600">Memory:</span>
                                  <span className="font-mono">{agent.memoryUsed}GB</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-slate-600">Rate:</span>
                                  <span className="font-mono">{agent.rateLimit}</span>
                                  {agent.loopDetected && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                      Loop
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center text-sm">
                                {agent.lastError ? (
                                  <>
                                    <span className="mr-2">{getErrorIcon(agent.errorType)}</span>
                                    <span className="text-slate-900 font-mono text-xs">{agent.lastError}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-500 italic text-xs">No errors</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-slate-600 font-mono">{agent.lastRun}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs font-medium border-slate-200 hover:bg-slate-50 active:scale-98 transition-transform bg-transparent"
                                  onClick={() => router.push(`/workflow-debug`)}
                                >
                                  <Bug className="h-3 w-3 mr-1" />
                                  Debug
                                </Button>
                                {agent.status === "failing" && (
                                  <Button
                                    size="sm"
                                    className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white active:scale-98 transition-transform"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Retry
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eval" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Total Tests</span>
                        <span className="font-mono font-semibold text-sm">{testMetrics.total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-600">Passed</span>
                        <span className="font-mono font-semibold text-sm text-emerald-600">{testMetrics.passed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-red-600">Failed</span>
                        <span className="font-mono font-semibold text-sm text-red-600">{testMetrics.failed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-amber-600">Warning</span>
                        <span className="font-mono font-semibold text-sm text-amber-600">{testMetrics.warning}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600">Coverage</span>
                          <span className="font-mono font-semibold text-sm">{testMetrics.coverage}%</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs h-8 active:scale-98 transition-transform"
                      onClick={() => router.push("/tests")}
                    >
                      View All Tests
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Regressions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Active Regressions</span>
                        <span className="font-mono font-semibold text-sm text-red-600">{testMetrics.regressions}</span>
                      </div>
                      <div className="p-3 bg-red-50 rounded-md border border-red-100">
                        <div className="text-xs font-semibold text-red-800">Refund Processor Accuracy</div>
                        <div className="text-xs text-red-600 mt-1 font-mono">92% → 65% (-27%)</div>
                        <div className="text-xs text-slate-600 mt-1">After v3.2 deployment</div>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-medium text-xs h-8 active:scale-98 transition-transform"
                      onClick={() => router.push("/tests?status=regressed")}
                    >
                      Fix Regressions
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Workflow Success Rate</span>
                        <span className="font-mono font-semibold text-sm text-red-600">76% ↓</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Avg Response Time</span>
                        <span className="font-mono font-semibold text-sm text-red-600">2.1s ↑</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Hallucination Rate</span>
                        <span className="font-mono font-semibold text-sm text-red-600">5.2% ↑</span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-8 active:scale-98 transition-transform"
                      onClick={() => router.push("/analytics")}
                    >
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-3">
                    <CardTitle className="text-sm font-bold text-slate-900">Usage Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-100">
                        <div>
                          <div className="font-medium text-sm text-slate-900">Replit Refund Processor</div>
                          <div className="text-xs text-slate-600">Critical failures increasing</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold text-sm">1,247 requests</div>
                          <div className="text-xs text-red-600 font-medium">-35% success</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                        <div>
                          <div className="font-medium text-sm text-slate-900">Cursor Support Bot</div>
                          <div className="text-xs text-slate-600">Most active this week</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold text-sm">2,847 queries</div>
                          <div className="text-xs text-emerald-600 font-medium">+18%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="px-4 pt-4 pb-3">
                    <CardTitle className="text-sm font-bold text-slate-900">Workflow Coverage</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-700">Refund Processor</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-slate-200 rounded-full h-1.5 mr-2">
                            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <span className="text-xs font-mono font-semibold">65%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-700">Support Bot</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-slate-200 rounded-full h-1.5 mr-2">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                          <span className="text-xs font-mono font-semibold">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-700">Codebase Navigation</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-slate-200 rounded-full h-1.5 mr-2">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                          <span className="text-xs font-mono font-semibold">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-700">Documentation Q&A</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-slate-200 rounded-full h-1.5 mr-2">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "89%" }}></div>
                          </div>
                          <span className="text-xs font-mono font-semibold">89%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rag" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600">Chunks Retrieved</p>
                        <p className="text-xl font-mono font-bold text-slate-900">{ragMetrics.chunksRetrieved}</p>
                      </div>
                      <FileText className="h-6 w-6 text-slate-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600">Avg Relevance</p>
                        <p className="text-xl font-mono font-bold text-slate-900">{ragMetrics.avgRelevance}</p>
                      </div>
                      <Activity className="h-6 w-6 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600">Groundedness</p>
                        <p className="text-xl font-mono font-bold text-slate-900">{ragMetrics.groundednessScore}%</p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600">Hallucinations</p>
                        <p className="text-xl font-mono font-bold text-slate-900">{ragMetrics.hallucinations}</p>
                      </div>
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="px-4 pt-4 pb-3">
                  <CardTitle className="text-sm font-bold text-slate-900">Recent RAG Issues</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-md border border-red-100">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        <div>
                          <div className="font-medium text-sm text-slate-900">Refund Processor Timeout</div>
                          <div className="text-xs text-slate-600">Payment gateway connection failures</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-medium border-slate-200 hover:bg-slate-50 active:scale-98 transition-transform bg-transparent"
                        onClick={() => router.push("/workflow-debug")}
                      >
                        Debug
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-md border border-red-100">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        <div>
                          <div className="font-medium text-sm text-slate-900">Support Bot Hallucination</div>
                          <div className="text-xs text-slate-600">Device policy claim not grounded in docs</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-medium border-slate-200 hover:bg-slate-50 active:scale-98 transition-transform bg-transparent"
                        onClick={() => router.push("/workflow-debug")}
                      >
                        Debug
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-md border border-orange-100">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 text-orange-500 mr-2" />
                        <div>
                          <div className="font-medium text-sm text-slate-900">Context Overflow</div>
                          <div className="text-xs text-slate-600">Navigation query exceeded token limits</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-medium border-slate-200 hover:bg-slate-50 active:scale-98 transition-transform bg-transparent"
                      >
                        Optimize
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Activity Feed */}
        <div className="w-80 bg-white border-l border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-slate-900">Activity Feed</h2>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group ${
                  activity.severity === "critical"
                    ? "bg-red-50 border-red-200"
                    : activity.severity === "high"
                      ? "bg-orange-50 border-orange-200"
                      : activity.severity === "medium"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    {getActivityIcon(activity.type)}
                    <div className="ml-2 flex-1">
                      <div className="font-medium text-xs text-slate-900">{activity.title}</div>
                      <div className="text-xs text-slate-600 mt-1">{activity.description}</div>
                      <div className="text-xs text-slate-500 mt-2 font-mono">{activity.time}</div>

                      {/* Inline log preview with hover to expand */}
                      <div className="mt-2 p-2 bg-slate-900 rounded text-xs font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {activity.logPreview}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </div>

                {/* Action buttons for specific activity types */}
                {activity.type === "workflow_failure" && (
                  <div className="mt-2 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-transparent border-slate-200 hover:bg-slate-50 font-medium active:scale-98 transition-transform"
                    >
                      <Bug className="h-3 w-3 mr-1" />
                      Debug
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-transparent border-slate-200 hover:bg-slate-50 font-medium active:scale-98 transition-transform"
                    >
                      <TestTube className="h-3 w-3 mr-1" />
                      Save as Test
                    </Button>
                  </div>
                )}

                {activity.type === "multi_agent_success" && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-transparent border-slate-200 hover:bg-slate-50 font-medium active:scale-98 transition-transform"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Workflow
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              className="w-full bg-transparent border-slate-200 hover:bg-slate-50 font-medium text-xs active:scale-98 transition-transform"
              onClick={() => router.push("/activity")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
