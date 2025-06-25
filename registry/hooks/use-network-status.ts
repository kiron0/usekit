import * as React from "react"

interface NetworkStatus {
  online: boolean
  effectiveType?: string
  downlink?: number
}

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: string
  readonly downlink?: number
  addEventListener(type: "change", listener: () => void): void
  removeEventListener(type: "change", listener: () => void): void
}

export function useNetworkStatus(): NetworkStatus {
  const getConnection = (): NetworkInformation | undefined => {
    return typeof navigator !== "undefined"
      ? ((navigator as any).connection ??
          (navigator as any).mozConnection ??
          (navigator as any).webkitConnection)
      : undefined
  }

  const getStatus = React.useCallback((): NetworkStatus => {
    const connection = getConnection()
    return {
      online: typeof navigator !== "undefined" ? navigator.onLine : true,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
    }
  }, [])

  const [status, setStatus] = React.useState<NetworkStatus>(getStatus)

  const updateStatus = React.useCallback(() => {
    setStatus(getStatus())
  }, [getStatus])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const connection = getConnection()

    updateStatus()
    window.addEventListener("online", updateStatus)
    window.addEventListener("offline", updateStatus)
    connection?.addEventListener("change", updateStatus)

    return () => {
      window.removeEventListener("online", updateStatus)
      window.removeEventListener("offline", updateStatus)
      connection?.removeEventListener("change", updateStatus)
    }
  }, [updateStatus])

  return status
}
