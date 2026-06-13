"use client"

import { ApplicationStatus } from "@prisma/client"
import { format } from "date-fns"
import { MoreHorizontal, Building2, Calendar, MapPin, DollarSign, Trash, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { deleteApplication } from "@/actions/applications"
import { ApplicationForm } from "./application-form"
import { ProgressTracker } from "./progress-tracker"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"

export function ApplicationCard({ application }: { application: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      startTransition(() => {
        deleteApplication(application.id)
      })
    }
  }

  return (
    <>
      <Card className="bg-white dark:bg-white/5 backdrop-blur-xl border-border/80 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all overflow-hidden flex flex-col shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold truncate leading-tight">{application.role}</CardTitle>
              <div className="flex items-center text-muted-foreground mt-1.5 text-sm font-medium">
                <Building2 className="size-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{application.company.name}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 flex-shrink-0">
                  <MoreHorizontal className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
                  <Edit className="size-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} disabled={isPending} className="cursor-pointer text-destructive focus:text-destructive">
                  <Trash className="size-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <div className="space-y-3 text-sm text-foreground/80">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">Applied: {format(new Date(application.appliedAt), "MMM d, yyyy")}</span>
            </div>
            {application.assessmentDate && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">OA: {format(new Date(application.assessmentDate), "MMM d, yyyy")}</span>
              </div>
            )}
            {application.interviewDate && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">Interview: {format(new Date(application.interviewDate), "MMM d, yyyy")}</span>
              </div>
            )}
            {application.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{application.location}</span>
              </div>
            )}
            {application.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{application.salary}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-6">
          <ProgressTracker status={application.status} />
        </CardFooter>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>Update the details of your application here.</DialogDescription>
          </DialogHeader>
          <ApplicationForm initialData={application} onSuccess={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
