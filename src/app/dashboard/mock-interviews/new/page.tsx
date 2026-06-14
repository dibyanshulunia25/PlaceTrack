import { AddQuestionForm } from "@/components/mock-interviews/add-question-form"
import { getMockCompanies } from "@/actions/mock-interviews"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function NewMockQuestionPage({
  searchParams,
}: {
  searchParams: { companyId?: string }
}) {
  const companies = await getMockCompanies()
  const { companyId } = await searchParams

  return (
    <div className="max-w-3xl mx-auto py-4 pb-12">
      <Link href="/dashboard/mock-interviews" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Mock Hub
      </Link>
      
      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-border/50 rounded-2xl p-8 shadow-clay-light dark:shadow-none">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Contribute Interview Question</h1>
        <p className="text-muted-foreground mb-8">Share questions you were asked or practice questions you've found helpful to help others prepare.</p>
        
        <AddQuestionForm 
          companyId={companyId} 
          companies={companies.map(c => ({ id: c.id, name: c.name }))} 
        />
      </div>
    </div>
  )
}
