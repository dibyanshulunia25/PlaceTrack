"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMockQuestion } from "@/actions/mock-interviews"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function AddQuestionForm({ companyId, companies }: { companyId?: string, companies?: { id: string, name: string }[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError(null)
    const rawData = {
      companyId: companyId || (formData.get("companyId") as string),
      role: formData.get("role") as string,
      category: formData.get("category") as string,
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      difficulty: parseInt(formData.get("difficulty") as string),
      tags: (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean),
      isPublic: formData.get("isPublic") === "on",
      isAnonymous: formData.get("isAnonymous") === "on",
    }

    startTransition(async () => {
      try {
        await createMockQuestion(rawData)
        router.push("/dashboard/mock-interviews")
        router.refresh()
      } catch (err: any) {
        setError(err.message || "Failed to create mock question")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-destructive-foreground bg-destructive/90 rounded-xl">
          {error}
        </div>
      )}

      {!companyId && companies && (
        <div className="space-y-2">
          <Label htmlFor="companyId">Company *</Label>
          <select 
            id="companyId" 
            name="companyId" 
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
            defaultValue=""
          >
            <option value="" disabled>Select a company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Input id="role" name="role" placeholder="e.g. Software Engineer" required className="rounded-xl px-4 py-3" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <select 
          id="category" 
          name="category" 
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          required
          defaultValue="DSA"
        >
          <option value="DSA">Data Structures & Algorithms</option>
          <option value="System Design">System Design</option>
          <option value="CS Fundamentals">CS Fundamentals</option>
          <option value="Behavioral">Behavioral / HR</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Database">Database</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty (1-5) *</Label>
        <Input id="difficulty" name="difficulty" type="number" min="1" max="5" defaultValue="3" required className="rounded-xl px-4 py-3" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="question">Question *</Label>
        <Textarea id="question" name="question" placeholder="Write the question..." required className="rounded-xl px-4 py-3 min-h-[100px]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer">Answer / Expected Approach *</Label>
        <Textarea id="answer" name="answer" placeholder="Provide a brief answer or the expected approach..." required className="rounded-xl px-4 py-3 min-h-[150px]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" name="tags" placeholder="e.g. Trees, DP, React" className="rounded-xl px-4 py-3" />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input type="checkbox" id="isPublic" name="isPublic" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary size-4" />
        <Label htmlFor="isPublic" className="font-normal cursor-pointer">Post publicly to Mock Hub</Label>
      </div>

      <div className="flex items-center space-x-2 pb-2">
        <input type="checkbox" id="isAnonymous" name="isAnonymous" className="rounded border-gray-300 text-primary focus:ring-primary size-4" />
        <Label htmlFor="isAnonymous" className="font-normal cursor-pointer">Post anonymously (hide my name)</Label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
        <Button type="button" variant="ghost" onClick={() => router.back()} className="rounded-xl">Cancel</Button>
        <Button type="submit" disabled={isPending} className="rounded-xl px-8">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Question
        </Button>
      </div>
    </form>
  )
}
