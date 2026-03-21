import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import {
  useDebouncedStateValidator,
  useStateValidator,
  useZodStateValidator,
} from "../../registry/hooks/use-state-validator"

describe("useStateValidator", () => {
  async function flushValidation(delay?: number) {
    await act(async () => {
      await Promise.resolve()
      if (delay !== undefined) {
        vi.advanceTimersByTime(delay)
      } else {
        vi.runAllTimers()
      }
      await Promise.resolve()
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("validates updates, supports updater functions, and calls callbacks", async () => {
    const onValid = vi.fn()
    const onInvalid = vi.fn()

    const { result } = renderHook(() =>
      useStateValidator(
        "good",
        (value: string) => value.length >= 4 || "Too short",
        {
          onValid,
          onInvalid,
          asyncDebounceMs: 50,
        }
      )
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current[2]).toMatchObject({
      isValid: true,
      isPending: false,
    })
    onValid.mockClear()

    act(() => {
      result.current[1]("no")
    })

    expect(result.current[0]).toBe("no")
    expect(result.current[2].isPending).toBe(true)

    await flushValidation(50)

    expect(result.current[2]).toMatchObject({
      isValid: false,
      error: "Too short",
      isPending: false,
    })
    expect(onInvalid).toHaveBeenCalledWith("no", "Too short")

    act(() => {
      result.current[1]((previous) => `${previous}pe`)
    })

    await flushValidation(50)

    expect(result.current[2]).toMatchObject({
      isValid: true,
      isPending: false,
    })
    expect(result.current[0]).toBe("nope")
    expect(onValid).toHaveBeenCalledWith("nope")
  })

  it("supports zod schemas through the helper wrapper", async () => {
    const { result } = renderHook(() =>
      useZodStateValidator<string>(z.string().min(3, "Need 3 chars"), {
        initialValue: "valid",
        asyncDebounceMs: 0,
      })
    )

    await act(async () => {
      await Promise.resolve()
    })

    act(() => {
      result.current[1]("no")
    })

    await flushValidation()

    expect(result.current[2]).toMatchObject({
      isValid: false,
      error: "Need 3 chars",
    })
  })

  it("respects the debounce delay in the debounced helper", async () => {
    const { result } = renderHook(() =>
      useDebouncedStateValidator<string>(
        (value) => value === "ready" || "Not ready",
        120,
        { initialValue: "ready" }
      )
    )

    await act(async () => {
      await Promise.resolve()
    })

    act(() => {
      result.current[1]("wait")
    })

    await flushValidation(119)

    expect(result.current[2].isPending).toBe(true)

    await flushValidation(1)

    expect(result.current[2]).toMatchObject({
      isValid: false,
      error: "Not ready",
      isPending: false,
    })
  })
})
