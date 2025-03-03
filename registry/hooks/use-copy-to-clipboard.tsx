import * as React from "react"

type CopyFn = (text: string) => Promise<void>

export function useCopyToClipboard(delay = 2000): [CopyFn, boolean] {
  const [isCopied, setIsCopied] = React.useState(false)

  React.useEffect(() => {
    if (!isCopied) return

    const timer = setTimeout(() => {
      setIsCopied(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [isCopied, delay])

  const copy: CopyFn = React.useCallback(async (text) => {
    if (!navigator?.clipboard) {
      throw new Error("Clipboard not supported")
    }

    if (!text) {
      throw new Error("The 'text' argument is required.")
    }

    const isPlainText = /^[\x00-\x7F]*$/.test(text)
    const isHtmlText = /<[^>]+>/.test(text)
    const isMarkdownText = /^#+\s/.test(text)

    const clipboardItem = new ClipboardItem(
      isPlainText
        ? { "text/plain": new Blob([text], { type: "text/plain" }) }
        : isHtmlText
          ? { "text/html": new Blob([text], { type: "text/html" }) }
          : isMarkdownText
            ? { "text/markdown": new Blob([text], { type: "text/markdown" }) }
            : { "text/plain": new Blob([text], { type: "text/plain" }) }
    )

    try {
      await navigator.clipboard.write([clipboardItem])
      setIsCopied(true)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Copy failed") // Throw error instead of returning false
    }
  }, [])

  return [copy, isCopied]
}
