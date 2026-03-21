import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useOptimisticQueue } from "../../registry/hooks/use-optimistic-queue"

describe("useOptimisticQueue", () => {
  it("tracks optimistic actions, confirms items, rolls them back, and clears the queue", () => {
    const rollbackSpy = vi.fn()
    const { result } = renderHook(() => useOptimisticQueue<string>())

    let firstId = ""
    let secondId = ""

    act(() => {
      firstId = result.current.enqueue("draft", rollbackSpy)
      secondId = result.current.enqueue("publish")
    })

    expect(firstId).not.toBe(secondId)
    expect(result.current.queue).toEqual(["draft", "publish"])
    expect(result.current.pending).toHaveLength(2)
    expect(result.current.size).toBe(2)

    act(() => {
      result.current.confirm(firstId)
    })

    expect(result.current.queue).toEqual(["publish"])
    expect(result.current.size).toBe(1)

    act(() => {
      result.current.rollback(secondId)
    })

    expect(rollbackSpy).not.toHaveBeenCalled()
    expect(result.current.queue).toEqual([])
    expect(result.current.size).toBe(0)

    act(() => {
      result.current.enqueue("retry", rollbackSpy)
    })

    expect(result.current.queue).toEqual(["retry"])

    act(() => {
      result.current.clear()
    })

    expect(result.current.queue).toEqual([])
    expect(result.current.pending).toEqual([])
  })

  it("runs the rollback callback for the matching queued action", () => {
    const rollbackSpy = vi.fn()
    const { result } = renderHook(() => useOptimisticQueue<string>())

    let id = ""
    act(() => {
      id = result.current.enqueue("delete", rollbackSpy)
    })

    act(() => {
      result.current.rollback(id)
    })

    expect(rollbackSpy).toHaveBeenCalledTimes(1)
    expect(result.current.size).toBe(0)
  })
})
