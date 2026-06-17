"use client"

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react"

type Toast = {
  id: number
  title: string
  variant: "success" | "error"
}

type RecentItem = { id: string; title: string; href: string }

type AppCtx = {
  collapsed: boolean
  toggleCollapsed: () => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  toasts: Toast[]
  toast: (title: string, variant?: "success" | "error") => void
  dismissToast: (id: number) => void
  recent: RecentItem[]
  addRecent: (item: RecentItem) => void
}

const Ctx = createContext<AppCtx | null>(null)

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [recent, setRecent] = useState<RecentItem[]>([
    { id: "d-ai101", title: "AI 101", href: "/drafts" },
  ])

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (title: string, variant: "success" | "error" = "success") => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, title, variant }])
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, 4000)
    },
    [],
  )

  const addRecent = useCallback((item: RecentItem) => {
    setRecent((r) => {
      const next = [item, ...r.filter((x) => x.id !== item.id)]
      return next.slice(0, 5)
    })
  }, [])

  return (
    <Ctx.Provider
      value={{
        collapsed,
        toggleCollapsed: () => setCollapsed((c) => !c),
        searchOpen,
        setSearchOpen,
        toasts,
        toast,
        dismissToast,
        recent,
        addRecent,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
