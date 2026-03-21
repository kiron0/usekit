import * as React from "react"

type PermissionStateValue = "granted" | "denied" | "prompt"

interface PermissionStatusLike {
  state: PermissionStateValue
  onchange: (() => void) | null
  addEventListener?: (type: "change", listener: () => void) => void
  removeEventListener?: (type: "change", listener: () => void) => void
}

interface PermissionsLike {
  query: (descriptor: { name: string }) => Promise<PermissionStatusLike>
}

export interface UsePermissionResult {
  isSupported: boolean
  state: PermissionStateValue | null
  error: Error | null
  refresh: () => Promise<PermissionStateValue | null>
}

function getPermissionsApi() {
  if (typeof navigator === "undefined") return null

  const permissions = (
    navigator as Navigator & { permissions?: PermissionsLike }
  ).permissions

  if (!permissions || typeof permissions.query !== "function") {
    return null
  }

  return permissions
}

function toError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback)
}

export function usePermission(name: string): UsePermissionResult {
  const [state, setState] = React.useState<PermissionStateValue | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const statusRef = React.useRef<PermissionStatusLike | null>(null)
  const isSupported = React.useMemo(() => getPermissionsApi() !== null, [])

  const detachStatus = React.useCallback(() => {
    const status = statusRef.current

    if (!status) return

    status.onchange = null
    statusRef.current = null
  }, [])

  const refresh = React.useCallback(async () => {
    const permissions = getPermissionsApi()

    if (!permissions) {
      setError(new Error("Permissions API is not supported in this browser."))
      setState(null)
      return null
    }

    setError(null)
    detachStatus()

    try {
      const status = await permissions.query({ name })

      const handleChange = () => {
        setState(status.state)
      }

      statusRef.current = status
      setState(status.state)

      if (
        typeof status.addEventListener === "function" &&
        typeof status.removeEventListener === "function"
      ) {
        status.addEventListener("change", handleChange)
        status.onchange = () => {
          setState(status.state)
        }
      } else {
        status.onchange = handleChange
      }

      return status.state
    } catch (error) {
      const nextError = toError(error, "Failed to query permission status.")
      setError(nextError)
      setState(null)
      return null
    }
  }, [detachStatus, name])

  React.useEffect(() => {
    if (!isSupported) return

    void refresh()

    return () => {
      detachStatus()
    }
  }, [detachStatus, isSupported, refresh])

  return {
    isSupported,
    state,
    error,
    refresh,
  }
}
