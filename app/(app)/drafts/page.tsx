"use client"

import { useState } from "react"
import { useApp } from "@/components/app-context"
import { PageContainer, PageHeading } from "@/components/page-parts"
import { WorkspaceTabs } from "@/components/page-parts"
import { DocumentCard, NewCard, cardGrid } from "@/components/document-card"
import { DRAFTS } from "@/lib/data"
import { useRouter } from "next/navigation"

export default function DraftsPage() {
  const { toast, addRecent } = useApp()
  const router = useRouter()
  const [docs] = useState(DRAFTS)

  const createDoc = () => {
    const id = `d-new-${Date.now()}`
    const title = `Document - ${new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}, ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
    addRecent({ id, title, href: `/drafts/${id}` })
    toast(`Created draft: ${title}`)
    router.push(`/drafts/${id}`)
  }

  return (
    <PageContainer>
      <WorkspaceTabs base="/drafts" />
      <div className="pt-6">
        <PageHeading
          title="Drafts"
          subtitle="Your private space to keep personal documents secure, and only accessible to you."
        />
        <div className={`${cardGrid} mt-6`}>
          <NewCard label="Document" onClick={createDoc} />
          {docs.map((d) => (
            <DocumentCard key={d.id} doc={d} />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
