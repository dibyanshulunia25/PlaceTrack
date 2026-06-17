"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { MockQuestionSchema, PracticeSessionSchema } from "@/lib/validations"
import { experienceSubmissionLimit } from "@/lib/ratelimit"
import { Logger } from "@/lib/logger"

export async function getMockCompanies() {
  const { userId } = await auth()
  
  const mockQuestionsWhere = userId 
    ? { OR: [{ isPublic: true }, { userId }] } 
    : { isPublic: true }

  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: { mockQuestions: { where: mockQuestionsWhere }, practiceSessions: true }
      },
      mockQuestions: {
        where: mockQuestionsWhere,
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
  const { userId } = await auth()
  const mockQuestionsWhere = userId 
    ? { OR: [{ isPublic: true }, { userId }] } 
    : { isPublic: true }

  const company = await prisma.company.findUnique({
    where: { name: companyName },
    include: {
      mockQuestions: {
        where: mockQuestionsWhere,
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
  questions: { question: string, answer: string }[]
  difficulty: number
  tags: string[]
  notes?: string
  isPublic: boolean
  isAnonymous: boolean
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
    const mockQuestions = data.questions.map(q => ({
      companyId: data.companyId,
      role: data.role,
      category: data.category,
      question: q.question,
      answer: q.answer,
      difficulty: data.difficulty,
      tags: data.tags,
      notes: data.notes,
      isPublic: data.isPublic,
      isAnonymous: data.isAnonymous,
      userId
    }))

    await prisma.mockQuestion.createMany({
      data: mockQuestions
    })

    revalidatePath(`/dashboard/mock-interviews`)
    return { success: true, count: mockQuestions.length }
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
  
  revalidatePath(`/dashboard/mock-interviews`)
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
      where: { 
        companyId: app.companyId,
        OR: [{ isPublic: true }, { userId }]
      },
      take: 20
    })

    const totalQuestions = await prisma.mockQuestion.count({
      where: { 
        companyId: app.companyId,
        OR: [{ isPublic: true }, { userId }]
      }
    })

    const sessionsAggr = await prisma.practiceSession.aggregate({
      where: { userId, companyId: app.companyId },
      _sum: { score: true }
    })
    
    const totalPracticed = sessionsAggr._sum.score || 0

    const topics = new Set<string>()
    questions.forEach(q => q.tags.forEach(t => topics.add(t)))

    return {
      application: app,
      recommendedQuestions: questions,
      topics: Array.from(topics).slice(0, 5),
      totalQuestions,
      totalPracticed
    }
  }))

  return recommendations
}

export async function getPersonalQuestions() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const questions = await prisma.mockQuestion.findMany({
    where: { userId, isPublic: false },
    orderBy: { createdAt: 'desc' },
    include: {
      company: { select: { name: true, logo: true } }
    }
  })
  return questions
}

export async function getBookmarkedQuestions() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      mockQuestion: {
        include: {
          company: { select: { name: true, logo: true } }
        }
      }
    }
  })
  return bookmarks
}

export async function toggleBookmark(questionId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const existing = await prisma.bookmark.findUnique({
    where: { userId_mockQuestionId: { userId, mockQuestionId: questionId } }
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } })
  } else {
    await prisma.bookmark.create({
      data: { userId, mockQuestionId: questionId }
    })
  }

  revalidatePath(`/dashboard/mock-interviews`)
}

export async function saveBookmarkNotes(bookmarkId: string, notes: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const bookmark = await prisma.bookmark.findUnique({ where: { id: bookmarkId } })
  if (!bookmark || bookmark.userId !== userId) throw new Error("Unauthorized")

  await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: { notes }
  })

  revalidatePath(`/dashboard/mock-interviews`)
}

export async function getUserPracticeAnalytics() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Practice Streak Calculation
  const sessions = await prisma.practiceSession.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' }
  })

  let streak = 0
  if (sessions.length > 0) {
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    let lastDate = new Date(sessions[0].startedAt)
    lastDate.setHours(0, 0, 0, 0)

    // Check if the latest session is from today or yesterday
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) {
      streak = 1
      for (let i = 1; i < sessions.length; i++) {
        const prevDate = new Date(sessions[i - 1].startedAt)
        prevDate.setHours(0, 0, 0, 0)
        const currDate = new Date(sessions[i].startedAt)
        currDate.setHours(0, 0, 0, 0)
        const diff = Math.floor(Math.abs(prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diff === 1) streak++
        else if (diff > 1) break // Streak broken
      }
    }
  }

  const progress = await prisma.practiceProgress.findMany({
    where: { userId }
  })

  // Determine weak vs strong areas by combining historicalScore and selfAssessmentScore
  // e.g. Score = (historical * 0.7) + (self * 0.3)
  const scoredProgress = progress.map(p => ({
    ...p,
    combinedScore: (p.historicalScore * 0.7) + (p.selfAssessmentScore * 0.3)
  })).sort((a, b) => b.combinedScore - a.combinedScore)

  const strongAreas = scoredProgress.slice(0, 3)
  const weakAreas = scoredProgress.slice(-3).reverse() // worst 3

  return {
    streak,
    totalSessions: sessions.length,
    strongAreas,
    weakAreas
  }
}
