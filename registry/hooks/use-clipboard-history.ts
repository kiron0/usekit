import * as React from "react"

const DEFAULT_STORAGE_KEY = "usekit:clipboard-history"
const DEFAULT_SIZE = 10

export interface UseClipboardHistoryOptions {
  size?: number
  storageKey?: string
  secureClear?: boolean
  dedupe?: boolean
}

export interface UseClipboardHistoryReturn {
  list: string[]
  push: (value: string) => void
  pull: () => Promise<void>
  clear: () => Promise<void>
}

function readStoredHistory(storageKey: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => typeof item === "string")
        .map((item) => item)
    }
  } catch {}
  return []
}

export function useClipboardHistory(
  options: UseClipboardHistoryOptions = {}
): UseClipboardHistoryReturn {
  const {
    size = DEFAULT_SIZE,
    storageKey = DEFAULT_STORAGE_KEY,
    secureClear = false,
    dedupe = true,
  } = options

  const [list, setList] = React.useState<string[]>(() =>
    readStoredHistory(storageKey)
  )

  const persist = React.useCallback(
    (items: string[]) => {
      if (typeof window === "undefined") return
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(items))
      } catch {}
    },
    [storageKey]
  )

  const push = React.useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (!trimmed) return

      setList((prev) => {
        const items = dedupe
          ? prev.filter((entry) => entry !== trimmed)
          : prev.slice()

        const next = [trimmed, ...items].slice(0, size)
        persist(next)
        return next
      })
    },
    [dedupe, persist, size]
  )

  const pull = React.useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.readText) {
      console.warn(
        "[useClipboardHistory] Clipboard API not available in this environment."
      )
      return
    }

    try {
      const text = await navigator.clipboard.readText()
      push(text)
    } catch (error) {
      console.warn("[useClipboardHistory] Failed to read clipboard:", error)
    }
  }, [push])

  const clear = React.useCallback(async () => {
    setList([])
    persist([])

    if (
      secureClear &&
      typeof navigator !== "undefined" &&
      navigator.clipboard?.writeText
    ) {
      try {
        await navigator.clipboard.writeText("")
      } catch (error) {
        console.warn("[useClipboardHistory] Failed to clear clipboard:", error)
      }
    }
  }, [persist, secureClear])

  React.useEffect(() => {
    const stored = readStoredHistory(storageKey)
    if (stored.length) {
      setList(stored.slice(0, size))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  return {
    list,
    push,
    pull,
    clear,
  }
}
