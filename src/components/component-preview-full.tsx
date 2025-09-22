"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon, Maximize2 } from "lucide-react"

import { cn } from "@/lib/utils"

import { DialogHelper } from "./dialog-helper"
import { Button } from "./ui/button"

interface ComponentPreviewFullProps {
  name: string
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}

export function ComponentPreviewFull({
  name,
  children,
  open,
  setOpen,
}: ComponentPreviewFullProps) {
  const title = name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <DialogHelper
      title={title}
      description=""
      trigger={
        <Button
          size="icon"
          variant="ghost"
          className={cn("relative z-10 size-6 [&_svg]:size-3")}
        >
          <span className="sr-only">Preview</span>
          <Maximize2 />
        </Button>
      }
      className="w-full max-w-5xl"
      open={open}
      setOpen={setOpen}
    >
      <div className="flex h-full min-h-[350px] w-full items-center justify-center">
        {children}
      </div>
    </DialogHelper>
  )
}
