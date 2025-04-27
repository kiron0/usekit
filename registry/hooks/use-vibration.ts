import * as React from "react"

type Pattern = number | number[]

interface Options {
  loop?: boolean
}

interface Return {
  vibrate: (pattern?: Pattern) => void
  stop: () => void
  isSupported: boolean
  isVibrating: boolean
}

export function useVibration(
  defaultPattern: Pattern = 100,
  options: Options = {}
): Return {
  const isSupported = React.useMemo(() => "vibrate" in navigator, [])

  const [isVibrating, setIsVibrating] = React.useState(false)

  const vibrate = React.useCallback(
    (pattern: Pattern = defaultPattern) => {
      if (!isSupported) return

      try {
        const normalizedPattern = Array.isArray(pattern)
          ? pattern.filter((n) => Number.isFinite(n) && n >= 0)
          : Number.isFinite(pattern) && pattern >= 0
            ? pattern
            : defaultPattern

        navigator.vibrate(
          options.loop
            ? Array(100).fill(normalizedPattern).flat()
            : normalizedPattern
        )

        if (!options.loop) {
          setTimeout(
            () => setIsVibrating(false),
            Array.isArray(normalizedPattern)
              ? normalizedPattern.reduce((a, b) => a + b, 0)
              : normalizedPattern
          )
        }

        setIsVibrating(true)
      } catch (error) {
        console.error("Vibration failed:", error)
      }
    },
    [isSupported, defaultPattern, options.loop]
  )

  const stop = React.useCallback(() => {
    if (!isSupported) return

    navigator.vibrate(0)
    setIsVibrating(false)
  }, [isSupported])

  return { vibrate, stop, isSupported, isVibrating }
}
