"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "./app-context"
import { useClickOutside } from "./ui-kit"
import { cn } from "@/lib/utils"
import {
  KANBAN_COLUMNS,
  avatarColor,
  type KanbanProject,
  type KanbanColumnId,
} from "@/lib/data"
import {
  Circle,
  CircleDot,
  CheckCircle2,
  MoreVertical,
  Pencil,
  Settings2,
  Trash2,
  Plus,
} from "lucide-react"

/* ---------- Column header icon ---------- */
function ColumnIcon({ id, color }: { id: KanbanColumnId; color: string }) {
  // Submitted — solid filled green circle with a white check
  if (id === "Submitted")
    return (
      <CheckCircle2
        className="h-4 w-4"
        style={{ color }}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2.5}
      />
    )
  // Won — solid filled pink/magenta circle with a white check symbol inside
  if (id === "Won")
    return (
      <CheckCircle2
        className="h-4 w-4"
        style={{ color }}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2.5}
      />
    )
  // Formal Review (In Review) — magenta outlined ring with a smaller inner circle (ring within a ring)
  if (id === "Formal Review")
    return <CircleDot className="h-4 w-4" style={{ color }} strokeWidth={2.5} />
  // Writing — outlined circle with a partially filled (half) interior
  if (id === "Writing")
    return (
      <span
        className="relative inline-flex h-3.5 w-3.5 items-center justify-center overflow-hidden rounded-full border-2"
        style={{ borderColor: color }}
        aria-hidden
      >
        <span
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{ backgroundColor: color }}
        />
      </span>
    )
  // Preparing — hollow/empty circle with a blue outline only, no fill
  return <Circle className="h-4 w-4" style={{ color }} strokeWidth={2.5} />
}

/* ---------- Avatar stack ---------- */
function AvatarStack({
  people,
  overflow,
}: {
  people: string[]
  overflow?: number
}) {
  return (
    <span className="flex items-center -space-x-1.5">
      {people.map((p, i) => {
        const c = avatarColor(p)
        return (
          <span
            key={`${p}-${i}`}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-card text-[9px] font-semibold"
            style={{ backgroundColor: c.bg, color: c.fg }}
          >
            {p}
          </span>
        )
      })}
      {overflow ? (
        <span className="inline-flex h-6 items-center justify-center rounded-full border-2 border-card bg-muted px-1.5 text-[9px] font-semibold text-muted-foreground">
          +{overflow}
        </span>
      ) : null}
    </span>
  )
}

/* ---------- Project card ---------- */
function BoardCard({
  project,
  onDragStart,
  onDragEnter,
  onDrop,
  onDragEnd,
  dragging,
  dropTarget,
}: {
  project: KanbanProject
  onDragStart: () => void
  onDragEnter: () => void
  onDrop: () => void
  onDragEnd: () => void
  dragging: boolean
  dropTarget: boolean
}) {  const router = useRouter()
  const { toast, addRecent } = useApp()
  const [menu, setMenu] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setMenu(false), menu)

  const open = () => {
    addRecent({ id: project.id, title: project.name, href: `/projects/${project.id}` })
    router.push(`/projects/${project.id}`)
  }

  const ownerLabel = project.owners.length > 1 ? "Owners" : "Owner"

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move"
        onDragStart()
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        onDragEnter()
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onDrop()
      }}
      onDragEnd={onDragEnd}
      onClick={open}
      className={cn(
        "group cursor-pointer rounded-lg border border-border bg-card transition-all duration-150",
        // Resting 3D lift — subtle elevation off the board background
        "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_3px_6px_-2px_rgba(0,0,0,0.12)]",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.18)]",
        // Pronounced 3D lift while being dragged in any direction
        dragging &&
          "-translate-y-1 rotate-2 scale-[1.03] border-primary/60 opacity-90 shadow-[0_18px_40px_-8px_rgba(0,0,0,0.45)]",
        dropTarget && "border-primary ring-2 ring-primary/30",
      )}
    >
      <div className="p-3.5">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground">
          {project.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">{ownerLabel}</span>
          <AvatarStack people={project.owners} overflow={project.ownerOverflow} />
        </div>
        {project.reviewers && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Reviewers</span>
            <AvatarStack people={project.reviewers} />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-1 border-t border-border px-3 py-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          Open
        </span>
        <div className="relative" ref={ref}>
          <button
            aria-label="Card options"
            onClick={(e) => {
              e.stopPropagation()
              setMenu((m) => !m)
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-7 z-20 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down"
            >
              {[
                { label: "Rename", icon: Pencil },
                { label: "Manage", icon: Settings2 },
              ].map((it) => (
                <button
                  key={it.label}
                  onClick={() => {
                    setMenu(false)
                    toast(`${it.label}: ${project.name}`)
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
                  toast(`Deleted ${project.name}`, "error")
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
    </div>
  )
}

/* ---------- Column header menu ---------- */
function ColumnMenu({ name }: { name: string }) {
  const { toast } = useApp()
  const [menu, setMenu] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setMenu(false), menu)
  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Column options"
        onClick={() => setMenu((m) => !m)}
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-border/60"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {menu && (
        <div className="absolute right-0 top-7 z-20 w-44 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg animate-slide-down">
          {["Rename column", "Set limit", "Hide column"].map((label) => (
            <button
              key={label}
              onClick={() => {
                setMenu(false)
                toast(`${label}: ${name}`)
              }}
              className="flex w-full items-center px-3 py-2 text-[13px] transition-fast hover:bg-muted"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectsBoard({
  projects,
  onChange,
  query = "",
  onNew,
}: {
  projects: KanbanProject[]
  onChange: (next: KanbanProject[]) => void
  query?: string
  onNew: () => void
}) {
  const { toast } = useApp()
  // id of the card currently being dragged
  const [draggingId, setDraggingId] = useState<string | null>(null)
  // id of the card we are hovering over as a drop target
  const [overId, setOverId] = useState<string | null>(null)
  // id of the column we are hovering over (for empty-column / end-of-column drops)
  const [overColumn, setOverColumn] = useState<KanbanColumnId | null>(null)

  const matchesQuery = (p: KanbanProject) =>
    p.name.toLowerCase().includes(query.toLowerCase())

  const reset = () => {
    setDraggingId(null)
    setOverId(null)
    setOverColumn(null)
  }

  /* Drop dragged card directly before the target card. Handles both
     horizontal (status change) and vertical (priority reorder) moves. */
  const dropOnCard = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return reset()
    const dragged = projects.find((p) => p.id === draggingId)
    const target = projects.find((p) => p.id === targetId)
    if (!dragged || !target) return reset()

    const next = projects.filter((p) => p.id !== draggingId)
    const insertAt = next.findIndex((p) => p.id === targetId)
    const moved = { ...dragged, column: target.column }
    next.splice(insertAt, 0, moved)
    onChange(next)
    if (dragged.column !== target.column) {
      const col = KANBAN_COLUMNS.find((c) => c.id === target.column)
      toast(`${dragged.name} → ${col?.status ?? target.column}`)
    } else {
      toast(`Reordered: ${dragged.name}`)
    }
    reset()
  }

  /* Drop onto a column (append to the end / move into an empty column). */
  const dropOnColumn = (columnId: KanbanColumnId) => {
    if (!draggingId) return reset()
    const dragged = projects.find((p) => p.id === draggingId)
    if (!dragged) return reset()
    if (overId) return // a card target already handled the drop

    const next = projects.filter((p) => p.id !== draggingId)
    const moved = { ...dragged, column: columnId }
    // insert after the last card belonging to this column
    let lastIdx = -1
    next.forEach((p, i) => {
      if (p.column === columnId) lastIdx = i
    })
    next.splice(lastIdx + 1, 0, moved)
    onChange(next)
    if (dragged.column !== columnId) {
      const col = KANBAN_COLUMNS.find((c) => c.id === columnId)
      toast(`${dragged.name} → ${col?.status ?? columnId}`)
    }
    reset()
  }

  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-4 scrollbar-thin">
      <div className="flex w-full gap-4">
        {KANBAN_COLUMNS.map((col) => {
          const items = projects.filter((p) => p.column === col.id)
          const visible = items.filter(matchesQuery)
          return (
            <div
              key={col.id}
              onDragEnter={() => {
                setOverColumn(col.id)
                setOverId(null)
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropOnColumn(col.id)}
              className={cn(
                "flex min-w-0 flex-1 flex-col rounded-xl bg-secondary transition-fast",
                overColumn === col.id && draggingId && "ring-2 ring-primary/30",
              )}
            >
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2">
                  <ColumnIcon id={col.id} color={col.color} />
                  <span className="text-[13px] font-semibold text-foreground">
                    {col.id}
                  </span>
                  <span className="text-[12px] font-medium text-muted-foreground">
                    {visible.length}
                  </span>
                </div>
                <ColumnMenu name={col.id} />
              </div>
              <div className="flex flex-col gap-2.5 px-2.5 pb-2.5">
                {visible.map((p) => (
                  <BoardCard
                    key={p.id}
                    project={p}
                    dragging={draggingId === p.id}
                    dropTarget={overId === p.id && draggingId !== p.id}
                    onDragStart={() => setDraggingId(p.id)}
                    onDragEnter={() => {
                      setOverId(p.id)
                      setOverColumn(col.id)
                    }}
                    onDrop={() => dropOnCard(p.id)}
                    onDragEnd={reset}
                  />
                ))}
                <button
                  onClick={onNew}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-[12px] font-medium text-muted-foreground transition-fast hover:border-primary/40 hover:text-primary",
                  )}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add project
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
