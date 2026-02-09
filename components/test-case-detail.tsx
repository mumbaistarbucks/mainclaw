"use client"

import { useState } from "react"
import { X, CheckCircle2, XCircle, AlertCircle, ArrowUpRight, Clock, Tag, Play, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TestCaseDetail({ test, onClose }) {
  const [activeTab, setActiveTab] = useState("execution")
  const [selectedVersion, setSelectedVersion] = useState(test?.agentVersion || "v2.3.4")

  if (!test) return null

  const getStatusIcon = (status) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  // Mock execution trace data
  const executionTrace = [
    {
      id: "step-1",
      type: "input",
      content: test.input || "Query processing started",
      timestamp: "14:30:00.123",
      duration: "0.1s",
    },
    {
      id: "step-2",
      type: "retrieval",
      content: `Retrieved ${test.chunksRetrieved || 0} chunks from knowledge base`,
      timestamp: "14:30:00.234",
      duration: "0.3s",
      details: {
        chunksFound: test.chunksRetrieved || 0,
        relevantChunks: test.correctChunks || 0,
        sources: ["financial_reports.pdf", "risk_assessment.docx"],
      },
    },
    {
      id: "step-3",
      type: "reasoning",
      content: "Processing query with retrieved context",
      timestamp: "14:30:00.567",
      duration: "0.8s",
    },
    {
      id: "step-4",
      type: "output",
      content: test.actualOutput,
      timestamp: "14:30:01.123",
      duration: `${test.latency}s`,
    },
  ]

  const diagnostics = {
    performance: {
      totalLatency: test.latency,
      tokenUsage: Math.floor(Math.random() * 1000) + 500,
      cost: test.cost,
      cacheHits: Math.floor(Math.random() * 5),
    },
    grounding: {
      score: test.groundingScore,
      hallucinationRisk: test.hallucinationScore,
      citationAccuracy: 0.95,
      factualConsistency: 0.92,
    },
    quality: {
      relevanceScore: 0.89,
      completenessScore: 0.87,
      coherenceScore: 0.94,
    },
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">{test.name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(test.status)}
              <span className="capitalize font-medium">{test.status}</span>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {selectedVersion}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {test.workflow || "Test Case"}
            </Badge>
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last run: {new Date(test.lastRun).toLocaleString()}</span>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="execution" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Input</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded border text-sm">{test.input || "Empty query"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Expected Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded border text-sm">
                    {test.expectedContent || test.expectedOutput}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actual Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-3 rounded border text-sm ${
                    test.status === "passed"
                      ? "bg-green-50 border-green-200"
                      : test.status === "failed"
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  {test.actualOutput}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm">Execution Trace</CardTitle>
                  <Button variant="outline" size="sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Full Trace
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {executionTrace.map((step, index) => (
                    <div key={step.id} className="relative pl-8 pb-3">
                      {index < executionTrace.length - 1 && (
                        <div className="absolute left-3 top-4 bottom-0 w-0.5 bg-gray-200"></div>
                      )}
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-xs font-medium text-blue-500">
                        {index + 1}
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium capitalize text-blue-600">{step.type}</span>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{step.timestamp}</span>
                            <span>({step.duration})</span>
                          </div>
                        </div>
                        <div className="text-sm">{step.content}</div>
                        {step.details && (
                          <div className="mt-2 text-xs text-gray-600">
                            <div>
                              Chunks: {step.details.chunksFound} found, {step.details.relevantChunks} relevant
                            </div>
                            <div>Sources: {step.details.sources.join(", ")}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Latency:</span>
                    <span className="font-medium">{diagnostics.performance.totalLatency.toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Token Usage:</span>
                    <span className="font-medium">{diagnostics.performance.tokenUsage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost:</span>
                    <span className="font-medium">${diagnostics.performance.cost.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cache Hits:</span>
                    <span className="font-medium">{diagnostics.performance.cacheHits}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Grounding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Grounding Score:</span>
                    <span className="font-medium text-green-600">
                      {(diagnostics.grounding.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Hallucination Risk:</span>
                    <span
                      className={`font-medium ${
                        diagnostics.grounding.hallucinationRisk < 0.05 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(diagnostics.grounding.hallucinationRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Citation Accuracy:</span>
                    <span className="font-medium">{(diagnostics.grounding.citationAccuracy * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Factual Consistency:</span>
                    <span className="font-medium">{(diagnostics.grounding.factualConsistency * 100).toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relevance:</span>
                    <span className="font-medium">{(diagnostics.quality.relevanceScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completeness:</span>
                    <span className="font-medium">{(diagnostics.quality.completenessScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coherence:</span>
                    <span className="font-medium">{(diagnostics.quality.coherenceScore * 100).toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Version Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <GitBranch className="h-8 w-8 mx-auto mb-2" />
                  <p>Select another version to compare results</p>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger className="w-32 mx-auto mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v2.3.4">v2.3.4</SelectItem>
                      <SelectItem value="v2.3.3">v2.3.3</SelectItem>
                      <SelectItem value="v2.3.2">v2.3.2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Test Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Replay Test
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Open in Sandbox
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create Branch
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Regression Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {test.regressionCause && (
                    <>
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accept as Expected
                      </Button>
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        File Issue
                      </Button>
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Tag className="h-4 w-4 mr-2" />
                        Add Annotation
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
