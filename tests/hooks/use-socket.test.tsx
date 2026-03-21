import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

const { handlers, socketInstance, ioMock } = vi.hoisted(() => {
  const handlers: Record<string, ((...args: any[]) => void) | undefined> = {}
  const socketInstance = {
    id: "socket-1",
    on: vi.fn((event: string, callback: (...args: any[]) => void) => {
      handlers[event] = callback
      return socketInstance
    }),
    off: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  }

  return {
    handlers,
    socketInstance,
    ioMock: vi.fn(() => socketInstance),
  }
})

vi.mock("socket.io-client", () => ({
  io: ioMock,
}))

import { useSocket } from "../../registry/hooks/use-socket"

describe("useSocket", () => {
  afterEach(() => {
    Object.keys(handlers).forEach((key) => delete handlers[key])
    vi.clearAllMocks()
  })

  it("creates a socket client and mirrors connection events", () => {
    const { result, unmount } = renderHook(() =>
      useSocket("https://example.com", { autoConnect: false })
    )

    expect(ioMock).toHaveBeenCalledWith(
      "https://example.com",
      expect.objectContaining({ autoConnect: false })
    )

    act(() => {
      handlers.connect?.()
    })

    expect(result.current.isConnected).toBe(true)

    act(() => {
      result.current.connect()
      result.current.disconnect()
      handlers.disconnect?.("manual")
    })

    expect(socketInstance.connect).toHaveBeenCalledTimes(1)
    expect(socketInstance.disconnect).toHaveBeenCalled()
    expect(result.current.isConnected).toBe(false)

    unmount()
    expect(socketInstance.off).toHaveBeenCalledWith("connect")
  })
})
