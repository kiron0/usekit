import * as React from "react"

export interface UseSubmitLockOptions {
  initialLocked?: boolean
  autoUnlockDelay?: number
}

export interface UseSubmitLockReturn {
  locked: boolean
  lock: () => void
  unlock: () => void
  toggle: () => void
}

export function useSubmitLock(
  options: UseSubmitLockOptions = {}
): UseSubmitLockReturn {
  const { initialLocked = false, autoUnlockDelay } = options

  const [locked, setLocked] = React.useState(initialLocked)
  const autoUnlockTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const lock = React.useCallback(() => {
    setLocked(true)

    if (autoUnlockTimeoutRef.current) {
      clearTimeout(autoUnlockTimeoutRef.current)
    }

    if (autoUnlockDelay !== undefined && autoUnlockDelay > 0) {
      autoUnlockTimeoutRef.current = setTimeout(() => {
        setLocked(false)
      }, autoUnlockDelay)
    }
  }, [autoUnlockDelay])

  const unlock = React.useCallback(() => {
    setLocked(false)

    if (autoUnlockTimeoutRef.current) {
      clearTimeout(autoUnlockTimeoutRef.current)
      autoUnlockTimeoutRef.current = null
    }
  }, [])

  const toggle = React.useCallback(() => {
    setLocked((prev) => {
      const newLocked = !prev

      if (autoUnlockTimeoutRef.current) {
        clearTimeout(autoUnlockTimeoutRef.current)
      }

      if (newLocked && autoUnlockDelay !== undefined && autoUnlockDelay > 0) {
        autoUnlockTimeoutRef.current = setTimeout(() => {
          setLocked(false)
        }, autoUnlockDelay)
      }

      return newLocked
    })
  }, [autoUnlockDelay])

  React.useEffect(() => {
    return () => {
      if (autoUnlockTimeoutRef.current) {
        clearTimeout(autoUnlockTimeoutRef.current)
      }
    }
  }, [])

  return {
    locked,
    lock,
    unlock,
    toggle,
  }
}
