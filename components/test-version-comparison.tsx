"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, ArrowDownUp, Search, Play, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// Mock version comparison data
const versionComparisonData = {
  versions: ["v2.3.4", "v2.3.3", "v2.3.2", "v2.3.1"],
  comparisons: [
    {
      id: "comp-1",
      baseVersion: "v2.3.3",
      targetVersion: "v2.3.4",
      totalTests: 42,
      improved: 8,
      regressed: 3,
      unchanged: 31,
      summary: {
        passRateChange: "+5.2%",
        latencyChange: "-12%",
        costChange: "+3%",
        hallucinationChange: "-45%",
      },
      tests: [
        {
          id: "test-1",
          name: "Financial Document Retrieval",
          baseStatus: "failed",
          targetStatus: "passed",
          change: "improvement",
          suite: "RAG Pipeline Core",
          baseMetrics: { latency: 1.8, cost: 0.067, hallucination: 0.12 },
          targetMetrics: { latency: 1.1, cost: 0.034, hallucination: 0.02 },
          lastRun: "2025-01-04T14:30:00Z",
        },
        {
          id: "test-2",
          name: "Risk Assessment Agent",
          baseStatus: "passed",
          targetStatus: "failed",
          change: "regression",
          suite: "Financial Agent Workflows",
          baseMetrics: { latency: 3.2, cost: 0.145, goalMatch: 0.94 },
          targetMetrics: { latency: 8.5, cost: 0.234, goalMatch: 0.0 },
          lastRun: "2025-01-04T13:45:00Z",
          regressionCause: "Tool call timeout - API latency increased",
        },
        {
          id: "test-3",
          name: "Empty Query Handling",
          baseStatus: "passed",
          targetStatus: "passed",
          change: "unchanged",
          suite: "RAG Pipeline Core",
          baseMetrics: { latency: 0.3, cost: 0.012, hallucination: 0.0 },
          targetMetrics: { latency: 0.3, cost: 0.012, hallucination: 0.0 },
          lastRun: "2025-01-04T14:30:00Z",
        },
        {
          id: "test-4",
          name: "Portfolio Analysis Workflow",
          baseStatus: "warning",
          targetStatus: "passed",
          change: "improvement",
          suite: "Financial Agent Workflows",
          baseMetrics: { latency: 5.1, cost: 0.189, goalMatch: 0.78 },
          targetMetrics: { latency: 4.2, cost: 0.156, goalMatch: 0.89 },
          lastRun: "2025-01-04T13:45:00Z",
        },
        {
          id: "test-5",
          name: "Cost Optimization Check",
          baseStatus: "passed",
          targetStatus: "warning",
          change: "regression",
          suite: "Cost Guardrails",
          baseMetrics: { latency: 0.7, cost: 0.025, tokenUsage: 450 },
          targetMetrics: { latency: 0.8, cost: 0.032, tokenUsage: 580 },
          lastRun: "2025-01-04T11:30:00Z",
          regressionCause: "Token usage increased by 29%",
        },
      ],
    },
  ],
}

export function TestVersionComparison() {
  const [baseVersion, setBaseVersion] = useState("v2.3.3")
  const [targetVersion, setTargetVersion] = useState("v2.3.4")
  const [filterType, setFilterType] = useState("all")
  const [selectedTest, setSelectedTest] = useState(null)
  const [isRunningComparison, setIsRunningComparison] = useState(false)

  // Find the comparison data for the selected versions
  const comparisonData =
    versionComparisonData.comparisons.find(
      (comp) => comp.baseVersion === baseVersion && comp.targetVersion === targetVersion,
    ) || versionComparisonData.comparisons[0]

  // Filter tests based on selected filter
  const filteredTests = comparisonData.tests.filter((test) => {
    if (filterType === "all") return true
    return test.change === filterType
  })

  const handleRunComparison = () => {
    setIsRunningComparison(true)
    setTimeout(() => {
      setIsRunningComparison(false)
    }, 3000)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getChangeIcon = (change) => {
    switch (change) {
      case "improvement":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Improved
          </Badge>
        )
      case "regression":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Regressed
          </Badge>
        )
      case "unchanged":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Unchanged
          </Badge>
        )
      default:
        return null
    }
  }

  const formatMetricChange = (base, target, unit = "") => {
    const change = ((target - base) / base) * 100
    const color = change > 0 ? "text-red-600" : "text-green-600"
    const sign = change > 0 ? "+" : ""
    return (
      <span className={color}>
        {sign}
        {change.toFixed(1)}%{unit}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Version Comparison</CardTitle>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Base:</span>
                <Select value={baseVersion} onValueChange={setBaseVersion}>
                  <SelectTrigger className="w-28">
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
                  <SelectTrigger className="w-28">
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

              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-8 w-8"
                onClick={() => {
                  const temp = baseVersion
                  setBaseVersion(targetVersion)
                  setTargetVersion(temp)
                }}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter changes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Changes</SelectItem>
                  <SelectItem value="improvement">Improvements</SelectItem>
                  <SelectItem value="regression">Regressions</SelectItem>
                  <SelectItem value="unchanged">Unchanged</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRunComparison} disabled={isRunningComparison}>
                <Play className="h-4 w-4 mr-2" />
                {isRunningComparison ? "Running..." : "Run Comparison"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-green-700 font-medium">Improved</div>
                  <div className="text-2xl font-bold text-green-700">{comparisonData.improved}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-red-700 font-medium">Regressed</div>
                  <div className="text-2xl font-bold text-red-700">{comparisonData.regressed}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-700 font-medium">Unchanged</div>
                  <div className="text-2xl font-bold text-gray-700">{comparisonData.unchanged}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-blue-700 font-medium">Total</div>
                  <div className="text-2xl font-bold text-blue-700">{comparisonData.totalTests}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Changes Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm">Key Changes Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Pass Rate:</span>
                  <div className="font-medium text-green-600">{comparisonData.summary.passRateChange}</div>
                </div>
                <div>
                  <span className="text-gray-600">Avg Latency:</span>
                  <div className="font-medium text-green-600">{comparisonData.summary.latencyChange}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total Cost:</span>
                  <div className="font-medium text-red-600">{comparisonData.summary.costChange}</div>
                </div>
                <div>
                  <span className="text-gray-600">Hallucination:</span>
                  <div className="font-medium text-green-600">{comparisonData.summary.hallucinationChange}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isRunningComparison && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Running comparison...</span>
                  <span className="text-sm text-gray-600">15/42 tests completed</span>
                </div>
                <Progress value={36} className="h-2" />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Test Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Test Results Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Suite</TableHead>
                  <TableHead>Base Status</TableHead>
                  <TableHead>Target Status</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Metrics Delta</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id} className={selectedTest === test.id ? "bg-blue-50" : ""}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {test.suite}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(test.baseStatus)}
                        <span className="capitalize text-sm">{test.baseStatus}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(test.targetStatus)}
                        <span className="capitalize text-sm">{test.targetStatus}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getChangeIcon(test.change)}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        {test.baseMetrics.latency && test.targetMetrics.latency && (
                          <div>Latency: {formatMetricChange(test.baseMetrics.latency, test.targetMetrics.latency)}</div>
                        )}
                        {test.baseMetrics.cost && test.targetMetrics.cost && (
                          <div>Cost: {formatMetricChange(test.baseMetrics.cost, test.targetMetrics.cost)}</div>
                        )}
                        {test.baseMetrics.hallucination !== undefined &&
                          test.targetMetrics.hallucination !== undefined && (
                            <div>
                              Hallucination:{" "}
                              {formatMetricChange(test.baseMetrics.hallucination, test.targetMetrics.hallucination)}
                            </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <GitBranch className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Detailed Test View */}
          {selectedTest && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">
                  Detailed Comparison: {filteredTests.find((t) => t.id === selectedTest)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const test = filteredTests.find((t) => t.id === selectedTest)
                  return (
                    <div className="space-y-4">
                      {test.regressionCause && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center space-x-2 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Regression Cause:</span>
                          </div>
                          <p className="text-sm text-red-600 mt-1">{test.regressionCause}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Base Version ({baseVersion})</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(test.baseStatus)}
                                <span className="capitalize">{test.baseStatus}</span>
                              </div>
                            </div>
                            {Object.entries(test.baseMetrics).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                                <span className="font-medium">
                                  {typeof value === "number"
                                    ? key.includes("cost")
                                      ? `$${value.toFixed(3)}`
                                      : key.includes("latency")
                                        ? `${value.toFixed(1)}s`
                                        : key.includes("Match") || key.includes("Score")
                                          ? `${(value * 100).toFixed(0)}%`
                                          : value.toString()
                                    : value}
                                </span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Target Version ({targetVersion})</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(test.targetStatus)}
                                <span className="capitalize">{test.targetStatus}</span>
                              </div>
                            </div>
                            {Object.entries(test.targetMetrics).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                                <span className="font-medium">
                                  {typeof value === "number"
                                    ? key.includes("cost")
                                      ? `$${value.toFixed(3)}`
                                      : key.includes("latency")
                                        ? `${value.toFixed(1)}s`
                                        : key.includes("Match") || key.includes("Score")
                                          ? `${(value * 100).toFixed(0)}%`
                                          : value.toString()
                                    : value}
                                </span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <GitBranch className="h-4 w-4 mr-1" />
                          Create Branch
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Replay Both
                        </Button>
                        {test.change === "regression" && (
                          <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Flag Regression
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
