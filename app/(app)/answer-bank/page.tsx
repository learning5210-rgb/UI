"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/app-context"
import { Button, Pill, Toggle, useClickOutside } from "@/components/ui-kit"
import { PageContainer, PageHeading, WorkspaceTabs } from "@/components/page-parts"
import { ANSWER_BANK, TAG_COLORS, type AnswerEntry } from "@/lib/data"
import {
  Search,
  Plus,
  Upload,
  Download,
  ChevronDown,
  MoreVertical,
  Trash2,
  Copy,
  Pencil,
} from "lucide-react"

export default function AnswerBankPage() {
  const { toast } = useApp()
  const [entries, setEntries] = useState<AnswerEntry[]>(ANSWER_BANK)
  const [query, setQuery] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenuFor(null), menuFor !== null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.question.toLowerCase().includes(q) ||
        e.answer.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [entries, query])

  const update = (id: string, field: "question" | "answer", value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const addEntry = () => {
    const id = `a-new-${Date.now()}`
    setEntries((prev) => [...prev, { id, question: "", answer: "", tags: [] }])
    setEditMode(true)
    toast("New entry added")
  }

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setMenuFor(null)
    toast("Entry deleted")
  }

  return (
    <PageContainer>
      <WorkspaceTabs base="/answer-bank" />
      <div className="pt-6">
        <PageHeading
          title="Answer Bank"
          subtitle="Store commonly used questions and answers for easy retrieval."
          action={
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                Edit mode
              </span>
              <Toggle checked={editMode} onChange={setEditMode} label="Edit mode" />
            </div>
          }
        />

        {/* Action bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your Answer Bank…"
              className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button icon={<Plus className="h-4 w-4" />} onClick={addEntry}>
            Add Entry
          </Button>
          <Button
            variant="outline"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => toast("Import dialog opened")}
          >
            Import Questions &amp; Answers
          </Button>
          <Button
            variant="ghost"
            icon={<Download className="h-4 w-4" />}
            onClick={() => toast("Template downloaded")}
          >
            Download Import Template
          </Button>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[1.2fr_1.6fr_0.9fr_auto] items-center gap-4 border-b border-border bg-secondary px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Question</span>
            <span>Answer</span>
            <span>Tags</span>
            <span className="w-8 text-right">Actions</span>
          </div>

          {filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No entries match your search.
            </p>
          ) : (
            filtered.map((entry) => {
              const open = expanded === entry.id
              return (
                <div key={entry.id} className="border-b border-border last:border-b-0">
                  <div className="grid grid-cols-[1.2fr_1.6fr_0.9fr_auto] items-start gap-4 px-5 py-4 transition-fast hover:bg-secondary/60">
                    {/* Question */}
                    <div className="flex items-start gap-2">
                      <button
                        aria-label={open ? "Collapse row" : "Expand row"}
                        onClick={() => setExpanded(open ? null : entry.id)}
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-fast hover:bg-muted"
                      >
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                        />
                      </button>
                      {editMode ? (
                        <textarea
                          value={entry.question}
                          onChange={(e) => update(entry.id, "question", e.target.value)}
                          placeholder="Enter question"
                          rows={2}
                          className="w-full resize-none rounded-md border border-border bg-white px-2.5 py-1.5 text-[13px] leading-relaxed outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <p className="text-[13px] font-medium leading-relaxed text-foreground">
                          {entry.question || (
                            <span className="text-muted-foreground/60">Enter question</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Answer */}
                    <div>
                      {editMode ? (
                        <textarea
                          value={entry.answer}
                          onChange={(e) => update(entry.id, "answer", e.target.value)}
                          placeholder="Enter answer"
                          rows={2}
                          className="w-full resize-none rounded-md border border-border bg-white px-2.5 py-1.5 text-[13px] leading-relaxed outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <p
                          className={cn(
                            "text-[13px] leading-relaxed text-muted-foreground",
                            !open && "line-clamp-2",
                          )}
                        >
                          {entry.answer || (
                            <span className="text-muted-foreground/60">Enter answer</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <Pill key={tag} color={TAG_COLORS[tag] ?? "#6B7280"}>
                          {tag}
                        </Pill>
                      ))}
                      {editMode && (
                        <button
                          onClick={() => toast("Add tag")}
                          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-fast hover:border-primary hover:text-primary"
                        >
                          <Plus className="h-3 w-3" />
                          Tag
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="relative flex justify-end">
                      <button
                        aria-label="Row actions"
                        onClick={() => setMenuFor(menuFor === entry.id ? null : entry.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuFor === entry.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down"
                        >
                          <button
                            onClick={() => {
                              setEditMode(true)
                              setMenuFor(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-foreground transition-fast hover:bg-muted"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              toast("Answer copied")
                              setMenuFor(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-foreground transition-fast hover:bg-muted"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </button>
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-destructive transition-fast hover:bg-destructive-bg"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {open && !editMode && (
                    <div className="animate-slide-down border-t border-border bg-secondary/40 px-5 py-4 pl-12">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Full answer
                      </p>
                      <p className="text-[13px] leading-relaxed text-foreground">
                        {entry.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <p className="mt-3 text-[12px] text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          {editMode && " · Changes auto-save on blur or Enter"}
        </p>
      </div>
    </PageContainer>
  )
}
