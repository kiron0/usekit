"use client"

import * as React from "react"
import { useIntersectionObserver } from "registry/hooks/use-intersection-observer"

import { cn } from "@/lib/utils"

export default function Component() {
  const targetRef = React.useRef<HTMLDivElement>(null)

  const entry = useIntersectionObserver(targetRef, {
    threshold: 0.5, // Trigger when 50% of the element is visible
    rootMargin: "0px", // No margin around the root
  })

  const isVisible = entry?.isIntersecting ?? false

  return (
    <div
      ref={targetRef}
      className={cn(
        "w-fit mx-auto text-center px-3 py-1 rounded-md",
        isVisible ? "bg-green-500" : "bg-red-500"
      )}
    >
      {isVisible ? "Visible" : "Not Visible"}
    </div>
  )
}
