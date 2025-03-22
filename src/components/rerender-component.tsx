"use client"

import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

interface RerenderComponentProps extends ButtonProps {
  onClick: () => void
}

export function RerenderComponent({
  className,
  variant = "ghost",
  onClick: handleRerender,
  ...props
}: RerenderComponentProps) {
  return (
    <Button
      size="icon"
      variant={variant}
      className={cn("relative z-10 size-6 [&_svg]:size-3", className)}
      onClick={handleRerender}
      {...props}
    >
      <span className="sr-only">Rerender</span>
      <RotateCcw />
    </Button>
  )
}
