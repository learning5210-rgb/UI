"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/app-context"
import { Avatar, Button, useClickOutside, StatusDot } from "@/components/ui-kit"
import { WorkspaceTabsLocal } from "@/components/project-tabs"
import { MembersModal } from "@/components/members-modal"
import { getProjectById, STATUS_META, type ProjectStatus } from "@/lib/data"
import {
  ArrowLeft,
  ChevronDown,
  Users,
  MoreVertical,
  Plus,
  FileText,
} from "lucide-react"

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { toast, addRecent } = useApp()
  const project = getProjectById(id)
  const [tab, setTab] = useState("overview")
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "Preparing")
  const [statusOpen, setStatusOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [docs, setDocs] = useState<{ id: string; title: string }[]>([])
  const statusRef = useClickOutside<HTMLDivElement>(() => setStatusOpen(false), statusOpen)
  const menuRef = useClickOutside<HTMLDivElement>(() => setMenuOpen(false), menuOpen)

  if (!project) {
    return (
      <div className="px-6 py-10 text-center text-muted-foreground">
        Project not found.{" "}
        <Link href="/projects" className="text-primary hover:underline">
          Back to projects
        </Link>
      </div>
    )
  }

  const addDoc = () => {
    const docId = `doc-${Date.now()}`
    const title = `Document - ${new Date().toLocaleDateString("en-GB")}`
    setDocs((d) => [...d, { id: docId, title }])
    addRecent({ id: docId, title, href: `/projects/${id}/doc/${docId}` })
    router.push(`/projects/${id}/doc/${docId}`)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-fast hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all projects
      </Link>

      <div className="mt-4">
        <WorkspaceTabsLocal value={tab} onChange={setTab} />
      </div>

      {tab === "overview" && (
        <div className="mt-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {project.name}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Users className="h-4 w-4" />}
                onClick={() => setMembersOpen(true)}
              >
                Members
              </Button>
              <Avatar initials="SH" />
              <div className="relative" ref={menuRef}>
                <button
                  aria-label="Project options"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down">
                    {["Rename project", "Duplicate", "Archive", "Delete"].map((it) => (
                      <button
                        key={it}
                        onClick={() => {
                          setMenuOpen(false)
                          toast(it)
                        }}
                        className={cn(
                          "block w-full px-3 py-2 text-left text-[13px] transition-fast hover:bg-muted",
                          it === "Delete" && "text-destructive hover:bg-destructive-bg",
                        )}
                      >
                        {it}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata row */}
          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-3 lg:grid-cols-5">
            <Meta label="Client Name" value={project.client ?? "N/A"} />
            <Meta label="Start Date" value="--/--/--" />
            <Meta label="Deadline" value="--/--/--" />
            <Meta label="Time Left" value="N/A" />
            <div>
              <p className="text-[12px] font-medium text-muted-foreground">
                Project Status
              </p>
              <div className="relative mt-1" ref={statusRef}>
                <button
                  onClick={() => setStatusOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-[13px] font-medium transition-fast hover:bg-muted"
                >
                  <StatusDot status={status} size={13} />
                  {status}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {statusOpen && (
                  <div className="absolute left-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down">
                    {(Object.keys(STATUS_META) as ProjectStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatus(s)
                          setStatusOpen(false)
                          toast(`Status: ${s}`)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-fast hover:bg-muted"
                      >
                        <StatusDot status={s} size={13} />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-5">
            <p className="mb-1.5 text-[13px] font-semibold text-foreground">Summary</p>
            <textarea
              rows={4}
              placeholder="Provide a summary of your project, outlining its purpose, goals and key highlights. This summary will help others understand your project at a glance."
              className="w-full resize-none rounded-lg border border-border bg-card px-3.5 py-3 text-sm leading-relaxed outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Documents */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-foreground">Documents</p>
              <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={addDoc}>
                Document
              </Button>
            </div>
            {docs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-10 text-center text-[13px] text-muted-foreground">
                No documents yet. Create your first document to get started.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {docs.map((d) => (
                  <Link
                    key={d.id}
                    href={`/projects/${id}/doc/${d.id}`}
                    className="flex min-h-[110px] flex-col rounded-lg border border-border bg-card p-4 transition-fast hover:border-primary/40 hover:shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <FileText className="h-[18px] w-[18px]" />
                    </span>
                    <span className="mt-3 text-[14px] font-semibold leading-snug text-foreground">
                      {d.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab !== "overview" && (
        <div className="mt-10 rounded-lg border border-dashed border-border py-16 text-center text-[14px] text-muted-foreground">
          {tab === "workbooks" ? "Q&A Workbooks" : "Inputs"} for this project will
          appear here.
        </div>
      )}

      <MembersModal open={membersOpen} onClose={() => setMembersOpen(false)} />
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-foreground">{value}</p>
    </div>
  )
}
