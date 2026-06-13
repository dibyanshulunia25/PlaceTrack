"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createExperience } from "@/actions/experiences"
import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { StarRating } from "./star-rating"
import { useRouter } from "next/navigation"

export function ExperienceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState(3)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError(null)
    formData.append("difficulty", difficulty.toString())
    
    startTransition(async () => {
      try {
        await createExperience(formData)
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/dashboard/experiences")
        }
      } catch (err: any) {
        setError(err.message || "Failed to create experience")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input id="company" name="company" placeholder="e.g. Google" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input id="role" name="role" placeholder="e.g. Software Engineer" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Post Title *</Label>
          <Input id="title" name="title" placeholder="My interview experience" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input id="year" name="year" type="number" min={2000} max={2100} defaultValue={new Date().getFullYear()} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Interview Difficulty</Label>
        <StarRating value={difficulty} onChange={setDifficulty} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Overall Experience *</Label>
        <Textarea 
          id="content" 
          name="content" 
          placeholder="Share a general overview of the hiring process..." 
          className="min-h-[100px] resize-y"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="oaQuestions">Online Assessment Questions (Optional)</Label>
        <Textarea 
          id="oaQuestions" 
          name="oaQuestions" 
          placeholder="What was asked in the OA?" 
          className="min-h-[80px] resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interviewQuestions">Interview Questions (Optional)</Label>
        <Textarea 
          id="interviewQuestions" 
          name="interviewQuestions" 
          placeholder="What technical or behavioral questions were asked?" 
          className="min-h-[80px] resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tips">Preparation Tips (Optional)</Label>
        <Textarea 
          id="tips" 
          name="tips" 
          placeholder="Any tips for future candidates?" 
          className="min-h-[60px] resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" name="tags" placeholder="e.g. System Design, DP, Graphs (comma separated)" />
      </div>

      <div className="flex items-center space-x-2 pb-2 pt-2">
        <input type="checkbox" id="isAnonymous" name="isAnonymous" className="rounded border-gray-300 text-primary focus:ring-primary size-4" />
        <Label htmlFor="isAnonymous" className="font-normal cursor-pointer text-sm">Post anonymously</Label>
      </div>

      <Button type="submit" className="w-full bg-primary hover:opacity-90 mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          "Share Experience"
        )}
      </Button>
    </form>
  )
}
