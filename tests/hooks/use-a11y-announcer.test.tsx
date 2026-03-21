import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useA11yAnnouncer } from "../../registry/hooks/use-a11y-announcer"

describe("useA11yAnnouncer", () => {
  it("creates live regions, announces text, and cleans up on unmount", () => {
    const { result, unmount } = renderHook(() => useA11yAnnouncer())

    const polite = document.querySelector('[aria-live="polite"]')
    const assertive = document.querySelector('[aria-live="assertive"]')

    expect(polite).not.toBeNull()
    expect(assertive).not.toBeNull()

    act(() => {
      result.current.announce("Saved successfully")
      result.current.announce("Something went wrong", "assertive")
    })

    expect(polite?.textContent).toBe("Saved successfully")
    expect(assertive?.textContent).toBe("Something went wrong")

    unmount()

    expect(document.querySelector('[aria-live="polite"]')).toBeNull()
    expect(document.querySelector('[aria-live="assertive"]')).toBeNull()
  })
})
