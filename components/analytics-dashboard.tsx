"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="overview" className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248,592</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">12.5% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94.7%</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">2.3% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28.4M</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-yellow-500 mr-1" />
              <p className="text-xs text-yellow-500">18.2% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost per Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$0.0042</div>
            <div className="flex items-center mt-1">
              <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500">5.1% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>Total requests over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end gap-2 px-2">
              {[40, 55, 45, 60, 75, 65, 80, 85, 70, 90, 95, 85].map((value, index) => (
                <div key={index} className="relative flex-1 h-full">
                  <div className="absolute bottom-0 w-full bg-gray-100 rounded-t-sm" style={{ height: "100%" }}></div>
                  <div
                    className="absolute bottom-0 w-full bg-purple-500 rounded-t-sm"
                    style={{ height: `${value}%` }}
                  ></div>
                  <div className="absolute -bottom-6 w-full text-center text-xs">
                    {index === 0 ? "Jan" : index === 3 ? "Apr" : index === 6 ? "Jul" : index === 9 ? "Oct" : ""}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">Months</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Accuracy and response time by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Customer Support Agent", accuracy: 96.2, responseTime: 245 },
                { name: "Sales Assistant", accuracy: 94.8, responseTime: 210 },
                { name: "Data Processing Agent", accuracy: 92.5, responseTime: 320 },
                { name: "Email Classification Agent", accuracy: 97.1, responseTime: 180 },
                { name: "Content Generator", accuracy: 93.4, responseTime: 290 },
              ].map((agent) => (
                <div key={agent.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-sm text-gray-500">{agent.accuracy}% accuracy</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${agent.accuracy}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Response time: {agent.responseTime}ms</span>
                    <span>
                      {agent.accuracy > 95 ? "Excellent" : agent.accuracy > 90 ? "Good" : "Needs Improvement"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Breakdown</CardTitle>
          <CardDescription>Token usage by model and agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-4">By Model</h3>
              <div className="space-y-4">
                {[
                  { name: "GPT-4o", percentage: 45, tokens: "12.8M" },
                  { name: "Claude 3 Opus", percentage: 25, tokens: "7.1M" },
                  { name: "Llama 3 70B", percentage: 20, tokens: "5.7M" },
                  { name: "Claude 3 Sonnet", percentage: 10, tokens: "2.8M" },
                ].map((model) => (
                  <div key={model.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{model.name}</span>
                      <span className="text-sm text-gray-500">{model.tokens} tokens</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${model.percentage}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-500">{model.percentage}% of total usage</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">By Agent</h3>
              <div className="space-y-4">
                {[
                  { name: "Customer Support Agent", percentage: 35, tokens: "9.9M" },
                  { name: "Sales Assistant", percentage: 25, tokens: "7.1M" },
                  { name: "Content Generator", percentage: 20, tokens: "5.7M" },
                  { name: "Data Processing Agent", percentage: 12, tokens: "3.4M" },
                  { name: "Email Classification Agent", percentage: 8, tokens: "2.3M" },
                ].map((agent) => (
                  <div key={agent.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-sm text-gray-500">{agent.tokens} tokens</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${agent.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{agent.percentage}% of total usage</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
          <CardDescription>Monthly cost breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="col-span-2">
              <div className="h-[300px] flex items-end gap-2 px-2">
                {[
                  { model: 4200, inference: 2800, storage: 1200 },
                  { model: 4500, inference: 3000, storage: 1300 },
                  { model: 5100, inference: 3400, storage: 1400 },
                  { model: 5800, inference: 3900, storage: 1500 },
                  { model: 6200, inference: 4100, storage: 1600 },
                  { model: 6800, inference: 4500, storage: 1700 },
                ].map((month, index) => (
                  <div key={index} className="relative flex-1 h-full">
                    <div className="absolute bottom-0 w-full flex flex-col">
                      <div className="w-full bg-blue-500" style={{ height: `${(month.model / 10000) * 100}%` }}></div>
                      <div
                        className="w-full bg-purple-500"
                        style={{ height: `${(month.inference / 10000) * 100}%` }}
                      ></div>
                      <div className="w-full bg-gray-500" style={{ height: `${(month.storage / 10000) * 100}%` }}></div>
                    </div>
                    <div className="absolute -bottom-6 w-full text-center text-xs">
                      {index === 0
                        ? "Jan"
                        : index === 1
                          ? "Feb"
                          : index === 2
                            ? "Mar"
                            : index === 3
                              ? "Apr"
                              : index === 4
                                ? "May"
                                : "Jun"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-blue-500 rounded-sm"></div>
                  <span className="text-xs text-gray-500">Model Costs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-purple-500 rounded-sm"></div>
                  <span className="text-xs text-gray-500">Inference Costs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-500 rounded-sm"></div>
                  <span className="text-xs text-gray-500">Storage Costs</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Current Month Breakdown</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Model Costs</span>
                    <span className="text-sm font-medium">$6,800</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "52%" }}></div>
                  </div>
                  <div className="text-xs text-gray-500">52% of total costs</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inference Costs</span>
                    <span className="text-sm font-medium">$4,500</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <div className="text-xs text-gray-500">35% of total costs</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Costs</span>
                    <span className="text-sm font-medium">$1,700</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500 rounded-full" style={{ width: "13%" }}></div>
                  </div>
                  <div className="text-xs text-gray-500">13% of total costs</div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-bold">$13,000</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">+8.3% from last month</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
