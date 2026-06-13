"use server"

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function createExperience(formData: FormData) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  const userId = user.id

  const companyName = formData.get("company") as string
  const role = formData.get("role") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const oaQuestions = formData.get("oaQuestions") as string
  const interviewQuestions = formData.get("interviewQuestions") as string
  const tips = formData.get("tips") as string
  const tagsStr = formData.get("tags") as string
  
  const difficultyStr = formData.get("difficulty") as string
  const yearStr = formData.get("year") as string
  const isAnonymous = formData.get("isAnonymous") === "on"

  if (!companyName || !role || !title || !content || !difficultyStr || !yearStr) {
    throw new Error("Missing required fields")
  }

  const difficulty = parseInt(difficultyStr, 10)
  const year = parseInt(yearStr, 10)
  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : []

  let company = await prisma.company.findFirst({
    where: { name: { equals: companyName, mode: 'insensitive' } }
  })

  if (!company) {
    company = await prisma.company.create({
      data: { name: companyName }
    })
  }

  const experience = await prisma.experience.create({
    data: {
      title,
      role,
      content,
      oaQuestions,
      interviewQuestions,
      tips,
      tags,
      difficulty,
      year,
      isAnonymous,
      userId,
      companyId: company.id,
    }
  })

  revalidatePath("/dashboard/experiences")
  revalidatePath("/experiences")
  return experience
}