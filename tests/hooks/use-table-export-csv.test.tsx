import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useTableExportCSV } from "../../registry/hooks/use-table-export-csv"

describe("useTableExportCSV", () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => "blob:mock-url")
    URL.revokeObjectURL = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    vi.restoreAllMocks()
  })

  it("creates a download link for csv export", () => {
    const originalCreateElement = document.createElement.bind(document)
    let createdLink: HTMLAnchorElement | null = null

    vi.spyOn(document, "createElement").mockImplementation(
      (tagName: string) => {
        const element = originalCreateElement(tagName)
        if (tagName === "a") {
          createdLink = element as HTMLAnchorElement
        }
        return element
      }
    )

    const { result } = renderHook(() => useTableExportCSV<{ name: string }>())

    act(() => {
      result.current.exportCSV(
        [{ name: "Ada" }],
        [{ key: "name", header: "Name" }],
        "users"
      )
    })

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(createdLink?.getAttribute("href")).toBe("blob:mock-url")
    expect(createdLink?.getAttribute("download")).toBe("users.csv")
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url")
  })
})
