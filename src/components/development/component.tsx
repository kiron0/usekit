"use client"

import { useScrollDirection } from "registry/hooks/use-scroll-direction"

export function Component() {
  const direction = useScrollDirection({ threshold: 10 })

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border p-6">
      You&apos;re scrolling: {direction}
    </div>
  )
}
