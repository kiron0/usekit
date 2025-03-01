"use client"

import { useOrientation } from "registry/hooks/use-orientation"

import { Badge } from "@/components/ui/badge"

export default function OrientationDemo() {
  const { angle, type } = useOrientation()

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        style={{
          aspectRatio: type.startsWith("portrait") ? "9 / 16" : "16 / 9",
        }}
        className="border-2 p-5 rounded-xl w-60 md:min-w-96 flex items-center justify-center h-full"
      >
        <Badge className="capitalize truncate">
          {type.replace(/-/, " ")} ({angle}°)
        </Badge>
      </div>
    </div>
  )
}
