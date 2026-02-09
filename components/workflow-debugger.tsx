"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowRight, Building, Check, Clock, Code, Database, Edit, Eye, FileText, Filter, Info, Link, MessageSquare, Plus, RefreshCw, Save, Search, Settings, Share, Sparkles, ThumbsDown, ThumbsUp, Trash, Users, Workflow, X, Play } from 'lucide-react'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types for our data model
type TraceStatus = "passing" | "failing" | "fixed" | "unreviewed"
type ChunkStatus = "relevant" | "irrelevant" | "hallucination" | "edited"
type FailureType = "Hallucination" | "Bad Chunk" | "Empty Retrieval" | "Context Overflow" | "Source Mismatch"
type Severity = "High" | "Medium" | "Low"
type UseCase = "Support" | "Legal QA" | "Internal Docs" | "Customer Onboarding" | "Compliance" | "Sales"

interface Chunk {
  id: string
  content: string
  source: string
  relevance: number
  confidence?: number
  status: ChunkStatus
  excluded: boolean
  tags: string[]
}

interface Trace {
  id: string
  userInput: string
  timestamp: string
  status: TraceStatus
  system: string
  useCase: UseCase
  failureType: FailureType
  severity: Severity
  chunks: Chunk[]
  response: string
  editedResponse?: string
  model: string
  user: string
  project: string
  confidence?: number
  grounding?: number
  metrics: {
    retrievalTime: number
    generationTime: number
    totalTokens: number
    cost: number
    accuracy?: number
  }
}

export function WorkflowDebugger() {
  // Update the initial state to show as connected
  const [isConnected, setIsConnected] = useState(true)
  const [connectionDetails, setConnectionDetails] = useState({
    apiKey: "sk-retriever-***********************",
    endpoint: "https://api.retriever-sdk.com",
    project: "enterprise-rag-system",
  })
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)

  // State for traces
  const [traces, setTraces] = useState<Trace[]>(ragTraces)
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>("trace-001")
  const [isLoadingTraces, setIsLoadingTraces] = useState(false)
  const [traceFilter, setTraceFilter] = useState("all")
  const [systemFilter, setSystemFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // State for editing
  const [editingChunkId, setEditingChunkId] = useState<string | null>(null)
  const [editedChunkContent, setEditedChunkContent] = useState("")
  const [isEditingResponse, setIsEditingResponse] = useState(false)
  const [editedResponse, setEditedResponse] = useState("")

  // State for replay
  const [isReplaying, setIsReplaying] = useState(false)
  const [replayResult, setReplayResult] = useState<{
    response: string
    metrics: {
      retrievalTime: number
      generationTime: number
      totalTokens: number
      cost: number
      accuracy: number
    }
    improved: boolean
  } | null>(null)

  // State for saving
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveDetails, setSaveDetails] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    saveAsTestCase: true,
    createNewVersion: false,
    versionName: "",
    notifyTeam: true,
  })

  // Connect to Retriever SDK
  const handleConnect = () => {
    setIsLoadingTraces(true)
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true)
      setShowConnectionDialog(false)
      // Load sample traces
      setTraces(ragTraces)
      setIsLoadingTraces(false)
    }, 1500)
  }

  // Disconnect from Retriever SDK
  const handleDisconnect = () => {
    setIsConnected(false)
    setTraces([])
    setSelectedTraceId(null)
  }

  // Get the selected trace
  const selectedTrace = selectedTraceId ? traces.find((t) => t.id === selectedTraceId) : null

  // Filter traces based on status, system, severity and search query
  const filteredTraces = traces.filter((trace) => {
    const matchesStatusFilter =
      traceFilter === "all" ||
      (traceFilter === "failing" && trace.status === "failing") ||
      (traceFilter === "fixed" && trace.status === "fixed") ||
      (traceFilter === "passing" && trace.status === "passing") ||
      (traceFilter === "unreviewed" && trace.status === "unreviewed")

    const matchesSystemFilter = systemFilter === "all" || trace.system === systemFilter

    const matchesSeverityFilter = severityFilter === "all" || trace.severity === severityFilter

    const matchesSearch =
      searchQuery === "" ||
      trace.userInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.system.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatusFilter && matchesSystemFilter && matchesSeverityFilter && matchesSearch
  })

  // Group traces by system
  const groupedTraces = filteredTraces.reduce((groups, trace) => {
    const system = trace.system
    if (!groups[system]) {
      groups[system] = []
    }
    groups[system].push(trace)
    return groups
  }, {} as Record<string, Trace[]>)

  // Handle chunk editing
  const handleEditChunk = (chunkId: string) => {
    if (!selectedTrace) return

    const chunk = selectedTrace.chunks.find((c) => c.id === chunkId)
    if (chunk) {
      setEditingChunkId(chunkId)
      setEditedChunkContent(chunk.content)
    }
  }

  // Save chunk edit
  const handleSaveChunkEdit = () => {
    if (!selectedTrace || !editingChunkId) return

    setTraces(
      traces.map((trace) => {
        if (trace.id === selectedTrace.id) {
          return {
            ...trace,
            chunks: trace.chunks.map((chunk) =>
              chunk.id === editingChunkId ? { ...chunk, content: editedChunkContent, status: "edited" } : chunk,
            ),
          }
        }
        return trace
      }),
    )

    setEditingChunkId(null)
    setEditedChunkContent("")
  }

  // Toggle chunk exclusion
  const handleToggleChunkExclusion = (chunkId: string) => {
    if (!selectedTrace) return

    setTraces(
      traces.map((trace) => {
        if (trace.id === selectedTrace.id) {
          return {
            ...trace,
            chunks: trace.chunks.map((chunk) =>
              chunk.id === chunkId ? { ...chunk, excluded: !chunk.excluded } : chunk,
            ),
          }
        }
        return trace
      }),
    )
  }

  // Mark chunk status
  const handleMarkChunkStatus = (chunkId: string, status: ChunkStatus) => {
    if (!selectedTrace) return

    setTraces(
      traces.map((trace) => {
        if (trace.id === selectedTrace.id) {
          return {
            ...trace,
            chunks: trace.chunks.map((chunk) => (chunk.id === chunkId ? { ...chunk, status } : chunk)),
          }
        }
        return trace
      }),
    )
  }

  // Start editing response
  const handleStartEditingResponse = () => {
    if (!selectedTrace) return
    setIsEditingResponse(true)
    setEditedResponse(selectedTrace.editedResponse || selectedTrace.response)
  }

  // Save edited response
  const handleSaveEditedResponse = () => {
    if (!selectedTrace) return

    setTraces(
      traces.map((trace) => {
        if (trace.id === selectedTrace.id) {
          return {
            ...trace,
            editedResponse: editedResponse,
          }
        }
        return trace
      }),
    )

    setIsEditingResponse(false)
  }

  // Replay the trace with edits
  const handleReplay = () => {
    if (!selectedTrace) return

    setIsReplaying(true)

    // Simulate replay
    setTimeout(() => {
      const improvedAccuracy = Math.min(0.98, (selectedTrace.metrics.accuracy || 0.7) + 0.25)

      let improvedResponse = ""
      if (selectedTrace.id === "trace-001") {
        improvedResponse =
          "I can help you reset your password. To reset your password, please visit our password reset page at company.com/reset-password and enter your email address. You'll receive a secure link to create a new password within 5 minutes. If you don't receive the email, please check your spam folder or contact our support team."
      } else if (selectedTrace.id === "trace-002") {
        improvedResponse =
          "Based on our current contract terms, the standard cancellation policy requires 30 days written notice. However, I don't have access to your specific contract details. Please contact our legal team at legal@company.com or call 1-800-555-0123 to review your specific cancellation terms and any applicable fees."
      } else {
        improvedResponse =
          "The improved response has removed hallucinations and focuses only on factual information from the retrieved chunks. It provides a clear, accurate answer based solely on the verified information available in the knowledge base."
      }

      setReplayResult({
        response: improvedResponse,
        metrics: {
          retrievalTime: selectedTrace.metrics.retrievalTime * 0.9,
          generationTime: selectedTrace.metrics.generationTime * 0.85,
          totalTokens: selectedTrace.metrics.totalTokens * 0.95,
          cost: selectedTrace.metrics.cost * 0.9,
          accuracy: improvedAccuracy,
        },
        improved: true,
      })

      // Update trace status to fixed
      setTraces(
        traces.map((trace) => {
          if (trace.id === selectedTrace.id) {
            return {
              ...trace,
              status: "fixed",
              metrics: {
                ...trace.metrics,
                accuracy: improvedAccuracy,
              },
            }
          }
          return trace
        }),
      )

      setIsReplaying(false)
      setShowSaveDialog(true)
    }, 2000)
  }

  // Save the fixed trace
  const handleSaveFixedTrace = () => {
    // In a real app, this would save to the backend
    setShowSaveDialog(false)

    // Update trace with save details
    if (selectedTrace) {
      setTraces(
        traces.map((trace) => {
          if (trace.id === selectedTrace.id) {
            return {
              ...trace,
              status: "fixed",
            }
          }
          return trace
        }),
      )
    }
  }

  // Render connection dialog
  const renderConnectionDialog = () => (
    <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect to RAG System</DialogTitle>
          <DialogDescription>
            Enter your API key and endpoint to connect to your RAG debugging instance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-retriever-..."
              className="col-span-3"
              value={connectionDetails.apiKey}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, apiKey: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right">
              Endpoint
            </Label>
            <Input
              id="endpoint"
              placeholder="https://api.retriever-sdk.com"
              className="col-span-3"
              value={connectionDetails.endpoint}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, endpoint: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project" className="text-right">
              Project
            </Label>
            <Input
              id="project"
              placeholder="enterprise-rag-system"
              className="col-span-3"
              value={connectionDetails.project}
              onChange={(e) => setConnectionDetails({ ...connectionDetails, project: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={!connectionDetails.apiKey}>
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Render save dialog
  const renderSaveDialog = () => (
    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Fixed Trace</DialogTitle>
          <DialogDescription>Save your changes and improvements to this trace.</DialogDescription>
        </DialogHeader>

        {replayResult?.improved && (
          <div className="mb-4 p-3 rounded-md border bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-700">Improvements Detected</div>
                <div className="text-sm">
                  Accuracy improved from {((selectedTrace?.metrics.accuracy || 0.7) * 100).toFixed(0)}% to{" "}
                  {(replayResult.metrics.accuracy * 100).toFixed(0)}%
                </div>
                <div className="text-sm">
                  Response quality improved with better chunk selection and hallucination removal
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fix-name" className="text-right">
              Fix Name
            </Label>
            <Input
              id="fix-name"
              placeholder="Password Reset Hallucination Fix"
              className="col-span-3"
              value={saveDetails.name}
              onChange={(e) => setSaveDetails({ ...saveDetails, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fix-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="fix-description"
              placeholder="Fixed hallucination by removing unverified claims and focusing on documented procedures"
              className="col-span-3"
              value={saveDetails.description}
              onChange={(e) => setSaveDetails({ ...saveDetails, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Options</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-test-case"
                  checked={saveDetails.saveAsTestCase}
                  onCheckedChange={(checked) => setSaveDetails({ ...saveDetails, saveAsTestCase: checked as boolean })}
                />
                <Label htmlFor="save-test-case">Save as regression test case</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-version"
                  checked={saveDetails.createNewVersion}
                  onCheckedChange={(checked) =>
                    setSaveDetails({ ...saveDetails, createNewVersion: checked as boolean })
                  }
                />
                <Label htmlFor="create-version">Create new version</Label>
              </div>
              {saveDetails.createNewVersion && (
                <Input
                  placeholder="v1.2 - Fixed password reset hallucination"
                  className="mt-2"
                  value={saveDetails.versionName}
                  onChange={(e) => setSaveDetails({ ...saveDetails, versionName: e.target.value })}
                />
              )}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="notify-team"
                  checked={saveDetails.notifyTeam}
                  onCheckedChange={(checked) => setSaveDetails({ ...saveDetails, notifyTeam: checked as boolean })}
                />
                <Label htmlFor="notify-team">Notify support team</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveFixedTrace}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Render trace list
  const renderTraceList = () => (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>LLM Workflow Traces</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={traceFilter} onValueChange={setTraceFilter}>
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="failing">Failing</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="passing">Passing</SelectItem>
                <SelectItem value="unreviewed">Unreviewed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search traces..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={systemFilter} onValueChange={setSystemFilter}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="Cursor Support Bot (Sam)">Cursor Support Bot (Sam)</SelectItem>
                <SelectItem value="Codebase QA & Navigation Assistant">Codebase QA & Navigation Assistant</SelectItem>
                <SelectItem value="Documentation Q&A">Documentation Q&A</SelectItem>
                <SelectItem value="Legal QA">Legal QA</SelectItem>
                <SelectItem value="Customer Onboarding">Customer Onboarding</SelectItem>
                <SelectItem value="Compliance Bot">Compliance Bot</SelectItem>
                <SelectItem value="Sales Assistant">Sales Assistant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-340px)]">
          <div className="space-y-4">
            {isLoadingTraces ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <p className="text-sm text-muted-foreground">Loading traces...</p>
              </div>
            ) : Object.keys(groupedTraces).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No traces found</p>
                <Button variant="link" size="sm" className="mt-2">
                  Clear filters
                </Button>
              </div>
            ) : (
              Object.entries(groupedTraces).map(([system, systemTraces]) => (
                <div key={system} className="space-y-2">
                  <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-md">
                    <Database className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm text-gray-700">{system}</span>
                    <Badge variant="outline" className="text-xs">
                      {systemTraces.length}
                    </Badge>
                  </div>
                  {systemTraces.map((trace) => (
                    <div
                      key={trace.id}
                      className={`rounded-md border p-3 cursor-pointer transition-colors ml-4 ${
                        selectedTraceId === trace.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedTraceId(trace.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-2">
                          <div className="font-medium truncate">{trace.userInput}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={
                                trace.status === "passing"
                                  ? "outline"
                                  : trace.status === "failing"
                                    ? "destructive"
                                    : trace.status === "fixed"
                                      ? "default"
                                      : "secondary"
                              }
                              className="text-xs"
                            >
                              {trace.status === "passing" && <Check className="mr-1 h-3 w-3" />}
                              {trace.status === "failing" && <X className="mr-1 h-3 w-3" />}
                              {trace.status === "fixed" && <Sparkles className="mr-1 h-3 w-3" />}
                              {trace.status === "unreviewed" && <Info className="mr-1 h-3 w-3" />}
                              {trace.status.charAt(0).toUpperCase() + trace.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {trace.useCase}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                trace.severity === "High" 
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : trace.severity === "Medium"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                              }`}
                            >
                              {trace.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                              {trace.failureType}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-xs text-muted-foreground">{trace.chunks.length} chunks</div>
                          {trace.confidence && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs mr-1">Confidence:</span>
                              <span
                                className={`text-xs font-medium ${
                                  trace.confidence > 0.8
                                    ? "text-green-600"
                                    : trace.confidence > 0.6
                                      ? "text-amber-600"
                                      : "text-red-600"
                                }`}
                              >
                                {(trace.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )

  // Render trace details
  const renderTraceDetails = () => {
    if (!selectedTrace) {
      return (
        <Card className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Trace Selected</h3>
          <p className="text-muted-foreground mb-4">Select a trace from the list to view and debug its details</p>
          <Button variant="outline" onClick={() => setShowConnectionDialog(true)}>
            <Link className="mr-2 h-4 w-4" />
            Connect to RAG System
          </Button>
        </Card>
      )
    }

    return (
      <Card className="col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trace Details</CardTitle>
              <CardDescription>User Input: {selectedTrace.userInput}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Database className="mr-1 h-3 w-3" />
                  {selectedTrace.system}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {selectedTrace.useCase}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${
                    selectedTrace.severity === "High" 
                      ? "bg-red-50 text-red-700 border-red-200"
                      : selectedTrace.severity === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }`}
                >
                  {selectedTrace.severity}
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  {selectedTrace.failureType}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  <Clock className="inline mr-1 h-3 w-3" />
                  {selectedTrace.timestamp}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReplay} disabled={isReplaying}>
                {isReplaying ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Patching...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Patch & Fix
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Trace Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Save className="mr-2 h-4 w-4" />
                    Save as Test Case
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Code className="mr-2 h-4 w-4" />
                    Export Trace
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="mr-2 h-4 w-4" />
                    Share with Team
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Trace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <Tabs defaultValue="breakdown">
            <TabsList>
              <TabsTrigger value="breakdown">RAG Breakdown</TabsTrigger>
              <TabsTrigger value="chunks">Retrieved Chunks</TabsTrigger>
              <TabsTrigger value="response">Final Response</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="patch">Patch Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="breakdown" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">User Input</span>
                  </div>
                  <p className="text-sm pl-6">{selectedTrace.userInput}</p>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">Retrieved Chunks</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedTrace.chunks.length} chunks
                    </Badge>
                  </div>
                  <div className="pl-6 space-y-2">
                    {selectedTrace.chunks.slice(0, 3).map((chunk) => (
                      <div key={chunk.id} className="text-sm border-l-2 border-green-300 pl-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {chunk.relevance.toFixed(2)}
                          </Badge>
                          {chunk.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {(chunk.confidence * 100).toFixed(0)}% confidence
                            </Badge>
                          )}
                        </div>
                        <p className="truncate">{chunk.content}</p>
                        <p className="text-xs text-gray-500 mt-1">Source: {chunk.source}</p>
                      </div>
                    ))}
                    {selectedTrace.chunks.length > 3 && (
                      <p className="text-xs text-gray-500 pl-2">
                        +{selectedTrace.chunks.length - 3} more chunks...
                      </p>
                    )}
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-600">Final LLM Response</span>
                    {selectedTrace.confidence && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          selectedTrace.confidence > 0.8
                            ? "bg-green-50 text-green-700 border-green-200"
                            : selectedTrace.confidence > 0.6
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {(selectedTrace.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm pl-6">{selectedTrace.response}</p>
                </div>

                {selectedTrace.grounding && (
                  <div className="border rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Link className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-600">Grounding Info</span>
                    </div>
                    <div className="pl-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Grounding Score:</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            selectedTrace.grounding > 0.8
                              ? "bg-green-50 text-green-700 border-green-200"
                              : selectedTrace.grounding > 0.6
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {(selectedTrace.grounding * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <Progress value={selectedTrace.grounding * 100} className="h-2 mt-2" />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="chunks" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {selectedTrace.chunks.filter((c) => !c.excluded).length} of {selectedTrace.chunks.length} chunks used
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[150px] h-8">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Sort by Relevance</SelectItem>
                      <SelectItem value="confidence">Sort by Confidence</SelectItem>
                      <SelectItem value="status">Sort by Status</SelectItem>
                      <SelectItem value="source">Sort by Source</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="space-y-3">
                  {selectedTrace.chunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      className={`p-3 border rounded-md ${chunk.excluded ? "bg-gray-50 opacity-60" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`
                              ${
                                chunk.relevance > 0.9
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : chunk.relevance > 0.7
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            `}
                          >
                            {chunk.relevance.toFixed(2)}
                          </Badge>

                          {chunk.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {(chunk.confidence * 100).toFixed(0)}% conf
                            </Badge>
                          )}

                          {chunk.status === "hallucination" && <Badge variant="destructive">Hallucination</Badge>}

                          {chunk.status === "irrelevant" && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Irrelevant
                            </Badge>
                          )}

                          {chunk.status === "edited" && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Edited
                            </Badge>
                          )}

                          {chunk.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-gray-100">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleMarkChunkStatus(chunk.id, "relevant")}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Mark as Relevant</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleMarkChunkStatus(chunk.id, "irrelevant")}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Mark as Irrelevant</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleMarkChunkStatus(chunk.id, "hallucination")}
                                >
                                  <AlertCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Mark as Hallucination</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditChunk(chunk.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Chunk</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={chunk.excluded ? "outline" : "ghost"}
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleToggleChunkExclusion(chunk.id)}
                                >
                                  {chunk.excluded ? <Eye className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{chunk.excluded ? "Include Chunk" : "Exclude Chunk"}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      {editingChunkId === chunk.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editedChunkContent}
                            onChange={(e) => setEditedChunkContent(e.target.value)}
                            className="min-h-[100px] text-sm"
                          />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingChunkId(null)}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveChunkEdit}>
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`pl-2 border-l-2 ${
                              chunk.status === "hallucination"
                                ? "border-red-300"
                                : chunk.status === "irrelevant"
                                  ? "border-amber-300"
                                  : "border-blue-300"
                            }`}
                          >
                            <p className="text-sm">{chunk.content}</p>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Source: {chunk.source}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="response" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {selectedTrace.editedResponse ? "Edited Response" : "Original Response"}
                </div>
                <div className="flex items-center gap-2">
                  {!isEditingResponse ? (
                    <Button variant="outline" size="sm" onClick={handleStartEditingResponse}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Response
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingResponse(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEditedResponse}>
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isEditingResponse ? (
                <Textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="min-h-[300px] text-sm"
                />
              ) : (
                <div className="border rounded-md p-4">
                  <div className="pl-2 border-l-2 border-blue-300">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-600">Response</span>
                      {selectedTrace.confidence && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            selectedTrace.confidence > 0.8
                              ? "bg-green-50 text-green-700 border-green-200"
                              : selectedTrace.confidence > 0.6
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {(selectedTrace.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{selectedTrace.editedResponse || selectedTrace.response}</p>
                  </div>
                </div>
              )}

              {replayResult && (
                <>
                  <Separator />
                  <div className="text-sm font-medium">Patched Response</div>
                  <div className="border rounded-md p-4 bg-green-50 border-green-200">
                    <div className="pl-2 border-l-2 border-green-300">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">Improved Response</span>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Patched
                        </Badge>
                      </div>
                      <p className="text-sm">{replayResult.response}</p>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Retrieval Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Retrieval Time</span>
                        <span className="font-medium">{selectedTrace.metrics.retrievalTime}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Chunks Retrieved</span>
                        <span className="font-medium">{selectedTrace.chunks.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Chunks Used</span>
                        <span className="font-medium">{selectedTrace.chunks.filter((c) => !c.excluded).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg. Relevance</span>
                        <span className="font-medium">
                          {(
                            selectedTrace.chunks.reduce((sum, chunk) => sum + chunk.relevance, 0) /
                            selectedTrace.chunks.length
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Generation Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Generation Time</span>
                        <span className="font-medium">{selectedTrace.metrics.generationTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Time</span>
                        <span className="font-medium">
                          {(selectedTrace.metrics.retrievalTime / 1000 + selectedTrace.metrics.generationTime).toFixed(
                            2,
                          )}
                          s
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Tokens</span>
                        <span className="font-medium">{selectedTrace.metrics.totalTokens}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Cost</span>
                        <span className="font-medium">${selectedTrace.metrics.cost.toFixed(4)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedTrace.metrics.accuracy && (
                <div className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Accuracy</span>
                            <span className="font-medium">{(selectedTrace.metrics.accuracy * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={selectedTrace.metrics.accuracy * 100} className="h-2" />
                        </div>

                        {selectedTrace.confidence && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Confidence</span>
                              <span className="font-medium">{(selectedTrace.metrics.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={selectedTrace.confidence * 100} className="h-2" />
                          </div>
                        )}

                        {selectedTrace.grounding && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Grounding</span>
                              <span className="font-medium">{(selectedTrace.metrics.grounding * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={selectedTrace.grounding * 100} className="h-2" />
                          </div>
                        )}

                        {replayResult && (
                          <div className="p-3 rounded-md bg-green-50 border border-green-200">
                            <div className="text-sm font-medium text-green-700 mb-2">Improvements After Patch</div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Accuracy</span>
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {(selectedTrace.metrics.accuracy * 100).toFixed(0)}%
                                  </span>
                                  <ArrowRight className="h-4 w-4 mx-1" />
                                  <span className="font-medium text-green-700">
                                    {(replayResult.metrics.accuracy * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Generation Time</span>
                                <div className="flex items-center">
                                  <span className="font-medium">{selectedTrace.metrics.generationTime}s</span>
                                  <ArrowRight className="h-4 w-4 mx-1" />
                                  <span className="font-medium text-green-700">
                                    {replayResult.metrics.generationTime.toFixed(2)}s
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Total Tokens</span>
                                <div className="flex items-center">
                                  <span className="font-medium">{selectedTrace.metrics.totalTokens}</span>
                                  <ArrowRight className="h-4 w-4 mx-1" />
                                  <span className="font-medium text-green-700">{replayResult.metrics.totalTokens}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Cost</span>
                                <div className="flex items-center">
                                  <span className="font-medium">${selectedTrace.metrics.cost.toFixed(4)}</span>
                                  <ArrowRight className="h-4 w-4 mx-1" />
                                  <span className="font-medium text-green-700">
                                    ${replayResult.metrics.cost.toFixed(4)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="patch" className="pt-4">
              <div className="space-y-6">
                <div className="text-sm font-medium">Patch & Fix Tools</div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Retrieval Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="chunk-limit" className="text-sm">Chunk Limit</Label>
                        <Input id="chunk-limit" type="number" defaultValue="5" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="relevance-threshold" className="text-sm">Relevance Threshold</Label>
                        <Input id="relevance-threshold" type="number" step="0.1" defaultValue="0.7" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="search-strategy" className="text-sm">Search Strategy</Label>
                      <Select defaultValue="semantic">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semantic">Semantic Search</SelectItem>
                          <SelectItem value="hybrid">Hybrid Search</SelectItem>
                          <SelectItem value="keyword">Keyword Search</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">RAG Prompt Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="You are a helpful assistant. Use only the provided context to answer questions. If the context doesn't contain enough information, say so clearly..."
                      className="min-h-[120px] text-sm"
                      defaultValue="You are a helpful assistant. Use only the provided context to answer questions. If the context doesn't contain enough information, say so clearly. Do not make up information that isn't in the context."
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Hallucination Checks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="source-grounding" defaultChecked />
                      <Label htmlFor="source-grounding" className="text-sm">Enable source grounding validation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fact-checking" defaultChecked />
                      <Label htmlFor="fact-checking" className="text-sm">Enable fact-checking against retrieved chunks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="confidence-threshold" />
                      <Label htmlFor="confidence-threshold" className="text-sm">Require minimum confidence threshold</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="min-confidence" className="text-sm">Min Confidence</Label>
                        <Input id="min-confidence" type="number" step="0.1" defaultValue="0.8" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="grounding-threshold" className="text-sm">Grounding Threshold</Label>
                        <Input id="grounding-threshold" type="number" step="0.1" defaultValue="0.7" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                  <Button onClick={handleReplay} disabled={isReplaying}>
                    {isReplaying ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Testing Patch...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Test Patch
                      </>
                    )}
                  </Button>
                </div>

                {replayResult && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-700">Patch Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Status</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="mr-1 h-3 w-3" />
                            Improved
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-1">Before vs After:</div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="font-medium text-gray-600">Original</div>
                              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
                                {selectedTrace.response.substring(0, 100)}...
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-600">Patched</div>
                              <div className="p-2 bg-green-50 border border-green-200 rounded text-green-700">
                                {replayResult.response.substring(0, 100)}...
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Trace ID: {selectedTrace.id} • Model: {selectedTrace.model} • System: {selectedTrace.system}
          </div>
          <Button onClick={handleReplay} disabled={isReplaying}>
            {isReplaying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Patching...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Patch & Fix
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Main render
  return (
    <div className="space-y-6">
      {/* Connection status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold tracking-tight mr-4">LLM Workflow Suite</h2>
          {isConnected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
              Connected to {connectionDetails.project}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <div className="h-2 w-2 rounded-full bg-amber-500 mr-1.5" />
              Not Connected
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Import Traces
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowConnectionDialog(true)}>
              <Link className="mr-2 h-4 w-4" />
              Connect to RAG System
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        {renderTraceList()}
        {renderTraceDetails()}
      </div>

      {/* Dialogs */}
      {renderConnectionDialog()}
      {renderSaveDialog()}
    </div>
  )
}

// Sample RAG debugging data with Cursor IDE focus
const ragTraces: Trace[] = [
  {
    id: "trace-001",
    userInput: "Why was I logged out?",
    timestamp: "Today at 10:30 AM",
    status: "failing",
    system: "Cursor Support Bot (Sam)",
    useCase: "Support",
    failureType: "Hallucination",
    severity: "High",
    chunks: [
      {
        id: "chunk-001",
        content: "Cursor allows users to sign in on multiple devices simultaneously. There is no device limit for individual accounts.",
        source: "cursor-docs/account-management.md",
        relevance: 0.95,
        confidence: 0.92,
        status: "relevant",
        excluded: false,
        tags: ["Device Policy", "Account"],
      },
      {
        id: "chunk-002",
        content: "Device limit policy: Users are restricted to one active session per account for security purposes.",
        source: "cursor-docs/fake-policy.md",
        relevance: 0.45,
        confidence: 0.32,
        status: "hallucination",
        excluded: false,
        tags: ["Device Policy", "Hallucinated"],
      },
    ],
    response: "We only allow one device per user, so you'll need to sign out of other devices first before you can use Cursor on this device. This is a security measure to protect your account.",
    model: "gpt-4o",
    user: "Cursor User #4821",
    project: "cursor-support-rag",
    confidence: 0.72,
    grounding: 0.28,
    metrics: {
      retrievalTime: 145,
      generationTime: 1.2,
      totalTokens: 420,
      cost: 0.0084,
      accuracy: 0.15,
    },
  },
  {
    id: "trace-002",
    userInput: "How do I navigate to the function that handles user authentication in this React codebase?",
    timestamp: "Today at 11:45 AM",
    status: "passing",
    system: "Codebase QA & Navigation Assistant",
    useCase: "Internal Docs",
    failureType: "Context Overflow",
    severity: "Low",
    chunks: [
      {
        id: "chunk-003",
        content: "The main authentication logic is located in src/auth/AuthProvider.tsx, which exports the useAuth hook and AuthContext.",
        source: "codebase-index/auth-components.md",
        relevance: 0.94,
        confidence: 0.91,
        status: "relevant",
        excluded: false,
        tags: ["Authentication", "React", "Navigation"],
      },
      {
        id: "chunk-004",
        content: "User login validation is handled in src/utils/authHelpers.js, specifically in the validateUserCredentials function.",
        source: "codebase-index/utility-functions.md",
        relevance: 0.89,
        confidence: 0.87,
        status: "relevant",
        excluded: false,
        tags: ["Validation", "Utils", "Login"],
      },
      {
        id: "chunk-005",
        content: "The authentication flow starts in src/components/LoginForm.tsx and connects to the backend via src/api/authAPI.js.",
        source: "codebase-index/component-mapping.md",
        relevance: 0.92,
        confidence: 0.88,
        status: "relevant",
        excluded: false,
        tags: ["Components", "API", "Flow"],
      },
      {
        id: "chunk-006",
        content: "Session management and token handling is implemented in src/store/authSlice.js using Redux Toolkit.",
        source: "codebase-index/state-management.md",
        relevance: 0.86,
        confidence: 0.84,
        status: "relevant",
        excluded: false,
        tags: ["Redux", "Session", "Tokens"],
      },
    ],
    response: "The user authentication in your React codebase is handled across several files: The main authentication logic is in `src/auth/AuthProvider.tsx` which exports the useAuth hook. User login validation happens in `src/utils/authHelpers.js` in the `validateUserCredentials` function. The authentication flow starts in `src/components/LoginForm.tsx` and connects to the backend via `src/api/authAPI.js`. Session management and token handling is implemented in `src/store/authSlice.js` using Redux Toolkit.",
    model: "gpt-4o",
    user: "Senior Developer #2847",
    project: "codebase-navigation-rag",
    confidence: 0.89,
    grounding: 0.91,
    metrics: {
      retrievalTime: 180,
      generationTime: 1.4,
      totalTokens: 520,
      cost: 0.0104,
      accuracy: 0.92,
    },
  },
  {
    id: "trace-003",
    userInput: "Where can I find examples of how to implement custom React hooks in our codebase?",
    timestamp: "Today at 2:15 PM",
    status: "failing",
    system: "Codebase QA & Navigation Assistant",
    useCase: "Internal Docs",
    failureType: "Bad Chunk",
    severity: "Medium",
    chunks: [
      {
        id: "chunk-007",
        content: "Custom hooks are located in the src/hooks/ directory. Examples include useLocalStorage, useDebounce, and useAPI.",
        source: "codebase-index/hooks-directory.md",
        relevance: 0.93,
        confidence: 0.89,
        status: "relevant",
        excluded: false,
        tags: ["Hooks", "Custom", "Examples"],
      },
      {
        id: "chunk-008",
        content: "The useAuth hook in src/auth/AuthProvider.tsx is a good example of a complex custom hook with context integration.",
        source: "codebase-index/auth-hooks.md",
        relevance: 0.87,
        confidence: 0.85,
        status: "relevant",
        excluded: false,
        tags: ["Auth", "Context", "Complex"],
      },
      {
        id: "chunk-009",
        content: "All custom hooks must be written in TypeScript and follow the naming convention use[HookName] as per our style guide.",
        source: "codebase-index/fake-style-guide.md",
        relevance: 0.45,
        confidence: 0.32,
        status: "hallucination",
        excluded: false,
        tags: ["TypeScript", "Naming", "Hallucinated"],
      },
      {
        id: "chunk-010",
        content: "For data fetching, check out useQuery and useMutation hooks in src/hooks/api/ which wrap React Query functionality.",
        source: "codebase-index/api-hooks.md",
        relevance: 0.91,
        confidence: 0.88,
        status: "relevant",
        excluded: false,
        tags: ["Data Fetching", "React Query", "API"],
      },
    ],
    response: "You can find custom React hook examples in several places in our codebase: The main `src/hooks/` directory contains examples like useLocalStorage, useDebounce, and useAPI. The useAuth hook in `src/auth/AuthProvider.tsx` is a great example of a complex custom hook with context integration. For data fetching, check out the useQuery and useMutation hooks in `src/hooks/api/` which wrap React Query functionality. All hooks must follow TypeScript conventions and use the use[HookName] naming pattern.",
    model: "gpt-4o",
    user: "Frontend Developer #5634",
    project: "codebase-navigation-rag",
    confidence: 0.76,
    grounding: 0.68,
    metrics: {
      retrievalTime: 165,
      generationTime: 1.3,
      totalTokens: 445,
      cost: 0.0089,
      accuracy: 0.74,
    },
  },
  {
    id: "trace-004",
    userInput: "What are the deployment requirements for our microservices architecture?",
    timestamp: "Yesterday at 3:30 PM",
    status: "passing",
    system: "Documentation Q&A",
    useCase: "Internal Docs",
    failureType: "Source Mismatch",
    severity: "Low",
    chunks: [
      {
        id: "chunk-011",
        content: "Each microservice requires Docker containerization with a minimum of 512MB RAM and 0.5 CPU cores allocated.",
        source: "docs/deployment/resource-requirements.md",
        relevance: 0.96,
        confidence: 0.94,
        status: "relevant",
        excluded: false,
        tags: ["Docker", "Resources", "Requirements"],
      },
      {
        id: "chunk-012",
        content: "Services must expose health check endpoints at /health and implement graceful shutdown handling for SIGTERM signals.",
        source: "docs/deployment/health-checks.md",
        relevance: 0.92,
        confidence: 0.90,
        status: "relevant",
        excluded: false,
        tags: ["Health Checks", "Graceful Shutdown", "Endpoints"],
      },
      {
        id: "chunk-013",
        content: "All services require environment-specific configuration files and must support 12-factor app principles.",
        source: "docs/deployment/configuration.md",
        relevance: 0.88,
        confidence: 0.86,
        status: "relevant",
        excluded: false,
        tags: ["Configuration", "12-Factor", "Environment"],
      },
      {
        id: "chunk-014",
        content: "Load balancing is handled by Kubernetes ingress controllers with automatic SSL certificate management via cert-manager.",
        source: "docs/deployment/load-balancing.md",
        relevance: 0.85,
        confidence: 0.83,
        status: "relevant",
        excluded: false,
        tags: ["Kubernetes", "Load Balancing", "SSL"],
      },
      {
        id: "chunk-015",
        content: "Database migrations must be run as init containers before the main application starts to ensure schema consistency.",
        source: "docs/deployment/database-migrations.md",
        relevance: 0.90,
        confidence: 0.87,
        status: "relevant",
        excluded: false,
        tags: ["Database", "Migrations", "Init Containers"],
      },
    ],
    response: "Our microservices deployment requirements include: Each service needs Docker containerization with minimum 512MB RAM and 0.5 CPU cores. Services must expose health check endpoints at /health and implement graceful shutdown for SIGTERM signals. All services require environment-specific configuration files following 12-factor app principles. Load balancing is handled by Kubernetes ingress controllers with automatic SSL via cert-manager. Database migrations must run as init containers before the main application starts to ensure schema consistency.",
    model: "gpt-4o",
    user: "DevOps Engineer #7829",
    project: "documentation-qa-rag",
    confidence: 0.91,
    grounding: 0.93,
    metrics: {
      retrievalTime: 145,
      generationTime: 1.1,
      totalTokens: 485,
      cost: 0.0097,
      accuracy: 0.94,
    },
  },
  {
    id: "trace-005",
    userInput: "How do I set up monitoring and alerting for our production services?",
    timestamp: "Yesterday at 5:45 PM",
    status: "failing",
    system: "Documentation Q&A",
    useCase: "Internal Docs",
    failureType: "Hallucination",
    severity: "High",
    chunks: [
      {
        id: "chunk-016",
        content: "Monitoring is implemented using Prometheus for metrics collection and Grafana for visualization dashboards.",
        source: "docs/monitoring/prometheus-setup.md",
        relevance: 0.94,
        confidence: 0.91,
        status: "relevant",
        excluded: false,
        tags: ["Prometheus", "Grafana", "Monitoring"],
      },
      {
        id: "chunk-017",
        content: "Alerting rules are configured in Prometheus AlertManager with notifications sent to Slack and PagerDuty.",
        source: "docs/monitoring/alerting-rules.md",
        relevance: 0.89,
        confidence: 0.87,
        status: "relevant",
        excluded: false,
        tags: ["AlertManager", "Slack", "PagerDuty"],
      },
      {
        id: "chunk-018",
        content: "Log aggregation is handled by the ELK stack (Elasticsearch, Logstash, Kibana) with centralized log collection.",
        source: "docs/monitoring/logging-setup.md",
        relevance: 0.86,
        confidence: 0.84,
        status: "relevant",
        excluded: false,
        tags: ["ELK Stack", "Logging", "Centralized"],
      },
      {
        id: "chunk-019",
        content: "We use DataDog for advanced APM and distributed tracing across all microservices with automatic anomaly detection.",
        source: "docs/monitoring/fake-datadog.md",
        relevance: 0.42,
        confidence: 0.28,
        status: "hallucination",
        excluded: false,
        tags: ["DataDog", "APM", "Hallucinated"],
      },
    ],
    response: "To set up monitoring and alerting for production services, we use a comprehensive stack: Prometheus for metrics collection with Grafana for visualization dashboards. Alerting rules are configured in AlertManager with notifications to Slack and PagerDuty. Log aggregation uses the ELK stack for centralized collection. Additionally, we have DataDog for advanced APM and distributed tracing with automatic anomaly detection. All services also integrate with our custom monitoring dashboard that provides real-time SLA tracking and automated incident response.",
    model: "gpt-4o",
    user: "Site Reliability Engineer #9156",
    project: "documentation-qa-rag",
    confidence: 0.73,
    grounding: 0.65,
    metrics: {
      retrievalTime: 175,
      generationTime: 1.5,
      totalTokens: 465,
      cost: 0.0093,
      accuracy: 0.71,
    },
  },
  {
    id: "trace-006",
    userInput: "What's our API versioning strategy and how do we handle backward compatibility?",
    timestamp: "2 days ago",
    status: "unreviewed",
    system: "Documentation Q&A",
    useCase: "Internal Docs",
    failureType: "Empty Retrieval",
    severity: "Medium",
    chunks: [
      {
        id: "chunk-020",
        content: "We use semantic versioning (semver) for all APIs with major.minor.patch format. Breaking changes require major version increments.",
        source: "docs/api/versioning-strategy.md",
        relevance: 0.95,
        confidence: 0.92,
        status: "relevant",
        excluded: false,
        tags: ["Semantic Versioning", "Breaking Changes", "API"],
      },
      {
        id: "chunk-021",
        content: "Backward compatibility is maintained for at least 2 major versions with deprecation warnings sent 6 months before removal.",
        source: "docs/api/backward-compatibility.md",
        relevance: 0.91,
        confidence: 0.89,
        status: "relevant",
        excluded: false,
        tags: ["Backward Compatibility", "Deprecation", "Warnings"],
      },
      {
        id: "chunk-022",
        content: "API versioning is handled through URL path versioning (e.g., /api/v1/, /api/v2/) rather than header-based versioning.",
        source: "docs/api/url-versioning.md",
        relevance: 0.88,
        confidence: 0.85,
        status: "relevant",
        excluded: false,
        tags: ["URL Versioning", "Path", "Headers"],
      },
      {
        id: "chunk-023",
        content: "Migration guides are provided for each major version change with code examples and automated migration tools.",
        source: "docs/api/migration-guides.md",
        relevance: 0.84,
        confidence: 0.82,
        status: "relevant",
        excluded: false,
        tags: ["Migration", "Guides", "Tools"],
      },
    ],
    response: "Our API versioning strategy uses semantic versioning (semver) with major.minor.patch format, where breaking changes require major version increments. We maintain backward compatibility for at least 2 major versions with deprecation warnings sent 6 months before removal. Versioning is handled through URL path versioning (e.g., /api/v1/, /api/v2/) rather than headers. Migration guides are provided for each major version change with code examples and automated migration tools to help developers transition smoothly.",
    model: "gpt-4o",
    user: "API Architect #4567",
    project: "documentation-qa-rag",
    confidence: 0.87,
    grounding: 0.89,
    metrics: {
      retrievalTime: 155,
      generationTime: 1.2,
      totalTokens: 425,
      cost: 0.0085,
      accuracy: 0.88,
    },
  },
{
  id: "trace-007",
  userInput: "How do I enable Cursor's AI features for my team workspace?",
  timestamp: "3 days ago",
  status: "passing",
  system: "Cursor Support Bot (Sam)",
  useCase: "Support",
  failureType: "Context Overflow",
  severity: "Low",
  chunks: [
    {
      id: "chunk-024",
      content: "Team workspaces in Cursor Pro allow administrators to manage AI features for all team members through the workspace settings.",
      source: "cursor-docs/team-workspaces.md",
      relevance: 0.94,
      confidence: 0.91,
      status: "relevant",
      excluded: false,
      tags: ["Team", "Workspace", "Admin"],
    },
    {
      id: "chunk-025",
      content: "To enable AI features for your team, go to Settings > Team > AI Features and toggle on the desired capabilities like Tab completion and Chat.",
      source: "cursor-docs/team-ai-setup.md",
      relevance: 0.92,
      confidence: 0.89,
      status: "relevant",
      excluded: false,
      tags: ["Settings", "AI Features", "Toggle"],
    },
    {
      id: "chunk-026",
      content: "Team members will automatically inherit AI feature access based on the workspace configuration set by administrators.",
      source: "cursor-docs/team-permissions.md",
      relevance: 0.87,
      confidence: 0.84,
      status: "relevant",
      excluded: false,
      tags: ["Permissions", "Inheritance", "Access"],
    },
    {
      id: "chunk-027",
      content: "Usage analytics and billing for team AI features are tracked at the workspace level and visible in the admin dashboard.",
      source: "cursor-docs/team-analytics.md",
      relevance: 0.83,
      confidence: 0.81,
      status: "relevant",
      excluded: false,
      tags: ["Analytics", "Billing", "Dashboard"],
    },
  ],
  response: "To enable Cursor's AI features for your team workspace, you'll need admin access to your Cursor Pro team account. Go to Settings > Team > AI Features and toggle on the desired capabilities like Tab completion and Chat. Team members will automatically inherit AI feature access based on your workspace configuration. Usage analytics and billing for team AI features are tracked at the workspace level and visible in your admin dashboard.",
  model: "gpt-4o",
  user: "Team Lead #8234",
  project: "cursor-support-rag",
  confidence: 0.88,
  grounding: 0.86,
  metrics: {
    retrievalTime: 125,
    generationTime: 1.1,
    totalTokens: 375,
    cost: 0.0075,
    accuracy: 0.89,
  },
},
{
  id: "trace-008",
  userInput: "Why is Cursor Tab not suggesting completions in my JavaScript files?",
  timestamp: "4 days ago",
  status: "failing",
  system: "Cursor Support Bot (Sam)",
  useCase: "Support",
  failureType: "Bad Chunk",
  severity: "Medium",
  chunks: [
    {
      id: "chunk-028",
      content: "Cursor Tab requires an active internet connection and valid API key to provide AI-powered code completions.",
      source: "cursor-docs/tab-requirements.md",
      relevance: 0.91,
      confidence: 0.88,
      status: "relevant",
      excluded: false,
      tags: ["Tab", "Internet", "API Key"],
    },
    {
      id: "chunk-029",
      content: "JavaScript files must have proper syntax and be part of a recognized project structure for Tab to work effectively.",
      source: "cursor-docs/js-support.md",
      relevance: 0.89,
      confidence: 0.86,
      status: "relevant",
      excluded: false,
      tags: ["JavaScript", "Syntax", "Project"],
    },
    {
      id: "chunk-030",
      content: "Check your Cursor Tab settings in Preferences > Features > Tab to ensure it's enabled for JavaScript file types.",
      source: "cursor-docs/tab-settings.md",
      relevance: 0.87,
      confidence: 0.84,
      status: "relevant",
      excluded: false,
      tags: ["Settings", "Preferences", "File Types"],
    },
    {
      id: "chunk-031",
      content: "Tab completions are disabled by default in .min.js files and other minified JavaScript to prevent performance issues.",
      source: "cursor-docs/fake-minified.md",
      relevance: 0.35,
      confidence: 0.22,
      status: "hallucination",
      excluded: false,
      tags: ["Minified", "Performance", "Hallucinated"],
    },
  ],
  response: "If Cursor Tab isn't suggesting completions in your JavaScript files, here are the most common causes: First, ensure you have an active internet connection and valid API key. Check that your JavaScript files have proper syntax and are part of a recognized project structure. Verify Tab is enabled for JavaScript in Preferences > Features > Tab. Also note that Tab completions are automatically disabled in .min.js files and other minified JavaScript to prevent performance issues. Try restarting Cursor if the issue persists.",
  model: "gpt-4o",
  user: "JavaScript Developer #6789",
  project: "cursor-support-rag",
  confidence: 0.74,
  grounding: 0.71,
  metrics: {
    retrievalTime: 140,
    generationTime: 1.3,
    totalTokens: 395,
    cost: 0.0079,
    accuracy: 0.76,
  },
},
]
