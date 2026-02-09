"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Shield, AlertTriangle, CheckCircle, Code, Database, Lock, Eye, Plus, Edit, Trash2, Search, Filter, MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type RuleCategory = "safety" | "behavior" | "data" | "security" | "communication"

interface AgentRule {
  id: string
  name: string
  description: string
  category: RuleCategory
  priority: "critical" | "high" | "medium" | "low"
  enabled: boolean
  examples: string[]
  violations: number
}

export function AgentRules() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | "all">("all")
  const [showAddRuleModal, setShowAddRuleModal] = useState(false)
  const [editingRule, setEditingRule] = useState<AgentRule | null>(null)
  const [expandedRules, setExpandedRules] = useState<string[]>([])
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    category: "safety" as RuleCategory,
    priority: "medium" as const,
    examples: [""],
  })

  const [rules, setRules] = useState<AgentRule[]>([
    {
      id: "rule-1",
      name: "Code Freeze Compliance",
      description: "Agents must never modify production data during active code freeze periods. All database write operations must be blocked.",
      category: "safety",
      priority: "critical",
      enabled: true,
      examples: [
        "Blocking INSERT/UPDATE/DELETE during freeze",
        "Allowing only SELECT queries",
        "Rejecting schema modifications",
      ],
      violations: 5,
    },
    {
      id: "rule-2",
      name: "No Data Deletion Without Backup",
      description: "Agents cannot execute DROP TABLE, TRUNCATE, or DELETE operations without first creating a verified backup.",
      category: "data",
      priority: "critical",
      enabled: true,
      examples: [
        "Requiring backup before DROP TABLE",
        "Verifying backup integrity",
        "Logging all deletion attempts",
      ],
      violations: 2,
    },
    {
      id: "rule-3",
      name: "Transparent Communication",
      description: "Agents must never conceal errors or failures. All issues must be reported honestly to users.",
      category: "communication",
      priority: "high",
      enabled: true,
      examples: [
        "Reporting all errors immediately",
        "Not hiding failed operations",
        "Providing clear error messages",
      ],
      violations: 3,
    },
    {
      id: "rule-4",
      name: "Read-Only Mode Enforcement",
      description: "When read-only mode is specified, agents must not attempt to bypass restrictions or use alternative methods to write data.",
      category: "safety",
      priority: "critical",
      enabled: true,
      examples: [
        "Respecting read-only flags",
        "Not attempting workarounds",
        "Failing gracefully when writes are blocked",
      ],
      violations: 4,
    },
    {
      id: "rule-5",
      name: "Safety Check Bypass Prevention",
      description: "Agents cannot disable or bypass safety monitoring systems. All safety checks must remain active.",
      category: "security",
      priority: "critical",
      enabled: true,
      examples: [
        "Preventing safety system disabling",
        "Monitoring bypass attempts",
        "Alerting on safety violations",
      ],
      violations: 1,
    },
    {
      id: "rule-6",
      name: "User Intent Respect",
      description: "Agents must respect explicit user instructions and not override them with their own assumptions.",
      category: "behavior",
      priority: "high",
      enabled: true,
      examples: [
        "Following explicit \"do not modify\" instructions",
        "Respecting user preferences",
        "Asking for clarification when uncertain",
      ],
      violations: 6,
    },
    {
      id: "rule-7",
      name: "Transaction Rollback on Error",
      description: "All database transactions must be rolled back if any step fails. Partial commits are not allowed.",
      category: "data",
      priority: "high",
      enabled: true,
      examples: [
        "Rolling back on any error",
        "Using transaction boundaries",
        "Preventing partial data corruption",
      ],
      violations: 0,
    },
    {
      id: "rule-8",
      name: "Resource Usage Limits",
      description: "Agents must respect CPU, memory, and API rate limits. Excessive resource usage must be prevented.",
      category: "safety",
      priority: "medium",
      enabled: true,
      examples: [
        "Monitoring resource consumption",
        "Throttling API calls",
        "Preventing infinite loops",
      ],
      violations: 0,
    },
  ])

  const filteredRules = rules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || rule.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalViolations = rules.reduce((sum, rule) => sum + rule.violations, 0)
  const enabledRules = rules.filter((r) => r.enabled).length
  const criticalRules = rules.filter((r) => r.priority === "critical").length

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map((rule) =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const toggleExpandRule = (ruleId: string) => {
    if (expandedRules.includes(ruleId)) {
      setExpandedRules(expandedRules.filter((id) => id !== ruleId))
    } else {
      setExpandedRules([...expandedRules, ruleId])
    }
  }

  const handleSaveRule = () => {
    if (editingRule) {
      setRules(rules.map((rule) =>
        rule.id === editingRule.id
          ? {
              ...rule,
              name: newRule.name,
              description: newRule.description,
              category: newRule.category,
              priority: newRule.priority,
              examples: newRule.examples.filter((e) => e.trim() !== ""),
            }
          : rule
      ))
      setEditingRule(null)
    } else {
      const rule: AgentRule = {
        id: `rule-${Date.now()}`,
        name: newRule.name,
        description: newRule.description,
        category: newRule.category,
        priority: newRule.priority,
        enabled: true,
        examples: newRule.examples.filter((e) => e.trim() !== ""),
        violations: 0,
      }
      setRules([...rules, rule])
    }
    setShowAddRuleModal(false)
    setNewRule({
      name: "",
      description: "",
      category: "safety",
      priority: "medium",
      examples: [""],
    })
  }

  const handleEditRule = (rule: AgentRule) => {
    setEditingRule(rule)
    setNewRule({
      name: rule.name,
      description: rule.description,
      category: rule.category,
      priority: rule.priority,
      examples: rule.examples.length > 0 ? rule.examples : [""],
    })
    setShowAddRuleModal(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  const getCategoryIcon = (category: RuleCategory) => {
    switch (category) {
      case "safety":
        return Shield
      case "security":
        return Lock
      case "data":
        return Database
      case "communication":
        return Eye
      case "behavior":
        return Code
      default:
        return BookOpen
    }
  }

  const getCategoryColor = (category: RuleCategory) => {
    switch (category) {
      case "safety":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "security":
        return "bg-red-100 text-red-800 border-red-200"
      case "data":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "communication":
        return "bg-green-100 text-green-800 border-green-200"
      case "behavior":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-2">
      {/* Compact Header Bar */}
      <div className="flex items-center gap-3 p-2 border rounded-md bg-white">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8"
            />
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as RuleCategory | "all")}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="behavior">Behavior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedRules(filteredRules.map((r) => r.id))}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedRules([])}
          >
            Collapse All
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingRule(null)
              setNewRule({
                name: "",
                description: "",
                category: "safety",
                priority: "medium",
                examples: [""],
              })
              setShowAddRuleModal(true)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 p-2 border rounded-md bg-gray-50 text-sm">
        <div className="flex items-center gap-1">
          <BookOpen className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{rules.length}</span>
          <span className="text-gray-600">Total Rules</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="font-medium">{enabledRules}</span>
          <span className="text-gray-600">Active</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="font-medium">{totalViolations}</span>
          <span className="text-gray-600">Violations</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1">
          <Shield className="h-4 w-4 text-red-600" />
          <span className="font-medium">{criticalRules}</span>
          <span className="text-gray-600">Critical</span>
        </div>
      </div>

      {/* Main Rules List */}
      <Card className="w-full">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Agent Rules
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  {filteredRules.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Rules that agents must follow during execution
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-t">
            {filteredRules.map((rule) => {
              const CategoryIcon = getCategoryIcon(rule.category)
              const isExpanded = expandedRules.includes(rule.id)
              return (
                <Collapsible
                  key={rule.id}
                  open={isExpanded}
                  onOpenChange={() => toggleExpandRule(rule.id)}
                  className={`border-b ${!rule.enabled ? "bg-gray-50 opacity-60" : ""}`}
                >
                  <div className="flex items-center p-3 gap-3">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>

                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(rule.category)}`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{rule.name}</span>
                          <Badge className={getCategoryColor(rule.category)} variant="outline">
                            {rule.category}
                          </Badge>
                          <Badge className={getPriorityColor(rule.priority)} variant="outline">
                            {rule.priority}
                          </Badge>
                          {rule.violations > 0 && (
                            <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">
                              {rule.violations} violation{rule.violations !== 1 ? "s" : ""}
                            </Badge>
                          )}
                          {!rule.enabled && (
                            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{rule.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`toggle-${rule.id}`} className="text-xs cursor-pointer">
                          {rule.enabled ? "Enabled" : "Disabled"}
                        </Label>
                        <Switch
                          id={`toggle-${rule.id}`}
                          checked={rule.enabled}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Rule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="px-3 pb-3 pl-11">
                      <div className="bg-gray-50 rounded-md p-3 space-y-2">
                        <div className="text-xs font-medium text-gray-700 mb-2">Description</div>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                        {rule.examples.length > 0 && (
                          <>
                            <Separator className="my-2" />
                            <div className="text-xs font-medium text-gray-700 mb-2">Examples</div>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {rule.examples.map((example, idx) => (
                                <li key={idx}>{example}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>

          {filteredRules.length === 0 && (
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No rules found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Rule Modal */}
      <Dialog open={showAddRuleModal} onOpenChange={setShowAddRuleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit Rule" : "Add New Rule"}</DialogTitle>
            <DialogDescription>
              {editingRule ? "Update the rule details below." : "Define a new rule that agents must follow."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Code Freeze Compliance"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="rule-description">Description</Label>
              <Textarea
                id="rule-description"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="Describe what this rule enforces..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-category">Category</Label>
                <Select
                  value={newRule.category}
                  onValueChange={(value) => setNewRule({ ...newRule, category: value as RuleCategory })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="behavior">Behavior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rule-priority">Priority</Label>
                <Select
                  value={newRule.priority}
                  onValueChange={(value) => setNewRule({ ...newRule, priority: value as any })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Examples</Label>
              <div className="space-y-2 mt-1">
                {newRule.examples.map((example, idx) => (
                  <Input
                    key={idx}
                    value={example}
                    onChange={(e) => {
                      const newExamples = [...newRule.examples]
                      newExamples[idx] = e.target.value
                      setNewRule({ ...newRule, examples: newExamples })
                    }}
                    placeholder={`Example ${idx + 1}`}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewRule({ ...newRule, examples: [...newRule.examples, ""] })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Example
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRuleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule} disabled={!newRule.name || !newRule.description}>
              {editingRule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
