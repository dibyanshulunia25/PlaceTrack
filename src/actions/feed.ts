"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function fetchFeedExperiences({
  page = 1,
  limit = 10,
  sort = "recent", // recent, trending, helpful
  company,
  role,
  year
}: {
  page?: number,
  limit?: number,
  sort?: string,
  company?: string,
  role?: string,
  year?: string
}) {
  // Helper to format query for Postgres FTS tsquery
  const formatSearchQuery = (query: string) => {
    return query.trim().split(/\s+/).join(' | ')
  }

  const where: any = {}
  
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

  const { userId } = await auth()

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
}
