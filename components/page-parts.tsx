"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/* Workspace tabs: Documents / Q&A Workbooks / Inputs.
   They are contextual to the current top-level section (drafts, projects, answer-bank). */
export function WorkspaceTabs({ base }: { base: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const tabs = [
    { label: "Documents", href: base },
    { label: "Q&A Workbooks", href: `${base}/workbooks` },
    { label: "Inputs", href: `${base}/inputs` },
  ]
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((t) => {
        const active = pathname === t.href
        return (
          <button
            key={t.href}
            onClick={() => router.push(t.href)}
            className={cn(
              "relative -mb-px px-4 py-2.5 text-[14px] font-medium transition-fast",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
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

export function SimpleTabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { label: string; value: string; icon?: ReactNode }[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-border", className)}>
      {tabs.map((t) => {
        const active = value === t.value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative -mb-px flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-medium transition-fast",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.icon}
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

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-6 py-6">{children}</div>
}
