"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AgentMetrics() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real implementation, this would use a charting library like Chart.js or Recharts
    // to render performance metrics
  }, [])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="response-time">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="response-time">Response Time</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="response-time" className="pt-4">
          <div ref={chartRef} className="h-[200px] w-full">
            <div className="flex h-full items-end gap-2 px-2">
              <div className="relative h-[70%] w-8 bg-gray-100 rounded-t-md">
                <div className="absolute bottom-0 w-full h-[60%] bg-blue-500 rounded-t-md"></div>
                <div className="absolute -bottom-6 w-full text-center text-xs">Mon</div>
              </div>
              <div className="relative h-[70%] w-8 bg-gray-100 rounded-t-md">
                <div className="absolute bottom-0 w-full h-[75%] bg-blue-500 rounded-t-md"></div>
                <div className="absolute -bottom-6 w-full text-center text-xs">Tue</div>
              </div>
              <div className="relative h-[70%] w-8 bg-gray-100 rounded-t-md">
                <div className="absolute bottom-0 w-full h-[40%] bg-blue-500 rounded-t-md"></div>
                <div className="absolute -bottom-6 w-full text-center text-xs">Wed</div>
              </div>
              <div className="relative h-[70%] w-8 bg-gray-100 rounded-t-md">
                <div className="absolute bottom-0 w-full h-[85%] bg-blue-500 rounded-t-md"></div>
                <div className="absolute -bottom-6 w-full text-center text-xs">Thu</div>
              </div>
              <div className="relative h-[70%] w-8 bg-gray-100 rounded-t-md">
                <div className="absolute bottom-0 w-full h-[65%] bg-blue-500 rounded-t-md"></div>
                <div className="absolute -bottom-6 w-full text-center text-xs">Fri</div>
              </div>
              <div className="relative h-[70%] w-8 bg-gray-100 rounded-t-md">
                <div className="absolute bottom-0 w-full h-[30%] bg-blue-500 rounded-t-md"></div>
                <div className="absolute -bottom-6 w-full text-center text-xs">Sat</div>
              </div>
              <div className="relative h-[70%] w-8 bg-gray-100 rounded-t-md">
                <div className="absolute bottom-0 w-full h-[50%] bg-blue-500 rounded-t-md"></div>
                <div className="absolute -bottom-6 w-full text-center text-xs">Sun</div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-gray-500">Avg. Response Time</div>
                <div className="text-2xl font-bold">245ms</div>
                <div className="text-xs text-green-500">↓ 12% from last week</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-gray-500">Peak Response Time</div>
                <div className="text-2xl font-bold">780ms</div>
                <div className="text-xs text-red-500">↑ 5% from last week</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-gray-500">P95 Response Time</div>
                <div className="text-2xl font-bold">512ms</div>
                <div className="text-xs text-green-500">↓ 8% from last week</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
