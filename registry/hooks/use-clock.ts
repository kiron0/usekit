import * as React from "react"

interface Options {
  locale?: string | string[]
  formatOptions?: Intl.DateTimeFormatOptions
  interval?: number
  enabled?: boolean
}

export function useClock(options?: Options): string {
  const {
    locale = "en-US",
    formatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    },
    interval = 1000,
    enabled = true,
  } = options || {}

  const getFormattedTime = React.useCallback(() => {
    return new Intl.DateTimeFormat(locale, formatOptions).format(new Date())
  }, [locale, formatOptions])

  const [time, setTime] = React.useState<string>(getFormattedTime)

  React.useEffect(() => {
    if (!enabled) return

    setTime(getFormattedTime())

    const timer = setInterval(() => {
      setTime(getFormattedTime())
    }, interval)

    return () => clearInterval(timer)
  }, [getFormattedTime, interval, enabled])

  return time
}
