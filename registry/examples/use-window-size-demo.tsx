"use client"

import { useWindowSize } from "registry/hooks/use-window-size"

export default function UseWindowSizeDemo() {
  const { width, height } = useWindowSize()

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div
          className="rounded-xl border border-primary"
          style={{ width: width / 4, height: height / 4 }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform truncate">
          <p>W: {width}px</p>
          <p>H: {height}px</p>
        </div>
      </div>
      <p className="text-balance text-center text-muted-foreground">
        Resize the window to see the width and height update in real-time!
      </p>
    </div>
  )
}
