"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Bell, Key, Lock, Save, User, Settings, Shield, Database, Mail, Users, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export function SettingsForm() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
    }
  }

  return (
    <div className="space-y-2">
      {/* Compact Header Bar */}
      <div className="flex items-center gap-3 p-2 border rounded-md bg-white">
        <div className="flex items-center gap-2 flex-1">
          <Settings className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Settings</span>
        </div>
        <Button size="sm" className="h-8">
          <Save className="h-4 w-4 mr-1" />
          Save All Changes
        </Button>
      </div>

      {/* Main Settings Card */}
      <Card className="w-full">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Settings
              </CardTitle>
              <CardDescription>
                Manage your account, security, and platform preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-t">
            {/* Account Information */}
            <Collapsible
              open={expandedSections.includes("account")}
              onOpenChange={() => toggleSection("account")}
              className="border-b"
            >
              <div className="flex items-center p-3 gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {expandedSections.includes("account") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-800">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Account Information</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Manage your personal account details</p>
                  </div>
                </div>
              </div>
              <CollapsibleContent>
                <div className="px-3 pb-3 pl-11">
                  <div className="bg-gray-50 rounded-md p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-medium text-gray-700">Name</Label>
                        <Input id="name" defaultValue="Alex Morgan" className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-medium text-gray-700">Email</Label>
                        <Input id="email" type="email" defaultValue="alex.morgan@example.com" className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="company" className="text-xs font-medium text-gray-700">Company</Label>
                        <Input id="company" defaultValue="Acme Inc." className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="role" className="text-xs font-medium text-gray-700">Role</Label>
                        <Input id="role" defaultValue="Lead Engineer" className="h-8 text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Password */}
            <Collapsible
              open={expandedSections.includes("password")}
              onOpenChange={() => toggleSection("password")}
              className="border-b"
            >
              <div className="flex items-center p-3 gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {expandedSections.includes("password") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-800">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Password</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Update your account password</p>
                  </div>
                </div>
              </div>
              <CollapsibleContent>
                <div className="px-3 pb-3 pl-11">
                  <div className="bg-gray-50 rounded-md p-3 space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password" className="text-xs font-medium text-gray-700">Current Password</Label>
                      <Input id="current-password" type="password" className="h-8 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="new-password" className="text-xs font-medium text-gray-700">New Password</Label>
                        <Input id="new-password" type="password" className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="confirm-password" className="text-xs font-medium text-gray-700">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" className="h-8 text-sm" />
                      </div>
                    </div>
                    <Button className="h-8 text-sm">
                      <Lock className="h-3 w-3 mr-1" />
                      Update Password
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* API Keys */}
            <Collapsible
              open={expandedSections.includes("api")}
              onOpenChange={() => toggleSection("api")}
              className="border-b"
            >
              <div className="flex items-center p-3 gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {expandedSections.includes("api") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 text-purple-800">
                    <Key className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">API Keys</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">2 Active</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Manage your API keys and usage</p>
                  </div>
                </div>
              </div>
              <CollapsibleContent>
                <div className="px-3 pb-3 pl-11">
                  <div className="bg-gray-50 rounded-md p-3 space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-sm">Important</AlertTitle>
                      <AlertDescription className="text-xs">
                        API keys provide full access to your account. Keep them secure and never share them in public repositories or client-side code.
                      </AlertDescription>
                    </Alert>
                    {[
                      {
                        name: "Production Key",
                        key: "sk_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
                        status: "Active",
                        created: "May 1, 2023",
                        lastUsed: "2 hours ago",
                      },
                      {
                        name: "Development Key",
                        key: "sk_dev_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3h2g1f0e",
                        status: "Active",
                        created: "April 15, 2023",
                        lastUsed: "1 day ago",
                      },
                    ].map((apiKey, idx) => (
                      <div key={idx} className="space-y-2 p-2 border rounded-md bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{apiKey.name}</div>
                            <div className="text-xs text-gray-600">Created {apiKey.created} • Last used {apiKey.lastUsed}</div>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type={apiKeyVisible && idx === 0 ? "text" : "password"}
                            value={apiKey.key}
                            readOnly
                            className="h-8 font-mono text-xs"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setApiKeyVisible(!apiKeyVisible)}
                          >
                            {apiKeyVisible && idx === 0 ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Regenerate
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button size="sm" className="h-8 text-sm w-full">
                      <Key className="h-3 w-3 mr-1" />
                      Create New API Key
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* API Usage */}
            <Collapsible
              open={expandedSections.includes("api-usage")}
              onOpenChange={() => toggleSection("api-usage")}
              className="border-b"
            >
              <div className="flex items-center p-3 gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {expandedSections.includes("api-usage") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-800">
                    <Database className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">API Usage</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Monitor your API usage and rate limits</p>
                  </div>
                </div>
              </div>
              <CollapsibleContent>
                <div className="px-3 pb-3 pl-11">
                  <div className="bg-gray-50 rounded-md p-3 space-y-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Rate Limit</span>
                        <span className="text-gray-600">1000 requests / minute</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Current Usage</span>
                        <span className="text-gray-600">342 requests / minute</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "34.2%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Email Notifications */}
            <Collapsible
              open={expandedSections.includes("email")}
              onOpenChange={() => toggleSection("email")}
              className="border-b"
            >
              <div className="flex items-center p-3 gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {expandedSections.includes("email") ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-800">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Email Notifications</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Configure email notification preferences</p>
                  </div>
                </div>
              </div>
              <CollapsibleContent>
                <div className="px-3 pb-3 pl-11">
                  <div className="bg-gray-50 rounded-md p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="cursor-pointer text-sm font-medium">Deployment Status</Label>
                          <div className="text-xs text-gray-600">Receive emails when deployments succeed or fail</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="cursor-pointer text-sm font-medium">System Alerts</Label>
                          <div className="text-xs text-gray-600">Receive emails for critical system alerts</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="cursor-pointer text-sm font-medium">Usage Reports</Label>
                          <div className="text-xs text-gray-600">Receive weekly usage and performance reports</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="cursor-pointer text-sm font-medium">Product Updates</Label>
                          <div className="text-xs text-gray-600">Receive emails about new features and updates</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
