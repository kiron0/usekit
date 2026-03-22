"use client"

import * as React from "react"
import { Maximize2, X } from "lucide-react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

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
  const [mounted, setMounted] = React.useState(false)

  const title = name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open) {
      return
    }

    const { body } = document
    const previousOverflow = body.style.overflow

    body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, setOpen])

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className={cn("relative z-10 size-6 [&_svg]:size-3")}
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Open full preview</span>
        <Maximize2 />
      </Button>
      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] h-svh w-screen bg-background"
              role="dialog"
              aria-modal="true"
              aria-label={`${title} full preview`}
            >
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex items-center justify-between border-b border-border/60 bg-background px-4 py-3 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-tight">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Full preview mode
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 rounded-full"
                    onClick={() => setOpen(false)}
                  >
                    <X className="size-4" />
                    <span className="sr-only">Close full preview</span>
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-auto bg-background">
                  <div className="flex min-h-full w-full items-center justify-center p-4 sm:p-6">
                    {children}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
