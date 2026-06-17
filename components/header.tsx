"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "./app-context"
import { Avatar, IconButton, useClickOutside } from "./ui-kit"
import {
  CURRENT_USER,
  WHATS_NEW,
  GUIDES,
} from "@/lib/data"
import {
  Megaphone,
  CircleUserRound,
  HandHelping,
  X,
  User,
  Settings,
  CreditCard,
  Users,
  Mail,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  MessageCircle,
  Keyboard,
  Play,
} from "lucide-react"

type Panel = "whats-new" | "profile" | "help" | null

export function Header() {
  const { collapsed } = useApp()
  const [panel, setPanel] = useState<Panel>(null)
  const ref = useClickOutside<HTMLDivElement>(() => setPanel(null), panel !== null)

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-14 items-center bg-sidebar transition-[left] duration-200 ease-out",
        collapsed ? "left-[60px]" : "left-[240px]",
      )}
    >
      <div className="flex flex-1 items-center px-6">
        <div className="flex-1" />
        <span className="text-[15px] font-semibold text-white">Pwinly</span>
        <div className="relative flex flex-1 items-center justify-end gap-1" ref={ref}>
          <HeaderIcon
            label="What's New"
            active={panel === "whats-new"}
            onClick={() => setPanel(panel === "whats-new" ? null : "whats-new")}
          >
            <Megaphone className="h-[18px] w-[18px]" />
          </HeaderIcon>
          <HeaderIcon
            label="Profile"
            active={panel === "profile"}
            onClick={() => setPanel(panel === "profile" ? null : "profile")}
          >
            <CircleUserRound className="h-[18px] w-[18px]" />
          </HeaderIcon>
          <HeaderIcon
            label="Help"
            active={panel === "help"}
            onClick={() => setPanel(panel === "help" ? null : "help")}
          >
            <HandHelping className="h-[18px] w-[18px]" />
          </HeaderIcon>

          {panel === "whats-new" && <WhatsNewPanel onClose={() => setPanel(null)} />}
          {panel === "profile" && <ProfilePanel onClose={() => setPanel(null)} />}
          {panel === "help" && <HelpPanel onClose={() => setPanel(null)} />}
        </div>
      </div>
    </header>
  )
}

function HeaderIcon({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <span className="group relative">
      <button
        aria-label={label}
        onClick={onClick}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md transition-fast",
          active
            ? "bg-white/15 text-white"
            : "text-sidebar-muted hover:bg-white/10 hover:text-white",
        )}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </span>
  )
}

function PanelShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute right-0 top-full mt-2 w-[340px] overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-2xl animate-slide-down",
        className,
      )}
    >
      {children}
    </div>
  )
}

function PanelHeader({
  title,
  onClose,
}: {
  title: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="text-sm font-semibold">{title}</div>
      <button
        aria-label="Close"
        onClick={onClose}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

const DOT_COLOR: Record<string, string> = {
  feature: "#7C3AED",
  improvement: "#10B981",
  bugfix: "#da2f35",
}

function WhatsNewPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell>
      <PanelHeader title="What's New" onClose={onClose} />
      <div className="max-h-[400px] divide-y divide-border overflow-y-auto scrollbar-thin">
        {WHATS_NEW.map((u) => (
          <div key={u.title} className="flex gap-3 px-4 py-3 transition-fast hover:bg-muted">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: DOT_COLOR[u.type] }}
            />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">{u.title}</p>
              <p className="text-[12px] leading-relaxed text-muted-foreground">{u.desc}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/70">{u.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-2.5 text-center">
        <button className="text-[13px] font-medium text-primary hover:underline">
          View all updates
        </button>
      </div>
    </PanelShell>
  )
}

const PROFILE_ITEMS = [
  { label: "Profile", icon: User },
  { label: "Account Settings", icon: Settings },
  { label: "Billing & Plans", icon: CreditCard },
  { label: "Team & Members", icon: Users },
  { label: "Emails & Domains", icon: Mail },
  { label: "Files & Images", icon: ImageIcon },
]

function ProfilePanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell className="w-[280px]">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Avatar initials={CURRENT_USER.initials} size={36} />
        <span className="truncate text-[13px] font-medium">{CURRENT_USER.email}</span>
      </div>
      <div className="py-1.5">
        {PROFILE_ITEMS.map((it) => (
          <button
            key={it.label}
            onClick={onClose}
            className="flex w-full items-center gap-3 px-4 py-2 text-[13px] transition-fast hover:bg-muted"
          >
            <it.icon className="h-4 w-4 text-muted-foreground" />
            {it.label}
          </button>
        ))}
        <div className="my-1.5 border-t border-border" />
        <button
          onClick={onClose}
          className="flex w-full items-center gap-3 px-4 py-2 text-[13px] font-medium text-destructive transition-fast hover:bg-destructive-bg"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </PanelShell>
  )
}

const HELP_LINKS = [
  { label: "Help Center", icon: ExternalLink },
  { label: "Contact Support", icon: MessageCircle },
  { label: "Keyboard Shortcuts", icon: Keyboard },
]

function HelpPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell>
      <PanelHeader title="Help & Support" onClose={onClose} />
      <div className="py-1.5">
        {HELP_LINKS.map((l) => (
          <button
            key={l.label}
            onClick={onClose}
            className="flex w-full items-center gap-3 px-4 py-2 text-[13px] transition-fast hover:bg-muted"
          >
            <l.icon className="h-4 w-4 text-muted-foreground" />
            {l.label}
          </button>
        ))}
      </div>
      <div className="border-t border-border px-4 py-3">
        <p className="text-[13px] font-semibold">Interactive Guides</p>
        <p className="text-[12px] text-muted-foreground">
          Step-by-step tutorials to learn the platform
        </p>
      </div>
      <div className="max-h-[260px] overflow-y-auto scrollbar-thin pb-1">
        {GUIDES.map((g) => (
          <button
            key={g.title}
            onClick={onClose}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-fast hover:bg-muted"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Play className="h-3.5 w-3.5 fill-current" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{g.title}</span>
              <span className="mt-1 flex items-center gap-2">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${(g.done / g.total) * 100}%` }}
                  />
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {g.done}/{g.total}
                </span>
              </span>
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">{g.time}</span>
          </button>
        ))}
      </div>
      <div className="border-t border-border px-4 py-2.5 text-center">
        <button className="text-[13px] font-medium text-primary hover:underline">
          Suggest a feature
        </button>
      </div>
    </PanelShell>
  )
}
