"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notifyError, notifySuccess } from "@/components/toast"
import { useClipboardGuard } from "registry/hooks/use-clipboard-guard"

export default function UseClipboardGuardDemo() {
  const [text, setText] = useState("")
  const [pastedText, setPastedText] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)

  const { copy, paste } = useClipboardGuard({
    sanitizeFn: (input) => {
      return input.replace(/[<>]/g, "")
    },
    onCopy: (sanitized) => {
      notifySuccess({
        title: "Copied text successfully",
        description: sanitized,
      })
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    },
    onPaste: (sanitized) => {
      notifySuccess({
        title: "Pasted text successfully",
        description: sanitized,
      })
    },
  })

  const handleCopy = async () => {
    const success = await copy(text)
    if (!success) {
      notifyError({
        description: "Failed to copy to clipboard",
      })
    }
  }

  const handlePaste = async () => {
    const result = await paste()
    if (result) {
      setPastedText(result)
    } else {
      notifyError({
        description: "Failed to read from clipboard",
      })
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Clipboard Guard</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Text to Copy</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text (<> will be sanitized)"
          />
          <div className="flex gap-2">
            <Button onClick={handleCopy} disabled={!text}>
              Copy (Sanitized)
            </Button>
            {copySuccess && (
              <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                Copied!
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Paste from Clipboard</label>
          <div className="flex gap-2">
            <Button onClick={handlePaste}>Paste (Sanitized)</Button>
          </div>
          {pastedText && (
            <div className="rounded-lg border bg-muted p-3">
              <p className="text-sm font-medium">Pasted Text:</p>
              <p className="mt-1 text-sm">{pastedText}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          The clipboard guard automatically sanitizes text by removing &lt; and
          &gt; characters. Try copying text with these characters to see them
          removed.
        </p>
      </div>
    </div>
  )
}
