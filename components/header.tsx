"use client"

import { useState } from "react"
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react'

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="databricks-navbar">
      <div className="databricks-navbar-logo">
        <img 
          src="/red_s_logo.png" 
          alt="Logo" 
          width="40" 
          height="40" 
          className="object-contain"
        />
        <span className="ml-2 font-semibold">Splinter</span>
      </div>

      <div className="databricks-navbar-search">
        <Search className="h-4 w-4" />
        <input
          type="text"
          placeholder="Search agents, workflows, traces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="databricks-navbar-actions">
        <span className="text-xs text-gray-300">CTRL + P</span>
        <Bell className="h-5 w-5 text-gray-300" />
        <HelpCircle className="h-5 w-5 text-gray-300" />

        <div className="databricks-navbar-user">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-medium">
            AS
          </div>
          <ChevronDown className="h-4 w-4 text-gray-300" />
        </div>
      </div>
    </header>
  )
}
