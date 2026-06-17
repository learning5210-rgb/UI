"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "./app-context"
import { PwinlyMark } from "./pwinly-mark"
import { Tooltip } from "./ui-kit"
import {
  LayoutGrid,
  FileText,
  FolderOutput,
  Atom,
  Lightbulb,
  BriefcaseBusiness,
  Library,
  Settings,
  Search,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose,
  FileClock,
} from "lucide-react"

const NAV_TOP = [
  { label: "Projects", href: "/projects", icon: LayoutGrid },
  { label: "Drafts", href: "/drafts", icon: FileText },
  { label: "Extract", href: "/extract", icon: FolderOutput },
  { label: "Research", href: "/research", icon: Atom },
  { label: "Ideator", href: "/ideator", icon: Lightbulb },
]

const NAV_BOTTOM = [
  { label: "Answer Bank", href: "/answer-bank", icon: BriefcaseBusiness },
  { label: "Library", href: "/library", icon: Library },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const { collapsed, toggleCollapsed, setSearchOpen, recent } = useApp()
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[240px]",
      )}
    >
      {/* Logo box */}
      <div
        className={cn(
          "flex h-14 items-center",
          collapsed ? "justify-center px-0" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <Link href="/projects" className="flex items-center gap-2">
            <PwinlyMark />
            <span className="text-lg font-bold tracking-tight">Pwinly</span>
          </Link>
        )}
        <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleCollapsed}
            className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-muted transition-fast hover:bg-white/10 hover:text-white"
          >
            {collapsed ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <ChevronsLeft className="h-5 w-5" />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Search */}
      <div className={cn("px-3 pb-2", collapsed && "px-0 flex justify-center")}>
        {collapsed ? (
          <Tooltip label="Search   ⌘⇧F">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-muted transition-fast hover:bg-white/10 hover:text-white"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left text-[13px] text-sidebar-muted transition-fast hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1">Search…</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium">
              ⌘⇧F
            </kbd>
          </button>
        )}
      </div>

      {/* Top nav */}
      <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Primary">
        {NAV_TOP.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Recently opened */}
      {!collapsed && recent.length > 0 && (
        <div className="px-3 py-2">
          <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-sidebar-muted/70">
            Recently Opened
          </p>
          <div className="flex flex-col gap-0.5">
            {recent.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="flex items-center gap-2 truncate rounded-md px-2 py-1.5 text-[13px] text-sidebar-muted transition-fast hover:bg-white/5 hover:text-white"
              >
                <FileClock className="h-4 w-4 shrink-0" />
                <span className="truncate">{r.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* Bottom nav */}
      <nav className="flex flex-col gap-1 px-3 pb-4 pt-2" aria-label="Secondary">
        {NAV_BOTTOM.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={isActive(item.href)}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  )
}

function NavItem({
  label,
  href,
  icon: Icon,
  active,
  collapsed,
}: {
  label: string
  href: string
  icon: typeof LayoutGrid
  active: boolean
  collapsed: boolean
}) {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md text-[14px] font-medium transition-fast",
        collapsed ? "h-9 w-9 justify-center" : "gap-3 px-3 py-2",
        active
          ? "bg-primary text-white"
          : "text-sidebar-muted hover:bg-white/5 hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
  if (collapsed) return <Tooltip label={label}>{content}</Tooltip>
  return content
}

export { PanelLeftClose }
