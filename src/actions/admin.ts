"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

async function verifyAdmin() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })
  
  if (user?.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }
}

export async function getAdminStats() {
  await verifyAdmin()
  
  const [
    totalUsers,
    totalCompanies,
    totalApplications,
    totalExperiences,
    totalVotes,
    recentUsers,
    topExperiences,
    topCompanies
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.application.count(),
    prisma.experience.count(),
    prisma.vote.count(),
    
    // Analytics
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.experience.findMany({
      orderBy: { views: 'desc' },
      take: 5,
      include: { company: true, user: true }
    }),
    prisma.company.findMany({
      orderBy: {
        experiences: { _count: 'desc' }
      },
      take: 5,
      include: {
        _count: { select: { experiences: true, applications: true } }
      }
    })
  ])

  return {
    totalUsers,
    totalCompanies,
    totalApplications,
    totalExperiences,
    totalVotes,
    newRegistrations: recentUsers,
    topExperiences,
    topCompanies
  }
}

export async function getUsers(query: string = "") {
  await verifyAdmin()
  
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export async function toggleUserBan(userId: string, banned: boolean) {
  await verifyAdmin()
  
  await prisma.user.update({
    where: { id: userId },
    data: { banned }
  })
  
  revalidatePath("/admin/users")
  return { success: true }
}

export async function getCompanies(query: string = "") {
  await verifyAdmin()
  
  return prisma.company.findMany({
    where: {
      name: { contains: query, mode: "insensitive" }
    },
    orderBy: { name: 'asc' },
    take: 50,
    include: {
      _count: { select: { experiences: true, applications: true } }
    }
  })
}

import { CompanyAdminSchema } from "@/lib/validations"

export async function createCompany(rawData: { name: string, website?: string, industry?: string }) {
  await verifyAdmin()
  
  const validated = CompanyAdminSchema.safeParse(rawData)
  if (!validated.success) throw new Error(validated.error.issues[0].message)
  
  await prisma.company.create({
    data: validated.data
  })
  
  revalidatePath("/admin/companies")
  return { success: true }
}

export async function updateCompany(id: string, rawData: { name: string, website?: string, industry?: string }) {
  await verifyAdmin()
  
  const validated = CompanyAdminSchema.safeParse(rawData)
  if (!validated.success) throw new Error(validated.error.issues[0].message)

  await prisma.company.update({
    where: { id },
    data: validated.data
  })
  
  revalidatePath("/admin/companies")
  return { success: true }
}

export async function deleteCompany(id: string) {
  await verifyAdmin()
  
  await prisma.company.delete({
    where: { id }
  })
  
  revalidatePath("/admin/companies")
  return { success: true }
}
