"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createExperience, ExperienceFormData } from "@/actions/experiences"
import { useState, useTransition } from "react"
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { StarRating } from "./star-rating"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExperienceSchema } from "@/lib/validations"
import { motion, AnimatePresence } from "framer-motion"

export function ExperienceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(ExperienceSchema) as any,
    defaultValues: {
      companyName: "",
      role: "",
      title: "",
      year: new Date().getFullYear(),
      difficulty: 3,
      content: "",
      oaQuestions: [],
      technicalQuestions: [],
      personalQuestions: [],
      tips: "",
      tags: "",
      isPublic: true,
      isAnonymous: false,
    }
  })

  const { control, handleSubmit, register, watch, setValue, formState: { errors } } = form

  const {
    fields: oaFields,
    append: appendOa,
    remove: removeOa,
    move: moveOa,
  } = useFieldArray({ control, name: "oaQuestions" as never }) // Type casting because useFieldArray string array issues

  const {
    fields: technicalFields,
    append: appendTechnical,
    remove: removeTechnical,
    move: moveTechnical,
  } = useFieldArray({ control, name: "technicalQuestions" as never })

  const {
    fields: personalFields,
    append: appendPersonal,
    remove: removePersonal,
    move: movePersonal,
  } = useFieldArray({ control, name: "personalQuestions" as never })

  const onSubmit = (data: ExperienceFormData) => {
    setError(null)
    startTransition(async () => {
      try {
        await createExperience(data)
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company *</Label>
          <Input id="companyName" placeholder="e.g. Google" {...register("companyName")} />
          {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input id="role" placeholder="e.g. Software Engineer" {...register("role")} />
          {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Post Title *</Label>
          <Input id="title" placeholder="My interview experience" {...register("title")} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input id="year" type="number" {...register("year")} />
          {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Interview Difficulty</Label>
        <StarRating 
          value={watch("difficulty")} 
          onChange={(v) => setValue("difficulty", v, { shouldValidate: true })} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Overall Experience *</Label>
        <Textarea 
          id="content" 
          placeholder="Share a general overview of the hiring process..." 
          className="min-h-[100px] resize-y"
          {...register("content")}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <Label className="text-blue-600 dark:text-blue-400 font-bold">Online Assessment Questions</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => appendOa({ value: "" })} className="h-8 border-blue-500/30 text-blue-600 hover:bg-blue-500/10">
            <Plus className="size-4 mr-1" /> Add Question
          </Button>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {oaFields.map((field, index) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2"
              >
                <div className="flex flex-col gap-1 mt-2">
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => index > 0 && moveOa(index, index - 1)} disabled={index === 0}>
                    <ArrowUp className="size-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => index < oaFields.length - 1 && moveOa(index, index + 1)} disabled={index === oaFields.length - 1}>
                    <ArrowDown className="size-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Textarea 
                    placeholder={`Question ${index + 1}`} 
                    className="min-h-[60px] resize-y bg-white/50 dark:bg-black/20 focus-visible:ring-blue-500"
                    {...register(`oaQuestions.${index}.value` as any)}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeOa(index)} className="mt-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {oaFields.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No OA questions added yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <Label className="text-purple-600 dark:text-purple-400 font-bold">Technical Interview Questions</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => appendTechnical({ value: "" })} className="h-8 border-purple-500/30 text-purple-600 hover:bg-purple-500/10">
            <Plus className="size-4 mr-1" /> Add Question
          </Button>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {technicalFields.map((field, index) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2"
              >
                <div className="flex flex-col gap-1 mt-2">
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => index > 0 && moveTechnical(index, index - 1)} disabled={index === 0}>
                    <ArrowUp className="size-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => index < technicalFields.length - 1 && moveTechnical(index, index + 1)} disabled={index === technicalFields.length - 1}>
                    <ArrowDown className="size-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Textarea 
                    placeholder={`Technical Question ${index + 1}`} 
                    className="min-h-[60px] resize-y bg-white/50 dark:bg-black/20 focus-visible:ring-purple-500"
                    {...register(`technicalQuestions.${index}.value` as any)}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeTechnical(index)} className="mt-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {technicalFields.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No technical questions added yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
        <div className="flex items-center justify-between">
          <Label className="text-orange-600 dark:text-orange-400 font-bold">Personal / HR Interview Questions</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => appendPersonal({ value: "" })} className="h-8 border-orange-500/30 text-orange-600 hover:bg-orange-500/10">
            <Plus className="size-4 mr-1" /> Add Question
          </Button>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {personalFields.map((field, index) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2"
              >
                <div className="flex flex-col gap-1 mt-2">
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => index > 0 && movePersonal(index, index - 1)} disabled={index === 0}>
                    <ArrowUp className="size-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => index < personalFields.length - 1 && movePersonal(index, index + 1)} disabled={index === personalFields.length - 1}>
                    <ArrowDown className="size-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Textarea 
                    placeholder={`Personal / HR Question ${index + 1}`} 
                    className="min-h-[60px] resize-y bg-white/50 dark:bg-black/20 focus-visible:ring-orange-500"
                    {...register(`personalQuestions.${index}.value` as any)}
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removePersonal(index)} className="mt-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {personalFields.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No personal questions added yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tips">Preparation Tips (Optional)</Label>
        <Textarea 
          id="tips" 
          placeholder="Any tips for future candidates?" 
          className="min-h-[60px] resize-y"
          {...register("tips")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="e.g. System Design, DP, Graphs (comma separated)" {...register("tags")} />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input type="checkbox" id="isPublic" className="rounded border-gray-300 text-primary focus:ring-primary size-4" {...register("isPublic")} disabled />
        <Label htmlFor="isPublic" className="font-normal cursor-pointer text-sm">Post publicly to global repository</Label>
      </div>

      <div className="flex items-center space-x-2 pb-2 pt-2">
        <input type="checkbox" id="isAnonymous" className="rounded border-gray-300 text-primary focus:ring-primary size-4" {...register("isAnonymous")} />
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
