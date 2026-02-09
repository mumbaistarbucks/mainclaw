"use client"

import { useState } from "react"
import {
  Check,
  AlertTriangle,
  Clock,
  FileText,
  Play,
  RefreshCw,
  Save,
  FileCode,
  BarChart2,
  Briefcase,
  Building,
  Users,
  Database,
  Shield,
  FileSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Custom scrollbar styles
const scrollbarStyles = `
  .thin-scrollbar::-webkit-scrollbar {
    height: 4px;
  }
  .thin-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .thin-scrollbar::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  .thin-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
`

// Enterprise-focused trace examples
const enterpriseTraces = [
  {
    id: "trace-001",
    query: "Summarize the Q2 financial report for the executive team",
    timestamp: "2025-05-12T09:23:45",
    status: "failing",
    agent: "Financial-Insights-Agent",
    department: "Finance",
    workflow: "Executive-Reporting",
    retrievalTime: 1.2,
    generationTime: 3.5,
    tokenUsage: 2450,
    cost: 0.12,
    accuracyScore: 0.68,
    chunks: [
      { id: "chunk-001", content: "Q2 revenue increased by 15% YoY to $125M", relevance: 0.92, enabled: true },
      {
        id: "chunk-002",
        content: "Operating expenses decreased by 3% due to automation initiatives",
        relevance: 0.88,
        enabled: true,
      },
      { id: "chunk-003", content: "Historical data on Q1 2024 performance metrics", relevance: 0.45, enabled: false },
      { id: "chunk-004", content: "Competitor analysis from 2023 annual report", relevance: 0.32, enabled: false },
    ],
    hallucinations: [
      { text: "EBITDA margin of 28%", actual: "EBITDA margin of 24%", severity: "high" },
      { text: "R&D spending increased by 12%", actual: "R&D spending increased by 8%", severity: "medium" },
    ],
    complianceIssues: [
      { type: "Financial disclosure", description: "Missing forward-looking statement disclaimer", severity: "high" },
    ],
  },
  {
    id: "trace-002",
    query: "Generate a compliance report for our new product launch",
    timestamp: "2025-05-11T14:12:30",
    status: "fixed",
    agent: "Compliance-Verification-Agent",
    department: "Legal",
    workflow: "Product-Compliance",
    retrievalTime: 2.3,
    generationTime: 4.1,
    tokenUsage: 3120,
    cost: 0.18,
    accuracyScore: 0.91,
    chunks: [
      {
        id: "chunk-005",
        content: "Product safety certification requirements for EU market",
        relevance: 0.95,
        enabled: true,
      },
      {
        id: "chunk-006",
        content: "GDPR compliance checklist for data collection features",
        relevance: 0.93,
        enabled: true,
      },
      { id: "chunk-007", content: "Internal compliance policy document v3.2", relevance: 0.87, enabled: true },
      { id: "chunk-008", content: "Outdated regulatory information from 2022", relevance: 0.41, enabled: false },
    ],
    hallucinations: [],
    complianceIssues: [],
  },
  {
    id: "trace-003",
    query: "Analyze customer feedback for the enterprise dashboard",
    timestamp: "2025-05-10T11:45:22",
    status: "passing",
    agent: "Customer-Insights-Agent",
    department: "Product",
    workflow: "Feedback-Analysis",
    retrievalTime: 1.8,
    generationTime: 2.9,
    tokenUsage: 2780,
    cost: 0.15,
    accuracyScore: 0.89,
    chunks: [
      {
        id: "chunk-009",
        content: "Survey responses from enterprise clients (April 2025)",
        relevance: 0.96,
        enabled: true,
      },
      { id: "chunk-010", content: "Feature request log from support tickets", relevance: 0.92, enabled: true },
      { id: "chunk-011", content: "User testing session notes from UI redesign", relevance: 0.85, enabled: true },
      { id: "chunk-012", content: "Competitor feature comparison", relevance: 0.78, enabled: true },
    ],
    hallucinations: [],
    complianceIssues: [],
  },
  {
    id: "trace-004",
    query: "Draft a security assessment for the new data integration workflow",
    timestamp: "2025-05-09T15:33:10",
    status: "unreviewed",
    agent: "Security-Assessment-Agent",
    department: "IT Security",
    workflow: "Security-Review",
    retrievalTime: 2.5,
    generationTime: 5.2,
    tokenUsage: 4350,
    cost: 0.24,
    accuracyScore: 0.82,
    chunks: [
      { id: "chunk-013", content: "Internal security protocols for data handling", relevance: 0.97, enabled: true },
      { id: "chunk-014", content: "Vulnerability assessment from previous audit", relevance: 0.91, enabled: true },
      { id: "chunk-015", content: "Industry security standards for financial data", relevance: 0.88, enabled: true },
      { id: "chunk-016", content: "Encryption requirements for PII", relevance: 0.86, enabled: true },
    ],
    hallucinations: [
      {
        text: "SOC 2 Type II certification completed",
        actual: "SOC 2 Type II certification in progress",
        severity: "medium",
      },
    ],
    complianceIssues: [
      { type: "Data retention", description: "Unclear data retention policy specification", severity: "medium" },
    ],
  },
  {
    id: "trace-005",
    query: "Create a training plan for the sales team on our new enterprise solution",
    timestamp: "2025-05-08T10:15:40",
    status: "failing",
    agent: "Training-Development-Agent",
    department: "Sales",
    workflow: "Training-Material-Generation",
    retrievalTime: 1.9,
    generationTime: 4.7,
    tokenUsage: 3850,
    cost: 0.21,
    accuracyScore: 0.71,
    chunks: [
      {
        id: "chunk-017",
        content: "Product feature documentation for enterprise solution",
        relevance: 0.94,
        enabled: true,
      },
      { id: "chunk-018", content: "Competitive analysis for enterprise market", relevance: 0.89, enabled: true },
      { id: "chunk-019", content: "Previous sales training materials", relevance: 0.82, enabled: true },
      { id: "chunk-020", content: "Customer success stories from similar deployments", relevance: 0.79, enabled: true },
    ],
    hallucinations: [
      {
        text: "Integration with SAP systems is fully automated",
        actual: "Integration with SAP requires configuration",
        severity: "high",
      },
      {
        text: "24/7 premium support included in all tiers",
        actual: "24/7 support only in Enterprise tier",
        severity: "high",
      },
    ],
    complianceIssues: [],
  },
  {
    id: "trace-006",
    query: "Analyze supply chain risks for Q3 manufacturing plan",
    timestamp: "2025-05-07T14:22:18",
    status: "fixed",
    agent: "Risk-Analysis-Agent",
    department: "Operations",
    workflow: "Supply-Chain-Risk-Assessment",
    retrievalTime: 2.7,
    generationTime: 3.8,
    tokenUsage: 3250,
    cost: 0.19,
    accuracyScore: 0.93,
    chunks: [
      { id: "chunk-021", content: "Supplier reliability metrics from past 12 months", relevance: 0.96, enabled: true },
      { id: "chunk-022", content: "Global logistics disruption reports", relevance: 0.92, enabled: true },
      { id: "chunk-023", content: "Material cost forecasts for Q3", relevance: 0.9, enabled: true },
      { id: "chunk-024", content: "Alternative supplier assessment", relevance: 0.87, enabled: true },
    ],
    hallucinations: [],
    complianceIssues: [],
  },
  {
    id: "trace-007",
    query: "Generate a market expansion strategy for the APAC region",
    timestamp: "2025-05-06T09:45:33",
    status: "unreviewed",
    agent: "Strategy-Development-Agent",
    department: "Business Development",
    workflow: "Market-Strategy",
    retrievalTime: 3.1,
    generationTime: 6.2,
    tokenUsage: 5120,
    cost: 0.28,
    accuracyScore: 0.85,
    chunks: [
      { id: "chunk-025", content: "APAC market analysis from research firm", relevance: 0.95, enabled: true },
      { id: "chunk-026", content: "Competitor presence in APAC markets", relevance: 0.93, enabled: true },
      {
        id: "chunk-027",
        content: "Regulatory requirements for different APAC countries",
        relevance: 0.91,
        enabled: true,
      },
      { id: "chunk-028", content: "Previous expansion attempts case studies", relevance: 0.88, enabled: true },
    ],
    hallucinations: [
      {
        text: "40% market share potential in Singapore",
        actual: "15-20% market share potential in Singapore",
        severity: "medium",
      },
    ],
    complianceIssues: [
      {
        type: "Local regulations",
        description: "Missing details on data localization requirements",
        severity: "medium",
      },
    ],
  },
  {
    id: "trace-008",
    query: "Create a technical specification for the new API integration with SAP",
    timestamp: "2025-05-05T13:10:25",
    status: "passing",
    agent: "Technical-Documentation-Agent",
    department: "Engineering",
    workflow: "Technical-Specification",
    retrievalTime: 1.5,
    generationTime: 4.3,
    tokenUsage: 3680,
    cost: 0.2,
    accuracyScore: 0.94,
    chunks: [
      { id: "chunk-029", content: "SAP API documentation", relevance: 0.98, enabled: true },
      { id: "chunk-030", content: "Internal API design standards", relevance: 0.95, enabled: true },
      { id: "chunk-031", content: "Authentication protocols for enterprise systems", relevance: 0.92, enabled: true },
      { id: "chunk-032", content: "Previous integration case studies", relevance: 0.85, enabled: true },
    ],
    hallucinations: [],
    complianceIssues: [],
  },
  {
    id: "trace-009",
    query: "Analyze the impact of new privacy regulations on our data processing workflows",
    timestamp: "2025-05-04T11:20:15",
    status: "failing",
    agent: "Legal-Compliance-Agent",
    department: "Legal",
    workflow: "Regulatory-Impact-Analysis",
    retrievalTime: 2.8,
    generationTime: 5.5,
    tokenUsage: 4750,
    cost: 0.26,
    accuracyScore: 0.73,
    chunks: [
      { id: "chunk-033", content: "New privacy regulation full text", relevance: 0.97, enabled: true },
      { id: "chunk-034", content: "Current data processing workflow documentation", relevance: 0.94, enabled: true },
      { id: "chunk-035", content: "Legal interpretation from external counsel", relevance: 0.91, enabled: true },
      { id: "chunk-036", content: "Implementation timeline requirements", relevance: 0.89, enabled: true },
    ],
    hallucinations: [
      {
        text: "Grace period of 12 months for compliance",
        actual: "Grace period of 6 months for compliance",
        severity: "high",
      },
      { text: "Exemption for B2B data processing", actual: "No exemption for B2B data processing", severity: "high" },
      { text: "Maximum fine of 2% annual revenue", actual: "Maximum fine of 4% annual revenue", severity: "high" },
    ],
    complianceIssues: [
      {
        type: "Regulatory compliance",
        description: "Incorrect interpretation of key compliance requirements",
        severity: "high",
      },
    ],
  },
  {
    id: "trace-010",
    query: "Develop an employee onboarding workflow for the IT department",
    timestamp: "2025-05-03T14:05:50",
    status: "fixed",
    agent: "HR-Process-Agent",
    department: "Human Resources",
    workflow: "Onboarding-Process",
    retrievalTime: 1.7,
    generationTime: 3.9,
    tokenUsage: 3150,
    cost: 0.17,
    accuracyScore: 0.92,
    chunks: [
      { id: "chunk-037", content: "Current IT onboarding procedures", relevance: 0.96, enabled: true },
      { id: "chunk-038", content: "Security access protocols for new employees", relevance: 0.94, enabled: true },
      { id: "chunk-039", content: "Required training modules for IT staff", relevance: 0.91, enabled: true },
      { id: "chunk-040", content: "Equipment provisioning process", relevance: 0.89, enabled: true },
    ],
    hallucinations: [],
    complianceIssues: [],
  },
]

export function EnterpriseWorkflowDebugger() {
  const [selectedTrace, setSelectedTrace] = useState(enterpriseTraces[0])
  const [activeTab, setActiveTab] = useState("traces")
  const [showPostEditDialog, setShowPostEditDialog] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [isReplaying, setIsReplaying] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterWorkflow, setFilterWorkflow] = useState("all")

  // Get unique departments and workflows for filters
  const departments = [...new Set(enterpriseTraces.map((trace) => trace.department))]
  const workflows = [...new Set(enterpriseTraces.map((trace) => trace.workflow))]

  const filteredTraces = enterpriseTraces.filter((trace) => {
    const statusMatch = filterStatus === "all" || trace.status === filterStatus
    const departmentMatch = filterDepartment === "all" || trace.department === filterDepartment
    const workflowMatch = filterWorkflow === "all" || trace.workflow === filterWorkflow
    return statusMatch && departmentMatch && workflowMatch
  })

  const toggleChunk = (chunkId) => {
    setSelectedTrace((prev) => ({
      ...prev,
      chunks: prev.chunks.map((chunk) => (chunk.id === chunkId ? { ...chunk, enabled: !chunk.enabled } : chunk)),
    }))
  }

  const handleEditContent = (chunkId, newContent) => {
    setSelectedTrace((prev) => ({
      ...prev,
      chunks: prev.chunks.map((chunk) => (chunk.id === chunkId ? { ...chunk, content: newContent } : chunk)),
    }))
    setEditedContent(newContent)
  }

  const handleReplay = () => {
    setIsReplaying(true)
    // Simulate replay process
    setTimeout(() => {
      setIsReplaying(false)
      setShowPostEditDialog(true)
    }, 2000)
  }

  const handleSaveTestCase = () => {
    // Logic to save as test case
    setShowPostEditDialog(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "failing":
        return "text-red-500"
      case "fixed":
        return "text-green-500"
      case "passing":
        return "text-green-500"
      case "unreviewed":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "failing":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "fixed":
        return <Check className="h-4 w-4 text-green-500" />
      case "passing":
        return <Check className="h-4 w-4 text-green-500" />
      case "unreviewed":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      <style jsx>{`${scrollbarStyles}`}</style>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-semibold">Enterprise Workflow Debugger</h1>
          <Badge variant="outline" className="ml-2 bg-blue-50">
            Connected to enterprise-knowledge-base
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterWorkflow} onValueChange={setFilterWorkflow}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Workflow" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              {workflows.map((workflow) => (
                <SelectItem key={workflow} value={workflow}>
                  {workflow}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="failing">Failing</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="passing">Passing</SelectItem>
              <SelectItem value="unreviewed">Unreviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
            <h2 className="font-medium">Execution Traces</h2>
            <Badge variant="outline" className="text-xs">
              {filteredTraces.length} traces
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            {filteredTraces.map((trace) => (
              <div
                key={trace.id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedTrace.id === trace.id ? "bg-blue-50" : ""}`}
                onClick={() => setSelectedTrace(trace)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(trace.status)}
                    <span className={`font-medium ${getStatusColor(trace.status)}`}>
                      {trace.status.charAt(0).toUpperCase() + trace.status.slice(1)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {trace.department}
                  </Badge>
                </div>
                <div className="overflow-x-auto thin-scrollbar">
                  <p className="text-sm font-medium whitespace-nowrap pr-4">{trace.query}</p>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                  <span>{new Date(trace.timestamp).toLocaleString()}</span>
                  <span>{trace.agent}</span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedTrace && (
            <>
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">{selectedTrace.query}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {selectedTrace.department}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      <FileText className="h-3 w-3 mr-1" />
                      {selectedTrace.workflow}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="font-medium">{selectedTrace.agent}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{new Date(selectedTrace.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="px-4 pt-2 bg-white border-b">
                  <TabsTrigger value="traces">Trace Details</TabsTrigger>
                  <TabsTrigger value="chunks">Knowledge Chunks</TabsTrigger>
                  <TabsTrigger value="hallucinations">Hallucinations</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance Issues</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="traces" className="flex-1 p-4 overflow-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Execution Trace</CardTitle>
                      <CardDescription>Detailed information about this workflow execution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Query</h3>
                          <div className="p-3 bg-gray-50 rounded-md">{selectedTrace.query}</div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Agent</h3>
                          <div className="p-3 bg-gray-50 rounded-md flex items-center">
                            <Users className="h-4 w-4 mr-2 text-blue-600" />
                            {selectedTrace.agent}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Department</h3>
                          <div className="p-3 bg-gray-50 rounded-md flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                            {selectedTrace.department}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Workflow</h3>
                          <div className="p-3 bg-gray-50 rounded-md flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            {selectedTrace.workflow}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Status</h3>
                          <div
                            className={`p-3 rounded-md flex items-center ${
                              selectedTrace.status === "failing"
                                ? "bg-red-50"
                                : selectedTrace.status === "fixed" || selectedTrace.status === "passing"
                                  ? "bg-green-50"
                                  : "bg-yellow-50"
                            }`}
                          >
                            {getStatusIcon(selectedTrace.status)}
                            <span className="ml-2">
                              {selectedTrace.status.charAt(0).toUpperCase() + selectedTrace.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Export Trace</Button>
                      <Button onClick={handleReplay} disabled={isReplaying}>
                        {isReplaying ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Replaying...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Replay Execution
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="chunks" className="flex-1 p-4 overflow-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Knowledge Chunks</CardTitle>
                      <CardDescription>Enterprise knowledge base chunks retrieved for this query</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedTrace.chunks.map((chunk) => (
                          <div key={chunk.id} className="border rounded-md overflow-hidden">
                            <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                              <div className="flex items-center">
                                <Database className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="font-medium">{chunk.id}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  <span className="text-sm mr-2">Relevance:</span>
                                  <Badge
                                    variant={chunk.relevance > 0.8 ? "default" : "outline"}
                                    className={chunk.relevance > 0.8 ? "bg-green-100 text-green-800" : ""}
                                  >
                                    {(chunk.relevance * 100).toFixed(0)}%
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">Enabled:</span>
                                  <Switch checked={chunk.enabled} onCheckedChange={() => toggleChunk(chunk.id)} />
                                </div>
                              </div>
                            </div>
                            <div className={`p-3 ${!chunk.enabled ? "opacity-50" : ""}`}>
                              <Textarea
                                value={chunk.content}
                                onChange={(e) => handleEditContent(chunk.id, e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="mr-2">
                        <FileSearch className="h-4 w-4 mr-2" />
                        Search Knowledge Base
                      </Button>
                      <Button>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Chunks
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="hallucinations" className="flex-1 p-4 overflow-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detected Hallucinations</CardTitle>
                      <CardDescription>Inaccuracies detected in the generated content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedTrace.hallucinations.length > 0 ? (
                        <div className="space-y-4">
                          {selectedTrace.hallucinations.map((hallucination, index) => (
                            <div
                              key={index}
                              className={`border rounded-md overflow-hidden ${
                                hallucination.severity === "high"
                                  ? "border-red-300"
                                  : hallucination.severity === "medium"
                                    ? "border-yellow-300"
                                    : "border-blue-300"
                              }`}
                            >
                              <div
                                className={`p-3 ${
                                  hallucination.severity === "high"
                                    ? "bg-red-50"
                                    : hallucination.severity === "medium"
                                      ? "bg-yellow-50"
                                      : "bg-blue-50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">Hallucination</span>
                                  <Badge
                                    variant={
                                      hallucination.severity === "high"
                                        ? "destructive"
                                        : hallucination.severity === "medium"
                                          ? "default"
                                          : "outline"
                                    }
                                  >
                                    {hallucination.severity.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <div className="p-3 space-y-2">
                                <div>
                                  <span className="text-sm font-medium text-red-600">Generated text:</span>
                                  <p className="p-2 bg-red-50 rounded mt-1">{hallucination.text}</p>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-green-600">Actual fact:</span>
                                  <p className="p-2 bg-green-50 rounded mt-1">{hallucination.actual}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Check className="h-12 w-12 text-green-500 mb-4" />
                          <h3 className="text-lg font-medium">No Hallucinations Detected</h3>
                          <p className="text-gray-500 mt-2">
                            This execution trace doesn't contain any detected hallucinations.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="flex-1 p-4 overflow-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance Issues</CardTitle>
                      <CardDescription>Regulatory and policy compliance concerns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedTrace.complianceIssues.length > 0 ? (
                        <div className="space-y-4">
                          {selectedTrace.complianceIssues.map((issue, index) => (
                            <div
                              key={index}
                              className={`border rounded-md overflow-hidden ${
                                issue.severity === "high"
                                  ? "border-red-300"
                                  : issue.severity === "medium"
                                    ? "border-yellow-300"
                                    : "border-blue-300"
                              }`}
                            >
                              <div
                                className={`p-3 ${
                                  issue.severity === "high"
                                    ? "bg-red-50"
                                    : issue.severity === "medium"
                                      ? "bg-yellow-50"
                                      : "bg-blue-50"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                                    <span className="font-medium">{issue.type}</span>
                                  </div>
                                  <Badge
                                    variant={
                                      issue.severity === "high"
                                        ? "destructive"
                                        : issue.severity === "medium"
                                          ? "default"
                                          : "outline"
                                    }
                                  >
                                    {issue.severity.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <div className="p-3">
                                <p>{issue.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <Check className="h-12 w-12 text-green-500 mb-4" />
                          <h3 className="text-lg font-medium">No Compliance Issues</h3>
                          <p className="text-gray-500 mt-2">
                            This execution trace is compliant with all regulatory and policy requirements.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metrics" className="flex-1 p-4 overflow-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Execution and performance statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <div className="text-sm text-gray-500 mb-1">Retrieval Time</div>
                          <div className="text-2xl font-semibold">{selectedTrace.retrievalTime.toFixed(1)}s</div>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="text-sm text-gray-500 mb-1">Generation Time</div>
                          <div className="text-2xl font-semibold">{selectedTrace.generationTime.toFixed(1)}s</div>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="text-sm text-gray-500 mb-1">Token Usage</div>
                          <div className="text-2xl font-semibold">{selectedTrace.tokenUsage.toLocaleString()}</div>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="text-sm text-gray-500 mb-1">Cost</div>
                          <div className="text-2xl font-semibold">${selectedTrace.cost.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="mt-6 border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">Accuracy Score</div>
                          <div
                            className={`text-sm font-medium ${
                              selectedTrace.accuracyScore > 0.9
                                ? "text-green-600"
                                : selectedTrace.accuracyScore > 0.8
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {(selectedTrace.accuracyScore * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              selectedTrace.accuracyScore > 0.9
                                ? "bg-green-600"
                                : selectedTrace.accuracyScore > 0.8
                                  ? "bg-yellow-500"
                                  : "bg-red-600"
                            }`}
                            style={{ width: `${selectedTrace.accuracyScore * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Chunk Relevance Distribution</h3>
                        <div className="space-y-2">
                          {selectedTrace.chunks.map((chunk) => (
                            <div key={chunk.id} className="flex items-center">
                              <div className="w-1/4 text-sm truncate">{chunk.id}</div>
                              <div className="w-3/4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      chunk.relevance > 0.9
                                        ? "bg-green-600"
                                        : chunk.relevance > 0.7
                                          ? "bg-blue-600"
                                          : chunk.relevance > 0.5
                                            ? "bg-yellow-500"
                                            : "bg-gray-400"
                                    }`}
                                    style={{ width: `${chunk.relevance * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="w-16 text-right text-sm">{(chunk.relevance * 100).toFixed(0)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      <Dialog open={showPostEditDialog} onOpenChange={setShowPostEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Improvements Applied</DialogTitle>
            <DialogDescription>Your changes have been applied and the execution has been replayed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <div className="flex items-center text-green-700 font-medium mb-2">
                <Check className="h-4 w-4 mr-2" />
                Accuracy Improved
              </div>
              <p className="text-sm text-gray-700">
                Accuracy score improved from 68% to 92% by correcting financial data and removing irrelevant chunks.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center text-blue-700 font-medium mb-2">
                <BarChart2 className="h-4 w-4 mr-2" />
                Performance Impact
              </div>
              <p className="text-sm text-gray-700">Generation time reduced by 0.8s and token usage reduced by 15%.</p>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowPostEditDialog(false)}>
                Close
              </Button>
              <Button variant="outline" size="sm">
                <FileCode className="h-4 w-4 mr-2" />
                Export Fix
              </Button>
            </div>
            <Button onClick={handleSaveTestCase}>
              <Save className="h-4 w-4 mr-2" />
              Save as Test Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
