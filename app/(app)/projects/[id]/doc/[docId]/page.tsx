"use client"

import { use } from "react"
import { DocumentEditor } from "@/components/document-editor"
import { PROJECTS } from "@/lib/data"

export default function ProjectDocPage({
  params,
}: {
  params: Promise<{ id: string; docId: string }>
}) {
  const { id } = use(params)
  const project = PROJECTS.find((p) => p.id === id)

  return (
    <DocumentEditor
      backHref={`/projects/${id}`}
      backLabel={project?.name ?? "Project"}
      title={`Document - ${new Date().toLocaleDateString("en-GB")}`}
    />
  )
}
