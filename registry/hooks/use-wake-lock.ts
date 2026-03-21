import * as React from "react"

type WakeLockType = "screen"

interface WakeLockSentinelLike {
  released: boolean
  type: WakeLockType
  onrelease: ((event: Event) => void) | null
  release: () => Promise<void>
}

interface WakeLockLike {
  request: (type?: WakeLockType) => Promise<WakeLockSentinelLike>
}

export interface UseWakeLockOptions {
  autoReleaseOnHidden?: boolean
  reacquireOnVisible?: boolean
  type?: WakeLockType
}

export interface UseWakeLockResult {
  isSupported: boolean
  isActive: boolean
  error: Error | null
  request: () => Promise<boolean>
  release: () => Promise<void>
}

function getWakeLockSupport(): WakeLockLike | null {
  if (typeof navigator === "undefined") return null

  const wakeLock = (navigator as Navigator & { wakeLock?: WakeLockLike })
    .wakeLock

  if (!wakeLock || typeof wakeLock.request !== "function") {
    return null
  }

  return wakeLock
}

function toError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback)
}

export function useWakeLock(
  options: UseWakeLockOptions = {}
): UseWakeLockResult {
  const {
    autoReleaseOnHidden = true,
    reacquireOnVisible = true,
    type = "screen",
  } = options

  const [isActive, setIsActive] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const sentinelRef = React.useRef<WakeLockSentinelLike | null>(null)
  const desiredRef = React.useRef(false)
  const isSupported = React.useMemo(() => getWakeLockSupport() !== null, [])

  const releaseCurrent = React.useCallback(async (clearDesired: boolean) => {
    const sentinel = sentinelRef.current

    if (clearDesired) {
      desiredRef.current = false
    }

    if (!sentinel) {
      setIsActive(false)
      return
    }

    sentinelRef.current = null
    sentinel.onrelease = null

    try {
      if (!sentinel.released) {
        await sentinel.release()
      }
    } catch (error) {
      setError(toError(error, "Failed to release wake lock."))
    } finally {
      setIsActive(false)
    }
  }, [])

  const request = React.useCallback(async () => {
    const existing = sentinelRef.current

    desiredRef.current = true
    setError(null)

    if (existing && !existing.released) {
      setIsActive(true)
      return true
    }

    const wakeLock = getWakeLockSupport()

    if (!wakeLock) {
      setIsActive(false)
      setError(new Error("Wake Lock API is not supported in this browser."))
      return false
    }

    try {
      const sentinel = await wakeLock.request(type)

      sentinel.onrelease = () => {
        sentinelRef.current = null
        setIsActive(false)
      }

      sentinelRef.current = sentinel
      setIsActive(!sentinel.released)

      return !sentinel.released
    } catch (error) {
      setIsActive(false)
      setError(toError(error, "Failed to acquire wake lock."))
      return false
    }
  }, [type])

  const release = React.useCallback(async () => {
    await releaseCurrent(true)
  }, [releaseCurrent])

  React.useEffect(() => {
    if (typeof document === "undefined") return
    if (!autoReleaseOnHidden && !reacquireOnVisible) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && autoReleaseOnHidden) {
        void releaseCurrent(false)
      }

      if (
        document.visibilityState === "visible" &&
        reacquireOnVisible &&
        desiredRef.current &&
        !sentinelRef.current
      ) {
        void request()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [autoReleaseOnHidden, reacquireOnVisible, releaseCurrent, request])

  React.useEffect(() => {
    return () => {
      void releaseCurrent(true)
    }
  }, [releaseCurrent])

  return {
    isSupported,
    isActive,
    error,
    request,
    release,
  }
}
