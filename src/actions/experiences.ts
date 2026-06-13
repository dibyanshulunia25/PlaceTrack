"use server"

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { experienceSubmissionLimit } from "@/lib/ratelimit"

import { ExperienceSchema } from "@/lib/validations"

export async function createExperience(formData: FormData) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  const userId = user.id

  const { success } = await experienceSubmissionLimit.limit(userId)
  if (!success) {
    throw new Error("Rate limit exceeded. Please wait before submitting another experience.")
  }

  // Parse and sanitize inputs using Zod
  const rawData = {
    companyName: formData.get("company"),
    role: formData.get("role"),
    title: formData.get("title"),
    content: formData.get("content"),
    oaQuestions: formData.get("oaQuestions") || undefined,
    interviewQuestions: formData.get("interviewQuestions") || undefined,
    tips: formData.get("tips") || undefined,
    difficulty: formData.get("difficulty"),
    year: formData.get("year"),
    tags: formData.get("tags") || undefined,
    isAnonymous: formData.get("isAnonymous") === "on",
  }

  const validatedData = ExperienceSchema.safeParse(rawData)

  if (!validatedData.success) {
    // Return first error message
    throw new Error(validatedData.error.issues[0].message)
  }

  const data = validatedData.data
  const tags = data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : []

  let company = await prisma.company.findFirst({
    where: { name: { equals: data.companyName, mode: 'insensitive' } }
  })

  if (!company) {
    company = await prisma.company.create({
      data: { name: data.companyName }
    })
  }

  const experience = await prisma.experience.create({
    data: {
      title: data.title,
      role: data.role,
      content: data.content,
      oaQuestions: data.oaQuestions,
      interviewQuestions: data.interviewQuestions,
      tips: data.tips,
      tags,
      difficulty: data.difficulty,
      year: data.year,
      isAnonymous: data.isAnonymous,
      userId,
      companyId: company.id,
    }
  })

  revalidatePath("/dashboard/experiences")
  revalidatePath("/experiences")
  return experience
}