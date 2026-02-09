"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, BrainCircuit, Copy, Edit, MoreHorizontal, Play, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AgentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const agents = [
    {
      id: "agent-1",
      name: "Customer Support Agent",
      description: "Handles customer inquiries and support tickets",
      model: "GPT-4o",
      status: "active",
      lastDeployed: "2 hours ago",
      version: "v2.1",
      type: "support",
    },
    {
      id: "agent-2",
      name: "Sales Assistant",
      description: "Assists with product recommendations and sales inquiries",
      model: "Claude 3 Opus",
      status: "active",
      lastDeployed: "1 day ago",
      version: "v1.5",
      type: "sales",
    },
    {
      id: "agent-3",
      name: "Data Processing Agent",
      description: "Processes and analyzes data from various sources",
      model: "GPT-4o",
      status: "inactive",
      lastDeployed: "5 days ago",
      version: "v1.2",
      type: "data",
    },
    {
      id: "agent-4",
      name: "Email Classification Agent",
      description: "Classifies and routes incoming emails",
      model: "Llama 3 70B",
      status: "active",
      lastDeployed: "3 days ago",
      version: "v2.0",
      type: "classification",
    },
    {
      id: "agent-5",
      name: "Content Generator",
      description: "Generates marketing and social media content",
      model: "Claude 3 Sonnet",
      status: "draft",
      lastDeployed: "Never",
      version: "v0.1",
      type: "content",
    },
    {
      id: "agent-6",
      name: "Knowledge Base Assistant",
      description: "Retrieves and provides information from knowledge base",
      model: "GPT-4o",
      status: "active",
      lastDeployed: "12 hours ago",
      version: "v1.8",
      type: "knowledge",
    },
  ]

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || agent.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            type="search"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border-gray-200"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-32 grid-cols-2">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-10 w-10 rounded-md flex items-center justify-center ${
                          agent.type === "support"
                            ? "bg-blue-100 text-blue-600"
                            : agent.type === "sales"
                              ? "bg-green-100 text-green-600"
                              : agent.type === "data"
                                ? "bg-purple-100 text-purple-600"
                                : agent.type === "classification"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : agent.type === "content"
                                    ? "bg-pink-100 text-pink-600"
                                    : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Bot size={20} />
                      </div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="h-4 w-4 mr-2" /> Deploy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2 h-10">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <BrainCircuit size={14} className="text-gray-500" />
                      <span>{agent.model}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        agent.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : agent.status === "inactive"
                            ? "bg-gray-50 text-gray-700 border-gray-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-gray-500 pt-2">
                  <div>Version: {agent.version}</div>
                  <div>Last deployed: {agent.lastDeployed}</div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="pt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm bg-gray-50 border-b">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Model</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Version</div>
              <div className="col-span-2">Last Deployed</div>
            </div>
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                <div className="col-span-4 flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-md flex items-center justify-center ${
                      agent.type === "support"
                        ? "bg-blue-100 text-blue-600"
                        : agent.type === "sales"
                          ? "bg-green-100 text-green-600"
                          : agent.type === "data"
                            ? "bg-purple-100 text-purple-600"
                            : agent.type === "classification"
                              ? "bg-yellow-100 text-yellow-600"
                              : agent.type === "content"
                                ? "bg-pink-100 text-pink-600"
                                : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Bot size={16} />
                  </div>
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.description}</div>
                  </div>
                </div>
                <div className="col-span-2 text-sm">{agent.model}</div>
                <div className="col-span-2">
                  <Badge
                    variant="outline"
                    className={
                      agent.status === "active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : agent.status === "inactive"
                          ? "bg-gray-50 text-gray-700 border-gray-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }
                  >
                    {agent.status}
                  </Badge>
                </div>
                <div className="col-span-2 text-sm">{agent.version}</div>
                <div className="col-span-2 text-sm">{agent.lastDeployed}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
