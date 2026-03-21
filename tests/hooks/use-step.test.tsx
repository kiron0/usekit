import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useStep } from "../../registry/hooks/use-step"

describe("useStep", () => {
  it("moves across valid steps and resets to the beginning", () => {
    const { result } = renderHook(() => useStep(3))

    expect(result.current[0]).toBe(1)
    expect(result.current[1].canGoToPrevStep).toBe(false)

    act(() => result.current[1].goToNextStep())
    expect(result.current[0]).toBe(2)

    act(() => result.current[1].goToNextStep())
    expect(result.current[0]).toBe(3)
    expect(result.current[1].canGoToNextStep).toBe(false)

    act(() => result.current[1].goToPrevStep())
    expect(result.current[0]).toBe(2)

    act(() => result.current[1].reset())
    expect(result.current[0]).toBe(1)
  })

  it("throws when setting an invalid step", () => {
    const { result } = renderHook(() => useStep(2))

    expect(() => {
      act(() => result.current[1].setStep(3))
    }).toThrow("Step not valid")
  })
})
