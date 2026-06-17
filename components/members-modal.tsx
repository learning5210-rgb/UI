"use client"

import { useState } from "react"
import { Modal, ModalClose, Button, Avatar } from "./ui-kit"
import { CURRENT_USER } from "@/lib/data"
import { ChevronDown } from "lucide-react"

type Role = "Admin" | "Contributor" | "Viewer"

export function MembersModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("Viewer")
  const [roleOpen, setRoleOpen] = useState(false)
  const [members, setMembers] = useState([
    { email: CURRENT_USER.email, role: "Admin" as Role },
  ])

  const add = () => {
    if (!email.trim()) return
    setMembers((m) => [...m, { email: email.trim(), role }])
    setEmail("")
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="members-title" className="max-w-[560px]">
      <ModalClose onClose={onClose} />
      <h2 id="members-title" className="text-lg font-bold">
        Members
      </h2>

      <div className="mt-5">
        <p className="text-[13px] font-medium text-foreground">Add people</p>
        <div className="mt-2 flex flex-wrap items-stretch gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter an email address"
            className="h-9 min-w-[180px] flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="relative">
            <button
              onClick={() => setRoleOpen((o) => !o)}
              className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm transition-fast hover:bg-muted"
            >
              {role}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {roleOpen && (
              <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-md border border-border bg-card py-1 shadow-lg animate-slide-down">
                {(["Admin", "Contributor", "Viewer"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r)
                      setRoleOpen(false)
                    }}
                    className="block w-full px-3 py-2 text-left text-[13px] transition-fast hover:bg-muted"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={add} disabled={!email.trim()} size="sm" className="h-9">
            ADD
          </Button>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          Project viewers can only view documents. By adding someone to your
          project, you will give them edit access to all relevant information and
          allow them to add new people to a project.
        </p>
      </div>

      <div className="mt-5 rounded-lg border border-border">
        {members.map((m) => (
          <div
            key={m.email}
            className="flex items-center justify-between border-b border-border px-3 py-2.5 last:border-b-0"
          >
            <div className="flex items-center gap-2.5">
              <Avatar initials={m.email.slice(0, 2).toUpperCase()} size={28} />
              <span className="text-[13px]">{m.email}</span>
            </div>
            <span className="text-[12px] font-medium text-muted-foreground">
              {m.role}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" className="text-primary" onClick={onClose}>
          CANCEL
        </Button>
        <Button onClick={onClose}>CONFIRM</Button>
      </div>
    </Modal>
  )
}
