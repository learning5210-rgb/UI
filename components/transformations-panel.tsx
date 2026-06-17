"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button, Checkbox } from "./ui-kit"
import { useApp } from "./app-context"
import { AI_SOURCE_COLORS } from "@/lib/data"
import {
  Sparkles,
  Plus,
  Info,
  BarChart3,
  List,
  FileText,
  ChevronDown,
  CornerDownLeft,
  RefreshCw,
} from "lucide-react"

type TransformKey = "expand" | "explain" | "stats" | "example" | "casestudy"

const TRANSFORMS: {
  key: TransformKey
  label: string
  desc: string
  icon: typeof Plus
}[] = [
  { key: "expand", label: "Expand", desc: "Expand selected text to a target word count", icon: Plus },
  { key: "explain", label: "Explain How", desc: "Add explanatory detail about how something works", icon: Info },
  { key: "stats", label: "Add Statistics", desc: "Inject relevant statistics and data points", icon: BarChart3 },
  { key: "example", label: "For Example", desc: "Add illustrative examples to support points", icon: List },
  { key: "casestudy", label: "Add Case Study", desc: "Insert relevant case study content", icon: FileText },
]

const EXPAND_RESULTS = [
  {
    words: 171,
    deltaW: 125,
    chars: 1202,
    deltaC: 870,
    source: "Library AI",
    text: "Pwinly supports marketers, researchers and proposal writers across the entire bid lifecycle [1]. For marketers, the platform accelerates the production of consistent, on-brand collateral, reducing drafting time by up to 70% [22]. For researchers, Pwinly aggregates evidence from multiple verified sources, surfacing citations inline so claims can be traced to their origin [4]. For proposal writers, Pwinly drafts structured responses mapped directly to published scoring criteria, improving evaluator alignment and win rates [15][2][3].",
  },
  {
    words: 168,
    deltaW: 122,
    chars: 1180,
    deltaC: 848,
    source: "Library AI",
    text: "Across the bid lifecycle, Pwinly is built to remove friction for three core users [1]. Marketers gain a faster route to publish-ready, on-brand content [22]. Researchers benefit from an evidence engine that pulls from verified document libraries with traceable citations [4]. Proposal writers receive structured, criteria-mapped drafts that map cleanly onto evaluator scoring rubrics [15][2][3].",
  },
]

export function TransformationsPanel({
  selection,
  onInsert,
}: {
  selection: string
  onInsert: (text: string) => void
}) {
  const { toast } = useApp()
  const [open, setOpen] = useState<TransformKey | null>(null)
  const [sources, setSources] = useState({
    "Library AI": true,
    "Creative AI": false,
    "Internet AI": false,
  })
  const [target, setTarget] = useState("150")
  const [results, setResults] = useState<typeof EXPAND_RESULTS | null>(null)
  const selWords = selection.trim() ? selection.trim().split(/\s+/).length : 0

  const generate = () => {
    if (!selection.trim()) {
      toast("Select text in the document first", "error")
      return
    }
    setResults(EXPAND_RESULTS)
    toast("Generated 2 options")
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-bold text-foreground">Transformations</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Choose a transformation to evidence, edit or develop your writing
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {results ? (
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Expand</h3>
              <Button
                size="sm"
                variant="outline"
                icon={<RefreshCw className="h-3.5 w-3.5" />}
                onClick={() => toast("Regenerating…")}
              >
                Regenerate
              </Button>
            </div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium text-muted-foreground">
              Library AI ({EXPAND_RESULTS.length})
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col gap-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {r.words} words{" "}
                      <span className="text-success">[+{r.deltaW}]</span>,{" "}
                      {r.chars} chars{" "}
                      <span className="text-success">[+{r.deltaC}]</span>
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${AI_SOURCE_COLORS[r.source]}1a`,
                        color: AI_SOURCE_COLORS[r.source],
                      }}
                    >
                      {r.source}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-foreground">
                    <Citations text={r.text} />
                  </p>
                  <button
                    onClick={() => {
                      onInsert(r.text)
                      toast("Inserted into document")
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition-fast hover:bg-primary-hover"
                  >
                    <CornerDownLeft className="h-3.5 w-3.5" />
                    Insert text
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setResults(null)}
              className="mt-4 text-[12px] font-medium text-primary hover:underline"
            >
              ← Back to transformations
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {TRANSFORMS.map((t) => {
              const isOpen = open === t.key
              return (
                <div key={t.key} className="border-b border-border">
                  <button
                    onClick={() => setOpen(isOpen ? null : t.key)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-fast hover:bg-muted/50"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <t.icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14px] font-semibold text-foreground">
                        {t.label}
                      </span>
                      <span className="block text-[12px] text-muted-foreground">
                        {t.desc}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="animate-slide-down px-5 pb-5">
                      <div className="flex flex-col gap-2.5">
                        {(Object.keys(sources) as (keyof typeof sources)[]).map(
                          (s) => (
                            <label
                              key={s}
                              className="flex cursor-pointer items-center gap-2.5 text-[13px] text-foreground"
                            >
                              <Checkbox
                                checked={sources[s]}
                                onChange={(v) =>
                                  setSources((prev) => ({ ...prev, [s]: v }))
                                }
                              />
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: AI_SOURCE_COLORS[s] }}
                              />
                              {s}
                            </label>
                          ),
                        )}
                      </div>

                      {t.key === "expand" && (
                        <div className="mt-4">
                          <p className="mb-2 text-[12px] text-muted-foreground">
                            Selected text: {selWords} words
                          </p>
                          <label className="mb-1.5 block text-[12px] font-medium text-foreground">
                            Target Word Count
                          </label>
                          <div className="mb-2 flex gap-2">
                            {["50", "100", "150"].map((v) => (
                              <button
                                key={v}
                                onClick={() => setTarget(v)}
                                className={cn(
                                  "flex-1 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-fast",
                                  target === v
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border text-muted-foreground hover:border-primary/40",
                                )}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                          <input
                            value={target}
                            onChange={(e) =>
                              setTarget(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="Enter a value"
                            className="w-full rounded-md border border-border bg-card px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      )}

                      <Button
                        className="mt-4 w-full"
                        icon={<Sparkles className="h-4 w-4" />}
                        onClick={generate}
                      >
                        Generate
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function Citations({ text }: { text: string }) {
  const parts = text.split(/(\[\d+\])/g)
  return (
    <>
      {parts.map((p, i) =>
        /^\[\d+\]$/.test(p) ? (
          <sup
            key={i}
            className="mx-0.5 cursor-pointer rounded bg-primary/10 px-1 text-[10px] font-semibold text-primary"
          >
            {p.replace(/[[\]]/g, "")}
          </sup>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}
