"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function getUserCollections() {
  const { userId } = await auth()
  if (!userId) return []

  return await prisma.resourceCollection.findMany({
    where: { userId },
    include: {
      _count: {
        select: { bookmarks: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })
}

export async function createCollection(name: string, description?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const collection = await prisma.resourceCollection.create({
    data: {
      userId,
      name,
      description
    }
  })

  revalidatePath("/dashboard/resources")
  return collection
}

export async function saveResource(resourceId: string, collectionId?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Check if already saved
  const existing = await prisma.resourceBookmark.findUnique({
    where: {
      userId_resourceId: { userId, resourceId }
    }
  })

  if (existing) {
    if (existing.collectionId !== collectionId) {
      await prisma.resourceBookmark.update({
        where: { id: existing.id },
        data: { collectionId: collectionId || null }
      })
    }
  } else {
    await prisma.resourceBookmark.create({
      data: {
        userId,
        resourceId,
        collectionId: collectionId || null
      }
    })

    // Track analytics
    await prisma.discoveryAnalytics.upsert({
      where: { userId },
      update: {
        savedIds: { push: resourceId }
      },
      create: {
        userId,
        savedIds: [resourceId]
      }
    })
  }

  revalidatePath("/dashboard/resources")
  return true
}

export async function unsaveResource(resourceId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await prisma.resourceBookmark.deleteMany({
    where: { userId, resourceId }
  })

  revalidatePath("/dashboard/resources")
  return true
}

export async function trackResourceView(resourceId: string, tags: string[]) {
  const { userId } = await auth()
  if (!userId) return

  await prisma.discoveryAnalytics.upsert({
    where: { userId },
    update: {
      viewedIds: { push: resourceId },
      exploredTags: { push: tags }
    },
    create: {
      userId,
      viewedIds: [resourceId],
      exploredTags: tags
    }
  })
}

export async function getDiscoveryAnalytics() {
  const { userId } = await auth()
  if (!userId) return null

  const analytics = await prisma.discoveryAnalytics.findUnique({
    where: { userId }
  })

  if (!analytics) return { viewedCount: 0, savedCount: 0, topTags: [] as string[] }

  const viewedCount = new Set(analytics.viewedIds).size
  const savedCount = new Set(analytics.savedIds).size
  
  const tagCounts: Record<string, number> = {}
  analytics.exploredTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1
  })

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0])

  return {
    viewedCount,
    savedCount,
    topTags
  }
}

export async function getSimilarResources(resourceId: string) {
  const resource = await prisma.externalResource.findUnique({
    where: { id: resourceId }
  })

  if (!resource) return []

  const similar = await prisma.externalResource.findMany({
    where: {
      id: { not: resourceId },
      OR: [
        { company: resource.company },
        { tags: { hasSome: resource.tags } }
      ]
    },
    take: 3,
    orderBy: { fetchedAt: 'desc' }
  })

  return similar
}

// Support for infinite scroll and personalization
export async function fetchResources(page: number, limit: number, topic?: string, company?: string) {
  const { userId } = await auth()
  
  const whereClause: any = {}
  if (topic) {
    whereClause.tags = { has: topic }
  }
  if (company) {
    whereClause.company = { equals: company, mode: 'insensitive' }
  }

  // Personalization logic: if no explicit filters and user is logged in, try to boost based on their exploredTags
  let orderBy: any = { fetchedAt: 'desc' }
  let preferredTags: string[] = []

  if (!topic && !company && userId) {
    const analytics = await prisma.discoveryAnalytics.findUnique({
      where: { userId }
    })
    if (analytics && analytics.exploredTags.length > 0) {
      // Find most common tags
      const tagCounts: Record<string, number> = {}
      analytics.exploredTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
      preferredTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0])
    }
  }

  const resources = await prisma.externalResource.findMany({
    where: whereClause,
    orderBy,
    skip: (page - 1) * limit,
    take: limit
  })

  // Basic sorting to put personalized items first if we fetched a general list
  if (preferredTags.length > 0) {
    resources.sort((a, b) => {
      const aScore = a.tags.filter(t => preferredTags.includes(t)).length
      const bScore = b.tags.filter(t => preferredTags.includes(t)).length
      return bScore - aScore
    })
  }

  // Also fetch user bookmarks to mark items as saved
  let userBookmarks: string[] = []
  if (userId) {
    const bookmarks = await prisma.resourceBookmark.findMany({
      where: { userId },
      select: { resourceId: true }
    })
    userBookmarks = bookmarks.map(b => b.resourceId)
  }

  return {
    resources,
    userBookmarks,
    hasMore: resources.length === limit
  }
}
