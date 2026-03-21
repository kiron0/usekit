import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useCookieStorage } from "../../registry/hooks/use-cookie-storage"

describe("useCookieStorage", () => {
  beforeEach(() => {
    document.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0]?.trim())
      .filter(Boolean)
      .forEach((name) => {
        document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/`
      })
  })

  it("reads, updates, and removes cookie-backed state", () => {
    const { result } = renderHook(() =>
      useCookieStorage("draft", "hello", { path: "/" })
    )

    expect(result.current[0]).toBe("hello")

    act(() => {
      result.current[1]((prev) => `${prev} world`)
    })

    expect(result.current[0]).toBe("hello world")
    expect(document.cookie).toContain("draft=")

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe("hello")
  })

  it("applies back-to-back functional updates against the latest state", () => {
    const { result } = renderHook(() =>
      useCookieStorage("counter", "a", { path: "/" })
    )

    act(() => {
      result.current[1]((prev) => `${prev}b`)
      result.current[1]((prev) => `${prev}c`)
    })

    expect(result.current[0]).toBe("abc")
  })
})
