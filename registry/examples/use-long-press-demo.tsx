"use client"

import * as React from "react"
import { X } from "lucide-react"
import * as ReactDOM from "react-dom"

import { Button } from "@/components/ui/button"
import {
  useLongPress,
  type LongPressCallback,
} from "registry/hooks/use-long-press"

export default function UseLongPressDemo() {
  const [open, setOpen] = React.useState(false)

  const handleLongPress: LongPressCallback = (event) => {
    console.log("Long press detected!", event)
  }

  const handleStart: LongPressCallback = (event) => {
    console.log("Press started", event)
  }

  const handleFinish: LongPressCallback = (event) => {
    console.log("Press finished", event)
    setOpen(true)
  }

  const handleCancel: LongPressCallback = (event) => {
    console.log("Press cancelled", event)
  }

  const buttonHandlers = useLongPress(handleLongPress, {
    threshold: 500,
    onStart: handleStart,
    onFinish: handleFinish,
    onCancel: handleCancel,
  })

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    if (open) {
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [open])

  return (
    <div className="space-y-4 text-center">
      <Button {...buttonHandlers}>Press and hold me</Button>
      <p className="text-balance text-muted-foreground">
        Open the console to see the logs
      </p>
      {open && <Demo setOpen={setOpen} />}
    </div>
  )
}

function Demo({ setOpen }: { setOpen: (open: boolean) => void }) {
  if (typeof window === "object") {
    return ReactDOM.createPortal(
      <>
        <div
          className="fixed inset-0 z-[48] bg-black/40 backdrop-blur-sm md:z-[998]"
          onClick={() => setOpen(false)}
        />
        <dialog className="fixed left-1/2 right-1/2 top-1/2 z-[49] grid h-60 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-4 text-muted-foreground shadow-md md:z-[999] md:w-full">
          <div className="relative flex h-full items-center justify-center">
            <X
              size={18}
              className="absolute right-1 top-1 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <p className="text-balance text-center">
              This is a dialog that opens when you press and hold the button for
              500ms or more. The button also triggers a long press event. Open
              the console to see the logs.
            </p>
          </div>
        </dialog>
      </>,
      document.body
    )
  }

  return <></>
}
