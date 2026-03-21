import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useDarkModeSchedule } from "../../registry/hooks/use-dark-mode-schedule"

describe("useDarkModeSchedule", () => {
  const RealDate = Date
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    class MockDate extends Date {
      constructor(...args: ConstructorParameters<typeof Date>) {
        if (args.length === 0) {
          super("2026-03-21T19:30:00.000Z")
        } else {
          super(...args)
        }
      }

      static now() {
        return new RealDate("2026-03-21T19:30:00.000Z").getTime()
      }
    }

    // @ts-expect-error overriding Date in test
    globalThis.Date = MockDate
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as typeof window.matchMedia
    document.documentElement.className = ""
    document.documentElement.style.transition = ""
  })

  afterEach(() => {
    globalThis.Date = RealDate
    window.matchMedia = originalMatchMedia
    document.documentElement.className = ""
    document.documentElement.style.transition = ""
  })

  it("applies scheduled dark mode and supports manual override plus reset", () => {
    const setTheme = vi.fn()
    const { result } = renderHook(() =>
      useDarkModeSchedule({
        darkStartTime: "18:00",
        darkEndTime: "06:00",
        setTheme,
      })
    )

    expect(result.current.isScheduleActive).toBe(true)
    expect(result.current.currentTheme).toBe("dark")
    expect(result.current.isDarkMode).toBe(true)

    act(() => {
      result.current.setTheme("light")
    })

    expect(result.current.currentTheme).toBe("light")
    expect(setTheme).toHaveBeenCalledWith("light")

    act(() => {
      result.current.reset()
    })

    expect(result.current.currentTheme).toBe("dark")
  })
})
