"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/components/app-context"
import { PageContainer, PageHeading, WorkspaceTabs } from "@/components/page-parts"
import { NewCard, cardGrid } from "@/components/document-card"
import { ProjectCard } from "@/components/project-card"
import { ProjectsBoard } from "@/components/projects-board"
import { CreateProjectModal } from "@/components/create-project-modal"
import { Button, Tooltip, StatusDot } from "@/components/ui-kit"
import { cn } from "@/lib/utils"
import {
  KANBAN_PROJECTS,
  statusForColumn,
  type KanbanProject,
  type Project,
} from "@/lib/data"
import { Search, Rows3, LayoutGrid, Kanban, Plus } from "lucide-react"

type View = "list" | "grid" | "board"

export default function ProjectsPage() {
  const { toast, addRecent } = useApp()
  const router = useRouter()
  // Single source of truth — the same projects power List, Grid and Kanban views.
  const [projects, setProjects] = useState<KanbanProject[]>(KANBAN_PROJECTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [view, setView] = useState<View>("board")

  const matches = useMemo(
    () =>
      projects.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [projects, query],
  )

  // Derive the flat Project shape (with a resolved status) for List & Grid views.
  const filtered: Project[] = useMemo(
    () =>
      matches.map((p) => ({
        id: p.id,
        name: p.name,
        private: true,
        status: statusForColumn(p.column),
      })),
    [matches],
  )

  const viewOptions = [
    { id: "list" as const, label: "List view", icon: Rows3 },
    { id: "grid" as const, label: "Grid view", icon: LayoutGrid },
    { id: "board" as const, label: "Board view", icon: Kanban },
  ]

  const create = (name: string) => {
    const id = `p-new-${Date.now()}`
    const project: KanbanProject = {
      id,
      name,
      column: "Preparing",
      owners: ["SH"],
    }
    setProjects((p) => [project, ...p])
    setModalOpen(false)
    toast(`Created project: ${name}`)
    addRecent({ id, title: name, href: `/projects/${id}` })
    router.push(`/projects/${id}?created=1`)
  }

  return (
    <PageContainer>
      <WorkspaceTabs base="/projects" />
      <div className="pt-6">
        <PageHeading
          title="Projects"
          subtitle="Your one-stop destination for streamlined bid writing projects."
          action={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your projects"
                  className="h-9 w-full min-w-[220px] rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
                {viewOptions.map((opt) => {
                  const active = view === opt.id
                  return (
                    <Tooltip key={opt.id} label={opt.label}>
                      <button
                        aria-label={opt.label}
                        aria-pressed={active}
                        onClick={() => setView(opt.id)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md transition-fast",
                          active
                            ? "bg-card text-[#0a0a0a] shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        style={active ? { color: "#0a0a0a", backgroundColor: "#BFFF0A" } : undefined}
                      >
                        <opt.icon className="h-[18px] w-[18px]" />
                      </button>
                    </Tooltip>
                  )
                })}
              </div>
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
                New Project
              </Button>
            </div>
          }
        />
        {view === "board" ? (
          <div className="mt-6">
            <ProjectsBoard
              projects={projects}
              onChange={setProjects}
              query={query}
              onNew={() => setModalOpen(true)}
            />
          </div>
        ) : view === "grid" ? (
          <div className={`${cardGrid} mt-6`}>
            <NewCard label="Project" onClick={() => setModalOpen(true)} />
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-lg border border-border bg-card">
            {filtered.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  addRecent({ id: p.id, title: p.name, href: `/projects/${p.id}` })
                  router.push(`/projects/${p.id}`)
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left transition-fast hover:bg-muted",
                  i > 0 && "border-t border-border",
                )}
              >
                <span className="text-[14px] font-medium text-foreground">{p.name}</span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <StatusDot status={p.status} size={12} />
                  {p.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={create}
      />
    </PageContainer>
  )
}
