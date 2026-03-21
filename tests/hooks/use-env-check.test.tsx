import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useEnvCheck } from "../../registry/hooks/use-env-check"

describe("useEnvCheck", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("reports browser and node environment flags", () => {
    vi.stubEnv("NODE_ENV", "test")

    const { result } = renderHook(() => useEnvCheck())

    expect(result.current.isBrowser).toBe(true)
    expect(result.current.isServer).toBe(false)
    expect(result.current.isTest).toBe(true)
    expect(result.current.isDev).toBe(false)
    expect(result.current.isProd).toBe(false)
    expect(result.current.isEnv("browser")).toBe(true)
    expect(result.current.isEnv("test")).toBe(true)
  })
})
