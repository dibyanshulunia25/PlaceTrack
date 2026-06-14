"use server"

import { prisma } from "@/lib/prisma"

export async function getCompaniesDirectory({
  search,
  industry,
  sort,
  page = 1,
  limit = 12
}: {
  search?: string
  industry?: string
  sort?: string
  page?: number
  limit?: number
}) {
  const whereClause: any = {}
  
  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' }
  }
  
  if (industry) {
    whereClause.industry = { contains: industry, mode: 'insensitive' }
  }

  // Handle sorting
  let orderByClause: any = {}
  switch (sort) {
    case 'popular':
      orderByClause = { experiences: { _count: 'desc' } }
      break
    case 'recent':
      orderByClause = { updatedAt: 'desc' }
      break
    case 'applications':
      orderByClause = { applications: { _count: 'desc' } }
      break
    default:
      orderByClause = { name: 'asc' }
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { experiences: true, applications: true }
        },
        experiences: {
          select: {
            difficulty: true,
            assessmentQuestions: true,
            interviewQuestions: true
          }
        }
      },
      orderBy: orderByClause,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.company.count({ where: whereClause })
  ])

  // Calculate aggregates in memory for the paginated results
  const enhancedCompanies = companies.map(company => {
    const experiences = company.experiences
    
    // Average difficulty
    const totalDiff = experiences.reduce((acc, exp) => acc + (exp.difficulty || 0), 0)
    const avgDifficulty = experiences.length > 0 ? (totalDiff / experiences.length).toFixed(1) : "0.0"

    let totalQuestions = 0
    experiences.forEach(exp => {
      totalQuestions += exp.assessmentQuestions.length
      totalQuestions += exp.interviewQuestions.length
    })

    return {
      id: company.id,
      name: company.name,
      logo: company.logo,
      industry: company.industry,
      website: company.website,
      totalExperiences: company._count.experiences,
      totalApplications: company._count.applications,
      avgDifficulty: parseFloat(avgDifficulty),
      totalQuestions,
    }
  })

  return {
    companies: enhancedCompanies,
    totalPages: Math.ceil(total / limit),
    totalCompanies: total
  }
}

export async function getCompanyProfile(companyName: string) {
  const company = await prisma.company.findUnique({
    where: { name: companyName },
    include: {
      _count: {
        select: { experiences: true, applications: true }
      },
      applications: {
        select: { status: true }
      },
      experiences: {
        include: {
          user: {
            select: { name: true, image: true }
          },
          assessmentQuestions: true,
          interviewQuestions: true
        },
        orderBy: [
          { upvotes: 'desc' },
          { createdAt: 'desc' }
        ]
      }
    }
  })

  if (!company) return null

  // Fetch related resources
  const resources = await prisma.externalResource.findMany({
    where: { company: company.name },
    orderBy: { createdAt: 'desc' }
  })

  const experiences = company.experiences
  
  // Aggregate Difficulty
  const totalDiff = experiences.reduce((acc, exp) => acc + (exp.difficulty || 0), 0)
  const avgDifficulty = experiences.length > 0 ? (totalDiff / experiences.length).toFixed(1) : "0.0"

  // Aggregate Questions
  const oaQuestions: { role: string, content: string, year: number }[] = []
  const interviewQuestions: { role: string, content: string, year: number }[] = []

  let totalQuestionsCount = 0
  let assessmentReports = 0
  let interviewReports = 0

  const tagCounts: Record<string, number> = {}
  const oaQuestionCounts: Record<string, number> = {}
  const interviewQuestionCounts: Record<string, number> = {}

  experiences.forEach(exp => {
    if (exp.assessmentQuestions.length > 0 || exp.legacyOaQuestions) assessmentReports++
    if (exp.interviewQuestions.length > 0 || exp.legacyInterviewQuestions) interviewReports++

    exp.assessmentQuestions.forEach(q => {
      oaQuestions.push({ role: exp.role, content: q.questionText, year: exp.year })
      oaQuestionCounts[q.questionText] = (oaQuestionCounts[q.questionText] || 0) + 1
      totalQuestionsCount++
    })
    
    exp.interviewQuestions.forEach(q => {
      interviewQuestions.push({ role: exp.role, content: q.questionText, year: exp.year })
      interviewQuestionCounts[q.questionText] = (interviewQuestionCounts[q.questionText] || 0) + 1
      totalQuestionsCount++
    })

    exp.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0])

  const mostAskedOa = Object.entries(oaQuestionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => ({ question: entry[0], count: entry[1] }))

  const mostAskedInterview = Object.entries(interviewQuestionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => ({ question: entry[0], count: entry[1] }))

  // Hiring Insights
  const applications = company.applications
  const hiringInsights = {
    totalApplied: applications.length,
    totalAssessments: applications.filter(a => a.status === 'ONLINE_ASSESSMENT' || a.status === 'INTERVIEW' || a.status === 'OFFERED').length,
    totalInterviews: applications.filter(a => a.status === 'INTERVIEW' || a.status === 'OFFERED').length,
    totalOffers: applications.filter(a => a.status === 'OFFERED').length
  }

  return {
    ...company,
    avgDifficulty: parseFloat(avgDifficulty),
    totalQuestionsCount,
    assessmentReports,
    interviewReports,
    oaQuestions,
    interviewQuestions,
    topTags,
    mostAskedOa,
    mostAskedInterview,
    hiringInsights,
    resources,
    recentExperiences: [...experiences].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5),
    topExperiences: [...experiences].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5)
  }
}

export async function getUniqueIndustries() {
  const companies = await prisma.company.findMany({
    select: { industry: true },
    distinct: ['industry'],
  })
  
  return companies
    .map(c => c.industry)
    .filter((industry): industry is string => industry !== null && industry !== '')
    .sort()
}
