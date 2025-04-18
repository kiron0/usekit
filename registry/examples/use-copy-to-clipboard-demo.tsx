import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { notifyError, notifySuccess } from "@/components/toast"
import { useCopyToClipboard } from "registry/hooks/use-copy-to-clipboard"

export default function UseCopyToClipboardDemo() {
  const [copy, isCopied] = useCopyToClipboard()

  const copyText = async (text: string) => {
    await copy(text)
      .then(() => {
        notifySuccess({
          title: "Copied to clipboard",
          description: text,
        })
      })
      .catch((error) => {
        if (error instanceof Error) {
          notifyError({
            title: "Copy failed",
            description: error.message,
          })
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
