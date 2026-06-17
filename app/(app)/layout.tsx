"use client"

import type { ReactNode } from "react"
import { AppProvider } from "@/components/app-context"
import { AppShell } from "@/components/app-shell"

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  )
}
