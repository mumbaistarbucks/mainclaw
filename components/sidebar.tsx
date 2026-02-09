"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bot, Settings, Network, BookOpen, LayoutDashboard } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/agents", icon: Bot, label: "Agents" },
    { href: "/multi-agent", icon: Network, label: "Multi-Agent" },
    { href: "/agent-rules", icon: BookOpen, label: "Agent Rules" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="databricks-sidebar">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("databricks-sidebar-item", isActive ? "active" : "")}
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
          </Link>
        )
      })}
    </div>
  )
}
