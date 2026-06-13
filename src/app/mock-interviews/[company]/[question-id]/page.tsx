import { getMockQuestionDetails } from "@/actions/mock-interviews"
import { notFound } from "next/navigation"
import { BrainCircuit, Building2, User, HelpCircle, Lightbulb, Copy, Share, Bookmark } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function MockQuestionDetailPage({
  params
}: {
  params: { company: string, "question-id": string }
}) {
  const p = await params
  const questionId = p["question-id"]
  
  const question = await getMockQuestionDetails(questionId)

  if (!question) {
    notFound()
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Top Nav */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/10">
        <Link href="/mock-interviews" className="hover:text-primary transition-colors">Mock Hub</Link>
        <span>/</span>
        <Link href={`/mock-interviews/${encodeURIComponent(question.company.name)}`} className="hover:text-primary transition-colors flex items-center gap-1">
          {question.company.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Question</span>
      </div>

      {/* Question Card */}
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-clay-md overflow-hidden">
        <div className="p-8 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                {question.category}
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                {question.role}
              </span>
              <span className="px-3 py-1 bg-white/10 text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10">
                Difficulty: {question.difficulty}/5
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors tooltip-trigger group relative">
                <Copy className="size-4 text-muted-foreground group-hover:text-foreground" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Copy Question</span>
              </button>
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors tooltip-trigger group relative">
                <Bookmark className="size-4 text-muted-foreground group-hover:text-foreground" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Bookmark</span>
              </button>
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors tooltip-trigger group relative">
                <Share className="size-4 text-muted-foreground group-hover:text-foreground" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Share</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl mt-1 shrink-0">
              <HelpCircle className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {question.question}
            </h1>
          </div>

          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pl-14">
              {question.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-white/5 text-muted-foreground rounded-md text-xs font-medium border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Answer Section */}
        <div className="p-8 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Lightbulb className="size-5 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold">Community Answer</h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap pl-12">
            {question.answer}
          </div>

          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/20 dark:bg-white/10 overflow-hidden">
                {question.user.image ? (
                  <img src={question.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="size-full p-2 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold">{question.user.name}</p>
                <p className="text-xs text-muted-foreground">Contributor</p>
              </div>
            </div>

            <Link 
              href={`/mock-interviews/practice?company=${encodeURIComponent(question.company.name)}&category=${encodeURIComponent(question.category)}`}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold transition-colors text-sm border border-primary/20"
            >
              Practice More Like This
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
