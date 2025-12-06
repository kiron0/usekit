"use client"

import * as React from "react"
import { Lock, Unlock, X } from "lucide-react"
import { createPortal } from "react-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useScrollBlocker } from "registry/hooks/use-scroll-blocker"

export default function UseScrollBlockerDemo() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { block, unblock } = useScrollBlocker()

  const handleOpen = () => {
    setIsOpen(true)
    block()
  }

  const handleClose = () => {
    setIsOpen(false)
    unblock()
  }

  React.useEffect(() => {
    if (!isOpen) {
      unblock()
    }
  }, [isOpen, unblock])

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border-none bg-transparent p-0">
        <CardHeader className="flex flex-col justify-between gap-3 p-0 lg:flex-row">
          <div>
            <CardTitle>Scroll Blocker</CardTitle>
            <CardDescription>
              Block background scrolling when modals or popups are open. Try
              opening the modal and scrolling the page behind it.
            </CardDescription>
          </div>
          <div>
            <Badge variant={isOpen ? "destructive" : "secondary"}>
              {isOpen ? (
                <>
                  <Lock className="mr-1 h-3 w-3" />
                  Blocked
                </>
              ) : (
                <>
                  <Unlock className="mr-1 h-3 w-3" />
                  Unblocked
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="space-y-4">
            <Button onClick={handleOpen}>Open Modal</Button>
            <p className="text-sm text-muted-foreground">
              Click the button above to open a modal. Notice how the background
              page cannot be scrolled while the modal is open.
            </p>
          </div>

          {isOpen &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-[48] bg-black/40 backdrop-blur-sm md:z-[998]"
                onClick={handleClose}
              >
                <div
                  className="fixed left-1/2 top-1/2 z-[49] grid h-80 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 text-muted-foreground shadow-md md:z-[999] md:w-full"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <div className="relative flex h-full flex-col">
                    <button
                      onClick={handleClose}
                      className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>
                    <div className="flex flex-1 flex-col gap-4">
                      <h3 className="text-lg font-semibold">
                        Modal with Scroll Blocking
                      </h3>
                      <p className="text-sm">
                        This modal blocks background scrolling. Try scrolling
                        the page behind this modal — it won&apos;t work!
                      </p>
                      <div className="mt-auto flex gap-2">
                        <Button variant="outline" onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          onClick={() => {
                            unblock()
                            setTimeout(() => {
                              block()
                            }, 100)
                          }}
                        >
                          Toggle Scroll
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}

          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <h4 className="mb-2 text-sm font-semibold">How it works</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Call <code className="rounded bg-muted px-1">block()</code> when
                opening a modal or popup
              </li>
              <li>
                Call <code className="rounded bg-muted px-1">unblock()</code>{" "}
                when closing it
              </li>
              <li>
                The hook preserves scroll position and restores it when
                unblocking
              </li>
              <li>
                Multiple modals work correctly — scroll only unblocks when all
                modals are closed
              </li>
              <li>
                Automatically cleans up if the component unmounts while blocked
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-dashed border-muted-foreground/40 p-4">
            <h4 className="mb-2 text-sm font-semibold">Try it out</h4>
            <p className="text-sm text-muted-foreground">
              Scroll this page up and down, then open the modal. Notice how the
              background stays fixed while the modal is open. This prevents
              users from accidentally scrolling the content behind modals.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
