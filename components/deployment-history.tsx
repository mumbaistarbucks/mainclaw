import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

export function DeploymentHistory() {
  const deployments = [
    {
      id: "dep-123",
      name: "Customer Support Agent v2.1",
      status: "success",
      time: "10 minutes ago",
      environment: "production",
    },
    {
      id: "dep-122",
      name: "Sales Assistant Agent",
      status: "success",
      time: "1 hour ago",
      environment: "staging",
    },
    {
      id: "dep-121",
      name: "Data Processing Pipeline",
      status: "failed",
      time: "3 hours ago",
      environment: "development",
    },
    {
      id: "dep-120",
      name: "Email Classification Workflow",
      status: "running",
      time: "4 hours ago",
      environment: "staging",
    },
    {
      id: "dep-119",
      name: "Customer Support Agent v2.0",
      status: "success",
      time: "1 day ago",
      environment: "production",
    },
  ]

  return (
    <div className="space-y-4">
      {deployments.map((deployment) => (
        <div key={deployment.id} className="flex items-center justify-between py-2">
          <div className="flex items-start gap-3">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                deployment.status === "success"
                  ? "bg-green-100 text-green-600"
                  : deployment.status === "failed"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {deployment.status === "success" ? (
                <CheckCircle2 size={16} />
              ) : deployment.status === "failed" ? (
                <XCircle size={16} />
              ) : (
                <Clock size={16} />
              )}
            </div>
            <div>
              <div className="font-medium text-sm">{deployment.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{deployment.time}</div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              deployment.environment === "production"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : deployment.environment === "staging"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
            }
          >
            {deployment.environment}
          </Badge>
        </div>
      ))}
    </div>
  )
}
