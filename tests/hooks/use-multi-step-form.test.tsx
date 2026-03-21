import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useMultiStepForm } from "../../registry/hooks/use-multi-step-form"

describe("useMultiStepForm", () => {
  it("moves between steps and reports progress", () => {
    const onStepChange = vi.fn()
    const { result } = renderHook(() =>
      useMultiStepForm({
        totalSteps: 4,
        onStepChange,
      })
    )

    act(() => {
      result.current.next()
    })

    expect(result.current.currentStep).toBe(1)
    expect(result.current.progress).toBe(0.5)

    act(() => {
      result.current.goTo(3)
    })

    expect(result.current.isLastStep).toBe(true)
    expect(result.current.canGoNext).toBe(false)
    expect(onStepChange).toHaveBeenLastCalledWith(3)
  })

  it("loops when configured", () => {
    const { result } = renderHook(() =>
      useMultiStepForm({
        totalSteps: 3,
        initialStep: 2,
        allowLooping: true,
      })
    )

    act(() => {
      result.current.next()
    })

    expect(result.current.currentStep).toBe(0)

    act(() => {
      result.current.previous()
    })

    expect(result.current.currentStep).toBe(2)
  })
})
