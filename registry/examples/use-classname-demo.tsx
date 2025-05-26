"use client"

import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { useClassName } from "registry/hooks/use-classname"

interface ButtonProps {
  isPrimary?: boolean
  isDisabled?: boolean
  children: React.ReactNode
}

function Button({
  isPrimary = false,
  isDisabled = false,
  children,
}: ButtonProps) {
  const className = useClassName([
    buttonVariants(),
    isDisabled
      ? "opacity-50 pointer-events-none"
      : isPrimary
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "border-gray-400",
  ])

  return (
    <button className={className} disabled={isDisabled}>
      {children}
    </button>
  )
}

export default function UseClassNameDemo() {
  const [disabled, setDisabled] = React.useState(false)

  return (
    <div className="space-x-2">
      <Button isPrimary={!disabled} isDisabled={disabled}>
        {disabled ? "Disabled Button" : "Primary Button"}
      </Button>

      <button
        onClick={() => setDisabled((prev) => !prev)}
        className={buttonVariants()}
      >
        Toggle {disabled ? "Enable" : "Disable"}
      </button>
    </div>
  )
}
