"use client"

import type { ReactNode } from "react"
import { useApp } from "./app-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { GlobalSearch } from "./global-search"
import { Toaster } from "./ui-kit"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: ReactNode }) {
  const { collapsed } = useApp()
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "min-h-screen pt-14 transition-[padding] duration-200 ease-out",
          collapsed ? "pl-[60px]" : "pl-[240px]",
        )}
      >
        {children}
      </main>
      <GlobalSearch />
      <Toaster />
    </div>
  )
}
