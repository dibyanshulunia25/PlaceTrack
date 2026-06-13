"use server"

import { prisma } from "@/lib/prisma"

export type Timeframe = "weekly" | "monthly" | "all-time"

function getTimeframeDate(timeframe: Timeframe): Date | undefined {
  if (timeframe === "all-time") return undefined
  
  const date = new Date()
  if (timeframe === "weekly") {
    date.setDate(date.getDate() - 7)
  } else if (timeframe === "monthly") {
    date.setMonth(date.getMonth() - 1)
  }
  return date
}

export async function getTopContributors(timeframe: Timeframe = "all-time") {
  const gteDate = getTimeframeDate(timeframe)
  
  const whereClause = gteDate ? { createdAt: { gte: gteDate } } : {}

  const users = await prisma.user.findMany({
    where: {
      experiences: { some: whereClause }
    },
    include: {
      experiences: {
        where: whereClause,
        select: {
          id: true,
          upvotes: true,
          oaQuestions: true,
          interviewQuestions: true,
        }
      }
    }
  })

  const scoredUsers = users.map(user => {
    let score = 0
    let totalQuestions = 0
    let totalUpvotes = 0

    user.experiences.forEach(exp => {
      score += 10 // +10 per experience
      
      let qCount = 0
      if (exp.oaQuestions && exp.oaQuestions.trim()) qCount++
      if (exp.interviewQuestions && exp.interviewQuestions.trim()) qCount++
      
      score += qCount * 5 // +5 per question section
      totalQuestions += qCount
      
      score += exp.upvotes * 2 // +2 per upvote
      totalUpvotes += exp.upvotes
    })

    let badge = "New Contributor"
    if (score >= 500) badge = "Community Expert"
    else if (score >= 201) badge = "Top Contributor"
    else if (score >= 51) badge = "Rising Contributor"

    return {
      id: user.id,
      name: user.name || "Anonymous User",
      image: user.image,
      score,
      totalExperiences: user.experiences.length,
      totalQuestions,
      totalUpvotes,
      badge
    }
  })

  // Sort by score descending and take top 50
  return scoredUsers.sort((a, b) => b.score - a.score).slice(0, 50)
}

export async function getMostHelpfulExperiences(timeframe: Timeframe = "all-time") {
  const gteDate = getTimeframeDate(timeframe)
  const whereClause = gteDate ? { createdAt: { gte: gteDate } } : {}

  return await prisma.experience.findMany({
    where: whereClause,
    orderBy: [
      { upvotes: 'desc' },
      { views: 'desc' }
    ],
    take: 6,
    include: {
      user: {
        select: { name: true, image: true }
      },
      company: {
        select: { name: true, logo: true }
      }
    }
  })
}

export async function getMostActiveCompanies(timeframe: Timeframe = "all-time") {
  const gteDate = getTimeframeDate(timeframe)
  const whereClause = gteDate ? { createdAt: { gte: gteDate } } : {}

  const companies = await prisma.company.findMany({
    include: {
      experiences: {
        where: whereClause,
        select: {
          id: true,
          views: true,
          oaQuestions: true,
          interviewQuestions: true
        }
      }
    }
  })

  const scoredCompanies = companies.map(company => {
    let views = 0
    let totalQuestions = 0

    company.experiences.forEach(exp => {
      views += exp.views
      if (exp.oaQuestions && exp.oaQuestions.trim()) totalQuestions++
      if (exp.interviewQuestions && exp.interviewQuestions.trim()) totalQuestions++
    })

    return {
      id: company.id,
      name: company.name,
      logo: company.logo,
      totalExperiences: company.experiences.length,
      totalQuestions,
      views
    }
  }).filter(c => c.totalExperiences > 0)

  return scoredCompanies.sort((a, b) => b.totalExperiences - a.totalExperiences || b.views - a.views).slice(0, 5)
}

export async function getPopularTopics(timeframe: Timeframe = "all-time") {
  const gteDate = getTimeframeDate(timeframe)
  const whereClause = gteDate ? { createdAt: { gte: gteDate } } : {}

  const experiences = await prisma.experience.findMany({
    where: whereClause,
    select: { tags: true }
  })

  const tagCounts: Record<string, number> = {}

  experiences.forEach(exp => {
    exp.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }))
}
