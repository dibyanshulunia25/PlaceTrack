"use server"

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { ApplicationStatus } from "@prisma/client"

export async function createApplication(data: {
  companyName: string
  role: string
  status: ApplicationStatus
  appliedAt: Date
  assessmentDate?: Date | null
  interviewDate?: Date | null
  location?: string | null
  salary?: string | null
}) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  // Find or create company
  let company = await prisma.company.findUnique({
    where: { name: data.companyName },
  })

  if (!company) {
    company = await prisma.company.create({
      data: { name: data.companyName },
    })
  }

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      companyId: company.id,
      role: data.role,
      status: data.status,
      appliedAt: data.appliedAt,
      assessmentDate: data.assessmentDate,
      interviewDate: data.interviewDate,
      location: data.location,
      salary: data.salary,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/applications")
  return application
}

export async function updateApplication(
  id: string,
  data: {
    companyName: string
    role: string
    status: ApplicationStatus
    appliedAt: Date
    assessmentDate?: Date | null
    interviewDate?: Date | null
    location?: string | null
    salary?: string | null
  }
) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  // Find or create company
  let company = await prisma.company.findUnique({
    where: { name: data.companyName },
  })

  if (!company) {
    company = await prisma.company.create({
      data: { name: data.companyName },
    })
  }

  const application = await prisma.application.update({
    where: { id, userId: user.id }, // Ensure user owns the application
    data: {
      companyId: company.id,
      role: data.role,
      status: data.status,
      appliedAt: data.appliedAt,
      assessmentDate: data.assessmentDate,
      interviewDate: data.interviewDate,
      location: data.location,
      salary: data.salary,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/applications")
  return application
}

export async function deleteApplication(id: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.application.delete({
    where: { id, userId: user.id },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/applications")
}
