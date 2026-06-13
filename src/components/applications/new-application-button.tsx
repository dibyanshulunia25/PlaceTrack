"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { ApplicationForm } from "./application-form"

export function NewApplicationButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="size-4 mr-2" />
        Add Application
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>Add New Application</DialogTitle>
          <DialogDescription>Track a new role you have applied for.</DialogDescription>
        </DialogHeader>
        <ApplicationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
