"use client"

import { usePinchZoom } from "registry/hooks/use-pinch-zoom"

export default function UsePinchZoomDemo() {
  const { scale, isSupported, ...handlers } = usePinchZoom({
    onZoom: (s) => console.log("Zoom scale:", s),
    minScale: 0.2,
    maxScale: 4,
  })

  if (!isSupported) {
    return <div>Pinch zoom is not supported on this device.</div>
  }

  return (
    <div
      {...handlers}
      className="flex h-full w-full items-center justify-center overflow-hidden px-3"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/nextjs-icon.png"
        alt="Zoomable"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.1s ease-out",
        }}
        className="h-full w-full"
      />
    </div>
  )
}
