import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react"
import { useCopyToClipboard } from "registry/use-copy-to-clipboard/use-copy-to-clipboard"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function UseCopyToClipboardDemo() {
  const [copy, isCopied] = useCopyToClipboard()

  return (
    <Button
      variant="outline"
      className="gap-2 text-sm"
      onClick={() =>
        copy("Hello world").then(() =>
          toast("Text Copied to your clipboard 🎉.")
        )
      }
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
