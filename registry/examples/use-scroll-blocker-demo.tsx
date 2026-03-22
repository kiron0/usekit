"use client"

import * as React from "react"
import { Lock, Unlock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DialogHelper } from "@/components/dialog-helper"
import { useScrollBlocker } from "registry/hooks/use-scroll-blocker"

export default function UseScrollBlockerDemo() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { isBlocked, block, unblock, toggle } = useScrollBlocker()

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setIsOpen(next)
      if (next) {
        block()
      } else {
        unblock()
      }
    },
    [block, unblock]
  )

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
            <Badge variant={isBlocked ? "destructive" : "secondary"}>
              {isBlocked ? (
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
            <DialogHelper
              modal={false}
              open={isOpen}
              setOpen={handleOpenChange}
              trigger={<Button>Open Modal</Button>}
              title="Modal with scroll blocking"
              description={
                <>
                  Background scroll is handled by{" "}
                  <code className="rounded bg-muted px-1">
                    useScrollBlocker
                  </code>{" "}
                  (Radix <code className="rounded bg-muted px-1">modal</code> is
                  off so it does not fight the hook). Try scrolling the page
                  behind this dialog.
                </>
              }
            >
              <p className="text-sm text-muted-foreground">
                Use <strong>Toggle scroll</strong> to temporarily allow
                background scrolling while the dialog stays open.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
                <Button onClick={() => toggle()}>
                    {isBlocked ? "Unblock scroll" : "Block scroll"}
                </Button>
              </div>
            </DialogHelper>
            <p className="text-sm text-muted-foreground">
              Click the button above to open a modal. Notice how the background
              page cannot be scrolled while scroll blocking is active.
            </p>
          </div>

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
