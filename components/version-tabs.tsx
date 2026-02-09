"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BehavioralVersionControl } from "@/components/behavioral-version-control"
import { VersionComparison } from "@/components/version-comparison"
import { VersionHistory } from "@/components/version-history"
import { SnapshotCreator } from "@/components/snapshot-creator"

export function VersionTabs() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
          >
            Version Overview
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
          >
            Compare Versions
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
          >
            Version History
          </TabsTrigger>
          <TabsTrigger
            value="snapshots"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
          >
            Create Snapshot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <BehavioralVersionControl />
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <VersionComparison />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <VersionHistory />
        </TabsContent>

        <TabsContent value="snapshots" className="mt-6">
          <SnapshotCreator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
