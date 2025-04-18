"use client"

import { Button } from "@/components/ui/button"
import { useBluetooth } from "registry/hooks/use-bluetooth"

export default function UseBluetoothDemo() {
  const { isSupported, isConnected, device, requestDevice, error } =
    useBluetooth({
      acceptAllDevices: true,
      optionalServices: ["battery_service"],
    })

  if (!isSupported) {
    return <div>Bluetooth is not supported</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <Button type="button" onClick={requestDevice}>
        Connect to Bluetooth Device
      </Button>
      {isConnected && <div>Connected to: {device?.name}</div>}
      {(error as Error) && (
        <div>
          <p>Error:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
