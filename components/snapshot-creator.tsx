"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Camera, GitBranch, Settings, FileText, Database, Bot, Network, CheckCircle2, AlertCircle, Clock, Tag, Code, Brain, Zap } from 'lucide-react'

export function SnapshotCreator() {
  const [snapshotName, setSnapshotName] = useState("")
  const [description, setDescription] = useState("")
  const [baseVersion, setBaseVersion] = useState("v3.2.1")
  const [snapshotType, setSnapshotType] = useState("full")
  const [includeTests, setIncludeTests] = useState(true)
  const [includeMetrics, setIncludeMetrics] = useState(true)
  const [tags, setTags] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateSnapshot = async () => {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
    }, 2000)
  }

  const componentTypes = [
    { id: "context-handlers", label: "Context Handlers", icon: Brain, included: true },
    { id: "code-generation", label: "Code Generation", icon: Code, included: true },
    { id: "memory-management", label: "Memory Management", icon: Database, included: true },
    { id: "performance-optimizers", label: "Performance Optimizers", icon: Zap, included: false },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Create Code Snapshot
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Capture the current state of your AI coding assistant configuration
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Current: {baseVersion}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="snapshot-name">Snapshot Name *</Label>
                <Input
                  id="snapshot-name"
                  placeholder="e.g., context-window-optimization-v3.2.1"
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="base-version">Base Version</Label>
                <Select value={baseVersion} onValueChange={setBaseVersion}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select base version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v3.2.1">v3.2.1 (Current)</SelectItem>
                    <SelectItem value="v3.2.0">v3.2.0</SelectItem>
                    <SelectItem value="v3.1.8">v3.1.8</SelectItem>
                    <SelectItem value="v3.1.7">v3.1.7</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="snapshot-type">Snapshot Type</Label>
                <Select value={snapshotType} onValueChange={setSnapshotType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select snapshot type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Snapshot</SelectItem>
                    <SelectItem value="config-only">Configuration Only</SelectItem>
                    <SelectItem value="context-only">Context Handling Only</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this snapshot captures and why it's important for your coding workflow..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="production, context-window, performance, typescript"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Component Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Components to Include
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {componentTypes.map((component) => (
                <Card key={component.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <component.icon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-sm">{component.label}</span>
                      </div>
                      <Switch checked={component.included} disabled={snapshotType === "full"} />
                    </div>

                    <div className="space-y-2 text-xs text-gray-500">
                      {component.id === "context-handlers" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>5 context processors</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>32k token window</span>
                          </div>
                        </>
                      )}

                      {component.id === "code-generation" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Multi-file generation</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>TypeScript inference</span>
                          </div>
                        </>
                      )}

                      {component.id === "memory-management" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Dynamic memory pools</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Leak detection</span>
                          </div>
                        </>
                      )}

                      {component.id === "performance-optimizers" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                            <span>Response caching</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                            <span>Batch processing</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Include Test Results</Label>
                    <p className="text-xs text-gray-500">Capture current test suite results and quality metrics</p>
                  </div>
                  <Switch checked={includeTests} onCheckedChange={setIncludeTests} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Include Performance Metrics</Label>
                    <p className="text-xs text-gray-500">Capture latency, accuracy, and quality metrics</p>
                  </div>
                  <Switch checked={includeMetrics} onCheckedChange={setIncludeMetrics} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Snapshot Preview
                  </h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div>• Estimated size: ~4.2 MB</div>
                    <div>• Components: {componentTypes.filter((c) => c.included).length}/4</div>
                    <div>• Tests included: {includeTests ? "Yes" : "No"}</div>
                    <div>• Metrics included: {includeMetrics ? "Yes" : "No"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>Snapshots are immutable and can be used for rollbacks</span>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline">Preview Changes</Button>
              <Button
                onClick={handleCreateSnapshot}
                disabled={!snapshotName || isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Creating Snapshot...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Create Snapshot
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Snapshots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Snapshots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "context-window-stable",
                version: "v3.2.0",
                created: "2 hours ago",
                size: "3.8 MB",
                tags: ["production", "stable", "context"],
              },
              {
                name: "multi-file-generation-beta",
                version: "v3.1.8",
                created: "1 day ago",
                size: "4.1 MB",
                tags: ["beta", "multi-file", "generation"],
              },
              {
                name: "typescript-inference-checkpoint",
                version: "v3.1.7",
                created: "3 days ago",
                size: "2.9 MB",
                tags: ["typescript", "inference", "checkpoint"],
              },
            ].map((snapshot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Camera className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-sm">{snapshot.name}</div>
                    <div className="text-xs text-gray-500">
                      Based on {snapshot.version} • {snapshot.created} • {snapshot.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {snapshot.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    <GitBranch className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
