"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "./app-context"
import { DRAFTS, PROJECTS, ANSWER_BANK, LIBRARY_FILES } from "@/lib/data"
import { Search, X, FileText, FolderClosed, Library as LibIcon, BriefcaseBusiness } from "lucide-react"
import { cn } from "@/lib/utils"

type Result = {
  id: string
  title: string
  snippet: string
  source: "Library" | "Drafts" | "Projects" | "Answer Bank"
  href: string
  match: string
}

const ICON: Record<Result["source"], typeof FileText> = {
  Library: LibIcon,
  Drafts: FileText,
  Projects: FolderClosed,
  "Answer Bank": BriefcaseBusiness,
}

function highlight(text: string, q: string) {
  if (!q) return text
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-warning/40 px-0.5 text-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useApp()
  const router = useRouter()
  const [raw, setRaw] = useState("")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Result | null>(null)

  // global keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") setSearchOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [setSearchOpen])

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(raw), 300)
    return () => clearTimeout(t)
  }, [raw])

  useEffect(() => {
    if (!searchOpen) {
      setRaw("")
      setQuery("")
      setSelected(null)
    }
  }, [searchOpen])

  const results = useMemo<Result[]>(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const out: Result[] = []
    DRAFTS.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.content?.toLowerCase().includes(q))
        out.push({
          id: d.id,
          title: d.title,
          snippet: d.content?.slice(0, 90) ?? `${d.words} words`,
          source: "Drafts",
          href: "/drafts",
          match: query,
        })
    })
    LIBRARY_FILES.forEach((f) => {
      if (f.name.toLowerCase().includes(q))
        out.push({
          id: f.id,
          title: f.name,
          snippet: `Engineering Services — ${f.updated}`,
          source: "Library",
          href: "/library",
          match: query,
        })
    })
    PROJECTS.forEach((p) => {
      if (p.name.toLowerCase().includes(q))
        out.push({
          id: p.id,
          title: p.name,
          snippet: `${p.status} project`,
          source: "Projects",
          href: "/projects",
          match: query,
        })
    })
    ANSWER_BANK.forEach((a) => {
      if (a.question.toLowerCase().includes(q) || a.answer.toLowerCase().includes(q))
        out.push({
          id: a.id,
          title: a.question,
          snippet: a.answer.slice(0, 90),
          source: "Answer Bank",
          href: "/answer-bank",
          match: query,
        })
    })
    return out
  }, [query])

  const grouped = useMemo(() => {
    const g: Record<string, Result[]> = {}
    results.forEach((r) => {
      g[r.source] = g[r.source] || []
      g[r.source].push(r)
    })
    return g
  }, [results])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-[10vh]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setSearchOpen(false)}
      />
      <div className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-card shadow-2xl animate-scale-in">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="Search across Pwinly..."
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex max-h-[60vh] min-h-[280px]">
          {/* results */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {!query.trim() ? (
              <EmptyHint />
            ) : results.length === 0 ? (
              <NoResults />
            ) : (
              Object.entries(grouped).map(([source, items]) => (
                <div key={source} className="mb-2">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {source}
                  </p>
                  {items.map((r) => (
                    <button
                      key={r.id}
                      onMouseEnter={() => setSelected(r)}
                      onClick={() => {
                        router.push(r.href)
                        setSearchOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-fast",
                        selected?.id === r.id ? "bg-primary/5" : "hover:bg-muted",
                      )}
                    >
                      {(() => {
                        const Icon = ICON[r.source]
                        return <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      })()}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">
                          {highlight(r.title, r.match)}
                        </span>
                        <span className="block truncate text-[12px] text-muted-foreground">
                          {highlight(r.snippet, r.match)}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {r.source}
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* preview */}
          {selected && (
            <div className="hidden w-[45%] flex-col border-l border-border bg-secondary p-4 md:flex">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {selected.source}
              </p>
              <h3 className="mt-1 text-sm font-semibold">{selected.title}</h3>
              <div className="mt-3 rounded-lg border border-border bg-card p-3 text-[13px] leading-relaxed text-foreground">
                {highlight(selected.snippet, selected.match)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyHint() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center text-muted-foreground">
      <Search className="h-10 w-10" />
      <p className="mt-3 text-sm">Search documents, drafts, projects and answers</p>
      <p className="mt-1 text-[12px]">
        Try typing <span className="font-medium text-foreground">"ca"</span>
      </p>
    </div>
  )
}

function NoResults() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center text-muted-foreground">
      <Search className="h-10 w-10" />
      <p className="mt-3 text-sm font-medium text-foreground">No results found</p>
      <p className="mt-1 text-[12px]">Try a different search term</p>
    </div>
  )
}
