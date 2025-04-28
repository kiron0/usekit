"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFocusTrap } from "registry/hooks/use-focus-trap"

export default function UseFocusTrapDemo() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const modalRef = useFocusTrap<HTMLDivElement>(
    isModalOpen,
    'input[name="name"]'
  )

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <Button onClick={openModal}>Open Modal</Button>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm md:z-[998]" />
          <div
            ref={modalRef}
            className="fixed left-1/2 top-1/2 z-[999] grid w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-md md:w-full"
          >
            <div className="relative flex h-full flex-col gap-6">
              <button
                onClick={closeModal}
                aria-label="Close"
                className="absolute right-0 top-0"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Focus Trap Modal</h2>
                <p className="text-sm text-muted-foreground">
                  Try tabbing around! Focus stays inside this modal.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Input type="text" name="name" placeholder="Enter your name" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <Button variant="outline">Another Action</Button>
              </div>
            </div>
          </div>
        </>
      )}

      <ul className="list-disc space-y-2 text-sm text-muted-foreground">
        <li>Open modal ➔ Focus jumps to first input</li>
        <li>Press Tab ➔ Moves to next input/button</li>
        <li>After last ➔ Cycles back to first</li>
        <li>Press Shift+Tab ➔ Moves backwards</li>
        <li>Press Escape ➔ Modal closes</li>
      </ul>
    </div>
  )
}
