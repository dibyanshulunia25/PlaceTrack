"use server"

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { ApplicationStatus } from "@prisma/client"

import { ApplicationSchema } from "@/lib/validations"

export async function createApplication(rawData: {
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

  // Zod Validation & Sanitization
  const validated = ApplicationSchema.safeParse({
    company: rawData.companyName,
    ...rawData
  })

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message)
  }

  const data = validated.data

  // Find or create company
  let company = await prisma.company.findFirst({
    where: { name: { equals: data.company, mode: 'insensitive' } },
  })

  if (!company) {
    company = await prisma.company.create({
      data: { name: data.company },
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
  rawData: {
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

  // Zod Validation & Sanitization
  const validated = ApplicationSchema.safeParse({
    company: rawData.companyName,
    ...rawData
  })

  if (!validated.success) {
    throw new Error(validated.error.issues[0].message)
  }

  const data = validated.data

  // Find or create company
  let company = await prisma.company.findFirst({
    where: { name: { equals: data.company, mode: 'insensitive' } },
  })

  if (!company) {
    company = await prisma.company.create({
      data: { name: data.company },
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
