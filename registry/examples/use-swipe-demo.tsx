"use client"

import { notifySuccess } from "@/components/toast"
import { useSwipe } from "registry/hooks/use-swipe"

export default function UseSwipeDemo() {
  const handlers = useSwipe({
    onSwipe: (direction: string) =>
      notifySuccess({
        title: "Swipe detected",
        description: `You swiped ${direction}`,
      }),
    threshold: 50,
  })

  return (
    <div
      {...handlers}
      className="mx-auto flex h-96 w-full cursor-grab select-none items-center justify-center rounded-xl border text-lg"
    >
      Swipe or Drag me 👆
    </div>
  )
}
