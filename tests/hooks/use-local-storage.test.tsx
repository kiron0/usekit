import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useLocalStorage } from "../../registry/hooks/use-local-storage"

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("reads from localStorage, updates state, and reacts to storage events", () => {
    window.localStorage.setItem("theme", JSON.stringify("dark"))

    const { result } = renderHook(() => useLocalStorage("theme", "light"))

    expect(result.current[0]).toBe("dark")

    act(() => {
      result.current[1]("solarized")
    })
    expect(result.current[0]).toBe("solarized")
    expect(window.localStorage.getItem("theme")).toBe(
      JSON.stringify("solarized")
    )

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "theme",
          newValue: JSON.stringify("contrast"),
          storageArea: window.localStorage,
        })
      )
    })

    expect(result.current[0]).toBe("contrast")
  })
})
