"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "./app-context"
import { useClickOutside } from "./ui-kit"
import type { DraftDoc } from "@/lib/data"
import { FileText, MoreVertical, Plus, Pencil, Copy, Trash2, Download } from "lucide-react"

export function NewCard({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 bg-primary/[0.02] p-4 text-primary transition-fast hover:border-primary hover:bg-primary/5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <Plus className="h-5 w-5" />
      </span>
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  )
}

export function DocumentCard({ doc }: { doc: DraftDoc }) {
  const router = useRouter()
  const { addRecent, toast } = useApp()
  const [menu, setMenu] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setMenu(false), menu)

  const open = () => {
    addRecent({ id: doc.id, title: doc.title, href: `/drafts/${doc.id}` })
    router.push(`/drafts/${doc.id}`)
  }

  return (
    <div
      onClick={open}
      className="group relative flex min-h-[132px] cursor-pointer flex-col rounded-lg border border-border bg-card p-4 transition-fast hover:border-primary/40 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileText className="h-[18px] w-[18px]" />
        </span>
        <div className="relative" ref={ref}>
          <button
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation()
              setMenu((m) => !m)
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-fast hover:bg-muted group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down"
            >
              {[
                { label: "Rename", icon: Pencil },
                { label: "Duplicate", icon: Copy },
                { label: "Download", icon: Download },
              ].map((it) => (
                <button
                  key={it.label}
                  onClick={() => {
                    setMenu(false)
                    toast(`${it.label}: ${doc.title}`)
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] transition-fast hover:bg-muted"
                >
                  <it.icon className="h-4 w-4 text-muted-foreground" />
                  {it.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMenu(false)
                  toast(`Deleted ${doc.title}`, "error")
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-destructive transition-fast hover:bg-destructive-bg"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
        {doc.title}
      </h3>
      <div className="mt-auto flex items-center justify-between pt-3 text-[12px] text-muted-foreground">
        <span>{doc.words.toLocaleString()} words</span>
        <span>{doc.time}</span>
      </div>
    </div>
  )
}

export const cardGrid = cn(
  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
)
