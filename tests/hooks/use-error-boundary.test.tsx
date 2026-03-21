import * as React from "react"
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useErrorBoundary } from "../../registry/hooks/use-error-boundary"

function Thrower() {
  throw new Error("Boom")
}

describe("useErrorBoundary", () => {
  it("captures render errors and exposes reset", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useErrorBoundary())
    const Boundary = result.current.ErrorBoundary

    render(
      React.createElement(
        Boundary,
        {
          fallback: React.createElement("div", null, "fallback"),
        },
        React.createElement(Thrower)
      )
    )

    expect(screen.getByText("fallback")).toBeTruthy()
    await waitFor(() => expect(result.current.hasError).toBe(true))
    expect(result.current.error?.message).toBe("Boom")

    act(() => {
      result.current.resetError()
    })

    expect(result.current.hasError).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
