"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/app-context"
import { Button, Checkbox } from "@/components/ui-kit"
import { PageContainer, PageHeading, SimpleTabs } from "@/components/page-parts"
import { AI_SOURCE_COLORS } from "@/lib/data"
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Loader2,
  X,
  FileType2,
  FileDigit,
  AlignLeft,
  Pilcrow,
  Sparkles,
} from "lucide-react"

type Uploaded = { id: string; name: string; size: string; words: number }

const SAMPLE_FILE: Uploaded = {
  id: "f1",
  name: "Request for Tender for the Voluntary Pre-employment Service for parents 2024-27.pdf",
  size: "4.1 MB",
  words: 36304,
}

const EXTRACTED_PREVIEW = `2024-27, September – October 2024 Deed entered into with successful Tenderers
13  Children and alterations to the Service
21  2.10.1  Outreach and Engagement Fund payments
24  2.14    Service delivery locations and premises
27  2.19    Insurance requirements
30  2.24.3  Selection criteria and evaluation methodology
34  2.31    Transition-in and transition-out arrangements
41  3.4     Performance management framework
48  4.2     Payment terms and invoicing schedule`

export default function ExtractPage() {
  const { toast } = useApp()
  const [inputTab, setInputTab] = useState("upload")
  const [procTab, setProcTab] = useState("summarise")
  const [file, setFile] = useState<Uploaded | null>(null)
  const [pasted, setPasted] = useState("")
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [length, setLength] = useState("one")

  const run = () => {
    if (!file && !pasted.trim()) {
      toast("Add a file or paste text first", "error")
      return
    }
    setProcessing(true)
    setResult(null)
    setTimeout(() => {
      setProcessing(false)
      setResult(EXTRACTED_PREVIEW)
      toast("Processing complete")
    }, 2200)
  }

  return (
    <PageContainer>
      <PageHeading
        title="Extract"
        subtitle="Upload tender documents to summarise, extract requirements, or shred into structured sections."
      />

      <div className="mt-6">
        <SimpleTabs
          value={inputTab}
          onChange={setInputTab}
          tabs={[
            { label: "File Upload", value: "upload" },
            { label: "Paste Text", value: "paste" },
          ]}
        />
      </div>

      <div className="mt-5">
        {inputTab === "upload" ? (
          <div>
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 py-12 text-center transition-fast hover:border-primary/50 hover:bg-primary/[0.02]"
              onClick={(e) => {
                e.preventDefault()
                setFile(SAMPLE_FILE)
                toast("File ready")
              }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UploadCloud className="h-6 w-6" />
              </span>
              <span className="text-[15px] font-semibold text-foreground">
                Drag and drop your files here
              </span>
              <span className="max-w-md text-[12px] text-muted-foreground">
                Limit 512 MB per file. We accept pdf, doc, docx, txt, msg, odt,
                odp, csv, ppt and xls files.
              </span>
              <Button variant="outline" size="sm" className="mt-1">
                Browse files
              </Button>
            </label>

            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive-bg text-destructive">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    1. {file.name}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {file.size} | {file.words.toLocaleString()} words
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  File ready
                </span>
                <button
                  aria-label="Remove file"
                  onClick={() => setFile(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={8}
            placeholder="Paste your tender text here…"
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        )}
      </div>

      {(file || pasted.trim()) && (
        <div className="mt-6">
          <SimpleTabs
            value={procTab}
            onChange={setProcTab}
            tabs={[
              { label: "Summarise", value: "summarise" },
              { label: "Extract", value: "extract" },
              { label: "Shred", value: "shred" },
            ]}
          />

          {procTab === "summarise" && (
            <div className="mt-4">
              <p className="mb-2 text-[13px] font-medium text-foreground">
                Summary length
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { key: "two", label: "Two pages", icon: FileType2 },
                  { key: "one", label: "One page", icon: FileDigit },
                  { key: "half", label: "Half-page", icon: AlignLeft },
                  { key: "para", label: "Paragraph", icon: Pilcrow },
                ].map((o) => (
                  <button
                    key={o.key}
                    onClick={() => setLength(o.key)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border px-4 py-4 transition-fast",
                      length === o.key
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    <o.icon className="h-5 w-5" />
                    <span className="text-[13px] font-medium">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            {processing ? (
              <Button variant="outline" icon={<X className="h-4 w-4" />} onClick={() => setProcessing(false)}>
                Cancel
              </Button>
            ) : (
              <Button icon={<Sparkles className="h-4 w-4" />} onClick={run}>
                Run {procTab === "summarise" ? "Summarise" : procTab === "extract" ? "Extract" : "Shred"}
              </Button>
            )}
            {processing && (
              <span className="flex items-center gap-2 text-[13px] font-medium text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </span>
            )}
          </div>

          {processing && (
            <p className="mt-2 text-[12px] text-muted-foreground">
              You can navigate to other areas of the app whilst your file is
              processing.
            </p>
          )}

          {result && (
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-[14px] font-bold text-foreground">
                Extracted content
              </h3>
              <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-muted-foreground">
                {result}
              </pre>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  )
}
