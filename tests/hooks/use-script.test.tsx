import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { useScript } from "../../registry/hooks/use-script"

describe("useScript", () => {
  afterEach(() => {
    document
      .querySelectorAll('script[src^="https://example.com/"]')
      .forEach((node) => {
        node.remove()
      })
  })

  it("creates a script tag, tracks load state, and applies custom attributes", async () => {
    const { result } = renderHook(() =>
      useScript("https://example.com/sdk.js", {
        customAttributes: {
          "data-test": "sdk",
          crossorigin: "anonymous",
        },
      })
    )

    const script = document.querySelector(
      'script[src="https://example.com/sdk.js"]'
    ) as HTMLScriptElement

    expect(result.current).toBe("loading")
    expect(script).toBeTruthy()
    expect(script.getAttribute("data-test")).toBe("sdk")
    expect(script.getAttribute("crossorigin")).toBe("anonymous")

    act(() => {
      script.dispatchEvent(new Event("load"))
    })

    await waitFor(() => expect(result.current).toBe("ready"))
    expect(script.getAttribute("data-status")).toBe("ready")
  })

  it("removes the injected script on unmount when configured", () => {
    const { unmount } = renderHook(() =>
      useScript("https://example.com/remove-me.js", {
        removeOnUnmount: true,
      })
    )

    expect(
      document.querySelector('script[src="https://example.com/remove-me.js"]')
    ).toBeTruthy()

    unmount()

    expect(
      document.querySelector('script[src="https://example.com/remove-me.js"]')
    ).toBeNull()
  })
})
