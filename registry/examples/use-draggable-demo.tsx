"use client"

import { cn } from "@/lib/utils"
import { useDraggable } from "registry/hooks/use-draggable"

export default function UseDraggableDemo() {
  const { ref, isDragging } = useDraggable<HTMLDivElement>()

  return (
    <div className="flex h-96 w-full items-center justify-center">
      {isDragging && (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center rounded-md p-4 shadow-md backdrop-blur-sm">
          <h1 className="mb-2 text-2xl font-bold">Drag me around the screen</h1>
          <p className="text-sm text-muted-foreground">
            This is a simple draggable component built using the useDraggable
            hook.
          </p>
        </div>
      )}
      <div
        ref={ref}
        className={cn(
          "flex h-24 w-48 cursor-move select-none items-center justify-center rounded-md border border-dashed border-gray-300 border-primary bg-primary/10 text-muted-foreground shadow-md backdrop-blur-sm md:z-[999]"
        )}
      >
        {isDragging ? "Dragging..." : "Drag me"}
      </div>
    </div>
  )
}
