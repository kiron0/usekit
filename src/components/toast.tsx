"use client"

import { toast } from "@/hooks/use-toast"

interface ToastProps {
  title?: string
  description: string
  duration?: number
}

export const notifySuccess = ({ description, title, duration }: ToastProps) => {
  toast({
    title: title || "Success",
    description,
    variant: "default",
    duration: duration || 2000,
  })
}

export const notifyError = ({ description, title, duration }: ToastProps) => {
  toast({
    title: title || "Error",
    description,
    variant: "destructive",
    duration: duration || 5000,
  })
}
