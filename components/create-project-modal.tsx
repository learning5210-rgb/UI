"use client"

import { useState, useMemo } from "react"
import { Modal, ModalClose, Button } from "./ui-kit"
import { PROJECTS } from "@/lib/data"
import { cn } from "@/lib/utils"

export function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState("")
  const [focused, setFocused] = useState(false)

  const suggestions = useMemo(() => {
    if (!name.trim()) return []
    return PROJECTS.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase()),
    ).slice(0, 5)
  }, [name])

  const reset = () => {
    setName("")
    setFocused(false)
  }

  const close = () => {
    reset()
    onClose()
  }

  const confirm = () => {
    if (!name.trim()) return
    onCreate(name.trim())
    reset()
  }

  return (
    <Modal open={open} onClose={close} labelledBy="create-project-title">
      <ModalClose onClose={close} />
      <h2 id="create-project-title" className="text-lg font-bold">
        Create A New Project
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Create a project to centralise all project information and requirements
        in one place. Projects are private by default, you can add team members
        later to collaborate and track progress in real-time.
      </p>

      <div className="relative mt-5">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
          placeholder="Enter project name"
          className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {focused && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg animate-slide-down">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onMouseDown={() => setName(s.name)}
                className="block w-full px-3 py-2 text-left text-[13px] transition-fast hover:bg-muted"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={close}>
          CANCEL
        </Button>
        <Button onClick={confirm} disabled={!name.trim()} className={cn(!name.trim() && "")}>
          CONFIRM
        </Button>
      </div>
    </Modal>
  )
}
