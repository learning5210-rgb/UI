"use client"

import { cn } from "@/lib/utils"

export function WorkspaceTabsLocal({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Q&A Workbooks", value: "workbooks" },
    { label: "Inputs", value: "inputs" },
  ]
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((t) => {
        const active = value === t.value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative -mb-px px-4 py-2.5 text-[14px] font-medium transition-fast",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {active && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}
