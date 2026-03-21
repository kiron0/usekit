import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useBluetooth } from "../../registry/hooks/use-bluetooth"

describe("useBluetooth", () => {
  it("requests a device, connects to gatt, and resets on disconnect", async () => {
    const connect = vi.fn().mockResolvedValue({ connected: true })
    const disconnect = vi.fn()
    let disconnectedHandler: (() => void) | undefined
    const device = {
      gatt: {
        connect,
        disconnect,
      },
      addEventListener: vi.fn(
        (_event: string, handler: () => void) => (disconnectedHandler = handler)
      ),
      removeEventListener: vi.fn(),
    } as unknown as BluetoothDevice

    const mockNavigator = {
      bluetooth: {
        requestDevice: vi.fn().mockResolvedValue(device),
      },
    } as Navigator

    const { result } = renderHook(() =>
      useBluetooth({
        navigator: mockNavigator,
        acceptAllDevices: true,
      })
    )

    await act(async () => {
      await result.current.requestDevice()
    })

    await waitFor(() => expect(result.current.isConnected).toBe(true))
    expect(result.current.device).toBe(device)
    expect(result.current.server).toEqual({ connected: true })

    act(() => {
      disconnectedHandler?.()
    })

    expect(result.current.isConnected).toBe(false)
    expect(result.current.device).toBeUndefined()
    expect(result.current.server).toBeUndefined()
  })
})
