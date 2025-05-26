import * as React from "react"

interface TimeAgoOptions {
  interval?: number
  locale?: Intl.LocalesArgument
}

export function useTimeAgo(
  timestamp: Date | number | string,
  options?: TimeAgoOptions
): string {
  const { interval = 60_000, locale = "en" } = options || {}

  const formatTimeAgo = React.useCallback(() => {
    const now = new Date()
    const date = new Date(timestamp)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    const absSeconds = Math.abs(seconds)

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

    const ranges: [number, Intl.RelativeTimeFormatUnit][] = [
      [60, "second"],
      [60 * 60, "minute"],
      [60 * 60 * 24, "hour"],
      [60 * 60 * 24 * 7, "day"],
      [60 * 60 * 24 * 30, "week"],
      [60 * 60 * 24 * 365, "month"],
      [Infinity, "year"],
    ]

    for (let i = 0; i < ranges.length; i++) {
      const [limit, unit] = ranges[i]
      if (absSeconds < limit) {
        const value =
          i === 0 ? absSeconds : Math.floor(absSeconds / ranges[i - 1][0])
        return rtf.format(-Math.sign(seconds) * value, unit)
      }
    }

    return ""
  }, [timestamp, locale])

  const [timeAgo, setTimeAgo] = React.useState(formatTimeAgo)

  React.useEffect(() => {
    setTimeAgo(formatTimeAgo())

    const tick = () => setTimeAgo(formatTimeAgo())
    const id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [formatTimeAgo, interval, timestamp])

  return timeAgo
}
