import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useCsvImport } from "../../registry/hooks/use-csv-import"

describe("useCsvImport", () => {
  it("parses csv headers and rows", async () => {
    const file = new File(["name,age\nAda,30\nLinus,55"], "users.csv", {
      type: "text/csv",
    })

    const { result } = renderHook(() =>
      useCsvImport<{ name: string; age: string }>(file)
    )

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.headers).toEqual(["name", "age"])
    expect(result.current.rows).toEqual([
      { name: "Ada", age: "30" },
      { name: "Linus", age: "55" },
    ])
    expect(result.current.errors.size).toBe(0)
  })

  it("records row errors when column counts mismatch", async () => {
    const file = new File(["name,age\nAda"], "broken.csv", {
      type: "text/csv",
    })

    const { result } = renderHook(() => useCsvImport(file))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.errors.get(2)).toContain("Column count mismatch")
  })
})
