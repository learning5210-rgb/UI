"use client"

import { cn } from "@/lib/utils"
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react"
import { Check, X, Circle, CircleDot, CheckCircle2 } from "lucide-react"
import { useApp } from "./app-context"
import { STATUS_META, type ProjectStatus } from "@/lib/data"

/* ---------- Status dot (shared across all views) ---------- */
export function StatusDot({
  status,
  size = 14,
}: {
  status: ProjectStatus
  size?: number
}) {
  const { color } = STATUS_META[status]
  const style = { width: size, height: size, color }

  if (status === "Preparing")
    return <Circle style={style} strokeWidth={2.5} aria-hidden />
  if (status === "In Review")
    return <CircleDot style={style} strokeWidth={2.5} aria-hidden />
  if (status === "Submitted" || status === "Won")
    return (
      <CheckCircle2
        style={style}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2.5}
        aria-hidden
      />
    )
  // Writing — outlined circle with a half-filled interior (matches Kanban board)
  if (status === "Writing")
    return (
      <span
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2"
        style={{ width: size, height: size, borderColor: color }}
        aria-hidden
      >
        <span
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{ backgroundColor: color }}
        />
      </span>
    )
  // Lost, Archived — solid filled circle
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
      aria-hidden
    />
  )
}

/* ---------- Button ---------- */
type BtnVariant = "primary" | "outline" | "ghost" | "danger"
type BtnSize = "sm" | "md"
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant
  size?: BtnSize
  icon?: ReactNode
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-fast active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
  const variants: Record<BtnVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
    outline:
      "border border-primary text-primary bg-transparent hover:bg-primary/5",
    ghost: "text-muted-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:bg-[#b91c1c]",
  }
  const sizes: Record<BtnSize, string> = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-9 px-4 text-sm",
  }
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
    </button>
  )
}

/* ---------- IconButton with Tooltip ---------- */
export function IconButton({
  label,
  children,
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  active?: boolean
}) {
  return (
    <Tooltip label={label}>
      <button
        aria-label={label}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted",
          active && "bg-primary/10 text-primary",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </Tooltip>
  )
}

/* ---------- Tooltip ---------- */
export function Tooltip({
  label,
  children,
  side = "bottom",
}: {
  label: string
  children: ReactNode
  side?: "bottom" | "top"
}) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#111111] px-2 py-1 text-[11px] font-medium text-white shadow-lg animate-fade-in",
            side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
          )}
        >
          {label}
        </span>
      )}
    </span>
  )
}

/* ---------- Pill / Tag ---------- */
export function Pill({
  children,
  color,
  className,
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        className,
      )}
      style={
        color
          ? { backgroundColor: `${color}1a`, color }
          : undefined
      }
    >
      {children}
    </span>
  )
}

/* ---------- Status badge ---------- */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">
      <StatusDot status={status} size={12} />
      {meta.label}
    </span>
  )
}

/* ---------- Avatar ---------- */
export function Avatar({
  initials,
  size = 28,
}: {
  initials: string
  size?: number
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  )
}

/* ---------- Toggle ---------- */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-fast",
        checked ? "bg-primary" : "bg-border",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-fast",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  )
}

/* ---------- Checkbox ---------- */
export function Checkbox({
  checked,
  onChange,
  className,
}: {
  checked: boolean
  onChange?: (v: boolean) => void
  className?: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-fast",
        checked
          ? "border-primary bg-primary text-white"
          : "border-border bg-white hover:border-primary/50",
        className,
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  )
}

/* ---------- Modal ---------- */
export function Modal({
  open,
  onClose,
  children,
  className,
  labelledBy,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  labelledBy?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-[600px] rounded-xl bg-card p-6 shadow-2xl animate-scale-in",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-label="Close"
      onClick={onClose}
      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted"
    >
      <X className="h-5 w-5" />
    </button>
  )
}

/* ---------- Toaster ---------- */
export function Toaster() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="fixed right-4 top-4 z-[200] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 rounded-lg border-l-4 bg-card px-4 py-3 shadow-lg animate-slide-down",
            t.variant === "success" ? "border-success" : "border-destructive",
          )}
        >
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full text-white",
              t.variant === "success" ? "bg-success" : "bg-destructive",
            )}
          >
            {t.variant === "success" ? (
              <Check className="h-3 w-3" strokeWidth={3} />
            ) : (
              <X className="h-3 w-3" strokeWidth={3} />
            )}
          </span>
          <span className="flex-1 text-sm font-medium text-foreground">
            {t.title}
          </span>
          <button
            aria-label="Dismiss"
            onClick={() => dismissToast(t.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

/* ---------- Dropdown menu (click outside) ---------- */
export function useClickOutside<T extends HTMLElement>(
  onClose: () => void,
  active: boolean,
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!active) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [active, onClose])
  return ref
}
