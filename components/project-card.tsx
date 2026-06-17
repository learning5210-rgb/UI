"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "./app-context"
import { useClickOutside, StatusBadge } from "./ui-kit"
import type { Project } from "@/lib/data"
import { Lock, Users, MoreVertical, Pencil, Trash2, Settings2 } from "lucide-react"

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()
  const { toast, addRecent } = useApp()
  const [menu, setMenu] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setMenu(false), menu)

  const open = () => {
    addRecent({ id: project.id, title: project.name, href: `/projects/${project.id}` })
    router.push(`/projects/${project.id}`)
  }

  return (
    <div
      onClick={open}
      className="group relative flex min-h-[132px] cursor-pointer flex-col rounded-lg border border-border bg-card p-4 transition-fast hover:border-primary/40 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {project.private ? (
            <Lock className="h-[18px] w-[18px]" />
          ) : (
            <Users className="h-[18px] w-[18px]" />
          )}
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
      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
        {project.name}
      </h3>
      <div className="mt-auto pt-3">
        <StatusBadge status={project.status} />
      </div>
    </div>
  )
}
