"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle, Clock, Download } from "lucide-react"

export function MonitoringDashboard() {
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="overview" className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99.98%</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">0.1% from last week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">245ms</div>
            <div className="flex items-center mt-1">
              <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">12% from last week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.42%</div>
            <div className="flex items-center mt-1">
              <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">0.1% from last week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18/24</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">2 more than yesterday</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average response time across all agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end gap-2 px-2">
              {[60, 75, 40, 85, 65, 30, 50, 70, 90, 45, 80, 55].map((value, index) => (
                <div key={index} className="relative flex-1 h-full">
                  <div className="absolute bottom-0 w-full bg-gray-100 rounded-t-sm" style={{ height: "100%" }}></div>
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm"
                    style={{ height: `${value}%` }}
                  ></div>
                  <div className="absolute -bottom-6 w-full text-center text-xs">
                    {index === 0 ? "12 AM" : index === 6 ? "6 AM" : index === 11 ? "12 PM" : ""}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">Time (hours)</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>Percentage of failed requests over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] relative">
              <div className="absolute inset-0 flex items-end">
                <div className="w-full h-[30%] bg-red-100 rounded-t-sm"></div>
              </div>
              <div className="absolute inset-0 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M0,100 L0,80 C10,78 15,85 20,82 C25,79 30,75 35,72 C40,69 45,68 50,70 C55,72 60,75 65,73 C70,71 75,65 80,68 C85,71 90,75 95,73 L100,70 L100,100 Z"
                    fill="rgba(248, 113, 113, 0.2)"
                    stroke="rgb(248, 113, 113)"
                    strokeWidth="1"
                  ></path>
                </svg>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-8 flex justify-between text-xs text-gray-500 px-2">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>12 AM</span>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">Time (hours)</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
          <CardDescription>Current status of all services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Agent Runtime", status: "operational", uptime: "99.99%", responseTime: "120ms" },
              { name: "Workflow Engine", status: "operational", uptime: "99.95%", responseTime: "145ms" },
              { name: "Model Serving", status: "operational", uptime: "99.98%", responseTime: "210ms" },
              { name: "Database Cluster", status: "operational", uptime: "100%", responseTime: "85ms" },
              { name: "API Gateway", status: "degraded", uptime: "98.5%", responseTime: "320ms" },
              { name: "Monitoring", status: "operational", uptime: "99.97%", responseTime: "95ms" },
              { name: "Authentication", status: "operational", uptime: "99.99%", responseTime: "110ms" },
              { name: "Storage Service", status: "incident", uptime: "95.2%", responseTime: "450ms" },
              { name: "Logging Service", status: "operational", uptime: "99.95%", responseTime: "130ms" },
            ].map((service) => (
              <div key={service.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{service.name}</h3>
                  <Badge
                    variant="outline"
                    className={
                      service.status === "operational"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : service.status === "degraded"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {service.status === "operational" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : service.status === "degraded" ? (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {service.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">Uptime</div>
                    <div>{service.uptime}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Response</div>
                    <div>{service.responseTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Issues detected in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "inc-1",
                title: "Storage Service Degradation",
                status: "investigating",
                time: "Started 35 minutes ago",
                description:
                  "We're investigating issues with the storage service causing slow file access and occasional timeouts.",
              },
              {
                id: "inc-2",
                title: "API Gateway Latency",
                status: "identified",
                time: "Started 2 hours ago",
                description:
                  "We've identified the cause of increased latency in the API Gateway and are implementing a fix.",
              },
              {
                id: "inc-3",
                title: "Database Connection Issues",
                status: "resolved",
                time: "Resolved 1 day ago",
                description: "The database connection issues have been resolved. All systems are operating normally.",
              },
            ].map((incident) => (
              <div key={incident.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{incident.title}</h3>
                  <Badge
                    variant="outline"
                    className={
                      incident.status === "resolved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : incident.status === "identified"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {incident.status === "resolved" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : incident.status === "identified" ? (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {incident.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mb-2">{incident.time}</div>
                <div className="text-sm">{incident.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
