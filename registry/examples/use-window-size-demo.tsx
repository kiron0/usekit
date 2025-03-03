"use client"

import { useWindowSize } from "registry/hooks/use-window-size"

export default function UseWindowSizeDemo() {
  const { width, height } = useWindowSize()

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div
          className="border border-primary rounded-xl"
          style={{ width: width / 4, height: height / 4 }}
        />
        <div className="absolute top-1/2 truncate left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
