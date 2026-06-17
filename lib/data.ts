export type ProjectStatus =
  | "Preparing"
  | "Writing"
  | "In Review"
  | "Submitted"
  | "Won"
  | "Lost"
  | "Archived"

export const STATUS_META: Record<
  ProjectStatus,
  { color: string; label: string }
> = {
  Preparing: { color: "#3B82F6", label: "Preparing" },
  Writing: { color: "#3B82F6", label: "Writing" },
  "In Review": { color: "#D946EF", label: "In Review" },
  Submitted: { color: "#10B981", label: "Submitted" },
  Won: { color: "#10B981", label: "Won" },
  Lost: { color: "#da2f35", label: "Lost" },
  Archived: { color: "#6B7280", label: "Archived" },
}

export type DraftDoc = {
  id: string
  title: string
  words: number
  time: string
  content?: string
}

export type Project = {
  id: string
  name: string
  private: boolean
  status: ProjectStatus
  client?: string
}

export type AnswerEntry = {
  id: string
  question: string
  answer: string
  tags: string[]
}

export type LibraryFile = {
  id: string
  name: string
  type: "pdf" | "image" | "doc"
  updated: string
  updatedBy: string
  status: "Success"
  sizeKb: number
}

export type Workbook = {
  id: string
  name: string
  questions: number
  status: "Drafting" | "Completed" | "In Review"
  modified: string
  progress: number
}

export const CURRENT_USER = {
  email: "sheridan@pwinly.co.uk",
  initials: "SH",
}

export const DRAFTS: DraftDoc[] = [
  { id: "d-ai101", title: "AI 101", words: 1251, time: "now", content: "AI 101\n\nArtificial intelligence is transforming how proposals are written..." },
  { id: "d-config", title: "Configuration", words: 365, time: "14 min ago" },
  { id: "d-email", title: "Email template", words: 317, time: "14 min ago" },
  { id: "d-vid", title: "New vid idea - Extract", words: 23, time: "5 days ago" },
  { id: "d-fund", title: "Fundamentals - revmap", words: 22, time: "7 days ago" },
  { id: "d-mkt-adv", title: "Marketing Advanced session", words: 848, time: "9 days ago" },
  { id: "d-prompt", title: "Prompting guides", words: 529, time: "13 days ago" },
  { id: "d-guess", title: "AI 101 Guess that media", words: 207, time: "18 days ago" },
  { id: "d-llm", title: "LLM advancements", words: 1145, time: "20 days ago" },
  { id: "d-prompt-feat", title: "Prompting with different features", words: 320, time: "24 days ago" },
  { id: "d-sol", title: "Pwinly solution", words: 289, time: "24 days ago" },
  { id: "d-bid", title: "Pwinly bid draft", words: 493, time: "1 Aug 2024", content: "Pwinly supports marketers, researchers and proposal writers across the bid lifecycle [1]. For marketers, Pwinly accelerates the production of consistent, on-brand content [22]. For researchers, the platform aggregates evidence from multiple verified sources [4]. For proposal writers, Pwinly drafts structured responses mapped to scoring criteria [15][2][3]." },
  { id: "d-brief", title: "Marketing Brief", words: 600, time: "22 Jul 2024, 09:59", content: "Write a blog post on exploring how Pwinly's bespoke language engines can revolutionize corporate documentation processes by automating research, drafting and review." },
  { id: "d-lms", title: "LMS research group", words: 31, time: "20 Jul 2024" },
]

export const PROJECTS: Project[] = [
  { id: "p-1", name: "Project 1", private: true, status: "Preparing" },
  { id: "p-videos", name: "Videos", private: false, status: "Preparing" },
  { id: "p-sub", name: "Submission", private: true, status: "Preparing" },
  { id: "p-extract", name: "Extract Script", private: false, status: "Preparing" },
  { id: "p-example", name: "Example bid question", private: false, status: "Preparing" },
  { id: "p-sharing", name: "Sharing Workflows", private: false, status: "Writing" },
  { id: "p-sol", name: "Pwinly solution", private: false, status: "In Review" },
  { id: "p-pwinly", name: "Pwinly", private: true, status: "Preparing" },
  { id: "p-lms", name: "LMS Blog", private: false, status: "Preparing" },
]

export type KanbanColumnId =
  | "Preparing"
  | "Writing"
  | "Formal Review"
  | "Submitted"
  | "Won"

export type KanbanProject = {
  id: string
  name: string
  column: KanbanColumnId
  owners: string[]
  ownerOverflow?: number
  reviewers?: string[]
}

export const KANBAN_COLUMNS: {
  id: KanbanColumnId
  status: ProjectStatus
  color: string
}[] = [
  { id: "Preparing", status: "Preparing", color: "#3B82F6" },
  { id: "Writing", status: "Writing", color: "#7C3AED" },
  { id: "Formal Review", status: "In Review", color: "#D946EF" },
  { id: "Submitted", status: "Submitted", color: "#10B981" },
  { id: "Won", status: "Won", color: "#EC4899" },
]

export const KANBAN_PROJECTS: KanbanProject[] = [
  { id: "k-cheshire", name: "Cheshire Building Development Proposal", column: "Preparing", owners: ["LT"] },
  { id: "k-fullerton", name: "Fullerton Parking Development", column: "Preparing", owners: ["LT"] },
  { id: "k-pettiford", name: "Pettiford Avenue Clarkedale Corp", column: "Preparing", owners: ["LT"] },
  { id: "k-leavendon", name: "Leavendon Corp", column: "Preparing", owners: ["LT"] },
  { id: "k-cawdor", name: "Cawdor Lane Holdings", column: "Preparing", owners: ["AD"] },

  { id: "k-billingsgate", name: "Billingsgate Maintenance", column: "Writing", owners: ["LT"] },
  { id: "k-limegrove", name: "Lime Grove Industries", column: "Writing", owners: ["LT"] },
  { id: "k-harborne", name: "Harborne Quarter Regeneration", column: "Writing", owners: ["JB", "LT"] },

  { id: "k-buildproduct", name: "Build And Product", column: "Formal Review", owners: ["LT", "AD", "JB"], ownerOverflow: 8, reviewers: ["JB"] },
  { id: "k-mabel", name: "Mabel Lane Recreation Centre", column: "Formal Review", owners: ["LT"], reviewers: ["AD"] },
  { id: "k-minton", name: "Minton Street Centre", column: "Formal Review", owners: ["LT"] },

  { id: "k-liberty", name: "No. 42 Liberty Road", column: "Submitted", owners: ["LT"] },
  { id: "k-clifton", name: "Clifton Grange", column: "Submitted", owners: ["LT"] },

  { id: "k-langley", name: "Langley Street Development", column: "Won", owners: ["LT"] },
  { id: "k-marsden", name: "Marsden Court Estate", column: "Won", owners: ["AD"] },
]

/* Resolve a project by id from either the standard list or the Kanban board,
   normalising Kanban entries (which key off a column) into the Project shape. */
export function getProjectById(id: string): Project | undefined {
  const direct = PROJECTS.find((p) => p.id === id)
  if (direct) return direct
  const k = KANBAN_PROJECTS.find((p) => p.id === id)
  if (!k) return undefined
  const col = KANBAN_COLUMNS.find((c) => c.id === k.column)
  return { id: k.id, name: k.name, private: true, status: col?.status ?? "Preparing" }
}

/* Map a Kanban column to its canonical project status. */
export function statusForColumn(column: KanbanColumnId): ProjectStatus {
  return KANBAN_COLUMNS.find((c) => c.id === column)?.status ?? "Preparing"
}

export const ANSWER_BANK: AnswerEntry[] = [
  {
    id: "a-1",
    question: "Who gets the benefit of that intelligent model?",
    answer:
      "The intelligent model and any improvements derived from your usage remain owned by your organisation. Pwinly does not appropriate or resell customer-trained intelligence; the benefit accrues entirely to you.",
    tags: ["Infosec"],
  },
  {
    id: "a-2",
    question: "Does any of our IP get retained within the AI systems?",
    answer:
      "No. All third-party LLMs we use operate under contracted no-retention, no-learning clauses. Your intellectual property is never retained or used to train external models.",
    tags: ["Infosec", "LLM"],
  },
  {
    id: "a-3",
    question: "What's your process for onboarding new LLMs into your system?",
    answer:
      "New LLMs undergo a structured evaluation covering accuracy, safety, data-handling guarantees and contractual no-retention terms before being approved for production use.",
    tags: ["AI", "Compliance", "LLM"],
  },
  {
    id: "a-4",
    question: "When was the company registered",
    answer: "Pwinly Ltd was registered on 10th February 2022.",
    tags: ["Company", "UX"],
  },
  {
    id: "a-5",
    question:
      "If a user copies the answer to a question from the editor, how is that tracked?",
    answer:
      "Coach tips guide users to attribute and verify copied content. Copy actions surface inline source citations so writers retain provenance.",
    tags: ["User Coach Tips"],
  },
  {
    id: "a-6",
    question:
      "How is encryption deployed in the environment both in transit and at rest?",
    answer:
      "Data is encrypted in transit using TLS 1.2+ and at rest using AES-256. Key management follows industry standards with regular rotation.",
    tags: ["Data", "Encryption", "Standards"],
  },
  {
    id: "a-7",
    question: "What are our compliance accreditations?",
    answer: "ISO 27001 certification, SOC2 report, and Cyber Essentials Plus.",
    tags: ["Compliance", "Standards"],
  },
]

export const TAG_COLORS: Record<string, string> = {
  Infosec: "#3B82F6",
  LLM: "#7C3AED",
  AI: "#10B981",
  Compliance: "#F59E0B",
  Company: "#D946EF",
  UX: "#6B7280",
  "User Coach Tips": "#0891B2",
  Data: "#EC4899",
  Encryption: "#7C3AED",
  Standards: "#10B981",
}

export const LIBRARY_FILES: LibraryFile[] = [
  {
    id: "l-1",
    name: "Org Chart.jpg",
    type: "image",
    updated: "Oct 1, 2024",
    updatedBy: "darcy.myring@pwinly.co.uk",
    status: "Success",
    sizeKb: 412,
  },
  {
    id: "l-2",
    name: "T21-25 RFT FINAL.pdf",
    type: "pdf",
    updated: "Jan 31, 2025",
    updatedBy: "darcy.myring@pwinly.co.uk",
    status: "Success",
    sizeKb: 1120,
  },
]

export const WORKBOOKS: Workbook[] = [
  {
    id: "wb-1",
    name: "ITT_Q4_2024.xlsx",
    questions: 47,
    status: "Drafting",
    modified: "2 hours ago",
    progress: 38,
  },
  {
    id: "wb-2",
    name: "Health_Tender_Workbook.xlsx",
    questions: 124,
    status: "Completed",
    modified: "3 days ago",
    progress: 100,
  },
  {
    id: "wb-3",
    name: "Defence_Bid_QA.xlsx",
    questions: 89,
    status: "In Review",
    modified: "1 day ago",
    progress: 72,
  },
]

export type WorkbookRow = {
  n: number
  question: string
  answer: string
  confidence: "Exact Match" | "Near Match" | "Library AI"
  approved: boolean
}

export const WORKBOOK_ROWS: WorkbookRow[] = [
  {
    n: 1,
    question: "Where is your data hosted?",
    answer:
      "By default, Pwinly hosts its Language Engine services on UK cloud infrastructure. This means that both storage of data and provisioning of services will be in data centres located in the UK. Because our services are cloud-native, we can build and host services in other countries on demand, such that the service and any submitted data are stored in the agreed country. Pwinly uses a number of selected cloud-based Large Language Models, these are typically operated in the UK, US or EU and all have contracted no-retention, no-learning clauses. Customers with specific geographic preferences or requirements can be accommodated.",
    confidence: "Exact Match",
    approved: false,
  },
  {
    n: 2,
    question: "What training and support is provided?",
    answer:
      "Pwinly provides a structured onboarding programme, live training sessions, interactive in-app guides and ongoing support via dedicated channels.",
    confidence: "Exact Match",
    approved: false,
  },
  {
    n: 3,
    question: "What are our core values?",
    answer:
      "Our core values are integrity, customer obsession, security-first engineering, and relentless friction reduction across the bid workflow.",
    confidence: "Library AI",
    approved: false,
  },
  {
    n: 4,
    question: "What are your security credentials?",
    answer: "ISO 27001 certification, SOC2 report, and Cyber Essentials Plus.",
    confidence: "Near Match",
    approved: false,
  },
  {
    n: 5,
    question: "How can I get help in your system?",
    answer:
      "Help is available through the in-app Help Centre, contact support, interactive guides and keyboard shortcuts.",
    confidence: "Near Match",
    approved: false,
  },
  {
    n: 6,
    question: "Do you have a Data Protection Officer?",
    answer:
      "Yes, Pwinly has an appointed Data Protection Officer who can be reached at dpo@pwinly.co.uk.",
    confidence: "Near Match",
    approved: false,
  },
  {
    n: 7,
    question: "What is the registered address?",
    answer: "Pwinly Ltd, 128 City Road, London, EC1V 2NX, United Kingdom.",
    confidence: "Near Match",
    approved: false,
  },
]

export const IDEATOR_IDEAS = [
  { text: "Pwinly uses advanced algorithms to extract key information from various sources and create unique written content.", source: "Creative AI" },
  { text: "Pwinly utilizes AI to streamline the creation of bid documents across preparation, writing, and review stages.", source: "Internet AI" },
  { text: "Pwinly generates content using a custom document library, enabling the creation of tailored content.", source: "Library AI" },
  { text: "Pwinly integrates with various data sources to gather information and generate tailored content.", source: "Creative AI" },
  { text: "Pwinly mitigates the 'hallucination' problem in AI by verifying the sources of information.", source: "Library AI" },
  { text: "Using large language models, Pwinly analyses and learns from data to produce high-quality original content.", source: "Internet AI" },
  { text: "The information to generate content can be sourced from specific internet sites, thus promoting diversity in the content sources.", source: "Library AI" },
  { text: "The platform supports a unique combination of generative AI-native and bidding-first principles.", source: "Internet AI" },
] as const

export const AI_SOURCE_COLORS: Record<string, string> = {
  "Library AI": "#7C3AED",
  "Creative AI": "#10B981",
  "Internet AI": "#3B82F6",
}

export const WHATS_NEW = [
  { title: "Final Check v2.0", desc: "Enhanced AI-powered bid review with new criteria and faster processing.", time: "2 days ago", type: "feature" },
  { title: "Q&A Workbooks Launch", desc: "Bulk answer generation from Excel spreadsheets is now live.", time: "1 week ago", type: "feature" },
  { title: "Library AI Improvements", desc: "Better source matching and citation accuracy for generated content.", time: "2 weeks ago", type: "improvement" },
  { title: "New Editor Toolbar", desc: "Redesigned formatting tools with improved accessibility.", time: "3 weeks ago", type: "improvement" },
  { title: "Bug Fixes", desc: "Resolved issues with document auto-save and member permissions.", time: "1 month ago", type: "bugfix" },
] as const

export const GUIDES = [
  { title: "Getting Started with Pwinly", done: 0, total: 5, time: "5 min" },
  { title: "Creating Your First Project", done: 2, total: 5, time: "6 min" },
  { title: "Using the Document Editor", done: 1, total: 7, time: "8 min" },
  { title: "Final Check Walkthrough", done: 0, total: 4, time: "4 min" },
  { title: "Q&A Workbooks Tutorial", done: 0, total: 6, time: "7 min" },
] as const

export const RESEARCH_SOURCES = [
  { n: 1, label: "Leads from LinkedIn - Bid Writer openings - 1 month - United States" },
  { n: 2, label: "Leads from LinkedIn - Bid Writer openings - 1 month - United States" },
  { n: 3, label: "Onboarding Deliverables_Phase 2" },
  { n: 4, label: "Sean Bid" },
  { n: 5, label: "Email prompt template" },
  { n: 6, label: "Sean Bid" },
  { n: 10, label: "Sean Bid" },
  { n: 12, label: "Leads from LinkedIn - Bid Writer openings - 1 month - United States" },
  { n: 14, label: "Leads from LinkedIn - Bid Writer openings - 1 month - United States" },
  { n: 15, label: "Leads from LinkedIn - Bid Writer openings - 1 month - United States" },
  { n: 16, label: "Leads from LinkedIn - Bid Writer openings - 1 month - United States" },
]

export const LIBRARY_FOLDERS = [
  { name: "Case Studies", checked: true },
  { name: "Social Value", checked: false },
  { name: "Workforce solution", checked: false },
  { name: "Organisation Library", checked: false, expandable: true },
  { name: "Pwinly Hub", checked: true },
  { name: "Pwinly Proposal", checked: false },
  { name: "Bell", checked: false },
  { name: "Bus transport folder", checked: false },
  { name: "Chenega", checked: false },
  { name: "Construction - Engineering", checked: false },
  { name: "Defence - Logistics - Airline", checked: false },
  { name: "Employment Services", checked: false },
  { name: "Energy", checked: false },
  { name: "Energy & Utilities", checked: false },
  { name: "FM", checked: false },
  { name: "Finance", checked: false },
  { name: "Health and Med Tech", checked: false },
  { name: "Images to Parse", checked: false },
  { name: "Insurance", checked: false },
  { name: "Kindercare TEST", checked: false },
  { name: "Legal Verticals", checked: false },
  { name: "Marketing Services", checked: false },
  { name: "McKesson Test", checked: false },
  { name: "Net Zero Documents", checked: false },
  { name: "PacificSource", checked: false },
  { name: "Palantir", checked: false },
  { name: "Pharma", checked: false },
  { name: "Professional Services", checked: false },
  { name: "Research", checked: false },
  { name: "Rogers - Transport", checked: false },
  { name: "Rogers", checked: false },
  { name: "Security", checked: false },
  { name: "TCG", checked: false },
  { name: "TELUS", checked: false },
  { name: "Telecoms", checked: false },
]

export const FINAL_CHECK_SUGGESTIONS = [
  {
    tag: "EVIDENCING",
    quote: "Pwinly supports marketers, researchers and proposal writers across the bid lifecycle.",
    suggestion: "Strengthen this claim with a specific metric or proof point — for example, the percentage reduction in drafting time achieved by existing clients.",
    time: "3 seconds ago",
    section: "Paragraph 1",
  },
  {
    tag: "EVIDENCING",
    quote: "the platform aggregates evidence from multiple verified sources",
    suggestion: "Name the source categories (library documents, internet, creative) and add a citation count to demonstrate breadth of evidence.",
    time: "4 seconds ago",
    section: "Paragraph 1",
  },
  {
    tag: "ROBUSTNESS",
    quote: "Pwinly drafts structured responses mapped to scoring criteria",
    suggestion: "Be more persuasive — explain how mapping to scoring criteria directly improves evaluator scores and win rates.",
    time: "5 seconds ago",
    section: "Paragraph 1",
  },
  {
    tag: "EVIDENCING",
    quote: "accelerates the production of consistent, on-brand content",
    suggestion: "Add an illustrative example of an on-brand artefact produced, to make this tangible to the evaluator.",
    time: "6 seconds ago",
    section: "Paragraph 1",
  },
]
