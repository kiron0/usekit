import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useFormDisable } from "../../registry/hooks/use-form-disable"

describe("useFormDisable", () => {
  it("derives disabled state from form state when no explicit flag is provided", () => {
    const { result, rerender } = renderHook(
      ({ formState }) => useFormDisable({ formState }),
      {
        initialProps: {
          formState: { isSubmitting: false, isValidating: false },
        },
      }
    )

    expect(result.current.disabled).toBe(false)

    rerender({
      formState: { isSubmitting: false, isValidating: true },
    })

    expect(result.current.disabled).toBe(true)
  })

  it("prefers the explicit isSubmitting option over form state", () => {
    const { result } = renderHook(() =>
      useFormDisable({
        isSubmitting: false,
        formState: { isSubmitting: true, isValidating: true },
      })
    )

    expect(result.current.disabled).toBe(false)
  })
})
