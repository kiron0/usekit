import * as React from "react"

type LockMode = "exclusive" | "shared"

interface LockLike {
  name: string
  mode: LockMode
}

interface LockRequestOptionsLike {
  mode?: LockMode
  ifAvailable?: boolean
  steal?: boolean
}

interface LockManagerLike {
  request: (
    name: string,
    options: LockRequestOptionsLike,
    callback: (lock: LockLike | null) => Promise<void> | void
  ) => Promise<void>
}

export interface UseWebLockOptions {
  mode?: LockMode
  ifAvailable?: boolean
  steal?: boolean
  onAcquire?: (lock: LockLike) => void
  onRelease?: () => void
}

export interface UseWebLockResult {
  isSupported: boolean
  isLocked: boolean
  error: Error | null
  acquire: () => Promise<boolean>
  release: () => void
}

function getLockManager() {
  if (typeof navigator === "undefined") return null

  const locks = (navigator as Navigator & { locks?: LockManagerLike }).locks

  if (!locks || typeof locks.request !== "function") {
    return null
  }

  return locks
}

function toError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback)
}

export function useWebLock(
  name: string,
  options: UseWebLockOptions = {}
): UseWebLockResult {
  const {
    mode = "exclusive",
    ifAvailable = false,
    steal = false,
    onAcquire,
    onRelease,
  } = options

  const [isLocked, setIsLocked] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const releaseRef = React.useRef<(() => void) | null>(null)
  const pendingRef = React.useRef(false)
  const optionsRef = React.useRef({ onAcquire, onRelease })
  const isSupported = React.useMemo(() => getLockManager() !== null, [])

  React.useEffect(() => {
    optionsRef.current = { onAcquire, onRelease }
  }, [onAcquire, onRelease])

  const release = React.useCallback(() => {
    releaseRef.current?.()
  }, [])

  const acquire = React.useCallback(async () => {
    if (releaseRef.current || pendingRef.current) {
      return true
    }

    setError(null)

    const lockManager = getLockManager()

    if (!lockManager) {
      setError(new Error("Web Locks API is not supported in this browser."))
      return false
    }

    pendingRef.current = true

    return await new Promise<boolean>((resolve) => {
      let settled = false

      const finish = (value: boolean) => {
        if (settled) return
        settled = true
        resolve(value)
      }

      void lockManager
        .request(name, { mode, ifAvailable, steal }, async (lock) => {
          pendingRef.current = false

          if (!lock) {
            finish(false)
            return
          }

          setIsLocked(true)
          optionsRef.current.onAcquire?.(lock)
          finish(true)

          await new Promise<void>((unlock) => {
            releaseRef.current = unlock
          })

          releaseRef.current = null
          setIsLocked(false)
          optionsRef.current.onRelease?.()
        })
        .catch((error) => {
          pendingRef.current = false
          releaseRef.current = null
          setIsLocked(false)
          setError(toError(error, "Failed to acquire web lock."))
          finish(false)
        })
    })
  }, [ifAvailable, mode, name, steal])

  React.useEffect(() => {
    return () => {
      releaseRef.current?.()
    }
  }, [])

  return {
    isSupported,
    isLocked,
    error,
    acquire,
    release,
  }
}
