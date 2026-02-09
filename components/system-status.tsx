import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"

export function SystemStatus() {
  const services = [
    { name: "Agent Runtime", status: "operational", uptime: "99.99%" },
    { name: "Workflow Engine", status: "operational", uptime: "99.95%" },
    { name: "Model Serving", status: "operational", uptime: "99.98%" },
    { name: "Database Cluster", status: "operational", uptime: "100%" },
    { name: "API Gateway", status: "degraded", uptime: "98.5%" },
    { name: "Monitoring", status: "operational", uptime: "99.97%" },
    { name: "Authentication", status: "operational", uptime: "99.99%" },
  ]

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div key={service.name} className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            {service.status === "operational" ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : service.status === "degraded" ? (
              <AlertTriangle size={16} className="text-yellow-500" />
            ) : (
              <AlertCircle size={16} className="text-red-500" />
            )}
            <span className="text-sm">{service.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{service.uptime}</span>
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
              {service.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
