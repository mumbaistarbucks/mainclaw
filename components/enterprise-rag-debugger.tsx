"use client"

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

// Enhanced trace data with multi-RAG support
const traces = [
  {
    id: "trace-001",
    query: "What are the requirements for Strong Customer Authentication (SCA) in the EU?",
    status: "passing",
    type: "retrieval",
    source: "Stripe API Documentation",
    timestamp: "2025-05-12T15:30:22",
    retrievalLatency: 245,
    cost: 0.0023,
    groundednessScore: 0.94,
    retrievalSteps: 1,
  },
  {
    id: "trace-002",
    query: "How do I implement 3D Secure authentication for high-risk transactions?",
    status: "unreviewed",
    type: "retrieval",
    source: "Stripe Security Guide",
    timestamp: "2025-05-12T14:23:45",
    retrievalLatency: 312,
    cost: 0.0034,
    groundednessScore: 0.87,
    retrievalSteps: 2,
  },
  {
    id: "trace-003",
    query: "Explain the process for handling disputes and chargebacks",
    status: "failing",
    type: "retrieval",
    source: "Stripe Disputes Documentation",
    timestamp: "2025-05-12T13:15:22",
    retrievalLatency: 189,
    cost: 0.0019,
    groundednessScore: 0.62,
    retrievalSteps: 1,
  },
]

// Mock retrieved chunks with enhanced metadata
const mockChunks = [
  {
    id: "chunk-1",
    content:
      "Strong Customer Authentication (SCA) is a requirement of the second Payment Services Directive (PSD2) that came into effect on September 14, 2019. SCA requires customers to provide two of the following three authentication factors: something they know (password), something they have (phone), something they are (fingerprint).",
    source: "Stripe API Documentation v2023-10",
    relevanceScore: 0.95,
    lastUpdated: "May 10, 2025",
    isUsed: true,
    isContradictory: false,
    feedback: null,
    outputSpans: ["[1]", "[2]"],
    docType: "api-docs",
    section: "Authentication > SCA Requirements",
  },
  {
    id: "chunk-2",
    content:
      "For SCA compliance, you must implement 3D Secure authentication for transactions that require SCA. This includes most online card payments in the European Economic Area (EEA).",
    source: "Outdated SCA implementation guide v2020-08",
    relevanceScore: 0.73,
    lastUpdated: "Aug 15, 2020",
    isUsed: false,
    isContradictory: true,
    feedback: "outdated",
    outputSpans: [],
    docType: "guide",
    section: "Implementation > 3D Secure",
  },
  {
    id: "chunk-3",
    content:
      "Payment Intents API automatically handles SCA requirements when you create a payment with confirmation_method='automatic'. The API will prompt for additional authentication when required.",
    source: "Payment Intents API - Implementation Guide",
    relevanceScore: 0.87,
    lastUpdated: "Apr 22, 2025",
    isUsed: true,
    isContradictory: false,
    feedback: "helpful",
    outputSpans: ["[3]"],
    docType: "api-docs",
    section: "Payment Intents > SCA Handling",
  },
]

// Mock LLM output with source mapping
const mockOutput = {
  content: `Strong Customer Authentication (SCA) is a regulatory requirement under PSD2 that applies to most online card payments in the European Economic Area [1]. 

To comply with SCA requirements, you need to implement two-factor authentication using at least two of these elements: something the customer knows (like a password), something they have (like their phone), or something they are (like a fingerprint) [1][2].

For Stripe integration, the Payment Intents API automatically handles SCA compliance when you use confirmation_method='automatic' [3]. The API will automatically prompt customers for additional authentication when SCA is required, streamlining the implementation process.

Key implementation steps:
1. Use Payment Intents API with automatic confirmation
2. Handle authentication challenges in your frontend
3. Test with SCA-required test cards in your development environment`,
  sourceMap: [
    { span: "[1]", chunkId: "chunk-1", startPos: 125, endPos: 200 },
    { span: "[2]", chunkId: "chunk-1", startPos: 280, endPos: 420 },
    { span: "[3]", chunkId: "chunk-3", startPos: 520, endPos: 650 },
  ],
  groundednessScore: 0.94,
  hallucinatedSpans: [],
  totalTokens: 156,
  responseTime: 1240,
}

export function EnterpriseRagDebugger() {
  const [selectedTrace, setSelectedTrace] = useState(traces[0])
  const [activeTab, setActiveTab] = useState("chunks")
  const [showSourceMap, setShowSourceMap] = useState(true)
  const [selectedChunk, setSelectedChunk] = useState(null)
  const [testCaseDialog, setTestCaseDialog] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "failing":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
            <XCircle className="h-3 w-3 mr-1" />
            Failing
          </Badge>
        )
      case "passing":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Passing
          </Badge>
        )
      case "unreviewed":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Unreviewed
          </Badge>
        )
      default:
        return null
    }
  }

  const getChunkFeedbackColor = (feedback) => {
    switch (feedback) {
      case "helpful":
        return "border-emerald-200 bg-emerald-50"
      case "outdated":
        return "border-red-200 bg-red-50"
      case "irrelevant":
        return "border-amber-200 bg-amber-50"
      default:
        return "border-slate-200 bg-white"
    }
  }

  const handleChunkFeedback = (chunkId, feedback) => {
    // In real app, this would update the chunk feedback
    console.log(`Chunk ${chunkId} feedback: ${feedback}`)
  }

  const handleSaveAsTestCase = () => {
    setTestCaseDialog(true)
  }

  const renderOutputWithSources = (content, sourceMap, showSources) => {
    if (!showSources) {
      return <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
    }

    let result = content
    sourceMap.forEach(({ span, chunkId }) => {
      const chunk = mockChunks.find((c) => c.id === chunkId)
      result = result.replace(
        span,
        `<span class="inline-flex items-center bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs font-medium cursor-pointer hover:bg-blue-200 transition-colors" title="${chunk?.source || "Unknown source"}">${span}</span>`,
      )
    })

    return <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: result }} />
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-900">Enterprise RAG Debugger</h1>
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center px-3 py-1"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              stripe-docs-retriever
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <GitCompare className="h-4 w-4 mr-1" />
              Compare Traces
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Trace List */}
          <div className="w-1/3 border-r border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Retriever Traces</h2>

              <div className="flex justify-between mb-4">
                <select className="text-sm border-0 bg-slate-50 rounded-md px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Statuses</option>
                  <option>Passing</option>
                  <option>Failing</option>
                  <option>Unreviewed</option>
                </select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search traces..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-md text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <select className="text-sm border-0 bg-slate-50 rounded-md px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Types</option>
                  <option>Single-step</option>
                  <option>Multi-hop</option>
                </select>
                <select className="text-sm border-0 bg-slate-50 rounded-md px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Sources</option>
                  <option>API Docs</option>
                  <option>Guides</option>
                </select>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {traces.map((trace) => (
                <div
                  key={trace.id}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedTrace.id === trace.id ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => setSelectedTrace(trace)}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm font-medium truncate max-w-[250px] text-slate-900">{trace.query}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{trace.query}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getStatusBadge(trace.status)}
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-mono">
                      {mockChunks.length} chunks
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono">
                      {trace.groundednessScore.toFixed(2)} grounded
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                    <span>{trace.retrievalLatency}ms</span>
                    <span>${trace.cost.toFixed(4)}</span>
                    <span>
                      {trace.retrievalSteps} step{trace.retrievalSteps > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Right Panel - Trace Details */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Pinned Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-900">Trace Details</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-mono">
                    {selectedTrace.id}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                    {new Date(selectedTrace.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-slate-700 font-medium mb-3">{selectedTrace.query}</p>
              <div className="flex items-center space-x-4 text-xs text-slate-600">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedTrace.retrievalLatency}ms
                </div>
                <div className="flex items-center">
                  <Zap className="h-3 w-3 mr-1" />${selectedTrace.cost.toFixed(4)}
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {(selectedTrace.groundednessScore * 100).toFixed(1)}% grounded
                </div>
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {mockChunks.length} chunks
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-6 bg-slate-50 p-1 mx-4 mt-4 rounded-lg">
                <TabsTrigger value="chunks" className="text-xs font-semibold">
                  🧱 Retrieved Chunks
                </TabsTrigger>
                <TabsTrigger value="output" className="text-xs font-semibold">
                  📤 Final Output
                </TabsTrigger>
                <TabsTrigger value="grounding" className="text-xs font-semibold">
                  🔗 Grounding Map
                </TabsTrigger>
                <TabsTrigger value="metrics" className="text-xs font-semibold">
                  📊 Metrics
                </TabsTrigger>
                <TabsTrigger value="diff" className="text-xs font-semibold">
                  🔄 Version Diff
                </TabsTrigger>
                <TabsTrigger value="test" className="text-xs font-semibold">
                  🧪 Test Case
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="chunks" className="h-full p-4">
                  <div className="space-y-3 h-full overflow-y-auto">
                    {mockChunks.map((chunk, index) => (
                      <Card
                        key={chunk.id}
                        className={`${getChunkFeedbackColor(chunk.feedback)} border transition-all hover:shadow-sm`}
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
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
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
                                  className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
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
                            </div>
                            <span>Updated {chunk.lastUpdated}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className={`text-xs ${chunk.feedback === "helpful" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-transparent"}`}
                                onClick={() => handleChunkFeedback(chunk.id, "helpful")}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Relevant
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`text-xs ${chunk.feedback === "irrelevant" ? "bg-red-50 text-red-700 border-red-200" : "bg-transparent"}`}
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
                </TabsContent>

                <TabsContent value="output" className="h-full p-4">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">Generated Response</h3>
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
                      </div>
                    </div>

                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        {renderOutputWithSources(mockOutput.content, mockOutput.sourceMap, showSourceMap)}
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border-slate-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Groundedness</span>
                            <span className="text-sm font-mono font-bold text-emerald-600">
                              {(mockOutput.groundednessScore * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={mockOutput.groundednessScore * 100} className="mt-2 h-1" />
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Response Time</span>
                            <span className="text-sm font-mono font-bold text-slate-900">
                              {mockOutput.responseTime}ms
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Tokens</span>
                            <span className="text-sm font-mono font-bold text-slate-900">{mockOutput.totalTokens}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="grounding" className="h-full p-4">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-900">Source Attribution Map</h3>

                    <div className="space-y-3">
                      {mockOutput.sourceMap.map((mapping, index) => (
                        <Card key={index} className="border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-mono mt-1"
                              >
                                {mapping.span}
                              </Badge>
                              <div className="flex-1">
                                <div className="text-sm text-slate-900 mb-2">
                                  {mockOutput.content.substring(mapping.startPos, mapping.endPos)}
                                </div>
                                <div className="text-xs text-slate-600">
                                  Maps to: {mockChunks.find((c) => c.id === mapping.chunkId)?.source}
                                </div>
                              </div>
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                <Eye className="h-3 w-3 mr-1" />
                                View Chunk
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {mockOutput.hallucinatedSpans.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center">
                          <Flag className="h-4 w-4 mr-2" />
                          Potential Hallucinations
                        </h4>
                        <div className="space-y-2">
                          {mockOutput.hallucinatedSpans.map((span, index) => (
                            <Card key={index} className="border-red-200 bg-red-50">
                              <CardContent className="p-3">
                                <p className="text-sm text-red-800">{span}</p>
                                <p className="text-xs text-red-600 mt-1">No source found for this claim</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="h-full p-4">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-900">Retrieval & Generation Metrics</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-slate-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Retrieval Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Latency</span>
                            <span className="text-sm font-mono font-bold">{selectedTrace.retrievalLatency}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Chunks Retrieved</span>
                            <span className="text-sm font-mono font-bold">{mockChunks.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Chunks Used</span>
                            <span className="text-sm font-mono font-bold">
                              {mockChunks.filter((c) => c.isUsed).length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Avg Relevance</span>
                            <span className="text-sm font-mono font-bold">
                              {(mockChunks.reduce((acc, c) => acc + c.relevanceScore, 0) / mockChunks.length).toFixed(
                                2,
                              )}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Generation Quality</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Groundedness</span>
                            <span className="text-sm font-mono font-bold text-emerald-600">
                              {(mockOutput.groundednessScore * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Response Time</span>
                            <span className="text-sm font-mono font-bold">{mockOutput.responseTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Total Tokens</span>
                            <span className="text-sm font-mono font-bold">{mockOutput.totalTokens}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-600">Cost</span>
                            <span className="text-sm font-mono font-bold">${selectedTrace.cost.toFixed(4)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-slate-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Quality Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Contradictory Chunks</span>
                            <Badge
                              variant="outline"
                              className={
                                mockChunks.some((c) => c.isContradictory)
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }
                            >
                              {mockChunks.filter((c) => c.isContradictory).length}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Hallucination Risk</span>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              Low
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Source Coverage</span>
                            <span className="text-sm font-mono font-bold">
                              {Math.round((mockChunks.filter((c) => c.isUsed).length / mockChunks.length) * 100)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="diff" className="h-full p-4">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">Version Comparison</h3>
                      <div className="flex items-center space-x-2">
                        <select className="text-xs border-0 bg-slate-50 rounded-md px-2 py-1 text-slate-700">
                          <option>Compare with v1.2</option>
                          <option>Compare with v1.1</option>
                          <option>Compare with v1.0</option>
                        </select>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          <GitCompare className="h-3 w-3 mr-1" />
                          Compare
                        </Button>
                      </div>
                    </div>

                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="text-center text-slate-500 py-8">
                          <GitCompare className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                          <p className="text-sm">Select a version to compare with current trace</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Compare retrieval results, output quality, and performance metrics
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="test" className="h-full p-4">
                  <div className="space-y-4 h-full overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">Test Case Management</h3>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        onClick={handleSaveAsTestCase}
                      >
                        <TestTube className="h-3 w-3 mr-1" />
                        Save as Test Case
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-slate-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Replay Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
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
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Test History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">v1.3 (current)</span>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pass
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">v1.2</span>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pass
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">v1.1</span>
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
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Evaluation Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-mono font-bold text-emerald-600">94%</div>
                            <div className="text-xs text-slate-600">Groundedness</div>
                          </div>
                          <div>
                            <div className="text-lg font-mono font-bold text-blue-600">87%</div>
                            <div className="text-xs text-slate-600">Relevance</div>
                          </div>
                          <div>
                            <div className="text-lg font-mono font-bold text-purple-600">92%</div>
                            <div className="text-xs text-slate-600">Completeness</div>
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

        {/* Save as Test Case Dialog */}
        <Dialog open={testCaseDialog} onOpenChange={setTestCaseDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Save as Test Case</DialogTitle>
              <DialogDescription>
                Create a regression test from this trace to monitor future performance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-name" className="text-right text-sm">
                  Name
                </Label>
                <Input id="test-name" defaultValue="SCA Requirements Test" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-description" className="text-right text-sm">
                  Description
                </Label>
                <Textarea
                  id="test-description"
                  defaultValue="Validates correct SCA requirements explanation for EU compliance"
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test-tags" className="text-right text-sm">
                  Tags
                </Label>
                <Input id="test-tags" defaultValue="sca, compliance, eu, stripe" className="col-span-3" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setTestCaseDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setTestCaseDialog(false)}>
                Save Test Case
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
