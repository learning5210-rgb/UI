"use client"

import type { ReactNode } from "react"
import { Info, FolderKanban, FileText, Lightbulb } from "lucide-react"
import { PageContainer, PageHeading, WorkspaceTabs } from "@/components/page-parts"

export default function InputsPage() {
  return (
    <PageContainer>
      <WorkspaceTabs base="/answer-bank" />
      <div className="pt-6">
        <PageHeading
          title="Inputs"
          subtitle="Project and Draft-level inputs to streamline your bid workflow with consistent resources across your team."
        />

        {/* About panel */}
        <div className="mt-6 flex gap-4 rounded-xl border border-border bg-primary/5 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-foreground">About Inputs</h2>
            <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
              Project and Draft-level inputs are designed to facilitate bid teams utilising
              consistent inputs and linguistic resources across the board. This not only aids in
              crafting winning bids but also streamlines the bid workflow. You can make use of draft
              and project-level inputs while creating your document. You can use the
              {" "}&quot;incorporate&quot; transformation to access the inputs.
            </p>
          </div>
        </div>

        {/* Two how-to sections */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <HowToCard
            icon={<FolderKanban className="h-5 w-5 text-primary" />}
            heading="How to create Inputs in the Projects tab"
            steps={PROJECT_STEPS}
          />
          <HowToCard
            icon={<FileText className="h-5 w-5 text-primary" />}
            heading="How to create Inputs from the Drafts tab"
            steps={DRAFT_STEPS}
          />
        </div>

        {/* Tip footer */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
          <Lightbulb className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Separate your text by line breaks so each entry becomes its own bullet point, then use
            the <span className="font-semibold text-foreground">incorporate</span> transformation in
            the editor to pull these inputs into your draft.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}

const PROJECT_STEPS = [
  "Click on your desired project. Select a project. Then click the inputs button on the left-hand side of the project's dashboard.",
  'Click the "+ Information" button to create a new set of inputs.',
  "Click the text box and paste the inputs you want to create. You can separate the text by line breaks so they create separate bullet points.",
  "Click the arrow to create your desired inputs.",
]

const DRAFT_STEPS = [
  'You can find inputs in the Drafts tab by clicking on "Inputs" in the top right corner of the page.',
  'Click the "+ Input" button to create a new set of inputs. From here, follow the same process from above.',
]

function HowToCard({
  icon,
  heading,
  steps,
}: {
  icon: ReactNode
  heading: string
  steps: string[]
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">{icon}</div>
        <h3 className="text-[15px] font-bold text-foreground">{heading}</h3>
      </div>
      <p className="mt-4 text-[13px] font-semibold text-foreground">To start:</p>
      <ol className="mt-3 flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
              {i + 1}
            </span>
            <p className="pt-0.5 text-[13px] leading-relaxed text-muted-foreground">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
