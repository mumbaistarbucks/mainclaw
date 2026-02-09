"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Plus, Minus, FileEdit, ArrowDownUp, CheckCircle2, XCircle, Code, Database, Brain, Zap } from 'lucide-react'

// Enhanced version comparison data with realistic Cursor development scenarios
const versionComparisonData = {
  versions: ["v3.2.1", "v3.2.0", "v3.1.8", "v3.1.7"],
  comparisons: {
    "v3.2.1-v3.2.0": {
      contextHandling: {
        promptTemplates: {
          added: [],
          removed: [],
          modified: [
            {
              name: "Long Context Processing",
              before: "Process code context up to 8k tokens with basic chunking strategy.",
              after: "Process code context up to 32k tokens with advanced hierarchical chunking and semantic grouping.",
              diff: "Process code context up to <span class='bg-green-200'>32k tokens with advanced hierarchical chunking and semantic grouping</span>.",
            },
          ],
        },
        memoryOptimizations: {
          added: [
            {
              id: "memory-pool-1",
              content: "Implemented dynamic memory pooling for long-running coding sessions to prevent memory leaks.",
              metadata: { module: "context_manager", performance_impact: "35% reduction in memory usage" },
            },
          ],
          removed: [
            {
              id: "memory-old-1",
              content: "Removed legacy context caching mechanism that caused memory bloat in extended sessions.",
              metadata: { module: "legacy_cache", reason: "replaced with new pooling system" },
            },
          ],
          modified: [],
        },
        tokenManagement: {
          before: {
            maxTokens: 8192,
            chunkingStrategy: "fixed",
            contextWindow: { sliding: false, overlap: 0 },
          },
          after: {
            maxTokens: 32768,
            chunkingStrategy: "semantic",
            contextWindow: { sliding: true, overlap: 512 },
          },
        },
      },
      codeGeneration: {
        capabilities: {
          added: [
            {
              name: "Cross-File Awareness",
              description: "AI can now understand relationships between multiple files in a project",
              parameters: { max_files: 20, relationship_depth: 3 },
              performance: { latency_impact: "+15%", accuracy_gain: "+25%" },
            },
          ],
          removed: [],
          modified: [],
          reordered: false,
        },
        qualityMetrics: {
          before: {
            accuracyScore: 0.91,
            contextRetention: 0.85,
            codeQuality: 0.89,
          },
          after: {
            accuracyScore: 0.94,
            contextRetention: 0.89,
            codeQuality: 0.92,
          },
        },
        executionSettings: {
          before: {
            temperature: 0.3,
            maxTokens: 2048,
            retries: 2,
          },
          after: {
            temperature: 0.25,
            maxTokens: 4096,
            retries: 3,
          },
        },
      },
      testResults: {
        improved: [
          {
            id: "test-4",
            name: "Long Context Code Completion",
            before: "failed",
            after: "passed",
          },
          {
            id: "test-5",
            name: "Multi-File Code Generation",
            before: "failed",
            after: "passed",
          },
        ],
        regressed: [],
      },
    },
  },
}

export function VersionComparison() {
  const [baseVersion, setBaseVersion] = useState("v3.2.0")
  const [targetVersion, setTargetVersion] = useState("v3.2.1")
  const [diffType, setDiffType] = useState("contextHandling")
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(true)

  const comparisonKey = `${targetVersion}-${baseVersion}`
  const comparisonData = versionComparisonData.comparisons[comparisonKey]

  const handleSwapVersions = () => {
    const temp = baseVersion
    setBaseVersion(targetVersion)
    setTargetVersion(temp)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">Version Comparison</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Compare behavioral changes between code versions</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Base:</span>
                <Select value={baseVersion} onValueChange={setBaseVersion}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versionComparisonData.versions.map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ArrowRight className="hidden sm:block h-4 w-4 text-gray-400" />

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Target:</span>
                <Select value={targetVersion} onValueChange={setTargetVersion}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versionComparisonData.versions.map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm" className="p-2 h-8 w-8 bg-transparent" onClick={handleSwapVersions}>
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-only-diffs"
                checked={showOnlyDiffs}
                onChange={(e) => setShowOnlyDiffs(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="show-only-diffs" className="text-sm font-medium">
                Show only differences
              </label>
            </div>

            <Select value={diffType} onValueChange={setDiffType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select diff type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contextHandling">Context Handling</SelectItem>
                <SelectItem value="codeGeneration">Code Generation</SelectItem>
                <SelectItem value="tests">Test Results</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {diffType === "contextHandling" && comparisonData && (
        <div className="space-y-6">
          {/* Context Processing Templates Diff */}
          {comparisonData.contextHandling.promptTemplates.modified.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Enhanced Context Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisonData.contextHandling.promptTemplates.modified.map((template, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium border-b">{template.name}</div>
                    <div className="grid grid-cols-2 divide-x">
                      <div className="p-4 bg-red-50">
                        <div className="text-xs text-gray-500 mb-2">Base ({baseVersion})</div>
                        <pre className="whitespace-pre-wrap text-sm">{template.before}</pre>
                      </div>
                      <div className="p-4 bg-green-50">
                        <div className="text-xs text-gray-500 mb-2">Target ({targetVersion})</div>
                        <pre
                          className="whitespace-pre-wrap text-sm"
                          dangerouslySetInnerHTML={{ __html: template.diff }}
                        ></pre>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Memory Optimizations Diff */}
          {(comparisonData.contextHandling.memoryOptimizations.added.length > 0 || 
            comparisonData.contextHandling.memoryOptimizations.removed.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-600" />
                  Memory Management Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {comparisonData.contextHandling.memoryOptimizations.added.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-green-600 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      New Memory Optimizations
                    </h4>
                    {comparisonData.contextHandling.memoryOptimizations.added.map((optimization, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 font-medium flex justify-between border-b">
                          <span>Optimization: {optimization.id}</span>
                          <span className="text-sm text-gray-500">
                            Module: {optimization.metadata.module}
                          </span>
                        </div>
                        <div className="p-4 bg-green-50">
                          <pre className="whitespace-pre-wrap text-sm">{optimization.content}</pre>
                          <div className="mt-2 text-xs text-green-700 font-medium">
                            Performance Impact: {optimization.metadata.performance_impact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {comparisonData.contextHandling.memoryOptimizations.removed.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-red-600 flex items-center">
                      <Minus className="h-4 w-4 mr-2" />
                      Removed Legacy Components
                    </h4>
                    {comparisonData.contextHandling.memoryOptimizations.removed.map((component, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 font-medium flex justify-between border-b">
                          <span>Component: {component.id}</span>
                          <span className="text-sm text-gray-500">
                            Module: {component.metadata.module}
                          </span>
                        </div>
                        <div className="p-4 bg-red-50">
                          <pre className="whitespace-pre-wrap text-sm">{component.content}</pre>
                          <div className="mt-2 text-xs text-red-700 font-medium">
                            Reason: {component.metadata.reason}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Token Management Config Diff */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Code className="h-5 w-5 mr-2 text-indigo-600" />
                Token Management Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium border-b">Configuration Parameters</div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4 bg-red-50">
                    <div className="text-xs text-gray-500 mb-2">Base ({baseVersion})</div>
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(comparisonData.contextHandling.tokenManagement.before, null, 2)}
                    </pre>
                  </div>
                  <div className="p-4 bg-green-50">
                    <div className="text-xs text-gray-500 mb-2">Target ({targetVersion})</div>
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(comparisonData.contextHandling.tokenManagement.after, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {diffType === "codeGeneration" && comparisonData && (
        <div className="space-y-6">
          {/* New Capabilities */}
          {comparisonData.codeGeneration.capabilities.added.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-green-600">
                  <Plus className="h-5 w-5 mr-2" />
                  New Code Generation Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisonData.codeGeneration.capabilities.added.map((capability, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium border-b">{capability.name}</div>
                    <div className="p-4 bg-green-50">
                      <div className="mb-3">
                        <span className="font-medium">Description:</span> {capability.description}
                      </div>
                      <div className="mb-3">
                        <span className="font-medium">Parameters:</span>
                        <pre className="whitespace-pre-wrap text-sm mt-1 bg-white p-2 rounded border">
                          {JSON.stringify(capability.parameters, null, 2)}
                        </pre>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-sm">Latency Impact:</span>
                          <div className="text-sm text-amber-600">{capability.performance.latency_impact}</div>
                        </div>
                        <div>
                          <span className="font-medium text-sm">Accuracy Gain:</span>
                          <div className="text-sm text-green-600">{capability.performance.accuracy_gain}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quality Metrics Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Zap className="h-5 w-5 mr-2 text-amber-600" />
                Quality Metrics Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium border-b">Performance Metrics</div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4 bg-red-50">
                    <div className="text-xs text-gray-500 mb-2">Base ({baseVersion})</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Accuracy Score:</span>
                        <span className="font-medium">{(comparisonData.codeGeneration.qualityMetrics.before.accuracyScore * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Context Retention:</span>
                        <span className="font-medium">{(comparisonData.codeGeneration.qualityMetrics.before.contextRetention * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Code Quality:</span>
                        <span className="font-medium">{(comparisonData.codeGeneration.qualityMetrics.before.codeQuality * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50">
                    <div className="text-xs text-gray-500 mb-2">Target ({targetVersion})</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Accuracy Score:</span>
                        <span className="font-medium text-green-700">{(comparisonData.codeGeneration.qualityMetrics.after.accuracyScore * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Context Retention:</span>
                        <span className="font-medium text-green-700">{(comparisonData.codeGeneration.qualityMetrics.after.contextRetention * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Code Quality:</span>
                        <span className="font-medium text-green-700">{(comparisonData.codeGeneration.qualityMetrics.after.codeQuality * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Settings Diff */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Execution Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium border-b">Configuration Parameters</div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4 bg-red-50">
                    <div className="text-xs text-gray-500 mb-2">Base ({baseVersion})</div>
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(comparisonData.codeGeneration.executionSettings.before, null, 2)}
                    </pre>
                  </div>
                  <div className="p-4 bg-green-50">
                    <div className="text-xs text-gray-500 mb-2">Target ({targetVersion})</div>
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(comparisonData.codeGeneration.executionSettings.after, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {diffType === "tests" && comparisonData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Improved Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center text-green-700">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Improved Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comparisonData.testResults.improved.length > 0 ? (
                <ul className="space-y-3">
                  {comparisonData.testResults.improved.map((test) => (
                    <li key={test.id} className="border rounded-lg p-3 bg-green-50">
                      <div className="font-medium">{test.name}</div>
                      <div className="flex items-center mt-2 text-sm">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mr-2">
                          {test.before}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-gray-400 mr-2" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {test.after}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 italic">No improved tests</div>
              )}
            </CardContent>
          </Card>

          {/* Regressed Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center text-red-700">
                <XCircle className="h-5 w-5 mr-2" />
                Regressed Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comparisonData.testResults.regressed.length > 0 ? (
                <ul className="space-y-3">
                  {comparisonData.testResults.regressed.map((test) => (
                    <li key={test.id} className="border rounded-lg p-3 bg-red-50">
                      <div className="font-medium">{test.name}</div>
                      <div className="flex items-center mt-2 text-sm">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                          {test.before}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-gray-400 mr-2" />
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {test.after}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 italic">No regressed tests - excellent!</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">Run All Tests on {targetVersion}</Button>
      </div>
    </div>
  )
}
