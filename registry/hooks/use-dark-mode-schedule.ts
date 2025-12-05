import * as React from "react"

export interface UseDarkModeScheduleOptions {
  darkStartTime?: string
  darkEndTime?: string
  fallbackToSystem?: boolean
  smoothTransition?: boolean
  setTheme?: (theme: "light" | "dark" | "system") => void
  checkInterval?: number
}

export interface UseDarkModeScheduleReturn {
  currentTheme: "light" | "dark" | "system"
  isDarkMode: boolean
  isScheduleActive: boolean
  timeUntilSwitch: number | null
  setTheme: (theme: "light" | "dark" | "system") => void
  reset: () => void
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

function getCurrentTimeInMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function isTimeInRange(current: number, start: number, end: number): boolean {
  if (start < end) {
    return current >= start && current < end
  }
  return current >= start || current < end
}

function getTimeUntilNextSwitch(
  current: number,
  start: number,
  end: number
): number {
  const isDark = isTimeInRange(current, start, end)

  if (isDark && start > end) {
    const untilEnd = end + 24 * 60 - current
    return untilEnd * 60 * 1000
  }

  if (!isDark && start < end) {
    const untilStart = start - current
    return untilStart * 60 * 1000
  }

  if (!isDark && start > end) {
    const untilStart = start - current
    return untilStart * 60 * 1000
  }

  const untilEnd = end - current
  return untilEnd * 60 * 1000
}

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function useDarkModeSchedule(
  options: UseDarkModeScheduleOptions = {}
): UseDarkModeScheduleReturn {
  const {
    darkStartTime = "18:00",
    darkEndTime = "06:00",
    fallbackToSystem = true,
    smoothTransition = false,
    setTheme: customSetTheme,
    checkInterval = 60000,
  } = options

  const [manualOverride, setManualOverride] = React.useState<
    "light" | "dark" | "system" | null
  >(null)
  const [systemPref, setSystemPref] = React.useState<"light" | "dark">(
    getSystemPreference
  )

  const darkStartMinutes = React.useMemo(
    () => parseTime(darkStartTime),
    [darkStartTime]
  )
  const darkEndMinutes = React.useMemo(
    () => parseTime(darkEndTime),
    [darkEndTime]
  )

  const [currentTime, setCurrentTime] = React.useState(() =>
    getCurrentTimeInMinutes()
  )

  React.useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeInMinutes())
    }

    const interval = setInterval(updateTime, checkInterval)
    return () => clearInterval(interval)
  }, [checkInterval])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPref(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const isScheduleActive = React.useMemo(
    () => isTimeInRange(currentTime, darkStartMinutes, darkEndMinutes),
    [currentTime, darkStartMinutes, darkEndMinutes]
  )

  const effectiveTheme = React.useMemo((): "light" | "dark" | "system" => {
    if (manualOverride !== null) {
      if (manualOverride === "system") {
        return fallbackToSystem ? "system" : "light"
      }
      return manualOverride
    }

    if (isScheduleActive) {
      return "dark"
    }

    if (fallbackToSystem) {
      return "system"
    }

    return "light"
  }, [manualOverride, isScheduleActive, fallbackToSystem])

  const timeUntilSwitch = React.useMemo(() => {
    if (manualOverride !== null) return null
    return getTimeUntilNextSwitch(currentTime, darkStartMinutes, darkEndMinutes)
  }, [currentTime, darkStartMinutes, darkEndMinutes, manualOverride])

  const applyTheme = React.useCallback(
    (theme: "light" | "dark" | "system") => {
      const actualTheme =
        theme === "system" && fallbackToSystem
          ? systemPref
          : theme === "system"
            ? "light"
            : theme

      if (customSetTheme) {
        if (theme === "system" && fallbackToSystem) {
          customSetTheme("system")
        } else {
          customSetTheme(actualTheme)
        }
        return
      }

      if (typeof window === "undefined") return

      const root = document.documentElement

      if (smoothTransition) {
        root.style.transition = "background-color 0.3s ease, color 0.3s ease"
      } else {
        root.style.transition = ""
      }

      if (actualTheme === "dark") {
        root.classList.add("dark")
        root.classList.remove("light")
      } else {
        root.classList.add("light")
        root.classList.remove("dark")
      }
    },
    [customSetTheme, smoothTransition, fallbackToSystem, systemPref]
  )

  React.useEffect(() => {
    if (manualOverride === null) {
      applyTheme(effectiveTheme)
    }
  }, [effectiveTheme, manualOverride, applyTheme])

  const setTheme = React.useCallback(
    (theme: "light" | "dark" | "system") => {
      setManualOverride(theme)
      applyTheme(theme)
    },
    [applyTheme]
  )

  const reset = React.useCallback(() => {
    setManualOverride(null)
  }, [])

  const isDarkMode = React.useMemo(() => {
    if (effectiveTheme === "dark") return true
    if (effectiveTheme === "system" && fallbackToSystem) {
      return systemPref === "dark"
    }
    return false
  }, [effectiveTheme, fallbackToSystem, systemPref])

  return {
    currentTheme: effectiveTheme,
    isDarkMode,
    isScheduleActive,
    timeUntilSwitch,
    setTheme,
    reset,
  }
}
