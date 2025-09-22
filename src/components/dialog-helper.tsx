"use client"

import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DialogHelperProps {
  trigger?: ReactNode
  children: ReactNode
  title: string
  description: string | ReactNode
  className?: string
  open?: boolean
  setOpen?: (value: boolean) => void
  disabled?: boolean
}

export function DialogHelper({
  trigger,
  children,
  title,
  description,
  className,
  open,
  setOpen,
  disabled,
}: DialogHelperProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild disabled={disabled}>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className={cn("max-w-xl", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
