"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/app-context"
import { Button, Checkbox, Modal, ModalClose, Pill, useClickOutside } from "@/components/ui-kit"
import { PageContainer, PageHeading, WorkspaceTabs } from "@/components/page-parts"
import { WORKBOOKS, WORKBOOK_ROWS, type Workbook, type WorkbookRow } from "@/lib/data"
import {
  Plus,
  Upload,
  Download,
  FileSpreadsheet,
  MoreVertical,
  ChevronLeft,
  FolderOpen,
  Square,
  Loader2,
  Trash2,
  Sparkles,
  FileSearch,
} from "lucide-react"

const CONFIDENCE_COLORS: Record<WorkbookRow["confidence"], string> = {
  "Exact Match": "#10B981",
  "Near Match": "#F59E0B",
  "Library AI": "#7C3AED",
}

const WB_STATUS_COLORS: Record<Workbook["status"], string> = {
  Drafting: "#F59E0B",
  Completed: "#10B981",
  "In Review": "#D946EF",
}

export default function WorkbooksPage() {
  const { toast } = useApp()
  const [view, setView] = useState<"list" | "detail">("list")
  const [activeName, setActiveName] = useState("")

  const openWorkbook = (name: string) => {
    setActiveName(name)
    setView("detail")
  }

  if (view === "detail") {
    return <WorkbookDetail name={activeName} onBack={() => setView("list")} />
  }

  return (
    <PageContainer>
      <WorkspaceTabs base="/answer-bank" />
      <div className="pt-6">
        <PageHeading
          title="Q&A Workbooks"
          subtitle="Upload your Q&A spreadsheet and let Pwinly auto-generate draft answers from your Answer Bank and Library."
        />

        {/* Upload zone */}
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card px-6 py-12 text-center transition-fast hover:border-primary/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FileSpreadsheet className="h-7 w-7 text-primary" />
          </div>
          <p className="mt-4 text-[15px] font-semibold text-foreground">
            Drag and drop your Excel file here
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            We accept .xlsx and .xls files. Maximum file size 10 MB.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => openWorkbook(`Workbook — ${nowStamp()}`)}
          >
            BROWSE FILES
          </Button>
        </div>

        {/* How it works */}
        <div className="mt-8 rounded-xl border border-border bg-secondary/40 p-6">
          <h2 className="text-[15px] font-bold text-foreground">How it works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-[13px] leading-relaxed text-foreground">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            Workbooks also recognises Answer Bank tags, so those are included as context when
            retrieving answers.
          </p>
        </div>

        {/* Sample workbooks */}
        <h2 className="mt-8 text-[15px] font-bold text-foreground">Your workbooks</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKBOOKS.map((wb) => (
            <WorkbookCard key={wb.id} wb={wb} onOpen={() => openWorkbook(wb.name)} />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

const HOW_IT_WORKS = [
  "Upload your Q&A spreadsheet with question columns",
  "Pwinly reads each question row and matches answers from your Answer Bank",
  "Review, edit, and approve each generated answer",
  "Export completed workbook back to Excel or paste into your document",
]

function nowStamp() {
  const d = new Date()
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  return `${date}, ${time}`
}

function WorkbookCard({ wb, onOpen }: { wb: Workbook; onOpen: () => void }) {
  const { toast } = useApp()
  const [menu, setMenu] = useState(false)
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenu(false), menu)

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-fast hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
            <FileSpreadsheet className="h-5 w-5 text-success" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-foreground">{wb.name}</p>
            <p className="text-[12px] text-muted-foreground">{wb.questions} questions</p>
          </div>
        </div>
        <div className="relative">
          <button
            aria-label="Workbook actions"
            onClick={() => setMenu((m) => !m)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down"
            >
              <button
                onClick={() => {
                  toast("Workbook renamed")
                  setMenu(false)
                }}
                className="flex w-full items-center px-3 py-2 text-left text-[13px] text-foreground transition-fast hover:bg-muted"
              >
                Rename
              </button>
              <button
                onClick={() => {
                  toast("Workbook duplicated")
                  setMenu(false)
                }}
                className="flex w-full items-center px-3 py-2 text-left text-[13px] text-foreground transition-fast hover:bg-muted"
              >
                Duplicate
              </button>
              <button
                onClick={() => {
                  toast("Workbook deleted")
                  setMenu(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-destructive transition-fast hover:bg-destructive-bg"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px]">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: WB_STATUS_COLORS[wb.status] }} />
          {wb.status}
        </span>
        <span className="text-muted-foreground">{wb.modified}</span>
      </div>

      {/* Progress bar */}
      <div className="mt-2.5">
        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Completion</span>
          <span>{wb.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${wb.progress}%` }} />
        </div>
      </div>

      <Button className="mt-4 w-full" size="sm" onClick={onOpen}>
        Open Workbook
      </Button>
    </div>
  )
}

/* ---------------- Detail view ---------------- */

function WorkbookDetail({ name, onBack }: { name: string; onBack: () => void }) {
  const { toast } = useApp()
  const [rows, setRows] = useState<WorkbookRow[]>([])
  const [importOpen, setImportOpen] = useState(false)
  const [sourcesRow, setSourcesRow] = useState<WorkbookRow | null>(null)
  const [autofilling, setAutofilling] = useState(false)
  const [filledCount, setFilledCount] = useState(0)
  const [menuFor, setMenuFor] = useState<number | null>(null)
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenuFor(null), menuFor !== null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopAutofill = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    setAutofilling(false)
  }

  useEffect(() => () => stopAutofill(), [])

  const startAutofill = () => {
    if (rows.length === 0) {
      // load the questions first so there is something to fill
      setRows(WORKBOOK_ROWS.map((r) => ({ ...r, answer: "", approved: false })))
    }
    setAutofilling(true)
    setFilledCount(0)
    let i = 0
    timerRef.current = setInterval(() => {
      i += 1
      setFilledCount(i)
      setRows((prev) =>
        prev.map((r, idx) =>
          idx < i ? { ...r, answer: WORKBOOK_ROWS[idx].answer, confidence: WORKBOOK_ROWS[idx].confidence } : r,
        ),
      )
      if (i >= WORKBOOK_ROWS.length) {
        stopAutofill()
        toast("Autofill complete")
      }
    }, 900)
  }

  const addQuestions = () => {
    setRows(WORKBOOK_ROWS.map((r) => ({ ...r })))
    setImportOpen(false)
    toast("Questions imported")
  }

  const toggleApproved = (n: number) =>
    setRows((prev) => prev.map((r) => (r.n === n ? { ...r, approved: !r.approved } : r)))

  const deleteRow = (n: number) => {
    setRows((prev) => prev.filter((r) => r.n !== n))
    setMenuFor(null)
    toast("Entry deleted")
  }

  const hasRows = rows.length > 0

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-fast hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Workbooks
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-muted-foreground">{name}</p>
          <h1 className="mt-0.5 text-2xl font-bold leading-tight tracking-tight text-foreground">
            Q&A Workbook
          </h1>
        </div>
        <Button icon={<Download className="h-4 w-4" />} onClick={() => toast("Workbook downloaded")}>
          DOWNLOAD WORKBOOK
        </Button>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Button icon={<Sparkles className="h-4 w-4" />} onClick={startAutofill} disabled={autofilling}>
          Autofill Answers
        </Button>
        <Button variant="outline" icon={<Plus className="h-4 w-4" />} onClick={() => setImportOpen(true)}>
          Add Question
        </Button>
        <Button variant="outline" icon={<Upload className="h-4 w-4" />} onClick={() => setImportOpen(true)}>
          Import Questions
        </Button>
        <Button variant="ghost" icon={<Download className="h-4 w-4" />} onClick={() => toast("Template downloaded")}>
          Download Import Template
        </Button>
      </div>

      {/* Autofill progress */}
      {autofilling && (
        <div className="mt-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(filledCount / WORKBOOK_ROWS.length) * 100}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[13px] font-medium text-primary">
              Matching {filledCount} / {WORKBOOK_ROWS.length} Answers…
            </p>
            <Button variant="outline" size="sm" icon={<Square className="h-3.5 w-3.5" />} onClick={stopAutofill}>
              STOP GENERATING
            </Button>
          </div>
        </div>
      )}

      {/* Empty state OR table */}
      {!hasRows ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <FolderOpen className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[16px] font-semibold text-foreground">
            This Workbook is currently empty
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Import or add questions and answers to get started.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[40px_1.3fr_1.8fr_120px_90px_auto] items-center gap-4 border-b border-border bg-secondary px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>#</span>
            <span>Question</span>
            <span>Answer</span>
            <span>Confidence</span>
            <span>Approved</span>
            <span className="w-8 text-right">Actions</span>
          </div>

          {rows.map((row) => {
            const loading = autofilling && !row.answer
            return (
              <div
                key={row.n}
                className="grid grid-cols-[40px_1.3fr_1.8fr_120px_90px_auto] items-start gap-4 border-b border-border px-5 py-4 transition-fast last:border-b-0 hover:bg-secondary/60"
              >
                <span className="text-[13px] font-medium text-muted-foreground">{row.n}</span>
                <p className="text-[13px] font-medium leading-relaxed text-foreground">{row.question}</p>
                <div className="max-h-28 overflow-y-auto pr-1">
                  {loading ? (
                    <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Matching answer…
                    </span>
                  ) : (
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{row.answer}</p>
                  )}
                </div>
                <div>
                  {row.answer && (
                    <Pill color={CONFIDENCE_COLORS[row.confidence]}>{row.confidence}</Pill>
                  )}
                </div>
                <div className="pt-0.5">
                  <Checkbox checked={row.approved} onChange={() => toggleApproved(row.n)} />
                </div>
                <div className="relative flex justify-end">
                  <button
                    aria-label="Row actions"
                    onClick={() => setMenuFor(menuFor === row.n ? null : row.n)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {menuFor === row.n && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down"
                    >
                      <button
                        onClick={() => {
                          setMenuFor(null)
                          setRows((prev) =>
                            prev.map((r) =>
                              r.n === row.n
                                ? { ...r, answer: WORKBOOK_ROWS[row.n - 1].answer, confidence: WORKBOOK_ROWS[row.n - 1].confidence }
                                : r,
                            ),
                          )
                          toast("Entry autofilled")
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-foreground transition-fast hover:bg-muted"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        AUTOFILL ENTRY
                      </button>
                      <button
                        onClick={() => deleteRow(row.n)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-destructive transition-fast hover:bg-destructive-bg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        DELETE ENTRY
                      </button>
                      <button
                        onClick={() => {
                          setMenuFor(null)
                          setSourcesRow(row)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-foreground transition-fast hover:bg-muted"
                      >
                        <FileSearch className="h-3.5 w-3.5" />
                        CHECK SOURCES
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Import modal */}
      <Modal open={importOpen} onClose={() => setImportOpen(false)} labelledBy="import-title">
        <ModalClose onClose={() => setImportOpen(false)} />
        <h2 id="import-title" className="text-lg font-bold text-foreground">
          Import Questions &amp; Answers
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          Use the Import Template or format your spreadsheet document to have a number, question, and
          answer column headers.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-3 text-[14px] font-semibold text-foreground">
            Drag and drop your files here
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Limit 512 MB per file. We accept xlsx and csv files
          </p>
          <Button variant="outline" size="sm" className="mt-4" icon={<Upload className="h-3.5 w-3.5" />}>
            BROWSE FILES
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => setImportOpen(false)}
            className="text-[13px] font-semibold text-muted-foreground transition-fast hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={addQuestions}
            className="text-[13px] font-semibold text-primary transition-fast hover:text-primary-hover"
          >
            ADD TO WORKBOOK
          </button>
        </div>
      </Modal>

      {/* Check sources modal */}
      <Modal open={sourcesRow !== null} onClose={() => setSourcesRow(null)} labelledBy="sources-title">
        <ModalClose onClose={() => setSourcesRow(null)} />
        {sourcesRow && (
          <>
            <div className="flex items-center gap-3">
              <h2 id="sources-title" className="text-lg font-bold text-foreground">
                Check Sources
              </h2>
              <Pill color={CONFIDENCE_COLORS[sourcesRow.confidence]}>
                {sourcesRow.confidence} Confidence
              </Pill>
            </div>

            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                Workbook Question:
              </p>
              <div className="mt-1.5 rounded-lg p-3 text-[13px] leading-relaxed text-foreground" style={{ backgroundColor: "rgba(167,139,250,0.1)" }}>
                {sourcesRow.question}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                Matched Answer Bank Question:
              </p>
              <div className="mt-1.5 rounded-lg p-3 text-[13px] leading-relaxed text-foreground" style={{ backgroundColor: "rgba(167,139,250,0.1)" }}>
                {sourcesRow.question}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                Answer
              </p>
              <p className="mt-1.5 max-h-40 overflow-y-auto text-[13px] leading-relaxed text-muted-foreground">
                {sourcesRow.answer}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSourcesRow(null)}
                className="text-[13px] font-semibold text-muted-foreground transition-fast hover:text-foreground"
              >
                CLOSE
              </button>
              <Button variant="outline" size="sm" onClick={() => toast("Opening Answer Bank")}>
                GO TO ANSWER BANK
              </Button>
            </div>
          </>
        )}
      </Modal>
    </PageContainer>
  )
}
