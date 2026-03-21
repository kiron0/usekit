import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { useAdaptiveLanguage } from "../../registry/hooks/use-adaptive-language"

describe("useAdaptiveLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "fr-FR",
    })
  })

  it("detects a supported locale, persists it, and reacts to storage events", () => {
    const { result } = renderHook(() =>
      useAdaptiveLanguage({
        supportedLocales: ["en", "fr", "bn"],
      })
    )

    expect(result.current.locale).toBe("fr")
    expect(document.documentElement.lang).toBe("fr")

    act(() => {
      result.current.setLocale("bn")
    })

    expect(result.current.locale).toBe("bn")
    expect(window.localStorage.getItem("usekit:locale")).toBe("bn")
    expect(result.current.isSupported("en")).toBe(true)

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "usekit:locale",
          newValue: "en",
        })
      )
    })

    expect(result.current.locale).toBe("en")
  })
})
