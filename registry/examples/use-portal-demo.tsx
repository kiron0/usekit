"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { usePortal } from "registry/hooks/use-portal"

export default function UsePortalDemo() {
  const [open, setOpen] = React.useState(false)

  const { Portal } = usePortal()

  return (
    <div className="flex h-full w-full items-center justify-center p-2 pt-6">
      <Button onClick={() => setOpen(!open)}>Open Modal</Button>
      {open && (
        <Portal>
          <div className="fixed inset-0 z-[48] bg-black/40 backdrop-blur-sm md:z-[998]" />
          <div className="fixed left-1/2 top-1/2 z-[49] grid h-60 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-4 text-muted-foreground shadow-md md:z-[999] md:w-full">
            <div className="relative flex h-full items-center justify-center">
              <X
                size={18}
                className="absolute right-1 top-1 cursor-pointer"
                onClick={() => setOpen(!open)}
                aria-label="Close modal"
              />
              <p className="text-balance text-center">
                This is a modal rendered in a portal. Click the button to close
                it or click outside the modal.
              </p>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
