import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <Header />
          <Sidebar />
          <main className="databricks-content">{children}</main>
        </div>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.app'
}
