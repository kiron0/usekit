"use client"

import * as React from "react"
import { X } from "lucide-react"
import * as ReactDOM from "react-dom"
import {
  useLongPress,
  type LongPressCallback,
} from "registry/hooks/use-long-press"

import { Button } from "@/components/ui/button"

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
      <p className="text-muted-foreground text-balance">
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
          onClick={() => setOpen(false)}
        />
        <dialog className="fixed left-1/2 right-1/2 top-1/2 z-[999] grid w-[95%] md:w-full max-w-lg -translate-x-1/2 -translate-y-1/2 h-60 rounded-xl border bg-background p-4 text-muted-foreground shadow-md">
          <div className="relative flex justify-center items-center h-full">
            <X
              size={18}
              className="absolute top-1 right-1 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <p className="text-center text-balance">
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
