import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useEncryption } from "../../registry/hooks/use-encryption"

describe("useEncryption", () => {
  it("encrypts and decrypts values with the same secret", () => {
    const { result } = renderHook(() => useEncryption())

    const encrypted = result.current.encrypt({ token: "abc" }, "secret")

    expect(typeof encrypted).toBe("string")
    expect(encrypted).not.toBe(JSON.stringify({ token: "abc" }))
    expect(
      result.current.decrypt<{ token: string }>(encrypted as string, "secret")
    ).toEqual({ token: "abc" })
  })

  it("returns false when decryption fails", () => {
    const { result } = renderHook(() => useEncryption())

    expect(result.current.decrypt("not-valid", "secret")).toBe(false)
  })
})
