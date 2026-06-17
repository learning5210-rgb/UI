"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/app-context"
import { Button, Checkbox, Modal, ModalClose } from "@/components/ui-kit"
import { PageContainer } from "@/components/page-parts"
import { LIBRARY_FILES, type LibraryFile } from "@/lib/data"
import {
  Search,
  ChevronRight,
  Move,
  Trash2,
  Pencil,
  Eye,
  Download,
  FileText,
  FileImage,
  FileType2,
  CircleCheck,
} from "lucide-react"

const ORG_CHART_CONTENT = `BEGIN_GENERATED_TEXT

COMPANY ORGANIZATION CHART

1. Board of Directors
   1.1 Sheridan Hartley — Chief Executive Officer
   1.2 Darcy Myring — Chief Operating Officer

2. Executive Team
   2.1 Engineering
       2.1.1 Priya Anand — VP Engineering
       2.1.2 Marcus Lowe — Principal Engineer
   2.2 Product
       2.2.1 Elena Costa — VP Product
       2.2.2 James Okafor — Senior Product Manager
   2.3 Commercial
       2.3.1 Hannah Webb — VP Sales
       2.3.2 Tom Pearson — Head of Partnerships

3. Operations
   3.1 People & Culture — Aisha Rahman
   3.2 Finance — Leo Schmidt
   3.3 Information Security — Nadia Petrova

END_GENERATED_TEXT`

function fileIcon(type: LibraryFile["type"]) {
  if (type === "image") return FileImage
  if (type === "pdf") return FileText
  return FileType2
}

export default function LibraryPage() {
  const { toast } = useApp()
  const [files] = useState<LibraryFile[]>(LIBRARY_FILES)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [preview, setPreview] = useState<LibraryFile | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return files
    return files.filter((f) => f.name.toLowerCase().includes(q))
  }, [files, query])

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const totalKb = filtered.reduce((sum, f) => sum + f.sizeKb, 0)
  const hasSelection = selected.length > 0

  const toolbarAction = (label: string) => {
    if (!hasSelection) {
      toast("Select a file first", "error")
      return
    }
    toast(label)
  }

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground"
      >
        <span className="font-medium text-foreground">Pwinly libraries</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Darcy</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">RFTs</span>
      </nav>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
            Pwinly libraries
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Browse, preview and manage source documents used across your bids.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your library…"
          className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" icon={<Move className="h-4 w-4" />} onClick={() => toolbarAction("Move")}>
          Move
        </Button>
        <Button variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={() => toolbarAction("Delete")}>
          Delete
        </Button>
        <Button variant="ghost" size="sm" icon={<Pencil className="h-4 w-4" />} onClick={() => toolbarAction("Rename")}>
          Rename
        </Button>
        <Button
          variant={hasSelection ? "outline" : "ghost"}
          size="sm"
          icon={<Eye className="h-4 w-4" />}
          onClick={() => {
            const f = files.find((x) => x.id === selected[0])
            if (f) setPreview(f)
            else toast("Select a file first", "error")
          }}
        >
          Preview
        </Button>
        <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />} onClick={() => toolbarAction("Download File")}>
          Download File
        </Button>
        <Button variant="ghost" size="sm" icon={<FileText className="h-4 w-4" />} onClick={() => toolbarAction("Download Raw Text")}>
          Download Raw Text
        </Button>
        {hasSelection && (
          <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold text-primary">
            {selected.length} Selected
          </span>
        )}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[auto_1.8fr_1fr_1.4fr_0.8fr] items-center gap-4 border-b border-border bg-secondary px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="w-[18px]" />
          <span>Name</span>
          <span>Last Updated</span>
          <span>Updated By</span>
          <span>Status</span>
        </div>

        {filtered.map((file) => {
          const Icon = fileIcon(file.type)
          const isSel = selected.includes(file.id)
          return (
            <div
              key={file.id}
              onClick={() => toggle(file.id)}
              className={cn(
                "grid cursor-pointer grid-cols-[auto_1.8fr_1fr_1.4fr_0.8fr] items-center gap-4 border-b border-border px-5 py-3.5 transition-fast last:border-b-0 hover:bg-secondary",
                isSel && "bg-primary/[0.04]",
              )}
              style={isSel ? { boxShadow: "inset 3px 0 0 0 var(--primary)" } : undefined}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox checked={isSel} onChange={() => toggle(file.id)} />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate text-[13px] font-medium text-foreground">
                  {file.name}
                </span>
              </div>
              <span className="text-[13px] text-muted-foreground">{file.updated}</span>
              <span className="truncate text-[13px] text-muted-foreground">
                {file.updatedBy}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                <CircleCheck className="h-4 w-4 text-success" />
                {file.status}
              </span>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No files match your search.
          </p>
        )}
      </div>

      {/* Footer */}
      <p className="mt-3 text-[12px] text-muted-foreground">
        Total Size: {totalKb.toLocaleString()} kB | Files: {filtered.length}
      </p>

      {/* Preview modal */}
      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        labelledBy="preview-title"
        className="max-w-4xl"
      >
        <ModalClose onClose={() => setPreview(null)} />
        {preview && (
          <div className="max-h-[80vh] overflow-y-auto scrollbar-thin pr-1">
            <h2 id="preview-title" className="text-lg font-bold text-foreground">
              {preview.name}
            </h2>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Last updated {preview.type === "image" ? "3 months ago" : "4 months ago"}
            </p>

            {/* Preview area */}
            <div className="mt-4 flex items-center justify-center rounded-lg border border-border bg-secondary p-6">
              {preview.type === "image" ? (
                <div className="w-full max-w-md rounded-lg border border-border bg-card p-5">
                  <p className="mb-4 text-center text-[13px] font-bold uppercase tracking-wide text-foreground">
                    Company Organization Chart
                  </p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-md bg-primary px-4 py-2 text-center text-[12px] font-semibold text-primary-foreground">
                      Sheridan Hartley · CEO
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex flex-wrap justify-center gap-3">
                      {["VP Engineering", "VP Product", "VP Sales"].map((r) => (
                        <div
                          key={r}
                          className="rounded-md border border-border bg-secondary px-3 py-1.5 text-[11px] font-medium text-foreground"
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                  <FileText className="h-12 w-12" />
                  <span className="text-[13px]">PDF preview</span>
                </div>
              )}
            </div>

            {/* Content */}
            <h3 className="mt-6 text-[12px] font-bold uppercase tracking-wide text-muted-foreground">
              Content
            </h3>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-secondary/50 p-4 font-mono text-[12px] leading-relaxed text-foreground">
              {preview.type === "image"
                ? ORG_CHART_CONTENT
                : "BEGIN_GENERATED_TEXT\n\nRequest for Tender — T21-25 (FINAL)\n\nThis document sets out the requirements, evaluation methodology and contractual terms for the tender. Sections cover service delivery, performance management, insurance requirements and transition arrangements.\n\nEND_GENERATED_TEXT"}
            </pre>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}
