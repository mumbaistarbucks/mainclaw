"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Database, FileText, Github, MessageSquare, MoreHorizontal, Settings, Sliders, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function IntegrationsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const integrations = [
    {
      id: "int-1",
      name: "OpenAI",
      description: "Connect to OpenAI models for agent capabilities",
      category: "llm",
      status: "connected",
      icon: <MessageSquare className="h-6 w-6" />,
      lastUsed: "2 hours ago",
    },
    {
      id: "int-2",
      name: "Anthropic",
      description: "Connect to Claude models for agent capabilities",
      category: "llm",
      status: "connected",
      icon: <MessageSquare className="h-6 w-6" />,
      lastUsed: "1 day ago",
    },
    {
      id: "int-3",
      name: "PostgreSQL",
      description: "Database for storing agent data and configurations",
      category: "database",
      status: "connected",
      icon: <Database className="h-6 w-6" />,
      lastUsed: "Just now",
    },
    {
      id: "int-4",
      name: "MongoDB",
      description: "NoSQL database for flexible data storage",
      category: "database",
      status: "disconnected",
      icon: <Database className="h-6 w-6" />,
      lastUsed: "Never",
    },
    {
      id: "int-5",
      name: "GitHub",
      description: "Source control and CI/CD integration",
      category: "devops",
      status: "connected",
      icon: <Github className="h-6 w-6" />,
      lastUsed: "3 hours ago",
    },
    {
      id: "int-6",
      name: "Slack",
      description: "Notifications and agent interactions via Slack",
      category: "communication",
      status: "connected",
      icon: <MessageSquare className="h-6 w-6" />,
      lastUsed: "5 hours ago",
    },
    {
      id: "int-7",
      name: "Elasticsearch",
      description: "Search and analytics for agent data",
      category: "analytics",
      status: "connected",
      icon: <FileText className="h-6 w-6" />,
      lastUsed: "2 days ago",
    },
    {
      id: "int-8",
      name: "Prometheus",
      description: "Monitoring and alerting for agent performance",
      category: "monitoring",
      status: "disconnected",
      icon: <Sliders className="h-6 w-6" />,
      lastUsed: "Never",
    },
  ]

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || integration.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            type="search"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-gray-200"
          />
        </div>
        <Tabs value={filterCategory} onValueChange={setFilterCategory} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="llm">LLM</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="devops">DevOps</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-md flex items-center justify-center ${
                      integration.category === "llm"
                        ? "bg-purple-100 text-purple-600"
                        : integration.category === "database"
                          ? "bg-blue-100 text-blue-600"
                          : integration.category === "devops"
                            ? "bg-gray-100 text-gray-600"
                            : integration.category === "communication"
                              ? "bg-green-100 text-green-600"
                              : integration.category === "analytics"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                    }`}
                  >
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{integration.description}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" /> Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" /> View Logs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      integration.status === "connected"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    {integration.status}
                  </Badge>
                  <span className="text-xs text-gray-500">Last used: {integration.lastUsed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`toggle-${integration.id}`} className="sr-only">
                    Toggle
                  </Label>
                  <Switch id={`toggle-${integration.id}`} checked={integration.status === "connected"} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
