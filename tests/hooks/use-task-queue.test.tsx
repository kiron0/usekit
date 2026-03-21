import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useTaskQueue } from "../../registry/hooks/use-task-queue"

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

async function flushQueue() {
  await Promise.resolve()
  await Promise.resolve()
  await vi.runAllTimersAsync()
  await Promise.resolve()
}

describe("useTaskQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("processes queued tasks by priority once capacity frees up", async () => {
    const runOrder: string[] = []
    const first = createDeferred<string>()
    const second = createDeferred<string>()
    const third = createDeferred<string>()

    const { result } = renderHook(() => useTaskQueue({ concurrency: 1 }))

    let firstPromise!: Promise<string>
    let secondPromise!: Promise<string>
    let thirdPromise!: Promise<string>

    act(() => {
      firstPromise = result.current.enqueue(() => {
        runOrder.push("first")
        return first.promise
      })
      secondPromise = result.current.enqueue(
        () => {
          runOrder.push("second")
          return second.promise
        },
        { priority: 1 }
      )
      thirdPromise = result.current.enqueue(
        () => {
          runOrder.push("third")
          return third.promise
        },
        { priority: 10 }
      )
    })

    await act(async () => {
      await flushQueue()
    })

    expect(runOrder).toEqual(["first"])

    first.resolve("one")
    await act(async () => {
      await flushQueue()
    })

    expect(runOrder).toEqual(["first", "third"])

    third.resolve("three")
    await act(async () => {
      await flushQueue()
    })

    expect(runOrder).toEqual(["first", "third", "second"])

    second.resolve("two")
    await act(async () => {
      await flushQueue()
    })

    await expect(firstPromise).resolves.toBe("one")
    await expect(secondPromise).resolves.toBe("two")
    await expect(thirdPromise).resolves.toBe("three")
  })

  it("rejects queued tasks when cancelAll is called", async () => {
    const first = createDeferred<string>()
    const second = createDeferred<string>()

    const { result } = renderHook(() => useTaskQueue({ concurrency: 1 }))

    let firstPromise!: Promise<string>
    let secondPromise!: Promise<string>

    act(() => {
      firstPromise = result.current.enqueue(() => first.promise)
      secondPromise = result.current.enqueue(() => second.promise)
    })

    await act(async () => {
      await flushQueue()
    })

    act(() => {
      result.current.cancelAll()
    })

    await expect(secondPromise).rejects.toThrow("Task queue cancelled")

    first.resolve("done")
    await act(async () => {
      await flushQueue()
    })

    await expect(firstPromise).resolves.toBe("done")
  })
})
