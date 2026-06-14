"use server"

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { experienceSubmissionLimit } from "@/lib/ratelimit"

import { ExperienceSchema } from "@/lib/validations"
import { z } from "zod"

export type ExperienceFormData = z.infer<typeof ExperienceSchema>

export async function createExperience(rawData: ExperienceFormData) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  const userId = user.id

  const { success } = await experienceSubmissionLimit.limit(userId)
  if (!success) {
    throw new Error("Rate limit exceeded. Please wait before submitting another experience.")
  }

  const validatedData = ExperienceSchema.safeParse(rawData)

  if (!validatedData.success) {
    // Return first error message
    throw new Error(validatedData.error.issues[0].message)
  }

  const data = validatedData.data
  const manualTags = data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : []
  
  // Extract keywords from questions automatically
  const allQuestionText = [
    ...(data.oaQuestions?.map(q => q.value) || []),
    ...(data.interviewQuestions?.map(q => q.value) || [])
  ].join(" ").toLowerCase()
  
  const keywords = ["react", "nextjs", "node", "system design", "dp", "dynamic programming", "graphs", "trees", "greedy", "arrays", "strings", "sliding window", "two pointers", "sql", "dbms", "os", "operating system", "networking", "api", "rest", "graphql", "aws", "docker", "kubernetes", "behavioral", "leadership", "oop"]
  const autoTags = keywords.filter(k => allQuestionText.includes(k)).map(k => {
    // Capitalize properly
    if (k === "dp") return "DP"
    if (k === "sql") return "SQL"
    if (k === "dbms") return "DBMS"
    if (k === "os") return "OS"
    if (k === "oop") return "OOP"
    if (k === "aws") return "AWS"
    if (k === "api") return "API"
    if (k === "rest") return "REST"
    return k.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  })

  const tags = Array.from(new Set([...manualTags, ...autoTags]))

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
      tips: data.tips,
      tags,
      difficulty: data.difficulty,
      year: data.year,
      isPublic: data.isPublic,
      isAnonymous: data.isAnonymous,
      userId,
      companyId: company.id,
    }
  })

  // Create Assessment Questions
  if (data.oaQuestions && data.oaQuestions.length > 0) {
    await prisma.assessmentQuestion.createMany({
      data: data.oaQuestions.map((q, i) => ({
        experienceId: experience.id,
        questionText: q.value,
        order: i
      }))
    })
  }

  // Create Interview Questions
  if (data.interviewQuestions && data.interviewQuestions.length > 0) {
    await prisma.interviewQuestion.createMany({
      data: data.interviewQuestions.map((q, i) => ({
        experienceId: experience.id,
        questionText: q.value,
        order: i
      }))
    })
  }

  revalidatePath("/dashboard/experiences")
  revalidatePath("/experiences")
  return experience
}