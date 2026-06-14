import { prisma } from "@/lib/prisma"
import { PracticeFlashcards } from "@/components/mock-interviews/practice-flashcards"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function PracticeSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const companyName = typeof params.company === 'string' ? params.company : undefined
  const category = typeof params.category === 'string' ? params.category : undefined

  if (!companyName) {
    notFound()
  }

  const company = await prisma.company.findUnique({
    where: { name: companyName },
    include: {
      mockQuestions: {
        where: category ? { category } : undefined,
      }
    }
  })

  if (!company) {
    notFound()
  }

  // Shuffle questions randomly
  const questions = [...company.mockQuestions].sort(() => 0.5 - Math.random())

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <PracticeFlashcards questions={questions} companyName={company.name} />
    </div>
  )
}
