import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useDocumentTitle } from "../../registry/hooks/use-document-title"

describe("useDocumentTitle", () => {
  it("sets the document title and restores the previous title on unmount", () => {
    document.title = "Original Title"

    const { unmount } = renderHook(() => useDocumentTitle("Updated Title"))

    expect(document.title).toBe("Updated Title")

    unmount()
    expect(document.title).toBe("Original Title")
  })
})
