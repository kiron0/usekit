"use client"

import { useMediaQuery } from "registry/hooks/use-media-query"

import { cn } from "@/lib/utils"

export default function UseMediaQueryDemo() {
  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)")
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width: 769px) and (max-width: 992px)"
  )
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width: 993px) and (max-width: 1200px)"
  )
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width: 1201px)"
  )

  const devices = [
    { name: "Small Device", icon: "📱", isMatched: isSmallDevice },
    { name: "Medium Device", icon: "💻", isMatched: isMediumDevice },
    { name: "Large Device", icon: "🖥️", isMatched: isLargeDevice },
    { name: "Extra Large Device", icon: "🖼️", isMatched: isExtraLargeDevice },
  ]

  return (
    <div className="space-y-4 text-center">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {devices.map((device) => (
          <div
            key={device.name}
            className={cn(
              "border rounded-lg text-center px-7 py-5",
              device.isMatched ? "border-[#adfa1d]" : ""
            )}
          >
            {device.icon}
            <p className="text-muted-foreground text-sm">{device.name}</p>
          </div>
        ))}
      </div>
      <p className="w-3/4 text-center text-muted-foreground mx-auto">
        Resize your browser window to see changes.
      </p>
    </div>
  )
}
