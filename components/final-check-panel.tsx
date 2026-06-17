"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button, Checkbox } from "./ui-kit"
import { useApp } from "./app-context"
import { FINAL_CHECK_SUGGESTIONS } from "@/lib/data"
import {
  Target,
  FileText,
  Shield,
  Lightbulb,
  Type,
  Plus,
  Copy,
  Check,
  ArrowLeft,
} from "lucide-react"

const CRITERIA = [
  { key: "approach", label: "Approach and Methodology", icon: Target, default: true },
  { key: "evidence", label: "Evidence", icon: FileText, default: true },
  { key: "robustness", label: "Robustness", icon: Shield, default: false },
  { key: "innovation", label: "Innovation", icon: Lightbulb, default: true },
  { key: "grammar", label: "Spelling and Grammar", icon: Type, default: true },
]

export function FinalCheckPanel() {
  const { toast } = useApp()
  const [phase, setPhase] = useState<"criteria" | "results">("criteria")
  const [checks, setChecks] = useState<Record<string, boolean>>(
    Object.fromEntries(CRITERIA.map((c) => [c.key, c.default])),
  )
  const [bidSpecific, setBidSpecific] = useState(false)
  const [done, setDone] = useState<Record<number, boolean>>({})
  const allSelected = CRITERIA.every((c) => checks[c.key])

  if (phase === "results") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <button
            aria-label="Back to criteria"
            onClick={() => setPhase("criteria")}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-[15px] font-bold text-foreground">
            Suggestions ({FINAL_CHECK_SUGGESTIONS.length})
          </h2>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {FINAL_CHECK_SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg border border-border bg-card p-3 transition-fast",
                done[i] && "opacity-50",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {s.tag}
                </span>
                <span className="text-[11px] text-muted-foreground">{s.time}</span>
              </div>
              <p className="mb-2 border-l-2 border-primary/40 pl-2.5 text-[13px] italic leading-relaxed text-muted-foreground">
                &ldquo;{s.quote}&rdquo;
              </p>
              <p className="text-[13px] leading-relaxed text-foreground">
                {s.suggestion}
              </p>
              <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
                <span className="text-[11px] text-muted-foreground">{s.section}</span>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Copy suggestion"
                    onClick={() => toast("Copied suggestion")}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Mark as done"
                    onClick={() =>
                      setDone((d) => ({ ...d, [i]: !d[i] }))
                    }
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md transition-fast",
                      done[i]
                        ? "bg-success text-white"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-bold text-foreground">Criteria Selection</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Boost your bid success with Final Check — our tailored solution for
          optimised writing and a streamlined review process.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-6">
          <h3 className="mb-2 text-[13px] font-bold text-foreground">
            Bid-Specific Criteria
          </h3>
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox checked={bidSpecific} onChange={setBidSpecific} />
            <span>
              <span className="block text-[13px] font-medium text-foreground">
                Question and Requirements Pair
              </span>
              <span className="block text-[12px] text-muted-foreground">
                Review against a specific question and related section of the
                specification.
              </span>
            </span>
          </label>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => toast("Add criteria")}
          >
            Add criteria
          </Button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-foreground">
              Pre-Defined Criteria
            </h3>
            <button
              onClick={() =>
                setChecks(
                  Object.fromEntries(CRITERIA.map((c) => [c.key, !allSelected])),
                )
              }
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Select all ({CRITERIA.length})
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {CRITERIA.map((c) => (
              <label
                key={c.key}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 transition-fast hover:bg-muted/50"
              >
                <Checkbox
                  checked={!!checks[c.key]}
                  onChange={(v) => setChecks((p) => ({ ...p, [c.key]: v }))}
                />
                <c.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[13px] font-medium text-foreground">
                  {c.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4">
        <Button className="w-full" onClick={() => setPhase("results")}>
          Review Everything
        </Button>
      </div>
    </div>
  )
}
