import * as React from "react"

interface Props {
  filters?: BluetoothLEScanFilter[]
  optionalServices?: BluetoothServiceUUID[]
  acceptAllDevices?: boolean
  navigator?: Navigator
}

interface Returns {
  isSupported: boolean
  isConnected: boolean
  device: BluetoothDevice | undefined
  requestDevice: () => Promise<void>
  server: BluetoothRemoteGATTServer | undefined
  error: Error | null
}

export function useBluetooth({
  acceptAllDevices = false,
  filters,
  optionalServices,
  navigator = typeof window !== "undefined" ? window.navigator : undefined,
}: Props = {}): Returns {
  const [device, setDevice] = React.useState<BluetoothDevice>()
  const [server, setServer] = React.useState<BluetoothRemoteGATTServer>()
  const [isConnected, setIsConnected] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const isSupported = !!navigator?.bluetooth

  const reset = React.useCallback(() => {
    setIsConnected(false)
    setDevice(undefined)
    setServer(undefined)
  }, [])

  const connect = React.useCallback(async () => {
    if (!device?.gatt) return
    try {
      const newServer = await device.gatt.connect()
      setServer(newServer)
      setIsConnected(newServer.connected)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Connection failed"))
    }
  }, [device])

  const requestDevice = React.useCallback(async () => {
    if (!isSupported) return
    try {
      const newDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: filters?.length ? false : acceptAllDevices,
        filters,
        optionalServices,
      })
      setDevice(newDevice)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Device request failed"))
    }
  }, [isSupported, acceptAllDevices, filters, optionalServices, navigator])

  React.useEffect(() => {
    if (!device) return
    connect()
    const handleDisconnect = () => reset()
    device.addEventListener("gattserverdisconnected", handleDisconnect)
    return () => {
      device.removeEventListener("gattserverdisconnected", handleDisconnect)
      device.gatt?.disconnect()
    }
  }, [device, connect, reset])

  return {
    isSupported,
    isConnected,
    device,
    requestDevice,
    server,
    error,
  }
}
