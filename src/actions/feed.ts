"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { searchLimit } from "@/lib/ratelimit"

import { SearchSchema } from "@/lib/validations"
import { Logger } from "@/lib/logger"

export async function fetchFeedExperiences(rawArgs: {
  page?: number,
  limit?: number,
  sort?: string,
  company?: string,
  role?: string,
  year?: string
}) {
  const validated = SearchSchema.safeParse(rawArgs)
  if (!validated.success) throw new Error("Invalid search parameters")
  const { page, limit, sort, company, role, year } = validated.data

  // Helper to format query for Postgres FTS tsquery
  const formatSearchQuery = (query: string) => {
    return query.trim().split(/\s+/).join(' | ')
  }

  const { userId } = await auth()
  
  // Rate Limit Search
  // If user is not logged in, we use a generic fallback string "anonymous" 
  // In a real app we might pass the IP from a component or headers, but Server Actions don't have direct access to IP natively in all Next.js versions without headers().
  // We'll limit by userId or 'anonymous'
  const { success } = await searchLimit.limit(userId || 'anonymous')
  if (!success) {
    throw new Error("Search rate limit exceeded. Please slow down your searches.")
  }

  const where: any = {}
  
  if (userId) {
    where.OR = [
      { isPublic: true },
      { userId: userId }
    ]
  } else {
    where.isPublic = true
  }
  
  if (company) {
    where.company = { is: { name: { search: formatSearchQuery(company) } } }
  }
  if (role) {
    where.role = { search: formatSearchQuery(role) }
  }
  if (year) {
    where.year = parseInt(year)
  }

  let orderBy: any = { createdAt: 'desc' }
  
  if (sort === 'helpful') {
    orderBy = { upvotes: 'desc' }
  } else if (sort === 'trending') {
    // Basic trending formula: upvotes + high question count + recent
    // Prisma can't do complex formulas in orderBy easily, so we sort by upvotes then difficulty then recent
    orderBy = [
      { upvotes: 'desc' },
      { difficulty: 'desc' },
      { createdAt: 'desc' }
    ]
  }



  try {
    const experiences = await prisma.experience.findMany({
      where,
      include: {
        company: true,
        user: true,
        ...(userId ? { votes: { where: { userId } } } : {}),
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    return experiences
  } catch (error) {
    Logger.error(error instanceof Error ? error : new Error(String(error)), { tag: "database", action: "fetchFeedExperiences" })
    throw new Error("Failed to fetch experiences")
  }
}
