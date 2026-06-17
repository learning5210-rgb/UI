"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useApp } from "@/components/app-context"
import { Button, Checkbox, Toggle } from "@/components/ui-kit"
import { PageContainer, PageHeading } from "@/components/page-parts"
import { LIBRARY_FOLDERS } from "@/lib/data"
import { Pencil, ChevronRight, Check } from "lucide-react"

type FieldKey = "company" | "language"

export default function SettingsPage() {
  const { toast } = useApp()

  const [fields, setFields] = useState<Record<FieldKey, string>>({
    company: "Pwinly",
    language: "British English",
  })
  const [editing, setEditing] = useState<FieldKey | null>(null)

  const [editorSettings, setEditorSettings] = useState({
    wordCount: true,
    wordCountDiff: true,
    wordCountSelection: true,
  })
  const [cookies, setCookies] = useState(true)
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")

  const [libraryAI, setLibraryAI] = useState(true)
  const [folders, setFolders] = useState(
    LIBRARY_FOLDERS.map((f) => ({ ...f })),
  )

  const toggleFolder = (name: string) =>
    setFolders((prev) =>
      prev.map((f) => (f.name === name ? { ...f, checked: !f.checked } : f)),
    )

  const saveField = (key: FieldKey) => {
    setEditing(null)
    toast("Saved")
  }

  return (
    <PageContainer>
      <PageHeading
        title="Settings"
        subtitle="Manage your account preferences, editor behaviour and library sources."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column — General settings */}
        <div className="space-y-6">
          <Card title="General">
            <EditableRow
              label="Company name"
              value={fields.company}
              editing={editing === "company"}
              onEdit={() => setEditing("company")}
              onChange={(v) => setFields((p) => ({ ...p, company: v }))}
              onSave={() => saveField("company")}
            />
            <EditableRow
              label="Language"
              value={fields.language}
              editing={editing === "language"}
              onEdit={() => setEditing("language")}
              onChange={(v) => setFields((p) => ({ ...p, language: v }))}
              onSave={() => saveField("language")}
            />
          </Card>

          <Card title="Editor Settings">
            <ToggleRow
              label="Show word count in the editor"
              checked={editorSettings.wordCount}
              onChange={(v) => setEditorSettings((p) => ({ ...p, wordCount: v }))}
            />
            <ToggleRow
              label="Show word count difference for each option"
              checked={editorSettings.wordCountDiff}
              onChange={(v) => setEditorSettings((p) => ({ ...p, wordCountDiff: v }))}
            />
            <ToggleRow
              label="Show word count for selections"
              checked={editorSettings.wordCountSelection}
              onChange={(v) =>
                setEditorSettings((p) => ({ ...p, wordCountSelection: v }))
              }
            />
          </Card>

          <Card title="Cookie Preferences">
            <ToggleRow
              label="Allow essential and analytics cookies"
              checked={cookies}
              onChange={setCookies}
            />
          </Card>

          <Card title="Change Password">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="current-pw"
                  className="mb-1.5 block text-[13px] font-medium text-foreground"
                >
                  Current Password
                </label>
                <input
                  id="current-pw"
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="h-9 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="new-pw"
                  className="mb-1.5 block text-[13px] font-medium text-foreground"
                >
                  New Password
                </label>
                <input
                  id="new-pw"
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  className="h-9 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition-fast focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                  Your new password must be at least 8 characters and should be
                  different from your current password.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (newPw.length < 8) {
                    toast("Password must be at least 8 characters", "error")
                    return
                  }
                  setCurrentPw("")
                  setNewPw("")
                  toast("Password updated")
                }}
              >
                Update Password
              </Button>
            </div>
          </Card>
        </div>

        {/* Right column — Library settings */}
        <div className="space-y-6">
          <Card title="Library AI">
            <ToggleRow
              label="Generate using specified resources"
              checked={libraryAI}
              onChange={setLibraryAI}
            />
            {libraryAI && (
              <div className="mt-4 animate-slide-down">
                <p className="mb-3 text-[13px] font-medium text-foreground">
                  Please select the sources you want Library AI to use:
                </p>
                <div className="max-h-[420px] overflow-y-auto scrollbar-thin rounded-lg border border-border">
                  {folders.map((folder) => (
                    <label
                      key={folder.name}
                      className="flex items-center gap-2.5 border-b border-border px-3 py-2 transition-fast last:border-b-0 hover:bg-secondary"
                    >
                      <Checkbox
                        checked={folder.checked}
                        onChange={() => toggleFolder(folder.name)}
                      />
                      {folder.expandable && (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          "text-[13px] text-foreground",
                          !folder.expandable && "ml-0",
                        )}
                      >
                        {folder.name}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-muted-foreground">
                  {folders.filter((f) => f.checked).length} of {folders.length} sources
                  selected
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-[15px] font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function EditableRow({
  label,
  value,
  editing,
  onEdit,
  onChange,
  onSave,
}: {
  label: string
  value: string
  editing: boolean
  onEdit: () => void
  onChange: (v: string) => void
  onSave: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
      {editing ? (
        <div className="flex items-center gap-1.5">
          <input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            className="h-8 rounded-md border border-border bg-white px-2.5 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            aria-label="Save"
            onClick={onSave}
            className="flex h-8 w-8 items-center justify-center rounded-md text-primary transition-fast hover:bg-primary/10"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">{value}</span>
          <button
            aria-label={`Edit ${label}`}
            onClick={onEdit}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-fast hover:bg-muted hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[13px] text-foreground">{label}</span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
