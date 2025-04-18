"use client"

import { Button } from "@/components/ui/button"
import { useWindowScroll } from "registry/hooks/use-window-scroll"

export default function WindowScrollDemo() {
  const [{ x, y }, scrollTo] = useWindowScroll()

  const scrollToTop = () => {
    scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToBottom = () => {
    if (typeof document !== "undefined") {
      scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }
  }

  return (
    <div>
      <div className="relative flex w-full flex-col items-center justify-center">
        <div className="fixed left-0 right-0 top-1/3 z-50 mx-auto w-80 space-y-4 rounded-xl border border-dashed border-primary bg-muted/10 p-5 backdrop-blur-sm md:left-auto md:right-5 md:top-20 md:mx-0 xl:right-1/3 xl:top-1/4">
          <p>
            Current position: {x ?? "Loading..."},{" "}
            {y?.toFixed(0) ?? "Loading..."}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={scrollToTop} disabled={y === 0}>
              Scroll to Top
            </Button>
            <Button
              onClick={scrollToBottom}
              disabled={
                y ===
                (typeof document !== "undefined"
                  ? document.body.scrollHeight - window.innerHeight
                  : undefined)
              }
            >
              Scroll to Bottom
            </Button>
          </div>
        </div>
      </div>
      <p className="text-center">
        Scroll up and down to see the position change
      </p>
    </div>
  )
}
