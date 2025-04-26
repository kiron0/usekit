import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
}

export function Loading({ className }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex h-screen flex-col items-center justify-center gap-2 text-center",
        className
      )}
    >
      <Loader2 className="animate-spin" />
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold">Loading...</p>
        <span className="text-xs">Please wait</span>
      </div>
    </div>
  )
}
