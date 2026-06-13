"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { VoteType } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { voteLimit } from "@/lib/ratelimit"

export async function toggleVote(experienceId: string, value: VoteType) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const { success } = await voteLimit.limit(userId)
  if (!success) {
    throw new Error("Rate limit exceeded. Please wait a moment before voting again.")
  }

  return await prisma.$transaction(async (tx) => {
    const existingVote = await tx.vote.findUnique({
      where: {
        userId_experienceId: {
          userId,
          experienceId
        }
      }
    })

    let scoreChange = 0

    if (existingVote) {
      if (existingVote.value === value) {
        // User clicked the same vote type, so remove it
        await tx.vote.delete({
          where: { id: existingVote.id }
        })
        scoreChange = value === VoteType.UPVOTE ? -1 : 1
      } else {
        // User switched their vote (e.g. Up to Down)
        await tx.vote.update({
          where: { id: existingVote.id },
          data: { value }
        })
        scoreChange = value === VoteType.UPVOTE ? 2 : -2
      }
    } else {
      // User hasn't voted yet
      await tx.vote.create({
        data: {
          userId,
          experienceId,
          value
        }
      })
      scoreChange = value === VoteType.UPVOTE ? 1 : -1
    }

    // Update experience score
    const updatedExp = await tx.experience.update({
      where: { id: experienceId },
      data: {
        upvotes: { increment: scoreChange }
      }
    })

    revalidatePath("/dashboard")
    revalidatePath("/experiences")
    revalidatePath("/dashboard/experiences")
    
    return { success: true, newScore: updatedExp.upvotes }
  })
}
