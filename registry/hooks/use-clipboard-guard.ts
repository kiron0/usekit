import * as React from "react"

interface ClipboardGuardOptions {
  sanitizeFn?: (text: string) => string
  onCopy?: (text: string) => void
  onPaste?: (text: string) => void
}

export function useClipboardGuard(options: ClipboardGuardOptions = {}) {
  const { sanitizeFn, onCopy, onPaste } = options

  const sanitize = React.useCallback(
    (text: string): string => {
      if (sanitizeFn) {
        return sanitizeFn(text)
      }
      return text.replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    },
    [sanitizeFn]
  )

  const copy = React.useCallback(
    async (text: string): Promise<boolean> => {
      try {
        const sanitized = sanitize(text)
        await navigator.clipboard.writeText(sanitized)
        onCopy?.(sanitized)
        return true
      } catch (error) {
        console.error("Failed to copy to clipboard:", error)
        return false
      }
    },
    [sanitize, onCopy]
  )

  const paste = React.useCallback(async (): Promise<string | null> => {
    try {
      const text = await navigator.clipboard.readText()
      const sanitized = sanitize(text)
      onPaste?.(sanitized)
      return sanitized
    } catch (error) {
      console.error("Failed to read from clipboard:", error)
      return null
    }
  }, [sanitize, onPaste])

  return { copy, paste }
}
