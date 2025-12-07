import * as React from "react"

interface Options {
  shortcut?: string[]
  enabled?: boolean
}

interface Return {
  open: () => void
  close: () => void
  isOpen: boolean
}

export function useDevMenu(options: Options = {}): Return {
  const isMac =
    typeof navigator !== "undefined" &&
    (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator as any).userAgentData?.platform === "macOS")
  const defaultShortcut = isMac
    ? ["Meta", "Shift", "D"]
    : ["Control", "Shift", "D"]
  const { shortcut = defaultShortcut, enabled = true } = options
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.isContentEditable ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return
      }

      const modifierKeys = new Set<string>()
      let mainKey: string | null = null

      for (const key of shortcut) {
        const normalizedKey = key.toLowerCase()
        if (normalizedKey === "control" || normalizedKey === "ctrl") {
          modifierKeys.add("ctrl")
        } else if (normalizedKey === "shift") {
          modifierKeys.add("shift")
        } else if (normalizedKey === "alt") {
          modifierKeys.add("alt")
        } else if (normalizedKey === "meta" || normalizedKey === "cmd") {
          modifierKeys.add("meta")
        } else {
          mainKey = key
        }
      }

      const ctrlRequired = modifierKeys.has("ctrl")
      const shiftRequired = modifierKeys.has("shift")
      const altRequired = modifierKeys.has("alt")
      const metaRequired = modifierKeys.has("meta")

      const ctrlPressed = event.ctrlKey
      const shiftPressed = event.shiftKey
      const altPressed = event.altKey
      const metaPressed = event.metaKey

      const modifiersMatch =
        ctrlRequired === ctrlPressed &&
        shiftRequired === shiftPressed &&
        altRequired === altPressed &&
        metaRequired === metaPressed

      let keyMatches = true
      if (mainKey) {
        keyMatches = event.key.toLowerCase() === mainKey.toLowerCase()
      }

      const isShortcutMatch = modifiersMatch && keyMatches

      if (isShortcutMatch) {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [shortcut, enabled])

  return { open, close, isOpen }
}
