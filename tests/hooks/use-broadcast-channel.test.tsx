import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useBroadcastChannel } from "../../registry/hooks/use-broadcast-channel"

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = []

  name: string
  onmessage: ((event: MessageEvent) => void) | null = null
  onmessageerror: ((event: Event) => void) | null = null
  closed = false
  postMessage = vi.fn((data: unknown) => {
    for (const channel of MockBroadcastChannel.instances) {
      if (channel !== this && channel.name === this.name && !channel.closed) {
        channel.onmessage?.({ data } as MessageEvent)
      }
    }
  })
  close = vi.fn(() => {
    this.closed = true
  })

  constructor(name: string) {
    this.name = name
    MockBroadcastChannel.instances.push(this)
  }

  emitMessage(data: unknown) {
    this.onmessage?.({ data } as MessageEvent)
  }

  emitError() {
    this.onmessageerror?.(new Event("messageerror"))
  }

  static reset() {
    MockBroadcastChannel.instances = []
  }
}

describe("useBroadcastChannel", () => {
  const originalBroadcastChannel = globalThis.BroadcastChannel

  afterEach(() => {
    MockBroadcastChannel.reset()

    if (originalBroadcastChannel) {
      globalThis.BroadcastChannel = originalBroadcastChannel
    } else {
      delete (globalThis as typeof globalThis & { BroadcastChannel?: unknown })
        .BroadcastChannel
    }
  })

  it("posts and receives messages on the same channel name", async () => {
    const onMessage = vi.fn()

    globalThis.BroadcastChannel =
      MockBroadcastChannel as unknown as typeof BroadcastChannel

    const { result: sender } = renderHook(() =>
      useBroadcastChannel<string>("usekit-room")
    )
    const { result: receiver, unmount } = renderHook(() =>
      useBroadcastChannel<string>("usekit-room", { onMessage })
    )

    act(() => {
      sender.current.postMessage("hello")
    })

    await waitFor(() => expect(receiver.current.lastMessage).toBe("hello"))
    expect(onMessage).toHaveBeenCalledWith("hello")
    expect(sender.current.isSupported).toBe(true)
    expect(receiver.current.isClosed).toBe(false)

    act(() => {
      receiver.current.close()
    })

    expect(receiver.current.isClosed).toBe(true)

    unmount()
  })

  it("surfaces message errors and cleans up on unmount", async () => {
    const onMessageError = vi.fn()

    globalThis.BroadcastChannel =
      MockBroadcastChannel as unknown as typeof BroadcastChannel

    const { result, unmount } = renderHook(() =>
      useBroadcastChannel<string>("errors", { onMessageError })
    )

    const channel = MockBroadcastChannel.instances[0]

    act(() => {
      channel.emitError()
    })

    await waitFor(() =>
      expect(result.current.error?.message).toBe(
        "Failed to receive broadcast message."
      )
    )
    expect(onMessageError).toHaveBeenCalledTimes(1)

    unmount()

    expect(channel.close).toHaveBeenCalled()
  })

  it("reports unsupported browsers", () => {
    delete (globalThis as typeof globalThis & { BroadcastChannel?: unknown })
      .BroadcastChannel

    const { result } = renderHook(() =>
      useBroadcastChannel<string>("missing-api")
    )

    expect(result.current.isSupported).toBe(false)
    expect(result.current.isClosed).toBe(true)

    act(() => {
      result.current.postMessage("test")
    })

    expect(result.current.error?.message).toBe(
      "BroadcastChannel is not supported in this browser."
    )
  })
})
