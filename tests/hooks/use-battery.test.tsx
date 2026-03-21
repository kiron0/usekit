import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { useBattery } from "../../registry/hooks/use-battery"

describe("useBattery", () => {
  const originalGetBattery = (
    navigator as Navigator & {
      getBattery?: () => Promise<unknown>
    }
  ).getBattery

  afterEach(() => {
    Object.defineProperty(navigator, "getBattery", {
      configurable: true,
      value: originalGetBattery,
    })
  })

  it("loads battery information and reacts to battery change handlers", async () => {
    const battery = {
      level: 0.42,
      charging: false,
      chargingTime: 0,
      dischargingTime: 1800,
      onlevelchange: null as null | (() => void),
      onchargingchange: null as null | (() => void),
      onchargingtimechange: null as null | (() => void),
      ondischargingtimechange: null as null | (() => void),
    }

    Object.defineProperty(navigator, "getBattery", {
      configurable: true,
      value: () => Promise.resolve(battery),
    })

    const { result } = renderHook(() => useBattery())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current).toMatchObject({
      supported: true,
      level: 42,
      charging: false,
      dischargingTime: 1800,
    })

    battery.level = 0.84
    battery.charging = true
    battery.onlevelchange?.()

    await waitFor(() => expect(result.current.level).toBe(84))
    expect(result.current.charging).toBe(true)
  })

  it("marks the api unsupported when getBattery is unavailable", async () => {
    Object.defineProperty(navigator, "getBattery", {
      configurable: true,
      value: undefined,
    })

    const { result } = renderHook(() => useBattery())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.supported).toBe(false)
  })
})
