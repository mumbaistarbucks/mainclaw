"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GitBranch, Clock, User, CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, Play, GitCommit, Tag, Search, GitMerge, Network, List, Settings, RotateCcw, Eye, Download, Upload, Copy, Plus, Code, Database, Zap, Shield, Brain, Target, Activity } from 'lucide-react'
import { cn } from "@/lib/utils"

// Enhanced version data with realistic agents from the application
const versionData = {
  main: {
    name: "main",
    color: "bg-blue-500",
    isDefault: true,
    commits: [
      {
        id: "v3.2.1",
        hash: "a7f3d2e",
        name: "Enhanced Multi-Agent Orchestration",
        timestamp: "2025-01-15T10:30:00Z",
        author: "Sarah Chen",
        type: "performance",
        status: "deployed",
        description: "Improved orchestration between Database Agent, Code Generator, and Safety Monitor with better error handling",
        parent: "v3.2.0",
        x: 0,
        y: 0,
        metrics: {
          testsPassed: 127,
          testsFailed: 3,
          regressions: 0,
          improvements: 8,
          avgLatency: 180,
          avgCost: 0.045,
          accuracyScore: 0.94,
          contextRetention: 0.89,
          codeQuality: 0.92,
        },
        changes: {
          contextHandlers: 5,
          memoryOptimizations: 3,
          tokenManagement: 4,
          cacheStrategies: 2,
        },
        tags: ["production", "performance", "multi-agent", "stable"],
        agents: ["database-agent", "code-generation-agent", "safety-agent", "response-agent"],
      },
      {
        id: "v3.2.0",
        hash: "b8e4c1f",
        name: "RAG Observatory Integration",
        timestamp: "2025-01-12T14:15:00Z",
        author: "David Kim",
        type: "feature",
        status: "deployed",
        description: "Integrated RAG Observatory with Enterprise RAG Debugger for better document retrieval and grounding",
        parent: "v3.1.8",
        x: 0,
        y: 1,
        metrics: {
          testsPassed: 119,
          testsFailed: 7,
          regressions: 2,
          improvements: 12,
          avgLatency: 210,
          avgCost: 0.052,
          accuracyScore: 0.91,
          contextRetention: 0.85,
          codeQuality: 0.89,
        },
        changes: {
          contextHandlers: 8,
          memoryOptimizations: 1,
          tokenManagement: 6,
          cacheStrategies: 3,
        },
        tags: ["production", "rag", "retrieval", "beta"],
        agents: ["rag-agent", "document-retrieval-agent", "grounding-agent"],
      },
      {
        id: "v3.1.8",
        hash: "e2b7c5d",
        name: "Container Security Agent Updates",
        timestamp: "2025-01-08T09:45:00Z",
        author: "Alex Johnson",
        type: "enhancement",
        status: "archived",
        description: "Enhanced Container Security Agent with better privilege escalation detection and sandbox isolation",
        parent: "v3.1.7",
        x: 0,
        y: 2,
        metrics: {
          testsPassed: 103,
          testsFailed: 12,
          regressions: 1,
          improvements: 6,
          avgLatency: 165,
          avgCost: 0.038,
          accuracyScore: 0.87,
          contextRetention: 0.83,
          codeQuality: 0.85,
        },
        changes: {
          contextHandlers: 3,
          memoryOptimizations: 2,
          tokenManagement: 1,
          cacheStrategies: 1,
        },
        tags: ["security", "container", "sandbox"],
        agents: ["container-security-agent", "privilege-monitor-agent"],
      },
    ],
  },
  "feature/agent-debugger": {
    name: "feature/agent-debugger",
    color: "bg-green-500",
    isDefault: false,
    branchedFrom: "v3.2.0",
    commits: [
      {
        id: "v3.3.0-beta.2",
        hash: "f9a2b1c",
        name: "Advanced Agent Debugging Suite",
        timestamp: "2025-01-16T16:20:00Z",
        author: "Dr. Lisa Wang",
        type: "feature",
        status: "testing",
        description: "Complete agent debugging suite with trace analysis, performance monitoring, and behavioral testing",
        parent: "v3.3.0-beta.1",
        x: 1,
        y: 0,
        metrics: {
          testsPassed: 89,
          testsFailed: 15,
          regressions: 3,
          improvements: 15,
          avgLatency: 420,
          avgCost: 0.078,
          accuracyScore: 0.88,
          contextRetention: 0.91,
          codeQuality: 0.95,
        },
        changes: {
          contextHandlers: 12,
          memoryOptimizations: 4,
          tokenManagement: 8,
          cacheStrategies: 6,
        },
        tags: ["beta", "debugging", "monitoring", "experimental"],
        agents: ["agent-debugger", "trace-analyzer-agent", "performance-monitor-agent", "behavioral-test-agent"],
      },
      {
        id: "v3.3.0-beta.1",
        hash: "c8d4e2f",
        name: "Multi-Agent Orchestration Debugger",
        timestamp: "2025-01-14T11:30:00Z",
        author: "Dr. Lisa Wang",
        type: "feature",
        status: "testing",
        description: "Foundation for multi-agent orchestration debugging with DAG visualization and timeline analysis",
        parent: "v3.2.0",
        x: 1,
        y: 1,
        metrics: {
          testsPassed: 76,
          testsFailed: 18,
          regressions: 1,
          improvements: 8,
          avgLatency: 380,
          avgCost: 0.065,
          accuracyScore: 0.84,
          contextRetention: 0.88,
          codeQuality: 0.90,
        },
        changes: {
          contextHandlers: 7,
          memoryOptimizations: 2,
          tokenManagement: 5,
          cacheStrategies: 3,
        },
        tags: ["beta", "multi-agent", "orchestration"],
        agents: ["orchestrator-agent", "dag-analyzer-agent", "timeline-agent"],
      },
    ],
  },
  "hotfix/test-suite": {
    name: "hotfix/test-suite",
    color: "bg-amber-500",
    isDefault: false,
    branchedFrom: "v3.2.1",
    commits: [
      {
        id: "v3.2.2-hotfix",
        hash: "g3h5i7j",
        name: "Enterprise Test Suite Critical Fixes",
        timestamp: "2025-01-16T08:15:00Z",
        author: "Maria Garcia",
        type: "hotfix",
        status: "testing",
        description: "Critical fixes for test case execution and regression detection in enterprise test suite",
        parent: "v3.2.1",
        x: -1,
        y: 0,
        metrics: {
          testsPassed: 124,
          testsFailed: 2,
          regressions: 0,
          improvements: 3,
          avgLatency: 175,
          avgCost: 0.043,
          accuracyScore: 0.95,
          contextRetention: 0.92,
          codeQuality: 0.93,
        },
        changes: {
          contextHandlers: 2,
          memoryOptimizations: 6,
          tokenManagement: 1,
          cacheStrategies: 4,
        },
        tags: ["hotfix", "critical", "testing", "enterprise"],
        agents: ["test-execution-agent", "regression-detector-agent", "test-case-agent"],
      },
    ],
  },
  "feature/sandbox-runner": {
    name: "feature/sandbox-runner",
    color: "bg-purple-500",
    isDefault: false,
    branchedFrom: "v3.2.1",
    commits: [
      {
        id: "v3.4.0-alpha.1",
        hash: "h4j6k8l",
        name: "Sandbox Execution Environment",
        timestamp: "2025-01-17T13:45:00Z",
        author: "John Mitchell",
        type: "feature",
        status: "development",
        description: "Isolated sandbox environment for safe agent testing with live execution monitoring",
        parent: "v3.2.1",
        x: 2,
        y: 0,
        metrics: {
          testsPassed: 45,
          testsFailed: 25,
          regressions: 5,
          improvements: 20,
          avgLatency: 520,
          avgCost: 0.095,
          accuracyScore: 0.78,
          contextRetention: 0.85,
          codeQuality: 0.82,
        },
        changes: {
          contextHandlers: 15,
          memoryOptimizations: 8,
          tokenManagement: 12,
          cacheStrategies: 10,
        },
        tags: ["alpha", "sandbox", "isolation", "experimental"],
        agents: ["sandbox-runner-agent", "isolation-agent", "execution-monitor-agent", "safety-validator-agent"],
      },
    ],
  },
}

export function BehavioralVersionControl() {
  const [selectedVersion, setSelectedVersion] = useState(versionData.main.commits[0])
  const [selectedBranch, setSelectedBranch] = useState("main")
  const [viewMode, setViewMode] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredNode, setHoveredNode] = useState(null)

  const currentBranchCommits = versionData[selectedBranch]?.commits || []

  const allCommits = Object.values(versionData).flatMap((branch) =>
    branch.commits.map((commit) => ({
      ...commit,
      branchName: branch.name,
      branchColor: branch.color,
    })),
  )

  const filteredCommits = currentBranchCommits.filter(
    (commit) =>
      commit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "deployed":
        return "bg-green-100 text-green-800 border-green-300"
      case "testing":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "development":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusDotColor = (status) => {
    switch (status) {
      case "deployed":
        return "bg-green-500"
      case "testing":
        return "bg-blue-500"
      case "development":
        return "bg-purple-500"
      case "archived":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "performance":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "feature":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "enhancement":
        return "bg-green-50 text-green-700 border-green-200"
      case "hotfix":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "performance":
        return <Zap className="h-4 w-4 text-blue-600" />
      case "feature":
        return <Plus className="h-4 w-4 text-purple-600" />
      case "enhancement":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "hotfix":
        return <Shield className="h-4 w-4 text-amber-600" />
      default:
        return <Code className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const BranchGraph = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700">main</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700">feature</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium text-amber-700">hotfix</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-purple-700">experimental</span>
            </div>
          </div>

          <div className="relative">
            {allCommits
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((commit, index) => {
                const isSelected = selectedVersion?.id === commit.id
                const isHovered = hoveredNode === commit.id

                return (
                  <div
                    key={commit.id}
                    className={cn(
                      "relative flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-200",
                      isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50",
                      index !== allCommits.length - 1 && "mb-4",
                    )}
                    onClick={() => setSelectedVersion(commit)}
                    onMouseEnter={() => setHoveredNode(commit.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {index !== allCommits.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                    )}

                    <div className="relative flex-shrink-0">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border-2 border-white shadow-sm",
                          getStatusDotColor(commit.status),
                          isSelected && "ring-2 ring-blue-300",
                          isHovered && "scale-125",
                        )}
                      ></div>
                      <div
                        className={cn(
                          "absolute -left-1 -top-1 w-5 h-5 rounded-full opacity-20",
                          commit.branchName === "main" && "bg-blue-500",
                          commit.branchName.includes("feature") && "bg-green-500",
                          commit.branchName.includes("hotfix") && "bg-amber-500",
                          commit.branchName.includes("pair") && "bg-purple-500",
                        )}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(commit.type)}
                        <span className="font-medium text-sm">{commit.id}</span>
                        <Badge variant="outline" className={getStatusColor(commit.status)}>
                          {commit.status}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(commit.type)}>
                          {commit.type.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-700 mb-1 line-clamp-1">{commit.name}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{commit.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(commit.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>{commit.metrics.testsPassed}</span>
                          </div>
                          {commit.metrics.testsFailed > 0 && (
                            <div className="flex items-center space-x-1">
                              <XCircle className="h-3 w-3 text-red-500" />
                              <span>{commit.metrics.testsFailed}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          commit.branchName === "main" && "bg-blue-100 text-blue-700",
                          commit.branchName.includes("feature") && "bg-green-100 text-green-700",
                          commit.branchName.includes("hotfix") && "bg-amber-100 text-amber-700",
                          commit.branchName.includes("pair") && "bg-purple-100 text-purple-700",
                        )}
                      >
                        {commit.branchName.split("/").pop() || commit.branchName}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 leading-none">Code Versions</h3>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm leading-none">
                <Plus className="h-4 w-4 mr-2" />
                New Branch
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border mb-4">
              <div className="flex items-center space-x-3">
                <List className={cn("h-4 w-4", viewMode === "list" ? "text-blue-600" : "text-gray-400")} />
                <span className="text-sm font-medium">List View</span>
              </div>
              <Switch
                checked={viewMode === "graph"}
                onCheckedChange={(checked) => setViewMode(checked ? "graph" : "list")}
                className="data-[state=checked]:bg-blue-600"
              />
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Graph View</span>
                <Network className={cn("h-4 w-4", viewMode === "graph" ? "text-blue-600" : "text-gray-400")} />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(versionData).map(([branchKey, branch]) => (
                      <SelectItem key={branchKey} value={branchKey}>
                        <div className="flex items-center space-x-2">
                          <div className={cn("w-2 h-2 rounded-full", branch.color)} />
                          <span>{branch.name}</span>
                          {branch.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              default
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search versions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            {viewMode === "list" ? (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredCommits.map((commit) => (
                  <div
                    key={commit.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                      selectedVersion?.id === commit.id
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300",
                    )}
                    onClick={() => setSelectedVersion(commit)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(commit.type)}
                        <span className="font-medium text-sm">{commit.id}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(commit.status)}>
                        {commit.status}
                      </Badge>
                    </div>

                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{commit.name}</h4>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{commit.author}</span>
                      </div>
                      <Badge variant="outline" className={getTypeColor(commit.type)}>
                        {commit.type.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>{commit.metrics.testsPassed}</span>
                        </div>
                        {commit.metrics.testsFailed > 0 && (
                          <div className="flex items-center space-x-1">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span>{commit.metrics.testsFailed}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(commit.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-h-[600px] overflow-auto">
                <BranchGraph />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(selectedVersion?.type)}
                  <h2 className="text-xl font-semibold">{selectedVersion?.id}</h2>
                  <Badge variant="outline" className={getStatusColor(selectedVersion?.status)}>
                    {selectedVersion?.status}
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(selectedVersion?.type)}>
                    {selectedVersion?.type?.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="text-lg text-gray-700 mb-2">{selectedVersion?.name}</h3>
                <p className="text-sm text-gray-600">{selectedVersion?.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-200">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Run Tests
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Rollback
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <GitBranch className="h-4 w-4 mr-2" />
                Create Branch
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <GitMerge className="h-4 w-4 mr-2" />
                Merge
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Cherry Pick
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Compare
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{selectedVersion?.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(selectedVersion?.timestamp)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitCommit className="h-4 w-4" />
                  <span className="font-mono">{selectedVersion?.hash}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedVersion?.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Accuracy</span>
              </div>
              <p className="text-2xl font-semibold">
                {Math.round((selectedVersion?.metrics?.accuracyScore || 0) * 100)}%
              </p>
              <div className="flex items-center justify-center mt-1">
                {(selectedVersion?.metrics?.accuracyScore || 0) > 0.9 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (selectedVersion?.metrics?.accuracyScore || 0) < 0.8 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Latency</span>
              </div>
              <p className="text-2xl font-semibold">{selectedVersion?.metrics?.avgLatency}ms</p>
              <div className="flex items-center justify-center mt-1">
                {(selectedVersion?.metrics?.avgLatency || 0) < 200 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (selectedVersion?.metrics?.avgLatency || 0) > 300 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Settings className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600">Cost</span>
              </div>
              <p className="text-2xl font-semibold">${selectedVersion?.metrics?.avgCost}</p>
              <div className="flex items-center justify-center mt-1">
                {(selectedVersion?.metrics?.avgCost || 0) < 0.05 ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (selectedVersion?.metrics?.avgCost || 0) > 0.07 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm text-gray-600">Context Retention</span>
              </div>
              <p className="text-2xl font-semibold">{Math.round((selectedVersion?.metrics?.contextRetention || 0) * 100)}%</p>
              <div className="flex items-center justify-center mt-1">
                {(selectedVersion?.metrics?.contextRetention || 0) > 0.88 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (selectedVersion?.metrics?.contextRetention || 0) < 0.82 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">Changes in this Version</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-center">
                  <p className="text-sm text-purple-600 mb-1">Context Handlers</p>
                  <p className="text-2xl font-semibold text-purple-700">{selectedVersion?.changes?.contextHandlers}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-blue-600 mb-1">Memory Optimizations</p>
                  <p className="text-2xl font-semibold text-blue-700">{selectedVersion?.changes?.memoryOptimizations}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-center">
                  <p className="text-sm text-indigo-600 mb-1">Token Management</p>
                  <p className="text-2xl font-semibold text-indigo-700">{selectedVersion?.changes?.tokenManagement}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-1">Cache Strategies</p>
                  <p className="text-2xl font-semibold text-green-700">{selectedVersion?.changes?.cacheStrategies}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Code Quality Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(selectedVersion?.metrics?.codeQuality || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((selectedVersion?.metrics?.codeQuality || 0) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Context Retention</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(selectedVersion?.metrics?.contextRetention || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((selectedVersion?.metrics?.contextRetention || 0) * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(selectedVersion?.metrics?.accuracyScore || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((selectedVersion?.metrics?.accuracyScore || 0) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">Performance Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Improvements</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+{selectedVersion?.metrics?.improvements}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Regressions</span>
                <div className="flex items-center space-x-2">
                  {(selectedVersion?.metrics?.regressions || 0) > 0 ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600">-{selectedVersion?.metrics?.regressions}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">None</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Test Success Rate</span>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(
                      ((selectedVersion?.metrics?.testsPassed || 0) /
                        ((selectedVersion?.metrics?.testsPassed || 0) + (selectedVersion?.metrics?.testsFailed || 0))) *
                        100,
                    )}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
