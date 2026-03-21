import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useSessionStorage } from "../../registry/hooks/use-session-storage"

describe("useSessionStorage", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it("reads from sessionStorage, writes updates, and handles storage events", () => {
    window.sessionStorage.setItem("draft", JSON.stringify("hello"))

    const { result } = renderHook(() => useSessionStorage("draft", "empty"))

    expect(result.current[0]).toBe("hello")

    act(() => {
      result.current[1]((prev) => `${prev} world`)
    })
    expect(result.current[0]).toBe("hello world")
    expect(window.sessionStorage.getItem("draft")).toBe(
      JSON.stringify("hello world")
    )

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "draft",
          newValue: JSON.stringify("shared"),
          storageArea: window.sessionStorage,
        })
      )
    })

    expect(result.current[0]).toBe("shared")
  })

  it("applies back-to-back functional updates against the latest state", () => {
    const { result } = renderHook(() => useSessionStorage("draft", "a"))

    act(() => {
      result.current[1]((prev) => `${prev}b`)
      result.current[1]((prev) => `${prev}c`)
    })

    expect(result.current[0]).toBe("abc")
    expect(window.sessionStorage.getItem("draft")).toBe(JSON.stringify("abc"))
  })
})
