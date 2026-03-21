import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useFavicon } from "../../registry/hooks/use-favicon"

describe("useFavicon", () => {
  const OriginalImage = globalThis.Image

  beforeEach(() => {
    document.head.innerHTML = ""

    globalThis.Image = class MockImage {
      private listeners = new Map<string, EventListener>()
      private currentSrc = ""

      set src(value: string) {
        this.currentSrc = value
      }

      get src() {
        return this.currentSrc
      }

      addEventListener(type: string, listener: EventListener) {
        this.listeners.set(type, listener)
        if (type === "load" && this.currentSrc) {
          queueMicrotask(() => listener(new Event("load")))
        }
      }

      removeEventListener(type: string) {
        this.listeners.delete(type)
      }
    } as unknown as typeof Image
  })

  afterEach(() => {
    globalThis.Image = OriginalImage
  })

  it("updates the existing favicon and restores it on unmount", async () => {
    const icon = document.createElement("link")
    icon.rel = "icon"
    icon.href = "https://example.com/original.ico"
    document.head.appendChild(icon)

    const { unmount } = renderHook(() =>
      useFavicon("https://example.com/updated.png")
    )

    await waitFor(() => {
      expect(
        document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.href
      ).toBe("https://example.com/updated.png")
    })

    unmount()

    expect(
      document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.href
    ).toBe("https://example.com/original.ico")
  })
})
