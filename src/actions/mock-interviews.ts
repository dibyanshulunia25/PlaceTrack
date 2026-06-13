"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { MockQuestionSchema, PracticeSessionSchema } from "@/lib/validations"
import { experienceSubmissionLimit } from "@/lib/ratelimit"
import { Logger } from "@/lib/logger"

export async function getMockCompanies() {
  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: { mockQuestions: true, practiceSessions: true }
      },
      mockQuestions: {
        select: { userId: true, difficulty: true }
      }
    }
  })

  return companies.map(company => {
    const uniqueContributors = new Set(company.mockQuestions.map(mq => mq.userId)).size
    const totalPracticeSessions = company._count.practiceSessions
    
    return {
      id: company.id,
      name: company.name,
      logo: company.logo,
      totalQuestions: company._count.mockQuestions,
      totalContributors: uniqueContributors,
      totalPracticeSessions,
      mockQuestions: company.mockQuestions
    }
  }).sort((a, b) => b.totalQuestions - a.totalQuestions)
}

export async function getCompanyMockHub(companyName: string) {
  const company = await prisma.company.findUnique({
    where: { name: companyName },
    include: {
      mockQuestions: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, image: true } }
        }
      }
    }
  })

  return company
}

export async function getMockQuestionDetails(questionId: string) {
  return await prisma.mockQuestion.findUnique({
    where: { id: questionId },
    include: {
      user: { select: { name: true, image: true } },
      company: { select: { name: true, logo: true } }
    }
  })
}



export async function createMockQuestion(rawData: {
  companyId: string
  role: string
  category: string
  question: string
  answer: string
  difficulty: number
  tags: string[]
}) {
  const { userId } = await auth()
  if (!userId) {
    Logger.warning("Unauthorized Access Attempt", { tag: "auth", action: "createMockQuestion" })
    throw new Error("Unauthorized")
  }

  // Rate Limiting
  const { success } = await experienceSubmissionLimit.limit(userId)
  if (!success) {
    throw new Error("Rate limit exceeded. Please try again later.")
  }

  // Validation
  const data = MockQuestionSchema.parse(rawData)

  try {
    const mockQ = await prisma.mockQuestion.create({
      data: {
        ...data,
        userId
      }
    })

    revalidatePath(`/mock-interviews`)
    return mockQ
  } catch (error) {
    Logger.error(error instanceof Error ? error : new Error(String(error)), { tag: "database", action: "createMockQuestion" })
    throw new Error("Failed to create mock question")
  }
}

export async function savePracticeSession(rawData: {
  companyId?: string
  score: number
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Validation
  const data = PracticeSessionSchema.parse(rawData)

  await prisma.practiceSession.create({
    data: {
      userId,
      companyId: data.companyId,
      score: data.score,
      completedAt: new Date()
    }
  })
  
  revalidatePath(`/mock-interviews`)
}

export async function getSmartRecommendations() {
  const { userId } = await auth()
  if (!userId) return []

  const upcomingApplications = await prisma.application.findMany({
    where: {
      userId,
      status: { in: ['ONLINE_ASSESSMENT', 'INTERVIEW'] },
      OR: [
        { assessmentDate: { gte: new Date() } },
        { interviewDate: { gte: new Date() } }
      ]
    },
    include: {
      company: true
    }
  })

  const recommendations = await Promise.all(upcomingApplications.map(async (app) => {
    const questions = await prisma.mockQuestion.findMany({
      where: { companyId: app.companyId },
      take: 20
    })

    const topics = new Set<string>()
    questions.forEach(q => q.tags.forEach(t => topics.add(t)))

    return {
      application: app,
      recommendedQuestions: questions,
      topics: Array.from(topics).slice(0, 5)
    }
  }))

  return recommendations
}
