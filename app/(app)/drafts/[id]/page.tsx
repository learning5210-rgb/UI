"use client"

import { use } from "react"
import { DocumentEditor } from "@/components/document-editor"
import { DRAFTS } from "@/lib/data"

export default function DraftEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const doc = DRAFTS.find((d) => d.id === id)

  return (
    <DocumentEditor
      backHref="/drafts"
      backLabel="Drafts"
      title={doc?.title ?? "Untitled Document"}
      initialContent={doc?.content ?? ""}
    />
  )
}
