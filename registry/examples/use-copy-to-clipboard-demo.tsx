"use client"

import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react"
import { useCopyToClipboard } from "registry/hooks/use-copy-to-clipboard"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function UseCopyToClipboardDemo() {
  const [copy, isCopied] = useCopyToClipboard()

  const copyText = async (text: string) => {
    await copy(text)
      .then(() => {
        toast.success("Copied to clipboard")
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      })
  }

  return (
    <Button
      variant="outline"
      className="gap-2 text-sm"
      onClick={() => copyText("I'm copied!")}
    >
      Click me to copy
      {isCopied ? (
        <ClipboardCheckIcon size={10} />
      ) : (
        <ClipboardIcon size={10} />
      )}
    </Button>
  )
}
