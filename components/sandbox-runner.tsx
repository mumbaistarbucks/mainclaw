"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Play, Search, Filter, Clock, DollarSign, Settings, FileText, Database, Code, GitBranch, TestTube, Zap, ChevronRight, BarChart3, Activity, CheckCircle, AlertCircle, XCircle, TrendingUp, Eye, Copy, Download, RotateCcw, Plus, Save, Trash2, Edit, RefreshCw, Terminal, Server, Shield, Bug, FlaskConical, ChevronDown } from 'lucide-react'

// Enhanced sandbox experiments with realistic developer scenarios for Replit/Cursor
const sandboxExperiments = [
  {
    id: "exp-1",
    title: "Customer Support RAG Pipeline - Refund",
    description: "How do I process a refund for a damaged item?",
    timestamp: "2 hours ago",
    cost: "$0.12",
    duration: "1.2s",
    status: "completed",
    tags: ["production", "GPT-4o", "v1.4.2", "baseline", "+1"],
    type: "RAG Pipeline",
    environment: "Production",
    configVersion: "Customer Support v1.4.2",
    query: "How do I process a refund for a damaged item?",
    confidence: 0.92,
    chunksRetrieved: 5,
    toolsCalled: 3,
    criticalIssues: [],
    successRate: 92,
    goalMatch: 0.89,
  },
  {
    id: "exp-2",
    title: "Code Documentation Q&A System",
    description: "How do I implement authentication in the user service?",
    timestamp: "1 day ago",
    cost: "$0.08",
    duration: "timeout",
    status: "failed",
    tags: ["development", "GPT-4o", "v2.1.0", "code-qa", "+1"],
    type: "RAG Pipeline",
    environment: "Development",
    configVersion: "Code Q&A v2.1.0",
    query: "How do I implement authentication in the user service?",
    confidence: 0.0,
    chunksRetrieved: 0,
    toolsCalled: 1,
    criticalIssues: ["Timeout error", "Knowledge base connection failed"],
    successRate: 0,
    goalMatch: 0.0,
  },
  {
    id: "exp-3",
    title: "Financial Data Summarization with Context",
    description: "Summarize Q3 financial performance and key metrics",
    timestamp: "2 days ago",
    cost: "$0.18",
    duration: "3.2s",
    status: "completed",
    tags: ["production", "Claude 3 Sonnet", "financial", "summarization"],
    type: "Agent Workflow",
    environment: "Production",
    configVersion: "Financial Analysis v1.8",
    query: "Summarize Q3 financial performance and key metrics",
    confidence: 0.91,
    chunksRetrieved: 8,
    toolsCalled: 6,
    criticalIssues: [],
    successRate: 91,
    goalMatch: 0.94,
  },
  {
    id: "exp-4",
    title: "React Component Generator",
    description: "Create a responsive navbar component with dark mode toggle",
    timestamp: "3 days ago",
    cost: "$0.15",
    duration: "2.4s",
    status: "completed",
    tags: ["development", "GPT-4o", "react", "component-gen"],
    type: "Code Generation",
    environment: "Development",
    configVersion: "Code Gen v3.0",
    query: "Create a responsive navbar component with dark mode toggle",
    confidence: 0.87,
    chunksRetrieved: 6,
    toolsCalled: 4,
    criticalIssues: [],
    successRate: 87,
    goalMatch: 0.91,
  },
  {
    id: "exp-5",
    title: "API Documentation Assistant",
    description: "Generate OpenAPI spec for user management endpoints",
    timestamp: "4 days ago",
    cost: "$0.22",
    duration: "4.1s",
    status: "completed",
    tags: ["staging", "GPT-4o", "api-docs", "openapi"],
    type: "Documentation",
    environment: "Staging",
    configVersion: "API Docs v2.3",
    query: "Generate OpenAPI spec for user management endpoints",
    confidence: 0.85,
    chunksRetrieved: 9,
    toolsCalled: 5,
    criticalIssues: [],
    successRate: 85,
    goalMatch: 0.88,
  },
]

// Mock execution traces for different experiments
const mockExecutionTraces = {
  "exp-1": {
    id: "trace-exp-1",
    status: "completed",
    progress: 100,
    currentStep: 4,
    totalSteps: 4,
    steps: [
      {
        id: "step-1",
        name: "Query Analysis",
        status: "completed",
        type: "input",
        duration: "0.1s",
        tokens: 28,
        cost: "$0.002",
        expanded: false,
        input: "How do I process a refund for a damaged item?",
        output: "Analyzed request: Customer support refund process inquiry",
        confidence: 0.96,
        details: {
          intent: "refund_process",
          category: "customer_support",
          urgency: "medium",
          complexity: "low",
        },
      },
      {
        id: "step-2",
        name: "Knowledge Retrieval",
        status: "completed",
        type: "retrieval",
        duration: "0.8s",
        tokens: 142,
        cost: "$0.011",
        expanded: true,
        input: "refund process damaged item customer support",
        output: "Retrieved 5 relevant support articles and policies",
        confidence: 0.94,
        chunks: [
          {
            id: "chunk-1",
            content: "Refund Policy: Items damaged during shipping are eligible for full refund within 30 days...",
            score: 0.96,
            source: "support/refund-policy.md",
            editable: true,
          },
          {
            id: "chunk-2",
            content: "Processing Steps: 1. Verify damage with photos 2. Check order history 3. Issue refund...",
            score: 0.92,
            source: "support/refund-process.md",
            editable: true,
          },
          {
            id: "chunk-3",
            content: "Customer Communication: Always acknowledge the issue and provide clear next steps...",
            score: 0.89,
            source: "support/communication-guidelines.md",
            editable: true,
          },
        ],
        details: {
          chunks_found: 5,
          avg_relevance: 0.92,
          search_time: "0.6s",
          sources: ["support-docs", "policies", "procedures"],
        },
      },
      {
        id: "step-3",
        name: "Response Generation",
        status: "completed",
        type: "generation",
        duration: "0.2s",
        tokens: 89,
        cost: "$0.007",
        expanded: false,
        input: "Generate helpful refund process response",
        output: "Generated comprehensive refund process steps with empathetic tone",
        confidence: 0.91,
        details: {
          tone: "empathetic",
          completeness: "comprehensive",
          actionable_steps: 4,
        },
      },
      {
        id: "step-4",
        name: "Quality Check",
        status: "completed",
        type: "validation",
        duration: "0.1s",
        tokens: 15,
        cost: "$0.001",
        expanded: false,
        input: "Validate response accuracy and helpfulness",
        output: "Response meets quality standards - accurate and actionable",
        confidence: 0.89,
        details: {
          accuracy_score: 0.94,
          helpfulness_score: 0.91,
          policy_compliance: true,
        },
      },
    ],
    streaming: {
      enabled: false,
      currentTokens: 274,
      totalTokens: 274,
    },
  },
  "exp-4": {
    id: "trace-exp-4",
    status: "completed",
    progress: 100,
    currentStep: 5,
    totalSteps: 5,
    steps: [
      {
        id: "step-1",
        name: "Query Analysis",
        status: "completed",
        type: "input",
        duration: "0.2s",
        tokens: 32,
        cost: "$0.003",
        expanded: false,
        input: "Create a responsive navbar component with dark mode toggle",
        output: "Analyzed request: React component creation with responsive design and theme switching",
        confidence: 0.94,
        details: {
          intent: "component_generation",
          framework: "react",
          features: ["responsive", "dark_mode", "navigation"],
          complexity: "medium",
        },
      },
      {
        id: "step-2",
        name: "Knowledge Retrieval",
        status: "completed",
        type: "retrieval",
        duration: "1.1s",
        tokens: 156,
        cost: "$0.012",
        expanded: true,
        input: "React navbar responsive dark mode best practices",
        output: "Retrieved 6 relevant code examples and patterns",
        confidence: 0.89,
        chunks: [
          {
            id: "chunk-1",
            content: "Modern React navbar implementation using Tailwind CSS with responsive breakpoints...",
            score: 0.92,
            source: "react-patterns/navbar.md",
            editable: true,
          },
          {
            id: "chunk-2",
            content: "Dark mode implementation using CSS custom properties and React context...",
            score: 0.87,
            source: "ui-patterns/dark-mode.md",
            editable: true,
          },
          {
            id: "chunk-3",
            content: "Mobile-first responsive navigation with hamburger menu and smooth transitions...",
            score: 0.84,
            source: "components/navigation.tsx",
            editable: true,
          },
        ],
        details: {
          chunks_found: 6,
          avg_relevance: 0.87,
          search_time: "0.8s",
          sources: ["react-patterns", "ui-components", "design-system"],
        },
      },
      {
        id: "step-3",
        name: "Code Generation",
        status: "completed",
        type: "generation",
        duration: "1.8s",
        tokens: 234,
        cost: "$0.019",
        expanded: true,
        input: "Generate React navbar component with retrieved patterns",
        output: "Generated TypeScript React component with Tailwind CSS styling and accessibility features",
        confidence: 0.91,
        tools: [
          {
            name: "code_generator",
            status: "completed",
            input: { 
              language: "typescript",
              framework: "react",
              styling: "tailwind",
              features: ["responsive", "dark_mode", "accessibility"]
            },
            output: { 
              component_generated: true,
              lines_of_code: 87,
              accessibility_score: 0.94,
              responsive_breakpoints: 3
            },
            duration: "1.6s",
          },
        ],
        details: {
          language: "typescript",
          framework: "react",
          styling: "tailwind",
          features_implemented: ["responsive", "dark_mode", "accessibility"],
        },
      },
      {
        id: "step-4",
        name: "Code Validation",
        status: "completed",
        type: "validation",
        duration: "0.2s",
        tokens: 45,
        cost: "$0.004",
        expanded: false,
        input: "Validate generated component for best practices",
        output: "Component passes all validation checks - follows React best practices",
        confidence: 0.88,
        details: {
          syntax_valid: true,
          best_practices: true,
          accessibility_compliant: true,
          performance_optimized: true,
        },
      },
      {
        id: "step-5",
        name: "Response Formatting",
        status: "completed",
        type: "response",
        duration: "0.1s",
        tokens: 23,
        cost: "$0.002",
        expanded: false,
        input: "Format final response with code and documentation",
        output: "Formatted response with component code, usage examples, and documentation",
        confidence: 0.93,
        details: {
          includes_code: true,
          includes_examples: true,
          includes_documentation: true,
        },
      },
    ],
    streaming: {
      enabled: true,
      currentTokens: 490,
      totalTokens: 490,
    },
  },
  "exp-2": {
    id: "trace-exp-2",
    status: "failed",
    progress: 100,
    currentStep: 2,
    totalSteps: 4,
    steps: [
      {
        id: "step-1",
        name: "Query Analysis",
        status: "completed",
        type: "input",
        duration: "0.1s",
        tokens: 35,
        cost: "$0.003",
        expanded: false,
        input: "How do I implement authentication in the user service?",
        output: "Analyzed request: Authentication implementation guidance for user service",
        confidence: 0.91,
        details: {
          intent: "implementation_guidance",
          domain: "authentication",
          service: "user_service",
          complexity: "high",
        },
      },
      {
        id: "step-2",
        name: "Knowledge Retrieval",
        status: "failed",
        type: "retrieval",
        duration: "timeout",
        tokens: 0,
        cost: "$0.000",
        expanded: true,
        input: "user service authentication implementation patterns",
        output: "FAILED: Knowledge base connection timeout after 30 seconds",
        confidence: 0.0,
        error: "Connection timeout - knowledge base unreachable",
        chunks: [],
        details: {
          timeout_duration: "30s",
          retry_attempts: 3,
          last_error: "Connection refused",
          knowledge_base_status: "unreachable",
        },
      },
      {
        id: "step-3",
        name: "Fallback Response",
        status: "failed",
        type: "generation",
        duration: "-",
        tokens: 0,
        cost: "$0.000",
        expanded: false,
        input: "Generate fallback response without knowledge base",
        output: "Skipped - insufficient context without knowledge retrieval",
        confidence: 0.0,
        error: "Cannot generate reliable response without knowledge base access",
      },
      {
        id: "step-4",
        name: "Error Handling",
        status: "failed",
        type: "response",
        duration: "-",
        tokens: 0,
        cost: "$0.000",
        expanded: false,
        input: "Handle system error gracefully",
        output: "System error - unable to process request",
        confidence: 0.0,
        error: "Critical system failure - knowledge base unavailable",
      },
    ],
    streaming: {
      enabled: false,
      currentTokens: 35,
      totalTokens: 35,
    },
  },
}

// Performance analytics data
const performanceData = {
  responseTime: [
    { name: "Jan", value: 1.2 },
    { name: "Feb", value: 1.1 },
    { name: "Mar", value: 1.3 },
    { name: "Apr", value: 1.0 },
    { name: "May", value: 0.9 },
    { name: "Jun", value: 1.1 },
  ],
  accuracy: [
    { name: "Jan", value: 87 },
    { name: "Feb", value: 89 },
    { name: "Mar", value: 91 },
    { name: "Apr", value: 88 },
    { name: "May", value: 93 },
    { name: "Jun", value: 92 },
  ],
  cost: [
    { name: "Jan", value: 0.15 },
    { name: "Feb", value: 0.12 },
    { name: "Mar", value: 0.18 },
    { name: "Apr", value: 0.11 },
    { name: "May", value: 0.09 },
    { name: "Jun", value: 0.13 },
  ],
}

export function SandboxRunner() {
  const [selectedExperiment, setSelectedExperiment] = useState(sandboxExperiments[0])
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("configuration")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [environmentFilter, setEnvironmentFilter] = useState("all")
  const [executionTrace, setExecutionTrace] = useState(null)
  const [showNewRunDialog, setShowNewRunDialog] = useState(false)
  const [newRunQuery, setNewRunQuery] = useState("")
  const [newRunConfig, setNewRunConfig] = useState("")
  const [newRunEnvironment, setNewRunEnvironment] = useState("Development")
  const [newRunType, setNewRunType] = useState("RAG Pipeline")
  const [comparisonConfigA, setComparisonConfigA] = useState("Customer Support v1.4.2")
  const [comparisonConfigB, setComparisonConfigB] = useState("Customer Support v1.5.0")

  // Filter experiments based on search and filters
  const filteredExperiments = sandboxExperiments.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === "all" || exp.type === typeFilter
    const matchesStatus = statusFilter === "all" || exp.status === statusFilter
    const matchesEnvironment = environmentFilter === "all" || exp.environment === environmentFilter
    return matchesSearch && matchesType && matchesStatus && matchesEnvironment
  })

  const handleRunExperiment = useCallback(() => {
    setIsRunning(true)
    setActiveTab("execution")
    
    // Get the appropriate trace for the selected experiment
    const trace = mockExecutionTraces[selectedExperiment.id] || mockExecutionTraces["exp-1"]
    setExecutionTrace({...trace, id: `trace-${selectedExperiment.id}`})
    
    // Simulate execution progress
    let step = 0
    const totalSteps = trace.totalSteps
    const interval = setInterval(() => {
      step++
      if (step <= totalSteps) {
        setExecutionTrace(prev => ({
          ...prev,
          currentStep: step,
          progress: (step / totalSteps) * 100,
          steps: prev.steps.map((s, idx) => ({
            ...s,
            status: idx < step ? "completed" : idx === step ? "running" : "pending"
          }))
        }))
      }
      
      if (step >= totalSteps) {
        clearInterval(interval)
        setIsRunning(false)
        setExecutionTrace(prev => ({
          ...prev,
          status: trace.status,
          progress: 100,
          steps: trace.steps // Use original statuses from trace
        }))
      }
    }, 800)
  }, [selectedExperiment])

  const handleNewSandboxRun = useCallback(() => {
    if (!newRunQuery.trim()) return
    
    const newExperiment = {
      id: `exp-${Date.now()}`,
      title: `${newRunQuery.substring(0, 50)}${newRunQuery.length > 50 ? '...' : ''}`,
      description: newRunQuery,
      timestamp: "Just now",
      cost: "$0.000",
      duration: "0.0s",
      status: "running",
      tags: ["live-test", newRunEnvironment.toLowerCase()],
      type: newRunType,
      environment: newRunEnvironment,
      configVersion: newRunConfig || `${newRunType} v1.0`,
      query: newRunQuery,
      confidence: 0.0,
      chunksRetrieved: 0,
      toolsCalled: 0,
      criticalIssues: [],
      successRate: 0,
      goalMatch: 0.0,
    }

    // Add to experiments list and select it
    sandboxExperiments.unshift(newExperiment)
    setSelectedExperiment(newExperiment)
    setShowNewRunDialog(false)
    setNewRunQuery("")
    setNewRunConfig("")
    
    // Start execution
    setTimeout(() => {
      handleRunExperiment()
    }, 100)
  }, [newRunQuery, newRunConfig, newRunEnvironment, newRunType, handleRunExperiment])

  const handleReplayExperiment = useCallback((experiment) => {
    setSelectedExperiment(experiment)
    setActiveTab("configuration")
    setTimeout(() => {
      handleRunExperiment()
    }, 100)
  }, [handleRunExperiment])

  const handleForkExperiment = useCallback((experiment) => {
    const forked = {
      ...experiment,
      id: `exp-${Date.now()}`,
      title: `${experiment.title} (Fork)`,
      timestamp: "Just now",
      tags: [...experiment.tags.filter(t => !t.includes("+")), "fork"],
      status: "ready",
    }
    sandboxExperiments.unshift(forked)
    setSelectedExperiment(forked)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RAG Pipeline":
        return <Database className="h-4 w-4 text-purple-600" />
      case "Agent Workflow":
        return <GitBranch className="h-4 w-4 text-blue-600" />
      case "Multi-Agent":
        return <Zap className="h-4 w-4 text-amber-600" />
      case "Code Generation":
        return <Code className="h-4 w-4 text-green-600" />
      case "Documentation":
        return <FileText className="h-4 w-4 text-indigo-600" />
      default:
        return <FlaskConical className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "failed":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case "running":
        return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <FlaskConical className="h-5 w-5 text-blue-600" />
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Live Sandbox</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Interactive REPL
              </Badge>
            </div>
          </div>

          <Dialog open={showNewRunDialog} onOpenChange={setShowNewRunDialog}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Experiment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Experiment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Input Query</label>
                  <Textarea
                    placeholder="Enter your test query for knowledge retrieval..."
                    value={newRunQuery}
                    onChange={(e) => setNewRunQuery(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{newRunQuery.length} characters</span>
                    <span>Estimated tokens: ~{Math.ceil(newRunQuery.length / 4)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Type</label>
                    <Select value={newRunType} onValueChange={setNewRunType}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RAG Pipeline">RAG Pipeline</SelectItem>
                        <SelectItem value="Agent Workflow">Agent Workflow</SelectItem>
                        <SelectItem value="Multi-Agent">Multi-Agent</SelectItem>
                        <SelectItem value="Code Generation">Code Generation</SelectItem>
                        <SelectItem value="Documentation">Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                    <Select value={newRunEnvironment} onValueChange={setNewRunEnvironment}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Staging">Staging</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Version</label>
                  <Select value={newRunConfig} onValueChange={setNewRunConfig}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select configuration..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer Support v1.4.2">Customer Support v1.4.2</SelectItem>
                      <SelectItem value="Code Q&A v2.1.0">Code Q&A v2.1.0</SelectItem>
                      <SelectItem value="Financial Analysis v1.8">Financial Analysis v1.8</SelectItem>
                      <SelectItem value="Code Gen v3.0">Code Gen v3.0</SelectItem>
                      <SelectItem value="API Docs v2.3">API Docs v2.3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewRunDialog(false)} className="text-sm">
                  Cancel
                </Button>
                <Button 
                  onClick={handleNewSandboxRun}
                  disabled={!newRunQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Live Experiment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search experiments, queries, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm h-9"
            />
          </div>

          <div className="space-y-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="text-sm h-8">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="RAG Pipeline">RAG Pipeline</SelectItem>
                <SelectItem value="Agent Workflow">Agent Workflow</SelectItem>
                <SelectItem value="Multi-Agent">Multi-Agent</SelectItem>
                <SelectItem value="Code Generation">Code Generation</SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-sm h-8">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>

            <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
              <SelectTrigger className="text-sm h-8">
                <SelectValue placeholder="All Environments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Staging">Staging</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Experiments List */}
        <div className="flex-1 overflow-y-auto">
          {filteredExperiments.map((experiment) => (
            <div
              key={experiment.id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedExperiment.id === experiment.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
              }`}
              onClick={() => setSelectedExperiment(experiment)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {getTypeIcon(experiment.type)}
                  <h3 className="font-medium text-sm text-gray-900 truncate">{experiment.title}</h3>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {getStatusBadge(experiment.status)}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{experiment.timestamp}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{experiment.cost}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Activity className="h-3 w-3" />
                    <span>{experiment.duration}</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-2 line-clamp-1">{experiment.description}</p>

              {experiment.status === "completed" && (
                <div className="flex items-center space-x-3 text-xs mb-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                    <span className="text-green-700 font-medium">{experiment.successRate}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Database className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{experiment.chunksRetrieved}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Terminal className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{experiment.toolsCalled}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-2">
                {experiment.tags.slice(0, 4).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`text-xs px-1.5 py-0 h-4 ${
                      tag === "production" ? "bg-red-50 text-red-700 border-red-200" :
                      tag === "staging" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      tag === "development" ? "bg-green-50 text-green-700 border-green-200" :
                      tag.includes("GPT") || tag.includes("Claude") ? "bg-purple-50 text-purple-700 border-purple-200" :
                      tag.startsWith("v") ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
                {experiment.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-gray-50 text-gray-600 border-gray-200">
                    +{experiment.tags.length - 4}
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReplayExperiment(experiment)
                    }}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Replay
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleForkExperiment(experiment)
                    }}
                  >
                    <GitBranch className="h-3 w-3 mr-1" />
                    Fork
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedExperiment.title}
            </h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon(selectedExperiment.status)}
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  selectedExperiment.status === "failed"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : selectedExperiment.status === "completed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : selectedExperiment.status === "running"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {selectedExperiment.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{selectedExperiment.timestamp}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>{selectedExperiment.cost}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4" />
              <span>{selectedExperiment.duration}</span>
            </div>
            {selectedExperiment.criticalIssues && selectedExperiment.criticalIssues.length > 0 && (
              <div className="flex items-center space-x-1 text-red-600">
                <Bug className="h-4 w-4" />
                <span>{selectedExperiment.criticalIssues.length} issues</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200">
            <TabsList className="w-full grid grid-cols-4 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="configuration" 
                className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none border-b-2 border-transparent text-sm py-3"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </TabsTrigger>
              <TabsTrigger 
                value="execution"
                className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none border-b-2 border-transparent text-sm py-3"
              >
                <Play className="h-4 w-4 mr-2" />
                Live Execution
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none border-b-2 border-transparent text-sm py-3"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="comparison"
                className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none border-b-2 border-transparent text-sm py-3"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                A/B Comparison
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 bg-gray-50">
            <TabsContent value="configuration" className="h-full p-6 m-0">
              <div className="grid grid-cols-3 gap-6 h-full">
                <div className="col-span-2">
                  <Card className="h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <CardTitle className="text-lg">System Configuration</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">System Type</label>
                          <Select value={selectedExperiment.type}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="RAG Pipeline">RAG Pipeline</SelectItem>
                              <SelectItem value="Agent Workflow">Agent Workflow</SelectItem>
                              <SelectItem value="Multi-Agent">Multi-Agent</SelectItem>
                              <SelectItem value="Code Generation">Code Generation</SelectItem>
                              <SelectItem value="Documentation">Documentation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                          <Select value={selectedExperiment.environment}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Development">Development</SelectItem>
                              <SelectItem value="Staging">Staging</SelectItem>
                              <SelectItem value="Production">Production</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language Model</label>
                          <Select defaultValue="GPT-4o">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                              <SelectItem value="Claude 3 Opus">Claude 3 Opus</SelectItem>
                              <SelectItem value="Claude 3 Sonnet">Claude 3 Sonnet</SelectItem>
                              <SelectItem value="GPT-4">GPT-4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Retrieval Strategy</label>
                          <Select defaultValue="Hybrid Search">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hybrid Search">Hybrid Search</SelectItem>
                              <SelectItem value="Semantic Search">Semantic Search</SelectItem>
                              <SelectItem value="Keyword Search">Keyword Search</SelectItem>
                              <SelectItem value="Vector Search">Vector Search</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Version</label>
                        <Select value={selectedExperiment.configVersion}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Customer Support v1.4.2">Customer Support v1.4.2</SelectItem>
                            <SelectItem value="Code Q&A v2.1.0">Code Q&A v2.1.0</SelectItem>
                            <SelectItem value="Financial Analysis v1.8">Financial Analysis v1.8</SelectItem>
                            <SelectItem value="Code Gen v3.0">Code Gen v3.0</SelectItem>
                            <SelectItem value="API Docs v2.3">API Docs v2.3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Test Input Query</label>
                          <Badge variant="outline" className="text-xs">
                            A/B Comparison Mode
                          </Badge>
                        </div>
                        <Textarea
                          value={selectedExperiment.query}
                          onChange={() => {}}
                          className="min-h-[100px] text-sm"
                          placeholder="Enter your test query for knowledge retrieval..."
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{selectedExperiment.query.length} characters</span>
                          <span>Estimated tokens: ~{Math.ceil(selectedExperiment.query.length / 4)}</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={handleRunExperiment}
                          disabled={isRunning}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                        >
                          {isRunning ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-spin" />
                              Running Live Experiment...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Run Live Experiment
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">Advanced Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Enable streaming</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Cache responses</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Debug mode</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">Quick Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        <FileText className="h-3 w-3 mr-2" />
                        Enterprise Upgrade Query
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        <Code className="h-3 w-3 mr-2" />
                        Code Documentation Q&A
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                        <DollarSign className="h-3 w-3 mr-2" />
                        Financial Summarization
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="execution" className="h-full p-6 m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Live Execution Trace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!executionTrace ? (
                    <div className="h-[500px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Execution Data</h3>
                        <p>Run an experiment to see the live execution trace</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Progress Header */}
                      <div className={`flex items-center justify-between p-4 rounded-lg border ${
                        executionTrace.status === "failed" 
                          ? "bg-red-50 border-red-200"
                          : executionTrace.status === "completed"
                            ? "bg-green-50 border-green-200"
                            : "bg-blue-50 border-blue-200"
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            executionTrace.status === "failed"
                              ? "bg-red-100"
                              : executionTrace.status === "completed"
                                ? "bg-green-100"
                                : "bg-blue-100"
                          }`}>
                            {executionTrace.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : executionTrace.status === "failed" ? (
                              <XCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Activity className="h-5 w-5 text-blue-600 animate-spin" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-semibold ${
                              executionTrace.status === "failed"
                                ? "text-red-900"
                                : executionTrace.status === "completed"
                                  ? "text-green-900"
                                  : "text-blue-900"
                            }`}>
                              {executionTrace.status === "completed" ? "Execution Completed" : 
                               executionTrace.status === "failed" ? "Execution Failed" : "Execution Running"}
                            </h3>
                            <p className={`text-sm ${
                              executionTrace.status === "failed"
                                ? "text-red-700"
                                : executionTrace.status === "completed"
                                  ? "text-green-700"
                                  : "text-blue-700"
                            }`}>
                              {executionTrace.status === "completed" 
                                ? "All steps completed successfully"
                                : executionTrace.status === "failed"
                                  ? "Execution failed with errors"
                                  : `Processing step ${executionTrace.currentStep} of ${executionTrace.totalSteps}`
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            executionTrace.status === "failed"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : executionTrace.status === "completed"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                          }>
                            {executionTrace.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : executionTrace.status === "failed" ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Activity className="h-3 w-3 mr-1 animate-spin" />
                            )}
                            {executionTrace.status}
                          </Badge>
                          <Badge variant="outline" className="text-gray-600">
                            {executionTrace.progress}%
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Progress value={executionTrace.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Step {executionTrace.currentStep} of {executionTrace.totalSteps}</span>
                          <span>{executionTrace.progress}% complete</span>
                        </div>
                      </div>

                      {/* Execution Steps */}
                      <div className="space-y-4">
                        {executionTrace.steps.map((step, index) => (
                          <Card key={step.id} className={`${
                            step.status === "completed" ? "border-green-200 bg-green-50" :
                            step.status === "running" ? "border-blue-200 bg-blue-50" :
                            step.status === "failed" ? "border-red-200 bg-red-50" :
                            "border-gray-200"
                          }`}>
                            <CardHeader
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => {
                                const newTrace = { ...executionTrace }
                                newTrace.steps[index].expanded = !step.expanded
                                setExecutionTrace(newTrace)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-2">
                                    {step.expanded ? (
                                      <ChevronDown className="h-4 w-4 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-gray-400" />
                                    )}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                      step.status === "completed" 
                                        ? "bg-green-100 text-green-700 border-2 border-green-200"
                                        : step.status === "running"
                                          ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                                          : step.status === "failed"
                                            ? "bg-red-100 text-red-700 border-2 border-red-200"
                                            : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                                    }`}>
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{step.name}</h4>
                                    <p className="text-sm text-gray-500 capitalize">{step.type}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {step.status === "completed" ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : step.status === "running" ? (
                                    <Activity className="h-4 w-4 text-blue-500 animate-spin" />
                                  ) : step.status === "failed" ? (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-gray-400" />
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {step.duration}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {step.cost}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>

                            {step.expanded && (
                              <CardContent className="pt-0">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Input</label>
                                      <div className="bg-gray-50 p-3 rounded border text-sm mt-1">{step.input}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Output</label>
                                      <div className={`p-3 rounded border text-sm mt-1 ${
                                        step.status === "failed" ? "bg-red-50 border-red-200" : "bg-gray-50"
                                      }`}>
                                        {step.output}
                                      </div>
                                    </div>
                                  </div>

                                  {step.error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                      <div className="flex items-center text-red-800 mb-1">
                                        <Bug className="h-4 w-4 mr-2" />
                                        <span className="font-medium">Error</span>
                                      </div>
                                      <p className="text-sm text-red-700">{step.error}</p>
                                    </div>
                                  )}

                                  {step.confidence > 0 && (
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confidence Score</label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Progress value={step.confidence * 100} className="flex-1 h-2" />
                                        <span className="text-sm font-medium">{(step.confidence * 100).toFixed(1)}%</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Knowledge Chunks */}
                                  {step.chunks && step.chunks.length > 0 && (
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Retrieved Knowledge</label>
                                      <div className="space-y-2 mt-2">
                                        {step.chunks.map((chunk) => (
                                          <div key={chunk.id} className="border rounded-lg p-3 bg-white">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                  Score: {chunk.score.toFixed(2)}
                                                </Badge>
                                                <span className="text-xs text-gray-500">{chunk.source}</span>
                                              </div>
                                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                <Edit className="h-3 w-3 mr-1" />
                                                Edit
                                              </Button>
                                            </div>
                                            <p className="text-sm text-gray-700">{chunk.content}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Tool Executions */}
                                  {step.tools && (
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tool Executions</label>
                                      <div className="space-y-2 mt-2">
                                        {step.tools.map((tool, idx) => (
                                          <div key={idx} className="border rounded-lg p-3 bg-white">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center space-x-2">
                                                <Terminal className="h-4 w-4 text-gray-600" />
                                                <span className="font-medium text-sm">{tool.name}</span>
                                                <Badge className={`text-xs ${
                                                  tool.status === "failed" 
                                                    ? "bg-red-100 text-red-700 border-red-200"
                                                    : "bg-green-100 text-green-700 border-green-200"
                                                }`}>
                                                  {tool.status}
                                                </Badge>
                                              </div>
                                              <span className="text-xs text-gray-500">{tool.duration}</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                              <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Input</label>
                                                <pre className="bg-gray-50 p-2 rounded mt-1 text-xs overflow-auto">
                                                  {JSON.stringify(tool.input, null, 2)}
                                                </pre>
                                              </div>
                                              <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Output</label>
                                                <pre className={`p-2 rounded mt-1 text-xs overflow-auto ${
                                                  tool.status === "failed" ? "bg-red-50" : "bg-gray-50"
                                                }`}>
                                                  {typeof tool.output === "string"
                                                    ? tool.output
                                                    : JSON.stringify(tool.output, null, 2)}
                                                </pre>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Technical Details */}
                                  {step.details && (
                                    <div>
                                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Technical Details</label>
                                      <div className="bg-gray-50 p-3 rounded border mt-1">
                                        <div className="space-y-1 text-xs">
                                          {Object.entries(step.details).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                              <span className="text-gray-600 capitalize">{key.replace(/_/g, " ")}:</span>
                                              <span className="font-mono text-gray-800">
                                                {Array.isArray(value) ? value.join(", ") : String(value)}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="h-full p-6 m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedExperiment.duration}</div>
                        <div className="text-sm text-blue-800">Response Time</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{(selectedExperiment.confidence * 100).toFixed(0)}%</div>
                        <div className="text-sm text-green-800">Confidence</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Response Time Trend</h4>
                        <div className="space-y-2">
                          {performanceData.responseTime.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">{item.name}</span>
                              <div className="flex items-center space-x-2 flex-1 mx-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(item.value / 2) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium w-8">{item.value}s</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Accuracy Trend</h4>
                        <div className="space-y-2">
                          {performanceData.accuracy.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">{item.name}</span>
                              <div className="flex items-center space-x-2 flex-1 mx-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${item.value}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium w-8">{item.value}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">Chunks Retrieved</span>
                        </div>
                        <Badge variant="outline">{selectedExperiment.chunksRetrieved}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">Tools Called</span>
                        </div>
                        <Badge variant="outline">{selectedExperiment.toolsCalled}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">Total Cost</span>
                        </div>
                        <Badge variant="outline">{selectedExperiment.cost}</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Cost Trend</h4>
                      <div className="space-y-2">
                        {performanceData.cost.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{item.name}</span>
                            <div className="flex items-center space-x-2 flex-1 mx-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full" 
                                  style={{ width: `${(item.value / 0.2) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium w-12">${item.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Baseline Comparison</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>vs. Previous Version</span>
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+12% faster</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>vs. Average</span>
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+8% better</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>vs. Best Run</span>
                          <div className="flex items-center text-red-600">
                            <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                            <span>-3% slower</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="h-full p-6 m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration A</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Version</label>
                      <Select value={comparisonConfigA} onValueChange={setComparisonConfigA}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Customer Support v1.4.2">Customer Support v1.4.2</SelectItem>
                          <SelectItem value="Customer Support v1.5.0">Customer Support v1.5.0</SelectItem>
                          <SelectItem value="Code Q&A v2.1.0">Code Q&A v2.1.0</SelectItem>
                          <SelectItem value="Financial Analysis v1.8">Financial Analysis v1.8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Response Time</span>
                        <Badge className="bg-blue-100 text-blue-700">1.2s</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Accuracy</span>
                        <Badge className="bg-green-100 text-green-700">92%</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium">Cost</span>
                        <Badge className="bg-purple-100 text-purple-700">$0.12</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">Confidence</span>
                        <Badge className="bg-orange-100 text-orange-700">89%</Badge>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Output</h4>
                      <div className="bg-gray-50 p-3 rounded border text-sm">
                        "To process a refund for a damaged item, please follow these steps: 1) Take photos of the damage, 2) Contact customer support with your order number, 3) We'll process your refund within 3-5 business days."
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuration B</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Version</label>
                      <Select value={comparisonConfigB} onValueChange={setComparisonConfigB}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Customer Support v1.4.2">Customer Support v1.4.2</SelectItem>
                          <SelectItem value="Customer Support v1.5.0">Customer Support v1.5.0</SelectItem>
                          <SelectItem value="Code Q&A v2.1.0">Code Q&A v2.1.0</SelectItem>
                          <SelectItem value="Financial Analysis v1.8">Financial Analysis v1.8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Response Time</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-700">0.9s</Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">+25% faster</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Accuracy</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-700">94%</Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">+2% better</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium">Cost</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-purple-100 text-purple-700">$0.08</Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">33% cheaper</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">Confidence</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-100 text-orange-700">91%</Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">+2% better</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Output</h4>
                      <div className="bg-gray-50 p-3 rounded border text-sm">
                        "I understand you received a damaged item - I'm sorry about that! Here's how we can help: 1) Please upload photos of the damage, 2) I'll immediately process your full refund, 3) You'll see the credit in 1-2 business days. Is there anything else I can help with?"
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comparison Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-600">Configuration B Wins</div>
                        <div className="text-sm text-green-800">Better performance across all metrics</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-600">25% Faster</div>
                        <div className="text-sm text-blue-800">Response time improvement</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-lg font-bold text-purple-600">33% Cheaper</div>
                        <div className="text-sm text-purple-800">Cost reduction</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                      <p className="text-sm text-gray-700">
                        Configuration B (Customer Support v1.5.0) shows significant improvements in response time and cost efficiency while maintaining higher accuracy. 
                        The more conversational and empathetic tone also provides better user experience. Consider deploying this configuration to production.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
