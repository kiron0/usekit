import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useForm } from "../../registry/hooks/use-form"

describe("useForm", () => {
  it("tracks field changes, validation, and successful submission", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const validate = vi.fn((values: { email: string }) => {
      return values.email.includes("@") ? {} : { email: "Invalid email" }
    })

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: "" },
        validate,
        onSubmit,
      })
    )

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.values.email).toBe("test@example.com")
    expect(result.current.touched.email).toBe(true)

    act(() => {
      result.current.handleBlur({
        target: { name: "email", value: "test@example.com" },
      } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.errors).toEqual({})

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    expect(validate).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith({ email: "test@example.com" })
    expect(result.current.isSubmitting).toBe(false)
  })

  it("does not submit while validation errors are present", async () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: "" },
        validate: (values) =>
          values.email ? {} : { email: "Email is required" },
        onSubmit,
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    expect(result.current.errors.email).toBe("Email is required")
    expect(result.current.touched.email).toBe(true)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
