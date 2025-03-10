"use client"

import { Badge } from "@/components/ui/badge"
import { useOrientation } from "registry/hooks/use-orientation"

export default function OrientationDemo() {
  const { angle, type } = useOrientation()

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        style={{
          aspectRatio: type.startsWith("portrait") ? "9 / 16" : "16 / 9",
        }}
        className="flex h-full w-60 items-center justify-center rounded-xl border border-primary p-5 md:min-w-96"
      >
        <Badge className="truncate capitalize">
          {type.replace(/-/, " ")} ({angle}°)
        </Badge>
      </div>
    </div>
  )
}
