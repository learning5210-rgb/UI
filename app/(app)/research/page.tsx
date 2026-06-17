"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/app-context"
import { Button, Checkbox, useClickOutside } from "@/components/ui-kit"
import { PageContainer, PageHeading } from "@/components/page-parts"
import { Citations } from "@/components/transformations-panel"
import { RESEARCH_SOURCES, AI_SOURCE_COLORS } from "@/lib/data"
import {
  ArrowUp,
  ChevronDown,
  X,
  Plus,
  Sparkles,
  Copy,
  Download,
  ArrowLeft,
} from "lucide-react"

const RESULTS = [
  {
    variable: "marketers",
    text: "For marketers, Pwinly accelerates the production of consistent, on-brand collateral by drafting structured content from a verified library, reducing manual effort and ensuring messaging stays aligned to the bid narrative [22][1][6][5].",
    cites: [22, 1, 6, 5],
  },
  {
    variable: "researchers",
    text: "For researchers, Pwinly aggregates evidence from multiple verified sources and surfaces inline citations so every claim can be traced back to its origin, dramatically reducing time spent locating supporting material [4][8].",
    cites: [4, 8],
  },
  {
    variable: "proposal writers",
    text: "For proposal writers, Pwinly drafts structured responses mapped directly to published scoring criteria, improving evaluator alignment and freeing writers to focus on the strongest, most persuasive arguments [15][1][2][3][4][9][10][6][14][16].",
    cites: [15, 1, 2, 3, 4, 9, 10, 6, 14, 16],
  },
]

export default function ResearchPage() {
  const { toast } = useApp()
  const [phase, setPhase] = useState<"query" | "results">("query")
  const [varOpen, setVarOpen] = useState(false)
  const [values, setValues] = useState(["marketers", "researchers", "proposal writers"])
  const [newVal, setNewVal] = useState("")
  const [sources, setSources] = useState({ "Library AI": true, "Internet AI": true })
  const [expanded, setExpanded] = useState<string | null>("marketers")
  const [showSources, setShowSources] = useState<string | null>(null)
  const varRef = useClickOutside<HTMLDivElement>(() => setVarOpen(false), varOpen)

  if (phase === "results") {
    return (
      <PageContainer>
        <button
          onClick={() => setPhase("query")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-fast hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to questions
        </button>
        <h1 className="mt-4 flex flex-wrap items-center gap-2 text-xl font-bold text-foreground">
          1. How does Pwinly support
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-base text-primary">
            writers
          </span>
        </h1>

        <div className="mt-5 space-y-3">
          {RESULTS.map((r) => {
            const open = expanded === r.variable
            return (
              <div key={r.variable} className="rounded-xl border border-border bg-card">
                <button
                  onClick={() => setExpanded(open ? null : r.variable)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left"
                >
                  <span className="text-[14px] font-bold text-foreground">
                    {r.variable}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>
                {open && (
                  <div className="animate-slide-down px-5 pb-5">
                    <p className="text-[14px] leading-relaxed text-foreground">
                      <Citations text={r.text} />
                    </p>

                    <button
                      onClick={() =>
                        setShowSources(showSources === r.variable ? null : r.variable)
                      }
                      className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                    >
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          showSources === r.variable && "rotate-180",
                        )}
                      />
                      Sources
                    </button>

                    {showSources === r.variable && (
                      <div className="mt-3 animate-slide-down rounded-lg border border-border bg-muted/30 p-4">
                        <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                          Library AI Sources
                        </p>
                        <ul className="space-y-1.5">
                          {RESEARCH_SOURCES.map((s) => (
                            <li key={s.n} className="flex gap-2 text-[13px] text-foreground">
                              <span className="font-semibold text-primary">[{s.n}]</span>
                              {s.label}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
                          Internet AI
                        </p>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                          We did not find and use any Internet AI sources to
                          generate this answer.
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-end gap-1">
                      <button
                        aria-label="Download"
                        onClick={() => toast("Downloaded")}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Copy"
                        onClick={() => toast("Copied")}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeading
        title="Research"
        subtitle="Ask a research question with variables. Pwinly generates evidence-backed answers with traceable citations."
      />

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5 text-[15px] text-foreground">
            How does Pwinly support
            <div className="relative" ref={varRef}>
              <button
                onClick={() => setVarOpen((o) => !o)}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-primary"
              >
                writers
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {varOpen && (
                <div className="absolute left-0 top-9 z-20 w-64 rounded-lg border border-border bg-card p-3 shadow-lg animate-slide-down">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-foreground">
                      writers
                    </span>
                    <button
                      onClick={() => toast("Delete variable")}
                      className="text-[11px] font-medium text-destructive hover:underline"
                    >
                      Delete Variable
                    </button>
                  </div>
                  <div className="mb-2 flex gap-1.5">
                    <input
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newVal.trim()) {
                          setValues((v) => [...v, newVal.trim()])
                          setNewVal("")
                        }
                      }}
                      placeholder="Add values…"
                      className="h-8 flex-1 rounded-md border border-border px-2 text-[13px] outline-none focus:border-primary"
                    />
                  </div>
                  <ul className="space-y-1">
                    {values.map((v) => (
                      <li
                        key={v}
                        className="flex items-center justify-between rounded-md bg-muted px-2 py-1 text-[13px]"
                      >
                        {v}
                        <button
                          aria-label={`Remove ${v}`}
                          onClick={() => setValues((vals) => vals.filter((x) => x !== v))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <button
              onClick={() => setVarOpen(true)}
              className="text-[13px] font-medium text-primary hover:underline"
            >
              Show Variables
            </button>
            <button
              aria-label="Generate research"
              onClick={() => setPhase("results")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-fast hover:opacity-90"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-[13px] font-medium text-muted-foreground">Use:</span>
          {(Object.keys(sources) as (keyof typeof sources)[]).map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2 text-[13px]">
              <Checkbox
                checked={sources[s]}
                onChange={(v) => setSources((p) => ({ ...p, [s]: v }))}
              />
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: AI_SOURCE_COLORS[s] }}
              />
              {s}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button icon={<Sparkles className="h-4 w-4" />} onClick={() => setPhase("results")}>
            Generate
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
