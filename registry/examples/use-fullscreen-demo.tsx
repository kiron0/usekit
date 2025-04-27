"use client"

import { Button } from "@/components/ui/button"
import { useFullscreen } from "registry/hooks/use-fullscreen"

export default function UseFullscreenDemo() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 py-5">
      <FullscreenRef />
      <Fullscreen />
    </div>
  )
}

function FullscreenRef() {
  const { ref, toggleFullscreen, isFullscreen } =
    useFullscreen<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="mx-auto flex aspect-video w-2/3 flex-col items-center justify-center gap-2 rounded-lg border text-center"
    >
      On specific area
      <Button onClick={toggleFullscreen}>
        {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      </Button>
    </div>
  )
}

function Fullscreen() {
  const { toggleFullscreen, isFullscreen } = useFullscreen()

  return (
    <div className="flex flex-col gap-2 text-center">
      On whole screen
      <Button onClick={toggleFullscreen}>
        {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      </Button>
    </div>
  )
}
