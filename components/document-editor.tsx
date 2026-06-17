"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useApp } from "./app-context"
import { Avatar, IconButton, Tooltip } from "./ui-kit"
import { TransformationsPanel } from "./transformations-panel"
import { FinalCheckPanel } from "./final-check-panel"
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Table,
  Quote,
  Code,
  Undo,
  Redo,
  Download,
  Save,
  Share2,
  MessageSquare,
  Sparkles,
  Pencil,
  CheckCircle2,
} from "lucide-react"

export function DocumentEditor({
  backHref,
  backLabel,
  title,
  initialContent = "",
}: {
  backHref: string
  backLabel: string
  title: string
  initialContent?: string
}) {
  const { toast } = useApp()
  const [mode, setMode] = useState<"write" | "final">("write")
  const [content, setContent] = useState(initialContent)
  const [selection, setSelection] = useState("")
  const taRef = useRef<HTMLTextAreaElement>(null)

  const words = content.trim() ? content.trim().split(/\s+/).length : 0
  const chars = content.length
  const selChars = selection.length
  const selWords = selection.trim() ? selection.trim().split(/\s+/).length : 0

  const onSelect = () => {
    const ta = taRef.current
    if (!ta) return
    setSelection(content.slice(ta.selectionStart, ta.selectionEnd))
  }

  const insert = (text: string) => {
    setContent((c) => (c.trim() ? `${c}\n\n${text}` : text))
  }

  const toolbarGroups: { icon: typeof Bold; label: string }[][] = [
    [
      { icon: Bold, label: "Bold" },
      { icon: Italic, label: "Italic" },
      { icon: Underline, label: "Underline" },
      { icon: Strikethrough, label: "Strikethrough" },
    ],
    [
      { icon: AlignLeft, label: "Align left" },
      { icon: AlignCenter, label: "Align center" },
      { icon: AlignRight, label: "Align right" },
      { icon: AlignJustify, label: "Justify" },
    ],
    [
      { icon: List, label: "Bulleted list" },
      { icon: ListOrdered, label: "Numbered list" },
    ],
    [
      { icon: Link2, label: "Insert link" },
      { icon: ImageIcon, label: "Insert image" },
      { icon: Table, label: "Insert table" },
      { icon: Quote, label: "Quote" },
      { icon: Code, label: "Code block" },
    ],
  ]

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
        <div className="min-w-0">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-fast hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {backLabel}
          </Link>
          <input
            defaultValue={title}
            className="mt-0.5 block w-full truncate border-none bg-transparent text-lg font-bold text-foreground outline-none"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Avatar initials="SH" />
        </div>
      </div>

      {/* Mode tabs + toolbar */}
      <div className="flex flex-col gap-2 border-b border-border px-6 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode("write")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-fast",
              mode === "write"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <Pencil className="h-4 w-4 text-success" />
            Write
          </button>
          <button
            onClick={() => setMode("final")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-fast",
              mode === "final"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CheckCircle2 className="h-4 w-4 text-success" />
            Final Check
          </button>
        </div>

        {mode === "write" && (
          <div className="flex flex-wrap items-center gap-1">
            <Tooltip label="Font">
              <button className="flex h-8 items-center rounded-md px-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted">
                Aa
              </button>
            </Tooltip>
            {toolbarGroups.map((group, gi) => (
              <div key={gi} className="flex items-center gap-0.5">
                <span className="mx-1 h-5 w-px bg-border" />
                {group.map((b) => (
                  <IconButton
                    key={b.label}
                    label={b.label}
                    onClick={() => toast(b.label)}
                  >
                    <b.icon className="h-[18px] w-[18px]" />
                  </IconButton>
                ))}
              </div>
            ))}
            <span className="mx-1 h-5 w-px bg-border" />
            <IconButton label="Undo" onClick={() => toast("Undo")}>
              <Undo className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Redo" onClick={() => toast("Redo")}>
              <Redo className="h-[18px] w-[18px]" />
            </IconButton>
            <span className="mx-1 h-5 w-px bg-border" />
            <IconButton label="Download" onClick={() => toast("Downloaded")}>
              <Download className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Save" onClick={() => toast("Saved")}>
              <Save className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Share" onClick={() => toast("Share link copied")}>
              <Share2 className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Comments" onClick={() => toast("Comments")}>
              <MessageSquare className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="AI Assist" onClick={() => toast("AI Assist")}>
              <Sparkles className="h-[18px] w-[18px] text-primary" />
            </IconButton>
          </div>
        )}
      </div>

      {/* Body: editor + right panel */}
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <textarea
              ref={taRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onSelect={onSelect}
              placeholder="Insert text here"
              className="mx-auto block h-full min-h-[400px] w-full max-w-[760px] resize-none border-none bg-transparent text-[15px] leading-[1.7] text-foreground outline-none placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex items-center justify-between border-t border-border px-8 py-2 text-[12px] text-muted-foreground">
            <span>
              {words} words, {chars} characters
            </span>
            <span>
              selected: {selWords}/{selChars}
            </span>
          </div>
        </div>

        <aside className="hidden w-[360px] shrink-0 border-l border-border bg-muted/20 lg:block">
          {mode === "write" ? (
            <TransformationsPanel selection={selection} onInsert={insert} />
          ) : (
            <FinalCheckPanel />
          )}
        </aside>
      </div>
    </div>
  )
}
