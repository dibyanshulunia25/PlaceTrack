"use client"

import { useState, useTransition } from "react"
import { toggleVote } from "@/actions/vote"
import { VoteType } from "@prisma/client"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function VoteButtons({ 
  experienceId, 
  initialUpvotes, 
  initialUserVote,
  horizontal = false
}: { 
  experienceId: string, 
  initialUpvotes: number, 
  initialUserVote?: VoteType | null,
  horizontal?: boolean
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [userVote, setUserVote] = useState<VoteType | null>(initialUserVote || null)
  const [isPending, startTransition] = useTransition()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const handleVote = (type: VoteType) => {
    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    // Optimistic UI update
    let newScore = upvotes
    let newVote = userVote

    if (userVote === type) {
      // Remove vote
      newVote = null
      newScore += type === VoteType.UPVOTE ? -1 : 1
    } else {
      // Change or add vote
      if (userVote) {
        newScore += type === VoteType.UPVOTE ? 2 : -2
      } else {
        newScore += type === VoteType.UPVOTE ? 1 : -1
      }
      newVote = type
    }

    setUpvotes(newScore)
    setUserVote(newVote)

    startTransition(async () => {
      try {
        const result = await toggleVote(experienceId, type)
        if (result.success) {
          setUpvotes(result.newScore)
        }
      } catch (error) {
        // Revert on error
        setUpvotes(initialUpvotes)
        setUserVote(initialUserVote || null)
        console.error("Failed to vote:", error)
      }
    })
  }

  return (
    <div className={cn(
      "flex items-center justify-center bg-muted/30 rounded-lg p-1 border border-border/40 shadow-clay-inset w-fit",
      horizontal ? "flex-row space-x-1" : "flex-col"
    )}>
      <button
        disabled={isPending}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleVote(VoteType.UPVOTE)
        }}
        className={cn(
          "p-1.5 rounded-md transition-all hover:bg-muted group disabled:opacity-50",
          userVote === VoteType.UPVOTE && "bg-orange-500/10 text-orange-500"
        )}
      >
        <ArrowBigUp className={cn(
          "size-5 transition-colors group-hover:text-orange-500",
          userVote === VoteType.UPVOTE ? "fill-orange-500 text-orange-500" : "text-muted-foreground"
        )} />
      </button>
      
      <span className={cn(
        "text-sm font-bold",
        horizontal ? "mx-1" : "my-0.5",
        userVote === VoteType.UPVOTE && "text-orange-500",
        userVote === VoteType.DOWNVOTE && "text-blue-500",
        !userVote && "text-foreground"
      )}>
        {upvotes}
      </span>
      
      <button
        disabled={isPending}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleVote(VoteType.DOWNVOTE)
        }}
        className={cn(
          "p-1.5 rounded-md transition-all hover:bg-muted group disabled:opacity-50",
          userVote === VoteType.DOWNVOTE && "bg-blue-500/10 text-blue-500"
        )}
      >
        <ArrowBigDown className={cn(
          "size-5 transition-colors group-hover:text-blue-500",
          userVote === VoteType.DOWNVOTE ? "fill-blue-500 text-blue-500" : "text-muted-foreground"
        )} />
      </button>
    </div>
  )
}
