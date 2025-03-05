"use client"

import { useWindowScroll } from "registry/hooks/use-window-scroll"

import { Button } from "@/components/ui/button"

export default function WindowScrollDemo() {
  const [{ x, y }, scrollTo] = useWindowScroll()

  const scrollToTop = () => {
    scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToBottom = () => {
    scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
  }

  return (
    <div>
      <div className="relative flex flex-col items-center w-full justify-center">
        <div className="fixed top-1/3 md:top-20 xl:top-1/4 right-0 left-0 md:left-auto mx-auto md:mx-0 md:right-5 xl:right-1/3 p-5 z-50 bg-muted/10 backdrop-blur-sm border border-dashed border-primary rounded-xl w-80 space-y-4">
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
              disabled={y === document.body.scrollHeight - window.innerHeight}
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
