"use client"

import * as React from "react"

export interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

export interface UseNativeShareOptions {
  onFallback?: (data: ShareData) => void | Promise<void>
}

export interface UseNativeShareResult {
  canShare: boolean
  isSharing: boolean
  error: Error | null
  share: (data: ShareData) => Promise<void>
}

function isNavigatorShareSupported() {
  if (typeof navigator === "undefined") return false
  return typeof navigator.share === "function"
}

function canNavigatorShare(data?: ShareData) {
  if (typeof navigator === "undefined") return false
  if (!("share" in navigator)) return false
  if ("canShare" in navigator && typeof navigator.canShare === "function") {
    try {
      return navigator.canShare(data)
    } catch {
      return false
    }
  }
  return true
}

export function useNativeShare(
  options: UseNativeShareOptions = {}
): UseNativeShareResult {
  const [isSharing, setIsSharing] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const baseSupport = React.useMemo(() => isNavigatorShareSupported(), [])

  const share = React.useCallback<UseNativeShareResult["share"]>(
    async (data) => {
      setError(null)

      const canUseNative = baseSupport && canNavigatorShare(data)

      if (!canUseNative) {
        if (options.onFallback) {
          await options.onFallback(data)
          return
        }

        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[useNativeShare] navigator.share is not available; provide an `onFallback` to handle this case."
          )
        }
        throw new Error("Native share is not supported in this browser.")
      }

      try {
        setIsSharing(true)
        await navigator.share(data)
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to share content.")

        if (err.name === "AbortError" || err.name === "NotAllowedError") {
          setIsSharing(false)
          return
        }

        setError(err)

        if (options.onFallback) {
          await options.onFallback(data)
        } else if (process.env.NODE_ENV !== "production") {
          console.warn("[useNativeShare] Share failed:", err)
        }

        throw err
      } finally {
        setIsSharing(false)
      }
    },
    [baseSupport, options]
  )

  return {
    canShare: baseSupport,
    isSharing,
    error,
    share,
  }
}
