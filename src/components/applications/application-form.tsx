"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { ApplicationStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createApplication, updateApplication } from "@/actions/applications"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  role: z.string().min(1, "Position is required"),
  status: z.enum(["APPLIED", "ONLINE_ASSESSMENT", "INTERVIEW", "OFFERED", "REJECTED", "WITHDRAWN"]),
  appliedAt: z.string().min(1, "Application Date is required"),
  assessmentDate: z.string().optional(),
  interviewDate: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.status === "ONLINE_ASSESSMENT" && !data.assessmentDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["assessmentDate"],
      message: "Assessment Date is required for Online Assessment",
    });
  }
  if ((data.status === "INTERVIEW" || data.status === "OFFERED" || data.status === "REJECTED") && !data.interviewDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["interviewDate"],
      message: "Interview Date is required",
    });
  }
})

type FormValues = z.infer<typeof formSchema>

interface ApplicationFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function ApplicationForm({ initialData, onSuccess }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Format dates for input type="date"
  const formatDate = (date: any) => {
    if (!date) return ""
    return new Date(date).toISOString().split("T")[0]
  }

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: initialData?.company?.name || "",
      role: initialData?.role || "",
      status: initialData?.status || "APPLIED",
      appliedAt: formatDate(initialData?.appliedAt) || new Date().toISOString().split("T")[0],
      assessmentDate: formatDate(initialData?.assessmentDate) || "",
      interviewDate: formatDate(initialData?.interviewDate) || "",
    },
  })

  const currentStatus = watch("status")

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const payload = {
        companyName: data.companyName,
        role: data.role,
        status: data.status,
        appliedAt: new Date(data.appliedAt),
        assessmentDate: data.assessmentDate ? new Date(data.assessmentDate) : null,
        interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
      }

      if (initialData?.id) {
        await updateApplication(initialData.id, payload)
      } else {
        await createApplication(payload)
      }
      
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <div className="text-sm font-medium text-destructive">{error}</div>}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Google, Apple, etc." {...register("companyName")} />
          {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Position / Role</Label>
          <Input id="role" placeholder="Software Engineer" {...register("role")} />
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={currentStatus} onValueChange={(val) => setValue("status", val as ApplicationStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="ONLINE_ASSESSMENT">Online Assessment</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFERED">Offered</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appliedAt">Date Applied</Label>
          <Input type="date" id="appliedAt" {...register("appliedAt")} />
          {errors.appliedAt && <p className="text-xs text-destructive">{errors.appliedAt.message}</p>}
        </div>

        {(currentStatus === "ONLINE_ASSESSMENT" || currentStatus === "INTERVIEW" || currentStatus === "OFFERED" || currentStatus === "REJECTED") && (
          <div className="space-y-2">
            <Label htmlFor="assessmentDate">
              Assessment Date {currentStatus === "ONLINE_ASSESSMENT" ? "" : "(Optional)"}
            </Label>
            <Input type="date" id="assessmentDate" {...register("assessmentDate")} />
            {errors.assessmentDate && <p className="text-xs text-destructive">{errors.assessmentDate.message}</p>}
          </div>
        )}

        {(currentStatus === "INTERVIEW" || currentStatus === "OFFERED" || currentStatus === "REJECTED") && (
          <div className="space-y-2">
            <Label htmlFor="interviewDate">
              Interview Date
            </Label>
            <Input type="date" id="interviewDate" {...register("interviewDate")} />
            {errors.interviewDate && <p className="text-xs text-destructive">{errors.interviewDate.message}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Application"
          )}
        </Button>
      </div>
    </form>
  )
}
