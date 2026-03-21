import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useDevFlag } from "../../registry/hooks/use-dev-flag"

describe("useDevFlag", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("reflects whether the environment is development", () => {
    vi.stubEnv("NODE_ENV", "development")
    const development = renderHook(() => useDevFlag())
    expect(development.result.current).toBe(true)

    vi.stubEnv("NODE_ENV", "production")
    const production = renderHook(() => useDevFlag())
    expect(production.result.current).toBe(false)
  })
})
