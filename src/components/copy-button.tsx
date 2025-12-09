"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { notifySuccess } from "@/components/toast"

interface CopyButtonProps extends ButtonProps {
  value: string
  src?: string
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setHasCopied(true)
    notifySuccess({
      title: "Copied",
      description: "Copied to clipboard successfully",
    })
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn("relative z-10 size-6 [&_svg]:size-3", className)}
      onClick={handleCopy}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  )
}
