"use client"

import { useWindowSize } from "registry/hooks/use-window-size"

export default function UseWindowSizeDemo() {
  const { innerWidth, innerHeight, outerHeight, outerWidth } = useWindowSize()

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div
          className="rounded-xl border border-primary"
          style={{ width: innerWidth / 4, height: innerHeight / 4 }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform truncate text-balance text-xs md:text-base">
          <p>Inner W: {innerWidth}px</p>
          <p>Inner H: {innerHeight}px</p>
          <p>Outer W: {outerWidth}px</p>
          <p>Outer H: {outerHeight}px</p>
        </div>
      </div>
      <p className="text-balance text-center text-muted-foreground">
        Resize the window to see the width and height update in real-time!
      </p>
    </div>
  )
}
