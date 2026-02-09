"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  Play,
  Pause,
  Square,
  Zap,
  DollarSign,
  Activity,
  Lock,
  Unlock,
  RefreshCw,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
  Search,
  AlertCircle,
  Bot,
  StopCircle,
  CircleDot,
  MemoryStick,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Hash,
  ArrowDownUp,
  Repeat,
  Undo2,
  Cloud,
  Check,
  X,
  Save,
  Gauge,
} from "lucide-react"

// Types
type AgentStatus = "running" | "paused" | "stopped" | "error"
type BreakerState = "closed" | "open" | "half_open"
type RuleAction = "block" | "warn" | "log"

interface LiveAgent {
  id: string
  name: string
  status: AgentStatus
  model: string
  budgetUsed: number
  budgetLimit: number
  stepsUsed: number
  stepLimit: number
  memoryUsedMb: number
  memoryLimitMb: number
  uptime: string
  loopDetected: boolean
  rateUsage: number
  rateLimit: number
  lastAction: string
  canRollback: boolean
}

interface CircuitBreakerEntry {
  id: string
  name: string
  target: string
  state: BreakerState
  failureCount: number
  failureThreshold: number
  lastFailure: string | null
  timeoutSeconds: number
  cooldownRemaining: number | null
}

interface ControlRule {
  id: string
  name: string
  condition: string
  action: RuleAction
  target: string
  enabled: boolean
  triggeredCount: number
  lastTriggered: string | null
}

interface ToolAccessRow {
  agentId: string
  agentName: string
  tools: Record<string, boolean>
}

interface DecisionEntry {
  id: string
  agent: string
  decision: string
  lockedAt: string
  reason: string
  locked: boolean
}

interface ActivityEvent {
  id: string
  timestamp: string
  type: "control" | "rule" | "breaker" | "rollback" | "decision"
  agent: string
  message: string
  severity: "info" | "warning" | "critical"
}

export function AgentRules() {
  const [activeTab, setActiveTab] = useState("agents")
  const [searchQuery, setSearchQuery] = useState("")
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [editingRule, setEditingRule] = useState<ControlRule | null>(null)
  const [showConfirmStop, setShowConfirmStop] = useState(false)
  const [confirmStopTarget, setConfirmStopTarget] = useState<string | null>(null)
  const [showGlobalStopConfirm, setShowGlobalStopConfirm] = useState(false)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [editingAgentLimits, setEditingAgentLimits] = useState<string | null>(null)
  const [editingBreaker, setEditingBreaker] = useState<string | null>(null)
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "",
    action: "block" as RuleAction,
    target: "all",
  })
  const [newDecision, setNewDecision] = useState({
    agent: "",
    decision: "",
    reason: "",
  })

  // Temp edit state for inline editing
  const [tempLimits, setTempLimits] = useState<Record<string, any>>({})
  const [tempBreaker, setTempBreaker] = useState<Record<string, any>>({})

  // --- Mock Data ---

  const [agents, setAgents] = useState<LiveAgent[]>([
    {
      id: "agent-1",
      name: "researcher",
      status: "running",
      model: "GPT-4o",
      budgetUsed: 3.47,
      budgetLimit: 5.0,
      stepsUsed: 34,
      stepLimit: 50,
      memoryUsedMb: 128,
      memoryLimitMb: 256,
      uptime: "12m 34s",
      loopDetected: false,
      rateUsage: 12,
      rateLimit: 20,
      lastAction: "web_search('AI trends 2025')",
      canRollback: true,
    },
    {
      id: "agent-2",
      name: "coder",
      status: "running",
      model: "Claude 3 Opus",
      budgetUsed: 7.82,
      budgetLimit: 10.0,
      stepsUsed: 78,
      stepLimit: 100,
      memoryUsedMb: 195,
      memoryLimitMb: 256,
      uptime: "8m 12s",
      loopDetected: true,
      rateUsage: 28,
      rateLimit: 30,
      lastAction: "code_exec('fix_tests.py')",
      canRollback: true,
    },
    {
      id: "agent-3",
      name: "writer",
      status: "paused",
      model: "GPT-4o",
      budgetUsed: 1.23,
      budgetLimit: 5.0,
      stepsUsed: 15,
      stepLimit: 50,
      memoryUsedMb: 64,
      memoryLimitMb: 256,
      uptime: "5m 02s",
      loopDetected: false,
      rateUsage: 0,
      rateLimit: 20,
      lastAction: "write_file('report.md')",
      canRollback: true,
    },
    {
      id: "agent-4",
      name: "reviewer",
      status: "running",
      model: "Claude 3.5 Sonnet",
      budgetUsed: 0.89,
      budgetLimit: 3.0,
      stepsUsed: 8,
      stepLimit: 30,
      memoryUsedMb: 42,
      memoryLimitMb: 128,
      uptime: "2m 45s",
      loopDetected: false,
      rateUsage: 5,
      rateLimit: 15,
      lastAction: "read_file('main.py')",
      canRollback: false,
    },
    {
      id: "agent-5",
      name: "planner",
      status: "stopped",
      model: "GPT-4o",
      budgetUsed: 4.99,
      budgetLimit: 5.0,
      stepsUsed: 50,
      stepLimit: 50,
      memoryUsedMb: 210,
      memoryLimitMb: 256,
      uptime: "0s",
      loopDetected: false,
      rateUsage: 0,
      rateLimit: 20,
      lastAction: "plan_task('deploy pipeline')",
      canRollback: true,
    },
  ])

  const [breakers, setBreakers] = useState<CircuitBreakerEntry[]>([
    {
      id: "cb-1",
      name: "OpenAI API",
      target: "openai",
      state: "closed",
      failureCount: 1,
      failureThreshold: 5,
      lastFailure: "4m ago",
      timeoutSeconds: 60,
      cooldownRemaining: null,
    },
    {
      id: "cb-2",
      name: "Anthropic API",
      target: "anthropic",
      state: "open",
      failureCount: 5,
      failureThreshold: 5,
      lastFailure: "1m ago",
      timeoutSeconds: 60,
      cooldownRemaining: 34,
    },
    {
      id: "cb-3",
      name: "Database Writes",
      target: "db_write",
      state: "closed",
      failureCount: 0,
      failureThreshold: 3,
      lastFailure: null,
      timeoutSeconds: 120,
      cooldownRemaining: null,
    },
    {
      id: "cb-4",
      name: "External APIs",
      target: "external",
      state: "half_open",
      failureCount: 3,
      failureThreshold: 5,
      lastFailure: "8m ago",
      timeoutSeconds: 90,
      cooldownRemaining: null,
    },
  ])

  const [rules, setRules] = useState<ControlRule[]>([
    {
      id: "rule-1",
      name: "Block production writes",
      condition: "tool == 'db_write' AND env == 'production'",
      action: "block",
      target: "all",
      enabled: true,
      triggeredCount: 12,
      lastTriggered: "3m ago",
    },
    {
      id: "rule-2",
      name: "Warn on high spend",
      condition: "budget_used > 0.8 * budget_limit",
      action: "warn",
      target: "all",
      enabled: true,
      triggeredCount: 5,
      lastTriggered: "1m ago",
    },
    {
      id: "rule-3",
      name: "Log all file deletions",
      condition: "tool == 'delete_file'",
      action: "log",
      target: "all",
      enabled: true,
      triggeredCount: 3,
      lastTriggered: "15m ago",
    },
    {
      id: "rule-4",
      name: "Block shell exec for writer",
      condition: "tool == 'shell_exec'",
      action: "block",
      target: "writer",
      enabled: true,
      triggeredCount: 1,
      lastTriggered: "20m ago",
    },
    {
      id: "rule-5",
      name: "Warn on 3+ retries",
      condition: "retry_count >= 3",
      action: "warn",
      target: "all",
      enabled: false,
      triggeredCount: 0,
      lastTriggered: null,
    },
  ])

  const [toolAccess, setToolAccess] = useState<ToolAccessRow[]>([
    {
      agentId: "agent-1",
      agentName: "researcher",
      tools: { web_search: true, read_file: true, write_file: false, code_exec: false, db_query: true, shell_exec: false, delete_file: false },
    },
    {
      agentId: "agent-2",
      agentName: "coder",
      tools: { web_search: false, read_file: true, write_file: true, code_exec: true, db_query: false, shell_exec: true, delete_file: false },
    },
    {
      agentId: "agent-3",
      agentName: "writer",
      tools: { web_search: true, read_file: true, write_file: true, code_exec: false, db_query: false, shell_exec: false, delete_file: false },
    },
    {
      agentId: "agent-4",
      agentName: "reviewer",
      tools: { web_search: false, read_file: true, write_file: false, code_exec: false, db_query: true, shell_exec: false, delete_file: false },
    },
    {
      agentId: "agent-5",
      agentName: "planner",
      tools: { web_search: true, read_file: true, write_file: false, code_exec: false, db_query: false, shell_exec: false, delete_file: false },
    },
  ])

  const [decisions, setDecisions] = useState<DecisionEntry[]>([
    {
      id: "dec-1",
      agent: "coder",
      decision: "Use PostgreSQL for data storage",
      lockedAt: "6m ago",
      reason: "Architecture decision — cannot flip-flop",
      locked: true,
    },
    {
      id: "dec-2",
      agent: "planner",
      decision: "Deploy to staging before production",
      lockedAt: "12m ago",
      reason: "Pipeline order enforced",
      locked: true,
    },
    {
      id: "dec-3",
      agent: "researcher",
      decision: "Use GPT-4o for summarization",
      lockedAt: "3m ago",
      reason: "Model choice locked after first call",
      locked: false,
    },
  ])

  const [activityLog] = useState<ActivityEvent[]>([
    { id: "ev-1", timestamp: "0m ago", type: "control", agent: "coder", message: "Loop detected — auto-broken after 3 repeated actions", severity: "warning" },
    { id: "ev-2", timestamp: "1m ago", type: "breaker", agent: "system", message: "Anthropic API circuit breaker OPENED — 5 consecutive failures", severity: "critical" },
    { id: "ev-3", timestamp: "1m ago", type: "rule", agent: "writer", message: "Rule 'Block shell exec for writer' triggered — shell_exec blocked", severity: "warning" },
    { id: "ev-4", timestamp: "3m ago", type: "rule", agent: "coder", message: "Rule 'Block production writes' triggered — db_write blocked", severity: "warning" },
    { id: "ev-5", timestamp: "3m ago", type: "decision", agent: "researcher", message: "Decision unlocked: 'Use GPT-4o for summarization'", severity: "info" },
    { id: "ev-6", timestamp: "5m ago", type: "control", agent: "writer", message: "Agent paused by operator", severity: "info" },
    { id: "ev-7", timestamp: "6m ago", type: "decision", agent: "coder", message: "Decision locked: 'Use PostgreSQL for data storage'", severity: "info" },
    { id: "ev-8", timestamp: "8m ago", type: "rollback", agent: "planner", message: "Last action rolled back — resumed from safe checkpoint", severity: "warning" },
    { id: "ev-9", timestamp: "10m ago", type: "breaker", agent: "system", message: "External APIs circuit breaker moved to HALF_OPEN", severity: "info" },
    { id: "ev-10", timestamp: "12m ago", type: "control", agent: "planner", message: "Agent stopped — budget limit reached ($5.00/$5.00)", severity: "critical" },
  ])

  // --- Computed ---

  const runningCount = agents.filter((a) => a.status === "running").length
  const pausedCount = agents.filter((a) => a.status === "paused").length
  const totalBudgetUsed = agents.reduce((s, a) => s + a.budgetUsed, 0)
  const totalBudgetLimit = agents.reduce((s, a) => s + a.budgetLimit, 0)
  const openBreakers = breakers.filter((b) => b.state === "open").length
  const activeRules = rules.filter((r) => r.enabled).length
  const loopsDetected = agents.filter((a) => a.loopDetected).length

  // --- Handlers ---

  const handlePauseAgent = (agentId: string) => {
    setAgents(agents.map((a) =>
      a.id === agentId && a.status === "running" ? { ...a, status: "paused" as AgentStatus, rateUsage: 0 } : a
    ))
  }

  const handleResumeAgent = (agentId: string) => {
    setAgents(agents.map((a) =>
      a.id === agentId && a.status === "paused" ? { ...a, status: "running" as AgentStatus } : a
    ))
  }

  const handleStopAgent = (agentId: string) => {
    setConfirmStopTarget(agentId)
    setShowConfirmStop(true)
  }

  const confirmStop = () => {
    if (confirmStopTarget) {
      setAgents(agents.map((a) =>
        a.id === confirmStopTarget ? { ...a, status: "stopped" as AgentStatus, rateUsage: 0 } : a
      ))
    }
    setShowConfirmStop(false)
    setConfirmStopTarget(null)
  }

  const handleBreakLoop = (agentId: string) => {
    setAgents(agents.map((a) =>
      a.id === agentId ? { ...a, loopDetected: false } : a
    ))
  }

  const handleRollback = (agentId: string) => {
    setAgents(agents.map((a) =>
      a.id === agentId ? { ...a, canRollback: false } : a
    ))
  }

  const handleGlobalStop = () => {
    setAgents(agents.map((a) => ({ ...a, status: "stopped" as AgentStatus, rateUsage: 0 })))
    setShowGlobalStopConfirm(false)
  }

  const handlePauseAll = () => {
    setAgents(agents.map((a) =>
      a.status === "running" ? { ...a, status: "paused" as AgentStatus, rateUsage: 0 } : a
    ))
  }

  const handleResumeAll = () => {
    setAgents(agents.map((a) =>
      a.status === "paused" ? { ...a, status: "running" as AgentStatus } : a
    ))
  }

  const handleToggleBreaker = (breakerId: string) => {
    setBreakers(breakers.map((b) => {
      if (b.id !== breakerId) return b
      if (b.state === "open") return { ...b, state: "closed" as BreakerState, failureCount: 0, cooldownRemaining: null }
      return { ...b, state: "open" as BreakerState, failureCount: b.failureThreshold, cooldownRemaining: b.timeoutSeconds }
    }))
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map((r) =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId))
  }

  const handleSaveRule = () => {
    if (editingRule) {
      setRules(rules.map((r) =>
        r.id === editingRule.id ? { ...r, name: newRule.name, condition: newRule.condition, action: newRule.action, target: newRule.target } : r
      ))
      setEditingRule(null)
    } else {
      setRules([...rules, {
        id: `rule-${Date.now()}`,
        name: newRule.name,
        condition: newRule.condition,
        action: newRule.action,
        target: newRule.target,
        enabled: true,
        triggeredCount: 0,
        lastTriggered: null,
      }])
    }
    setShowRuleModal(false)
    setNewRule({ name: "", condition: "", action: "block", target: "all" })
  }

  const handleEditRule = (rule: ControlRule) => {
    setEditingRule(rule)
    setNewRule({ name: rule.name, condition: rule.condition, action: rule.action, target: rule.target })
    setShowRuleModal(true)
  }

  const handleToggleToolAccess = (agentId: string, tool: string) => {
    setToolAccess(toolAccess.map((row) =>
      row.agentId === agentId ? { ...row, tools: { ...row.tools, [tool]: !row.tools[tool] } } : row
    ))
  }

  const handleToggleDecision = (decId: string) => {
    setDecisions(decisions.map((d) =>
      d.id === decId ? { ...d, locked: !d.locked } : d
    ))
  }

  const handleAddDecision = () => {
    if (!newDecision.agent || !newDecision.decision) return
    setDecisions([...decisions, {
      id: `dec-${Date.now()}`,
      agent: newDecision.agent,
      decision: newDecision.decision,
      reason: newDecision.reason,
      lockedAt: "just now",
      locked: true,
    }])
    setShowDecisionModal(false)
    setNewDecision({ agent: "", decision: "", reason: "" })
  }

  const handleDeleteDecision = (decId: string) => {
    setDecisions(decisions.filter((d) => d.id !== decId))
  }

  // Inline limit editing
  const startEditingLimits = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) return
    setTempLimits({
      budgetLimit: agent.budgetLimit,
      stepLimit: agent.stepLimit,
      memoryLimitMb: agent.memoryLimitMb,
      rateLimit: agent.rateLimit,
    })
    setEditingAgentLimits(agentId)
  }

  const saveLimits = (agentId: string) => {
    setAgents(agents.map((a) =>
      a.id === agentId ? {
        ...a,
        budgetLimit: Number(tempLimits.budgetLimit) || a.budgetLimit,
        stepLimit: Number(tempLimits.stepLimit) || a.stepLimit,
        memoryLimitMb: Number(tempLimits.memoryLimitMb) || a.memoryLimitMb,
        rateLimit: Number(tempLimits.rateLimit) || a.rateLimit,
      } : a
    ))
    setEditingAgentLimits(null)
  }

  const startEditingBreaker = (breakerId: string) => {
    const breaker = breakers.find((b) => b.id === breakerId)
    if (!breaker) return
    setTempBreaker({
      failureThreshold: breaker.failureThreshold,
      timeoutSeconds: breaker.timeoutSeconds,
    })
    setEditingBreaker(breakerId)
  }

  const saveBreakerConfig = (breakerId: string) => {
    setBreakers(breakers.map((b) =>
      b.id === breakerId ? {
        ...b,
        failureThreshold: Number(tempBreaker.failureThreshold) || b.failureThreshold,
        timeoutSeconds: Number(tempBreaker.timeoutSeconds) || b.timeoutSeconds,
      } : b
    ))
    setEditingBreaker(null)
  }

  // --- Helpers ---

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "running": return "bg-green-100 text-green-800 border-green-200"
      case "paused": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "stopped": return "bg-gray-100 text-gray-600 border-gray-200"
      case "error": return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case "running": return <Play className="h-3 w-3" />
      case "paused": return <Pause className="h-3 w-3" />
      case "stopped": return <Square className="h-3 w-3" />
      case "error": return <AlertCircle className="h-3 w-3" />
    }
  }

  const getBreakerColor = (state: BreakerState) => {
    switch (state) {
      case "closed": return "bg-green-100 text-green-800 border-green-300"
      case "open": return "bg-red-100 text-red-800 border-red-300"
      case "half_open": return "bg-yellow-100 text-yellow-800 border-yellow-300"
    }
  }

  const getBreakerIcon = (state: BreakerState) => {
    switch (state) {
      case "closed": return <ShieldCheck className="h-4 w-4 text-green-600" />
      case "open": return <ShieldOff className="h-4 w-4 text-red-600" />
      case "half_open": return <ShieldAlert className="h-4 w-4 text-yellow-600" />
    }
  }

  const getBreakerLabel = (state: BreakerState) => {
    switch (state) {
      case "closed": return "Closed"
      case "open": return "Open"
      case "half_open": return "Half-Open"
    }
  }

  const getRuleActionColor = (action: RuleAction) => {
    switch (action) {
      case "block": return "bg-red-100 text-red-800 border-red-200"
      case "warn": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "log": return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600"
      case "warning": return "text-yellow-600"
      default: return "text-gray-500"
    }
  }

  const budgetPercent = (used: number, limit: number) => Math.min(100, (used / limit) * 100)

  const budgetBarColor = (pct: number) => {
    if (pct >= 90) return "bg-red-500"
    if (pct >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const allTools = ["web_search", "read_file", "write_file", "code_exec", "db_query", "shell_exec", "delete_file"]

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-2">
      {/* Top Bar */}
      <div className="flex items-center gap-3 p-2 border rounded-md bg-white">
        <div className="flex items-center gap-2 flex-1">
          <Gauge className="h-5 w-5 text-[var(--splinter-red)]" />
          <span className="font-semibold text-sm">Control Layer</span>
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200" variant="outline">
            <Cloud className="h-3 w-3 mr-1" />
            Cloud
          </Badge>
          <Separator orientation="vertical" className="h-5" />
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResumeAll}>
            <Play className="h-3.5 w-3.5 mr-1" />
            Resume All
          </Button>
          <Button variant="outline" size="sm" onClick={handlePauseAll}>
            <Pause className="h-3.5 w-3.5 mr-1" />
            Pause All
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowGlobalStopConfirm(true)}
          >
            <StopCircle className="h-3.5 w-3.5 mr-1" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 p-2 border rounded-md bg-gray-50 text-sm">
        <div className="flex items-center gap-1.5">
          <CircleDot className="h-4 w-4 text-green-600" />
          <span className="font-medium">{runningCount}</span>
          <span className="text-gray-600">Running</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5">
          <Pause className="h-4 w-4 text-yellow-600" />
          <span className="font-medium">{pausedCount}</span>
          <span className="text-gray-600">Paused</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="font-medium">${totalBudgetUsed.toFixed(2)}</span>
          <span className="text-gray-600">/ ${totalBudgetLimit.toFixed(2)}</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5">
          <ShieldOff className="h-4 w-4 text-red-600" />
          <span className="font-medium">{openBreakers}</span>
          <span className="text-gray-600">Breakers Open</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{activeRules}</span>
          <span className="text-gray-600">Rules Active</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5">
          <Repeat className="h-4 w-4 text-orange-600" />
          <span className="font-medium">{loopsDetected}</span>
          <span className="text-gray-600">Loops</span>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-white border">
          <TabsTrigger value="agents" className="text-xs gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            Live Agents
          </TabsTrigger>
          <TabsTrigger value="breakers" className="text-xs gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Circuit Breakers
          </TabsTrigger>
          <TabsTrigger value="rules" className="text-xs gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Rules Engine
          </TabsTrigger>
          <TabsTrigger value="access" className="text-xs gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Tool Access
          </TabsTrigger>
          <TabsTrigger value="decisions" className="text-xs gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Decisions
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* ===== LIVE AGENTS TAB ===== */}
        <TabsContent value="agents" className="mt-2">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                Live Agent Controls
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {runningCount} running
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {filteredAgents.map((agent) => {
                  const isEditing = editingAgentLimits === agent.id
                  const bPct = budgetPercent(agent.budgetUsed, agent.budgetLimit)
                  const sPct = budgetPercent(agent.stepsUsed, agent.stepLimit)
                  const mPct = budgetPercent(agent.memoryUsedMb, agent.memoryLimitMb)
                  const rPct = budgetPercent(agent.rateUsage, agent.rateLimit)
                  return (
                    <div key={agent.id} className={`border-b p-3 ${agent.status === "stopped" ? "opacity-50" : ""}`}>
                      {/* Row 1: Name, status, model, actions */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <Bot className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm font-mono">{agent.name}</span>
                        </div>
                        <Badge className={getStatusColor(agent.status)} variant="outline">
                          {getStatusIcon(agent.status)}
                          <span className="ml-1">{agent.status}</span>
                        </Badge>
                        <span className="text-xs text-gray-500">{agent.model}</span>
                        <span className="text-xs text-gray-400">up {agent.uptime}</span>
                        {agent.loopDetected && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 animate-pulse" variant="outline">
                            <Repeat className="h-3 w-3 mr-1" />
                            Loop
                          </Badge>
                        )}
                        <div className="flex-1" />
                        <div className="flex items-center gap-1">
                          {!isEditing ? (
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => startEditingLimits(agent.id)}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Limits
                            </Button>
                          ) : (
                            <>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" onClick={() => saveLimits(agent.id)}>
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditingAgentLimits(null)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Separator orientation="vertical" className="h-5 mx-1" />
                          {agent.status === "running" && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handlePauseAgent(agent.id)}>
                              <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                          )}
                          {agent.status === "paused" && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleResumeAgent(agent.id)}>
                              <Play className="h-3 w-3 mr-1" />
                              Resume
                            </Button>
                          )}
                          {agent.status !== "stopped" && (
                            <Button variant="outline" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700" onClick={() => handleStopAgent(agent.id)}>
                              <Square className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                          )}
                          {agent.loopDetected && (
                            <Button variant="outline" size="sm" className="h-7 text-xs text-orange-600" onClick={() => handleBreakLoop(agent.id)}>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Break Loop
                            </Button>
                          )}
                          {agent.canRollback && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRollback(agent.id)}>
                              <Undo2 className="h-3 w-3 mr-1" />
                              Rollback
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Limits — editable or display */}
                      <div className="grid grid-cols-4 gap-4 pl-6">
                        {/* Budget */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />Budget
                            </span>
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-mono">${agent.budgetUsed.toFixed(2)} /</span>
                                <Input
                                  type="number"
                                  step="0.5"
                                  className="h-5 w-16 text-xs font-mono px-1 py-0"
                                  value={tempLimits.budgetLimit}
                                  onChange={(e) => setTempLimits({ ...tempLimits, budgetLimit: e.target.value })}
                                />
                              </div>
                            ) : (
                              <span className="text-xs font-mono">${agent.budgetUsed.toFixed(2)} / ${agent.budgetLimit.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${budgetBarColor(bPct)}`} style={{ width: `${bPct}%` }} />
                          </div>
                        </div>
                        {/* Steps */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Hash className="h-3 w-3" />Steps
                            </span>
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-mono">{agent.stepsUsed} /</span>
                                <Input
                                  type="number"
                                  className="h-5 w-16 text-xs font-mono px-1 py-0"
                                  value={tempLimits.stepLimit}
                                  onChange={(e) => setTempLimits({ ...tempLimits, stepLimit: e.target.value })}
                                />
                              </div>
                            ) : (
                              <span className="text-xs font-mono">{agent.stepsUsed} / {agent.stepLimit}</span>
                            )}
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${budgetBarColor(sPct)}`} style={{ width: `${sPct}%` }} />
                          </div>
                        </div>
                        {/* Memory */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MemoryStick className="h-3 w-3" />Memory
                            </span>
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-mono">{agent.memoryUsedMb}MB /</span>
                                <Input
                                  type="number"
                                  className="h-5 w-16 text-xs font-mono px-1 py-0"
                                  value={tempLimits.memoryLimitMb}
                                  onChange={(e) => setTempLimits({ ...tempLimits, memoryLimitMb: e.target.value })}
                                />
                              </div>
                            ) : (
                              <span className="text-xs font-mono">{agent.memoryUsedMb}MB / {agent.memoryLimitMb}MB</span>
                            )}
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${budgetBarColor(mPct)}`} style={{ width: `${mPct}%` }} />
                          </div>
                        </div>
                        {/* Rate */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <ArrowDownUp className="h-3 w-3" />Rate
                            </span>
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-mono">{agent.rateUsage} /</span>
                                <Input
                                  type="number"
                                  className="h-5 w-16 text-xs font-mono px-1 py-0"
                                  value={tempLimits.rateLimit}
                                  onChange={(e) => setTempLimits({ ...tempLimits, rateLimit: e.target.value })}
                                />
                                <span className="text-xs text-gray-400">/min</span>
                              </div>
                            ) : (
                              <span className="text-xs font-mono">{agent.rateUsage} / {agent.rateLimit} /min</span>
                            )}
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${budgetBarColor(rPct)}`} style={{ width: `${rPct}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Last action */}
                      <div className="pl-6 mt-2">
                        <span className="text-xs text-gray-400">Last action: </span>
                        <span className="text-xs font-mono text-gray-600">{agent.lastAction}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              {filteredAgents.length === 0 && (
                <div className="p-12 text-center">
                  <Bot className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No agents match your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== CIRCUIT BREAKERS TAB ===== */}
        <TabsContent value="breakers" className="mt-2">
          <div className="grid grid-cols-2 gap-3">
            {breakers.map((breaker) => {
              const isEditingThis = editingBreaker === breaker.id
              return (
                <Card key={breaker.id} className={breaker.state === "open" ? "border-red-300" : breaker.state === "half_open" ? "border-yellow-300" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getBreakerIcon(breaker.state)}
                        <div>
                          <div className="font-medium text-sm">{breaker.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{breaker.target}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getBreakerColor(breaker.state)} variant="outline">
                          {getBreakerLabel(breaker.state)}
                        </Badge>
                        {!isEditingThis ? (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => startEditingBreaker(breaker.id)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        ) : (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-green-600" onClick={() => saveBreakerConfig(breaker.id)}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setEditingBreaker(null)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Failures</span>
                        {isEditingThis ? (
                          <div className="flex items-center gap-1">
                            <span className="font-mono">{breaker.failureCount} /</span>
                            <Input
                              type="number"
                              className="h-5 w-14 text-xs font-mono px-1 py-0"
                              value={tempBreaker.failureThreshold}
                              onChange={(e) => setTempBreaker({ ...tempBreaker, failureThreshold: e.target.value })}
                            />
                          </div>
                        ) : (
                          <span className="font-mono">{breaker.failureCount} / {breaker.failureThreshold}</span>
                        )}
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${breaker.state === "open" ? "bg-red-500" : breaker.state === "half_open" ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${budgetPercent(breaker.failureCount, breaker.failureThreshold)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Timeout</span>
                        {isEditingThis ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              className="h-5 w-14 text-xs font-mono px-1 py-0"
                              value={tempBreaker.timeoutSeconds}
                              onChange={(e) => setTempBreaker({ ...tempBreaker, timeoutSeconds: e.target.value })}
                            />
                            <span className="text-gray-400">s</span>
                          </div>
                        ) : (
                          <span className="font-mono">{breaker.timeoutSeconds}s</span>
                        )}
                      </div>
                      {breaker.lastFailure && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last failure</span>
                          <span>{breaker.lastFailure}</span>
                        </div>
                      )}
                      {breaker.cooldownRemaining !== null && (
                        <div className="flex justify-between text-red-600">
                          <span>Cooldown remaining</span>
                          <span className="font-mono">{breaker.cooldownRemaining}s</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t flex gap-2">
                      {breaker.state === "open" ? (
                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleToggleBreaker(breaker.id)}>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reset Breaker
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1 text-xs text-red-600" onClick={() => handleToggleBreaker(breaker.id)}>
                          <ShieldOff className="h-3 w-3 mr-1" />
                          Trip Breaker
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ===== RULES ENGINE TAB ===== */}
        <TabsContent value="rules" className="mt-2">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  Rules Engine
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {rules.length} rules
                  </Badge>
                </CardTitle>
                <Button size="sm" onClick={() => {
                  setEditingRule(null)
                  setNewRule({ name: "", condition: "", action: "block", target: "all" })
                  setShowRuleModal(true)
                }}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {rules.map((rule) => (
                  <div key={rule.id} className={`border-b p-3 flex items-center gap-3 ${!rule.enabled ? "opacity-50" : ""}`}>
                    <Checkbox
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                    <Badge className={getRuleActionColor(rule.action)} variant="outline">
                      {rule.action.toUpperCase()}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{rule.name}</div>
                      <div className="text-xs text-gray-500 font-mono truncate">{rule.condition}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      target: <span className="font-mono">{rule.target}</span>
                    </div>
                    {rule.triggeredCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {rule.triggeredCount}x triggered
                      </Badge>
                    )}
                    {rule.lastTriggered && (
                      <span className="text-xs text-gray-400">{rule.lastTriggered}</span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteRule(rule.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
              {rules.length === 0 && (
                <div className="p-12 text-center">
                  <Zap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No rules configured. Add a rule to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TOOL ACCESS TAB ===== */}
        <TabsContent value="access" className="mt-2">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Tool Access Control</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-600">Agent</th>
                      {allTools.map((tool) => (
                        <th key={tool} className="p-3 font-medium text-gray-600 text-center">
                          <span className="font-mono text-xs">{tool}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {toolAccess.map((row) => (
                      <tr key={row.agentId} className="border-b">
                        <td className="p-3 font-mono text-sm font-medium">{row.agentName}</td>
                        {allTools.map((tool) => (
                          <td key={tool} className="p-3 text-center">
                            <button
                              onClick={() => handleToggleToolAccess(row.agentId, tool)}
                              className={`inline-flex items-center justify-center h-6 w-6 rounded border transition-colors ${
                                row.tools[tool]
                                  ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                                  : "bg-gray-50 border-gray-200 text-gray-300 hover:bg-gray-100 hover:text-gray-500"
                              }`}
                            >
                              {row.tools[tool] ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== DECISIONS TAB ===== */}
        <TabsContent value="decisions" className="mt-2">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  Decision Enforcement
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    {decisions.filter((d) => d.locked).length} locked
                  </Badge>
                </CardTitle>
                <Button size="sm" onClick={() => {
                  setNewDecision({ agent: "", decision: "", reason: "" })
                  setShowDecisionModal(true)
                }}>
                  <Plus className="h-4 w-4 mr-1" />
                  Lock Decision
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {decisions.map((dec) => (
                  <div key={dec.id} className="border-b p-3 flex items-center gap-3">
                    <button
                      onClick={() => handleToggleDecision(dec.id)}
                      className={`flex items-center justify-center h-7 w-7 rounded border transition-colors ${
                        dec.locked
                          ? "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {dec.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{dec.decision}</div>
                      <div className="text-xs text-gray-500">{dec.reason}</div>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">{dec.agent}</Badge>
                    <span className="text-xs text-gray-400">{dec.lockedAt}</span>
                    <Badge variant="outline" className={dec.locked ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                      {dec.locked ? "Locked" : "Unlocked"}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-600" onClick={() => handleDeleteDecision(dec.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              {decisions.length === 0 && (
                <div className="p-12 text-center">
                  <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No decisions recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ACTIVITY LOG TAB ===== */}
        <TabsContent value="activity" className="mt-2">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                Control Activity
                <Badge variant="outline">{activityLog.length} events</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                {activityLog.map((event) => (
                  <div key={event.id} className="border-b px-3 py-2 flex items-start gap-3">
                    <span className="text-xs text-gray-400 min-w-[50px] pt-0.5">{event.timestamp}</span>
                    <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${getSeverityColor(event.severity)}`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm">{event.message}</span>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono shrink-0">{event.agent}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== MODALS ===== */}

      {/* Add/Edit Rule Modal */}
      <Dialog open={showRuleModal} onOpenChange={setShowRuleModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Rule" : "Add Rule"}</DialogTitle>
            <DialogDescription>
              Define a custom rule for the Rules Engine. Rules are evaluated on every agent action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rule-name">Name</Label>
              <Input
                id="rule-name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Block production writes"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="rule-condition">Condition</Label>
              <Input
                id="rule-condition"
                value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                placeholder="e.g., tool == 'db_write' AND env == 'production'"
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Action</Label>
                <Select value={newRule.action} onValueChange={(v) => setNewRule({ ...newRule, action: v as RuleAction })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">BLOCK</SelectItem>
                    <SelectItem value="warn">WARN</SelectItem>
                    <SelectItem value="log">LOG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Agent</Label>
                <Select value={newRule.target} onValueChange={(v) => setNewRule({ ...newRule, target: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRuleModal(false)}>Cancel</Button>
            <Button onClick={handleSaveRule} disabled={!newRule.name || !newRule.condition}>
              {editingRule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Decision Modal */}
      <Dialog open={showDecisionModal} onOpenChange={setShowDecisionModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lock Decision</DialogTitle>
            <DialogDescription>
              Lock a decision so the agent cannot change its mind. Once locked, the agent must follow this decision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Agent</Label>
              <Select value={newDecision.agent} onValueChange={(v) => setNewDecision({ ...newDecision, agent: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dec-decision">Decision</Label>
              <Input
                id="dec-decision"
                value={newDecision.decision}
                onChange={(e) => setNewDecision({ ...newDecision, decision: e.target.value })}
                placeholder="e.g., Use PostgreSQL for data storage"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dec-reason">Reason</Label>
              <Input
                id="dec-reason"
                value={newDecision.reason}
                onChange={(e) => setNewDecision({ ...newDecision, reason: e.target.value })}
                placeholder="e.g., Architecture decision — cannot flip-flop"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDecisionModal(false)}>Cancel</Button>
            <Button onClick={handleAddDecision} disabled={!newDecision.agent || !newDecision.decision}>
              <Lock className="h-4 w-4 mr-1" />
              Lock Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stop Agent Confirmation */}
      <Dialog open={showConfirmStop} onOpenChange={setShowConfirmStop}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Stop Agent
            </DialogTitle>
            <DialogDescription>
              This will immediately stop the agent. Any in-progress work will be halted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmStop(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmStop}>Stop Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Stop Confirmation */}
      <Dialog open={showGlobalStopConfirm} onOpenChange={setShowGlobalStopConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StopCircle className="h-5 w-5 text-red-600" />
              Emergency Stop All Agents
            </DialogTitle>
            <DialogDescription>
              This will immediately stop ALL running and paused agents. This is a global circuit breaker action. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGlobalStopConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleGlobalStop}>
              <StopCircle className="h-4 w-4 mr-1" />
              Stop All Agents
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
