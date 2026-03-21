import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { usePWAInstall } from "../../registry/hooks/use-pwa-install"

describe("usePWAInstall", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: false,
        media: "",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    )
  })

  afterEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it("captures the install prompt and records accepted installs", async () => {
    const { result } = renderHook(() => usePWAInstall())
    const prompt = vi.fn().mockResolvedValue(undefined)
    const event = new Event("beforeinstallprompt", {
      cancelable: true,
    }) as Event & {
      prompt: () => Promise<void>
      userChoice: Promise<{ outcome: "accepted"; platform: string }>
    }

    event.prompt = prompt
    event.userChoice = Promise.resolve({
      outcome: "accepted",
      platform: "web",
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(result.current.canInstall).toBe(true)

    await act(async () => {
      await expect(result.current.promptInstall()).resolves.toBe("accepted")
    })

    expect(prompt).toHaveBeenCalledTimes(1)
    expect(result.current.isInstalled).toBe(true)
    expect(result.current.promptCount).toBe(1)
  })
})
